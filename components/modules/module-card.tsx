"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExecutableRune } from '@/components/ui/executable-rune'
import { cn } from '@/lib/utils'
import { getDifficultyLabel, getPlanDisplayName } from '@/lib/module.schema'
import { Module, ModuleVector, ModulePlan } from '@/lib/module.schema'

interface ModuleCardProps {
  module: Module
  userPlan: ModulePlan
  onView: (module: Module) => void
  onSimulate: (module: Module) => void
  className?: string
}

export function ModuleCard({ 
  module, 
  userPlan, 
  onView, 
  onSimulate, 
  className 
}: ModuleCardProps) {
  const canAccess = userPlan === 'enterprise' || 
    (userPlan === 'pro' && ['free', 'creator', 'pro'].includes(module.minPlan)) ||
    (userPlan === 'creator' && ['free', 'creator'].includes(module.minPlan)) ||
    (userPlan === 'free' && module.minPlan === 'free')
  
  const getVectorColor = (vector: ModuleVector) => {
    const colors = {
      strategic: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      operations: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      content: 'bg-green-500/20 text-green-400 border-green-500/30',
      analytics: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      branding: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      sales: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      technical: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      crisis_management: 'bg-red-500/20 text-red-400 border-red-500/30'
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
  
  return (
    <Card className={cn(
      'pf-bg-glass border-border/50 hover:border-primary-neon/30 transition-all duration-220 group',
      !canAccess && 'opacity-60',
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-sans text-foreground-primary group-hover:text-primary-neon transition-colors">
              {module.title}
            </CardTitle>
            <CardDescription className="text-sm text-foreground-secondary mt-1">
              {module.summary}
            </CardDescription>
          </div>
          <ExecutableRune 
            variant={canAccess ? 'idle' : 'loading'} 
            size="sm"
            className="ml-2 opacity-60 group-hover:opacity-100"
          />
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Vectors */}
        <div className="flex flex-wrap gap-1 mb-3">
          {module.vectors.map((vector) => (
            <Badge 
              key={vector}
              variant="outline" 
              className={cn('text-xs', getVectorColor(vector))}
            >
              {vector}
            </Badge>
          ))}
        </div>
        
        {/* Metadata */}
        <div className="flex items-center gap-2 mb-4">
          <Badge 
            variant="outline" 
            className={cn('text-xs', getDifficultyColor(module.difficulty))}
          >
            {getDifficultyLabel(module.difficulty)}
          </Badge>
          <Badge 
            variant="outline" 
            className={cn('text-xs', getPlanColor(module.minPlan))}
          >
            {getPlanDisplayName(module.minPlan)}
          </Badge>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onView(module)}
            className="flex-1 pf-focus-ring"
          >
            View Details
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => onSimulate(module)}
            disabled={!canAccess}
            className={cn(
              'flex-1',
              canAccess 
                ? 'bg-primary-neon hover:bg-primary-neon-hover text-bg-primary' 
                : 'opacity-50 cursor-not-allowed'
            )}
          >
            {canAccess ? 'Simulate' : 'Upgrade'}
          </Button>
        </div>
        
        {!canAccess && (
          <p className="text-xs text-foreground-muted mt-2 text-center">
            Requires {getPlanDisplayName(module.minPlan)} plan
          </p>
        )}
      </CardContent>
    </Card>
  )
}
