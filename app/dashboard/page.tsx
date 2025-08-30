'use client'

import { useState, useEffect } from 'react'
import { NavBar } from '@/components/ui/navbar'
import { TelemetryBadge } from '@/components/ui/telemetry-badge'
import { cn } from '@/lib/utils'

interface Run {
  id: string
  moduleId: string
  moduleName: string
  domain: string
  version: string
  status: 'completed' | 'running' | 'failed'
  score?: number
  duration?: number
  createdAt: string
  artifacts?: string[]
}

export default function DashboardPage() {
  const [runs, setRuns] = useState<Run[]>([])
  const [filteredRuns, setFilteredRuns] = useState<Run[]>([])
  const [currentPlan] = useState<'free' | 'creator' | 'pro' | 'enterprise'>('free')
  
  // Filters
  const [moduleFilter, setModuleFilter] = useState('all')
  const [domainFilter, setDomainFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [versionFilter, setVersionFilter] = useState('all')

  // Load runs
  useEffect(() => {
    const loadRuns = async () => {
      try {
        const response = await fetch('/api/runs')
        if (response.ok) {
          const data = await response.json()
          setRuns(data.runs || [])
          setFilteredRuns(data.runs || [])
        }
      } catch (error) {
        console.error('Failed to load runs:', error)
        // Fallback to demo data
        const demoRuns = getDemoRuns()
        setRuns(demoRuns)
        setFilteredRuns(demoRuns)
      }
    }

    loadRuns()
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = runs

    if (moduleFilter !== 'all') {
      filtered = filtered.filter(run => run.moduleId === moduleFilter)
    }

    if (domainFilter !== 'all') {
      filtered = filtered.filter(run => run.domain === domainFilter)
    }

    if (versionFilter !== 'all') {
      filtered = filtered.filter(run => run.version === versionFilter)
    }

    if (dateFilter !== 'all') {
      const now = new Date()
      const filterDate = new Date()
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0)
          break
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          break
        case 'month':
          filterDate.setMonth(now.getMonth() - 1)
          break
      }
      
      filtered = filtered.filter(run => new Date(run.createdAt) >= filterDate)
    }

    setFilteredRuns(filtered)
  }, [runs, moduleFilter, domainFilter, dateFilter, versionFilter])

  const handleReRun = (runId: string) => {
    console.log('Re-running:', runId)
    // TODO: Implement re-run functionality
  }

  const handleDownload = (runId: string, artifact: string) => {
    console.log('Downloading:', runId, artifact)
    // TODO: Implement download functionality
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-brand'
      case 'running': return 'text-gold'
      case 'failed': return 'text-accent'
      default: return 'text-textMuted'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✓'
      case 'running': return '⟳'
      case 'failed': return '✗'
      default: return '?'
    }
  }

  const uniqueModules = [...new Set(runs.map(run => run.moduleId))]
  const uniqueDomains = [...new Set(runs.map(run => run.domain))]
  const uniqueVersions = [...new Set(runs.map(run => run.version))]

  return (
    <div className="min-h-screen bg-bg">
      <NavBar plan={currentPlan} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-text mb-2">
              Dashboard
            </h1>
            <p className="text-textMuted font-ui">
              Monitor your prompt engineering runs and results
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-textMuted font-ui">
              {filteredRuns.length} of {runs.length} runs
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div>
            <label className="block text-sm font-ui font-medium text-text mb-2">
              Module
            </label>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text focus-ring font-ui"
            >
              <option value="all">All Modules</option>
              {uniqueModules.map(moduleId => (
                <option key={moduleId} value={moduleId}>
                  {moduleId}
                </option>
              ))}
            </select>
         </div>

          <div>
            <label className="block text-sm font-ui font-medium text-text mb-2">
              Domain
            </label>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text focus-ring font-ui"
            >
              <option value="all">All Domains</option>
              {uniqueDomains.map(domain => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
                    </div>

          <div>
            <label className="block text-sm font-ui font-medium text-text mb-2">
              Date Range
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text focus-ring font-ui"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
                  </div>

          <div>
            <label className="block text-sm font-ui font-medium text-text mb-2">
              Version
            </label>
            <select
              value={versionFilter}
              onChange={(e) => setVersionFilter(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text focus-ring font-ui"
            >
              <option value="all">All Versions</option>
              {uniqueVersions.map(version => (
                <option key={version} value={version}>
                  v{version}
                </option>
              ))}
            </select>
                  </div>
                  </div>

        {/* Runs Table */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          {filteredRuns.length === 0 ? (
            <div className="text-center py-12">
              <div className="rune-executable rune-loading w-12 h-12 mx-auto mb-4">
                <div className="star-8 w-8 h-8" />
                  </div>
              <p className="text-textMuted font-ui">
                No runs found matching your filters
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-ui font-medium text-text">Run</th>
                    <th className="text-left p-4 font-ui font-medium text-text">Module</th>
                    <th className="text-left p-4 font-ui font-medium text-text">Domain</th>
                    <th className="text-left p-4 font-ui font-medium text-text">Status</th>
                    <th className="text-left p-4 font-ui font-medium text-text">Score</th>
                    <th className="text-left p-4 font-ui font-medium text-text">Duration</th>
                    <th className="text-left p-4 font-ui font-medium text-text">Created</th>
                    <th className="text-left p-4 font-ui font-medium text-text">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRuns.map((run) => (
                    <tr key={run.id} className="border-b border-border last:border-b-0 hover:bg-surfaceAlt/50 transition-colors">
                      <td className="p-4">
                        <TelemetryBadge runId={run.id} />
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-ui text-sm font-medium text-text">
                            {run.moduleName}
                          </div>
                          <div className="font-mono text-xs text-textMuted">
                            {run.moduleId}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-ui text-sm text-text">
                          {run.domain}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <span className={cn('text-sm font-ui', getStatusColor(run.status))}>
                            {getStatusIcon(run.status)}
                          </span>
                          <span className={cn('text-sm font-ui capitalize', getStatusColor(run.status))}>
                            {run.status}
                          </span>
                  </div>
                      </td>
                      <td className="p-4">
                        {run.score !== undefined ? (
                          <span className="font-ui text-sm text-brand font-semibold">
                            {run.score}%
                          </span>
                        ) : (
                          <span className="text-textMuted">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        {run.duration ? (
                          <span className="font-ui text-sm text-text">
                            {run.duration < 1000 ? `${run.duration}ms` : `${(run.duration / 1000).toFixed(1)}s`}
                          </span>
                        ) : (
                          <span className="text-textMuted">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="font-ui text-sm text-textMuted">
                          {new Date(run.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleReRun(run.id)}
                            className="px-3 py-1 bg-surfaceAlt border border-border rounded-md text-text hover:border-brand/50 transition-colors focus-ring font-ui text-xs"
                          >
                            Re-run
                          </button>
                          {run.artifacts && run.artifacts.length > 0 && (
                            <div className="relative group">
                              <button className="px-3 py-1 bg-surfaceAlt border border-border rounded-md text-text hover:border-brand/50 transition-colors focus-ring font-ui text-xs">
                                Download
                              </button>
                              <div className="absolute right-0 top-full mt-1 w-32 bg-surface border border-border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                <div className="py-1">
                                  {run.artifacts.map((artifact, index) => (
                    <button 
                                      key={index}
                                      onClick={() => handleDownload(run.id, artifact)}
                                      className="w-full px-3 py-1 text-left text-xs font-ui text-text hover:bg-surfaceAlt"
                    >
                                      {artifact}
                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
                  </div>
                )}
        </div>
      </div>
    </div>
  )
}

// Demo data fallback
function getDemoRuns(): Run[] {
  return [
    {
      id: 'run_001_20241220',
      moduleId: 'M001',
      moduleName: 'Content Optimization',
      domain: 'marketing',
      version: '1.2',
      status: 'completed',
      score: 87,
      duration: 1250,
      createdAt: '2024-12-20T10:30:00Z',
      artifacts: ['output.txt', 'metrics.json']
    },
    {
      id: 'run_002_20241220',
      moduleId: 'M002',
      moduleName: 'Technical Documentation',
      domain: 'development',
      version: '2.1',
      status: 'running',
      duration: 850,
      createdAt: '2024-12-20T11:15:00Z'
    },
    {
      id: 'run_003_20241220',
      moduleId: 'M003',
      moduleName: 'Marketing Copy Generator',
      domain: 'marketing',
      version: '1.5',
      status: 'failed',
      createdAt: '2024-12-20T09:45:00Z'
    }
  ]
}