"use client"

import { createContext, useContext, useEffect, type ReactNode } from "react"
import { trackEvent } from "@/lib/telemetry"

interface AnalyticsContextType {
  trackPageView: (path: string) => void
  trackCTAClick: (ctaName: string, location: string) => void
  trackDeepScroll: (percentage: number) => void
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null)

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error("useAnalytics must be used within AnalyticsProvider")
  }
  return context
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const trackPageView = (path: string) => {
    trackEvent("page_view", {
      page_path: path,
      timestamp: new Date().toISOString(),
    })
  }

  const trackCTAClick = (ctaName: string, location: string) => {
    trackEvent("cta_click", {
      cta_name: ctaName,
      location: location,
      timestamp: new Date().toISOString(),
    })
  }

  const trackDeepScroll = (percentage: number) => {
    trackEvent("deep_scroll", {
      scroll_percentage: percentage,
      timestamp: new Date().toISOString(),
    })
  }

  // Track page views on route changes
  useEffect(() => {
    trackPageView(window.location.pathname)

    // Track deep scroll events
    let maxScroll = 0
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100,
      )

      if (scrollPercent > maxScroll && scrollPercent >= 75) {
        maxScroll = scrollPercent
        trackDeepScroll(scrollPercent)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <AnalyticsContext.Provider value={{ trackPageView, trackCTAClick, trackDeepScroll }}>
      {children}
    </AnalyticsContext.Provider>
  )
}
