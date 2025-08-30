"use client"

import React from 'react'
import Link from 'next/link'
import { ForgeLogo } from './forge-logo'
import { cn } from '@/lib/utils'

interface NavBarProps {
  plan: 'free' | 'creator' | 'pro' | 'enterprise'
  className?: string
}

export function NavBar({ plan, className }: NavBarProps) {
  const getPlanColor = (plan: string) => {
    const colors = {
      free: 'text-textMuted',
      creator: 'text-purple-400',
      pro: 'text-brand',
      enterprise: 'text-gold'
    }
    return colors[plan as keyof typeof colors] || colors.free
  }

  const getPlanDisplayName = (plan: string) => {
    const names = {
      free: 'Free',
      creator: 'Creator',
      pro: 'Pro',
      enterprise: 'Enterprise'
    }
    return names[plan as keyof typeof names] || 'Free'
  }

  return (
    <nav className={cn('border-b border-border bg-bg/80 backdrop-blur-sm sticky top-0 z-50', className)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <ForgeLogo variant="static" size="md" />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="font-ui text-sm text-textMuted hover:text-text transition-colors"
            >
              Landing
            </Link>
            <Link 
              href="/generator" 
              className="font-ui text-sm text-textMuted hover:text-text transition-colors"
            >
              Generator
            </Link>
            <Link 
              href="/pricing" 
              className="font-ui text-sm text-textMuted hover:text-text transition-colors"
            >
              Pricing
            </Link>
            <Link 
              href="/dashboard" 
              className="font-ui text-sm text-textMuted hover:text-text transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/docs/api" 
              className="font-ui text-sm text-textMuted hover:text-text transition-colors"
            >
              API Docs
            </Link>
          </div>

          {/* Plan Badge */}
          <div className="flex items-center space-x-4">
            <span className={cn('font-ui text-sm font-medium', getPlanColor(plan))}>
              {getPlanDisplayName(plan)}
            </span>
            {plan !== 'free' && (
              <Link 
                href="/dashboard"
                className="px-3 py-1 rounded-md bg-surfaceAlt border border-border text-text hover:border-brand/50 transition-colors font-ui text-sm"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}