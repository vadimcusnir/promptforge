import { NextRequest, NextResponse } from 'next/server'
import { aiService } from '@/lib/ai'
import { z } from 'zod'

const GenerateSchema = z.object({
  moduleId: z.string(),
  inputs: z.record(z.any()),
  model: z.enum(['gpt-4', 'gpt-3.5-turbo', 'gpt-4-turbo']).optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(1).max(4000).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { moduleId, inputs, model, temperature, maxTokens } = GenerateSchema.parse(body)

    const result = await aiService.generatePrompt({
      moduleId,
      inputs,
      model,
      temperature,
      maxTokens,
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}
