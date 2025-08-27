import { createClient } from '@supabase/supabase-js'

// Core KPI Metrics for PromptForge v3
export interface CoreMetrics {
  // Time to Answer (TTA) - Primary KPI
  tta: {
    p50: number // 50th percentile
    p95: number // 95th percentile
    p99: number // 99th percentile
    average: number
    total_requests: number
  }
  
  // Success Rates
  success_rate: {
    overall: number // Percentage of successful requests
    by_module: Record<string, number> // Success rate per module
    by_complexity: Record<string, number> // Success rate by complexity level
  }
  
  // User Engagement
  engagement: {
    active_users_24h: number
    active_users_7d: number
    active_users_30d: number
    session_duration_avg: number
    pages_per_session: number
    bounce_rate: number
  }
  
  // Business Metrics
  business: {
    conversion_rate: number // Free to paid conversion
    revenue_per_user: number
    churn_rate: number
    customer_satisfaction: number // NPS or similar
  }
  
  // System Performance
  performance: {
    uptime: number
    response_time_avg: number
    error_rate: number
    throughput: number // Requests per second
  }
  
  // Prompt Quality Metrics
  quality: {
    avg_score: number // Average prompt quality score
    score_distribution: Record<string, number> // Score ranges
    improvement_rate: number // How often scores improve
  }
}

// Real-time metrics collection
export class MetricsCollector {
  private supabase: any
  private metricsBuffer: any[] = []
  private flushInterval: NodeJS.Timeout | null = null
  
  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Flush metrics every 30 seconds
    this.flushInterval = setInterval(() => {
      this.flushMetrics()
    }, 30000)
  }
  
  // Record TTA metric
  async recordTTA(moduleId: string, complexity: string, ttaMs: number, success: boolean) {
    const metric = {
      timestamp: new Date().toISOString(),
      type: 'tta',
      module_id: moduleId,
      complexity,
      value: ttaMs,
      success,
      metadata: {
        user_agent: 'server',
        environment: process.env.NODE_ENV
      }
    }
    
    this.metricsBuffer.push(metric)
    
    // Flush immediately if buffer is getting large
    if (this.metricsBuffer.length >= 100) {
      await this.flushMetrics()
    }
  }
  
  // Record success/failure
  async recordSuccess(moduleId: string, complexity: string, success: boolean, error?: string) {
    const metric = {
      timestamp: new Date().toISOString(),
      type: 'success_rate',
      module_id: moduleId,
      complexity,
      value: success ? 1 : 0,
      error,
      metadata: {
        user_agent: 'server',
        environment: process.env.NODE_ENV
      }
    }
    
    this.metricsBuffer.push(metric)
  }
  
  // Record user engagement
  async recordEngagement(userId: string, action: string, metadata?: any) {
    const metric = {
      timestamp: new Date().toISOString(),
      type: 'engagement',
      user_id: userId,
      action,
      metadata: {
        ...metadata,
        user_agent: 'server',
        environment: process.env.NODE_ENV
      }
    }
    
    this.metricsBuffer.push(metric)
  }
  
  // Record prompt quality score
  async recordQualityScore(moduleId: string, score: number, userId: string) {
    const metric = {
      timestamp: new Date().toISOString(),
      type: 'quality_score',
      module_id: moduleId,
      score,
      user_id: userId,
      metadata: {
        user_agent: 'server',
        environment: process.env.NODE_ENV
      }
    }
    
    this.metricsBuffer.push(metric)
  }
  
  // Flush metrics to database
  private async flushMetrics() {
    if (this.metricsBuffer.length === 0) return
    
    try {
      const metricsToFlush = [...this.metricsBuffer]
      this.metricsBuffer = []
      
      const { error } = await this.supabase
        .from('metrics')
        .insert(metricsToFlush)
      
      if (error) {
        console.error('Failed to flush metrics:', error)
        // Re-add metrics to buffer for retry
        this.metricsBuffer.unshift(...metricsToFlush)
      } else {
        console.log(`Flushed ${metricsToFlush.length} metrics to database`)
      }
    } catch (error) {
      console.error('Error flushing metrics:', error)
      // Re-add metrics to buffer for retry
      this.metricsBuffer.unshift(...this.metricsBuffer)
    }
  }
  
  // Get real-time metrics
  async getRealTimeMetrics(): Promise<Partial<CoreMetrics>> {
    try {
      const now = new Date()
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
      
      // Get TTA metrics for last hour
      const { data: ttaData, error: ttaError } = await this.supabase
        .from('metrics')
        .select('*')
        .eq('type', 'tta')
        .gte('timestamp', oneHourAgo.toISOString())
      
      if (ttaError) throw ttaError
      
      // Calculate TTA percentiles
      const ttaValues = ttaData.map((m: any) => m.value).sort((a: number, b: number) => a - b)
      const p50 = this.calculatePercentile(ttaValues, 50)
      const p95 = this.calculatePercentile(ttaValues, 95)
      const p99 = this.calculatePercentile(ttaValues, 99)
      
      return {
        tta: {
          p50,
          p95,
          p99,
          average: ttaValues.reduce((a: number, b: number) => a + b, 0) / ttaValues.length,
          total_requests: ttaValues.length
        }
      }
    } catch (error) {
      console.error('Error getting real-time metrics:', error)
      return {}
    }
  }
  
  // Calculate percentile
  private calculatePercentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0
    
    const index = Math.ceil((percentile / 100) * values.length) - 1
    return values[Math.max(0, index)] || 0
  }
  
  // Cleanup
  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
    }
    this.flushMetrics()
  }
}

// Export singleton instance
export const metricsCollector = new MetricsCollector()

// Helper functions for common metric recording
export const recordMetrics = {
  tta: (moduleId: string, complexity: string, ttaMs: number, success: boolean) => 
    metricsCollector.recordTTA(moduleId, complexity, ttaMs, success),
  
  success: (moduleId: string, complexity: string, success: boolean, error?: string) =>
    metricsCollector.recordSuccess(moduleId, complexity, success, error),
  
  engagement: (userId: string, action: string, metadata?: any) =>
    metricsCollector.recordEngagement(userId, action, metadata),
  
  quality: (moduleId: string, score: number, userId: string) =>
    metricsCollector.recordQualityScore(moduleId, score, userId)
}
