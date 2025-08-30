// AI Response Caching System for PromptForge v3
// Implements intelligent caching for common prompt patterns and responses

import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// Cache configuration
export const CACHE_CONFIG = {
  // Cache TTL in seconds
  ttl: {
    short: 300,    // 5 minutes for simple queries
    medium: 3600,  // 1 hour for standard prompts
    long: 86400,   // 24 hours for complex analysis
    permanent: 604800 // 7 days for static content
  },
  
  // Cache size limits
  maxCacheSize: 1000,
  maxCacheAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  
  // Cache key patterns
  keyPatterns: {
    prompt: 'prompt',
    model: 'model',
    temperature: 'temp',
    maxTokens: 'max',
    systemPrompt: 'sys'
  }
}

// Cache entry interface
export interface CacheEntry {
  id: string
  key: string
  prompt: string
  model: string
  temperature: number
  maxTokens: number
  systemPrompt?: string
  response: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  latency: number
  createdAt: Date
  expiresAt: Date
  hitCount: number
  lastAccessed: Date
  metadata?: Record<string, any>
}

// Cache statistics interface
export interface CacheStats {
  totalEntries: number
  hitRate: number
  totalHits: number
  totalMisses: number
  totalSavings: number
  averageLatency: number
  topModels: Array<{ model: string; hits: number; savings: number }>
  topPrompts: Array<{ prompt: string; hits: number; savings: number }>
}

// AI Cache class
export class AICache {
  private supabase: any
  private memoryCache: Map<string, CacheEntry> = new Map()
  private stats: {
    hits: number
    misses: number
    totalSavings: number
  } = { hits: 0, misses: 0, totalSavings: 0 }

  constructor() {
    // Lazy initialization to avoid build-time errors
    this.supabase = null
  }

  private getSupabaseClient() {
    if (!this.supabase) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      
      if (!url || !key) {
        throw new Error('Supabase configuration missing. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.')
      }
      
      this.supabase = createClient(url, key)
    }
    return this.supabase
  }

  // Generate cache key from parameters
  generateCacheKey(
    prompt: string,
    model: string,
    temperature: number,
    maxTokens: number,
    systemPrompt?: string
  ): string {
    const normalizedPrompt = this.normalizePrompt(prompt)
    const keyData = {
      prompt: normalizedPrompt,
      model,
      temperature: Math.round(temperature * 100) / 100, // Round to 2 decimal places
      maxTokens,
      systemPrompt: systemPrompt || ''
    }
    
    const keyString = JSON.stringify(keyData)
    return crypto.createHash('sha256').update(keyString).digest('hex')
  }

  // Normalize prompt for consistent caching
  private normalizePrompt(prompt: string): string {
    return prompt
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s]/g, '')
      .trim()
  }

  // Determine cache TTL based on prompt characteristics
  private getCacheTTL(prompt: string, model: string): number {
    // Short TTL for time-sensitive queries
    if (prompt.includes('current') || prompt.includes('today') || prompt.includes('now')) {
      return CACHE_CONFIG.ttl.short
    }
    
    // Medium TTL for standard prompts
    if (prompt.length < 100) {
      return CACHE_CONFIG.ttl.medium
    }
    
    // Long TTL for complex analysis
    if (prompt.length > 500 || prompt.includes('analyze') || prompt.includes('explain')) {
      return CACHE_CONFIG.ttl.long
    }
    
    // Permanent TTL for static content
    if (prompt.includes('definition') || prompt.includes('what is')) {
      return CACHE_CONFIG.ttl.permanent
    }
    
    return CACHE_CONFIG.ttl.medium
  }

  // Get cached response
  async get(
    prompt: string,
    model: string,
    temperature: number,
    maxTokens: number,
    systemPrompt?: string
  ): Promise<CacheEntry | null> {
    const key = this.generateCacheKey(prompt, model, temperature, maxTokens, systemPrompt)
    
    try {
      // Check memory cache first
      let entry = this.memoryCache.get(key)
      
      if (!entry) {
        // Check database cache
        const { data, error } = await this.getSupabaseClient()
          .from('ai_cache')
          .select('*')
          .eq('key', key)
          .eq('expires_at', '>', new Date().toISOString())
          .single()
        
        if (error || !data) {
          this.stats.misses++
          return null
        }
        
        entry = this.mapDbEntryToCacheEntry(data)
        
        // Store in memory cache
        this.memoryCache.set(key, entry)
      }
      
      // Check if entry is expired
      if (new Date() > entry.expiresAt) {
        this.memoryCache.delete(key)
        this.stats.misses++
        return null
      }
      
      // Update access statistics
      entry.hitCount++
      entry.lastAccessed = new Date()
      
      // Update database
      await this.getSupabaseClient()
        .from('ai_cache')
        .update({
          hit_count: entry.hitCount,
          last_accessed: entry.lastAccessed.toISOString()
        })
        .eq('key', key)
      
      this.stats.hits++
      this.stats.totalSavings += entry.usage.totalTokens
      
      return entry
    } catch (error) {
      console.error('Cache get error:', error)
      this.stats.misses++
      return null
    }
  }

  // Store response in cache
  async set(
    prompt: string,
    model: string,
    temperature: number,
    maxTokens: number,
    response: string,
    usage: { promptTokens: number; completionTokens: number; totalTokens: number },
    latency: number,
    systemPrompt?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const key = this.generateCacheKey(prompt, model, temperature, maxTokens, systemPrompt)
    const ttl = this.getCacheTTL(prompt, model)
    const now = new Date()
    const expiresAt = new Date(now.getTime() + ttl * 1000)
    
    const entry: CacheEntry = {
      id: crypto.randomUUID(),
      key,
      prompt,
      model,
      temperature,
      maxTokens,
      systemPrompt,
      response,
      usage,
      latency,
      createdAt: now,
      expiresAt,
      hitCount: 0,
      lastAccessed: now,
      metadata
    }
    
    try {
      // Store in memory cache
      this.memoryCache.set(key, entry)
      
      // Store in database
      await this.getSupabaseClient()
        .from('ai_cache')
        .insert([{
          id: entry.id,
          key: entry.key,
          prompt: entry.prompt,
          model: entry.model,
          temperature: entry.temperature,
          max_tokens: entry.maxTokens,
          system_prompt: entry.systemPrompt,
          response: entry.response,
          prompt_tokens: entry.usage.promptTokens,
          completion_tokens: entry.usage.completionTokens,
          total_tokens: entry.usage.totalTokens,
          latency: entry.latency,
          created_at: entry.createdAt.toISOString(),
          expires_at: entry.expiresAt.toISOString(),
          hit_count: entry.hitCount,
          last_accessed: entry.lastAccessed.toISOString(),
          metadata: entry.metadata
        }])
      
      // Clean up old entries if cache is too large
      await this.cleanup()
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  // Map database entry to cache entry
  private mapDbEntryToCacheEntry(data: any): CacheEntry {
    return {
      id: data.id,
      key: data.key,
      prompt: data.prompt,
      model: data.model,
      temperature: data.temperature,
      maxTokens: data.max_tokens,
      systemPrompt: data.system_prompt,
      response: data.response,
      usage: {
        promptTokens: data.prompt_tokens,
        completionTokens: data.completion_tokens,
        totalTokens: data.total_tokens
      },
      latency: data.latency,
      createdAt: new Date(data.created_at),
      expiresAt: new Date(data.expires_at),
      hitCount: data.hit_count,
      lastAccessed: new Date(data.last_accessed),
      metadata: data.metadata
    }
  }

  // Clean up expired and old entries
  async cleanup(): Promise<void> {
    try {
      // Clean memory cache
      const now = new Date()
      for (const [key, entry] of this.memoryCache.entries()) {
        if (now > entry.expiresAt) {
          this.memoryCache.delete(key)
        }
      }
      
      // Clean database cache
      await this.getSupabaseClient()
        .from('ai_cache')
        .delete()
        .lt('expires_at', now.toISOString())
      
      // Remove old entries if cache is too large
      const { data: entries } = await this.getSupabaseClient()
        .from('ai_cache')
        .select('id, created_at')
        .order('created_at', { ascending: true })
      
      if (entries && entries.length > CACHE_CONFIG.maxCacheSize) {
        const entriesToDelete = entries.slice(0, entries.length - CACHE_CONFIG.maxCacheSize)
        const idsToDelete = entriesToDelete.map((entry: any) => entry.id)
        
        await this.getSupabaseClient()
          .from('ai_cache')
          .delete()
          .in('id', idsToDelete)
      }
    } catch (error) {
      console.error('Cache cleanup error:', error)
    }
  }

  // Get cache statistics
  async getStats(): Promise<CacheStats> {
    try {
      const { data: entries } = await this.getSupabaseClient()
        .from('ai_cache')
        .select('*')
      
      if (!entries) {
        return this.getEmptyStats()
      }
      
      const totalEntries = entries.length
      const totalHits = entries.reduce((sum: number, entry: any) => sum + entry.hit_count, 0)
      const totalMisses = this.stats.misses
      const hitRate = totalHits + totalMisses > 0 ? (totalHits / (totalHits + totalMisses)) * 100 : 0
      const totalSavings = entries.reduce((sum: number, entry: any) => sum + (entry.total_tokens * entry.hit_count), 0)
      const averageLatency = entries.reduce((sum: number, entry: any) => sum + entry.latency, 0) / totalEntries
      
      // Top models
      const modelStats = entries.reduce((acc: any, entry: any) => {
        if (!acc[entry.model]) {
          acc[entry.model] = { hits: 0, savings: 0 }
        }
        acc[entry.model].hits += entry.hit_count
        acc[entry.model].savings += entry.total_tokens * entry.hit_count
        return acc
      }, {} as Record<string, { hits: number; savings: number }>)
      
      const topModels = Object.entries(modelStats)
        .map(([model, stats]) => ({ model, ...(stats as any) }))
        .sort((a, b) => b.hits - a.hits)
        .slice(0, 10)
      
      // Top prompts
      const promptStats = entries.reduce((acc: any, entry: any) => {
        const promptKey = entry.prompt.substring(0, 50) + '...'
        if (!acc[promptKey]) {
          acc[promptKey] = { hits: 0, savings: 0 }
        }
        acc[promptKey].hits += entry.hit_count
        acc[promptKey].savings += entry.total_tokens * entry.hit_count
        return acc
      }, {} as Record<string, { hits: number; savings: number }>)
      
      const topPrompts = Object.entries(promptStats)
        .map(([prompt, stats]) => ({ prompt, ...(stats as any) }))
        .sort((a, b) => b.hits - a.hits)
        .slice(0, 10)
      
      return {
        totalEntries,
        hitRate,
        totalHits,
        totalMisses,
        totalSavings,
        averageLatency,
        topModels,
        topPrompts
      }
    } catch (error) {
      console.error('Error getting cache stats:', error)
      return this.getEmptyStats()
    }
  }

  // Get empty stats structure
  private getEmptyStats(): CacheStats {
    return {
      totalEntries: 0,
      hitRate: 0,
      totalHits: 0,
      totalMisses: 0,
      totalSavings: 0,
      averageLatency: 0,
      topModels: [],
      topPrompts: []
    }
  }

  // Clear all cache
  async clear(): Promise<void> {
    try {
      this.memoryCache.clear()
      await this.getSupabaseClient()
        .from('ai_cache')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all entries
      
      this.stats = { hits: 0, misses: 0, totalSavings: 0 }
    } catch (error) {
      console.error('Cache clear error:', error)
    }
  }

  // Get cache size
  getCacheSize(): number {
    return this.memoryCache.size
  }

  // Get memory cache entries
  getMemoryCacheEntries(): CacheEntry[] {
    return Array.from(this.memoryCache.values())
  }
}

// Singleton instance
export const aiCache = new AICache()

// Utility functions
export const cacheUtils = {
  // Format cache stats for display
  formatStats(stats: CacheStats): string {
    return `
Cache Statistics:
- Total Entries: ${stats.totalEntries}
- Hit Rate: ${stats.hitRate.toFixed(1)}%
- Total Hits: ${stats.totalHits}
- Total Misses: ${stats.totalMisses}
- Total Savings: ${stats.totalSavings.toLocaleString()} tokens
- Average Latency: ${stats.averageLatency.toFixed(0)}ms
- Top Models: ${stats.topModels.map(m => `${m.model} (${m.hits} hits)`).join(', ')}
    `.trim()
  },

  // Check if prompt should be cached
  shouldCache(prompt: string, model: string): boolean {
    // Don't cache very short prompts
    if (prompt.length < 10) return false
    
    // Don't cache time-sensitive queries
    if (prompt.includes('current') || prompt.includes('today') || prompt.includes('now')) {
      return false
    }
    
    // Don't cache personal information
    if (prompt.includes('my ') || prompt.includes('personal') || prompt.includes('private')) {
      return false
    }
    
    return true
  },

  // Get cache key for debugging
  getCacheKey(
    prompt: string,
    model: string,
    temperature: number,
    maxTokens: number,
    systemPrompt?: string
  ): string {
    return aiCache.generateCacheKey(prompt, model, temperature, maxTokens, systemPrompt)
  }
}
