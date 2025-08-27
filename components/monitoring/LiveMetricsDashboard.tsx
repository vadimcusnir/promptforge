"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  AlertTriangle, 
  Activity,
  Users,
  Zap
} from 'lucide-react'

interface LiveMetrics {
  tta: {
    p50: number
    p95: number
    p99: number
    average: number
    total_requests: number
  }
  success_rate: number
  active_users: number
  error_rate: number
  throughput: number
}

interface Alert {
  id: string
  type: 'warning' | 'critical' | 'info'
  message: string
  timestamp: string
  metric: string
  value: number
  threshold: number
}

export function LiveMetricsDashboard() {
  const [metrics, setMetrics] = useState<LiveMetrics | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Fetch metrics every 30 seconds
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/monitoring/metrics')
        if (response.ok) {
          const data = await response.json()
          setMetrics(data.metrics)
          setAlerts(data.alerts || [])
          setLastUpdated(new Date())
        }
      } catch (error) {
        console.error('Failed to fetch metrics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 30000)

    return () => clearInterval(interval)
  }, [])

  // Calculate status indicators
  const getTTAStatus = (value: number) => {
    if (value <= 1000) return { status: 'excellent', color: 'bg-green-500' }
    if (value <= 3000) return { status: 'good', color: 'bg-yellow-500' }
    if (value <= 5000) return { status: 'warning', color: 'bg-orange-500' }
    return { status: 'critical', color: 'bg-red-500' }
  }

  const getSuccessRateStatus = (value: number) => {
    if (value >= 99) return { status: 'excellent', color: 'bg-green-500' }
    if (value >= 95) return { status: 'good', color: 'bg-yellow-500' }
    if (value >= 90) return { status: 'warning', color: 'bg-orange-500' }
    return { status: 'critical', color: 'bg-red-500' }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!metrics) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Unable to load metrics. Please check your monitoring configuration.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Live Production Metrics</h2>
          <p className="text-gray-600">Real-time monitoring of core KPIs</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-sm font-mono">{lastUpdated.toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* TTA P95 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TTA P95</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.tta.p95.toFixed(0)}ms
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getTTAStatus(metrics.tta.p95).color}>
                {getTTAStatus(metrics.tta.p95).status}
              </Badge>
              <p className="text-xs text-muted-foreground">
                Target: &lt;3s
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Success Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.success_rate.toFixed(1)}%
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getSuccessRateStatus(metrics.success_rate).color}>
                {getSuccessRateStatus(metrics.success_rate).status}
              </Badge>
              <p className="text-xs text-muted-foreground">
                Target: &gt;99%
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.active_users.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>

        {/* Throughput */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Throughput</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.throughput.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              req/sec
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed TTA Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Time to Answer (TTA) Distribution</CardTitle>
          <CardDescription>
            Response time percentiles and averages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {metrics.tta.p50.toFixed(0)}ms
              </div>
              <div className="text-sm text-muted-foreground">P50 (Median)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {metrics.tta.p95.toFixed(0)}ms
              </div>
              <div className="text-sm text-muted-foreground">P95</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {metrics.tta.p99.toFixed(0)}ms
              </div>
              <div className="text-sm text-muted-foreground">P99</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {metrics.tta.average.toFixed(0)}ms
              </div>
              <div className="text-sm text-muted-foreground">Average</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Total requests: {metrics.tta.total_requests.toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <Alert key={alert.id} variant={alert.type === 'critical' ? 'destructive' : 'default'}>
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <div className="font-medium">{alert.message}</div>
                      <div className="text-sm text-muted-foreground">
                        {alert.metric}: {alert.value} (threshold: {alert.threshold})
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>
            Key metrics over the last 24 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Chart visualization coming soon</p>
              <p className="text-sm">Historical data and trends</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
