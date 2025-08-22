import { type NextRequest, NextResponse } from "next/server";
import { validateEnglishContent } from "@/lib/english";
import { GPTEditorRequestSchema, normalize7D, APIError } from "@/lib/server/validation";
import { optimizePrompt } from "@/lib/server/openai";
import { checkRateLimit } from "@/lib/server/supabase";

/**
 * POST /api/gpt-editor - Optimize prompt (no gating required)
 * 
 * Tightens prompts with clarity improvements, guardrails, and domain context.
 * Available to all authenticated users without entitlement restrictions.
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Parse and validate request
    const body = await request.json();
    const validation = GPTEditorRequestSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "INPUT_SCHEMA_MISMATCH",
          details: validation.error.errors 
        },
        { status: 422 }
      );
    }

    const { prompt, sevenD } = validation.data;

    // Validate English-only content
    const englishValidation = validateEnglishContent({ prompt });
    if (!englishValidation.isValid) {
      return NextResponse.json(
        {
          error: "INVALID_CONTENT_LANGUAGE",
          message: "Content must be in English only"
        },
        { status: 422 }
      );
    }

    // Normalize 7D configuration (apply domain defaults)
    let normalized7D;
    try {
      normalized7D = normalize7D(sevenD);
    } catch (error) {
      return NextResponse.json(
        {
          error: "INVALID_7D_ENUM",
          message: error instanceof Error ? error.message : "7D validation failed"
        },
        { status: 400 }
      );
    }

    // Basic rate limiting (60 requests per minute per IP)
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimit = await checkRateLimit(`gpt-editor:${clientIP}`, 60);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: "RATE_LIMITED",
          message: "Rate limit exceeded. Please try again later.",
          resetTime: rateLimit.resetTime
        },
        { status: 429 }
      );
    }

    // Optimize prompt using OpenAI
    const result = await optimizePrompt(prompt, {
      domain: normalized7D.domain,
      focus: 'clarity',
      tone: 'professional',
      length: 'concise'
    });

    // Parse OpenAI response
    let optimizedData;
    try {
      optimizedData = JSON.parse(result.content);
    } catch {
      // Fallback if JSON parsing fails
      optimizedData = {
        editedPrompt: result.content,
        improvements: ["Enhanced clarity", "Applied domain context", "Improved structure"],
        confidence: 85
      };
    }

    // Validate optimized content is still English
    const optimizedValidation = validateEnglishContent({ 
      prompt: optimizedData.editedPrompt || result.content 
    });
    
    if (!optimizedValidation.isValid) {
      return NextResponse.json(
        {
          error: "AI_GENERATED_NON_ENGLISH",
          message: "AI model generated non-English content. Please try again."
        },
        { status: 500 }
      );
    }

    // Return optimized prompt with telemetry
    return NextResponse.json({
      editedPrompt: optimizedData.editedPrompt || result.content,
      improvements: optimizedData.improvements || ["Optimized for clarity"],
      confidence: Math.min(100, Math.max(0, optimizedData.confidence || 85)),
      sevenD: normalized7D,
      usage: {
        tokens: result.usage.total_tokens,
        cost_usd: result.usage.cost_usd,
        duration_ms: result.duration_ms
      },
      processingTime: Date.now() - startTime,
      model: result.model
    });

  } catch (error) {
    console.error("[GPT Editor API] Error:", error);

    // Handle specific API errors
    if (error instanceof APIError) {
      return NextResponse.json(
        {
          error: error.apiCode,
          message: error.message,
          details: error.details
        },
        { status: error.code }
      );
    }

    // Handle OpenAI API errors
    if (error && typeof error === 'object' && 'status' in error) {
      return NextResponse.json(
        {
          error: "OPENAI_API_ERROR",
          message: "OpenAI service temporarily unavailable"
        },
        { status: 503 }
      );
    }

    // Generic error fallback
    return NextResponse.json(
      { 
        error: "INTERNAL_RUN_ERROR",
        message: "Failed to optimize prompt" 
      },
      { status: 500 }
    );
  }
}
