import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key',
})

export interface AIGenerationRequest {
  moduleId: string
  inputs: Record<string, any>
  model?: 'gpt-4' | 'gpt-3.5-turbo' | 'gpt-4-turbo'
  temperature?: number
  maxTokens?: number
}

export interface AIGenerationResponse {
  success: boolean
  result?: string
  error?: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  model: string
}

export class AIService {
  private static instance: AIService
  private isDemoMode: boolean

  constructor() {
    this.isDemoMode = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key'
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService()
    }
    return AIService.instance
  }

  async generatePrompt(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    try {
      if (this.isDemoMode) {
        return this.generateDemoResponse(request)
      }

      const prompt = this.buildPrompt(request)
      
      const completion = await openai.chat.completions.create({
        model: request.model || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are PromptForge, an expert AI prompt engineering assistant. Generate high-quality, optimized prompts based on the user\'s requirements.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 1000,
      })

      return {
        success: true,
        result: completion.choices[0]?.message?.content || '',
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0,
        },
        model: completion.model,
      }
    } catch (error) {
      console.error('AI generation error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        model: request.model || 'gpt-4',
      }
    }
  }

  async optimizePrompt(prompt: string, optimizationGoals: string[]): Promise<AIGenerationResponse> {
    try {
      if (this.isDemoMode) {
        return {
          success: true,
          result: `Optimized prompt: ${prompt}\n\nOptimization applied for: ${optimizationGoals.join(', ')}`,
          model: 'demo',
        }
      }

      const systemPrompt = `You are an expert prompt optimizer. Your task is to improve the given prompt based on the optimization goals. Return only the optimized prompt without explanations.`

      const userPrompt = `Original prompt: "${prompt}"\n\nOptimization goals: ${optimizationGoals.join(', ')}\n\nProvide an optimized version:`

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 500,
      })

      return {
        success: true,
        result: completion.choices[0]?.message?.content || '',
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0,
        },
        model: completion.model,
      }
    } catch (error) {
      console.error('Prompt optimization error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        model: 'gpt-4',
      }
    }
  }

  async analyzePrompt(prompt: string): Promise<AIGenerationResponse> {
    try {
      if (this.isDemoMode) {
        return {
          success: true,
          result: `Analysis of prompt: "${prompt}"\n\n- Clarity: Good\n- Specificity: High\n- Context: Adequate\n- Expected Output: Well-defined\n- Optimization Potential: Medium`,
          model: 'demo',
        }
      }

      const systemPrompt = `You are a prompt analysis expert. Analyze the given prompt and provide insights on clarity, specificity, context, expected output, and optimization potential.`

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this prompt: "${prompt}"` }
        ],
        temperature: 0.3,
        max_tokens: 800,
      })

      return {
        success: true,
        result: completion.choices[0]?.message?.content || '',
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0,
        },
        model: completion.model,
      }
    } catch (error) {
      console.error('Prompt analysis error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        model: 'gpt-4',
      }
    }
  }

  private buildPrompt(request: AIGenerationRequest): string {
    // This would be customized based on the module type
    const { moduleId, inputs } = request
    
    switch (moduleId) {
      case 'M01': // Content Generator
        return `Generate comprehensive content about "${inputs.topic}" with the following requirements:
- Tone: ${inputs.tone || 'Professional'}
- Length: ${inputs.length || '500 words'}
- Requirements: ${inputs.requirements || 'High quality, engaging content'}
- Target audience: ${inputs.audience || 'General'}`

      case 'M02': // Text Analyzer
        return `Analyze the following text: "${inputs.text}"
Provide:
- Sentiment analysis
- Key themes and topics
- Structural insights
- Writing quality assessment
- Suggestions for improvement`

      case 'M03': // Prompt Optimizer
        return `Optimize this prompt for better AI performance: "${inputs.original_prompt}"
Consider these optimization goals: ${inputs.optimization_goals?.join(', ') || 'Clarity, specificity, context'}
Provide an improved version that is more effective and likely to produce better results.`

      default:
        return `Generate a prompt based on the module "${moduleId}" with inputs: ${JSON.stringify(inputs)}`
    }
  }

  private generateDemoResponse(request: AIGenerationRequest): AIGenerationResponse {
    const demoResponses = {
      'M01': `# Generated Content: ${request.inputs.topic || 'Sample Topic'}

This is a comprehensive piece of content generated using PromptForge's AI-powered content generation module. The content is tailored to your specifications and optimized for engagement and clarity.

## Key Features:
- Professional tone and structure
- Well-researched information
- Engaging narrative flow
- Actionable insights

*This is a demo response. Connect your OpenAI API key for real AI generation.*`,

      'M02': `# Text Analysis Results

## Sentiment Analysis
- Overall sentiment: Positive (0.8/1.0)
- Emotional tone: Professional and informative
- Confidence level: High

## Key Themes
- Main topic: ${request.inputs.text?.substring(0, 50) || 'Sample text'}...
- Secondary themes: Quality, efficiency, innovation

## Structural Insights
- Word count: ${request.inputs.text?.length || 150} characters
- Readability: Good
- Structure: Well-organized

*This is a demo response. Connect your OpenAI API key for real analysis.*`,

      'M03': `# Optimized Prompt

**Original:** ${request.inputs.original_prompt || 'Sample prompt'}

**Optimized:** 
"Please provide a detailed, well-structured response about [topic] that includes:
1. A clear introduction with context
2. Main points with supporting evidence
3. Practical examples or applications
4. A concise conclusion with key takeaways

Format the response in a professional, easy-to-read manner suitable for [target audience]."

## Improvements Made:
- Added specific structure requirements
- Clarified expected output format
- Specified target audience
- Enhanced clarity and specificity

*This is a demo response. Connect your OpenAI API key for real optimization.*`
    }

    return {
      success: true,
      result: demoResponses[request.moduleId as keyof typeof demoResponses] || 'Demo response generated successfully.',
      model: 'demo',
    }
  }
}

export const aiService = AIService.getInstance()
