"use client"

import React from 'react'
import { Search, Filter, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterBarProps {
  onSearchChange: (query: string) => void
  onVectorsChange: (vectors: string[]) => void
  onDifficultyChange: (maxDifficulty: number) => void
  onPlanChange: (plan: string) => void
  className?: string
}

const vectors = ['strategic', 'rhetoric', 'content', 'analytics', 'branding', 'crisis', 'cognitive']
const difficulties = [
  { value: 1, label: 'Beginner' },
  { value: 2, label: 'Beginner+' },
  { value: 3, label: 'Intermediate' },
  { value: 4, label: 'Advanced' },
  { value: 5, label: 'Expert' }
]
const plans = ['all', 'free', 'creator', 'pro', 'enterprise']

export function FilterBar({ 
  onSearchChange, 
  onVectorsChange, 
  onDifficultyChange, 
  onPlanChange,
  className 
}: FilterBarProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedVectors, setSelectedVectors] = React.useState<string[]>([])
  const [maxDifficulty, setMaxDifficulty] = React.useState(5)
  const [selectedPlan, setSelectedPlan] = React.useState('all')
  const [showFilters, setShowFilters] = React.useState(false)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    onSearchChange(value)
  }

  const handleVectorToggle = (vector: string) => {
    const newVectors = selectedVectors.includes(vector)
      ? selectedVectors.filter(v => v !== vector)
      : [...selectedVectors, vector]
    setSelectedVectors(newVectors)
    onVectorsChange(newVectors)
  }

  const handleDifficultyChange = (difficulty: number) => {
    setMaxDifficulty(difficulty)
    onDifficultyChange(difficulty)
  }

  const handlePlanChange = (plan: string) => {
    setSelectedPlan(plan)
    onPlanChange(plan)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedVectors([])
    setMaxDifficulty(5)
    setSelectedPlan('all')
    onSearchChange('')
    onVectorsChange([])
    onDifficultyChange(5)
    onPlanChange('all')
  }

  const hasActiveFilters = searchQuery || selectedVectors.length > 0 || maxDifficulty < 5 || selectedPlan !== 'all'

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foregroundMuted w-4 h-4" />
        <input
          type="text"
          placeholder="Search modules... (Cmd+K)"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-md text-foreground placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-3 py-2 bg-surface-alt border border-border rounded-md text-foreground hover:border-accent/50 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span className="font-sans text-sm">Filters</span>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
              {selectedVectors.length + (maxDifficulty < 5 ? 1 : 0) + (selectedPlan !== 'all' ? 1 : 0)}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 text-foregroundMuted hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
            <span className="font-sans text-sm">Clear</span>
          </button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="space-y-4 pt-4 border-t border-border">
          {/* Vectors */}
          <div>
            <h4 className="font-sans text-sm font-medium text-foreground mb-2">Vectors</h4>
            <div className="flex flex-wrap gap-2">
              {vectors.map((vector) => (
                <button
                  key={vector}
                  onClick={() => handleVectorToggle(vector)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-sans transition-colors',
                    selectedVectors.includes(vector)
                      ? 'bg-accent/20 text-accent border border-accent/30'
                      : 'bg-surface-alt text-foreground-muted border border-border hover:border-accent/50'
                  )}
                >
                  {vector}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <h4 className="font-sans text-sm font-medium text-foreground mb-2">Max Difficulty</h4>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty.value}
                  onClick={() => handleDifficultyChange(difficulty.value)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-sans transition-colors',
                    maxDifficulty >= difficulty.value
                      ? 'bg-accent/20 text-accent border border-accent/30'
                      : 'bg-surface-alt text-foreground-muted border border-border hover:border-accent/50'
                  )}
                >
                  {difficulty.label}
                </button>
              ))}
            </div>
          </div>

          {/* Plan */}
          <div>
            <h4 className="font-sans text-sm font-medium text-foreground mb-2">Plan Access</h4>
            <div className="flex flex-wrap gap-2">
              {plans.map((plan) => (
                <button
                  key={plan}
                  onClick={() => handlePlanChange(plan)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-sans transition-colors capitalize',
                    selectedPlan === plan
                      ? 'bg-accent/20 text-accent border border-accent/30'
                      : 'bg-surface-alt text-foreground-muted border border-border hover:border-accent/50'
                  )}
                >
                  {plan}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}