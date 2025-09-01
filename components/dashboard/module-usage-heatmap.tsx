'use client'

import { useState, useMemo, useCallback } from 'react'
import { useTelemetry } from '@/hooks/use-telemetry'
import { TrendingUp, TrendingDown, Activity, Clock, Users, Zap } from 'lucide-react'

interface ModuleUsage {
  module_id: string
  module_name: string
  category: string
  usage_count: number
  success_rate: number
  avg_score: number
  last_used: string
  trend_7d: number
  trend_30d: number
  unique_users: number
  total_runs: number
}

interface ModuleUsageHeatmapProps {
  modules: ModuleUsage[]
  timeRange: '7d' | '30d' | '90d'
  onTimeRangeChange: (range: '7d' | '30d' | '90d') => void
  onModuleClick: (moduleId: string) => void
  loading?: boolean
  error?: string
}

export function ModuleUsageHeatmap({
  modules,
  timeRange,
  onTimeRangeChange,
  onModuleClick,
  loading = false,
  error
}: ModuleUsageHeatmapProps) {
  const [viewMode, setViewMode] = useState<'heatmap' | 'list' | 'trends'>('heatmap')
  const [sortBy, setSortBy] = useState<'usage' | 'score' | 'trend' | 'name'>('usage')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const { trackUserAction } = useTelemetry()

  // Process modules data for different views
  const processedModules = useMemo(() => {
    return modules
      .map(module => {
        const trend = timeRange === '7d' ? module.trend_7d : module.trend_30d
        return {
          ...module,
          trend,
          normalized_usage: Math.log10(module.usage_count + 1), // Log scale for better visualization
          success_color: getSuccessColor(module.success_rate),
          trend_color: getTrendColor(trend),
          score_color: getScoreColor(module.avg_score)
        }
      })
      .sort((a, b) => {
        let aVal: any, bVal: any
        
        switch (sortBy) {
          case 'usage':
            aVal = a.usage_count
            bVal = b.usage_count
            break
          case 'score':
            aVal = a.avg_score
            bVal = b.avg_score
            break
          case 'trend':
            aVal = a.trend
            bVal = b.trend
            break
          case 'name':
            aVal = a.module_name.toLowerCase()
            bVal = b.module_name.toLowerCase()
            break
          default:
            return 0
        }

        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
  }, [modules, timeRange, sortBy, sortOrder])

  const handleModuleClick = useCallback((moduleId: string) => {
    trackUserAction('module_clicked', { module_id: moduleId, view_mode: viewMode })
    onModuleClick(moduleId)
  }, [onModuleClick, viewMode, trackUserAction])

  const handleViewModeChange = useCallback((mode: typeof viewMode) => {
    setViewMode(mode)
    trackUserAction('view_mode_changed', { view_mode: mode })
  }, [trackUserAction])

  const handleSort = useCallback((column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }, [sortBy])

  // Helper functions for color coding
  function getSuccessColor(rate: number) {
    if (rate >= 0.9) return 'bg-green-500'
    if (rate >= 0.7) return 'bg-yellow-500'
    if (rate >= 0.5) return 'bg-orange-500'
    return 'bg-red-500'
  }

  function getTrendColor(trend: number) {
    if (trend > 0.1) return 'text-green-500'
    if (trend < -0.1) return 'text-red-500'
    return 'text-gray-500'
  }

  function getScoreColor(score: number) {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  function formatTrend(trend: number) {
    const percentage = Math.abs(trend * 100)
    const direction = trend > 0 ? '+' : trend < 0 ? '-' : ''
    return `${direction}${percentage.toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Activity className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-300 mb-2">Failed to load module usage</h3>
        <p className="text-gray-400">{error}</p>
      </div>
    )
  }

  if (modules.length === 0) {
    return (
      <div className="text-center py-12">
        <Zap className="mx-auto h-12 w-12 text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-300 mb-2">No module usage data</h3>
        <p className="text-gray-400">Start using modules to see usage analytics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-400">Time Range:</label>
            <select
              value={timeRange}
              onChange={(e) => onTimeRangeChange(e.target.value as '7d' | '30d' | '90d')}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-400">View:</label>
            <div className="flex bg-gray-800 rounded p-1">
              {(['heatmap', 'list', 'trends'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleViewModeChange(mode)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    viewMode === mode
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-400">
          {modules.length} modules • {modules.reduce((sum, m) => sum + m.usage_count, 0)} total uses
        </div>
      </div>

      {/* Heatmap View */}
      {viewMode === 'heatmap' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {processedModules.map((module) => (
            <div
              key={module.module_id}
              onClick={() => handleModuleClick(module.module_id)}
              className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white truncate group-hover:text-blue-400">
                  {module.module_name}
                </h3>
                <div className={`w-3 h-3 rounded-full ${module.success_color}`} />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Usage</span>
                  <span className="text-white font-medium">{module.usage_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Success Rate</span>
                  <span className="text-white">{(module.success_rate * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Score</span>
                  <span className={module.score_color}>{module.avg_score.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Trend</span>
                  <span className={`flex items-center ${module.trend_color}`}>
                    {module.trend > 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : module.trend < 0 ? (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    ) : null}
                    {formatTrend(module.trend)}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {module.unique_users}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(module.last_used).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-medium text-gray-400 border-b border-gray-700">
            <div className="col-span-4">
              <button
                onClick={() => handleSort('name')}
                className="flex items-center space-x-1 hover:text-white transition-colors"
              >
                <span>Module</span>
                {sortBy === 'name' && (
                  <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </button>
            </div>
            <div className="col-span-2">
              <button
                onClick={() => handleSort('usage')}
                className="flex items-center space-x-1 hover:text-white transition-colors"
              >
                <span>Usage</span>
                {sortBy === 'usage' && (
                  <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </button>
            </div>
            <div className="col-span-2">
              <button
                onClick={() => handleSort('score')}
                className="flex items-center space-x-1 hover:text-white transition-colors"
              >
                <span>Avg Score</span>
                {sortBy === 'score' && (
                  <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </button>
            </div>
            <div className="col-span-2">
              <button
                onClick={() => handleSort('trend')}
                className="flex items-center space-x-1 hover:text-white transition-colors"
              >
                <span>Trend</span>
                {sortBy === 'trend' && (
                  <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </button>
            </div>
            <div className="col-span-2">Success Rate</div>
          </div>

          {processedModules.map((module) => (
            <div
              key={module.module_id}
              onClick={() => handleModuleClick(module.module_id)}
              className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <div className="col-span-4">
                <div className="text-white font-medium">{module.module_name}</div>
                <div className="text-xs text-gray-400">{module.category}</div>
              </div>
              <div className="col-span-2 text-white">{module.usage_count}</div>
              <div className={`col-span-2 ${module.score_color}`}>
                {module.avg_score.toFixed(1)}
              </div>
              <div className={`col-span-2 flex items-center ${module.trend_color}`}>
                {module.trend > 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : module.trend < 0 ? (
                  <TrendingDown className="h-4 w-4 mr-1" />
                ) : null}
                {formatTrend(module.trend)}
              </div>
              <div className="col-span-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${module.success_color}`}
                      style={{ width: `${module.success_rate * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">
                    {(module.success_rate * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trends View */}
      {viewMode === 'trends' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Performers */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-4">Top Performers</h3>
              <div className="space-y-3">
                {processedModules
                  .filter(m => m.trend > 0)
                  .slice(0, 5)
                  .map((module) => (
                    <div key={module.module_id} className="flex items-center justify-between">
                      <span className="text-white truncate">{module.module_name}</span>
                      <span className="text-green-500 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {formatTrend(module.trend)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Declining Usage */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-4">Declining Usage</h3>
              <div className="space-y-3">
                {processedModules
                  .filter(m => m.trend < 0)
                  .slice(0, 5)
                  .map((module) => (
                    <div key={module.module_id} className="flex items-center justify-between">
                      <span className="text-white truncate">{module.module_name}</span>
                      <span className="text-red-500 flex items-center">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        {formatTrend(module.trend)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-4">Category Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(
                processedModules.reduce((acc, module) => {
                  if (!acc[module.category]) {
                    acc[module.category] = { count: 0, usage: 0, avgScore: 0 }
                  }
                  acc[module.category].count++
                  acc[module.category].usage += module.usage_count
                  acc[module.category].avgScore += module.avg_score
                  return acc
                }, {} as Record<string, { count: number; usage: number; avgScore: number }>)
              ).map(([category, stats]) => (
                <div key={category} className="text-center">
                  <div className="text-2xl font-bold text-white">{stats.count}</div>
                  <div className="text-sm text-gray-400">{category}</div>
                  <div className="text-xs text-gray-500">
                    {(stats.avgScore / stats.count).toFixed(1)} avg score
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
