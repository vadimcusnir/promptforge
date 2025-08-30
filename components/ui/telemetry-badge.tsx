'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ForgeGlyph } from './forge-glyph'

interface TelemetryBadgeProps {
  runId: string
  score?: number
  duration?: number
  className?: string
}

export function TelemetryBadge({ runId, score, duration, className }: TelemetryBadgeProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(runId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatDuration = (ms?: number) => {
    if (!ms) return null
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-textMuted'
    if (score >= 80) return 'text-brand'
    if (score >= 60) return 'text-gold'
    return 'text-accent'
  }

  return (
    <div className={cn(
      'inline-flex items-center space-x-2 px-3 py-1.5 bg-surfaceAlt border border-border rounded-full text-xs font-mono',
      className
    )}>
      {/* Run ID */}
      <button
        onClick={handleCopy}
        className="flex items-center space-x-1 text-textMuted hover:text-text transition-colors focus-ring rounded"
        title="Copy run ID"
      >
        <span className="truncate max-w-20">{runId}</span>
        <ForgeGlyph variant="static" size="sm" />
      </button>

      {/* Score */}
      {score !== undefined && (
        <span className={cn('font-semibold', getScoreColor(score))}>
          {score}%
        </span>
      )}

      {/* Duration */}
      {duration && (
        <span className="text-textMuted">
          {formatDuration(duration)}
        </span>
      )}

      {/* Copy feedback */}
      {copied && (
        <span className="text-brand text-xs animate-fade-in">
          Copied!
        </span>
      )}
    </div>
  )
}
