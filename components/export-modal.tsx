"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Download, FileText, FileCode, FileImage, Archive, Lock } from "lucide-react"
import { EntitlementGate } from "@/components/entitlement-gate"
import { PromptRun } from "@/utils/promptCompiler"
import { exportPrompt, downloadExport, canExportFormat } from "@/lib/export"
import { useToast } from "@/hooks/use-toast"

interface ExportModalProps {
  promptRun: PromptRun
  userPlan: string
  trigger?: React.ReactNode
}

const exportFormats = [
  {
    id: 'txt',
    name: 'Plain Text',
    description: 'Simple text format with basic formatting',
    icon: FileText,
    plans: ['free', 'creator', 'pro', 'enterprise'],
    color: 'text-green-400'
  },
  {
    id: 'md',
    name: 'Markdown',
    description: 'Rich text format with markdown syntax',
    icon: FileCode,
    plans: ['creator', 'pro', 'enterprise'],
    color: 'text-blue-400'
  },
  {
    id: 'json',
    name: 'JSON',
    description: 'Structured data format for APIs and integrations',
    icon: FileCode,
    plans: ['pro', 'enterprise'],
    color: 'text-yellow-400'
  },
  {
    id: 'pdf',
    name: 'PDF',
    description: 'Professional document format for printing and sharing',
    icon: FileImage,
    plans: ['pro', 'enterprise'],
    color: 'text-red-400'
  },
  {
    id: 'zip',
    name: 'Bundle',
    description: 'Complete export package with all formats and metadata',
    icon: Archive,
    plans: ['enterprise'],
    color: 'text-purple-400'
  }
]

export function ExportModal({ promptRun, userPlan, trigger }: ExportModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState<string>('txt')
  const [exportOptions, setExportOptions] = useState({
    includeMetadata: true,
    includeScores: true,
    includeHistory: false
  })
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const handleExport = async (formats: Array<{
    id: string;
    name: string;
    description: string;
    icon: any;
    plans: string[];
    color: string;
  }>) => {
    if (!canExportFormat(selectedFormat, userPlan)) {
      toast({
        title: "Export Not Available",
        description: `This format requires a higher plan`,
        variant: "destructive"
      })
      return
    }

    setIsExporting(true)
    try {
      const result = exportPrompt(promptRun, {
        format: selectedFormat as any,
        ...exportOptions
      }, userPlan)

      if (result.success) {
        downloadExport(result)
        toast({
          title: "Export Successful",
          description: `Prompt exported as ${selectedFormat.toUpperCase()}`,
        })
        setIsOpen(false)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleFormatChange = (format: {
    format: string;
    label: string;
    description: string;
    requiresPlan: string;
  }, checked: boolean) => {

  }

  const canExport = canExportFormat(selectedFormat, userPlan)
  const selectedFormatConfig = exportFormats.find(f => f.id === selectedFormat)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif">Export Prompt</DialogTitle>
          <DialogDescription>
            Choose export format and options for your generated prompt
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Export Format</Label>
            <div className="grid grid-cols-2 gap-3">
              {exportFormats.map((format) => {
                const Icon = format.icon
                const isAvailable = format.plans.includes(userPlan as any)
                const isSelected = selectedFormat === format.id

                return (
                  <div
                    key={format.id}
                    className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-yellow-400 bg-yellow-400/10' 
                        : 'border-gray-700 hover:border-gray-600'
                    } ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => isAvailable && setSelectedFormat(format.id)}
                  >
                    {!isAvailable && (
                      <div className="absolute top-2 right-2">
                        <Lock className="w-4 h-4 text-gray-500" />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <Icon className={`w-6 h-6 ${format.color}`} />
                      <div>
                        <div className="font-medium text-sm">{format.name}</div>
                        <div className="text-xs text-gray-400">{format.description}</div>
                      </div>
                    </div>
                    
                    {!isAvailable && (
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {format.plans[0] === 'creator' ? 'Creator+' : 
                           format.plans[0] === 'pro' ? 'Pro+' : 'Enterprise'}
                        </Badge>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Export Options */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Export Options</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeMetadata"
                  checked={exportOptions.includeMetadata}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeMetadata: checked as boolean }))
                  }
                />
                <Label htmlFor="includeMetadata" className="text-sm">
                  Include input values and configuration
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeScores"
                  checked={exportOptions.includeScores}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeScores: checked as boolean }))
                  }
                />
                <Label htmlFor="includeScores" className="text-sm">
                  Include test scores and metrics
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeHistory"
                  checked={exportOptions.includeHistory}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeHistory: checked as boolean }))
                  }
                />
                <Label htmlFor="includeHistory" className="text-sm">
                  Include generation history context
                </Label>
              </div>
            </div>
          </div>

          {/* Preview */}
          {selectedFormatConfig && (
            <div className="bg-black/30 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <selectedFormatConfig.icon className={`w-4 h-4 ${selectedFormatConfig.color}`} />
                <span className="font-medium text-sm">{selectedFormatConfig.name} Preview</span>
              </div>
              <div className="text-xs text-gray-400 space-y-1">
                <div>• Run ID: {promptRun.id}</div>
                <div>• Module: {promptRun.moduleId}</div>
                <div>• Generated: {new Date(promptRun.timestamp).toLocaleString()}</div>
                {exportOptions.includeScores && promptRun.scores && (
                  <div>• Scores: Structure ({promptRun.scores.structure}), Clarity ({promptRun.scores.clarity})</div>
                )}
                {exportOptions.includeMetadata && (
                  <div>• Input values: {Object.keys(promptRun.inputValues).length} parameters</div>
                )}
              </div>
            </div>
          )}

          {/* Export Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleExport(exportFormats)}
              disabled={isExporting}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold"
            >
              Export Selected Formats
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
