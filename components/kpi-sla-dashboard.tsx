"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert as UIAlert, AlertDescription } from "@/components/ui/alert"
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  Target, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Zap,
  BarChart3,
  Gauge,
  Shield,
  Bell
} from "lucide-react"
import { 
  getKPIMetrics, 
  getActiveAlerts, 
  acknowledgeAlert, 
  forceTestAlert,
  startKPIMonitoring,
  stopKPIMonitoring,
  SLA_THRESHOLDS,
  type Alert as KPIAlert,
  type AlertSeverity
} from "@/lib/kpi-monitoring"

interface KPIMetrics {
  pass_rate_pct: number
  p95_tta_text: number
  p95_tta_sop: number
  p95_score: number
  webhook_fail_rate: number
  error_rate: number
  stripe_webhook_failures_per_min: number
  total_runs: number
  successful_runs: number
  failed_runs: number
  total_webhooks: number
  failed_webhooks: number
  last_updated: Date
}

export function KPISLADashboard() {
  const [metrics, setMetrics] = useState<KPIMetrics | null>(null)
  const [alerts, setAlerts] = useState<KPIAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    loadDashboardData()
    
    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1)
    }, 30000)

    return () => clearInterval(interval)
  }, [refreshKey])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      const kpiMetrics = getKPIMetrics()
      const activeAlerts = getActiveAlerts()
      
      setMetrics(kpiMetrics)
      setAlerts(activeAlerts)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMonitoring = () => {
    if (isMonitoring) {
      stopKPIMonitoring()
      setIsMonitoring(false)
    } else {
      startKPIMonitoring(60000) // 1 minute interval
      setIsMonitoring(true)
    }
  }

  const handleAcknowledgeAlert = (alertId: string) => {
    acknowledgeAlert(alertId, 'current_user') // Replace with actual user ID
    setAlerts(getActiveAlerts())
  }

  const handleTestAlert = () => {
    forceTestAlert('test_metric')
    setAlerts(getActiveAlerts())
  }

  const getStatusColor = (value: number, threshold: number, isLowerBetter: boolean = false) => {
    if (isLowerBetter) {
      return value <= threshold ? 'green' : value <= threshold * 1.2 ? 'yellow' : 'red'
    }
    return value >= threshold ? 'green' : value >= threshold * 0.8 ? 'yellow' : 'red'
  }

  const getStatusIcon = (value: number, threshold: number, isLowerBetter: boolean = false) => {
    const color = getStatusColor(value, threshold, isLowerBetter)
    switch (color) {
      case 'green': return CheckCircle
      case 'yellow': return AlertTriangle
      case 'red': return XCircle
      default: return Info
    }
  }

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'info': return 'blue'
      case 'warning': return 'yellow'
      case 'critical': return 'red'
      default: return 'gray'
    }
  }

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case 'info': return Info
      case 'warning': return AlertTriangle
      case 'critical': return XCircle
      default: return Info
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
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
      </div>
    )
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Dashboard Unavailable</h3>
          <p className="text-gray-600 mb-4">
            Unable to load KPI metrics. Please check your connection and try again.
          </p>
          <Button onClick={loadDashboardData}>Retry</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">KPI/SLA Dashboard</h2>
          <p className="text-gray-600">
            Real-time SLA compliance monitoring and alerting
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge 
            variant={isMonitoring ? 'default' : 'secondary'}
            className="flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            {isMonitoring ? 'Monitoring Active' : 'Monitoring Inactive'}
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleMonitoring}
          >
            {isMonitoring ? 'Stop' : 'Start'} Monitoring
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadDashboardData}
          >
            <Zap className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Bell className="w-5 h-5" />
              Active Alerts ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => {
                const SeverityIcon = getSeverityIcon(alert.severity)
                const severityColor = getSeverityColor(alert.severity)
                
                return (
                  <UIAlert key={alert.id} className={`border-${severityColor}-200 bg-${severityColor}-50`}>
                    <SeverityIcon className="w-4 h-4" />
                    <AlertDescription className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold">{alert.title}</span>
                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {alert.timestamp.toLocaleString()} • {alert.metric}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    </AlertDescription>
                  </UIAlert>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Pass Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.pass_rate_pct.toFixed(1)}%
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Progress 
                value={metrics.pass_rate_pct} 
                className="flex-1"
              />
              <Badge variant={getStatusColor(metrics.pass_rate_pct, SLA_THRESHOLDS.PASS_RATE) === 'green' ? 'default' : 'destructive'}>
                {SLA_THRESHOLDS.PASS_RATE}%
              </Badge>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Target: ≥{SLA_THRESHOLDS.PASS_RATE}%
            </p>
          </CardContent>
        </Card>

        {/* P95 TTA Text */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">P95 TTA (Text)</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.p95_tta_text}s
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Progress 
                value={Math.min((metrics.p95_tta_text / SLA_THRESHOLDS.P95_TTA_TEXT) * 100, 100)} 
                className="flex-1"
              />
              <Badge variant={getStatusColor(metrics.p95_tta_text, SLA_THRESHOLDS.P95_TTA_TEXT, true) === 'green' ? 'default' : 'destructive'}>
                {SLA_THRESHOLDS.P95_TTA_TEXT}s
              </Badge>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Target: ≤{SLA_THRESHOLDS.P95_TTA_TEXT}s
            </p>
          </CardContent>
        </Card>

        {/* P95 TTA SOP */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">P95 TTA (SOP)</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.p95_tta_sop}s
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Progress 
                value={Math.min((metrics.p95_tta_sop / SLA_THRESHOLDS.P95_TTA_SOP) * 100, 100)} 
                className="flex-1"
              />
              <Badge variant={getStatusColor(metrics.p95_tta_sop, SLA_THRESHOLDS.P95_TTA_SOP, true) === 'green' ? 'default' : 'destructive'}>
                {SLA_THRESHOLDS.P95_TTA_SOP}s
              </Badge>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Target: ≤{SLA_THRESHOLDS.P95_TTA_SOP}s
            </p>
          </CardContent>
        </Card>

        {/* P95 Score */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">P95 Score</CardTitle>
            <Gauge className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.p95_score}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Progress 
                value={Math.min((metrics.p95_score / SLA_THRESHOLDS.P95_SCORE) * 100, 100)} 
                className="flex-1"
              />
              <Badge variant={getStatusColor(metrics.p95_score, SLA_THRESHOLDS.P95_SCORE) === 'green' ? 'default' : 'destructive'}>
                {SLA_THRESHOLDS.P95_SCORE}
              </Badge>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Target: ≥{SLA_THRESHOLDS.P95_SCORE}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="reliability">Reliability</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
        </TabsList>

        {/* Performance Metrics */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Run Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Run Statistics
                </CardTitle>
                <CardDescription>
                  Total runs and success rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Runs</span>
                    <Badge variant="secondary">{metrics.total_runs}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Successful</span>
                    <Badge variant="default">{metrics.successful_runs}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Failed</span>
                    <Badge variant="destructive">{metrics.failed_runs}</Badge>
                  </div>
                  <Progress 
                    value={(metrics.successful_runs / Math.max(metrics.total_runs, 1)) * 100} 
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* TTA Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  TTA Distribution
                </CardTitle>
                <CardDescription>
                  Time to Answer percentiles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Text P95</span>
                    <Badge variant={getStatusColor(metrics.p95_tta_text, SLA_THRESHOLDS.P95_TTA_TEXT, true) === 'green' ? 'default' : 'destructive'}>
                      {metrics.p95_tta_text}s
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>SOP P95</span>
                    <Badge variant={getStatusColor(metrics.p95_tta_sop, SLA_THRESHOLDS.P95_TTA_SOP, true) === 'green' ? 'default' : 'destructive'}>
                      {metrics.p95_tta_sop}s
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600">
                    P95 = 95% of responses are faster than this value
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reliability Metrics */}
        <TabsContent value="reliability" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Error Rate */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Error Rate
                </CardTitle>
                <CardDescription>
                  System error rate monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">
                  {metrics.error_rate.toFixed(2)}%
                </div>
                <Progress 
                  value={Math.min((metrics.error_rate / SLA_THRESHOLDS.ERROR_RATE) * 100, 100)} 
                  className="w-full"
                />
                <p className="text-xs text-gray-600 mt-2">
                  Target: &lt;{SLA_THRESHOLDS.ERROR_RATE}%
                </p>
                <Badge 
                  variant={getStatusColor(metrics.error_rate, SLA_THRESHOLDS.ERROR_RATE, true) === 'green' ? 'default' : 'destructive'}
                  className="mt-2"
                >
                  {getStatusColor(metrics.error_rate, SLA_THRESHOLDS.ERROR_RATE, true) === 'green' ? 'Compliant' : 'Non-Compliant'}
                </Badge>
              </CardContent>
            </Card>

            {/* Score Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="w-5 h-5" />
                  Score Distribution
                </CardTitle>
                <CardDescription>
                  Quality score monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">
                  {metrics.p95_score}
                </div>
                <Progress 
                  value={Math.min((metrics.p95_score / SLA_THRESHOLDS.P95_SCORE) * 100, 100)} 
                  className="w-full"
                />
                <p className="text-xs text-gray-600 mt-2">
                  Target: ≥{SLA_THRESHOLDS.P95_SCORE}
                </p>
                <Badge 
                  variant={getStatusColor(metrics.p95_score, SLA_THRESHOLDS.P95_SCORE) === 'green' ? 'default' : 'destructive'}
                  className="mt-2"
                >
                  {getStatusColor(metrics.p95_score, SLA_THRESHOLDS.P95_SCORE) === 'green' ? 'Compliant' : 'Non-Compliant'}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Webhook Metrics */}
        <TabsContent value="webhooks" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Webhook Fail Rate */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Webhook Fail Rate
                </CardTitle>
                <CardDescription>
                  Overall webhook reliability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">
                  {metrics.webhook_fail_rate.toFixed(2)}%
                </div>
                <Progress 
                  value={Math.min((metrics.webhook_fail_rate / SLA_THRESHOLDS.WEBHOOK_FAIL_RATE) * 100, 100)} 
                  className="w-full"
                />
                <p className="text-xs text-gray-600 mt-2">
                  Target: &lt;{SLA_THRESHOLDS.WEBHOOK_FAIL_RATE}%
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Webhooks</span>
                    <span>{metrics.total_webhooks}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Failed</span>
                    <span className="text-red-600">{metrics.failed_webhooks}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stripe Webhook Failures */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Stripe Webhook Failures
                </CardTitle>
                <CardDescription>
                  Per-minute failure rate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">
                  {metrics.stripe_webhook_failures_per_min}/min
                </div>
                <Progress 
                  value={Math.min((metrics.stripe_webhook_failures_per_min / SLA_THRESHOLDS.STRIPE_WEBHOOK_FAILURES) * 100, 100)} 
                  className="w-full"
                />
                <p className="text-xs text-gray-600 mt-2">
                  Target: &lt;{SLA_THRESHOLDS.STRIPE_WEBHOOK_FAILURES}/min
                </p>
                <Badge 
                  variant={getStatusColor(metrics.stripe_webhook_failures_per_min, SLA_THRESHOLDS.STRIPE_WEBHOOK_FAILURES, true) === 'green' ? 'default' : 'destructive'}
                  className="mt-2"
                >
                  {getStatusColor(metrics.stripe_webhook_failures_per_min, SLA_THRESHOLDS.STRIPE_WEBHOOK_FAILURES, true) === 'green' ? 'Compliant' : 'Non-Compliant'}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Testing Tools */}
        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Testing & Verification</CardTitle>
              <CardDescription>
                Tools to test the monitoring system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button onClick={handleTestAlert} variant="outline">
                  <Bell className="w-4 h-4 mr-2" />
                  Force Test Alert
                </Button>
                <Button onClick={loadDashboardData} variant="outline">
                  <Zap className="w-4 h-4 mr-2" />
                  Refresh Metrics
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                <p>• Test Alert: Creates a test alert to verify the alerting system</p>
                <p>• Refresh Metrics: Manually updates all KPI metrics</p>
                <p>• Monitoring Status: {isMonitoring ? 'Active' : 'Inactive'}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        <p>Last updated: {metrics.last_updated.toLocaleString()}</p>
        <p>Monitoring interval: {isMonitoring ? '1 minute' : 'Manual'}</p>
      </div>
    </div>
  )
}
