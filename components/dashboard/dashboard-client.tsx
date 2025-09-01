'use client'

import { useState, useCallback, useEffect } from 'react'
import { useTelemetry } from '@/hooks/use-telemetry'
import { useEntitlements } from '@/hooks/use-entitlements'
import { useToasts } from '@/components/dashboard/toasts'
import { KpiHeader } from './kpi-header'
import { TabBar } from './tab-bar'
import { RecentRunsTable } from './recent-runs-table'
// import { ArtifactsTable } from './artifacts-table'
import { ModuleUsageHeatmap } from './module-usage-heatmap'
import { ScorePanels } from './score-panels'
// import { HistoryInfiniteList } from './history-infinite-list'
import { TightenPromptDialog } from './tighten-prompt-dialog'
import { PaywallInline } from './paywall-inline'
import { Toasts } from './toasts'

interface DashboardClientProps {
  initialData: {
    runs: any[]
    artifacts: any[]
    modules: any[]
    scoreData: any
  }
}

type TabType = 'runs' | 'artifacts' | 'modules' | 'scores' | 'history'

export function DashboardClient({ initialData }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('runs')
  const [isTightenDialogOpen, setIsTightenDialogOpen] = useState(false)
  const [selectedRun] = useState<any>(null)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d')

  const { entitlements } = useEntitlements()
  const { trackUserAction } = useTelemetry()
  const { toasts, showSuccess, showError, showWarning, removeToast } = useToasts()

  // Handle tab changes
  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab)
    trackUserAction('dashboard_tab_changed', { tab })
  }, [trackUserAction])

  // Handle run actions
  const handleViewRun = useCallback(async (runId: string) => {
    try {
      trackUserAction('run_viewed', { run_id: runId })
      showSuccess('Run details', 'Run details would be displayed here')
    } catch (error) {
      showError('Failed to view run', 'Could not load run details')
    }
  }, [trackUserAction, showSuccess, showError])

  const handleRerun = useCallback(async (runId: string) => {
    try {
      trackUserAction('run_rerun_initiated', { run_id: runId })
      
      const response = await fetch(`/api/runs/${runId}/rerun`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to rerun')
      }

      const result = await response.json()
      showSuccess('Run completed', `New run created with score ${result.data.run.score.toFixed(1)}`)
    } catch (error) {
      showError('Rerun failed', error instanceof Error ? error.message : 'Unknown error')
    }
  }, [trackUserAction, showSuccess, showError])

  const handleExport = useCallback(async (runId: string) => {
    try {
      trackUserAction('export_initiated', { run_id: runId })
      
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format: 'json',
          run_ids: [runId],
          include_metadata: true,
          include_prompts: true,
          include_responses: true
        })
      })

      if (!response.ok) {
        const error = await response.json()
        if (error.code === 'ENTITLEMENT_REQUIRED') {
          showWarning('Upgrade required', 'This export requires a higher plan')
          return
        }
        if (error.code === 'SCORE_TOO_LOW') {
          showWarning('Score too low', 'Run score must be 80 or higher to export')
          return
        }
        throw new Error(error.error || 'Export failed')
      }

      // Handle file download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `run-${runId}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      showSuccess('Export completed', 'Run exported successfully')
    } catch (error) {
      showError('Export failed', error instanceof Error ? error.message : 'Unknown error')
    }
  }, [trackUserAction, showSuccess, showError, showWarning])

  // Handle artifact actions
  const handleDownloadArtifact = useCallback(async (artifact: any) => {
    try {
      trackUserAction('artifact_downloaded', { 
        artifact_id: artifact.id,
        artifact_type: artifact.type,
        run_score: artifact.run_score
      })
      
      showSuccess('Download started', `Downloading ${artifact.name}`)
    } catch (error) {
      showError('Download failed', 'Could not download artifact')
    }
  }, [trackUserAction, showSuccess, showError])

  const handleViewArtifact = useCallback((artifact: any) => {
    trackUserAction('artifact_viewed', { 
      artifact_id: artifact.id,
      artifact_type: artifact.type
    })
    showSuccess('Artifact details', 'Artifact details would be displayed here')
  }, [trackUserAction, showSuccess])

  const handleCopyChecksum = useCallback((checksum: string) => {
    trackUserAction('checksum_copied', { checksum })
    showSuccess('Copied', 'Checksum copied to clipboard')
  }, [trackUserAction, showSuccess])

  // Handle module actions
  const handleModuleClick = useCallback((moduleId: string) => {
    trackUserAction('module_clicked', { module_id: moduleId })
    showSuccess('Module details', 'Module details would be displayed here')
  }, [trackUserAction, showSuccess])

  // Handle score actions
  const handleTightenPrompt = useCallback(() => {
    if (selectedRun) {
      setIsTightenDialogOpen(true)
    }
  }, [selectedRun])

  const handleRerunTest = useCallback(async () => {
    if (selectedRun) {
      await handleRerun(selectedRun.id)
      setIsTightenDialogOpen(false)
    }
  }, [selectedRun, handleRerun])

  const handleExportFromDialog = useCallback(async () => {
    if (selectedRun) {
      await handleExport(selectedRun.id)
      setIsTightenDialogOpen(false)
    }
  }, [selectedRun, handleExport])

  const handleApplySuggestion = useCallback(async (suggestion: string) => {
    console.log(`Improved prompt: ${suggestion}`)
  }, [])

  // Handle time range changes
  const handleTimeRangeChange = useCallback((range: '7d' | '30d' | '90d') => {
    setTimeRange(range)
    trackUserAction('time_range_changed', { range })
  }, [trackUserAction])

  // Handle upgrade actions
  const handleUpgrade = useCallback(() => {
    trackUserAction('upgrade_clicked', { source: 'dashboard' })
    window.location.href = '/pricing'
  }, [trackUserAction])

  const handleViewPricing = useCallback(() => {
    trackUserAction('pricing_viewed', { source: 'dashboard' })
    window.location.href = '/pricing'
  }, [trackUserAction])

  // Track page view
  useEffect(() => {
    trackUserAction('dashboard_viewed', {
      active_tab: activeTab,
      time_range: timeRange,
      plan: entitlements?.userPlan || 'free'
    })
  }, [trackUserAction, activeTab, timeRange, entitlements?.userPlan])

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'runs':
        return (
          <RecentRunsTable
            initialRuns={initialData.runs}
          />
        )
      case 'artifacts':
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Artifacts Table</h3>
            <p className="text-gray-400">Artifacts table temporarily disabled</p>
          </div>
        )
      case 'modules':
        return (
          <ModuleUsageHeatmap
            modules={initialData.modules}
            timeRange={timeRange}
            onTimeRangeChange={handleTimeRangeChange}
            onModuleClick={handleModuleClick}
          />
        )
      case 'scores':
        return (
          <ScorePanels
            scoreData={initialData.scoreData}
            onTightenPrompt={handleTightenPrompt}
            onRerunTest={handleRerunTest}
            onViewDetails={handleViewRun}
          />
        )
      case 'history':
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-300 mb-2">History</h3>
            <p className="text-gray-400">History temporarily disabled</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg-primary)]">
      {/* KPI Header */}
      <KpiHeader
        totalRuns={initialData.runs.length}
        avgScore={initialData.scoreData?.current_score || 0}
        successRate={0.85}
        trend={0.12}
      />

      {/* Tab Navigation */}
      <TabBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Paywall for score < 80 */}
        {initialData.scoreData?.current_score < 80 && activeTab === 'scores' && (
          <div className="mb-6">
            <PaywallInline
              feature="export"
              reason="score_too_low"
              currentPlan={entitlements?.userPlan || 'free'}
              requiredPlan="pro"
              currentScore={initialData.scoreData.current_score}
              requiredScore={80}
              onUpgrade={handleUpgrade}
              onViewPricing={handleViewPricing}
            />
          </div>
        )}

        {/* Tab Content */}
        <div className="space-y-6">
          {renderTabContent()}
        </div>
      </main>

      {/* Tighten Prompt Dialog */}
      {isTightenDialogOpen && selectedRun && (
        <TightenPromptDialog
          isOpen={isTightenDialogOpen}
          onClose={() => setIsTightenDialogOpen(false)}
          currentPrompt={selectedRun.prompt}
          currentScore={selectedRun.score}
          targetScore={80}
          onApplySuggestion={handleApplySuggestion}
          onRerunTest={handleRerunTest}
          onExport={handleExportFromDialog}
        />
      )}

      {/* Toasts */}
      <Toasts
        toasts={toasts}
        onRemove={removeToast}
      />
    </div>
  )
}
