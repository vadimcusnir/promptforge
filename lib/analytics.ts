// GA4 Analytics Tracking System
declare global {
  interface Window {
    gtag?: (
      command: 'consent' | 'config' | 'event' | 'js' | 'set',
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[]
  }
}

// GA4 Event Types
export type GA4EventType = 
  | 'PF_LANDING_CTA_CLICK'
  | 'PF_PRICING_VIEW'
  | 'PF_CHECKOUT_STARTED'
  | 'PF_CHECKOUT_COMPLETED'
  | 'PF_GATE_HIT'
  | 'PF_FEATURE_USAGE'
  | 'PF_ERROR_OCCURRED'
  | 'PF_PERFORMANCE_METRIC'
  | 'PF_ALERT_CREATED'

// GA4 Event Interface
export interface GA4Event {
  event: GA4EventType
  parameters?: Record<string, any>
  timestamp?: number
}

// Initialize GA4
export const initGA4 = () => {
  if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    return
  }

  // Load GA4 script if not already loaded
  if (!window.gtag) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    window.gtag = function() {
      window.dataLayer.push(arguments)
    }

    window.gtag?.('js', new Date().toISOString())
    window.gtag?.('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
      page_title: document.title,
      page_location: window.location.href,
    })
  }
}

// Track GA4 event
export const trackGA4Event = (event: GA4Event) => {
  if (typeof window === 'undefined' || !window.gtag) {
    console.warn('GA4 not initialized or not available')
    return
  }

  try {
    const { event: eventName, parameters = {}, timestamp } = event
    
    // Add timestamp if not provided
    const eventParams = {
      ...parameters,
      timestamp: timestamp || Date.now(),
      event_time: new Date().toISOString(),
    }

    // Send to GA4
    window.gtag('event', eventName, eventParams)
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 GA4 Event:', eventName, eventParams)
    }
  } catch (error) {
    console.error('Failed to track GA4 event:', error)
  }
}

// Convenience functions for specific events
export const trackLandingCTAClick = (ctaType: string, location: string) => {
  trackGA4Event({
    event: 'PF_LANDING_CTA_CLICK',
    parameters: {
      cta_type: ctaType,
      location,
      page_path: window.location.pathname,
    }
  })
}

export const trackPricingView = (planViewed?: string) => {
  trackGA4Event({
    event: 'PF_PRICING_VIEW',
    parameters: {
      plan_viewed: planViewed || 'all',
      page_path: window.location.pathname,
    }
  })
}

export const trackCheckoutStarted = (planId: string, amount: number) => {
  trackGA4Event({
    event: 'PF_CHECKOUT_STARTED',
    parameters: {
      plan_id: planId,
      amount,
      currency: 'USD',
      page_path: window.location.pathname,
    }
  })
}

export const trackCheckoutCompleted = (planId: string, amount: number, transactionId: string) => {
  trackGA4Event({
    event: 'PF_CHECKOUT_COMPLETED',
    parameters: {
      plan_id: planId,
      amount,
      currency: 'USD',
      transaction_id: transactionId,
      page_path: window.location.pathname,
    }
  })
}

export const trackGateHit = (gateType: string, userId?: string, organizationId?: string) => {
  trackGA4Event({
    event: 'PF_GATE_HIT',
    parameters: {
      gate_type: gateType,
      user_id: userId ? hashUserId(userId) : undefined,
      organization_id: organizationId,
      page_path: window.location.pathname,
    }
  })
}

export const trackFeatureUsage = (feature: string, userId?: string) => {
  trackGA4Event({
    event: 'PF_FEATURE_USAGE',
    parameters: {
      feature_name: feature,
      user_id: userId ? hashUserId(userId) : undefined,
      page_path: window.location.pathname,
    }
  })
}

export const trackError = (errorType: string, errorMessage: string, userId?: string) => {
  trackGA4Event({
    event: 'PF_ERROR_OCCURRED',
    parameters: {
      error_type: errorType,
      error_message: errorMessage,
      user_id: userId ? hashUserId(userId) : undefined,
      page_path: window.location.pathname,
    }
  })
}

export const trackPerformanceMetric = (metricName: string, value: number, unit?: string) => {
  trackGA4Event({
    event: 'PF_PERFORMANCE_METRIC',
    parameters: {
      metric_name: metricName,
      metric_value: value,
      metric_unit: unit,
      page_path: window.location.pathname,
    }
  })
}

// Hash user ID for privacy (no PII exposure)
function hashUserId(userId: string): string {
  // Simple hash function - in production, use crypto-js or similar
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

// Track page views
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return

  try {
    window.gtag?.('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
      page_path: pagePath,
      page_title: pageTitle || document.title,
    })
  } catch (error) {
    console.error('Failed to track page view:', error)
  }
}

// Enhanced ecommerce tracking
export const trackEcommerceEvent = (eventName: string, ecommerce: any) => {
  if (typeof window === 'undefined' || !window.gtag) return

  try {
    window.gtag('event', eventName, {
      ecommerce,
      page_path: window.location.pathname,
    })
  } catch (error) {
    console.error('Failed to track ecommerce event:', error)
  }
}
