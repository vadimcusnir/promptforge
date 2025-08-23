import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { withEntitlementGate } from '@/lib/gating';
import { testPromptLive } from '@/lib/ai/tester';
import { evaluatePrompt } from '@/lib/ai/evaluator';
import { logEvent } from '@/lib/telemetry';

// Request schema for live prompt testing
const TestRequestSchema = z.object({
  content: z.string().min(10).max(15000),
  domain: z.enum([
    'saas',
    'fintech',
    'ecommerce',
    'consulting',
    'education',
    'healthcare',
    'legal',
    'marketing',
    'media',
    'real_estate',
    'hr',
    'ngo',
    'government',
    'web3',
    'aiml',
    'cybersecurity',
    'manufacturing',
    'logistics',
    'travel',
    'gaming',
    'fashion',
    'beauty',
    'spiritual',
    'architecture',
    'agriculture',
  ]),
  test_scenarios: z
    .array(
      z.object({
        name: z.string(),
        input: z.string(),
        expected_outcome: z.string().optional(),
      })
    )
    .max(5)
    .optional(),
  evaluation_focus: z
    .array(z.enum(['clarity', 'execution', 'ambiguity', 'businessFit', 'safety', 'compliance']))
    .optional(),
  model_config: z
    .object({
      temperature: z.number().min(0).max(2).default(0.4),
      max_tokens: z.number().min(100).max(4000).default(2000),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Parse and validate request
    const body = await request.json();
    const validatedInput = TestRequestSchema.parse(body);

    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get user's org
    const { data: orgMember } = await supabase
      .from('org_members')
      .select('org_id')
      .eq('user_id', user.id)
      .single();

    if (!orgMember) {
      return NextResponse.json(
        { error: 'User not associated with any organization' },
        { status: 403 }
      );
    }

    // Check entitlements - live testing requires Pro+
    await withEntitlementGate(orgMember.org_id, ['canUseGptTestReal'], async () => {
      // Entitlement verified
    });

    // Rate limiting for testing API
    const rateLimitCount = await checkRateLimit(); // 20 tests per hour per org

    if (rateLimitCount > 20) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Pro plan allows 20 tests per hour.' },
        { status: 429 }
      );
    }

    // Generate test ID for tracking
    const testId = crypto.randomUUID();

    // Run live test scenarios
    const testResults = [];
    let totalTokensUsed = 0;
    let totalCost = 0;

    if (validatedInput.test_scenarios && validatedInput.test_scenarios.length > 0) {
      // Test with provided scenarios
      for (const scenario of validatedInput.test_scenarios) {
        const scenarioStart = Date.now();

        const testResult = await testPromptLive(
          validatedInput.content,
          scenario.input,
          scenario.expected_outcome,
          validatedInput.model_config
        );

        const scenarioTime = Date.now() - scenarioStart;

        testResults.push({
          scenario_name: scenario.name,
          scenario_input: scenario.input,
          expected_outcome: scenario.expected_outcome,
          actual_output: testResult.output,
          success: testResult.success,
          execution_time_ms: scenarioTime,
          tokens_used: testResult.tokensUsed,
          cost_usd: testResult.cost,
        });

        totalTokensUsed += testResult.tokensUsed;
        totalCost += testResult.cost;
      }
    } else {
      // Generate default test scenarios based on domain
      const defaultScenarios = await generateDefaultScenarios(validatedInput.domain);

      for (const scenario of defaultScenarios.slice(0, 3)) {
        // Max 3 default scenarios
        const scenarioStart = Date.now();

        const testResult = await testPromptLive(
          validatedInput.content,
          scenario.input,
          undefined,
          validatedInput.model_config
        );

        const scenarioTime = Date.now() - scenarioStart;

        testResults.push({
          scenario_name: scenario.name,
          scenario_input: scenario.input,
          actual_output: testResult.output,
          success: testResult.success,
          execution_time_ms: scenarioTime,
          tokens_used: testResult.tokensUsed,
          cost_usd: testResult.cost,
        });

        totalTokensUsed += testResult.tokensUsed;
        totalCost += testResult.cost;
      }
    }

    // Evaluate prompt quality
    const evaluationStart = Date.now();
    const evaluation = await evaluatePrompt(validatedInput.content, validatedInput.domain, {
      focusAreas: validatedInput.evaluation_focus,
    });
    const evaluationTime = Date.now() - evaluationStart;

    // Calculate overall test success rate
    const successfulTests = testResults.filter(r => r.success).length;
    const successRate = testResults.length > 0 ? (successfulTests / testResults.length) * 100 : 0;

    // Check DoD (Definition of Done) threshold - minimum 80% for production readiness
    const dodThreshold = 80;
    const meetsDoD = successRate >= dodThreshold;

    // Generate recommendations based on results and DoD status
    const recommendations = generateRecommendations(
      testResults,
      evaluation,
      successRate,
      dodThreshold
    );

    // Log test usage
    await logEvent({
      event: 'gpt_test_live_used',
      orgId: orgMember.org_id,
      userId: user.id,
      payload: {
        test_id: testId,
        domain: validatedInput.domain,
        scenarios_count: testResults.length,
        success_rate: successRate,
        meets_dod: meetsDoD,
        total_tokens: totalTokensUsed,
        total_cost_usd: totalCost,
        evaluation_scores: evaluation.scores,
      },
    });

    const totalTime = Date.now() - startTime;

    return NextResponse.json({
      test_id: testId,
      prompt_content: validatedInput.content,
      domain: validatedInput.domain,
      test_results: testResults,
      evaluation: {
        scores: evaluation.scores,
        feedback: evaluation.feedback,
      },
      summary: {
        total_scenarios: testResults.length,
        successful_scenarios: successfulTests,
        success_rate_percent: Math.round(successRate),
        overall_verdict: successRate >= 80 ? 'PASS' : successRate >= 60 ? 'PARTIAL' : 'FAIL',
        meets_dod: meetsDoD,
        dod_threshold: dodThreshold,
        production_ready: meetsDoD,
      },
      recommendations,
      dod_analysis: {
        threshold: dodThreshold,
        current_score: Math.round(successRate),
        status: meetsDoD ? 'READY' : 'NEEDS_IMPROVEMENT',
        gap: Math.max(0, dodThreshold - successRate),
        next_steps: meetsDoD
          ? ['Prompt meets production standards', 'Ready for deployment']
          : [
              'Review and refine prompt based on recommendations',
              'Re-test after improvements',
              'Consider domain-specific adjustments',
            ],
      },
      telemetry: {
        total_execution_time_ms: totalTime,
        evaluation_time_ms: evaluationTime,
        total_tokens_used: totalTokensUsed,
        total_cost_usd: totalCost,
      },
      tested_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('GPT Test API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request format',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    if (
      error instanceof Error &&
      (error.message.includes('entitlement') || error.message.includes('plan'))
    ) {
      return NextResponse.json(
        {
          error: 'Live testing requires Pro plan or higher',
          upgrade_url: '/pricing#pro',
        },
        { status: 402 }
      );
    }

    if (error instanceof Error && error.message.includes('rate limit')) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET endpoint for test capabilities info
export async function GET() {
  try {
    return NextResponse.json({
      description: 'Live prompt testing with real GPT execution',
      entitlement_required: 'canUseGptTestReal (Pro+)',
      rate_limits: {
        tests_per_hour: 20,
        max_scenarios_per_test: 5,
      },
      supported_domains: [
        'saas',
        'fintech',
        'ecommerce',
        'consulting',
        'education',
        'healthcare',
        'legal',
        'marketing',
        'media',
        'real_estate',
        'hr',
        'ngo',
        'government',
        'web3',
        'aiml',
        'cybersecurity',
        'manufacturing',
        'logistics',
        'travel',
        'gaming',
        'fashion',
        'beauty',
        'spiritual',
        'architecture',
        'agriculture',
      ],
      evaluation_criteria: [
        'clarity',
        'execution',
        'ambiguity',
        'businessFit',
        'safety',
        'compliance',
      ],
      model_options: {
        temperature: { min: 0, max: 2, default: 0.4 },
        max_tokens: { min: 100, max: 4000, default: 2000 },
      },
    });
  } catch (error) {
    console.error('GPT Test GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper functions
async function generateDefaultScenarios(domain: string) {
  const scenarios = {
    saas: [
      { name: 'User Onboarding', input: 'New user just signed up, needs guidance' },
      { name: 'Feature Request', input: 'Customer asking about specific feature availability' },
      { name: 'Billing Issue', input: 'User has questions about their subscription' },
    ],
    ecommerce: [
      { name: 'Product Inquiry', input: 'Customer asking about product specifications' },
      { name: 'Order Status', input: 'Customer wants to track their order' },
      { name: 'Return Request', input: 'Customer wants to return a product' },
    ],
    consulting: [
      { name: 'Initial Assessment', input: 'Client seeking strategic advice for their business' },
      { name: 'Implementation Plan', input: 'Client needs detailed implementation roadmap' },
      { name: 'Progress Review', input: 'Client wants to review project progress' },
    ],
    // Add more domain-specific scenarios as needed
  };

  return (
    (scenarios as Record<string, Array<{ name: string; input: string }>>)[domain] || [
      { name: 'General Inquiry', input: 'User has a general question about the service' },
      { name: 'Problem Solving', input: 'User needs help solving a specific problem' },
      { name: 'Information Request', input: 'User is looking for specific information' },
    ]
  );
}

function generateRecommendations(
  testResults: Array<{ success: boolean; scenario_input?: string; actual_output?: string }>,
  evaluation: {
    scores: {
      clarity: number;
      ambiguity: number;
      execution: number;
      businessFit: number;
      safety: number;
    };
  },
  successRate: number,
  dodThreshold: number
): string[] {
  const recommendations = [];

  // Based on success rate and DoD threshold
  if (successRate < dodThreshold) {
    recommendations.push(
      `Prompt does not meet the ${dodThreshold}% Definition of Done (DoD) threshold. Current score: ${Math.round(successRate)}%.`
    );

    // Specific improvement suggestions based on gap
    const gap = dodThreshold - successRate;
    if (gap > 20) {
      recommendations.push('Significant improvements needed. Consider complete prompt redesign.');
    } else if (gap > 10) {
      recommendations.push('Moderate improvements needed. Focus on key failure points.');
    } else {
      recommendations.push('Minor improvements needed. Fine-tune existing prompt.');
    }
  }

  // Based on evaluation scores
  if (evaluation.scores.clarity < 75) {
    recommendations.push('Improve prompt clarity by being more specific and direct');
    recommendations.push('Add concrete examples and remove ambiguous language');
  }

  if (evaluation.scores.ambiguity > 25) {
    recommendations.push('Reduce ambiguity by eliminating vague language and unclear instructions');
    recommendations.push('Use precise terminology and avoid subjective terms');
  }

  if (evaluation.scores.execution < 80) {
    recommendations.push('Add more specific execution steps and clear action items');
    recommendations.push('Include expected outputs and success criteria');
  }

  if (evaluation.scores.businessFit < 70) {
    recommendations.push('Align prompt better with business objectives and target audience');
    recommendations.push('Consider industry-specific terminology and context');
  }

  if (evaluation.scores.safety < 75) {
    recommendations.push('Add safety guardrails and content filtering');
    recommendations.push('Include ethical considerations and compliance requirements');
  }

  // Based on test scenario failures
  const failedScenarios = testResults.filter(r => !r.success);
  if (failedScenarios.length > 0) {
    recommendations.push(`Focus on improving ${failedScenarios.length} failed test scenarios`);

    // Analyze common failure patterns
    const failurePatterns = analyzeFailurePatterns(failedScenarios);
    recommendations.push(...failurePatterns);
  }

  // Default recommendation if all good
  if (recommendations.length === 0) {
    recommendations.push('Prompt shows excellent performance across all test scenarios');
    recommendations.push('Ready for production deployment');
  }

  return recommendations;
}

// Helper function to analyze failure patterns
function analyzeFailurePatterns(
  failedScenarios: Array<{ success: boolean; scenario_input?: string; actual_output?: string }>
): string[] {
  const patterns = [];

  // Check for common input types that fail
  const inputTypes = failedScenarios.map(s => s.scenario_input?.toLowerCase() || '');
  const hasComplexInputs = inputTypes.some(
    input => input.includes('complex') || input.includes('edge case') || input.includes('unusual')
  );

  if (hasComplexInputs) {
    patterns.push(
      'Prompt struggles with complex or edge case inputs - consider adding fallback handling'
    );
  }

  // Check for output consistency issues
  const outputs = failedScenarios.map(s => s.actual_output);
  const hasInconsistentOutputs = outputs.some(
    output => !output || output.length < 10 || output.includes('error') || output.includes('cannot')
  );

  if (hasInconsistentOutputs) {
    patterns.push(
      'Output consistency issues detected - add output validation and formatting requirements'
    );
  }

  return patterns;
}

async function checkRateLimit(): Promise<number> {
  // Basic implementation - in production, use Redis
  return 0;
}
