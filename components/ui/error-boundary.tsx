'use client'

import * as React from "react"
import { Button } from "./button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { Alert, AlertDescription } from "./alert"
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react"
import Link from "next/link"

export interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
  errorId?: string
}

export interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  resetKeys?: Array<string | number>
  resetOnPropsChange?: boolean
}

export interface ErrorFallbackProps {
  error: Error
  resetError: () => void
  errorId?: string
}

// Default error fallback component
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetError, 
  errorId 
}) => {
  const [isReporting, setIsReporting] = React.useState(false)

  const handleReportError = async () => {
    setIsReporting(true)
    try {
      // Report error to monitoring service
      await fetch('/api/errors/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: error.message,
          stack: error.stack,
          errorId,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        })
      })
    } catch (reportError) {
      console.error('Failed to report error:', reportError)
    } finally {
      setIsReporting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl glass-card">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-state-error/20 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-state-error" />
          </div>
          <CardTitle className="text-2xl">Something went wrong</CardTitle>
          <CardDescription>
            We encountered an unexpected error. Our team has been notified.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Error Details */}
          <Alert variant="destructive">
            <Bug className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Error Details:</p>
                <p className="text-sm font-mono bg-black/20 p-2 rounded">
                  {error.message}
                </p>
                {errorId && (
                  <p className="text-xs text-muted-foreground">
                    Error ID: {errorId}
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={resetError}
              className="flex-1"
              icon={<RefreshCw className="w-4 h-4" />}
            >
              Try Again
            </Button>
            
            <Button
              variant="secondary"
              onClick={handleReportError}
              disabled={isReporting}
              className="flex-1"
              icon={<Bug className="w-4 h-4" />}
            >
              {isReporting ? 'Reporting...' : 'Report Issue'}
            </Button>
            
            <Button
              variant="outline"
              asChild
              className="flex-1"
              icon={<Home className="w-4 h-4" />}
            >
              <Link href="/">
                Go Home
              </Link>
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              If this problem persists, please contact our support team with the error ID above.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Error boundary class component
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Generate unique error ID
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return {
      hasError: true,
      error,
      errorId,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Update state with error info
    this.setState({ errorInfo })

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Report to error monitoring service
    this.reportError(error, errorInfo)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props
    const { hasError } = this.state

    // Reset error boundary when resetKeys change
    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys && resetOnPropsChange) {
        this.resetError()
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }
  }

  private reportError = async (error: Error, errorInfo: React.ErrorInfo) => {
    try {
      await fetch('/api/errors/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          errorId: this.state.errorId,
          timestamp: new Date().toISOString(),
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
          url: typeof window !== 'undefined' ? window.location.href : 'SSR',
        })
      })
    } catch (reportError) {
      console.error('Failed to report error to monitoring service:', reportError)
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined, errorId: undefined })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      
      return (
        <FallbackComponent
          error={this.state.error}
          resetError={this.resetError}
          errorId={this.state.errorId}
        />
      )
    }

    return this.props.children
  }
}

// Hook for functional components to handle errors
export function useErrorHandler() {
  return React.useCallback((error: Error, errorInfo?: { componentStack?: string }) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo)
    
    // Report error
    fetch('/api/errors/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo?.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      })
    }).catch(reportError => {
      console.error('Failed to report error:', reportError)
    })
  }, [])
}

// Higher-order component for error handling
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Async error boundary for handling promise rejections
export function AsyncErrorBoundary({ children }: { children: React.ReactNode }) {
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason)
      setError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)))
    }

    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error)
      setError(event.error instanceof Error ? event.error : new Error(event.message))
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [])

  if (error) {
    return <DefaultErrorFallback error={error} resetError={() => setError(null)} />
  }

  return <>{children}</>
}
