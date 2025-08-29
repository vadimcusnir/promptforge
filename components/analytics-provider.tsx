"use client"

import { createContext, useContext, useEffect, ReactNode, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

interface AnalyticsContextType {
  trackEvent: (eventName: string, properties?: Record<string, any>) => void
  trackPageView: (url: string, title?: string) => void
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

  const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
    // GA4 event tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, {
        ...properties,
        event_category: 'user_interaction',
        event_label: properties.event_label || eventName,
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
        event: eventName,
        properties,
        timestamp: Date.now(),
        url: window.location.href
      })
    }).catch(console.error)

    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', eventName, properties)
    }
  }

  const trackPageView = (url: string, title?: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID, {
        page_title: title || document.title,
        page_location: url,
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
        url,
        title: title || document.title,
        timestamp: Date.now(),
        referrer: document.referrer
      })
    }).catch(console.error)
  }

  // Track page views on route changes
  useEffect(() => {
    const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    trackPageView(url)
  }, [pathname, searchParams])

  const contextValue: AnalyticsContextType = {
    trackEvent,
    trackPageView
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
