import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth/server-auth'
import { aiProviderManager, providerUtils, ProviderStrategy } from '@/lib/ai-providers'

const providerRequestSchema = z.object({
  action: z.enum(['list', 'stats', 'recommendations', 'test']),
  model: z.string().optional(),
  promptLength: z.number().min(1).max(100000).optional(),
  maxTokens: z.number().min(1).max(10000).optional(),
  priority: z.enum(['cost', 'speed', 'reliability', 'balanced']).optional(),
  strategy: z.enum(['cost_optimized', 'performance_optimized', 'reliability_optimized', 'balanced', 'manual']).optional()
})

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth(request)
    
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'list'
    const model = searchParams.get('model')
    const promptLength = parseInt(searchParams.get('promptLength') || '100')
    const maxTokens = parseInt(searchParams.get('maxTokens') || '500')
    const priority = searchParams.get('priority') as 'cost' | 'speed' | 'reliability' | 'balanced' || 'balanced'
    
    // Validate request
    const validation = providerRequestSchema.safeParse({
      action,
      model,
      promptLength,
      maxTokens,
      priority
    })
    
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request parameters', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { action: validAction, promptLength: validPromptLength, maxTokens: validMaxTokens, priority: validPriority } = validation.data

    switch (validAction) {
      case 'list': {
        const allModels = providerUtils.getAllModels()
        return NextResponse.json({
          success: true,
          providers: {
            models: allModels,
            summary: {
              totalProviders: new Set(allModels.map(m => m.provider)).size,
              totalModels: allModels.length,
              providers: Array.from(new Set(allModels.map(m => m.provider))).map(provider => ({
                name: provider,
                models: providerUtils.getModelsByProvider(provider),
                info: providerUtils.formatProviderInfo(provider)
              }))
            }
          }
        })
      }

      case 'stats': {
        const stats = aiProviderManager.getProviderStats()
        return NextResponse.json({
          success: true,
          stats
        })
      }

      case 'recommendations': {
        const recommendations = aiProviderManager.getProviderRecommendations(
          validPromptLength || 100,
          validMaxTokens || 500,
          validPriority || 'balanced'
        )
        return NextResponse.json({
          success: true,
          recommendations: {
            promptLength: validPromptLength,
            maxTokens: validMaxTokens,
            priority: validPriority,
            providers: recommendations
          }
        })
      }

      default: {
        return NextResponse.json(
          { success: false, error: 'Invalid action for GET request' },
          { status: 400 }
        )
      }
    }

  } catch (error) {
    console.error('AI Providers API error:', error)
    
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

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth(request)
    
    // Parse request body
    const body = await request.json()
    const validation = providerRequestSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { action: validAction, model: validModel, promptLength: validPromptLength, maxTokens: validMaxTokens, priority: validPriority, strategy: validStrategy } = validation.data

    switch (validAction) {
      case 'test': {
        if (!validModel) {
          return NextResponse.json(
            { success: false, error: 'Model is required for testing' },
            { status: 400 }
          )
        }

        // Test provider with a simple prompt
        const testPrompt = 'Hello, this is a test prompt. Please respond with a brief greeting.'
        const testResult = await aiProviderManager.generateText({
          model: validModel,
          prompt: testPrompt,
          temperature: 0.7,
          maxTokens: 100,
          strategy: validStrategy as ProviderStrategy || ProviderStrategy.BALANCED,
          useCache: false,
          fallback: false
        })

        return NextResponse.json({
          success: true,
          test: {
            model: validModel,
            prompt: testPrompt,
            response: testResult.text,
            provider: testResult.provider,
            usage: testResult.usage,
            latency: testResult.latency || 0
          }
        })
      }

      case 'recommendations': {
        const recommendations = aiProviderManager.getProviderRecommendations(
          validPromptLength || 100,
          validMaxTokens || 500,
          validPriority || 'balanced'
        )
        return NextResponse.json({
          success: true,
          recommendations: {
            promptLength: validPromptLength || 100,
            maxTokens: validMaxTokens || 500,
            priority: validPriority || 'balanced',
            providers: recommendations
          }
        })
      }

      default: {
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
      }
    }

  } catch (error) {
    console.error('AI Providers API error:', error)
    
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
