// PromptForge v3 - GPT Test API  
// Test prompt pe model real cu scoring și gating Pro

import { NextRequest, NextResponse } from 'next/server';
import { chatPromptTest, evaluatePrompt, autoTightenPrompt, calculateCost } from '@/lib/openai';
import { validateSevenDMiddleware, getScoringThresholds } from '@/lib/ruleset';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

// Verifică entitlements pentru org
async function getEntitlements(orgId: string): Promise<Record<string, boolean>> {
  const { data, error } = await supabase
    .from('entitlements')
    .select('flag, value')
    .eq('org_id', orgId)
    .eq('value', true);

  if (error) throw error;

  const flags = Object.fromEntries(
    (data || []).map((r: any) => [r.flag, r.value])
  );
  
  return flags;
}

// Salvează run în telemetrie
async function startRun(params: {
  orgId: string;
  userId: string;
  moduleId: string;
  parameterSet: any;
}): Promise<string> {
  const { data, error } = await supabase
    .from('runs')
    .insert([{
      org_id: params.orgId,
      user_id: params.userId,
      module_id: params.moduleId,
      parameter_set_id: null,
      type: 'test',
      status: 'queued',
      telemetry: { parameter_set: params.parameterSet },
      started_at: new Date().toISOString()
    }])
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

// Finalizează run cu rezultate
async function finishRun(runId: string, updates: any): Promise<void> {
  const { error } = await supabase
    .from('runs')
    .update({
      ...updates,
      finished_at: new Date().toISOString()
    })
    .eq('id', runId);

  if (error) throw error;
}

// Salvează scoruri în prompt_scores
async function saveScores(runId: string, scores: any): Promise<void> {
  const { error } = await supabase
    .from('prompt_scores')
    .insert([{
      run_id: runId,
      clarity: scores.clarity,
      execution: scores.execution,
      ambiguity: scores.ambiguity,
      alignment: scores.business_fit, // mapping business_fit -> alignment
      business_fit: scores.business_fit,
      feedback: { 
        verdict: scores.verdict,
        composite: scores.composite,
        feedback: scores.feedback 
      }
    }]);

  if (error) throw error;
}

export async function POST(req: NextRequest) {
  let runId: string | null = null;
  
  try {
    const body = await req.json();
    const { orgId, userId, moduleId, sevenD, prompt } = body;

    // Validări de bază
    if (!orgId || !userId || !moduleId || !sevenD || !prompt) {
      return NextResponse.json(
        { error: 'Missing required fields: orgId, userId, moduleId, sevenD, prompt' },
        { status: 400 }
      );
    }

    // Validează 7D cu SSOT
    let normalized7D;
    try {
      normalized7D = validateSevenDMiddleware(sevenD);
    } catch (error) {
      return NextResponse.json(
        { 
          error: 'INVALID_7D',
          details: error instanceof Error ? error.message : 'Invalid 7D configuration'
        },
        { status: 400 }
      );
    }

    // Verifică entitlements - necesită canUseGptTestReal pentru Pro+
    const flags = await getEntitlements(orgId);
    if (!flags?.canUseGptTestReal) {
      return NextResponse.json(
        { 
          error: 'ENTITLEMENT_REQUIRED',
          upsell: 'pro_needed',
          message: 'GPT Test Real requires Pro plan or higher'
        },
        { status: 403 }
      );
    }

    // Verifică lungimea promptului
    if (prompt.length > 20000) {
      return NextResponse.json(
        { error: 'Prompt too long. Maximum 20,000 characters allowed.' },
        { status: 400 }
      );
    }

    // Creează run pentru telemetrie
    runId = await startRun({
      orgId,
      userId,
      moduleId,
      parameterSet: normalized7D
    });

    const overallStartTime = Date.now();

    // 1. Rulează promptul pe model real
    const testResponse = await chatPromptTest(prompt, normalized7D);
    
    // 2. Evaluează promptul
    let evaluation = await evaluatePrompt(prompt, normalized7D);
    
    // 3. Auto-tighten dacă nu trece threshold-ul (o singură dată)
    let finalPrompt = prompt;
    let wasOptimized = false;
    
    if (evaluation.verdict === 'fail') {
      const tightenResponse = await autoTightenPrompt(prompt, normalized7D);
      finalPrompt = tightenResponse.text;
      evaluation = await evaluatePrompt(finalPrompt, normalized7D);
      wasOptimized = true;
    }

    const totalDuration = Date.now() - overallStartTime;
    const estimatedCost = testResponse.usage ? calculateCost('gpt-4o', testResponse.usage) : 0;

    // Actualizează run cu rezultatele
    await finishRun(runId, {
      status: evaluation.verdict === 'fail' ? 'error' : 'success',
      model: 'gpt-4o',
      tokens_used: testResponse.usage?.total_tokens || 0,
      cost_usd: estimatedCost,
      duration_ms: totalDuration,
      telemetry: {
        verdict: evaluation.verdict,
        score_breakdown: evaluation,
        was_optimized: wasOptimized,
        policy_hits: [],
        domain: normalized7D.domain,
        output_format: normalized7D.output_format
      }
    });

    // Salvează scorurile
    await saveScores(runId, evaluation);

    // Obține thresholds din SSOT
    const thresholds = getScoringThresholds();

    return NextResponse.json({
      runId,
      verdict: evaluation.verdict,
      score: evaluation.composite,
      passed: evaluation.verdict !== 'fail',
      breakdown: {
        clarity: evaluation.clarity,
        execution: evaluation.execution,
        ambiguity: evaluation.ambiguity,
        business_fit: evaluation.business_fit,
        composite: evaluation.composite
      },
      thresholds,
      prompt: finalPrompt,
      wasOptimized,
      modelResponse: testResponse.text,
      usage: {
        ...testResponse.usage,
        duration_ms: totalDuration,
        estimated_cost_usd: estimatedCost
      },
      feedback: evaluation.feedback,
      meta: {
        domain: normalized7D.domain,
        output_format: normalized7D.output_format,
        signature: `${normalized7D.domain}|${normalized7D.scale}|${normalized7D.application}|${normalized7D.output_format}`
      }
    });

  } catch (error) {
    console.error('GPT Test API error:', error);
    
    // Marchează run-ul ca failed dacă există
    if (runId) {
      try {
        await finishRun(runId, {
          status: 'error',
          telemetry: {
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        });
      } catch (updateError) {
        console.error('Failed to update run status:', updateError);
      }
    }

    if (error instanceof Error && error.message.includes('ENTITLEMENT_REQUIRED')) {
      return NextResponse.json(
        { 
          error: 'ENTITLEMENT_REQUIRED',
          upsell: 'pro_needed',
          message: error.message
        },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'INTERNAL_ERROR',
        message: 'Failed to process GPT test'
      },
      { status: 500 }
    );
  }
}

// GET pentru health check
export async function GET() {
  return NextResponse.json({
    service: 'gpt-test',
    status: 'operational',
    version: '1.0.0',
    description: 'GPT test and scoring service (Pro+ required)',
    requirements: ['canUseGptTestReal entitlement']
  });
}