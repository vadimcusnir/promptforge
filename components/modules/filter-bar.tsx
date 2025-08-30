"use client"

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ModuleVector, ModulePlan } from '@/lib/module.schema'

interface FilterBarProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedVectors: ModuleVector[]
  onVectorToggle: (vector: ModuleVector) => void
  selectedDifficulties: number[]
  onDifficultyToggle: (difficulty: number) => void
  selectedPlans: ModulePlan[]
  onPlanToggle: (plan: ModulePlan) => void
  userPlan: ModulePlan
  className?: string
}

export function FilterBar({
  searchTerm,
  onSearchChange,
  selectedVectors,
  onVectorToggle,
  selectedDifficulties,
  onDifficultyToggle,
  selectedPlans,
  onPlanToggle,
  userPlan,
  className
}: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false)
  
  const vectors: ModuleVector[] = ['strategic', 'rhetoric', 'content', 'analytics', 'branding', 'crisis', 'cognitive']
  const difficulties = [1, 2, 3, 4, 5]
  const plans: ModulePlan[] = ['free', 'creator', 'pro', 'enterprise']
  
  const getVectorColor = (vector: ModuleVector) => {
    const colors = {
      strategic: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      rhetoric: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      content: 'bg-green-500/20 text-green-400 border-green-500/30',
      analytics: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      branding: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      crisis: 'bg-red-500/20 text-red-400 border-red-500/30',
      cognitive: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    }
    return colors[vector]
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
  
  const getPlanColor = (plan: ModulePlan) => {
    const colors = {
      free: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      creator: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      pro: 'bg-green-500/20 text-green-400 border-green-500/30',
      enterprise: 'bg-gold/20 text-gold border-gold/30'
    }
    return colors[plan]
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
  
  const getPlanDisplayName = (plan: ModulePlan) => {
    const names = {
      free: 'Free',
      creator: 'Creator',
      pro: 'Pro',
      enterprise: 'Enterprise'
    }
    return names[plan]
  }
  
  const clearAllFilters = () => {
    onSearchChange('')
    selectedVectors.forEach(onVectorToggle)
    selectedDifficulties.forEach(onDifficultyToggle)
    selectedPlans.forEach(onPlanToggle)
  }
  
  const hasActiveFilters = searchTerm || selectedVectors.length > 0 || selectedDifficulties.length > 0 || selectedPlans.length > 0
  
  return (
    <div className={cn('pf-bg-glass rounded-lg p-4 space-y-4', className)}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
        <Input
          placeholder="Search modules... (Cmd+K)"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 pf-focus-ring"
        />
      </div>
      
      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="pf-focus-ring"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {(selectedVectors.length + selectedDifficulties.length + selectedPlans.length) > 0 && (
            <Badge variant="secondary" className="ml-2">
              {selectedVectors.length + selectedDifficulties.length + selectedPlans.length}
            </Badge>
          )}
        </Button>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-text-muted hover:text-text-primary"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="space-y-4 pt-4 border-t border-border/50">
          {/* Vectors */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-2">Vectors</h4>
            <div className="flex flex-wrap gap-2">
              {vectors.map((vector) => (
                <Badge
                  key={vector}
                  variant="outline"
                  className={cn(
                    'cursor-pointer transition-all duration-150',
                    getVectorColor(vector),
                    selectedVectors.includes(vector) && 'ring-2 ring-primary-neon/50'
                  )}
                  onClick={() => onVectorToggle(vector)}
                >
                  {vector}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Difficulty */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-2">Difficulty</h4>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((difficulty) => (
                <Badge
                  key={difficulty}
                  variant="outline"
                  className={cn(
                    'cursor-pointer transition-all duration-150',
                    getDifficultyColor(difficulty),
                    selectedDifficulties.includes(difficulty) && 'ring-2 ring-primary-neon/50'
                  )}
                  onClick={() => onDifficultyToggle(difficulty)}
                >
                  {getDifficultyLabel(difficulty)}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Plans */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-2">Plan Access</h4>
            <div className="flex flex-wrap gap-2">
              {plans.map((plan) => (
                <Badge
                  key={plan}
                  variant="outline"
                  className={cn(
                    'cursor-pointer transition-all duration-150',
                    getPlanColor(plan),
                    selectedPlans.includes(plan) && 'ring-2 ring-primary-neon/50',
                    plan === userPlan && 'ring-2 ring-gold/50'
                  )}
                  onClick={() => onPlanToggle(plan)}
                >
                  {getPlanDisplayName(plan)}
                  {plan === userPlan && ' (Current)'}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
