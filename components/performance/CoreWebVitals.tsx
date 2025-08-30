"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface WebVitalsData {
  lcp: number | null
  fid: number | null
  cls: number | null
  fcp: number | null
  ttfb: number | null
  score: number
}

interface CoreWebVitalsProps {
  showDetails?: boolean
  className?: string
}

export function CoreWebVitals({ showDetails = false, className }: CoreWebVitalsProps) {
  const [vitals, setVitals] = useState<WebVitalsData>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    score: 0
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return

    const measureWebVitals = () => {
      // LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        setVitals(prev => ({ ...prev, lcp: lastEntry.startTime }))
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // FID (First Input Delay)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          setVitals(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }))
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })

      // CLS (Cumulative Layout Shift)
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            setVitals(prev => ({ ...prev, cls: clsValue }))
          }
        })
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })

      // FCP (First Contentful Paint)
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          setVitals(prev => ({ ...prev, fcp: entry.startTime }))
        })
      })
      fcpObserver.observe({ entryTypes: ['paint'] })

      // TTFB (Time to First Byte)
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        setVitals(prev => ({ ...prev, ttfb: navigation.responseStart - navigation.requestStart }))
      }

      // Calculate overall score
      const calculateScore = () => {
        let score = 100
        
        // LCP scoring (good: <2.5s, needs improvement: 2.5-4s, poor: >4s)
        if (vitals.lcp !== null) {
          if (vitals.lcp > 4000) score -= 30
          else if (vitals.lcp > 2500) score -= 15
        }
        
        // FID scoring (good: <100ms, needs improvement: 100-300ms, poor: >300ms)
        if (vitals.fid !== null) {
          if (vitals.fid > 300) score -= 25
          else if (vitals.fid > 100) score -= 10
        }
        
        // CLS scoring (good: <0.1, needs improvement: 0.1-0.25, poor: >0.25)
        if (vitals.cls !== null) {
          if (vitals.cls > 0.25) score -= 25
          else if (vitals.cls > 0.1) score -= 10
        }
        
        setVitals(prev => ({ ...prev, score: Math.max(0, score) }))
      }

      // Calculate score after a delay to allow metrics to settle
      setTimeout(calculateScore, 2000)

      // Cleanup
      return () => {
        lcpObserver.disconnect()
        fidObserver.disconnect()
        clsObserver.disconnect()
        fcpObserver.disconnect()
      }
    }

    const cleanup = measureWebVitals()
    setIsVisible(true)

    return cleanup
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400"
    if (score >= 70) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-green-400/20 border-green-400/50"
    if (score >= 70) return "bg-yellow-400/20 border-yellow-400/50"
    return "bg-red-400/20 border-red-400/50"
  }

  const formatMetric = (value: number | null, unit: string = 'ms') => {
    if (value === null) return 'Measuring...'
    if (unit === 'ms') return `${Math.round(value)}ms`
    return `${value.toFixed(3)}`
  }

  if (!isVisible) return null

  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      <div className={cn(
        "bg-black/90 backdrop-blur-sm border rounded-lg p-4 min-w-[200px]",
        getScoreBg(vitals.score)
      )}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-mono font-bold text-white">Core Web Vitals</h3>
          <div className={cn("text-lg font-bold", getScoreColor(vitals.score))}>
            {vitals.score}/100
          </div>
        </div>
        
        {showDetails && (
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">LCP:</span>
              <span className="text-white">{formatMetric(vitals.lcp)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">FID:</span>
              <span className="text-white">{formatMetric(vitals.fid)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">CLS:</span>
              <span className="text-white">{formatMetric(vitals.cls, '')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">FCP:</span>
              <span className="text-white">{formatMetric(vitals.fcp)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">TTFB:</span>
              <span className="text-white">{formatMetric(vitals.ttfb)}</span>
            </div>
          </div>
        )}
        
        <div className="mt-2 text-xs text-gray-400">
          {vitals.score >= 90 && "Excellent performance"}
          {vitals.score >= 70 && vitals.score < 90 && "Good performance"}
          {vitals.score < 70 && "Needs optimization"}
        </div>
      </div>
    </div>
  )
}

// Hook for accessing web vitals data
export function useWebVitals() {
  const [vitals, setVitals] = useState<WebVitalsData>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    score: 0
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Listen for web vitals updates
    const handleVitalsUpdate = (event: CustomEvent) => {
      setVitals(event.detail)
    }

    window.addEventListener('web-vitals-update', handleVitalsUpdate as EventListener)
    
    return () => {
      window.removeEventListener('web-vitals-update', handleVitalsUpdate as EventListener)
    }
  }, [])

  return vitals
}
