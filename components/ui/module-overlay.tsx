"use client"

import React from 'react'
import { X, Play, Download, ExternalLink } from 'lucide-react'
import { ForgeGlyph } from './forge-glyph'
import { cn } from '@/lib/utils'

interface Module {
  id: string
  title: string
  vectors: string[]
  difficulty: 1 | 2 | 3 | 4 | 5
  minPlan: 'free' | 'creator' | 'pro' | 'enterprise'
  summary: string
  overview: string
  inputs: string[]
  outputs: string[]
  kpis: string[]
  guardrails: string[]
}

interface ModuleOverlayProps {
  isOpen: boolean
  onClose: () => void
  module: Module
  currentPlan: 'free' | 'creator' | 'pro' | 'enterprise'
  onSimulate: () => void
  onRunRealTest: () => void
  onExport: (format: string) => void
}

export function ModuleOverlay({
  isOpen,
  onClose,
  module,
  currentPlan,
  onSimulate,
  onRunRealTest,
  onExport
}: ModuleOverlayProps) {
  if (!isOpen) return null

  const canAccess = currentPlan === 'enterprise' || 
    (currentPlan === 'pro' && ['free', 'creator', 'pro'].includes(module.minPlan)) ||
    (currentPlan === 'creator' && ['free', 'creator'].includes(module.minPlan)) ||
    (currentPlan === 'free' && module.minPlan === 'free')

  const canRunRealTest = currentPlan === 'pro' || currentPlan === 'enterprise'

  const getAvailableExports = () => {
    const exports = {
      free: ['txt'],
      creator: ['txt', 'md'],
      pro: ['txt', 'md', 'pdf', 'json'],
      enterprise: ['txt', 'md', 'pdf', 'json', 'zip']
    }
    return exports[currentPlan]
  }

  const getVectorColor = (vector: string) => {
    const colors = {
      strategic: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      rhetoric: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      content: 'bg-green-500/20 text-green-400 border-green-500/30',
      analytics: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      branding: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      crisis: 'bg-red-500/20 text-red-400 border-red-500/30',
      cognitive: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    }
    return colors[vector as keyof typeof colors] || colors.strategic
  }

  const getDifficultyColor = (difficulty: number) => {
    const colors = {
      1: 'bg-green-500/20 text-green-400 border-green-500/30',
      2: 'bg-green-400/20 text-green-300 border-green-400/30',
      3: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      4: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      5: 'bg-red-500/20 text-red-400 border-red-500/30'
    }
    return colors[difficulty as keyof typeof colors]
  }

  const getDifficultyLabel = (difficulty: number) => {
    const labels = {
      1: 'Beginner',
      2: 'Beginner+',
      3: 'Intermediate',
      4: 'Advanced',
      5: 'Expert'
    }
    return labels[difficulty as keyof typeof labels]
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-surface border border-border rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <ForgeGlyph variant="pulse" size="md" />
            <div>
              <h2 className="font-sans text-2xl font-semibold text-foreground">
                {module.title}
              </h2>
              <p className="text-foregroundMuted font-sans text-sm">
                {module.summary}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-foregroundMuted hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Overview */}
              <div>
                <h3 className="font-sans text-lg font-semibold text-foreground mb-3">Overview</h3>
                <p className="text-foregroundMuted font-sans text-sm leading-relaxed">
                  {module.overview}
                </p>
              </div>

              {/* Vectors */}
              <div>
                <h3 className="font-sans text-lg font-semibold text-foreground mb-3">Vectors</h3>
                <div className="flex flex-wrap gap-2">
                  {module.vectors.map((vector) => (
                    <span 
                      key={vector}
                      className={cn('px-3 py-1 rounded-full text-sm font-sans border', getVectorColor(vector))}
                    >
                      {vector}
                    </span>
                  ))}
                </div>
              </div>

              {/* Inputs */}
              <div>
                <h3 className="font-sans text-lg font-semibold text-foreground mb-3">Inputs</h3>
                <ul className="space-y-2">
                  {module.inputs.map((input, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="rune-executable w-4 h-4 flex-shrink-0 mt-0.5">
                        <div className="star-8 w-2 h-2" />
                      </div>
                      <span className="text-foregroundMuted font-sans text-sm">{input}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Outputs */}
              <div>
                <h3 className="font-sans text-lg font-semibold text-foreground mb-3">Outputs</h3>
                <ul className="space-y-2">
                  {module.outputs.map((output, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="rune-executable w-4 h-4 flex-shrink-0 mt-0.5">
                        <div className="star-8 w-2 h-2" />
                      </div>
                      <span className="text-foregroundMuted font-sans text-sm">{output}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* KPIs */}
              <div>
                <h3 className="font-sans text-lg font-semibold text-foreground mb-3">Key Performance Indicators</h3>
                <ul className="space-y-2">
                  {module.kpis.map((kpi, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="rune-executable w-4 h-4 flex-shrink-0 mt-0.5">
                        <div className="star-8 w-2 h-2" />
                      </div>
                      <span className="text-foregroundMuted font-sans text-sm">{kpi}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Guardrails */}
              <div>
                <h3 className="font-sans text-lg font-semibold text-foreground mb-3">Guardrails</h3>
                <ul className="space-y-2">
                  {module.guardrails.map((guardrail, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="rune-executable w-4 h-4 flex-shrink-0 mt-0.5">
                        <div className="star-8 w-2 h-2" />
                      </div>
                      <span className="text-foregroundMuted font-sans text-sm">{guardrail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Metadata */}
              <div>
                <h3 className="font-sans text-lg font-semibold text-foreground mb-3">Module Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-foregroundMuted font-sans text-sm">Difficulty:</span>
                    <span className={cn('px-2 py-1 rounded-full text-xs font-sans border', getDifficultyColor(module.difficulty))}>
                      {getDifficultyLabel(module.difficulty)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foregroundMuted font-sans text-sm">Min Plan:</span>
                    <span className="text-foreground font-sans text-sm capitalize">{module.minPlan}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foregroundMuted font-sans text-sm">Module ID:</span>
                    <span className="text-foreground font-sans text-sm font-mono">{module.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-border bg-surfaceAlt">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onSimulate}
                className="flex items-center space-x-2 px-4 py-2 bg-surface border border-border text-foreground hover:border-accent/50 transition-colors rounded-md font-sans text-sm"
              >
                <Play className="w-4 h-4" />
                <span>Simulate</span>
              </button>
              
              {canRunRealTest && (
                <button
                  onClick={onRunRealTest}
                  className="flex items-center space-x-2 px-4 py-2 bg-accent text-accent-foreground hover:bg-accent/90 transition-colors rounded-md font-sans text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Run Real Test</span>
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-foregroundMuted font-sans text-sm mr-2">Export:</span>
              {getAvailableExports().map((format) => (
                <button
                  key={format}
                  onClick={() => onExport(format)}
                  className="flex items-center space-x-1 px-3 py-1 bg-surface border border-border text-foreground hover:border-accent/50 transition-colors rounded-md font-sans text-xs"
                >
                  <Download className="w-3 h-3" />
                  <span className="uppercase">{format}</span>
                </button>
              ))}
            </div>
          </div>

          {!canAccess && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
              <p className="text-red-400 font-sans text-sm">
                This module requires {module.minPlan} plan or higher. Upgrade to access all features.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}