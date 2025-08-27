"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEntitlements } from '@/hooks/use-entitlements'
import { useAnalytics } from '@/hooks/use-analytics'
import { EntitlementGate } from './entitlement-gate'
import { Download, FileText, FileJson, Archive, Lock, Crown, Zap, AlertCircle } from 'lucide-react'

interface ExportDialogProps {
  trigger: React.ReactNode
  orgId?: string
  content?: any
  onExport?: (format: string, options: ExportOptions) => Promise<void>
  score?: number
  sevenD?: Record<string, string>
  runId?: string
}

interface ExportOptions {
  format: 'md' | 'pdf' | 'json' | 'zip'
  watermark?: boolean
  includeMetadata?: boolean
  compression?: boolean
}

const exportFormats = [
  {
    id: 'md',
    name: 'Markdown',
    description: 'Export as Markdown file',
    icon: FileText,
    available: true, // Always available
    planRequired: null as 'pro' | 'enterprise' | null
  },
  {
    id: 'pdf',
    name: 'PDF',
    description: 'Export as PDF document',
    icon: FileText,
    available: false,
    planRequired: 'pro' as const
  },
  {
    id: 'json',
    name: 'JSON',
    description: 'Export as JSON data',
    icon: FileJson,
    available: false,
    planRequired: 'pro' as const
  },
  {
    id: 'zip',
    name: 'Bundle (ZIP)',
    description: 'Export as compressed bundle',
    icon: Archive,
    available: false,
    planRequired: 'enterprise' as const
  }
]

export function ExportDialog({ trigger, orgId, content, onExport, score, sevenD, runId }: ExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState<string>('md')
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const { entitlements, hasEntitlement } = useEntitlements(orgId)
  const analytics = useAnalytics()

  const handleExport = async (formats: Array<{
    id: string;
    name: string;
    description: string;
    icon: any;
    available: boolean;
    planRequired: 'pro' | 'enterprise' | null;
  }>) => {
    if (!onExport) return

    setIsExporting(true)
    setExportError(null)

    try {
      // Check if user is on trial/free plan
      const isTrialUser = !hasEntitlement('hasWhiteLabel') && !hasEntitlement('canExportPDF');
      
      const options: ExportOptions = {
        format: selectedFormat as any,
        watermark: isTrialUser,
        includeMetadata: true,
        compression: selectedFormat === 'zip'
      }

      // Track export event based on format
      const moduleId = content?.moduleId || 'unknown'
      switch (selectedFormat) {
        case 'pdf':
          analytics.exportPDF(moduleId, options)
          break
        case 'json':
          analytics.exportJSON(moduleId, options)
          break
        case 'zip':
          analytics.exportBundle(moduleId, options)
          break
        default:
          // Markdown is always available
          break
      }

      await onExport(selectedFormat, options)
      setIsOpen(false)
    } catch (error) {
      console.error('Export failed:', error)
      setExportError(error instanceof Error ? error.message : 'Export failed')
    } finally {
      setIsExporting(false)
    }
  }

  // Check if export is allowed based on score
  const canExport = score === undefined || score >= 80
  const scoreWarning = score !== undefined && score < 80

  const canExportFormat = (formatId: string) => {
    const format = exportFormats.find(f => f.id === formatId)
    if (!format) return false
    
    if (format.planRequired === null) return true
    return hasEntitlement(format.planRequired === 'pro' ? 'canExportPDF' : 'canExportBundleZip')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Content
          </DialogTitle>
          <DialogDescription>
            Choose your export format and options. Some formats require specific plans.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedFormat} onValueChange={setSelectedFormat} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {exportFormats.map((format) => (
              <TabsTrigger
                key={format.id}
                value={format.id}
                disabled={!canExportFormat(format.id)}
                className="flex items-center gap-2"
              >
                <format.icon className="h-4 w-4" />
                {format.name}
                {!canExportFormat(format.id) && <Lock className="h-3 w-3" />}
              </TabsTrigger>
            ))}
          </TabsList>

          {exportFormats.map((format) => (
            <TabsContent key={format.id} value={format.id} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <format.icon className="h-5 w-5" />
                    {format.name} Export
                    {format.planRequired && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                        <span className="text-yellow-600">👑</span>
                        {format.planRequired === 'enterprise' ? 'Enterprise' : 'Pro'} Plan
                      </div>
                    )}
                  </CardTitle>
                  <CardDescription>{format.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Format-specific options */}
                  {format.id === 'pdf' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="include-metadata" defaultChecked />
                        <label htmlFor="include-metadata">Include metadata</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="watermark" defaultChecked={!hasEntitlement('hasWhiteLabel')} />
                        <label htmlFor="watermark">
                          Add watermark {!hasEntitlement('hasWhiteLabel') ? '(TRIAL — Not for Redistribution)' : ''}
                        </label>
                      </div>
                      {!hasEntitlement('hasWhiteLabel') && (
                        <p className="text-xs text-gray-500">
                          Trial users will see watermarks on PDF exports
                        </p>
                      )}
                    </div>
                  )}

                  {format.id === 'json' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="pretty-print" defaultChecked />
                        <label htmlFor="pretty-print">Pretty print</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="include-schema" defaultChecked />
                        <label htmlFor="include-schema">Include schema</label>
                      </div>
                    </div>
                  )}

                  {format.id === 'zip' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="compression" defaultChecked />
                        <label htmlFor="compression">High compression</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="password-protect" />
                        <label htmlFor="password-protect">Password protect</label>
                      </div>
                    </div>
                  )}

                  {/* Export button */}
                  <div className="flex justify-end">
                    <EntitlementGate
                      flag={format.planRequired === 'pro' ? 'canExportPDF' : 
                            format.planRequired === 'enterprise' ? 'canExportBundleZip' : 'canExportMD'}
                      orgId={orgId}
                      showPaywall={true}
                      featureName={format.name}
                      planRequired={format.planRequired || undefined}
                    >
                      <Button
                        onClick={() => handleExport(exportFormats)}
                        disabled={isExporting}
                        className="min-w-[120px]"
                      >
                        {isExporting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Export {format.name}
                          </>
                        )}
                      </Button>
                    </EntitlementGate>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Score warning */}
        {scoreWarning && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-900">Definition of Done Not Met</h4>
                  <p className="text-sm text-red-700">
                    Current score: {score}/100. Score must be ≥80 to export bundle.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Export error */}
        {exportError && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-900">Export Failed</h4>
                  <p className="text-sm text-red-700">{exportError}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plan upgrade banner */}
        {!hasEntitlement('canExportPDF') && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Crown className="h-5 w-5 text-orange-600" />
                <div className="flex-1">
                  <h4 className="font-medium text-orange-900">Upgrade to Pro</h4>
                  <p className="text-sm text-orange-700">
                    Unlock PDF and JSON exports, real GPT testing, and more advanced features.
                  </p>
                </div>
                <Button variant="outline" size="sm" className="border-orange-300 text-orange-700">
                  Upgrade Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!hasEntitlement('canExportBundleZip') && hasEntitlement('canExportPDF') && (
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Crown className="h-5 w-5 text-purple-600" />
                <div className="flex-1">
                  <h4 className="font-medium text-purple-900">Upgrade to Enterprise</h4>
                  <p className="text-sm text-purple-700">
                    Unlock bundle exports, API access, white-labeling, and team features.
                  </p>
                </div>
                <Button variant="outline" size="sm" className="border-purple-300 text-purple-700">
                  Contact Sales
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  )
}
