// PromptForge v3 - GPT Editor API
// Optimizează prompturi în editor (fără gating Pro)

import { NextRequest, NextResponse } from 'next/server';
import { chatPromptEditor } from '@/lib/openai';
import { validateSevenDMiddleware } from '@/lib/ruleset';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orgId, userId, moduleId, promptDraft, sevenD } = body;

    // Validări de bază
    if (!orgId || !userId || !moduleId || !promptDraft || !sevenD) {
      return NextResponse.json(
        { error: 'Missing required fields: orgId, userId, moduleId, promptDraft, sevenD' },
        { status: 400 }
      );
    }

    // Validează și normalizează 7D cu SSOT
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

    // Verifică lungimea promptului
    if (promptDraft.length > 10000) {
      return NextResponse.json(
        { error: 'Prompt too long. Maximum 10,000 characters allowed.' },
        { status: 400 }
      );
    }

    // Rulează optimizarea cu GPT
    const startTime = Date.now();
    const response = await chatPromptEditor(promptDraft, normalized7D);
    const totalDuration = Date.now() - startTime;

    // Log pentru telemetrie (fără PII)
    console.log({
      type: 'gpt_editor',
      org_id: orgId,
      user_id: userId,
      module_id: moduleId,
      domain: normalized7D.domain,
      duration_ms: totalDuration,
      tokens_used: response.usage?.total_tokens || 0,
      prompt_length: promptDraft.length,
      output_length: response.text.length
    });

    return NextResponse.json({
      promptEdited: response.text,
      usage: {
        ...response.usage,
        duration_ms: totalDuration
      },
      meta: {
        original_length: promptDraft.length,
        edited_length: response.text.length,
        domain: normalized7D.domain,
        output_format: normalized7D.output_format
      }
    });

  } catch (error) {
    console.error('GPT Editor API error:', error);
    
    return NextResponse.json(
      { 
        error: 'INTERNAL_ERROR',
        message: 'Failed to process prompt optimization'
      },
      { status: 500 }
    );
  }
}

// GET pentru health check
export async function GET() {
  return NextResponse.json({
    service: 'gpt-editor',
    status: 'operational',
    version: '1.0.0',
    description: 'Prompt optimization service'
  });
}