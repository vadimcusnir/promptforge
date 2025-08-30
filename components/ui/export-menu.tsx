'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ForgeGlyph } from './forge-glyph'

interface ExportMenuProps {
  currentPlan: 'free' | 'creator' | 'pro' | 'enterprise'
  onExport: (format: string) => void
  className?: string
}

const exportOptions = {
  free: [
    { format: 'txt', label: 'Text', available: true, reason: null }
  ],
  creator: [
    { format: 'txt', label: 'Text', available: true, reason: null },
    { format: 'md', label: 'Markdown', available: true, reason: null }
  ],
  pro: [
    { format: 'txt', label: 'Text', available: true, reason: null },
    { format: 'md', label: 'Markdown', available: true, reason: null },
    { format: 'pdf', label: 'PDF', available: true, reason: null },
    { format: 'json', label: 'JSON', available: true, reason: null }
  ],
  enterprise: [
    { format: 'txt', label: 'Text', available: true, reason: null },
    { format: 'md', label: 'Markdown', available: true, reason: null },
    { format: 'pdf', label: 'PDF', available: true, reason: null },
    { format: 'json', label: 'JSON', available: true, reason: null },
    { format: 'zip', label: 'Bundle ZIP', available: true, reason: null }
  ]
}

const planRequirements = {
  md: { plan: 'creator', reason: 'Markdown export requires Creator plan' },
  pdf: { plan: 'pro', reason: 'PDF export requires Pro plan' },
  json: { plan: 'pro', reason: 'JSON export requires Pro plan' },
  zip: { plan: 'enterprise', reason: 'Bundle ZIP export requires Enterprise plan' }
}

export function ExportMenu({ currentPlan, onExport, className }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredFormat, setHoveredFormat] = useState<string | null>(null)

  const planHierarchy = { free: 0, creator: 1, pro: 2, enterprise: 3 }
  const currentLevel = planHierarchy[currentPlan]

  const getAvailableOptions = () => {
    const allOptions = [
      { format: 'txt', label: 'Text', requiredPlan: 'free' },
      { format: 'md', label: 'Markdown', requiredPlan: 'creator' },
      { format: 'pdf', label: 'PDF', requiredPlan: 'pro' },
      { format: 'json', label: 'JSON', requiredPlan: 'pro' },
      { format: 'zip', label: 'Bundle ZIP', requiredPlan: 'enterprise' }
    ]

    return allOptions.map(option => {
      const requiredLevel = planHierarchy[option.requiredPlan as keyof typeof planHierarchy]
      const available = currentLevel >= requiredLevel
      const reason = available ? null : planRequirements[option.format as keyof typeof planRequirements]?.reason

      return {
        ...option,
        available,
        reason
      }
    })
  }

  const options = getAvailableOptions()

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-surface border border-border rounded-md text-text hover:border-brand/50 transition-colors duration-200 focus-ring font-ui text-sm"
      >
        <span>Export</span>
        <ForgeGlyph variant="static" size="sm" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border rounded-md shadow-lg z-20">
            <div className="py-1">
              {options.map((option) => (
                <div key={option.format} className="relative">
                  <button
                    onClick={() => {
                      if (option.available) {
                        onExport(option.format)
                        setIsOpen(false)
                      }
                    }}
                    onMouseEnter={() => setHoveredFormat(option.format)}
                    onMouseLeave={() => setHoveredFormat(null)}
                    disabled={!option.available}
                    className={cn(
                      'w-full px-4 py-2 text-left text-sm font-ui transition-colors duration-200 focus-ring',
                      option.available
                        ? 'text-text hover:bg-surfaceAlt'
                        : 'text-textMuted cursor-not-allowed'
                    )}
                  >
                    {option.label}
                  </button>

                  {/* Tooltip for disabled options */}
                  {!option.available && hoveredFormat === option.format && (
                    <div className="absolute left-full top-0 ml-2 px-3 py-2 bg-surfaceAlt border border-border rounded-md shadow-lg z-30">
                      <div className="text-xs text-text font-ui whitespace-nowrap">
                        {option.reason}
                      </div>
                      <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-border" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
