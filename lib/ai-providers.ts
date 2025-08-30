// AI Provider Management System for PromptForge v3
// Handles multiple AI providers with intelligent routing and failover

import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { generateText, streamText } from 'ai'
import { aiCache, cacheUtils } from './ai-cache'
import { aiCostTracker } from './ai-cost-tracking'

// Provider configuration interface
export interface ProviderConfig {
  name: string
  models: string[]
  capabilities: {
    textGeneration: boolean
    streaming: boolean
    imageGeneration: boolean
    functionCalling: boolean
  }
  costPerToken: {
    input: number
    output: number
  }
  maxTokens: number
  rateLimits: {
    requestsPerMinute: number
    tokensPerMinute: number
  }
  reliability: number // 0-1 score
  latency: number // average latency in ms
}

// Available providers configuration
export const AI_PROVIDERS: Record<string, ProviderConfig> = {
  openai: {
    name: 'OpenAI',
    models: [
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4-turbo',
      'gpt-4',
      'gpt-3.5-turbo'
    ],
    capabilities: {
      textGeneration: true,
      streaming: true,
      imageGeneration: true,
      functionCalling: true
    },
    costPerToken: {
      input: 0.000005,
      output: 0.000015
    },
    maxTokens: 128000,
    rateLimits: {
      requestsPerMinute: 500,
      tokensPerMinute: 150000
    },
    reliability: 0.95,
    latency: 1200
  },
  anthropic: {
    name: 'Anthropic',
    models: [
      'claude-3-5-sonnet',
      'claude-3-opus',
      'claude-3-sonnet',
      'claude-3-haiku'
    ],
    capabilities: {
      textGeneration: true,
      streaming: true,
      imageGeneration: false,
      functionCalling: true
    },
    costPerToken: {
      input: 0.000003,
      output: 0.000015
    },
    maxTokens: 200000,
    rateLimits: {
      requestsPerMinute: 100,
      tokensPerMinute: 40000
    },
    reliability: 0.92,
    latency: 1500
  }
}

// Provider selection strategy
export enum ProviderStrategy {
  COST_OPTIMIZED = 'cost_optimized',
  PERFORMANCE_OPTIMIZED = 'performance_optimized',
  RELIABILITY_OPTIMIZED = 'reliability_optimized',
  BALANCED = 'balanced',
  MANUAL = 'manual'
}

// AI Provider Manager class
export class AIProviderManager {
  private providerStats: Map<string, {
    requests: number
    failures: number
    averageLatency: number
    lastUsed: Date
  }> = new Map()

  constructor() {
    // Initialize provider stats
    Object.keys(AI_PROVIDERS).forEach(provider => {
      this.providerStats.set(provider, {
        requests: 0,
        failures: 0,
        averageLatency: 0,
        lastUsed: new Date()
      })
    })
  }

  // Select best provider based on strategy
  selectProvider(
    strategy: ProviderStrategy,
    model?: string,
    promptLength?: number,
    maxTokens?: number
  ): string {
    const availableProviders = this.getAvailableProviders(model)
    
    if (availableProviders.length === 0) {
      throw new Error('No available providers for the requested model')
    }

    switch (strategy) {
      case ProviderStrategy.COST_OPTIMIZED:
        return this.selectCostOptimizedProvider(availableProviders, promptLength, maxTokens)
      
      case ProviderStrategy.PERFORMANCE_OPTIMIZED:
        return this.selectPerformanceOptimizedProvider(availableProviders)
      
      case ProviderStrategy.RELIABILITY_OPTIMIZED:
        return this.selectReliabilityOptimizedProvider(availableProviders)
      
      case ProviderStrategy.BALANCED:
        return this.selectBalancedProvider(availableProviders, promptLength, maxTokens)
      
      case ProviderStrategy.MANUAL:
        return model?.includes('anthropic') ? 'anthropic' : 'openai'
      
      default:
        return availableProviders[0]
    }
  }

  // Get available providers for a model
  private getAvailableProviders(model?: string): string[] {
    if (!model) {
      return Object.keys(AI_PROVIDERS)
    }

    return Object.entries(AI_PROVIDERS)
      .filter(([_, config]) => config.models.some(m => model.includes(m)))
      .map(([name, _]) => name)
  }

  // Select cost-optimized provider
  private selectCostOptimizedProvider(
    providers: string[],
    promptLength?: number,
    maxTokens?: number
  ): string {
    if (!promptLength || !maxTokens) {
      return providers[0]
    }

    let bestProvider = providers[0]
    let lowestCost = Infinity

    providers.forEach(provider => {
      const config = AI_PROVIDERS[provider]
      const estimatedCost = this.estimateCost(config, promptLength, maxTokens)
      
      if (estimatedCost < lowestCost) {
        lowestCost = estimatedCost
        bestProvider = provider
      }
    })

    return bestProvider
  }

  // Select performance-optimized provider
  private selectPerformanceOptimizedProvider(providers: string[]): string {
    let bestProvider = providers[0]
    let bestScore = -1

    providers.forEach(provider => {
      const config = AI_PROVIDERS[provider]
      const stats = this.providerStats.get(provider)!
      
      // Score based on latency and reliability
      const latencyScore = 1 / (config.latency / 1000) // Lower latency = higher score
      const reliabilityScore = config.reliability
      const failureRate = stats.failures / Math.max(stats.requests, 1)
      const failureScore = 1 - failureRate
      
      const totalScore = (latencyScore * 0.4) + (reliabilityScore * 0.4) + (failureScore * 0.2)
      
      if (totalScore > bestScore) {
        bestScore = totalScore
        bestProvider = provider
      }
    })

    return bestProvider
  }

  // Select reliability-optimized provider
  private selectReliabilityOptimizedProvider(providers: string[]): string {
    let bestProvider = providers[0]
    let bestReliability = -1

    providers.forEach(provider => {
      const config = AI_PROVIDERS[provider]
      const stats = this.providerStats.get(provider)!
      
      const failureRate = stats.failures / Math.max(stats.requests, 1)
      const reliability = config.reliability * (1 - failureRate)
      
      if (reliability > bestReliability) {
        bestReliability = reliability
        bestProvider = provider
      }
    })

    return bestProvider
  }

  // Select balanced provider
  private selectBalancedProvider(
    providers: string[],
    promptLength?: number,
    maxTokens?: number
  ): string {
    let bestProvider = providers[0]
    let bestScore = -1

    providers.forEach(provider => {
      const config = AI_PROVIDERS[provider]
      const stats = this.providerStats.get(provider)!
      
      // Calculate balanced score
      const costScore = promptLength && maxTokens ? 
        1 / this.estimateCost(config, promptLength, maxTokens) : 1
      const latencyScore = 1 / (config.latency / 1000)
      const reliabilityScore = config.reliability
      const failureRate = stats.failures / Math.max(stats.requests, 1)
      const failureScore = 1 - failureRate
      
      const totalScore = (costScore * 0.3) + (latencyScore * 0.3) + (reliabilityScore * 0.2) + (failureScore * 0.2)
      
      if (totalScore > bestScore) {
        bestScore = totalScore
        bestProvider = provider
      }
    })

    return bestProvider
  }

  // Estimate cost for a provider
  private estimateCost(config: ProviderConfig, promptLength: number, maxTokens: number): number {
    const promptTokens = Math.ceil(promptLength / 4)
    const completionTokens = Math.ceil(maxTokens / 4)
    
    return (promptTokens * config.costPerToken.input) + (completionTokens * config.costPerToken.output)
  }

  // Get provider model
  getProviderModel(provider: string, model: string) {
    switch (provider) {
      case 'openai':
        return openai(model.replace('openai/', ''))
      case 'anthropic':
        return anthropic(model.replace('anthropic/', ''))
      default:
        throw new Error(`Unknown provider: ${provider}`)
    }
  }

  // Generate text with provider selection
  async generateText(options: {
    model?: string
    prompt: string
    temperature?: number
    maxTokens?: number
    systemPrompt?: string
    strategy?: ProviderStrategy
    useCache?: boolean
    fallback?: boolean
  }): Promise<any> {
    const {
      model = 'gpt-4o',
      prompt,
      temperature = 0.7,
      maxTokens = 1000,
      systemPrompt,
      strategy = ProviderStrategy.BALANCED,
      useCache = true,
      fallback = true
    } = options

    // Select provider
    const provider = this.selectProvider(strategy, model, prompt.length, maxTokens)
    const providerModel = this.getProviderModel(provider, model)

    try {
      // Check cache first
      if (useCache && cacheUtils.shouldCache(prompt, model)) {
        const cached = await aiCache.get(prompt, model, temperature, maxTokens, systemPrompt)
        if (cached) {
          console.log(`Cache hit for ${provider}/${model}`)
          return {
            text: cached.response,
            usage: cached.usage,
            finishReason: 'stop' as const,
            provider,
            cached: true
          }
        }
      }

      // Generate text
      const startTime = Date.now()
      const result = await generateText({
        model: providerModel,
        prompt: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt,
        temperature,
        maxTokens: maxTokens,
      } as any)
      const latency = Date.now() - startTime

      // Update provider stats
      this.updateProviderStats(provider, true, latency)

      // Cache the result
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

      return {
        ...result,
        provider,
        cached: false
      }

    } catch (error) {
      console.error(`${provider} error:`, error)
      
      // Update provider stats
      this.updateProviderStats(provider, false, 0)

      // Try fallback if enabled
      if (fallback) {
        const availableProviders = this.getAvailableProviders(model)
        const fallbackProvider = availableProviders.find(p => p !== provider)
        
        if (fallbackProvider) {
          console.log(`Falling back to ${fallbackProvider}`)
          return this.generateText({
            ...options,
            strategy: ProviderStrategy.MANUAL,
            fallback: false // Prevent infinite fallback loops
          })
        }
      }
      
      throw error
    }
  }

  // Stream text with provider selection
  async streamText(options: {
    model?: string
    prompt: string
    temperature?: number
    maxTokens?: number
    systemPrompt?: string
    strategy?: ProviderStrategy
    fallback?: boolean
  }): Promise<any> {
    const {
      model = 'gpt-4o',
      prompt,
      temperature = 0.7,
      maxTokens = 1000,
      systemPrompt,
      strategy = ProviderStrategy.BALANCED,
      fallback = true
    } = options

    // Select provider
    const provider = this.selectProvider(strategy, model, prompt.length, maxTokens)
    const providerModel = this.getProviderModel(provider, model)

    try {
      const startTime = Date.now()
      const result = streamText({
        model: providerModel,
        prompt: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt,
        temperature,
        maxTokens: maxTokens,
      } as any)

      // Update provider stats (we can't measure latency for streaming)
      this.updateProviderStats(provider, true, 0)

      return result

    } catch (error) {
      console.error(`${provider} streaming error:`, error)
      
      // Update provider stats
      this.updateProviderStats(provider, false, 0)

      // Try fallback if enabled
      if (fallback) {
        const availableProviders = this.getAvailableProviders(model)
        const fallbackProvider = availableProviders.find(p => p !== provider)
        
        if (fallbackProvider) {
          console.log(`Falling back to ${fallbackProvider} for streaming`)
          return this.streamText({
            ...options,
            strategy: ProviderStrategy.MANUAL,
            fallback: false
          })
        }
      }
      
      throw error
    }
  }

  // Update provider statistics
  private updateProviderStats(provider: string, success: boolean, latency: number) {
    const stats = this.providerStats.get(provider)!
    stats.requests++
    stats.lastUsed = new Date()
    
    if (!success) {
      stats.failures++
    } else {
      // Update average latency
      stats.averageLatency = (stats.averageLatency * (stats.requests - 1) + latency) / stats.requests
    }
  }

  // Get provider statistics
  getProviderStats() {
    const stats: Record<string, any> = {}
    
    this.providerStats.forEach((stat, provider) => {
      const config = AI_PROVIDERS[provider]
      stats[provider] = {
        ...stat,
        config,
        failureRate: stat.failures / Math.max(stat.requests, 1),
        reliability: config.reliability * (1 - (stat.failures / Math.max(stat.requests, 1)))
      }
    })
    
    return stats
  }

  // Get provider recommendations
  getProviderRecommendations(
    promptLength: number,
    maxTokens: number,
    priority: 'cost' | 'speed' | 'reliability' | 'balanced'
  ) {
    const providers = Object.keys(AI_PROVIDERS)
    const recommendations = providers.map(provider => {
      const config = AI_PROVIDERS[provider]
      const stats = this.providerStats.get(provider)!
      
      const cost = this.estimateCost(config, promptLength, maxTokens)
      const speed = 1 / (config.latency / 1000)
      const reliability = config.reliability * (1 - (stats.failures / Math.max(stats.requests, 1)))
      
      let score = 0
      switch (priority) {
        case 'cost':
          score = 1 / cost
          break
        case 'speed':
          score = speed
          break
        case 'reliability':
          score = reliability
          break
        case 'balanced':
          score = (1 / cost * 0.3) + (speed * 0.3) + (reliability * 0.4)
          break
      }
      
      return {
        provider,
        config,
        stats,
        score,
        cost,
        speed,
        reliability
      }
    })
    
    return recommendations.sort((a, b) => b.score - a.score)
  }
}

// Singleton instance
export const aiProviderManager = new AIProviderManager()

// Utility functions
export const providerUtils = {
  // Get all available models
  getAllModels(): Array<{ provider: string; model: string; config: ProviderConfig }> {
    const models: Array<{ provider: string; model: string; config: ProviderConfig }> = []
    
    Object.entries(AI_PROVIDERS).forEach(([provider, config]) => {
      config.models.forEach(model => {
        models.push({ provider, model, config })
      })
    })
    
    return models
  },

  // Get models by provider
  getModelsByProvider(provider: string): string[] {
    return AI_PROVIDERS[provider]?.models || []
  },

  // Check if model is available
  isModelAvailable(model: string): boolean {
    return Object.values(AI_PROVIDERS).some(config => 
      config.models.some(m => model.includes(m))
    )
  },

  // Get provider for model
  getProviderForModel(model: string): string | null {
    for (const [provider, config] of Object.entries(AI_PROVIDERS)) {
      if (config.models.some(m => model.includes(m))) {
        return provider
      }
    }
    return null
  },

  // Format provider info
  formatProviderInfo(provider: string): string {
    const config = AI_PROVIDERS[provider]
    if (!config) return 'Unknown provider'
    
    return `${config.name} (${config.models.length} models, ${config.reliability * 100}% reliability)`
  }
}
