import * as Sentry from '@sentry/nextjs'

// Sentry configuration
export const initSentry = () => {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      // Remove unavailable integrations for now
      beforeSend(event) {
        // Filter out certain errors or add context
        if (event.exception) {
          // Add organization context if available
          const orgId = (event as any).user?.id
          if (orgId) {
            event.tags = { ...event.tags, organization: orgId }
          }
        }
        return event
      },
    })
  }
}

// Capture and report exceptions
export const captureException = (error: Error, context?: Record<string, any>) => {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(error, {
      contexts: context ? { custom: context } : undefined,
      tags: {
        location: 'client_side',
        component: context?.component || 'unknown'
      }
    })
  }
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('🚨 Sentry Error:', error, context)
  }
}

// Force a controlled error for testing
export const forceTestError = (message: string = 'Test error for Sentry monitoring') => {
  if (process.env.NODE_ENV === 'development') {
    Sentry.captureMessage(message, 'info')
  } else {
    Sentry.captureException(new Error(message))
  }
}

// Capture and report messages
export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info', context?: Record<string, any>) => {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureMessage(message, {
      level,
      contexts: context ? { custom: context } : undefined,
      tags: {
        location: 'client_side',
        component: context?.component || 'unknown'
      }
    })
  }
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`📝 Sentry ${level.toUpperCase()}:`, message, context)
  }
}

// Track custom events
export const trackSentryEvent = (eventName: string, data: Record<string, any>) => {
  captureMessage(eventName, 'info', data)
}

// Track performance metrics
export const trackPerformanceMetric = (metricName: string, value: number, tags?: Record<string, string>) => {
  Sentry.metrics.increment(metricName, value, tags)
}

// Set user context for error tracking
export const setUserContext = (userId: string, organizationId?: string) => {
  Sentry.setUser({
    id: userId,
    organization: organizationId,
  })
}

// Set organization context
export const setOrganizationContext = (orgId: string, orgName?: string) => {
  Sentry.setTag('organization', orgId)
  if (orgName) {
    Sentry.setTag('organization_name', orgName)
  }
}
