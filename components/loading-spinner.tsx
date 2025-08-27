"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2, RefreshCw, Clock, CheckCircle, AlertCircle } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'success' | 'error' | 'pulse'
  className?: string
  text?: string
  showIcon?: boolean
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'default',
  className,
  text,
  showIcon = true
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const variantClasses = {
    default: 'text-primary',
    success: 'text-green-500',
    error: 'text-red-500',
    pulse: 'text-yellow-500'
  }

  const iconClasses = cn(
    sizeClasses[size],
    variantClasses[variant],
    variant === 'pulse' ? 'animate-pulse' : 'animate-spin',
    className
  )

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      {showIcon && (
        <Loader2 className={iconClasses} />
      )}
      {text && (
        <p className="text-sm text-muted-foreground text-center">{text}</p>
      )}
    </div>
  )
}

interface LoadingStateProps {
  type?: 'spinner' | 'dots' | 'bars' | 'pulse'
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export function LoadingState({ 
  type = 'spinner', 
  size = 'md',
  text = 'Loading...',
  className 
}: LoadingStateProps) {
  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "bg-current rounded-full animate-bounce",
                  size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )
      
      case 'bars':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "bg-current animate-pulse",
                  size === 'sm' ? 'w-1 h-6' : size === 'md' ? 'w-1.5 h-8' : 'w-2 h-10'
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )
      
      case 'pulse':
        return (
          <div className={cn(
            "bg-current rounded-full animate-pulse",
            size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'
          )} />
        )
      
      default:
        return <LoadingSpinner size={size} />
    }
  }

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-3", className)}>
      {renderLoader()}
      {text && (
        <p className="text-sm text-muted-foreground text-center">{text}</p>
      )}
    </div>
  )
}

interface StatusIndicatorProps {
  status: 'loading' | 'success' | 'error' | 'idle'
  text?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function StatusIndicator({ 
  status, 
  text, 
  size = 'md',
  className 
}: StatusIndicatorProps) {
  const statusConfig = {
    loading: {
      icon: RefreshCw,
      color: 'text-blue-500',
      animation: 'animate-spin'
    },
    success: {
      icon: CheckCircle,
      color: 'text-green-500',
      animation: ''
    },
    error: {
      icon: AlertCircle,
      color: 'text-red-500',
      animation: ''
    },
    idle: {
      icon: Clock,
      color: 'text-gray-400',
      animation: ''
    }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Icon className={cn(sizeClasses[size], config.color, config.animation)} />
      {text && (
        <span className="text-sm text-muted-foreground">{text}</span>
      )}
    </div>
  )
}

// Full page loading component
export function PageLoading({ 
  text = 'Loading page...',
  className 
}: { 
  text?: string
  className?: string 
}) {
  return (
    <div className={cn("min-h-screen flex items-center justify-center", className)}>
      <div className="text-center space-y-4">
        <LoadingSpinner size="xl" />
        <p className="text-lg text-muted-foreground">{text}</p>
      </div>
    </div>
  )
}

// Inline loading component
export function InlineLoading({ 
  text,
  size = 'sm',
  className 
}: { 
  text?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string 
}) {
  return (
    <div className={cn("inline-flex items-center space-x-2", className)}>
      <LoadingSpinner size={size} showIcon={true} />
      {text && (
        <span className="text-sm text-muted-foreground">{text}</span>
      )}
    </div>
  )
}
