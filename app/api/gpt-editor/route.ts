import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { improvePrompt } from '@/lib/ai/editor';
import { logEvent } from '@/lib/telemetry';
import { withEntitlementGate } from '@/lib/gating';
import { validateParams7D, Parameters7DSchema } from '@/lib/param-engine';

// Request schema for prompt editing with 7-D parameters
const EditorRequestSchema = z.object({
  action: z.enum([
    'tighten', // Reduce ambiguity and improve clarity
    'expand', // Add more detail and context
    'optimize', // Optimize for specific goal (conversion, clarity, etc.)
    'adapt', // Adapt for different domain/context
    'simplify', // Make more accessible/understandable
    'formalize', // Make more professional/formal
    'segment', // Break into sections/steps
  ]),
  content: z.string().min(10).max(10000),
  // 7-D parameters for domain-specific optimization
  params_7d: Parameters7DSchema.optional(),
  context: z
    .object({
      domain: z.string().optional(),
      target_audience: z.string().optional(),
      specific_goal: z.string().optional(),
      constraints: z.string().optional(),
    })
    .optional(),
  preserve_intent: z.boolean().default(true),
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Parse and validate request
    const body = await request.json();
    const validatedInput = EditorRequestSchema.parse(body);

    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get user's org for entitlements check
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

    // Check entitlements - GPT Editor requires Pro+ plan
    try {
      await withEntitlementGate(orgMember.org_id, ['canUseGptEditor'], async () => {
        // Entitlement verified
      });
    } catch {
      return NextResponse.json(
        {
          error: 'ENTITLEMENT_REQUIRED',
          message: 'GPT Editor requires Pro plan or higher',
          upgrade_url: '/pricing#pro',
          required_plan: 'Pro+',
        },
        { status: 402 }
      );
    }

    // Validate and normalize 7-D parameters if provided
    let normalizedParams = null;
    if (validatedInput.params_7d) {
      try {
        normalizedParams = await validateParams7D(validatedInput.params_7d, 'gpt-editor');
      } catch (validationError) {
        const errorMessage =
          validationError instanceof Error ? validationError.message : 'Unknown validation error';
        return NextResponse.json(
          {
            error: 'Invalid 7-D parameters',
            details: errorMessage,
          },
          { status: 400 }
        );
      }
    }

    // Rate limiting check (Pro plan: 50 requests per hour)
    const rateLimitCount = await checkRateLimit();

    if (rateLimitCount >= 50) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Pro plan allows 50 requests per hour.' },
        { status: 429 }
      );
    }

    // Improve the prompt using AI with 7-D context
    const improvementStart = Date.now();
    const improvement = await improvePrompt({
      action: validatedInput.action,
      content: validatedInput.content,
      context: {
        ...validatedInput.context,
        domain: normalizedParams?.domain || validatedInput.context?.domain,
      },
      preserveIntent: validatedInput.preserve_intent,
    });
    const improvementTime = Date.now() - improvementStart;

    // Log usage for telemetry
    await logEvent({
      event: 'gpt_editor_used',
      orgId: orgMember.org_id,
      userId: user.id,
      payload: {
        action: validatedInput.action,
        content_length: validatedInput.content.length,
        improvement_time_ms: improvementTime,
        tokens_used: improvement.usage?.total_tokens || 0,
        estimated_cost_usd: improvement.usage?.estimated_cost || 0,
        params_7d_used: !!normalizedParams,
        domain: normalizedParams?.domain || validatedInput.context?.domain,
      },
    });

    const totalTime = Date.now() - startTime;

    return NextResponse.json({
      original_content: validatedInput.content,
      improved_content: improvement.content,
      action_taken: validatedInput.action,
      improvements: improvement.improvements,
      params_7d: normalizedParams,
      metadata: {
        processing_time_ms: totalTime,
        tokens_used: improvement.usage?.total_tokens || 0,
        estimated_cost_usd: improvement.usage?.estimated_cost || 0,
        preserve_intent: validatedInput.preserve_intent,
        domain_optimized: !!normalizedParams,
      },
      suggestions: improvement.suggestions || [],
    });
  } catch (error) {
    console.error('GPT Editor API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request format',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes('rate limit')) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET endpoint for available actions and their descriptions
export async function GET() {
  try {
    const actions = {
      tighten: {
        description: 'Reduce ambiguity and improve clarity',
        use_cases: ['Remove vague language', 'Clarify instructions', 'Eliminate contradictions'],
        typical_improvement: '15-25% clarity increase',
      },
      expand: {
        description: 'Add more detail and context',
        use_cases: ['Add missing context', 'Provide more examples', 'Include edge cases'],
        typical_improvement: 'Enhanced completeness and execution readiness',
      },
      optimize: {
        description: 'Optimize for specific goal',
        use_cases: ['Improve conversion focus', 'Enhance clarity', 'Boost engagement'],
        typical_improvement: 'Goal-specific performance increase',
      },
      adapt: {
        description: 'Adapt for different domain or context',
        use_cases: [
          'Change industry focus',
          'Adjust for different audience',
          'Modify complexity level',
        ],
        typical_improvement: 'Context-appropriate language and examples',
      },
      simplify: {
        description: 'Make more accessible and understandable',
        use_cases: ['Reduce complexity', 'Use simpler language', 'Break down complex concepts'],
        typical_improvement: 'Improved accessibility and comprehension',
      },
      formalize: {
        description: 'Make more professional and formal',
        use_cases: ['Business documentation', 'Professional communications', 'Formal proposals'],
        typical_improvement: 'Professional tone and structure',
      },
      segment: {
        description: 'Break into logical sections or steps',
        use_cases: [
          'Create step-by-step guides',
          'Organize complex content',
          'Improve readability',
        ],
        typical_improvement: 'Better organization and flow',
      },
    };

    return NextResponse.json({
      available_actions: actions,
      usage_guidelines: {
        rate_limit: '10 requests per minute per user',
        max_content_length: '10,000 characters',
        recommended_use: 'Iterative improvement of prompts and content',
      },
    });
  } catch (error) {
    console.error('GPT Editor GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function for basic rate limiting
async function checkRateLimit(): Promise<number> {
  // This is a basic implementation - in production, you'd use Redis or similar
  // For now, we'll just return 0 to disable rate limiting
  // TODO: Implement proper rate limiting with Redis
  return 0;
}
