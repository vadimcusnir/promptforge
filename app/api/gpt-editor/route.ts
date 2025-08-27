import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth/server-auth'
import { validateOrgMembership } from '@/lib/billing/entitlements'
import { createRateLimit, RATE_LIMITS, getClientIdentifier } from '@/lib/rate-limit'
import { logTelemetryEvent, hashUserId, generate7DSignature as generate7DSignatureTelemetry } from '@/lib/telemetry'
import { randomUUID } from 'crypto'

const editorRequestSchema = z.object({
  prompt: z.string().min(64, 'Prompt must be at least 64 characters').max(10000, 'Prompt too long'),
  sevenD: z.object({
    domain: z.string().optional(),
    scale: z.string().optional(),
    urgency: z.string().optional(),
    complexity: z.string().optional(),
    resources: z.string().optional(),
    application: z.string().optional(),
    outputFormat: z.string().optional()
  }).optional(),
  orgId: z.string().uuid('Valid organization ID required')
})

const editorResponseSchema = z.object({
  success: z.boolean(),
  editedPrompt: z.string().optional(),
  scores: z.object({
    clarity: z.number().min(0).max(100),
    specificity: z.number().min(0).max(100),
    completeness: z.number().min(0).max(100),
    overall: z.number().min(0).max(100)
  }).optional(),
  suggestions: z.array(z.string()).optional(),
  error: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth(request)
    
    // Apply rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimit = createRateLimit(RATE_LIMITS.AI_OPERATIONS);
    const rateLimitResult = rateLimit(clientId);

    // Parse request body
    const body = await request.json()
    const validation = editorRequestSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { prompt, sevenD, orgId } = validation.data

    // Validate organization membership
    const isMember = await validateOrgMembership(user.id, orgId)
    if (!isMember) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Access denied to organization',
          code: 'ACCESS_DENIED'
        },
        { status: 403 }
      )
    }

    // Process prompt optimization (no gating required)
    const optimizationResult = await optimizePrompt(prompt, sevenD)

    // Log telemetry event
    await logTelemetryEvent({
      event_type: 'gpt_test',
      operation: 'prompt_optimization',
      org_id: orgId,
      user_id_hash: hashUserId(user.id),
      run_id: randomUUID(),
      seven_d_signature: generate7DSignatureTelemetry({ prompt, sevenD, orgId }),
      performance: {
        tta_seconds: optimizationResult.processingTime / 1000,
        tokens_used: optimizationResult.tokenCount,
        model_used: 'gpt-4-optimizer',
        cost_estimate: optimizationResult.tokenCount * 0.00001,
        success: true
      },
      metadata: {
        promptLength: prompt.length,
        sevenD: sevenD || {},
        score: optimizationResult.scores.overall
      }
    })

    // Log usage for analytics
    await logEditorUsage(orgId, user.id, prompt.length, optimizationResult.scores.overall)

    // Create response with rate limiting headers
    const response = NextResponse.json({
      success: true,
      editedPrompt: optimizationResult.editedPrompt,
      scores: optimizationResult.scores,
      suggestions: optimizationResult.suggestions
    })

    // Add rate limiting headers
    response.headers.set('X-RateLimit-Limit', RATE_LIMITS.AI_OPERATIONS.maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
    response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.resetTime).toISOString())
    
    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

    return response

  } catch (error) {
    console.error('GPT Editor API error:', error)
    
    // Handle rate limiting errors specifically
    if (error instanceof Error && error.message.includes('Rate limit')) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded', message: error.message },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Optimize prompt with AI
async function optimizePrompt(
  prompt: string, 
  sevenD?: Record<string, string>
): Promise<{
  editedPrompt: string;
  scores: {
    clarity: number;
    specificity: number;
    completeness: number;
    overall: number;
  };
  suggestions: string[];
  processingTime: number;
  tokenCount: number;
}> {
  const startTime = Date.now()
  
  // In real implementation, this would call OpenAI API for prompt optimization
  await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate processing time
  
  // Analyze prompt quality and generate scores
  const scores = analyzePromptQuality(prompt, sevenD)
  
  // Generate optimized prompt
  const editedPrompt = generateOptimizedPrompt(prompt, sevenD, scores)
  
  // Generate improvement suggestions
  const suggestions = generateSuggestions(scores, prompt, editedPrompt)
  
  const processingTime = Date.now() - startTime
  const tokenCount = Math.ceil((prompt.length + editedPrompt.length) / 4)
  
  return {
    editedPrompt,
    scores,
    suggestions,
    processingTime,
    tokenCount
  }
}

// Analyze prompt quality and generate scores
function analyzePromptQuality(prompt: string, sevenD?: Record<string, string>): {
  clarity: number;
  specificity: number;
  completeness: number;
  overall: number;
} {
  let clarity = 70
  let specificity = 65
  let completeness = 75
  
  // Analyze prompt length
  if (prompt.length > 200) clarity += 10
  if (prompt.length > 500) clarity += 5
  
  // Analyze prompt structure
  if (prompt.includes('?')) specificity += 10
  if (prompt.includes(':')) specificity += 5
  if (prompt.includes('•') || prompt.includes('-')) completeness += 10
  
  // Analyze 7D parameters
  if (sevenD) {
    if (sevenD.domain) completeness += 5
    if (sevenD.scale) specificity += 5
    if (sevenD.urgency) clarity += 5
    if (sevenD.complexity) completeness += 5
    if (sevenD.resources) specificity += 5
    if (sevenD.application) clarity += 5
    if (sevenD.outputFormat) completeness += 5
  }
  
  // Cap scores at 100
  clarity = Math.min(100, clarity)
  specificity = Math.min(100, specificity)
  completeness = Math.min(100, completeness)
  
  // Calculate overall score
  const overall = Math.round((clarity + specificity + completeness) / 3)
  
  return { clarity, specificity, completeness, overall }
}

// Generate optimized prompt
function generateOptimizedPrompt(
  originalPrompt: string, 
  sevenD?: Record<string, string>,
  scores?: { clarity: number; specificity: number; completeness: number; overall: number }
): string {
  let optimized = originalPrompt
  
  // Add 7D context if provided
  if (sevenD) {
    const context = []
    if (sevenD.domain) context.push(`Domain: ${sevenD.domain}`)
    if (sevenD.scale) context.push(`Scale: ${sevenD.scale}`)
    if (sevenD.urgency) context.push(`Urgency: ${sevenD.urgency}`)
    if (sevenD.complexity) context.push(`Complexity: ${sevenD.complexity}`)
    if (sevenD.resources) context.push(`Resources: ${sevenD.resources}`)
    if (sevenD.application) context.push(`Application: ${sevenD.application}`)
    if (sevenD.outputFormat) context.push(`Output Format: ${sevenD.outputFormat}`)
    
    if (context.length > 0) {
      optimized = `Context:\n${context.join('\n')}\n\nPrompt:\n${originalPrompt}`
    }
  }
  
  // Improve prompt structure if score is low
  if (scores && scores.overall < 80) {
    if (!optimized.includes('?')) {
      optimized += '\n\nPlease provide a detailed response that addresses all aspects of this request.'
    }
    if (!optimized.includes(':')) {
      optimized = optimized.replace(/([.!?])\s+/g, '$1\n\n')
    }
  }
  
  return optimized
}

// Generate improvement suggestions
function generateSuggestions(
  scores: { clarity: number; specificity: number; completeness: number; overall: number },
  originalPrompt: string,
  editedPrompt: string
): string[] {
  const suggestions = []
  
  if (scores.clarity < 80) {
    suggestions.push('Consider adding more specific details to improve clarity')
  }
  
  if (scores.specificity < 80) {
    suggestions.push('Include concrete examples or requirements for better specificity')
  }
  
  if (scores.completeness < 80) {
    suggestions.push('Add missing context or constraints for completeness')
  }
  
  if (scores.overall < 80) {
    suggestions.push('Use the "Tighten Once" feature to automatically improve your prompt')
  }
  
  if (suggestions.length === 0) {
    suggestions.push('Your prompt is well-structured and ready for use')
  }
  
  return suggestions
}

// Log editor usage for analytics
async function logEditorUsage(
  orgId: string, 
  userId: string, 
  promptLength: number,
  score: number
) {
  try {
    // In real implementation, this would log to database
    console.log(`Editor usage logged: orgId=${orgId}, userId=${userId}, promptLength=${promptLength}, score=${score}`)
  } catch (error) {
    console.error('Failed to log editor usage:', error)
  }
}
