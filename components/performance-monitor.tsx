"use client"

import { useEffect, useState } from 'react'

interface PerformanceMetrics {
  lcp: number | null
  fid: number | null
  cls: number | null
  ttfb: number | null
  fcp: number | null
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    fcp: null
  })

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return

    // Check if PerformanceObserver is supported
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported')
      return
    }

    // Track Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as PerformanceEntry
      if (lastEntry) {
        setMetrics(prev => ({
          ...prev,
          lcp: Math.round(lastEntry.startTime)
        }))
        
        // Log LCP for debugging
        console.log('LCP:', Math.round(lastEntry.startTime), 'ms')
      }
    })

    // Track First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as any
      if (lastEntry && typeof lastEntry.processingStart === 'number') {
        setMetrics(prev => ({
          ...prev,
          fid: Math.round(lastEntry.processingStart - lastEntry.startTime)
        }))
      }
    })

    // Track Cumulative Layout Shift (CLS)
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
        }
      }
      setMetrics(prev => ({
        ...prev,
        cls: Math.round(clsValue * 1000) / 1000
      }))
    })

    // Track Time to First Byte (TTFB)
    const navigationObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const navigationEntry = entries[0] as PerformanceNavigationTiming
      if (navigationEntry) {
        setMetrics(prev => ({
          ...prev,
          ttfb: Math.round(navigationEntry.responseStart - navigationEntry.requestStart)
        }))
      }
    })

    // Track First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as PerformanceEntry
      if (lastEntry) {
        setMetrics(prev => ({
          ...prev,
          fcp: Math.round(lastEntry.startTime)
        }))
      }
    })

    try {
      // Observe different performance metrics
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      fidObserver.observe({ entryTypes: ['first-input'] })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
      navigationObserver.observe({ entryTypes: ['navigation'] })
      fcpObserver.observe({ entryTypes: ['first-contentful-paint'] })
    } catch (error) {
      console.warn('Performance observation failed:', error)
    }

    // Cleanup observers
    return () => {
      lcpObserver.disconnect()
      fidObserver.disconnect()
      clsObserver.disconnect()
      navigationObserver.disconnect()
      fcpObserver.disconnect()
    }
  }, [])

  // Only show in development or when explicitly enabled
  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SHOW_PERFORMANCE) {
    return null
  }

  const getLCPStatus = (lcp: number | null) => {
    if (!lcp) return 'pending'
    if (lcp <= 2500) return 'good'
    if (lcp <= 4000) return 'needs-improvement'
    return 'poor'
  }

  const getCLSStatus = (cls: number | null) => {
    if (!cls) return 'pending'
    if (cls <= 0.1) return 'good'
    if (cls <= 0.25) return 'needs-improvement'
    return 'poor'
  }

  const getFIDStatus = (fid: number | null) => {
    if (!fid) return 'pending'
    if (fid <= 100) return 'good'
    if (fid <= 300) return 'needs-improvement'
    return 'poor'
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 backdrop-blur-sm border border-gray-700 rounded-lg p-4 text-white text-xs font-mono z-50 max-w-xs">
      <div className="font-semibold mb-2 text-yellow-400">Performance Monitor</div>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>LCP:</span>
          <span className={`
            ${getLCPStatus(metrics.lcp) === 'good' ? 'text-green-400' : ''}
            ${getLCPStatus(metrics.lcp) === 'needs-improvement' ? 'text-yellow-400' : ''}
            ${getLCPStatus(metrics.lcp) === 'poor' ? 'text-red-400' : ''}
            ${getLCPStatus(metrics.lcp) === 'pending' ? 'text-gray-400' : ''}
          `}>
            {metrics.lcp ? `${metrics.lcp}ms` : 'pending'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>FCP:</span>
          <span className="text-gray-300">
            {metrics.fcp ? `${metrics.fcp}ms` : 'pending'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>CLS:</span>
          <span className={`
            ${getCLSStatus(metrics.cls) === 'good' ? 'text-green-400' : ''}
            ${getCLSStatus(metrics.cls) === 'needs-improvement' ? 'text-yellow-400' : ''}
            ${getCLSStatus(metrics.cls) === 'poor' ? 'text-red-400' : ''}
            ${getCLSStatus(metrics.cls) === 'pending' ? 'text-gray-400' : ''}
          `}>
            {metrics.cls ? metrics.cls.toFixed(3) : 'pending'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>FID:</span>
          <span className={`
            ${getFIDStatus(metrics.fid) === 'good' ? 'text-green-400' : ''}
            ${getFIDStatus(metrics.fid) === 'needs-improvement' ? 'text-yellow-400' : ''}
            ${getFIDStatus(metrics.fid) === 'poor' ? 'text-red-400' : ''}
            ${getFIDStatus(metrics.fid) === 'pending' ? 'text-gray-400' : ''}
          `}>
            {metrics.fid ? `${metrics.fid}ms` : 'pending'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>TTFB:</span>
          <span className="text-gray-300">
            {metrics.ttfb ? `${metrics.ttfb}ms` : 'pending'}
          </span>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-600 text-xs text-gray-400">
        <div>Targets: LCP ≤2.5s, CLS ≤0.1, FID ≤100ms</div>
        <div>Mobile: LCP ≤3.0s</div>
      </div>
    </div>
  )
}
