'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Zap,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  RefreshCw,
} from 'lucide-react';
import { agentWatch, type AnomalyAlert } from '@/lib/observability/agent-watch';
import { auditLogger, type AuditLogEntry } from '@/lib/observability/audit-logger';

interface MonitoringMetrics {
  agentStatus: {
    enabled: boolean;
    degradationMode: boolean;
    totalRuns: number;
    recentAlerts: number;
  };
  performance: {
    avgTokens: number;
    avgCost: number;
    avgScore: number;
    errorRate: number;
  };
  auditStats: {
    total_runs: number;
    pass_rate: number;
    avg_duration_ms: number;
    error_rate: number;
  };
  recentAlerts: AnomalyAlert[];
  recentLogs: AuditLogEntry[];
}

export function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<MonitoringMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const updateMetrics = () => {
    try {
      const agentSummary = agentWatch.getMetricsSummary();
      const auditStats = auditLogger.getStatistics({ limit: 100 });
      const recentLogs = auditLogger.queryLogs({ limit: 10 });

      setMetrics({
        agentStatus: {
          enabled: agentWatch.constructor.areAgentsEnabled(),
          degradationMode: agentSummary.degradationMode,
          totalRuns: agentSummary.totalRuns,
          recentAlerts: agentSummary.recentAlerts,
        },
        performance: {
          avgTokens: agentSummary.avgTokens,
          avgCost: agentSummary.avgCost,
          avgScore: agentSummary.avgScore,
          errorRate: agentSummary.errorRate,
        },
        auditStats,
        recentAlerts: [], // Would be populated from alert system
        recentLogs,
      });

      setLastUpdate(new Date());
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to update monitoring metrics:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    updateMetrics();

    if (autoRefresh) {
      const interval = setInterval(updateMetrics, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getStatusColor = (enabled: boolean, degradationMode: boolean) => {
    if (!enabled) return 'destructive';
    if (degradationMode) return 'warning';
    return 'default';
  };

  const getStatusText = (enabled: boolean, degradationMode: boolean) => {
    if (!enabled) return 'DISABLED';
    if (degradationMode) return 'DEGRADED';
    return 'OPERATIONAL';
  };

  const formatCurrency = (value: number) => `$${value.toFixed(4)}`;
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;
  const formatNumber = (value: number) => value.toLocaleString();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading monitoring data...</span>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Monitoring Unavailable</AlertTitle>
        <AlertDescription>
          Failed to load monitoring data. Please check system configuration.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Monitoring</h1>
          <p className="text-muted-foreground">
            Real-time observability and agent health monitoring
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setAutoRefresh(!autoRefresh)}>
            {autoRefresh ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
          </Button>
          <Button variant="outline" size="sm" onClick={updateMetrics}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <span className="text-xs text-muted-foreground">
            Last update: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agent Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant={getStatusColor(
                metrics.agentStatus.enabled,
                metrics.agentStatus.degradationMode
              )}
            >
              {getStatusText(metrics.agentStatus.enabled, metrics.agentStatus.degradationMode)}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics.agentStatus.totalRuns)}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.auditStats.total_runs} in audit log
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(metrics.auditStats.pass_rate)}
            </div>
            <Progress value={metrics.auditStats.pass_rate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.agentStatus.recentAlerts}</div>
            <p className="text-xs text-muted-foreground">Last hour</p>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      {metrics.agentStatus.recentAlerts > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>System Alerts Detected</AlertTitle>
          <AlertDescription>
            {metrics.agentStatus.recentAlerts} alerts in the last hour. Check the alerts tab for
            details.
          </AlertDescription>
        </Alert>
      )}

      {!metrics.agentStatus.enabled && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Kill-Switch Activated</AlertTitle>
          <AlertDescription>
            Agent execution has been disabled. All agent-related operations are blocked.
          </AlertDescription>
        </Alert>
      )}

      {metrics.agentStatus.degradationMode && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Degradation Mode Active</AlertTitle>
          <AlertDescription>
            System is running in degradation mode. Live testing is disabled, simulation only.
          </AlertDescription>
        </Alert>
      )}

      {/* Detailed Metrics */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Tokens</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(metrics.performance.avgTokens)}
                </div>
                <p className="text-xs text-muted-foreground">per run</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Cost</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(metrics.performance.avgCost)}
                </div>
                <p className="text-xs text-muted-foreground">per run</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.performance.avgScore.toFixed(1)}</div>
                <Progress value={metrics.performance.avgScore} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPercentage(metrics.performance.errorRate)}
                </div>
                <Progress value={metrics.performance.errorRate} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Audit Logs</CardTitle>
              <CardDescription>Latest run executions and their outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.recentLogs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No recent logs available</p>
                ) : (
                  metrics.recentLogs.map(log => (
                    <div
                      key={log.run_id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {log.verdict === 'pass' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : log.verdict === 'partial_pass' ? (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium">{log.module_id}</p>
                          <p className="text-sm text-muted-foreground">
                            {log.run_id.substring(0, 8)}... • {log.model}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(log.cost)}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(log.tokens)} tokens
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Anomaly detection and system warnings</CardDescription>
            </CardHeader>
            <CardContent>
              {metrics.recentAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-medium">All Systems Operational</p>
                  <p className="text-muted-foreground">No recent alerts detected</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {metrics.recentAlerts.map((alert, index) => (
                    <Alert
                      key={index}
                      variant={alert.severity === 'critical' ? 'destructive' : 'default'}
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>{alert.type.replace('_', ' ').toUpperCase()}</AlertTitle>
                      <AlertDescription>
                        {alert.message}
                        <br />
                        <span className="text-xs">
                          Run: {alert.metrics.runId} • {alert.timestamp.toLocaleString()}
                        </span>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Agents Enabled:</span>
                  <Badge variant={metrics.agentStatus.enabled ? 'default' : 'destructive'}>
                    {metrics.agentStatus.enabled ? 'YES' : 'NO'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Degradation Mode:</span>
                  <Badge variant={metrics.agentStatus.degradationMode ? 'warning' : 'default'}>
                    {metrics.agentStatus.degradationMode ? 'ACTIVE' : 'INACTIVE'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Auto-refresh:</span>
                  <Badge variant={autoRefresh ? 'default' : 'secondary'}>
                    {autoRefresh ? 'ON' : 'OFF'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Avg Duration:</span>
                  <span>{(metrics.auditStats.avg_duration_ms / 1000).toFixed(1)}s</span>
                </div>
                <div className="flex justify-between">
                  <span>Error Rate:</span>
                  <span>{formatPercentage(metrics.auditStats.error_rate)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Runs:</span>
                  <span>{formatNumber(metrics.auditStats.total_runs)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
