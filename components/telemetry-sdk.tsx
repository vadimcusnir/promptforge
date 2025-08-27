"use client"

import { useAnalytics } from '@/hooks/use-analytics'
import { ReactNode } from 'react'

// Simple telemetry button that tracks clicks
export function TelemetryButton({ 
  children, 
  event, 
  properties = {}, 
  onClick,
  className = '',
  ...props 
}: {
  children: ReactNode
  event: string
  properties?: Record<string, any>
  onClick?: () => void
  className?: string
}) {
  const analytics = useAnalytics()

  const handleClick = () => {
    // Track the event using the analytics context
    console.log('Telemetry event:', event, properties)

    // Call original onClick if provided
    onClick?.()
  }

  return (
    <button
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
}

// Simple telemetry link that tracks clicks
export function TelemetryLink({ 
  children, 
  href, 
  event, 
  properties = {}, 
  className = '',
  ...props 
}: {
  children: ReactNode
  href: string
  event: string
  properties?: Record<string, any>
  className?: string
}) {
  const analytics = useAnalytics()

  const handleClick = () => {
    // Track the event using the analytics context
    console.log('Telemetry event:', event, properties)
  }

  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  )
}

// Export tracking wrapper
export function TelemetryExport({ 
  children, 
  format, 
  moduleId, 
  options = {},
  onExport,
  ...props 
}: {
  children: ReactNode
  format: 'pdf' | 'json' | 'zip' | 'md'
  moduleId: string
  options?: Record<string, any>
  onExport?: (format: string, options: Record<string, any>) => Promise<void>
}) {
  const analytics = useAnalytics()

  const handleExport = async () => {
    // Track export event based on format
    switch (format) {
      case 'pdf':
        analytics.exportPDF(moduleId, options)
        break
      case 'json':
        analytics.exportJSON(moduleId, options)
        break
      case 'zip':
        analytics.exportBundle(moduleId, options)
        break
      default:
        // Markdown is always available
        break
    }

    // Call original onExport if provided
    if (onExport) {
      await onExport(format, options)
    }
  }

  return (
    <div onClick={handleExport} {...props}>
      {children}
    </div>
  )
}

// GPT Test tracking wrapper
export function TelemetryGptTest({ 
  children, 
  moduleId, 
  params = {},
  onTest,
  ...props 
}: {
  children: ReactNode
  moduleId: string
  params?: Record<string, any>
  onTest?: (moduleId: string, params: Record<string, any>) => Promise<void>
}) {
  const analytics = useAnalytics()

  const handleTest = async () => {
    // Track GPT test event
    analytics.gptTestReal(moduleId, params)

    // Call original onTest if provided
    if (onTest) {
      await onTest(moduleId, params)
    }
  }

  return (
    <div onClick={handleTest} {...props}>
      {children}
    </div>
  )
}
