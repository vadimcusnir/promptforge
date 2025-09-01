// Comprehensive telemetry system for PromptForge
// Implements event taxonomy, metrics collection, and dashboard data

import { createClient } from '@supabase/supabase-js'
import { auditTrail } from '../security/audit-trail'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Standard event taxonomy
export type TelemetryEventType = 
  | 'module_open'
  | 'module_run_requested'
  | 'module_run_started'
  | 'module_run_scored'
  | 'module_run_succeeded'
  | 'module_run_blocked'
  | 'export_performed'
  | 'legacy_redirect_hit'
  | 'pricing_view'
  | 'checkout_started'
  | 'checkout_paid'
  | 'trial_started'
  | 'trial_converted'
  | 'api_call'
  | 'error_occurred'
  | 'performance_metric'

export interface TelemetryEvent {
  id?: string
  org_id: string
  user_id?: string
  event_type: TelemetryEventType
  module_id?: string
  trace_id: string
  plan: string
  timestamp: string
  status: 'success' | 'error' | 'warning'
  duration_ms?: number
  tokens?: number
  cost_cents?: number
  score?: number
  metadata: Record<string, any>
}

export interface WebVitalsEvent {
  id?: string
  org_id: string
  user_id?: string
  metric_name: 'LCP' | 'INP' | 'CLS' | 'FID' | 'TTFB'
  value: number
  route: string
  geo: string
  device_type: 'mobile' | 'desktop' | 'tablet'
  timestamp: string
  metadata: Record<string, any>
}

export interface DailyUsageAggregate {
  id?: string
  date: string
  total_runs: number
  total_users: number
  total_exports: number
  avg_score: number
  revenue_usd: number
  error_rate: number
  p95_latency_ms: number
  p99_latency_ms: number
  created_at: string
}

class TelemetrySystem {
  // Emit telemetry event
  async emitEvent(event: Omit<TelemetryEvent, 'id' | 'timestamp'>): Promise<void> {
    try {
      const telemetryEvent: Omit<TelemetryEvent, 'id'> = {
        ...event,
        timestamp: new Date().toISOString()
      }

      const { error } = await supabase
        .from('telemetry_events')
        .insert(telemetryEvent)

      if (error) {
        console.error('Failed to emit telemetry event:', error)
        throw error
      }

      // Also log in audit trail for security events
      if (event.event_type === 'error_occurred' || event.status === 'error') {
        await auditTrail.insertAuditRecord({
          org_id: event.org_id,
          actor_id: event.user_id,
          entity_type: 'telemetry_event',
          action: event.event_type,
          record_json: {
            status: event.status,
            duration_ms: event.duration_ms,
            error_details: event.metadata
          },
          metadata: {
            timestamp: new Date().toISOString(),
            source: 'telemetry_system'
          }
        })
      }
    } catch (error) {
      console.error('Telemetry event emission failed:', error)
      // Don't throw - telemetry failures shouldn't break the app
    }
  }

  // Emit web vitals
  async emitWebVitals(vitals: Omit<WebVitalsEvent, 'id' | 'timestamp'>): Promise<void> {
    try {
      const webVitalsEvent: Omit<WebVitalsEvent, 'id'> = {
        ...vitals,
        timestamp: new Date().toISOString()
      }

      const { error } = await supabase
        .from('web_vitals')
        .insert(webVitalsEvent)

      if (error) {
        console.error('Failed to emit web vitals:', error)
        throw error
      }
    } catch (error) {
      console.error('Web vitals emission failed:', error)
    }
  }

  // Get system metrics for dashboard
  async getSystemMetrics(timeRange: '1h' | '24h' | '7d' | '30d' = '24h'): Promise<{
    totalEvents: number
    errorRate: number
    avgLatency: number
    p95Latency: number
    p99Latency: number
    throughput: number
    uptime: number
  }> {
    try {
      const endTime = new Date()
      const startTime = new Date()
      
      switch (timeRange) {
        case '1h':
          startTime.setHours(startTime.getHours() - 1)
          break
        case '24h':
          startTime.setDate(startTime.getDate() - 1)
          break
        case '7d':
          startTime.setDate(startTime.getDate() - 7)
          break
        case '30d':
          startTime.setDate(startTime.getDate() - 30)
          break
      }

      const { data: events, error } = await supabase
        .from('telemetry_events')
        .select('status, duration_ms, timestamp')
        .gte('timestamp', startTime.toISOString())
        .lte('timestamp', endTime.toISOString())

      if (error) {
        throw error
      }

      const totalEvents = events?.length || 0
      const errorEvents = events?.filter(e => e.status === 'error').length || 0
      const errorRate = totalEvents > 0 ? (errorEvents / totalEvents) * 100 : 0
      
      const latencies = events?.map(e => e.duration_ms).filter(Boolean) || []
      const avgLatency = latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0
      
      const sortedLatencies = latencies.sort((a, b) => a - b)
      const p95Index = Math.floor(sortedLatencies.length * 0.95)
      const p99Index = Math.floor(sortedLatencies.length * 0.99)
      
      const p95Latency = sortedLatencies[p95Index] || 0
      const p99Latency = sortedLatencies[p99Index] || 0
      
      const timeRangeMs = endTime.getTime() - startTime.getTime()
      const throughput = totalEvents / (timeRangeMs / 1000) // events per second
      
      // Calculate uptime (simplified - in production you'd have more sophisticated monitoring)
      const uptime = errorRate < 5 ? 99.9 : Math.max(0, 100 - errorRate)

      return {
        totalEvents,
        errorRate,
        avgLatency,
        p95Latency,
        p99Latency,
        throughput,
        uptime
      }
    } catch (error) {
      console.error('Failed to get system metrics:', error)
      throw error
    }
  }

  // Get module performance metrics
  async getModuleMetrics(moduleId?: string, timeRange: '24h' | '7d' | '30d' = '7d'): Promise<{
    totalRuns: number
    avgScore: number
    successRate: number
    avgTokens: number
    avgCost: number
    blockedRuns: number
    topModules: Array<{ module_id: string; runs: number; avg_score: number }>
  }> {
    try {
      const endTime = new Date()
      const startTime = new Date()
      startTime.setDate(startTime.getDate() - (timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : 30))

      let query = supabase
        .from('telemetry_events')
        .select('*')
        .gte('timestamp', startTime.toISOString())
        .lte('timestamp', endTime.toISOString())
        .in('event_type', ['module_run_succeeded', 'module_run_blocked'])

      if (moduleId) {
        query = query.eq('module_id', moduleId)
      }

      const { data: events, error } = await supabase
        .from('telemetry_events')
        .select('*')
        .gte('timestamp', startTime.toISOString())
        .lte('timestamp', endTime.toISOString())
        .in('event_type', ['module_run_succeeded', 'module_run_blocked'])

      if (error) {
        throw error
      }

      const successfulRuns = events?.filter(e => e.event_type === 'module_run_succeeded') || []
      const blockedRuns = events?.filter(e => e.event_type === 'module_run_blocked') || []
      const totalRuns = successfulRuns.length + blockedRuns.length

      const avgScore = successfulRuns.length > 0 
        ? successfulRuns.reduce((sum, e) => sum + (e.score || 0), 0) / successfulRuns.length 
        : 0

      const successRate = totalRuns > 0 ? (successfulRuns.length / totalRuns) * 100 : 0

      const avgTokens = successfulRuns.length > 0
        ? successfulRuns.reduce((sum, e) => sum + (e.tokens || 0), 0) / successfulRuns.length
        : 0

      const avgCost = successfulRuns.length > 0
        ? successfulRuns.reduce((sum, e) => sum + (e.cost_cents || 0), 0) / successfulRuns.length
        : 0

      // Get top modules
      const moduleStats = new Map<string, { runs: number; totalScore: number }>()
      
      for (const event of successfulRuns) {
        if (event.module_id) {
          const existing = moduleStats.get(event.module_id) || { runs: 0, totalScore: 0 }
          moduleStats.set(event.module_id, {
            runs: existing.runs + 1,
            totalScore: existing.totalScore + (event.score || 0)
          })
        }
      }

      const topModules = Array.from(moduleStats.entries())
        .map(([module_id, stats]) => ({
          module_id,
          runs: stats.runs,
          avg_score: stats.runs > 0 ? stats.totalScore / stats.runs : 0
        }))
        .sort((a, b) => b.runs - a.runs)
        .slice(0, 10)

      return {
        totalRuns,
        avgScore,
        successRate,
        avgTokens,
        avgCost,
        blockedRuns: blockedRuns.length,
        topModules
      }
    } catch (error) {
      console.error('Failed to get module metrics:', error)
      throw error
    }
  }

  // Get web vitals metrics
  async getWebVitalsMetrics(timeRange: '24h' | '7d' | '30d' = '7d'): Promise<{
    lcp: { p50: number; p75: number; p95: number }
    inp: { p50: number; p75: number; p95: number }
    cls: { p50: number; p75: number; p95: number }
    byRoute: Array<{ route: string; lcp: number; inp: number; cls: number }>
  }> {
    try {
      const endTime = new Date()
      const startTime = new Date()
      startTime.setDate(startTime.getDate() - (timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : 30))

      const { data: vitals, error } = await supabase
        .from('web_vitals')
        .select('*')
        .gte('timestamp', startTime.toISOString())
        .lte('timestamp', endTime.toISOString())

      if (error) {
        throw error
      }

      const lcpValues = vitals?.filter(v => v.metric_name === 'LCP').map(v => v.value) || []
      const inpValues = vitals?.filter(v => v.metric_name === 'INP').map(v => v.value) || []
      const clsValues = vitals?.filter(v => v.metric_name === 'CLS').map(v => v.value) || []

      const calculatePercentile = (values: number[], percentile: number): number => {
        const sorted = values.sort((a, b) => a - b)
        const index = Math.floor(sorted.length * (percentile / 100))
        return sorted[index] || 0
      }

      const lcp = {
        p50: calculatePercentile(lcpValues, 50),
        p75: calculatePercentile(lcpValues, 75),
        p95: calculatePercentile(lcpValues, 95)
      }

      const inp = {
        p50: calculatePercentile(inpValues, 50),
        p75: calculatePercentile(inpValues, 75),
        p95: calculatePercentile(inpValues, 95)
      }

      const cls = {
        p50: calculatePercentile(clsValues, 50),
        p75: calculatePercentile(clsValues, 75),
        p95: calculatePercentile(clsValues, 95)
      }

      // Group by route
      const routeStats = new Map<string, { lcp: number[]; inp: number[]; cls: number[] }>()
      
      for (const vital of vitals || []) {
        const existing = routeStats.get(vital.route) || { lcp: [], inp: [], cls: [] }
        existing[vital.metric_name.toLowerCase() as keyof typeof existing].push(vital.value)
        routeStats.set(vital.route, existing)
      }

      const byRoute = Array.from(routeStats.entries()).map(([route, stats]) => ({
        route,
        lcp: calculatePercentile(stats.lcp, 75),
        inp: calculatePercentile(stats.inp, 75),
        cls: calculatePercentile(stats.cls, 75)
      }))

      return { lcp, inp, cls, byRoute }
    } catch (error) {
      console.error('Failed to get web vitals metrics:', error)
      throw error
    }
  }

  // Aggregate daily usage data
  async aggregateDailyUsage(date: Date): Promise<void> {
    try {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      // Get events for the day
      const { data: events, error: eventsError } = await supabase
        .from('telemetry_events')
        .select('*')
        .gte('timestamp', startOfDay.toISOString())
        .lte('timestamp', endOfDay.toISOString())

      if (eventsError) {
        throw eventsError
      }

      // Calculate aggregates
      const totalRuns = events?.filter(e => e.event_type === 'module_run_succeeded').length || 0
      const uniqueUsers = new Set(events?.map(e => e.user_id).filter(Boolean)).size
      const totalExports = events?.filter(e => e.event_type === 'export_performed').length || 0
      
      const successfulRuns = events?.filter(e => e.event_type === 'module_run_succeeded') || []
      const avgScore = successfulRuns.length > 0
        ? successfulRuns.reduce((sum, e) => sum + (e.score || 0), 0) / successfulRuns.length
        : 0

      const errorEvents = events?.filter(e => e.status === 'error').length || 0
      const errorRate = events?.length ? (errorEvents / events.length) * 100 : 0

      const latencies = events?.map(e => e.duration_ms).filter(Boolean) || []
      const sortedLatencies = latencies.sort((a, b) => a - b)
      const p95Index = Math.floor(sortedLatencies.length * 0.95)
      const p99Index = Math.floor(sortedLatencies.length * 0.99)
      
      const p95Latency = sortedLatencies[p95Index] || 0
      const p99Latency = sortedLatencies[p99Index] || 0

      // Get revenue (this would come from billing system)
      const revenue = 0 // TODO: Integrate with billing system

      const dailyUsage: Omit<DailyUsageAggregate, 'id'> = {
        date: startOfDay.toISOString().split('T')[0],
        total_runs: totalRuns,
        total_users: uniqueUsers,
        total_exports: totalExports,
        avg_score: avgScore,
        revenue_usd: revenue,
        error_rate: errorRate,
        p95_latency_ms: p95Latency,
        p99_latency_ms: p99Latency,
        created_at: new Date().toISOString()
      }

      // Upsert daily usage record
      const { error: upsertError } = await supabase
        .from('daily_usage')
        .upsert(dailyUsage, { onConflict: 'date' })

      if (upsertError) {
        throw upsertError
      }
    } catch (error) {
      console.error('Failed to aggregate daily usage:', error)
      throw error
    }
  }

  // Generate trace ID for request correlation
  generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// Export singleton instance
export const telemetry = new TelemetrySystem()
