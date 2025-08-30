import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { logTelemetryEvent, hashUserId, generate7DSignature as generate7DSignatureTelemetry } from '@/lib/telemetry'
// import { createClient } from '@supabase/supabase-js' // Unused import
import { randomUUID } from 'crypto'
import { requireAuth } from '@/lib/auth/server-auth'
import { validateOrgMembership } from '@/lib/billing/entitlements'
import { getEffectiveEntitlements } from '@/lib/billing/entitlements'
import { ENTITLEMENT_ERROR_CODES } from '@/lib/entitlements/types'
import { aiUtils } from '@/lib/ai-gateway'
import { aiCostTracker } from '@/lib/ai-cost-tracking'
import { aiProviderManager, ProviderStrategy } from '@/lib/ai-providers'

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
    autoTighten: z.boolean().optional().default(false),
    providerStrategy: z.enum(['cost_optimized', 'performance_optimized', 'reliability_optimized', 'balanced', 'manual']).optional().default('balanced')
  }).optional()
})

// const testResponseSchema = z.object({
//   success: z.boolean(),
//   result: z.object({
//     response: z.string(),
//     model: z.string(),
//     scores: z.object({
//       clarity: z.number().min(0).max(100),
//       specificity: z.number().min(0).max(100),
//       completeness: z.number().min(0).max(100),
//       relevance: z.number().min(0).max(100),
//       overall: z.number().min(0).max(100)
//     }),
//     breakdown: z.object({
//       strengths: z.array(z.string()),
//       weaknesses: z.array(z.string()),
//       recommendations: z.array(z.string())
//     }),
//     verdict: z.enum(['pass', 'fail', 'needs_improvement']),
//     tightenedPrompt: z.string().optional(),
//     usage: z.object({
//       promptTokens: z.number(),
//       completionTokens: z.number(),
//       totalTokens: z.number()
//     }),
//     latency: z.number(),
//     testType: z.string()
//   }).optional(),
//   error: z.string().optional()
// })

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

    // Record AI usage and cost tracking
    if (testType === 'real') {
      const provider = (result as any).provider || 'openai'
      const model = result.model || 'gpt-4o'
      
      await aiCostTracker.recordUsage({
        orgId,
        userId: user.id,
        provider: provider as 'openai' | 'anthropic',
        model,
        operation: 'generate',
        promptTokens: result.usage.promptTokens,
        completionTokens: result.usage.completionTokens,
        totalTokens: result.usage.totalTokens,
        latency: result.latency,
        success: true,
        metadata: {
          testType,
          scores: result.scores,
          verdict: result.verdict,
          sevenD: sevenD || {},
          cached: (result as any).cached || false,
          providerStrategy: options?.providerStrategy || 'balanced'
        }
      })
    }

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

// Process GPT test (mock or real) using AI Gateway
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
    // Real AI Gateway call with provider management
    try {
      const model = options?.model || 'gpt-4o'
      const strategy = (options as any)?.providerStrategy as ProviderStrategy || ProviderStrategy.BALANCED
      
      // Generate AI response using provider manager
      const aiResult = await aiProviderManager.generateText({
        model,
        prompt,
        temperature: options?.temperature || 0.7,
        maxTokens: options?.maxTokens || 1000,
        strategy,
        useCache: true,
        fallback: true
      })
      
      // Analyze prompt quality using AI
      const qualityAnalysis = await aiUtils.analyzePromptQuality(prompt, sevenD)
      const scores = parseQualityScores(qualityAnalysis.text)
      const breakdown = parseBreakdown(qualityAnalysis.text)
      const verdict = scores.overall >= 80 ? 'pass' : scores.overall >= 60 ? 'needs_improvement' : 'fail'
      const latency = Date.now() - startTime
      
      return {
        response: aiResult.text,
        model: `${aiResult.provider}/${model}`,
        scores,
        breakdown,
        verdict,
        usage: {
          promptTokens: aiResult.usage.promptTokens,
          completionTokens: aiResult.usage.completionTokens,
          totalTokens: aiResult.usage.totalTokens
        },
        latency,
        testType: 'real',
        provider: aiResult.provider,
        cached: aiResult.cached
      } as any
    } catch (error) {
      console.error('AI Provider error:', error)
      
      // Fallback to mock response if AI Gateway fails
      const mockResponse = generateMockResponse(prompt)
      const scores = analyzePromptQuality(prompt, sevenD)
      const breakdown = generateBreakdown(scores, prompt)
      const verdict = scores.overall >= 80 ? 'pass' : scores.overall >= 60 ? 'needs_improvement' : 'fail'
      const latency = Date.now() - startTime
      
      return {
        response: `[AI Provider Error - Fallback Response] ${mockResponse}`,
        model: 'fallback-mock',
        scores,
        breakdown,
        verdict,
        usage: {
          promptTokens: Math.ceil(prompt.length / 4),
          completionTokens: Math.ceil(mockResponse.length / 4),
          totalTokens: Math.ceil((prompt.length + mockResponse.length) / 4)
        },
        latency,
        testType: 'real-fallback',
        provider: 'fallback',
        cached: false
      } as any
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
  _prompt: string
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

// Auto-tighten prompt if score is low using AI Gateway
async function autoTightenPrompt(
  originalPrompt: string,
  scores: { clarity: number; specificity: number; completeness: number; relevance: number; overall: number },
  sevenD?: Record<string, string>
): Promise<string> {
  try {
    // Use AI Gateway to auto-tighten the prompt
    const tightenedPrompt = await aiUtils.autoTightenPrompt(originalPrompt, scores, sevenD)
    return tightenedPrompt
  } catch (error) {
    console.error('AI Gateway auto-tighten error:', error)
    
    // Fallback to rule-based tightening
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

// Parse quality scores from AI analysis
function parseQualityScores(analysisText: string): {
  clarity: number;
  specificity: number;
  completeness: number;
  relevance: number;
  overall: number;
} {
  // Extract scores from AI analysis text
  const clarityMatch = analysisText.match(/clarity[:\s]*(\d+)/i)
  const specificityMatch = analysisText.match(/specificity[:\s]*(\d+)/i)
  const completenessMatch = analysisText.match(/completeness[:\s]*(\d+)/i)
  const relevanceMatch = analysisText.match(/relevance[:\s]*(\d+)/i)
  const overallMatch = analysisText.match(/overall[:\s]*(\d+)/i)
  
  const clarity = clarityMatch ? parseInt(clarityMatch[1]) : 70
  const specificity = specificityMatch ? parseInt(specificityMatch[1]) : 65
  const completeness = completenessMatch ? parseInt(completenessMatch[1]) : 75
  const relevance = relevanceMatch ? parseInt(relevanceMatch[1]) : 80
  const overall = overallMatch ? parseInt(overallMatch[1]) : Math.round((clarity + specificity + completeness + relevance) / 4)
  
  return { clarity, specificity, completeness, relevance, overall }
}

// Parse breakdown from AI analysis
function parseBreakdown(analysisText: string): {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
} {
  const strengths: string[] = []
  const weaknesses: string[] = []
  const recommendations: string[] = []
  
  // Extract strengths
  const strengthsMatch = analysisText.match(/strengths?[:\s]*([\s\S]*?)(?=weaknesses?|recommendations?|$)/i)
  if (strengthsMatch) {
    const strengthsText = strengthsMatch[1]
    const strengthItems = strengthsText.split(/[•\-\*]/).filter(item => item.trim())
    strengths.push(...strengthItems.map(item => item.trim()).filter(item => item.length > 0))
  }
  
  // Extract weaknesses
  const weaknessesMatch = analysisText.match(/weaknesses?[:\s]*([\s\S]*?)(?=recommendations?|$)/i)
  if (weaknessesMatch) {
    const weaknessesText = weaknessesMatch[1]
    const weaknessItems = weaknessesText.split(/[•\-\*]/).filter(item => item.trim())
    weaknesses.push(...weaknessItems.map(item => item.trim()).filter(item => item.length > 0))
  }
  
  // Extract recommendations
  const recommendationsMatch = analysisText.match(/recommendations?[:\s]*([\s\S]*?)$/i)
  if (recommendationsMatch) {
    const recommendationsText = recommendationsMatch[1]
    const recommendationItems = recommendationsText.split(/[•\-\*]/).filter(item => item.trim())
    recommendations.push(...recommendationItems.map(item => item.trim()).filter(item => item.length > 0))
  }
  
  // Fallback if parsing fails
  if (strengths.length === 0) strengths.push('Prompt provides a starting point for the request')
  if (weaknesses.length === 0) weaknesses.push('Could benefit from more specific details')
  if (recommendations.length === 0) recommendations.push('Consider adding more context and examples')
  
  return { strengths, weaknesses, recommendations }
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
