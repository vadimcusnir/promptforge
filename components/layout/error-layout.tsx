'use client'

import * as React from "react"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { AsyncErrorBoundary } from "@/components/ui/error-boundary"

export interface ErrorLayoutProps {
  children: React.ReactNode
  fallback?: React.ComponentType<any>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export function ErrorLayout({ children, fallback, onError }: ErrorLayoutProps) {
  return (
    <AsyncErrorBoundary>
      <ErrorBoundary fallback={fallback} onError={onError}>
        {children}
      </ErrorBoundary>
    </AsyncErrorBoundary>
  )
}

// Segment-specific error boundaries
export function SegmentErrorBoundary({ 
  children, 
  segment 
}: { 
  children: React.ReactNode
  segment: string 
}) {
  const handleError = React.useCallback((error: Error, errorInfo: React.ErrorInfo) => {
    console.error(`Error in ${segment} segment:`, error, errorInfo)
    
    // Report segment-specific errors
    fetch('/api/errors/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        segment,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      })
    }).catch(reportError => {
      console.error('Failed to report segment error:', reportError)
    })
  }, [segment])

  return (
    <ErrorBoundary onError={handleError}>
      {children}
    </ErrorBoundary>
  )
}

// Try-catch wrapper for async operations
export function withTryCatch<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
) {
  return function TryCatchWrapper(props: P) {
    const [error, setError] = React.useState<Error | null>(null)
    const [isRetrying, setIsRetrying] = React.useState(false)

    const handleError = React.useCallback((error: Error) => {
      console.error('Error in component:', error)
      setError(error)
    }, [])

    const retry = React.useCallback(() => {
      setIsRetrying(true)
      setError(null)
      // Reset retrying state after a short delay
      setTimeout(() => setIsRetrying(false), 1000)
    }, [])

    // Reset error when props change
    React.useEffect(() => {
      if (error) {
        setError(null)
      }
    }, [props])

    if (error && !isRetrying) {
      if (fallback) {
        return React.createElement(fallback, { error, retry })
      }
      
      return (
        <div className="p-4 border border-state-error/20 rounded-lg bg-state-error/5">
          <div className="flex items-center space-x-2 text-state-error">
            <span>⚠️</span>
            <span className="text-sm">Something went wrong. Please try again.</span>
            <button
              onClick={retry}
              className="text-xs underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        </div>
      )
    }

    try {
      return <Component {...props} onError={handleError} />
    } catch (componentError) {
      handleError(componentError instanceof Error ? componentError : new Error(String(componentError)))
      return null
    }
  }
}

// Hook for safe async operations
export function useSafeAsync<T>() {
  const [data, setData] = React.useState<T | null>(null)
  const [error, setError] = React.useState<Error | null>(null)
  const [loading, setLoading] = React.useState(false)

  const execute = React.useCallback(async (asyncFn: () => Promise<T>) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await asyncFn()
      setData(result)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = React.useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { data, error, loading, execute, reset }
}

// Error reporting hook
export function useErrorReporting() {
  const reportError = React.useCallback(async (error: Error, context?: Record<string, any>) => {
    try {
      await fetch('/api/errors/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: error.message,
          stack: error.stack,
          context,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        })
      })
    } catch (reportError) {
      console.error('Failed to report error:', reportError)
    }
  }, [])

  return { reportError }
}
