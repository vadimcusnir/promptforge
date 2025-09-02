"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
// Tabs components removed - not used
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Download, 
  RefreshCw, 
  Play, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Cloud,
  HardDrive,
  Filter,
  Search
} from 'lucide-react'
import { EntitlementGate } from '@/components/entitlement-gate'
import { useEntitlements } from '@/hooks/use-entitlements'
import { useToast } from '@/hooks/use-toast'
import { formatDistanceToNow, format } from 'date-fns'

interface RunHistoryItem {
  id: string
  runId: string
  moduleId: string
  moduleName: string
  domain: string
  scale: string
  urgency: string
  complexity: string
  resources: string
  application: string
  outputFormat: string
  promptText: string
  outputText: string
  score?: number
  status: 'completed' | 'failed' | 'pending'
  startedAt: string
  completedAt?: string
  durationMs?: number
  metadata: Record<string, any>
}

interface RunHistoryFilters {
  module: string
  domain: string
  dateFrom: string
  dateTo: string
  status: string
  search: string
}

export function RunHistory({ orgId }: { orgId: string }) {
  const [runs, setRuns] = useState<RunHistoryItem[]>([])
  const [filteredRuns, setFilteredRuns] = useState<RunHistoryItem[]>([])
  const [filters, setFilters] = useState<RunHistoryFilters>({
    module: '',
    domain: '',
    dateFrom: '',
    dateTo: '',
    status: '',
    search: ''
  })
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState<string | null>(null)
  
  const { hasEntitlement } = useEntitlements(orgId)
  const { toast } = useToast()

  const hasCloudHistory = hasEntitlement('hasCloudHistory')
  const canExportPDF = hasEntitlement('canExportPDF')
  const canExportJSON = hasEntitlement('canExportJSON')

  // Load runs based on entitlements
  useEffect(() => {
    loadRuns()
  }, [orgId, hasCloudHistory])

  // Filter runs when filters change
  useEffect(() => {
    applyFilters()
  }, [runs, filters])

  const loadRuns = useCallback(async () => {
    setLoading(true)
    
    try {
      if (hasCloudHistory) {
        // Load from cloud (Supabase)
        await loadCloudRuns()
      } else {
        // Load from localStorage
        loadLocalRuns()
      }
    } catch (error) {
      console.error('Failed to load runs:', error)
      toast({
        title: "Failed to load history",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [orgId, hasCloudHistory])

  const loadCloudRuns = async () => {
    try {
      const response = await fetch(`/api/runs/history?orgId=${orgId}`)
      
      if (!response.ok) {
        if (response.status === 403) {
          // Fallback to localStorage if cloud access denied
          console.log('Cloud history access denied, falling back to local storage')
          loadLocalRuns()
          return
        }
        throw new Error(`Failed to load cloud runs: ${response.status}`)
      }
      
      const data = await response.json()
      setRuns(data.runs || [])
      
    } catch (error) {
      console.error('Cloud runs load error:', error)
      // Fallback to localStorage
      loadLocalRuns()
    }
  }

  const loadLocalRuns = () => {
    try {
      const localRuns = localStorage.getItem(`runHistory_${orgId}`)
      if (localRuns) {
        const parsedRuns = JSON.parse(localRuns)
        setRuns(parsedRuns)
      } else {
        setRuns([])
      }
    } catch (error) {
      console.error('Local runs load error:', error)
      setRuns([])
    }
  }

  const applyFilters = () => {
    let filtered = [...runs]

    // Module filter
    if (filters.module) {
      filtered = filtered.filter(run => 
        run.moduleName.toLowerCase().includes(filters.module.toLowerCase())
      )
    }

    // Domain filter
    if (filters.domain) {
      filtered = filtered.filter(run => 
        run.domain.toLowerCase() === filters.domain.toLowerCase()
      )
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(run => 
        new Date(run.startedAt) >= new Date(filters.dateFrom)
      )
    }

    if (filters.dateTo) {
      filtered = filtered.filter(run => 
        new Date(run.startedAt) <= new Date(filters.dateTo)
      )
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(run => run.status === filters.status)
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(run => 
        run.promptText.toLowerCase().includes(searchLower) ||
        run.outputText.toLowerCase().includes(searchLower) ||
        run.moduleName.toLowerCase().includes(searchLower)
      )
    }

    setFilteredRuns(filtered)
  }

  const handleReRun = async (run: RunHistoryItem) => {
    try {
      // Create a new run based on the historical one
      const newRun = {
        ...run,
        id: `rerun_${Date.now()}`,
        runId: `rerun_${Date.now()}`,
        startedAt: new Date().toISOString(),
        status: 'pending' as const
      }

      // Add to runs list
      setRuns(prev => [newRun, ...prev])

      // Save to appropriate storage
      if (hasCloudHistory) {
        await saveRunToCloud(newRun)
      } else {
        saveRunToLocal(newRun)
      }

      toast({
        title: "Run restarted",
        description: "Your run has been queued for execution",
      })

    } catch (error) {
      console.error('Re-run failed:', error)
      toast({
        title: "Re-run failed",
        description: "Please try again later",
        variant: "destructive"
      })
    }
  }

  const saveRunToCloud = async (run: RunHistoryItem) => {
    const response = await fetch('/api/runs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...run, orgId })
    })

    if (!response.ok) {
      throw new Error('Failed to save run to cloud')
    }
  }

  const saveRunToLocal = (run: RunHistoryItem) => {
    try {
      const existingRuns = localStorage.getItem(`runHistory_${orgId}`)
      const runs = existingRuns ? JSON.parse(existingRuns) : []
      runs.unshift(run)
      
      // Keep only last 100 runs locally
      if (runs.length > 100) {
        runs.splice(100)
      }
      
      localStorage.setItem(`runHistory_${orgId}`, JSON.stringify(runs))
    } catch (error) {
      console.error('Failed to save run locally:', error)
    }
  }

  const handleExport = async (run: RunHistoryItem, format: 'pdf' | 'json' | 'txt' | 'md') => {
    setExporting(run.id)
    
    try {
      let exportUrl: string
      
      if (format === 'pdf' && !canExportPDF) {
        toast({
          title: "PDF export requires Pro plan",
          description: "Upgrade to export in PDF format",
          variant: "destructive"
        })
        return
      }
      
      if (format === 'json' && !canExportJSON) {
        toast({
          title: "JSON export requires Pro plan",
          description: "Upgrade to export in JSON format",
          variant: "destructive"
        })
        return
      }

      if (hasCloudHistory) {
        // Export from cloud
        exportUrl = `/api/runs/${run.id}/export?format=${format}`
      } else {
        // Export from local data
        const exportData = {
          run,
          format,
          exportedAt: new Date().toISOString()
        }
        
        if (format === 'json') {
          const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
          exportUrl = URL.createObjectURL(blob)
        } else {
          // For text formats, create a simple export
          const textContent = `${run.moduleName} - ${run.domain}\n\nPrompt:\n${run.promptText}\n\nOutput:\n${run.outputText}`
          const blob = new Blob([textContent], { type: 'text/plain' })
          exportUrl = URL.createObjectURL(blob)
        }
      }

      // Trigger download
      const link = document.createElement('a')
      link.href = exportUrl
      link.download = `${run.moduleName}_${run.runId}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Export successful",
        description: `Your run has been exported as ${format.toUpperCase()}`,
      })

    } catch (error) {
      console.error('Export failed:', error)
      toast({
        title: "Export failed",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setExporting(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      failed: 'destructive',
      pending: 'secondary'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    )
  }

  const clearFilters = () => {
    setFilters({
      module: '',
      domain: '',
      dateFrom: '',
      dateTo: '',
      status: '',
      search: ''
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Run History</h2>
          <p className="text-muted-foreground">
            {hasCloudHistory ? (
              <span className="flex items-center gap-2">
                <Cloud className="h-4 w-4" />
                Cloud history with unlimited storage
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                Local history (upgrade to Pro for cloud storage)
              </span>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadRuns}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <EntitlementGate
            flag="hasCloudHistory"
            orgId={orgId}
            showPaywall={true}
            featureName="Cloud History"
            planRequired="pro"
          >
            <Button variant="default" size="sm">
              <Cloud className="h-4 w-4 mr-2" />
              Upgrade to Pro
            </Button>
          </EntitlementGate>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search runs..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="module">Module</Label>
              <Input
                id="module"
                placeholder="Module name"
                value={filters.module}
                onChange={(e) => setFilters(prev => ({ ...prev, module: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="domain">Domain</Label>
              <Select value={filters.domain} onValueChange={(value) => setFilters(prev => ({ ...prev, domain: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All domains" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All domains</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateFrom">From</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateTo">To</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredRuns.length} of {runs.length} runs
        </div>
        
        {!hasCloudHistory && (
          <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
            ⚠️ Local storage limited to last 100 runs
          </div>
        )}
      </div>

      {/* Runs Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRuns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {loading ? 'Loading runs...' : 'No runs found matching your filters'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredRuns.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{run.moduleName}</div>
                        <div className="text-sm text-muted-foreground">ID: {run.runId.slice(0, 8)}</div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant="outline">{run.domain}</Badge>
                        <div className="text-xs text-muted-foreground">
                          {run.scale} • {run.urgency}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(run.status)}
                        {getStatusBadge(run.status)}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {run.score ? (
                        <Badge variant={run.score >= 80 ? 'default' : run.score >= 60 ? 'secondary' : 'destructive'}>
                          {run.score}/100
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        {formatDistanceToNow(new Date(run.startedAt), { addSuffix: true })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(run.startedAt), 'MMM d, yyyy')}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {run.durationMs ? (
                        <span className="text-sm">
                          {(run.durationMs / 1000).toFixed(1)}s
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReRun(run)}
                          disabled={run.status === 'pending'}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExport(run, 'txt')}
                            disabled={exporting === run.id}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          
                          {canExportJSON && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleExport(run, 'json')}
                              disabled={exporting === run.id}
                            >
                              JSON
                            </Button>
                          )}
                          
                          {canExportPDF && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleExport(run, 'pdf')}
                              disabled={exporting === run.id}
                            >
                              PDF
                            </Button>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Upgrade Banner for Free Users */}
      {!hasCloudHistory && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upgrade to Pro for Cloud History</h3>
              <p className="text-gray-600 mb-4">
                Get unlimited cloud storage, advanced filtering, and export capabilities
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">∞</div>
                  <div className="text-sm text-gray-600">Unlimited Runs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">☁️</div>
                  <div className="text-sm text-gray-600">Cloud Storage</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">📊</div>
                  <div className="text-sm text-gray-600">Advanced Analytics</div>
                </div>
              </div>
              
              <EntitlementGate
                flag="hasCloudHistory"
                orgId={orgId}
                showPaywall={true}
                featureName="Cloud History"
                planRequired="pro"
              >
                <Button size="lg">
                  Upgrade to Pro
                </Button>
              </EntitlementGate>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
