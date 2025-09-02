'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KpiData {
  runs7d: number
  runs7dTrend: number
  avgScore: number
  avgScoreTrend: number
  exports: number
  exportsTrend: number
  ttaMedian: number
  ttaTrend: number
  passRate: number
  passRateTrend: number
}

interface KpiHeaderProps {
  kpis: KpiData
}

export function KpiHeader({ kpis }: KpiHeaderProps) {
  const formatTrend = (trend: number) => {
    if (trend > 0) return { icon: TrendingUp, color: 'text-green-500', sign: '+' }
    if (trend < 0) return { icon: TrendingDown, color: 'text-red-500', sign: '' }
    return { icon: Minus, color: 'text-[var(--fg-muted)]', sign: '' }
  }

  const kpiItems = [
    {
      label: 'Runs (7d)',
      value: kpis.runs7d.toLocaleString(),
      trend: kpis.runs7dTrend,
      format: 'number'
    },
    {
      label: 'Avg Score',
      value: kpis.avgScore.toFixed(1),
      trend: kpis.avgScoreTrend,
      format: 'score'
    },
    {
      label: 'Exports',
      value: kpis.exports.toLocaleString(),
      trend: kpis.exportsTrend,
      format: 'number'
    },
    {
      label: 'TTA Median',
      value: `${kpis.ttaMedian}s`,
      trend: kpis.ttaTrend,
      format: 'time'
    },
    {
      label: 'Pass Rate',
      value: `${kpis.passRate}%`,
      trend: kpis.passRateTrend,
      format: 'percentage'
    }
  ]

  return (
    <div className="border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {kpiItems.map((kpi, index) => {
            const trend = formatTrend(kpi.trend)
            const TrendIcon = trend.icon
            
            return (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-[var(--fg-primary)] mb-1">
                  {kpi.value}
                </div>
                <div className="text-sm text-[var(--fg-muted)] mb-2">
                  {kpi.label}
                </div>
                <div className={`flex items-center justify-center gap-1 text-xs ${trend.color}`}>
                  <TrendIcon className="w-3 h-3" />
                  <span>
                    {trend.sign}{Math.abs(kpi.trend).toFixed(1)}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
