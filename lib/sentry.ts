import * as Sentry from '@sentry/nextjs'

// Initialize Sentry
export function initSentry() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      
      // Performance monitoring
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Session replay
      replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      replaysOnErrorSampleRate: 1.0,
      
      // Environment
      environment: process.env.NODE_ENV || 'development',
      
      // Release tracking
      release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      
      // Debug mode in development
      debug: process.env.NODE_ENV === 'development',
      
      // Before send hook to filter sensitive data
      beforeSend(event) {
        // Remove sensitive headers
        if (event.request?.headers) {
          delete event.request.headers.authorization
          delete event.request.headers.cookie
          delete event.request.headers['x-api-key']
        }
        
        // Remove sensitive user data
        if (event.user) {
          delete event.user.email
          delete event.user.ip_address
        }
        
        return event
      },
      
      // Integrations
      integrations: [
        // Browser integrations
        new Sentry.BrowserTracing({
          // Set sampling rate for performance monitoring
          // Note: tracesSampleRate is deprecated in newer versions
        }),
        
        // Session replay
        new Sentry.Replay({
          // Set sampling rate for session replay
          sessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
          errorSampleRate: 1.0,
        }),
      ],
    })
  }
}

// Capture and report errors
export function captureException(error: Error, context?: Record<string, any>) {
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

// Capture and report messages
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info', context?: Record<string, any>) {
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

// Set user context
export function setUser(user: { id: string; email?: string; plan?: string }) {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.plan || 'free'
    })
  }
}

// Set tag for tracking
export function setTag(key: string, value: string) {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.setTag(key, value)
  }
}

// Set context for additional data
export function setContext(name: string, context: Record<string, any>) {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.setContext(name, context)
  }
}
