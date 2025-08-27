'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPICard } from '@/components/dashboard/KPICard';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { SLAAlerts } from '@/components/dashboard/SLAAlerts';
import { PerformanceInsights } from '@/components/dashboard/PerformanceInsights';
import { RunHistory } from '@/components/dashboard/RunHistory';
import { useAuth } from '@/hooks/use-auth';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface KPIMetrics {
  pass_rate_pct: number;
  sla_efficient_pct: number;
  p95_score: number;
  p95_tta: number;
  total_runs: number;
  successful_runs: number;
  efficient_runs: number;
  avg_score: number;
  avg_tta: number;
}

interface TrendData {
  dates: string[];
  passRates: number[];
  avgScores: number[];
  avgTTAs: number[];
  runCounts: number[];
}

interface SLAAlert {
  type: 'warning' | 'critical';
  message: string;
  metric: string;
  current: number;
  threshold: number;
}

interface PerformanceInsight {
  type: 'performance' | 'quality' | 'efficiency';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  recommendation: string;
}

export default function DashboardPage() {
  const { user, accessToken } = useAuth();
  const orgId = user?.id; // Use user ID as orgId for now
  const [metrics, setMetrics] = useState<KPIMetrics | null>(null);
  const [trends, setTrends] = useState<TrendData | null>(null);
  const [alerts, setAlerts] = useState<SLAAlert[]>([]);
  const [insights, setInsights] = useState<PerformanceInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!orgId || !accessToken) return;
    
    fetchDashboardData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [orgId, accessToken]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const headers = {
        'Authorization': `Bearer ${accessToken}`
      };
      
      // Fetch KPI metrics
      const metricsResponse = await fetch(`/api/dashboard/metrics?orgId=${orgId}`, { headers });
      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json();
        setMetrics(metricsData);
      }
      
      // Fetch trend data
      const trendsResponse = await fetch(`/api/dashboard/trends?orgId=${orgId}`, { headers });
      if (trendsResponse.ok) {
        const trendsData = await trendsResponse.json();
        setTrends(trendsData.trends);
      }
      
      // Fetch SLA alerts
      const alertsResponse = await fetch(`/api/dashboard/alerts?orgId=${orgId}`, { headers });
      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json();
        setAlerts(alertsData.alerts || []);
      }
      
      // Fetch performance insights
      const insightsResponse = await fetch(`/api/dashboard/insights?orgId=${orgId}`, { headers });
      if (insightsResponse.ok) {
        const insightsData = await insightsResponse.json();
        setInsights(insightsData.insights || []);
      }
      
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
    setIsRefreshing(false);
  };

  const retryDataLoad = () => {
    setError(null);
    fetchDashboardData();
  };

  // Show loading state while checking authentication
  if (!user || !accessToken) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>Please log in to access the dashboard.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Dashboard Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={retryDataLoad}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No dashboard data available</h3>
            <p className="text-gray-600 mb-4">Your dashboard metrics will appear here once you start using the platform</p>
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Monitor your prompt performance and system health
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

                 {/* KPI Overview */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           <KPICard
             title="Pass Rate"
             value={`${metrics.pass_rate_pct}%`}
             description="Successful runs"
             status={metrics.pass_rate_pct >= 99 ? 'success' : metrics.pass_rate_pct >= 90 ? 'warning' : 'error'}
             trend={trends ? trends.passRates : []}
           />
           <KPICard
             title="SLA Efficiency"
             value={`${metrics.sla_efficient_pct}%`}
             description="≤60s TTA"
             status={metrics.sla_efficient_pct >= 80 ? 'success' : metrics.sla_efficient_pct >= 60 ? 'warning' : 'error'}
             trend={trends ? trends.avgTTAs.map(t => t <= 60 ? 100 : 0) : []}
           />
           <KPICard
             title="P95 Score"
             value={metrics.p95_score.toString()}
             description="Quality threshold"
             status={metrics.p95_score >= 80 ? 'success' : metrics.p95_score >= 70 ? 'warning' : 'error'}
             trend={trends ? trends.avgScores : []}
           />
           <KPICard
             title="Total Runs"
             value={metrics.total_runs.toLocaleString()}
             description="Last 7 days"
             status="success"
             trend={trends ? trends.runCounts : []}
           />
         </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest prompt runs and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  {orgId ? (
                    <RunHistory orgId={orgId} />
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>Organization ID not available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Average Score</span>
                    <span className="font-semibold">{metrics.avg_score.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Average TTA</span>
                    <span className="font-semibold">{metrics.avg_tta.toFixed(1)}s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Success Rate</span>
                    <span className="font-semibold">{((metrics.successful_runs / metrics.total_runs) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Efficiency Rate</span>
                    <span className="font-semibold">{((metrics.efficient_runs / metrics.total_runs) * 100).toFixed(1)}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Track your metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                {trends ? (
                  <div className="space-y-6">
                    <TrendChart 
                      data={trends.passRates} 
                      labels={trends.dates} 
                      title="Pass Rate (%)" 
                      color="green" 
                    />
                    <TrendChart 
                      data={trends.avgScores} 
                      labels={trends.dates} 
                      title="Average Scores" 
                      color="blue" 
                    />
                    <TrendChart 
                      data={trends.avgTTAs} 
                      labels={trends.dates} 
                      title="Average TTA (seconds)" 
                      color="purple" 
                    />
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No trend data available yet</p>
                    <p className="text-sm">Start using the platform to see performance trends</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SLA Alerts</CardTitle>
                <CardDescription>Monitor system performance and SLA compliance</CardDescription>
              </CardHeader>
              <CardContent>
                {alerts.length > 0 ? (
                  <SLAAlerts alerts={alerts} />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <p>All systems operating normally</p>
                    <p className="text-sm">No SLA violations detected</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
                <CardDescription>AI-powered recommendations for improvement</CardDescription>
              </CardHeader>
              <CardContent>
                {insights.length > 0 ? (
                  <PerformanceInsights insights={insights} />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <RefreshCw className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No insights yet</h3>
                    <p className="text-gray-600 mb-4">Performance insights will appear here as you use the platform</p>
                    <button 
                      onClick={() => window.location.href = '/generator'}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Generate First Prompt
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
