import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { logTelemetryEvent, hashUserId, generate7DSignature as generate7DSignatureTelemetry } from '@/lib/telemetry'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'
import { requireAuth } from '@/lib/auth/server-auth'
import { validateOrgMembership } from '@/lib/billing/entitlements'
import { getEffectiveEntitlements } from '@/lib/billing/entitlements'
import { ENTITLEMENT_ERROR_CODES } from '@/lib/entitlements/types'

const testRequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  testType: z.enum(['mock', 'real']).default('mock'),
  orgId: z.string().uuid('Valid organization ID required'),
  sevenD: z.object({
    domain: z.string().optional(),
    scale: z.string().optional(),
    urgency: z.string().optional(),
    complexity: z.string().optional(),
    resources: z.string().optional(),
    application: z.string().optional(),
    outputFormat: z.string().optional()
  }).optional(),
  options: z.object({
    model: z.string().optional(),
    temperature: z.number().min(0).max(2).optional(),
    maxTokens: z.number().min(1).max(4000).optional(),
    autoTighten: z.boolean().optional().default(false)
  }).optional()
})

const testResponseSchema = z.object({
  success: z.boolean(),
  result: z.object({
    response: z.string(),
    model: z.string(),
    scores: z.object({
      clarity: z.number().min(0).max(100),
      specificity: z.number().min(0).max(100),
      completeness: z.number().min(0).max(100),
      relevance: z.number().min(0).max(100),
      overall: z.number().min(0).max(100)
    }),
    breakdown: z.object({
      strengths: z.array(z.string()),
      weaknesses: z.array(z.string()),
      recommendations: z.array(z.string())
    }),
    verdict: z.enum(['pass', 'fail', 'needs_improvement']),
    tightenedPrompt: z.string().optional(),
    usage: z.object({
      promptTokens: z.number(),
      completionTokens: z.number(),
      totalTokens: z.number()
    }),
    latency: z.number(),
    testType: z.string()
  }).optional(),
  error: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth(request)
    
    // Parse request body
    const body = await request.json()
    const validation = testRequestSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { prompt, testType, orgId, sevenD, options } = validation.data

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

    // Check entitlements for real GPT testing
    if (testType === 'real') {
      const entitlements = await getEffectiveEntitlements(orgId)
      
      if (!entitlements.canUseGptTestReal) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'ENTITLEMENT_REQUIRED', 
            message: 'Real GPT testing requires Pro plan or higher',
            code: ENTITLEMENT_ERROR_CODES.ENTITLEMENT_REQUIRED,
            requiredPlan: 'pro',
            currentPlan: 'pilot' // This would come from user's actual plan
          },
          { status: 403 }
        )
      }
    }

    // Process the test
    const result = await processGPTTest(prompt, testType, sevenD, options)

    // Auto-tighten if score < 80 and autoTighten is enabled
    let tightenedPrompt: string | undefined
    if (options?.autoTighten && result.scores.overall < 80) {
      tightenedPrompt = await autoTightenPrompt(prompt, result.scores, sevenD)
      result.tightenedPrompt = tightenedPrompt
    }

    // Log telemetry event
    await logTelemetryEvent({
      event_type: 'gpt_test',
      operation: `gpt_test_${testType}`,
      org_id: orgId,
      user_id_hash: hashUserId(user.id),
      run_id: randomUUID(),
      seven_d_signature: generate7DSignatureTelemetry({ prompt, testType, orgId, sevenD }),
      performance: {
        tta_seconds: result.latency / 1000,
        tokens_used: result.usage.totalTokens,
        model_used: result.model,
        cost_estimate: result.usage.totalTokens * 0.00002, // Rough estimate
        success: true
      },
      metadata: {
        testType,
        promptLength: prompt.length,
        sevenD: sevenD || {},
        scores: result.scores,
        verdict: result.verdict,
        autoTighten: options?.autoTighten || false
      }
    })

    // Log usage for analytics
    await logTestUsage(orgId, user.id, testType, result.usage.totalTokens, result.scores.overall)

    return NextResponse.json({
      success: true,
      result
    })

  } catch (error) {
    console.error('GPT Test API error:', error)
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Process GPT test (mock or real)
async function processGPTTest(
  prompt: string, 
  testType: 'mock' | 'real', 
  sevenD?: Record<string, string>,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    autoTighten?: boolean;
  }
): Promise<{
  response: string;
  model: string;
  scores: {
    clarity: number;
    specificity: number;
    completeness: number;
    relevance: number;
    overall: number;
  };
  breakdown: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  verdict: 'pass' | 'fail' | 'needs_improvement';
  tightenedPrompt?: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latency: number;
  testType: string;
}> {
  const startTime = Date.now()
  
  if (testType === 'mock') {
    // Mock response for development/testing
    await new Promise(resolve => setTimeout(resolve, 800)) // Simulate latency
    
    const mockResponse = generateMockResponse(prompt)
    const scores = analyzePromptQuality(prompt, sevenD)
    const breakdown = generateBreakdown(scores, prompt)
    const verdict = scores.overall >= 80 ? 'pass' : scores.overall >= 60 ? 'needs_improvement' : 'fail'
    const latency = Date.now() - startTime
    
    return {
      response: mockResponse,
      model: 'gpt-4-mock',
      scores,
      breakdown,
      verdict,
      usage: {
        promptTokens: Math.ceil(prompt.length / 4),
        completionTokens: Math.ceil(mockResponse.length / 4),
        totalTokens: Math.ceil((prompt.length + mockResponse.length) / 4)
      },
      latency,
      testType: 'mock'
    }
  } else {
    // Real GPT API call
    // In real implementation, this would call OpenAI API
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API latency
    
    const realResponse = await callRealGPT(prompt, options)
    const scores = analyzePromptQuality(prompt, sevenD)
    const breakdown = generateBreakdown(scores, prompt)
    const verdict = scores.overall >= 80 ? 'pass' : scores.overall >= 60 ? 'needs_improvement' : 'fail'
    const latency = Date.now() - startTime
    
    return {
      response: realResponse,
      model: options?.model || 'gpt-4',
      scores,
      breakdown,
      verdict,
      usage: {
        promptTokens: Math.ceil(prompt.length / 4),
        completionTokens: Math.ceil(realResponse.length / 4),
        totalTokens: Math.ceil((prompt.length + realResponse.length) / 4)
      },
      latency,
      testType: 'real'
    }
  }
}

// Analyze prompt quality and generate scores
function analyzePromptQuality(prompt: string, sevenD?: Record<string, string>): {
  clarity: number;
  specificity: number;
  completeness: number;
  relevance: number;
  overall: number;
} {
  let clarity = 70
  let specificity = 65
  let completeness = 75
  let relevance = 80
  
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
  relevance = Math.min(100, relevance)
  
  // Calculate overall score
  const overall = Math.round((clarity + specificity + completeness + relevance) / 4)
  
  return { clarity, specificity, completeness, relevance, overall }
}

// Generate breakdown analysis
function generateBreakdown(
  scores: { clarity: number; specificity: number; completeness: number; relevance: number; overall: number },
  prompt: string
): {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
} {
  const strengths: string[] = []
  const weaknesses: string[] = []
  const recommendations: string[] = []
  
  // Analyze strengths
  if (scores.clarity >= 80) strengths.push('Clear and well-structured prompt')
  if (scores.specificity >= 80) strengths.push('Specific requirements and constraints')
  if (scores.completeness >= 80) strengths.push('Comprehensive context provided')
  if (scores.relevance >= 80) strengths.push('Relevant to the intended outcome')
  
  // Analyze weaknesses
  if (scores.clarity < 70) weaknesses.push('Prompt could be clearer and more structured')
  if (scores.specificity < 70) weaknesses.push('Lacks specific details and examples')
  if (scores.completeness < 70) weaknesses.push('Missing important context or constraints')
  if (scores.relevance < 70) weaknesses.push('May not fully address the intended goal')
  
  // Generate recommendations
  if (scores.clarity < 80) {
    recommendations.push('Break down complex requests into smaller, clearer parts')
  }
  if (scores.specificity < 80) {
    recommendations.push('Add concrete examples and specific requirements')
  }
  if (scores.completeness < 80) {
    recommendations.push('Include domain context, scale, and output format')
  }
  if (scores.overall < 80) {
    recommendations.push('Use "Tighten Once" to automatically improve your prompt')
  }
  
  // Default strengths if none identified
  if (strengths.length === 0) {
    strengths.push('Prompt provides a starting point for the request')
  }
  
  return { strengths, weaknesses, recommendations }
}

// Auto-tighten prompt if score is low
async function autoTightenPrompt(
  originalPrompt: string,
  scores: { clarity: number; specificity: number; completeness: number; relevance: number; overall: number },
  sevenD?: Record<string, string>
): Promise<string> {
  let tightened = originalPrompt
  
  // Add 7D context if missing
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
      tightened = `Context:\n${context.join('\n')}\n\nPrompt:\n${originalPrompt}`
    }
  }
  
  // Improve clarity
  if (scores.clarity < 80) {
    if (!tightened.includes('?')) {
      tightened += '\n\nPlease provide a detailed response that addresses all aspects of this request.'
    }
    if (!tightened.includes(':')) {
      tightened = tightened.replace(/([.!?])\s+/g, '$1\n\n')
    }
  }
  
  // Improve specificity
  if (scores.specificity < 80) {
    if (!tightened.includes('example') && !tightened.includes('specific')) {
      tightened += '\n\nPlease include specific examples and concrete details in your response.'
    }
  }
  
  // Improve completeness
  if (scores.completeness < 80) {
    if (!tightened.includes('constraints') && !tightened.includes('limitations')) {
      tightened += '\n\nPlease consider any constraints or limitations that might affect the response.'
    }
  }
  
  return tightened
}

// Generate mock response for development
function generateMockResponse(prompt: string): string {
  const responses = [
    "This is a mock response for development purposes. In production, this would be the actual GPT response based on your prompt analysis.",
    "Mock response: The AI would analyze your prompt and provide a relevant, contextual answer here with detailed insights.",
    "Development mode: This simulates what the real GPT API would return for your prompt, including comprehensive analysis and recommendations.",
    "Test response: Your prompt has been processed and this is the simulated AI-generated content with full context understanding."
  ]
  
  const index = prompt.length % responses.length
  return responses[index]
}

// Call real GPT API (placeholder)
async function callRealGPT(
  prompt: string, 
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {
  // In real implementation, this would call OpenAI API
  // For now, we'll return a simulated response
  
  if (options?.model?.includes('gpt-4')) {
    return "This is a simulated GPT-4 response. In production, this would be the actual AI-generated content based on your prompt and the specified model parameters, with full analysis and detailed recommendations."
  }
  
  return "This is a simulated GPT response. The AI would process your prompt with the configured parameters and return relevant, contextual content with comprehensive insights and actionable suggestions."
}

// Log test usage for analytics
async function logTestUsage(
  orgId: string, 
  userId: string, 
  testType: string, 
  tokenCount: number,
  score: number
) {
  try {
    // In real implementation, this would log to database
    console.log(`Test usage logged: orgId=${orgId}, userId=${userId}, testType=${testType}, tokens=${tokenCount}, score=${score}`)
  } catch (error) {
    console.error('Failed to log test usage:', error)
  }
}
