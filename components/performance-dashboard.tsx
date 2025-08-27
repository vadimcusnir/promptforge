"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  DollarSign, 
  Users, 
  Zap,
  AlertTriangle,
  CheckCircle,
  BarChart3
} from "lucide-react"
import { 
  monitoringService, 
  getMetrics, 
  getDashboardData, 
  healthCheck 
} from "@/lib/monitoring"

interface DashboardData {
  business: {
    conversion_rate: number
    average_order_value: number
    churn_rate: number
    monthly_recurring_revenue: number
    customer_lifetime_value: number
  }
  performance: {
    page_load_time: number
    api_response_time: number
    checkout_completion_time: number
    error_rate: number
  }
  userBehavior: {
    plan_views: Record<string, number>
    plan_clicks: Record<string, number>
    checkout_starts: Record<string, number>
    checkout_completions: Record<string, number>
    feature_usage: Record<string, number>
  }
  summary: {
    totalErrors: number
    isHealthy: boolean
    lastUpdated: string
  }
}

export function PerformanceDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
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
      const data = getDashboardData()
      setDashboardData(data)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getHealthStatus = () => {
    if (!dashboardData) return { status: 'unknown', color: 'gray', icon: AlertTriangle }
    
    if (dashboardData.summary.isHealthy) {
      return { status: 'healthy', color: 'green', icon: CheckCircle }
    } else if (dashboardData.summary.totalErrors < 50) {
      return { status: 'warning', color: 'yellow', icon: AlertTriangle }
    } else {
      return { status: 'critical', color: 'red', icon: AlertTriangle }
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`
    return `${(ms / 1000).toFixed(2)}s`
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

  if (!dashboardData) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Dashboard Unavailable</h3>
          <p className="text-gray-600 mb-4">
            Unable to load performance metrics. Please check your connection and try again.
          </p>
          <Button onClick={loadDashboardData}>Retry</Button>
        </CardContent>
      </Card>
    )
  }

  const healthStatus = getHealthStatus()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Dashboard</h2>
          <p className="text-gray-600">
            Real-time metrics and system health monitoring
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge 
            variant={healthStatus.status === 'healthy' ? 'default' : 'destructive'}
            className="flex items-center gap-2"
          >
            <healthStatus.icon className="w-4 h-4" />
            {healthStatus.status.toUpperCase()}
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadDashboardData}
          >
            <Activity className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Conversion Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(dashboardData.business.conversion_rate)}
            </div>
            <p className="text-xs text-gray-600">
              Plan views to conversions
            </p>
          </CardContent>
        </Card>

        {/* Monthly Recurring Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MRR</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(dashboardData.business.monthly_recurring_revenue)}
            </div>
            <p className="text-xs text-gray-600">
              Monthly recurring revenue
            </p>
          </CardContent>
        </Card>

        {/* Average Order Value */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AOV</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(dashboardData.business.average_order_value)}
            </div>
            <p className="text-xs text-gray-600">
              Average order value
            </p>
          </CardContent>
        </Card>

        {/* Error Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(dashboardData.performance.error_rate)}
            </div>
            <p className="text-xs text-gray-600">
              Errors per 1000 requests
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="user-behavior">User Behavior</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
        </TabsList>

        {/* Performance Metrics */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Page Load Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Page Load Time
                </CardTitle>
                <CardDescription>
                  Average time to load pricing page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">
                  {formatTime(dashboardData.performance.page_load_time)}
                </div>
                <Progress 
                  value={Math.min((dashboardData.performance.page_load_time / 3000) * 100, 100)} 
                  className="w-full"
                />
                <p className="text-xs text-gray-600 mt-2">
                  Target: &lt;3s
                </p>
              </CardContent>
            </Card>

            {/* API Response Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  API Response Time
                </CardTitle>
                <CardDescription>
                  Average API response time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">
                  {formatTime(dashboardData.performance.api_response_time)}
                </div>
                <Progress 
                  value={Math.min((dashboardData.performance.api_response_time / 1000) * 100, 100)} 
                  className="w-full"
                />
                <p className="text-xs text-gray-600 mt-2">
                  Target: &lt;1s
                </p>
              </CardContent>
            </Card>

            {/* Checkout Completion Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Checkout Completion
                </CardTitle>
                <CardDescription>
                  Average checkout completion time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">
                  {formatTime(dashboardData.performance.checkout_completion_time)}
                </div>
                <Progress 
                  value={Math.min((dashboardData.performance.checkout_completion_time / 5000) * 100, 100)} 
                  className="w-full"
                />
                <p className="text-xs text-gray-600 mt-2">
                  Target: &lt;5s
                </p>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  System Health
                </CardTitle>
                <CardDescription>
                  Overall system status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">
                  {dashboardData.summary.totalErrors}
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Total Errors
                </p>
                <Badge 
                  variant={healthStatus.status === 'healthy' ? 'default' : 'destructive'}
                  className="w-full justify-center"
                >
                  {healthStatus.status.toUpperCase()}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Business Metrics */}
        <TabsContent value="business" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Lifetime Value */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Lifetime Value</CardTitle>
                <CardDescription>
                  Average customer value over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatCurrency(dashboardData.business.customer_lifetime_value)}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Based on current churn rate
                </p>
              </CardContent>
            </Card>

            {/* Churn Rate */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Churn Rate</CardTitle>
                <CardDescription>
                  Customer attrition rate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatPercentage(dashboardData.business.churn_rate)}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Target: &lt;5%
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Behavior */}
        <TabsContent value="user-behavior" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plan Views */}
            <Card>
              <CardHeader>
                <CardTitle>Plan Views</CardTitle>
                <CardDescription>
                  Total views per plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(dashboardData.userBehavior.plan_views).map(([plan, views]) => (
                    <div key={plan} className="flex justify-between items-center">
                      <span className="capitalize">{plan}</span>
                      <Badge variant="secondary">{views}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Checkout Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>Checkout Funnel</CardTitle>
                <CardDescription>
                  Conversion funnel metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(dashboardData.userBehavior.plan_views).map(([plan, views]) => {
                    const clicks = dashboardData.userBehavior.plan_clicks[plan] || 0
                    const starts = dashboardData.userBehavior.checkout_starts[plan] || 0
                    const completions = dashboardData.userBehavior.checkout_completions[plan] || 0
                    
                    return (
                      <div key={plan} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{plan}</span>
                          <span className="text-gray-600">
                            {views} → {clicks} → {starts} → {completions}
                          </span>
                        </div>
                        <Progress 
                          value={(completions / Math.max(views, 1)) * 100} 
                          className="w-full h-2"
                        />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Health */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                Real-time system health information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Monitoring Service</span>
                  <Badge variant={healthCheck() ? 'default' : 'destructive'}>
                    {healthCheck() ? 'Online' : 'Offline'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Last Updated</span>
                  <span className="text-sm text-gray-600">
                    {new Date(dashboardData.summary.lastUpdated).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Errors</span>
                  <Badge variant={dashboardData.summary.totalErrors < 10 ? 'default' : 'destructive'}>
                    {dashboardData.summary.totalErrors}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>System Status</span>
                  <Badge variant={dashboardData.summary.isHealthy ? 'default' : 'destructive'}>
                    {dashboardData.summary.isHealthy ? 'Healthy' : 'Issues Detected'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
