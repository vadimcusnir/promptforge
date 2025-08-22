import { type NextRequest, NextResponse } from "next/server";
import { validateEnglishContent } from "@/lib/english";
import { GPTEditorRequestSchema, normalize7D } from "@/lib/server/validation";
import { optimizePrompt } from "@/lib/server/openai";
import { checkRateLimit } from "@/lib/server/supabase";
import { 
  createErrorResponse, 
  createValidationErrorResponse, 
  createRateLimitResponse,
  createSuccessResponse,
  create7DErrorResponse,
  withErrorHandler 
} from "@/lib/server/errors";

/**
 * POST /api/gpt-editor - Optimize prompt (no gating required)
 * 
 * Tightens prompts with clarity improvements, guardrails, and domain context.
 * Available to all authenticated users without entitlement restrictions.
 */
const _POST = async (request: NextRequest) => {
  const startTime = Date.now();

  // Parse and validate request
  const body = await request.json();
  const validation = GPTEditorRequestSchema.safeParse(body);
  
  if (!validation.success) {
    return createValidationErrorResponse(validation.error);
  }

  const { prompt, sevenD } = validation.data;

  // Validate English-only content
  const englishValidation = validateEnglishContent({ prompt });
  if (!englishValidation.isValid) {
    return createErrorResponse('INVALID_CONTENT_LANGUAGE');
  }

  // Normalize 7D configuration (apply domain defaults)
  let normalized7D;
  try {
    normalized7D = normalize7D(sevenD);
  } catch (error) {
    if (error instanceof Error && error.message.includes('INVALID_7D_ENUM:')) {
      const field = error.message.split(':')[1];
      return create7DErrorResponse(field);
    }
    return createErrorResponse('INVALID_7D_ENUM');
  }

  // Basic rate limiting (60 requests per minute per IP)
  const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
  const rateLimit = await checkRateLimit(`gpt-editor:${clientIP}`, 60);
  
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.remaining, rateLimit.resetTime);
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
    return createErrorResponse('OPENAI_API_ERROR', null, 'AI model generated non-English content');
  }

  // Return optimized prompt with telemetry
  return createSuccessResponse({
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
};

// Export with error handler wrapper
export const POST = withErrorHandler(_POST);
