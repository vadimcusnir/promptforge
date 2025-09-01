import { NextRequest, NextResponse } from 'next/server'
import { telemetry } from '@/lib/observability/telemetry'
import { auditTrail } from '@/lib/security/audit-trail'
import { z } from 'zod'

// Dashboard query validation schema
const DashboardQuerySchema = z.object({
  timeRange: z.enum(['1h', '24h', '7d', '30d']).default('24h'),
  orgId: z.string().uuid().optional(),
  moduleId: z.string().optional(),
  includeWebVitals: z.boolean().default(true),
  includeAuditStats: z.boolean().default(false)
})

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const queryParams = {
      timeRange: url.searchParams.get('timeRange') || '24h',
      orgId: url.searchParams.get('orgId'),
      moduleId: url.searchParams.get('moduleId'),
      includeWebVitals: url.searchParams.get('includeWebVitals') === 'true',
      includeAuditStats: url.searchParams.get('includeAuditStats') === 'true'
    }

    // Validate query parameters
    const validation = DashboardQuerySchema.safeParse(queryParams)
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid query parameters',
          details: validation.error.errors
        },
        { status: 400 }
      )
    }

    const { timeRange, orgId, moduleId, includeWebVitals, includeAuditStats } = validation.data

    // Get system metrics
    const systemMetrics = await telemetry.getSystemMetrics(timeRange)

    // Get module metrics
    const moduleMetrics = await telemetry.getModuleMetrics(moduleId, timeRange)

    // Get web vitals if requested
    let webVitals = null
    if (includeWebVitals) {
      webVitals = await telemetry.getWebVitalsMetrics(timeRange)
    }

    // Get audit statistics if requested
    let auditStats = null
    if (includeAuditStats && orgId) {
      auditStats = await auditTrail.getAuditStatistics(orgId, 
        timeRange === '1h' ? 1 : timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : 30
      )
    }

    // Compile dashboard data
    const dashboardData = {
      timestamp: new Date().toISOString(),
      timeRange,
      system: {
        ...systemMetrics,
        slo: {
          p95Latency: systemMetrics.p95Latency < 300,
          uptime: systemMetrics.uptime >= 99.9,
          errorRate: systemMetrics.errorRate < 1
        }
      },
      modules: moduleMetrics,
      webVitals,
      audit: auditStats,
      alerts: generateAlerts(systemMetrics, moduleMetrics, webVitals)
    }

    return NextResponse.json(dashboardData)

  } catch (error) {
    console.error('Dashboard data retrieval failed:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to retrieve dashboard data'
      },
      { status: 500 }
    )
  }
}

// Generate alerts based on metrics
function generateAlerts(systemMetrics: any, moduleMetrics: any, webVitals: any): Array<{
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'performance' | 'reliability' | 'security' | 'business'
  message: string
  timestamp: string
}> {
  const alerts: Array<{
    severity: 'low' | 'medium' | 'high' | 'critical'
    category: 'performance' | 'reliability' | 'security' | 'business'
    message: string
    timestamp: string
  }> = []

  const timestamp = new Date().toISOString()

  // Performance alerts
  if (systemMetrics.p95Latency > 300) {
    alerts.push({
      severity: systemMetrics.p95Latency > 1000 ? 'critical' : 'high',
      category: 'performance',
      message: `P95 latency is ${systemMetrics.p95Latency}ms (threshold: 300ms)`,
      timestamp
    })
  }

  if (systemMetrics.errorRate > 1) {
    alerts.push({
      severity: systemMetrics.errorRate > 5 ? 'critical' : 'high',
      category: 'reliability',
      message: `Error rate is ${systemMetrics.errorRate.toFixed(2)}% (threshold: 1%)`,
      timestamp
    })
  }

  if (systemMetrics.uptime < 99.9) {
    alerts.push({
      severity: systemMetrics.uptime < 99 ? 'critical' : 'high',
      category: 'reliability',
      message: `Uptime is ${systemMetrics.uptime.toFixed(2)}% (threshold: 99.9%)`,
      timestamp
    })
  }

  // Web vitals alerts
  if (webVitals) {
    if (webVitals.lcp.p95 > 2500) {
      alerts.push({
        severity: webVitals.lcp.p95 > 4000 ? 'critical' : 'high',
        category: 'performance',
        message: `LCP P95 is ${webVitals.lcp.p95}ms (threshold: 2500ms)`,
        timestamp
      })
    }

    if (webVitals.inp.p95 > 200) {
      alerts.push({
        severity: webVitals.inp.p95 > 500 ? 'critical' : 'high',
        category: 'performance',
        message: `INP P95 is ${webVitals.inp.p95}ms (threshold: 200ms)`,
        timestamp
      })
    }

    if (webVitals.cls.p95 > 0.1) {
      alerts.push({
        severity: webVitals.cls.p95 > 0.25 ? 'critical' : 'high',
        category: 'performance',
        message: `CLS P95 is ${webVitals.cls.p95} (threshold: 0.1)`,
        timestamp
      })
    }
  }

  // Module performance alerts
  if (moduleMetrics.successRate < 90) {
    alerts.push({
      severity: moduleMetrics.successRate < 80 ? 'high' : 'medium',
      category: 'business',
      message: `Module success rate is ${moduleMetrics.successRate.toFixed(1)}% (threshold: 90%)`,
      timestamp
    })
  }

  if (moduleMetrics.avgScore < 70) {
    alerts.push({
      severity: moduleMetrics.avgScore < 60 ? 'high' : 'medium',
      category: 'business',
      message: `Average module score is ${moduleMetrics.avgScore.toFixed(1)} (threshold: 70)`,
      timestamp
    })
  }

  return alerts
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, date } = body

    if (action === 'aggregate_daily_usage') {
      const targetDate = date ? new Date(date) : new Date()
      await telemetry.aggregateDailyUsage(targetDate)
      
      return NextResponse.json({
        message: 'Daily usage aggregation completed',
        date: targetDate.toISOString().split('T')[0]
      })
    }

    return NextResponse.json(
      { error: 'Unknown action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Dashboard action failed:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to execute dashboard action'
      },
      { status: 500 }
    )
  }
}
