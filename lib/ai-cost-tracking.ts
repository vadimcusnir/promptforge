// AI Cost Tracking and Usage Analytics for PromptForge v3
// Tracks token usage, costs, and performance metrics across AI providers

import { createClient } from '@supabase/supabase-js'

// Cost tracking interface
export interface AICostRecord {
  id?: string
  orgId: string
  userId: string
  provider: 'openai' | 'anthropic'
  model: string
  operation: 'generate' | 'stream' | 'analyze' | 'tighten'
  promptTokens: number
  completionTokens: number
  totalTokens: number
  cost: number
  latency: number
  success: boolean
  error?: string
  timestamp: Date
  metadata?: Record<string, any>
}

// Cost per token (as of 2024 - update as needed)
export const AI_COST_PER_TOKEN = {
  openai: {
    'gpt-4o': { input: 0.000005, output: 0.000015 },
    'gpt-4o-mini': { input: 0.00000015, output: 0.0000006 },
    'gpt-4-turbo': { input: 0.00001, output: 0.00003 },
    'gpt-4': { input: 0.00003, output: 0.00006 },
    'gpt-3.5-turbo': { input: 0.0000005, output: 0.0000015 },
  },
  anthropic: {
    'claude-3-5-sonnet': { input: 0.000003, output: 0.000015 },
    'claude-3-opus': { input: 0.000015, output: 0.000075 },
    'claude-3-sonnet': { input: 0.000003, output: 0.000015 },
    'claude-3-haiku': { input: 0.00000025, output: 0.00000125 },
  }
}

// Cost tracking class
export class AICostTracker {
  private supabase: any
  private cache: Map<string, AICostRecord[]> = new Map()

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }

  // Calculate cost for a given usage
  calculateCost(
    provider: 'openai' | 'anthropic',
    model: string,
    promptTokens: number,
    completionTokens: number
  ): number {
    const modelKey = model.replace(`${provider}/`, '')
    const providerCosts = AI_COST_PER_TOKEN[provider]
    const costs = providerCosts[modelKey as keyof typeof providerCosts] as { input: number; output: number } | undefined
    
    if (!costs) {
      console.warn(`Unknown model: ${model}, using default costs`)
      return (promptTokens * 0.000001) + (completionTokens * 0.000002)
    }

    return (promptTokens * costs.input) + (completionTokens * costs.output)
  }

  // Record AI usage and cost
  async recordUsage(record: Omit<AICostRecord, 'id' | 'timestamp' | 'cost'>): Promise<void> {
    try {
      const cost = this.calculateCost(
        record.provider,
        record.model,
        record.promptTokens,
        record.completionTokens
      )

      const fullRecord: AICostRecord = {
        ...record,
        cost,
        timestamp: new Date()
      }

      // Store in database
      const { error } = await this.supabase
        .from('ai_usage_logs')
        .insert([fullRecord])

      if (error) {
        console.error('Failed to record AI usage:', error)
      }

      // Cache for quick access
      const cacheKey = `${record.orgId}-${record.userId}`
      if (!this.cache.has(cacheKey)) {
        this.cache.set(cacheKey, [])
      }
      this.cache.get(cacheKey)!.push(fullRecord)

    } catch (error) {
      console.error('Error recording AI usage:', error)
    }
  }

  // Get usage statistics for an organization
  async getOrgUsageStats(orgId: string, days: number = 30): Promise<{
    totalCost: number
    totalTokens: number
    totalRequests: number
    averageLatency: number
    successRate: number
    providerBreakdown: Record<string, any>
    modelBreakdown: Record<string, any>
    dailyUsage: Array<{ date: string; cost: number; tokens: number; requests: number }>
  }> {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data, error } = await this.supabase
        .from('ai_usage_logs')
        .select('*')
        .eq('orgId', orgId)
        .gte('timestamp', startDate.toISOString())

      if (error) {
        console.error('Failed to fetch usage stats:', error)
        return this.getEmptyStats()
      }

      return this.calculateStats(data || [])
    } catch (error) {
      console.error('Error fetching usage stats:', error)
      return this.getEmptyStats()
    }
  }

  // Get user usage statistics
  async getUserUsageStats(userId: string, days: number = 30): Promise<{
    totalCost: number
    totalTokens: number
    totalRequests: number
    averageLatency: number
    successRate: number
    recentActivity: AICostRecord[]
  }> {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data, error } = await this.supabase
        .from('ai_usage_logs')
        .select('*')
        .eq('userId', userId)
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: false })
        .limit(100)

      if (error) {
        console.error('Failed to fetch user stats:', error)
        return this.getEmptyUserStats()
      }

      const records = data || []
      const totalCost = records.reduce((sum: number, record: any) => sum + record.cost, 0)
      const totalTokens = records.reduce((sum: number, record: any) => sum + record.totalTokens, 0)
      const totalRequests = records.length
      const averageLatency = records.reduce((sum: number, record: any) => sum + record.latency, 0) / totalRequests
      const successRate = (records.filter((r: any) => r.success).length / totalRequests) * 100

      return {
        totalCost,
        totalTokens,
        totalRequests,
        averageLatency: averageLatency || 0,
        successRate: successRate || 0,
        recentActivity: records.slice(0, 10)
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
      return this.getEmptyUserStats()
    }
  }

  // Calculate statistics from records
  private calculateStats(records: AICostRecord[]): any {
    if (records.length === 0) {
      return this.getEmptyStats()
    }

    const totalCost = records.reduce((sum: number, record: AICostRecord) => sum + record.cost, 0)
    const totalTokens = records.reduce((sum: number, record: AICostRecord) => sum + record.totalTokens, 0)
    const totalRequests = records.length
    const averageLatency = records.reduce((sum: number, record: AICostRecord) => sum + record.latency, 0) / totalRequests
    const successRate = (records.filter((r: AICostRecord) => r.success).length / totalRequests) * 100

    // Provider breakdown
    const providerBreakdown = records.reduce((acc, record) => {
      if (!acc[record.provider]) {
        acc[record.provider] = { cost: 0, tokens: 0, requests: 0 }
      }
      acc[record.provider].cost += record.cost
      acc[record.provider].tokens += record.totalTokens
      acc[record.provider].requests += 1
      return acc
    }, {} as Record<string, any>)

    // Model breakdown
    const modelBreakdown = records.reduce((acc, record) => {
      if (!acc[record.model]) {
        acc[record.model] = { cost: 0, tokens: 0, requests: 0 }
      }
      acc[record.model].cost += record.cost
      acc[record.model].tokens += record.totalTokens
      acc[record.model].requests += 1
      return acc
    }, {} as Record<string, any>)

    // Daily usage
    const dailyUsage = records.reduce((acc, record) => {
      const date = new Date(record.timestamp).toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = { cost: 0, tokens: 0, requests: 0 }
      }
      acc[date].cost += record.cost
      acc[date].tokens += record.totalTokens
      acc[date].requests += 1
      return acc
    }, {} as Record<string, any>)

    const dailyUsageArray = Object.entries(dailyUsage).map(([date, data]) => ({
      date,
      ...data
    })).sort((a, b) => a.date.localeCompare(b.date))

    return {
      totalCost,
      totalTokens,
      totalRequests,
      averageLatency: averageLatency || 0,
      successRate: successRate || 0,
      providerBreakdown,
      modelBreakdown,
      dailyUsage: dailyUsageArray
    }
  }

  // Get empty stats structure
  private getEmptyStats() {
    return {
      totalCost: 0,
      totalTokens: 0,
      totalRequests: 0,
      averageLatency: 0,
      successRate: 0,
      providerBreakdown: {},
      modelBreakdown: {},
      dailyUsage: []
    }
  }

  // Get empty user stats structure
  private getEmptyUserStats() {
    return {
      totalCost: 0,
      totalTokens: 0,
      totalRequests: 0,
      averageLatency: 0,
      successRate: 0,
      recentActivity: []
    }
  }

  // Get cost estimates for different models
  getCostEstimates(promptLength: number, expectedResponseLength: number = 500): Record<string, number> {
    const estimates: Record<string, number> = {}
    
    Object.entries(AI_COST_PER_TOKEN).forEach(([provider, models]) => {
      Object.entries(models).forEach(([model, costs]) => {
        const promptTokens = Math.ceil(promptLength / 4)
        const completionTokens = Math.ceil(expectedResponseLength / 4)
        const cost = (promptTokens * costs.input) + (completionTokens * costs.output)
        estimates[`${provider}/${model}`] = cost
      })
    })

    return estimates
  }

  // Clear cache
  clearCache() {
    this.cache.clear()
  }
}

// Singleton instance
export const aiCostTracker = new AICostTracker()

// Utility functions
export const costUtils = {
  // Format cost for display
  formatCost(cost: number): string {
    if (cost < 0.001) {
      return `$${(cost * 1000).toFixed(2)}m`
    } else if (cost < 1) {
      return `$${cost.toFixed(3)}`
    } else {
      return `$${cost.toFixed(2)}`
    }
  },

  // Format token count
  formatTokens(tokens: number): string {
    if (tokens < 1000) {
      return `${tokens} tokens`
    } else if (tokens < 1000000) {
      return `${(tokens / 1000).toFixed(1)}K tokens`
    } else {
      return `${(tokens / 1000000).toFixed(1)}M tokens`
    }
  },

  // Get cost per token for a model
  getCostPerToken(provider: 'openai' | 'anthropic', model: string): { input: number; output: number } {
    const modelKey = model.replace(`${provider}/`, '')
    return AI_COST_PER_TOKEN[provider][modelKey as keyof typeof AI_COST_PER_TOKEN[typeof provider]] || { input: 0.000001, output: 0.000002 }
  }
}
