"use client"

import React from 'react'
import { ExecutableRune } from './executable-rune'
import { cn } from '@/lib/utils'
import { getDifficultyLabel, getPlanDisplayName } from '@/lib/module.schema'

interface ModuleCardProps {
  id: string
  title: string
  vectors: string[]
  difficulty: 1 | 2 | 3 | 4 | 5
  minPlan: 'free' | 'creator' | 'pro' | 'enterprise'
  summary: string
  currentPlan: 'free' | 'creator' | 'pro' | 'enterprise'
  onView: () => void
  className?: string
}

export function ModuleCard({
  id,
  title,
  vectors,
  difficulty,
  minPlan,
  summary,
  currentPlan,
  onView,
  className
}: ModuleCardProps) {
  const canAccess = currentPlan === 'enterprise' || 
    (currentPlan === 'pro' && ['free', 'creator', 'pro'].includes(minPlan)) ||
    (currentPlan === 'creator' && ['free', 'creator'].includes(minPlan)) ||
    (currentPlan === 'free' && minPlan === 'free')

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

  const getPlanColor = (plan: string) => {
    const colors = {
      free: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      creator: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      pro: 'bg-green-500/20 text-green-400 border-green-500/30',
      enterprise: 'bg-gold/20 text-gold border-gold/30'
    }
    return colors[plan as keyof typeof colors]
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

  const getPlanDisplayName = (plan: string) => {
    const names = {
      free: 'Free',
      creator: 'Creator',
      pro: 'Pro',
      enterprise: 'Enterprise'
    }
    return names[plan as keyof typeof names]
  }

  return (
    <div className={cn(
      'bg-card border border-border rounded-xl p-6 hover:border-accent/30 transition-all duration-200 group',
      !canAccess && 'opacity-60',
      className
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-sans text-lg font-semibold text-fg-primary group-hover:text-accent transition-colors mb-2">
            {title}
          </h3>
          <p className="text-fg-secondary font-sans text-sm leading-relaxed">
            {summary}
          </p>
        </div>
        <ExecutableRune 
          variant={canAccess ? 'idle' : 'loading'} 
          size="sm"
          className="ml-3 opacity-60 group-hover:opacity-100"
        />
      </div>

      {/* Vectors */}
      <div className="flex flex-wrap gap-1 mb-4">
        {vectors.map((vector) => (
          <span 
            key={vector}
            className={cn('px-2 py-1 rounded-full text-xs font-ui border', getVectorColor(vector))}
          >
            {vector}
          </span>
        ))}
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-2 mb-4">
        <span className={cn('px-2 py-1 rounded-full text-xs font-ui border', getDifficultyColor(difficulty))}>
          {getDifficultyLabel(difficulty)}
        </span>
        <span className={cn('px-2 py-1 rounded-full text-xs font-ui border', getPlanColor(minPlan))}>
          {getPlanDisplayName(minPlan)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onView}
          className="flex-1 px-4 py-2 bg-muted border border-border text-fg-primary hover:border-accent/50 transition-colors rounded-md font-sans text-sm"
        >
          View Details
        </button>
        <button
          disabled={!canAccess}
          className={cn(
            'flex-1 px-4 py-2 rounded-md font-sans text-sm transition-all',
            canAccess 
              ? 'bg-accent text-accent-foreground hover:bg-accent/90 active:scale-98' 
              : 'bg-muted text-fg-secondary cursor-not-allowed opacity-50'
          )}
        >
          {canAccess ? 'Simulate' : 'Upgrade'}
        </button>
      </div>

      {!canAccess && (
        <p className="text-xs text-fg-secondary mt-2 text-center">
          Requires {getPlanDisplayName(minPlan)} plan
        </p>
      )}
    </div>
  )
}