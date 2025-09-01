'use client'

import { useEffect } from 'react'
import { useTelemetry } from '@/hooks/use-telemetry'

export function PerformanceMonitor() {
  const { trackUserAction } = useTelemetry()

  useEffect(() => {
    // Monitor Core Web Vitals
    const measurePerformance = () => {
      // Largest Contentful Paint (LCP)
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        trackUserAction('performance_lcp', {
          value: lastEntry.startTime,
          element: lastEntry.element?.tagName || 'unknown'
        })
      }).observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay (FID)
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          trackUserAction('performance_fid', {
            value: entry.processingStart - entry.startTime,
            eventType: entry.name
          })
        })
      }).observe({ entryTypes: ['first-input'] })

      // Cumulative Layout Shift (CLS)
      let clsValue = 0
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        trackUserAction('performance_cls', { value: clsValue })
      }).observe({ entryTypes: ['layout-shift'] })

      // Interaction to Next Paint (INP)
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if ('processingEnd' in entry && 'startTime' in entry) {
            trackUserAction('performance_inp', {
              value: (entry as any).processingEnd - entry.startTime,
              eventType: entry.name
            })
          }
        })
      }).observe({ entryTypes: ['event'] })
    }

    // Only run in browser
    if (typeof window !== 'undefined') {
      measurePerformance()
    }
  }, [trackUserAction])

  return null
}
