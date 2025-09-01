'use client'

import { useState, useMemo } from 'react'
import { Eye, RotateCcw, Download, ExternalLink, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { useTelemetry } from '@/hooks/use-telemetry'
import { EntitlementGate } from '@/components/billing/EntitlementGate'


interface Run {
  id: string
  module: string
  domain: string
  version: string
  score: number
  verdict: 'pass' | 'fail' | 'pending'
  duration: number
  owner: string
  created: string
  canExport: boolean
  canRerun: boolean
}

interface RecentRunsTableProps {
  initialRuns: Run[]
}

export function RecentRunsTable({ initialRuns }: RecentRunsTableProps) {
  const [runs] = useState<Run[]>(initialRuns)
  const [filters, setFilters] = useState({
    module: '',
    minScore: '',
    verdict: '',
    format: ''
  })
  
  const { track } = useTelemetry()

  const filteredRuns = useMemo(() => {
    return runs.filter(run => {
      if (filters.module && !run.module.toLowerCase().includes(filters.module.toLowerCase())) return false
      if (filters.minScore && run.score < parseFloat(filters.minScore)) return false
      if (filters.verdict && run.verdict !== filters.verdict) return false
      return true
    })
  }, [runs, filters])

  const handleViewRun = (runId: string) => {
    track('dashboard_run_viewed', { run_id: runId })
    // Navigate to run detail
  }

  const handleRerun = (runId: string) => {
    track('dashboard_run_rerun', { run_id: runId })
    // Trigger rerun with same 7D parameters
  }

  const handleExport = (runId: string, format: string) => {
    const run = runs.find(r => r.id === runId)
    if (!run) return

    // Check score gate (≥80 required for exports)
    if (run.score < 80) {
      track('export_blocked_low_score', { 
        run_id: runId, 
        score: run.score, 
        format,
        reason: 'score_below_80'
      })
      return
    }

    track('dashboard_export_attempted', { 
      run_id: runId, 
      format,
      score: run.score
    })
    // Trigger export
  }

  const handleTightenPrompt = (runId: string) => {
    track('tighten_prompt_clicked', { run_id: runId })
    // Open tighten prompt dialog
  }

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'fail': return <XCircle className="w-4 h-4 text-red-500" />
      case 'pending': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      default: return null
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-[var(--border)]/20 rounded-lg">
        <input
          type="text"
          placeholder="Filter by module..."
          value={filters.module}
          onChange={(e) => setFilters(prev => ({ ...prev, module: e.target.value }))}
          className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm"
        />
        <input
          type="number"
          placeholder="Min score"
          value={filters.minScore}
          onChange={(e) => setFilters(prev => ({ ...prev, minScore: e.target.value }))}
          className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm"
        />
        <select
          value={filters.verdict}
          onChange={(e) => setFilters(prev => ({ ...prev, verdict: e.target.value }))}
          className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All verdicts</option>
          <option value="pass">Pass</option>
          <option value="fail">Fail</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[var(--bg)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--border)]/20">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider">
                  Run ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider">
                  Module
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider">
                  Verdict
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredRuns.map((run) => (
                <tr key={run.id} className="hover:bg-[var(--border)]/10">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-[var(--fg-primary)]">
                    {run.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--fg-primary)]">
                    {run.module}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${getScoreColor(run.score)}`}>
                      {run.score.toFixed(1)}
                    </span>
                    {run.score < 80 && (
                      <button
                        onClick={() => handleTightenPrompt(run.id)}
                        className="ml-2 text-xs text-[var(--brand)] hover:underline"
                      >
                        Tighten & Re-test
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      {getVerdictIcon(run.verdict)}
                      <span className="capitalize">{run.verdict}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--fg-muted)]">
                    {run.duration}s
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--fg-muted)]">
                    {new Date(run.created).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewRun(run.id)}
                        className="p-1 hover:bg-[var(--border)]/20 rounded"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleRerun(run.id)}
                        className="p-1 hover:bg-[var(--border)]/20 rounded"
                        title="Re-run with same 7D"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>

                      <EntitlementGate
                        feature="canExportPDF"
                        requiredPlan="PRO"
                        fallback={
                          <button
                            onClick={() => handleExport(run.id, 'pdf')}
                            className="p-1 hover:bg-[var(--border)]/20 rounded"
                            title="Export PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        }
                        showPaywall={false}
                      >
                        <button
                          onClick={() => handleExport(run.id, 'pdf')}
                          className="p-1 hover:bg-[var(--border)]/20 rounded"
                          title="Export PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </EntitlementGate>

                      <button
                        onClick={() => window.open(`/generator?run=${run.id}`, '_blank')}
                        className="p-1 hover:bg-[var(--border)]/20 rounded"
                        title="Open in Generator"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty state */}
      {filteredRuns.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[var(--fg-muted)] mb-4">No runs found matching your filters.</p>
          <button
            onClick={() => setFilters({ module: '', minScore: '', verdict: '', format: '' })}
            className="text-[var(--brand)] hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
