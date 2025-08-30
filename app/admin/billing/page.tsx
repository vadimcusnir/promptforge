"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle,
  BarChart3,
  Activity
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface PaymentMetrics {
  totalRevenue: number
  newSubscriptions: number
  cancelledSubscriptions: number
  activeSubscriptions: number
  churnRate: number
  mrr: number
  arr: number
  averageRevenuePerUser: number
  conversionRate: number
  revenueGrowthPercent: number
  mrrGrowthPercent: number
}

interface ConversionFunnel {
  checkoutStarted: number
  checkoutCompleted: number
  subscriptionCreated: number
  checkoutToCompletedRate: number
  completedToSubscriptionRate: number
  overallConversionRate: number
}

interface PlanPerformance {
  [planId: string]: {
    subscriptions: number
    revenue: number
    avgRevenue: number
  }
}

interface PaymentAlert {
  id: string
  alertType: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  isResolved: boolean
  createdAt: string
}

export default function BillingAdminPage() {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState<PaymentMetrics | null>(null)
  const [funnel, setFunnel] = useState<ConversionFunnel | null>(null)
  const [planPerformance, setPlanPerformance] = useState<PlanPerformance | null>(null)
  const [alerts, setAlerts] = useState<PaymentAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })

  // Check if user is admin
  useEffect(() => {
    if (user && !user.isAdmin) {
      window.location.href = '/dashboard'
    }
  }, [user])

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user?.isAdmin) return

      try {
        setLoading(true)
        
        // Fetch overview metrics
        const metricsResponse = await fetch(
          `/api/billing/analytics?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}&metric=overview`
        )
        const metricsData = await metricsResponse.json()
        
        if (metricsData.success && metricsData.data.length > 0) {
          const latestMetrics = metricsData.data[metricsData.data.length - 1]
          setMetrics({
            totalRevenue: latestMetrics.total_revenue || 0,
            newSubscriptions: latestMetrics.new_subscriptions || 0,
            cancelledSubscriptions: latestMetrics.cancelled_subscriptions || 0,
            activeSubscriptions: latestMetrics.active_subscriptions || 0,
            churnRate: latestMetrics.churn_rate || 0,
            mrr: latestMetrics.mrr || 0,
            arr: latestMetrics.arr || 0,
            averageRevenuePerUser: latestMetrics.average_revenue_per_user || 0,
            conversionRate: latestMetrics.conversion_rate || 0,
            revenueGrowthPercent: latestMetrics.revenue_growth_percent || 0,
            mrrGrowthPercent: latestMetrics.mrr_growth_percent || 0
          })
        }

        // Fetch conversion funnel
        const funnelResponse = await fetch(
          `/api/billing/analytics?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}&metric=funnel`
        )
        const funnelData = await funnelResponse.json()
        
        if (funnelData.success) {
          setFunnel(funnelData.data)
        }

        // Fetch plan performance
        const plansResponse = await fetch(
          `/api/billing/analytics?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}&metric=plans`
        )
        const plansData = await plansResponse.json()
        
        if (plansData.success) {
          setPlanPerformance(plansData.data)
        }

        // Fetch alerts
        const alertsResponse = await fetch('/api/admin/alerts')
        const alertsData = await alertsResponse.json()
        
        if (alertsData.success) {
          setAlerts(alertsData.alerts)
        }

      } catch (error) {
        console.error('Failed to fetch analytics data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [user, dateRange])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600'
      case 'high': return 'bg-orange-600'
      case 'medium': return 'bg-yellow-600'
      case 'low': return 'bg-blue-600'
      default: return 'bg-gray-600'
    }
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
            <CardDescription className="text-center">
              You don&apos;t have permission to access this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading billing analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Billing Analytics Dashboard</h1>
          <p className="text-gray-400">Monitor payment metrics, conversion rates, and subscription health</p>
        </div>

        {/* Date Range Selector */}
        <div className="mb-6 flex gap-4 items-center">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
            />
          </div>
        </div>

        {/* Key Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
                <div className="flex items-center text-xs">
                  {metrics.revenueGrowthPercent >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-400 mr-1" />
                  )}
                  <span className={metrics.revenueGrowthPercent >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {formatPercentage(Math.abs(metrics.revenueGrowthPercent))}
                  </span>
                  <span className="text-gray-400 ml-1">vs previous day</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
                <BarChart3 className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(metrics.mrr)}</div>
                <div className="flex items-center text-xs">
                  {metrics.mrrGrowthPercent >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-400 mr-1" />
                  )}
                  <span className={metrics.mrrGrowthPercent >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {formatPercentage(Math.abs(metrics.mrrGrowthPercent))}
                  </span>
                  <span className="text-gray-400 ml-1">vs previous day</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                <Users className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.activeSubscriptions.toLocaleString()}</div>
                <div className="text-xs text-gray-400">
                  {metrics.newSubscriptions} new, {metrics.cancelledSubscriptions} cancelled
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
                <Activity className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPercentage(metrics.churnRate)}</div>
                <div className="text-xs text-gray-400">
                  {metrics.churnRate < 5 ? 'Healthy' : metrics.churnRate < 10 ? 'Warning' : 'Critical'}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
            <TabsTrigger value="plans">Plan Performance</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Revenue Metrics</CardTitle>
                  <CardDescription>Key financial indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Annual Recurring Revenue (ARR)</span>
                    <span className="font-semibold">{formatCurrency(metrics?.arr || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Revenue Per User</span>
                    <span className="font-semibold">{formatCurrency(metrics?.averageRevenuePerUser || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conversion Rate</span>
                    <span className="font-semibold">{formatPercentage(metrics?.conversionRate || 0)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Subscription Health</CardTitle>
                  <CardDescription>Subscription lifecycle metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>New Subscriptions</span>
                    <span className="font-semibold text-green-400">{metrics?.newSubscriptions || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cancelled Subscriptions</span>
                    <span className="font-semibold text-red-400">{metrics?.cancelledSubscriptions || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net Growth</span>
                    <span className={`font-semibold ${(metrics?.newSubscriptions || 0) - (metrics?.cancelledSubscriptions || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(metrics?.newSubscriptions || 0) - (metrics?.cancelledSubscriptions || 0)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="funnel" className="space-y-6">
            {funnel && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Conversion Funnel</CardTitle>
                  <CardDescription>User journey from checkout to subscription</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">1</span>
                        </div>
                        <span>Checkout Started</span>
                      </div>
                      <span className="text-2xl font-bold">{funnel.checkoutStarted}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">2</span>
                        </div>
                        <span>Checkout Completed</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold">{funnel.checkoutCompleted}</span>
                        <div className="text-sm text-gray-400">
                          {formatPercentage(funnel.checkoutToCompletedRate)} conversion
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">3</span>
                        </div>
                        <span>Subscription Created</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold">{funnel.subscriptionCreated}</span>
                        <div className="text-sm text-gray-400">
                          {formatPercentage(funnel.completedToSubscriptionRate)} conversion
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-yellow-600/20 border border-yellow-600/30 rounded-lg">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-400">
                          {formatPercentage(funnel.overallConversionRate)}
                        </div>
                        <div className="text-sm text-gray-300">Overall Conversion Rate</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="plans" className="space-y-6">
            {planPerformance && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(planPerformance).map(([planId, stats]) => (
                  <Card key={planId} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="capitalize">{planId} Plan</CardTitle>
                      <CardDescription>Performance metrics</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Subscriptions</span>
                        <span className="font-semibold">{stats.subscriptions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Revenue</span>
                        <span className="font-semibold">{formatCurrency(stats.revenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Revenue</span>
                        <span className="font-semibold">{formatCurrency(stats.avgRevenue)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Payment Alerts</CardTitle>
                <CardDescription>System alerts and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                {alerts.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <p className="text-gray-400">No active alerts</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="flex items-start space-x-4 p-4 bg-gray-700 rounded-lg">
                        <div className={`w-3 h-3 rounded-full mt-1 ${getSeverityColor(alert.severity)}`}></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{alert.title}</h4>
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-sm mt-1">{alert.description}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(alert.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {!alert.isResolved && (
                          <Button size="sm" variant="outline">
                            Resolve
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
