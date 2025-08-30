"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  BarChart3,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface KPIMetric {
  id: string;
  name: string;
  description: string;
  value: number;
  unit: string;
  target?: number;
  status: 'good' | 'warning' | 'critical';
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
  changePercent?: number;
}

interface KPIDashboardData {
  version: string;
  lastUpdated: string;
  metrics: KPIMetric[];
  summary: {
    totalMetrics: number;
    goodMetrics: number;
    warningMetrics: number;
    criticalMetrics: number;
    overallHealth: 'healthy' | 'degraded' | 'critical';
  };
}

export function KPIDashboard() {
  const [data, setData] = useState<KPIDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchKPIData = async () => {
    try {
      const response = await fetch('/api/analytics/kpi?type=dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch KPI data');
      }
      
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch KPI data');
      }
    } catch (error) {
      console.error('Error fetching KPI data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch KPI data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchKPIData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchKPIData();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'critical':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-600 text-white';
      case 'warning':
        return 'bg-yellow-600 text-white';
      case 'critical':
        return 'bg-red-600 text-white';
      default:
        return 'bg-slate-600 text-white';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-slate-400" />;
      default:
        return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'text-green-400';
      case 'degraded':
        return 'text-yellow-400';
      case 'critical':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
        <span className="ml-2 text-slate-400">Loading KPI Dashboard...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center p-8">
        <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Failed to Load KPI Data</h3>
        <p className="text-slate-400 mb-4">Unable to fetch KPI dashboard data</p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            KPI Dashboard
          </h2>
          <p className="text-slate-400">
            Last updated: {new Date(data.lastUpdated).toLocaleString()}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-slate-400">Overall Health</p>
            <p className={`text-lg font-semibold ${getHealthColor(data.summary.overallHealth)}`}>
              {data.summary.overallHealth.toUpperCase()}
            </p>
          </div>
          
          <Button 
            onClick={handleRefresh} 
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Metrics</p>
                <p className="text-2xl font-bold text-white">{data.summary.totalMetrics}</p>
              </div>
              <Activity className="w-8 h-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Good</p>
                <p className="text-2xl font-bold text-green-400">{data.summary.goodMetrics}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Warning</p>
                <p className="text-2xl font-bold text-yellow-400">{data.summary.warningMetrics}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Critical</p>
                <p className="text-2xl font-bold text-red-400">{data.summary.criticalMetrics}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.metrics.map((metric) => (
          <Card key={metric.id} className="bg-slate-900/50 border-slate-700/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white">{metric.name}</CardTitle>
                <div className="flex items-center gap-2">
                  {getStatusIcon(metric.status)}
                  <Badge className={getStatusColor(metric.status)} variant="secondary">
                    {metric.status}
                  </Badge>
                </div>
              </div>
              <CardDescription className="text-slate-400">
                {metric.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">
                    {metric.value.toFixed(metric.unit === '%' ? 1 : 0)}
                    <span className="text-lg text-slate-400 ml-1">{metric.unit}</span>
                  </p>
                  {metric.target && (
                    <p className="text-sm text-slate-400">
                      Target: {metric.target}{metric.unit}
                    </p>
                  )}
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    {getTrendIcon(metric.trend)}
                    {metric.changePercent !== undefined && (
                      <span className={`text-sm ${
                        metric.changePercent > 0 ? 'text-green-400' : 
                        metric.changePercent < 0 ? 'text-red-400' : 'text-slate-400'
                      }`}>
                        {metric.changePercent > 0 ? '+' : ''}{metric.changePercent.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 capitalize">{metric.trend}</p>
                </div>
              </div>
              
              {metric.target && (
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      metric.status === 'good' ? 'bg-green-400' :
                      metric.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ 
                      width: `${Math.min((metric.value / metric.target) * 100, 100)}%` 
                    }}
                  />
                </div>
              )}
              
              <p className="text-xs text-slate-400">
                Updated: {new Date(metric.lastUpdated).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
