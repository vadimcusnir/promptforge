import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth/server-auth'
import { aiCostTracker, costUtils } from '@/lib/ai-cost-tracking'

const costEstimateSchema = z.object({
  promptLength: z.number().min(1).max(100000),
  expectedResponseLength: z.number().min(1).max(10000).default(500),
  models: z.array(z.string()).optional()
})

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth(request)
    
    // Parse request body
    const body = await request.json()
    const validation = costEstimateSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { promptLength, expectedResponseLength, models } = validation.data

    // Get cost estimates
    const estimates = aiCostTracker.getCostEstimates(promptLength, expectedResponseLength)
    
    // Filter by requested models if provided
    const filteredEstimates = models ? 
      Object.fromEntries(
        Object.entries(estimates).filter(([model]) => 
          models.some(requestedModel => model.includes(requestedModel))
        )
      ) : estimates

    // Format estimates for display
    const formattedEstimates = Object.entries(filteredEstimates).map(([model, cost]) => ({
      model,
      cost,
      formattedCost: costUtils.formatCost(cost),
      promptTokens: Math.ceil(promptLength / 4),
      completionTokens: Math.ceil(expectedResponseLength / 4),
      totalTokens: Math.ceil(promptLength / 4) + Math.ceil(expectedResponseLength / 4)
    }))

    // Sort by cost (ascending)
    formattedEstimates.sort((a, b) => a.cost - b.cost)

    // Calculate cost per token for each model
    const costPerToken = formattedEstimates.map(estimate => {
      const [provider] = estimate.model.split('/')
      const costs = costUtils.getCostPerToken(provider as 'openai' | 'anthropic', estimate.model)
      
      return {
        ...estimate,
        costPerToken: {
          input: costs.input,
          output: costs.output,
          formattedInput: costUtils.formatCost(costs.input),
          formattedOutput: costUtils.formatCost(costs.output)
        }
      }
    })

    return NextResponse.json({
      success: true,
      estimates: {
        promptLength,
        expectedResponseLength,
        models: costPerToken,
        summary: {
          cheapest: costPerToken[0],
          mostExpensive: costPerToken[costPerToken.length - 1],
          averageCost: costPerToken.reduce((sum, model) => sum + model.cost, 0) / costPerToken.length,
          totalModels: costPerToken.length
        }
      }
    })

  } catch (error) {
    console.error('Cost Estimate API error:', error)
    
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

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth(request)
    
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const promptLength = parseInt(searchParams.get('promptLength') || '100')
    const expectedResponseLength = parseInt(searchParams.get('expectedResponseLength') || '500')
    const models = searchParams.get('models')?.split(',')
    
    // Validate request
    const validation = costEstimateSchema.safeParse({
      promptLength,
      expectedResponseLength,
      models
    })
    
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request parameters', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { promptLength: validPromptLength, expectedResponseLength: validExpectedResponseLength, models: validModels } = validation.data

    // Get cost estimates
    const estimates = aiCostTracker.getCostEstimates(validPromptLength, validExpectedResponseLength)
    
    // Filter by requested models if provided
    const filteredEstimates = validModels ? 
      Object.fromEntries(
        Object.entries(estimates).filter(([model]) => 
          validModels.some(requestedModel => model.includes(requestedModel))
        )
      ) : estimates

    // Format estimates for display
    const formattedEstimates = Object.entries(filteredEstimates).map(([model, cost]) => ({
      model,
      cost,
      formattedCost: costUtils.formatCost(cost),
      promptTokens: Math.ceil(validPromptLength / 4),
      completionTokens: Math.ceil(validExpectedResponseLength / 4),
      totalTokens: Math.ceil(validPromptLength / 4) + Math.ceil(validExpectedResponseLength / 4)
    }))

    // Sort by cost (ascending)
    formattedEstimates.sort((a, b) => a.cost - b.cost)

    // Calculate cost per token for each model
    const costPerToken = formattedEstimates.map(estimate => {
      const [provider] = estimate.model.split('/')
      const costs = costUtils.getCostPerToken(provider as 'openai' | 'anthropic', estimate.model)
      
      return {
        ...estimate,
        costPerToken: {
          input: costs.input,
          output: costs.output,
          formattedInput: costUtils.formatCost(costs.input),
          formattedOutput: costUtils.formatCost(costs.output)
        }
      }
    })

    return NextResponse.json({
      success: true,
      estimates: {
        promptLength: validPromptLength,
        expectedResponseLength: validExpectedResponseLength,
        models: costPerToken,
        summary: {
          cheapest: costPerToken[0],
          mostExpensive: costPerToken[costPerToken.length - 1],
          averageCost: costPerToken.reduce((sum, model) => sum + model.cost, 0) / costPerToken.length,
          totalModels: costPerToken.length
        }
      }
    })

  } catch (error) {
    console.error('Cost Estimate API error:', error)
    
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
