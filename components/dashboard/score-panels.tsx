'use client'

import { useState, useMemo, useCallback } from 'react'
import { useTelemetry } from '@/hooks/use-telemetry'
import { useEntitlements } from '@/hooks/use-entitlements'
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  BarChart3,
  Zap,
  Clock,
  Users,
  Award,
  RefreshCw
} from 'lucide-react'

interface ScoreData {
  current_score: number
  target_score: number
  trend_7d: number
  trend_30d: number
  total_runs: number
  successful_runs: number
  failed_runs: number
  avg_response_time: number
  quality_metrics: {
    clarity: number
    relevance: number
    completeness: number
    consistency: number
  }
  recent_scores: Array<{
    date: string
    score: number
    run_id: string
  }>
}

interface ScorePanelsProps {
  scoreData: ScoreData
  onTightenPrompt: () => void
  onRerunTest: () => void
  onViewDetails: (runId: string) => void
  loading?: boolean
  error?: string
}

export function ScorePanels({
  scoreData,
  onTightenPrompt,
  onRerunTest,
  onViewDetails,
  loading = false,
  error
}: ScorePanelsProps) {
  const [selectedMetric, setSelectedMetric] = useState<keyof ScoreData['quality_metrics']>('clarity')
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d')

  const { entitlements } = useEntitlements()
  const { trackUserAction, trackTightenPromptClick } = useTelemetry()

  // Calculate derived metrics
  const metrics = useMemo(() => {
    const successRate = scoreData.total_runs > 0 ? scoreData.successful_runs / scoreData.total_runs : 0
    const failureRate = scoreData.total_runs > 0 ? scoreData.failed_runs / scoreData.total_runs : 0
    const trend = timeRange === '7d' ? scoreData.trend_7d : scoreData.trend_30d
    const isImproving = trend > 0
    const needsImprovement = scoreData.current_score < 80
    const canExport = scoreData.current_score >= 80 && entitlements.canExportPDF

    return {
      successRate,
      failureRate,
      trend,
      isImproving,
      needsImprovement,
      canExport,
      trendDirection: trend > 0.1 ? 'up' : trend < -0.1 ? 'down' : 'stable'
    }
  }, [scoreData, timeRange, entitlements])

  const handleTightenPrompt = useCallback(() => {
    trackTightenPromptClick({
      current_score: scoreData.current_score,
      target_score: scoreData.target_score,
      trend: metrics.trend
    })
    onTightenPrompt()
  }, [scoreData, metrics.trend, onTightenPrompt, trackTightenPromptClick])

  const handleRerunTest = useCallback(() => {
    trackUserAction('rerun_test_clicked', {
      current_score: scoreData.current_score,
      run_count: scoreData.total_runs
    })
    onRerunTest()
  }, [scoreData, onRerunTest, trackUserAction])

  const handleMetricSelect = useCallback((metric: keyof ScoreData['quality_metrics']) => {
    setSelectedMetric(metric)
    trackUserAction('metric_selected', { metric })
  }, [trackUserAction])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/20'
    if (score >= 60) return 'bg-yellow-500/20'
    return 'bg-red-500/20'
  }

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return TrendingUp
      case 'down': return TrendingDown
      default: return Target
    }
  }

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up': return 'text-green-500'
      case 'down': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const formatTrend = (trend: number) => {
    const percentage = Math.abs(trend * 100)
    const direction = trend > 0 ? '+' : trend < 0 ? '-' : ''
    return `${direction}${percentage.toFixed(1)}%`
  }

  const formatResponseTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-gray-800 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-300 mb-2">Failed to load score data</h3>
        <p className="text-gray-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Current Score */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Current Score</h3>
            <Target className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {scoreData.current_score.toFixed(1)}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Target:</span>
            <span className="text-sm text-white">{scoreData.target_score}</span>
          </div>
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              {metrics.needsImprovement ? (
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              <span className={`text-sm ${metrics.needsImprovement ? 'text-yellow-500' : 'text-green-500'}`}>
                {metrics.needsImprovement ? 'Needs improvement' : 'Export ready'}
              </span>
            </div>
          </div>
        </div>

        {/* Trend */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Trend ({timeRange})</h3>
            <button
              onClick={() => setTimeRange(timeRange === '7d' ? '30d' : '7d')}
              className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded transition-colors"
            >
              {timeRange}
            </button>
          </div>
          <div className="flex items-center space-x-3">
            {(() => {
              const TrendIcon = getTrendIcon(metrics.trendDirection)
              return <TrendIcon className={`h-8 w-8 ${getTrendColor(metrics.trendDirection)}`} />
            })()}
            <div>
              <div className={`text-2xl font-bold ${getTrendColor(metrics.trendDirection)}`}>
                {formatTrend(metrics.trend)}
              </div>
              <div className="text-sm text-gray-400">
                {metrics.isImproving ? 'Improving' : 'Declining'}
              </div>
            </div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Success Rate</h3>
            <Award className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {(metrics.successRate * 100).toFixed(1)}%
          </div>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>{scoreData.successful_runs} successful</span>
            <span>{scoreData.failed_runs} failed</span>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.successRate * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Response Time */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Avg Response</h3>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {formatResponseTime(scoreData.avg_response_time)}
          </div>
          <div className="text-sm text-gray-400">
            {scoreData.total_runs} total runs
          </div>
        </div>
      </div>

      {/* Quality Metrics */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-white">Quality Metrics</h3>
          <div className="flex space-x-2">
            {Object.entries(scoreData.quality_metrics).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleMetricSelect(key as keyof ScoreData['quality_metrics'])}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  selectedMetric === key
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(scoreData.quality_metrics).map(([key, value]) => (
            <div
              key={key}
              className={`p-4 rounded-lg transition-all ${
                selectedMetric === key ? getScoreBgColor(value) : 'bg-gray-700'
              }`}
            >
              <div className="text-sm text-gray-400 mb-1">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(value)}`}>
                {value.toFixed(1)}
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleTightenPrompt}
              disabled={!metrics.needsImprovement}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                metrics.needsImprovement
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>Tighten & Re-test</span>
            </button>

            <button
              onClick={handleRerunTest}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Re-run Test</span>
            </button>
          </div>

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-gray-400">Score ≥80 for exports</span>
            </div>
            {!canExport && (
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-red-500">Export blocked</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Scores Chart */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Recent Scores</h3>
        <div className="space-y-3">
          {scoreData.recent_scores.slice(0, 10).map((score, index) => (
            <div
              key={score.run_id}
              className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
              onClick={() => onViewDetails(score.run_id)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getScoreColor(score.score)}`} />
                <span className="text-white font-medium">
                  {new Date(score.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`font-bold ${getScoreColor(score.score)}`}>
                  {score.score.toFixed(1)}
                </span>
                <div className="w-16 bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      score.score >= 80 ? 'bg-green-500' : score.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${score.score}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
