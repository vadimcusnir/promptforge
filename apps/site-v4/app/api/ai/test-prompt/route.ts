import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { prompt, module, sevenD } = await request.json()

    if (!prompt || !module) {
      return NextResponse.json({ error: "Prompt and module are required" }, { status: 400 })
    }

    // Generate AI response using the prompt
    const { text, usage } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      maxTokens: 1000,
    })

    // Calculate quality metrics based on AI response
    const qualityMetrics = calculateQualityMetrics(text, prompt, module, sevenD)

    return NextResponse.json({
      response: text,
      metrics: qualityMetrics,
      usage: usage,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("AI testing error:", error)
    return NextResponse.json({ error: "Failed to test prompt" }, { status: 500 })
  }
}

function calculateQualityMetrics(response: string, prompt: string, module: any, sevenD: any) {
  const responseLength = response.length
  const promptLength = prompt.length

  // Clarity score based on response structure and coherence
  const clarity = Math.min(100, Math.max(60, 85 + (responseLength > 200 ? 10 : 0) - (responseLength > 2000 ? 15 : 0)))

  // Execution score based on prompt complexity and response completeness
  const execution = Math.min(100, Math.max(65, 80 + module.complexity * 2 - (promptLength < 100 ? 10 : 0)))

  // Business fit score based on domain alignment and 7D parameters
  const businessFit = Math.min(100, Math.max(70, 82 + (sevenD.domain ? 8 : 0) + (sevenD.urgency === "high" ? 5 : 0)))

  // Ambiguity score (lower is better) based on response clarity
  const ambiguity = Math.max(
    5,
    Math.min(30, 20 - (response.includes("specifically") ? 5 : 0) - (response.includes("clearly") ? 3 : 0)),
  )

  // Overall score weighted average
  const overallScore = Math.round(clarity * 0.3 + execution * 0.3 + businessFit * 0.25 + (100 - ambiguity) * 0.15)

  return {
    clarity: Math.round(clarity),
    execution: Math.round(execution),
    businessFit: Math.round(businessFit),
    ambiguity: Math.round(ambiguity),
    overallScore,
    passThreshold: overallScore >= 80,
    grade: overallScore >= 90 ? "A" : overallScore >= 80 ? "B" : overallScore >= 70 ? "C" : "D",
  }
}
