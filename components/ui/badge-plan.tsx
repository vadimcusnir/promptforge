"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface BadgePlanProps {
  plan: 'free' | 'creator' | 'pro' | 'enterprise'
  className?: string
}

export function BadgePlan({ plan, className }: BadgePlanProps) {
  const getPlanConfig = (plan: string) => {
    const configs = {
      free: {
        label: 'Free',
        className: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      },
      creator: {
        label: 'Creator',
        className: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      },
      pro: {
        label: 'Pro',
        className: 'bg-green-500/20 text-green-400 border-green-500/30'
      },
      enterprise: {
        label: 'Enterprise',
        className: 'bg-gold/20 text-gold border-gold/30'
      }
    }
    return configs[plan as keyof typeof configs] || configs.free
  }

  const config = getPlanConfig(plan)

  return (
    <span className={cn(
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-ui font-medium border',
      config.className,
      className
    )}>
      {config.label}
    </span>
  )
}