"use client"

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface ExecutableRuneProps {
  variant?: 'idle' | 'hover' | 'loading' | 'active'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
}

export function ExecutableRune({ 
  variant = 'idle', 
  size = 'md', 
  className,
  onClick 
}: ExecutableRuneProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'idle':
        return 'pf-pulse'
      case 'hover':
        return isHovered ? 'pf-glitch' : 'pf-pulse'
      case 'loading':
        return 'animate-spin'
      case 'active':
        return 'pf-border-glow'
      default:
        return 'pf-pulse'
    }
  }
  
  return (
    <div
      className={cn(
        'relative cursor-pointer transition-all duration-220',
        sizeClasses[size],
        getVariantClasses(),
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      data-text="⚡"
    >
      <svg
        viewBox="0 0 32 32"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Sacred Circle */}
        <circle
          cx="16"
          cy="16"
          r="14"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary-neon/30"
        />
        
        {/* Inner 8-Point Star */}
        <g className="text-primary-neon">
          {/* Vertical/Horizontal lines */}
          <line x1="16" y1="4" x2="16" y2="28" strokeWidth="1.5" />
          <line x1="4" y1="16" x2="28" y2="16" strokeWidth="1.5" />
          
          {/* Diagonal lines */}
          <line x1="6.34" y1="6.34" x2="25.66" y2="25.66" strokeWidth="1.5" />
          <line x1="25.66" y1="6.34" x2="6.34" y2="25.66" strokeWidth="1.5" />
          
          {/* 45-degree lines */}
          <line x1="11.31" y1="4" x2="20.69" y2="28" strokeWidth="1.5" />
          <line x1="20.69" y1="4" x2="11.31" y2="28" strokeWidth="1.5" />
          <line x1="4" y1="11.31" x2="28" y2="20.69" strokeWidth="1.5" />
          <line x1="28" y1="11.31" x2="4" y2="20.69" strokeWidth="1.5" />
        </g>
        
        {/* Central Core */}
        <circle
          cx="16"
          cy="16"
          r="3"
          fill="currentColor"
          className="text-primary-neon"
        />
        
        {/* Execution Dots */}
        {variant === 'loading' && (
          <g className="text-gold">
            <circle cx="8" cy="8" r="1" fill="currentColor">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="24" cy="8" r="1" fill="currentColor">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" begin="0.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="24" cy="24" r="1" fill="currentColor">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" begin="0.4s" repeatCount="indefinite" />
            </circle>
            <circle cx="8" cy="24" r="1" fill="currentColor">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" begin="0.6s" repeatCount="indefinite" />
            </circle>
          </g>
        )}
      </svg>
    </div>
  )
}

export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn('pf-loading-dots', className)}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  )
}

export function SacredStar({ 
  size = 'md', 
  className,
  animated = false 
}: { 
  size?: 'sm' | 'md' | 'lg'
  className?: string
  animated?: boolean 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }
  
  return (
    <div className={cn('pf-sacred-star', sizeClasses[size], className)}>
      {animated && (
        <div className="absolute inset-0 animate-ping">
          <div className="w-full h-full border border-primary-neon/20 rounded-full"></div>
        </div>
      )}
    </div>
  )
}
