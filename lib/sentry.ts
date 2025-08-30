// Sentry configuration with dynamic imports to prevent webpack HMR issues
export const initSentry = () => {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.NODE_ENV === 'production') {
    // Dynamic import to prevent webpack HMR issues in development
    import('@sentry/nextjs').then((Sentry) => {
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
    }).catch((error) => {
      console.warn('Failed to initialize Sentry:', error.message)
    })
  }
}

// Capture and report exceptions
export const captureException = (error: Error, context?: Record<string, any>) => {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.NODE_ENV === 'production') {
    import('@sentry/nextjs').then((Sentry) => {
      Sentry.captureException(error, {
        contexts: context ? { custom: context } : undefined,
        tags: {
          location: 'client_side',
          component: context?.component || 'unknown'
        }
      })
    }).catch(() => {
      // Silently fail in development
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
    console.log('Test error (development):', message)
  } else if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    import('@sentry/nextjs').then((Sentry) => {
      Sentry.captureException(new Error(message))
    }).catch(() => {
      // Silently fail
    })
  }
}

// Capture and report messages
export const captureMessage = (message: string, level: 'info' | 'warning' | 'error' | 'debug' | 'fatal' = 'info', context?: Record<string, any>) => {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.NODE_ENV === 'production') {
    import('@sentry/nextjs').then((Sentry) => {
      Sentry.captureMessage(message, {
        level,
        contexts: context ? { custom: context } : undefined,
        tags: {
          location: 'client_side',
          component: context?.component || 'unknown'
        }
      })
    }).catch(() => {
      // Silently fail in development
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
  if (process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.NODE_ENV === 'production') {
    import('@sentry/nextjs').then((Sentry) => {
      Sentry.metrics.increment(metricName, value, tags)
    }).catch(() => {
      // Silently fail in development
    })
  }
}

// Set user context for error tracking
export const setUserContext = (userId: string, organizationId?: string) => {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.NODE_ENV === 'production') {
    import('@sentry/nextjs').then((Sentry) => {
      Sentry.setUser({
        id: userId,
        organization: organizationId,
      })
    }).catch(() => {
      // Silently fail in development
    })
  }
}

// Set organization context
export const setOrganizationContext = (orgId: string, orgName?: string) => {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.NODE_ENV === 'production') {
    import('@sentry/nextjs').then((Sentry) => {
      Sentry.setTag('organization', orgId)
      if (orgName) {
        Sentry.setTag('organization_name', orgName)
      }
    }).catch(() => {
      // Silently fail in development
    })
  }
}
