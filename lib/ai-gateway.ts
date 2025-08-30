// AI Gateway Configuration for PromptForge v3
// Handles OpenAI, Anthropic, and other AI providers through Vercel AI Gateway

import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { generateText, streamText } from 'ai'
import { aiCache, cacheUtils } from './ai-cache'

// AI Gateway Configuration
export const AI_GATEWAY_CONFIG = {
  apiKey: process.env.AI_GATEWAY_API_KEY || process.env.OPENAI_API_KEY,
  openaiApiKey: process.env.OPENAI_API_KEY,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  defaultModel: 'openai/gpt-4o',
  fallbackModel: 'openai/gpt-3.5-turbo',
  cacheTtl: 3600, // 1 hour cache
  maxRetries: 3,
  timeout: 30000, // 30 seconds
}

// Available models configuration
export const AI_MODELS = {
  openai: {
    'gpt-4o': 'openai/gpt-4o',
    'gpt-4o-mini': 'openai/gpt-4o-mini',
    'gpt-4-turbo': 'openai/gpt-4-turbo',
    'gpt-4': 'openai/gpt-4',
    'gpt-3.5-turbo': 'openai/gpt-3.5-turbo',
  },
  anthropic: {
    'claude-3-5-sonnet': 'anthropic/claude-3-5-sonnet-20241022',
    'claude-3-opus': 'anthropic/claude-3-opus-20240229',
    'claude-3-sonnet': 'anthropic/claude-3-sonnet-20240229',
    'claude-3-haiku': 'anthropic/claude-3-haiku-20240307',
  }
}

// AI Gateway client with error handling and retries
export class AIGatewayClient {
  private apiKey: string
  private cache: Map<string, any> = new Map()

  constructor() {
    this.apiKey = AI_GATEWAY_CONFIG.apiKey || ''
    if (!this.apiKey) {
      throw new Error('AI_GATEWAY_API_KEY or OPENAI_API_KEY is required')
    }
  }

  // Generate text with AI Gateway and caching
  async generateText(options: {
    model?: string
    prompt: string
    temperature?: number
    maxTokens?: number
    systemPrompt?: string
    provider?: 'openai' | 'anthropic'
    useCache?: boolean
  }): Promise<any> {
    const {
      model = AI_GATEWAY_CONFIG.defaultModel,
      prompt,
      temperature = 0.7,
      maxTokens = 1000,
      systemPrompt,
      provider = 'openai',
      useCache = true
    } = options

    // Check cache first if enabled
    if (useCache && cacheUtils.shouldCache(prompt, model)) {
      const cached = await aiCache.get(prompt, model, temperature, maxTokens, systemPrompt)
      if (cached) {
        console.log(`Cache hit for model ${model}`)
        return {
          text: cached.response,
          usage: cached.usage,
          finishReason: 'stop' as const
        }
      }
    }

    try {
      // Select the appropriate provider
      const providerModel = this.getProviderModel(model, provider)
      const startTime = Date.now()
      
      const result = await generateText({
        model: providerModel,
        prompt: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt,
        temperature,
        maxTokens: maxTokens,
      } as any)

      const latency = Date.now() - startTime

      // Cache the result if enabled
      if (useCache && cacheUtils.shouldCache(prompt, model)) {
        await aiCache.set(
          prompt,
          model,
          temperature,
          maxTokens,
          result.text,
          {
            promptTokens: (result.usage as any).promptTokens || 0,
            completionTokens: (result.usage as any).completionTokens || 0,
            totalTokens: (result.usage as any).totalTokens || 0
          },
          latency,
          systemPrompt,
          { provider, finishReason: result.finishReason }
        )
      }

      return result
    } catch (error) {
      console.error('AI Gateway error:', error)
      
      // Fallback to different model if available
      if (model !== AI_GATEWAY_CONFIG.fallbackModel) {
        console.log('Falling back to default model')
        return this.generateText({
          ...options,
          model: AI_GATEWAY_CONFIG.fallbackModel
        })
      }
      
      throw error
    }
  }

  // Stream text with AI Gateway
  async streamText(options: {
    model?: string
    prompt: string
    temperature?: number
    maxTokens?: number
    systemPrompt?: string
    provider?: 'openai' | 'anthropic'
  }) {
    const {
      model = AI_GATEWAY_CONFIG.defaultModel,
      prompt,
      temperature = 0.7,
      maxTokens = 1000,
      systemPrompt,
      provider = 'openai'
    } = options

    try {
      const providerModel = this.getProviderModel(model, provider)
      
      return streamText({
        model: providerModel,
        prompt: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt,
        temperature,
        maxTokens: maxTokens,
      } as any)
    } catch (error) {
      console.error('AI Gateway streaming error:', error)
      throw error
    }
  }

  // Get provider-specific model
  private getProviderModel(model: string, provider: 'openai' | 'anthropic') {
    if (provider === 'openai') {
      return openai(model.replace('openai/', ''))
    } else if (provider === 'anthropic') {
      return anthropic(model.replace('anthropic/', ''))
    }
    return openai(model.replace('openai/', ''))
  }

  // Create cache key
  private createCacheKey(prompt: string, model: string, temperature: number, maxTokens: number, systemPrompt?: string): string {
    const content = `${prompt}|${model}|${temperature}|${maxTokens}|${systemPrompt || ''}`
    return Buffer.from(content).toString('base64')
  }

  // Clear cache
  clearCache() {
    this.cache.clear()
  }

  // Get cache stats
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }
}

// Singleton instance
export const aiGateway = new AIGatewayClient()

// Utility functions for common AI operations
export const aiUtils = {
  // Analyze prompt quality
  async analyzePromptQuality(prompt: string, sevenD?: Record<string, string>) {
    const systemPrompt = `You are an expert prompt engineer. Analyze the given prompt and provide scores for clarity, specificity, completeness, and relevance on a scale of 0-100. Also provide strengths, weaknesses, and recommendations.`
    
    const result = await aiGateway.generateText({
      prompt: `Analyze this prompt: "${prompt}"\n\n7D Context: ${JSON.stringify(sevenD || {})}`,
      systemPrompt,
      temperature: 0.3,
      maxTokens: 500
    })

    return result
  },

  // Auto-tighten prompt
  async autoTightenPrompt(originalPrompt: string, scores: any, sevenD?: Record<string, string>) {
    const systemPrompt = `You are an expert prompt engineer. Improve the given prompt based on the quality scores and 7D context. Make it clearer, more specific, and more complete while maintaining the original intent.`
    
    const result = await aiGateway.generateText({
      prompt: `Original prompt: "${originalPrompt}"\n\nQuality scores: ${JSON.stringify(scores)}\n\n7D Context: ${JSON.stringify(sevenD || {})}\n\nProvide an improved version:`,
      systemPrompt,
      temperature: 0.4,
      maxTokens: 800
    })

    return result.text
  },

  // Generate mock response for testing
  async generateMockResponse(prompt: string, model: string = 'gpt-4') {
    const systemPrompt = `You are a helpful AI assistant. Provide a realistic response to the user's prompt.`
    
    const result = await aiGateway.generateText({
      prompt,
      systemPrompt,
      temperature: 0.7,
      maxTokens: 500
    })

    return result.text
  }
}
