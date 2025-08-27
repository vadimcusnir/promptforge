"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  Inbox, 
  Search, 
  FileText, 
  History, 
  Download, 
  Plus,
  AlertCircle,
  Lightbulb,
  Target,
  Zap
} from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'secondary' | 'ghost'
    icon?: React.ComponentType<{ className?: string }>
  }
  secondaryAction?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  }
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = 'md'
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: 'p-6',
      icon: 'w-12 h-12',
      title: 'text-lg',
      description: 'text-sm'
    },
    md: {
      container: 'p-8',
      icon: 'w-16 h-16',
      title: 'text-xl',
      description: 'text-base'
    },
    lg: {
      container: 'p-12',
      icon: 'w-20 h-20',
      title: 'text-2xl',
      description: 'text-lg'
    }
  }

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center",
      sizeClasses[size].container,
      className
    )}>
      <div className={cn(
        "text-muted-foreground mb-4",
        sizeClasses[size].icon
      )}>
        <Icon className="w-full h-full" />
      </div>
      
      <h3 className={cn(
        "font-semibold text-foreground mb-2",
        sizeClasses[size].title
      )}>
        {title}
      </h3>
      
      <p className={cn(
        "text-muted-foreground max-w-sm",
        sizeClasses[size].description
      )}>
        {description}
      </p>
      
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || 'default'}
              className="flex items-center gap-2"
            >
              {action.icon && <action.icon className="w-4 h-4" />}
              {action.label}
            </Button>
          )}
          
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant={secondaryAction.variant || 'outline'}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// Predefined empty states for common scenarios
export function NoDataEmptyState({
  title = "No data available",
  description = "There's nothing to display here yet.",
  action,
  className
}: Omit<EmptyStateProps, 'icon'>) {
  return (
    <EmptyState
      icon={Inbox}
      title={title}
      description={description}
      action={action}
      className={className}
    />
  )
}

export function NoResultsEmptyState({
  title = "No results found",
  description = "Try adjusting your search or filters to find what you're looking for.",
  action,
  className
}: Omit<EmptyStateProps, 'icon'>) {
  return (
    <EmptyState
      icon={Search}
      title={title}
      description={description}
      action={action}
      className={className}
    />
  )
}

export function NoHistoryEmptyState({
  title = "No history yet",
  description = "Your activity history will appear here once you start using the platform.",
  action,
  className
}: Omit<EmptyStateProps, 'icon'>) {
  return (
    <EmptyState
      icon={History}
      title={title}
      description={description}
      action={action}
      className={className}
    />
  )
}

export function NoExportsEmptyState({
  title = "No exports yet",
  description = "Export your prompts to various formats to get started.",
  action,
  className
}: Omit<EmptyStateProps, 'icon'>) {
  return (
    <EmptyState
      icon={Download}
      title={title}
      description={description}
      action={action}
      className={className}
    />
  )
}

export function NoPromptsEmptyState({
  title = "No prompts generated",
  description = "Start by creating your first prompt using the generator.",
  action,
  className
}: Omit<EmptyStateProps, 'icon'>) {
  return (
    <EmptyState
      icon={FileText}
      title={title}
      description={description}
      action={action}
      className={className}
    />
  )
}

export function NoTestsEmptyState({
  title = "No tests run",
  description = "Test your prompts to see how they perform and get improvement suggestions.",
  action,
  className
}: Omit<EmptyStateProps, 'icon'>) {
  return (
    <EmptyState
      icon={Target}
      title={title}
      description={description}
      action={action}
      className={className}
    />
  )
}

export function NoModulesEmptyState({
  title = "No modules available",
  description = "Modules will appear here once they're configured for your account.",
  action,
  className
}: Omit<EmptyStateProps, 'icon'>) {
  return (
    <EmptyState
      icon={Zap}
      title={title}
      description={description}
      action={action}
      className={className}
    />
  )
}

export function NoInsightsEmptyState({
  title = "No insights yet",
  description = "Performance insights will appear here as you use the platform.",
  action,
  className
}: Omit<EmptyStateProps, 'icon'>) {
  return (
    <EmptyState
      icon={Lightbulb}
      title={title}
      description={description}
      action={action}
      className={className}
    />
  )
}

export function ErrorEmptyState({
  title = "Something went wrong",
  description = "We encountered an error while loading this content. Please try again.",
  action,
  className
}: Omit<EmptyStateProps, 'icon'>) {
  return (
    <EmptyState
      icon={AlertCircle}
      title={title}
      description={description}
      action={action}
      className={className}
    />
  )
}
