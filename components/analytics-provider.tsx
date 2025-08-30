"use client"

import { createContext, useContext, useEffect, ReactNode, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { 
  STANDARD_EVENTS, 
  createViewPageEvent, 
  createCtaClickEvent,
  createPricingSelectEvent,
  createStartTrialEvent,
  createExportEvent,
  type _ViewPageEvent,
  type _CtaClickEvent,
  type _PricingSelectEvent,
  type _StartTrialEvent,
  type _ExportEvent
} from '@/lib/analytics-events'

interface AnalyticsContextType {
  trackEvent: (_eventName: string, _properties?: Record<string, any>) => void
  trackPageView: (_url: string, _title?: string) => void

  // Standard events as requested
  trackViewPage: (_pagePath: string, _pageTitle: string, _options?: { pageCategory?: string }) => void
  trackCtaClick: (_ctaType: string, _ctaText: string, _ctaPosition: string, _options?: { targetUrl?: string }) => void
  trackPricingSelect: (_planId: string, _planType: 'free' | 'pro' | 'enterprise', _billingCycle: 'monthly' | 'annual', _price: number) => void
  trackStartTrial: (_planId: string, _trialType: 'free' | 'pro_trial', _options?: { userId?: string, email?: string }) => void
  trackExport: (_exportType: 'pdf' | 'json' | 'txt' | 'md' | 'zip', _options?: { moduleId?: string, fileSize?: number, userId?: string }) => void
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider')
  }
  return context
}

interface AnalyticsProviderProps {
  children: ReactNode
}

// Inner component that uses navigation hooks
function AnalyticsProviderInner({ children }: AnalyticsProviderProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Check if Google Analytics is properly configured
  const isGAConfigured = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID && 
                         process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID !== 'G-XXXXXXXXXX'

  // Generate or retrieve session ID
  const getSessionId = () => {
    if (typeof window === 'undefined') return null
    
    let sessionId = sessionStorage.getItem('pf_session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('pf_session_id', sessionId)
    }
    return sessionId
  }

  const trackEvent = (_eventName: string, _properties: Record<string, any> = {}) => {
    // GA4 event tracking - only if properly configured
    if (isGAConfigured && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', _eventName, {
        ..._properties,
        event_category: 'user_interaction',
        event_label: _properties.event_label || _eventName,
        timestamp: Date.now()
      })
    }

    // Internal analytics API
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': getSessionId() || ''
      },
      body: JSON.stringify({
        event: _eventName,
        properties: _properties,
        timestamp: Date.now(),
        url: window.location.href
      })
    }).catch(console.error)

    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', _eventName, _properties)
    }
  }

  const trackPageView = (_url: string, _title?: string) => {
    // GA4 pageview tracking - only if properly configured
    if (isGAConfigured && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID, {
        page_title: _title || document.title,
        page_location: _url,
        send_page_view: true
      })
    }

    // Track pageview to internal API
    fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-session-id': getSessionId() || ''
      },
      body: JSON.stringify({
        url: _url,
        title: _title || document.title,
        timestamp: Date.now(),
        referrer: document.referrer
      })
    }).catch(console.error)
  }

  // Standard event tracking methods
  const trackViewPage = (pagePath: string, pageTitle: string, options?: { pageCategory?: string }) => {
    const sessionId = getSessionId()
    if (!sessionId) return

    const event = createViewPageEvent(pagePath, pageTitle, sessionId, {
      pageCategory: options?.pageCategory,
      referrer: typeof window !== 'undefined' ? document.referrer : undefined,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined
    })

    // Send to GTAG
    if (isGAConfigured && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', STANDARD_EVENTS.VIEW_PAGE, {
        page_path: event.properties.page_path,
        page_title: event.properties.page_title,
        page_category: event.properties.page_category,
        event_category: 'navigation'
      })
    }

    // Send to internal API
    trackEvent(STANDARD_EVENTS.VIEW_PAGE, event.properties)
  }

  const trackCtaClick = (ctaType: string, ctaText: string, ctaPosition: string, options?: { targetUrl?: string }) => {
    const sessionId = getSessionId()
    if (!sessionId) return

    const event = createCtaClickEvent(ctaType, ctaText, ctaPosition, sessionId, {
      targetUrl: options?.targetUrl,
      pagePath: typeof window !== 'undefined' ? window.location.pathname : ''
    })

    // Send to GTAG
    if (isGAConfigured && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', STANDARD_EVENTS.CTA_CLICK, {
        cta_type: event.properties.cta_type,
        cta_text: event.properties.cta_text,
        cta_position: event.properties.cta_position,
        target_url: event.properties.target_url,
        event_category: 'engagement'
      })
    }

    // Send to internal API
    trackEvent(STANDARD_EVENTS.CTA_CLICK, event.properties)
  }

  const trackPricingSelect = (planId: string, planType: 'free' | 'pro' | 'enterprise', billingCycle: 'monthly' | 'annual', price: number) => {
    const sessionId = getSessionId()
    if (!sessionId) return

    const event = createPricingSelectEvent(planId, planType, billingCycle, price, sessionId, {
      pagePath: typeof window !== 'undefined' ? window.location.pathname : ''
    })

    // Send to GTAG
    if (isGAConfigured && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', STANDARD_EVENTS.PRICING_SELECT, {
        plan_id: event.properties.plan_id,
        plan_type: event.properties.plan_type,
        billing_cycle: event.properties.billing_cycle,
        value: event.properties.price,
        currency: event.properties.currency,
        event_category: 'conversion'
      })
    }

    // Send to internal API
    trackEvent(STANDARD_EVENTS.PRICING_SELECT, event.properties)
  }

  const trackStartTrial = (planId: string, trialType: 'free' | 'pro_trial', options?: { userId?: string, email?: string }) => {
    const sessionId = getSessionId()
    if (!sessionId) return

    const event = createStartTrialEvent(planId, trialType, sessionId, {
      userId: options?.userId,
      email: options?.email,
      pagePath: typeof window !== 'undefined' ? window.location.pathname : ''
    })

    // Send to GTAG
    if (isGAConfigured && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', STANDARD_EVENTS.START_TRIAL, {
        plan_id: event.properties.plan_id,
        trial_type: event.properties.trial_type,
        user_id: event.properties.user_id,
        event_category: 'conversion'
      })
    }

    // Send to internal API
    trackEvent(STANDARD_EVENTS.START_TRIAL, event.properties)
  }

  const trackExport = (exportType: 'pdf' | 'json' | 'txt' | 'md' | 'zip', options?: { moduleId?: string, fileSize?: number, userId?: string }) => {
    const sessionId = getSessionId()
    if (!sessionId) return

    const event = createExportEvent(exportType, sessionId, {
      moduleId: options?.moduleId,
      fileSize: options?.fileSize,
      userId: options?.userId,
      pagePath: typeof window !== 'undefined' ? window.location.pathname : ''
    })

    // Send to GTAG
    if (isGAConfigured && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', STANDARD_EVENTS.EXPORT, {
        export_type: event.properties.export_type,
        module_id: event.properties.module_id,
        file_size: event.properties.file_size,
        user_id: event.properties.user_id,
        event_category: 'feature_usage'
      })
    }

    // Send to internal API
    trackEvent(STANDARD_EVENTS.EXPORT, event.properties)
  }

  // Track page views on route changes
  useEffect(() => {
    const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    trackPageView(url)
  }, [pathname, searchParams])

  const contextValue: AnalyticsContextType = {
    trackEvent,
    trackPageView,
    trackViewPage,
    trackCtaClick,
    trackPricingSelect,
    trackStartTrial,
    trackExport
  }

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  )
}

// Main provider with Suspense boundary
export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  return (
    <Suspense fallback={null}>
      <AnalyticsProviderInner>
        {children}
      </AnalyticsProviderInner>
    </Suspense>
  )
}
