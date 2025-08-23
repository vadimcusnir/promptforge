'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IndustrialCard, IndustrialBadge, IndustrialProgress } from '@/components/industrial-ui';
import {
  telemetry,
  type PerformanceMetrics,
  type UserBehaviorMetrics,
  type SystemHealthMetrics,
} from '@/lib/telemetry';
import {
  Activity,
  BarChart3,
  Clock,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  Database,
  Cpu,
  HardDrive,
} from 'lucide-react';

export function AnalyticsDashboard() {
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [userBehaviorMetrics, setUserBehaviorMetrics] = useState<UserBehaviorMetrics | null>(null);
  const [systemHealthMetrics, setSystemHealthMetrics] = useState<SystemHealthMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateMetrics = () => {
      setPerformanceMetrics(telemetry.getPerformanceMetrics());
      setUserBehaviorMetrics(telemetry.getUserBehaviorMetrics());
      setSystemHealthMetrics(telemetry.getSystemHealthMetrics());
      setIsLoading(false);
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const getHealthStatus = (
    value: number,
    thresholds: { good: number; warning: number }
  ): {
    status: 'good' | 'warning' | 'critical';
    color: string;
    icon: React.ReactNode;
  } => {
    if (value <= thresholds.good) {
      return {
        status: 'good',
        color: 'text-green-400',
        icon: <CheckCircle className="w-4 h-4" />,
      };
    }
    if (value <= thresholds.warning) {
      return {
        status: 'warning',
        color: 'text-yellow-400',
        icon: <AlertTriangle className="w-4 h-4" />,
      };
    }
    return {
      status: 'critical',
      color: 'text-red-400',
      icon: <AlertTriangle className="w-4 h-4" />,
    };
  };

  if (isLoading) {
    return (
      <IndustrialCard className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          <span className="ml-3 text-white">Loading analytics...</span>
        </div>
      </IndustrialCard>
    );
  }

  return (
    <div className="space-y-6">
      <IndustrialCard variant="elevated" glow className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-400 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">
            Analytics Dashboard
          </h2>
          <IndustrialBadge variant="success" className="ml-auto">
            <Activity className="w-3 h-3 mr-1" />
            Live
          </IndustrialBadge>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="industrial-glass grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="industrial-tab">
              <Target className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="performance" className="industrial-tab">
              <Zap className="w-4 h-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="behavior" className="industrial-tab">
              User Behavior
            </TabsTrigger>
            <TabsTrigger value="system" className="industrial-tab">
              <Database className="w-4 h-4 mr-2" />
              System Health
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <IndustrialCard className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {userBehaviorMetrics?.promptsGenerated || 0}
                </div>
                <div className="text-sm text-slate-400">Prompts Generated</div>
              </IndustrialCard>

              <IndustrialCard className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {userBehaviorMetrics?.optimizationsUsed || 0}
                </div>
                <div className="text-sm text-slate-400">GPT Optimizations</div>
              </IndustrialCard>

              <IndustrialCard className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {userBehaviorMetrics?.testsExecuted || 0}
                </div>
                <div className="text-sm text-slate-400">Tests Executed</div>
              </IndustrialCard>

              <IndustrialCard className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {userBehaviorMetrics?.exportsCreated || 0}
                </div>
                <div className="text-sm text-slate-400">Exports Created</div>
              </IndustrialCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <IndustrialCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  Session Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Session Duration</span>
                    <span className="text-white font-semibold">
                      {formatDuration(userBehaviorMetrics?.sessionDuration || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Features Used</span>
                    <span className="text-white font-semibold">
                      {userBehaviorMetrics?.featuresUsed.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Modules Accessed</span>
                    <span className="text-white font-semibold">
                      {userBehaviorMetrics?.modulesUsed.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Vectors Used</span>
                    <span className="text-white font-semibold">
                      {userBehaviorMetrics?.vectorsUsed.length || 0}
                    </span>
                  </div>
                </div>
              </IndustrialCard>

              <IndustrialCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  System Status
                </h3>
                <div className="space-y-4">
                  {systemHealthMetrics && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Uptime</span>
                        <span className="text-white font-semibold">
                          {formatDuration(systemHealthMetrics.uptime)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Error Rate</span>
                        <div className="flex items-center gap-2">
                          {
                            getHealthStatus(systemHealthMetrics.errorRate, {
                              good: 1,
                              warning: 5,
                            }).icon
                          }
                          <span
                            className={`font-semibold ${
                              getHealthStatus(systemHealthMetrics.errorRate, {
                                good: 1,
                                warning: 5,
                              }).color
                            }`}
                          >
                            {systemHealthMetrics.errorRate.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Throughput</span>
                        <span className="text-white font-semibold">
                          {systemHealthMetrics.throughput.toFixed(1)} events/min
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Memory Usage</span>
                        <span className="text-white font-semibold">
                          {formatBytes(systemHealthMetrics.memoryUtilization)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </IndustrialCard>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {performanceMetrics && (
                <>
                  <IndustrialCard className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Zap className="w-5 h-5 text-blue-400" />
                      <h3 className="text-lg font-semibold text-white">Generation Performance</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">Prompt Generation</span>
                          <span className="text-white">
                            {Math.round(performanceMetrics.promptGenerationTime)}
                            ms
                          </span>
                        </div>
                        <IndustrialProgress
                          value={Math.min(
                            (performanceMetrics.promptGenerationTime / 2000) * 100,
                            100
                          )}
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">GPT Optimization</span>
                          <span className="text-white">
                            {Math.round(performanceMetrics.gptOptimizationTime)}
                            ms
                          </span>
                        </div>
                        <IndustrialProgress
                          value={Math.min(
                            (performanceMetrics.gptOptimizationTime / 5000) * 100,
                            100
                          )}
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">Test Execution</span>
                          <span className="text-white">
                            {Math.round(performanceMetrics.testExecutionTime)}ms
                          </span>
                        </div>
                        <IndustrialProgress
                          value={Math.min((performanceMetrics.testExecutionTime / 3000) * 100, 100)}
                        />
                      </div>
                    </div>
                  </IndustrialCard>

                  <IndustrialCard className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Cpu className="w-5 h-5 text-purple-400" />
                      <h3 className="text-lg font-semibold text-white">System Resources</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400 mb-1">
                          {formatBytes(performanceMetrics.memoryUsage)}
                        </div>
                        <div className="text-sm text-slate-400">Memory Usage</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-400 mb-1">
                          {performanceMetrics.cpuUsage.toFixed(1)}%
                        </div>
                        <div className="text-sm text-slate-400">CPU Usage</div>
                      </div>
                    </div>
                  </IndustrialCard>

                  <IndustrialCard className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      <h3 className="text-lg font-semibold text-white">Export Performance</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400 mb-1">
                          {Math.round(performanceMetrics.exportTime)}ms
                        </div>
                        <div className="text-sm text-slate-400">Average Export Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-amber-400 mb-1">
                          {Math.round(performanceMetrics.pageLoadTime)}ms
                        </div>
                        <div className="text-sm text-slate-400">Page Load Time</div>
                      </div>
                    </div>
                  </IndustrialCard>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <IndustrialCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  Feature Usage
                </h3>
                <div className="space-y-3">
                  {userBehaviorMetrics?.featuresUsed.slice(0, 8).map((feature, index) => (
                    <div key={feature} className="flex items-center justify-between">
                      <span className="text-slate-300 capitalize">
                        {feature.replace(/_/g, ' ')}
                      </span>
                      <IndustrialBadge variant="info" size="sm">
                        {index + 1}x
                      </IndustrialBadge>
                    </div>
                  ))}
                </div>
              </IndustrialCard>

              <IndustrialCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  Vector Distribution
                </h3>
                <div className="space-y-3">
                  {userBehaviorMetrics?.vectorsUsed.map(vector => (
                    <div key={vector} className="flex items-center justify-between">
                      <span className="text-slate-300">{vector}</span>
                      <IndustrialBadge variant="success" size="sm">
                        Active
                      </IndustrialBadge>
                    </div>
                  ))}
                </div>
              </IndustrialCard>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {systemHealthMetrics && (
                <>
                  <IndustrialCard className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {(100 - systemHealthMetrics.errorRate).toFixed(1)}%
                    </div>
                    <div className="text-sm text-slate-400">Success Rate</div>
                  </IndustrialCard>

                  <IndustrialCard className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {Math.round(systemHealthMetrics.responseTime)}ms
                    </div>
                    <div className="text-sm text-slate-400">Response Time</div>
                  </IndustrialCard>

                  <IndustrialCard className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <HardDrive className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {formatBytes(systemHealthMetrics.memoryUtilization)}
                    </div>
                    <div className="text-sm text-slate-400">Memory Used</div>
                  </IndustrialCard>

                  <IndustrialCard className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-400 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {systemHealthMetrics.throughput.toFixed(1)}
                    </div>
                    <div className="text-sm text-slate-400">Events/Min</div>
                  </IndustrialCard>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </IndustrialCard>
    </div>
  );
}
