/**
 * Performance monitoring utilities for PromptForge
 * Web Vitals tracking and performance optimization helpers
 */

import * as React from 'react'

// Web Vitals types
export interface WebVitalsMetric {
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB'
  value: number
  delta: number
  id: string
  navigationType?: string
}

export interface PerformanceEntry {
  name: string
  startTime: number
  duration: number
  entryType: string
}

// Performance monitoring class
export class PerformanceMonitor {
  private metrics: Map<string, number> = new Map()
  private observers: PerformanceObserver[] = []
  private isInitialized = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.initialize()
    }
  }

  private initialize() {
    if (this.isInitialized) return
    this.isInitialized = true

    // Initialize Web Vitals observers
    this.observeWebVitals()
    
    // Initialize custom performance markers
    this.observeCustomMetrics()
  }

  private observeWebVitals() {
    // Observe Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1] as PerformanceEntry
          this.recordMetric('LCP', lastEntry.startTime)
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
        this.observers.push(lcpObserver)
      } catch (e) {
        console.warn('LCP observer not supported:', e)
      }

      // Observe First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            this.recordMetric('FID', entry.processingStart - entry.startTime)
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })
        this.observers.push(fidObserver)
      } catch (e) {
        console.warn('FID observer not supported:', e)
      }

      // Observe Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          })
          this.recordMetric('CLS', clsValue)
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
        this.observers.push(clsObserver)
      } catch (e) {
        console.warn('CLS observer not supported:', e)
      }
    }
  }

  private observeCustomMetrics() {
    // Observe navigation timing
    if ('PerformanceObserver' in window) {
      try {
        const navObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: PerformanceEntry) => {
            if (entry.entryType === 'navigation') {
              this.recordMetric('TTFB', entry.startTime)
            }
          })
        })
        navObserver.observe({ entryTypes: ['navigation'] })
        this.observers.push(navObserver)
      } catch (e) {
        console.warn('Navigation observer not supported:', e)
      }
    }
  }

  // Record a performance metric
  recordMetric(name: string, value: number) {
    this.metrics.set(name, value)
    
    // Send to analytics/monitoring service
    this.reportMetric(name, value)
  }

  // Get a recorded metric
  getMetric(name: string): number | undefined {
    return this.metrics.get(name)
  }

  // Get all metrics
  getAllMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics)
  }

  // Report metric to monitoring service
  private async reportMetric(name: string, value: number) {
    try {
      await fetch('/api/performance/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          value,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        })
      })
    } catch (error) {
      console.warn('Failed to report performance metric:', error)
    }
  }

  // Mark a performance milestone
  mark(milestone: string) {
    if ('performance' in window && 'mark' in performance) {
      performance.mark(milestone)
    }
  }

  // Measure performance between two marks
  measure(name: string, startMark: string, endMark?: string) {
    if ('performance' in window && 'measure' in performance) {
      try {
        const measure = performance.measure(name, startMark, endMark)
        this.recordMetric(name, measure.duration)
        return measure.duration
      } catch (error) {
        console.warn('Failed to measure performance:', error)
        return 0
      }
    }
    return 0
  }

  // Clean up observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()

// Performance optimization utilities
export class PerformanceOptimizer {
  // Debounce function calls
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  // Throttle function calls
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  // Lazy load images
  static lazyLoadImages() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.removeAttribute('data-src')
              imageObserver.unobserve(img)
            }
          }
        })
      })

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img)
      })
    }
  }

  // Preload critical resources
  static preloadResource(href: string, as: string, type?: string) {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    if (type) link.type = type
    document.head.appendChild(link)
  }

  // Prefetch resources
  static prefetchResource(href: string) {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    document.head.appendChild(link)
  }

  // Optimize scroll performance
  static optimizeScroll(callback: () => void) {
    let ticking = false
    
    const updateScroll = () => {
      callback()
      ticking = false
    }

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll)
        ticking = true
      }
    }

    return requestTick
  }

  // Batch DOM updates
  static batchDOMUpdates(updates: (() => void)[]) {
    requestAnimationFrame(() => {
      updates.forEach(update => update())
    })
  }
}

// React hook for performance monitoring
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = React.useState<Record<string, number>>({})

  React.useEffect(() => {
    const updateMetrics = () => {
      setMetrics(performanceMonitor.getAllMetrics())
    }

    // Update metrics every 5 seconds
    const interval = setInterval(updateMetrics, 5000)
    
    // Initial update
    updateMetrics()

    return () => clearInterval(interval)
  }, [])

  const recordMetric = React.useCallback((name: string, value: number) => {
    performanceMonitor.recordMetric(name, value)
    setMetrics(prev => ({ ...prev, [name]: value }))
  }, [])

  const mark = React.useCallback((milestone: string) => {
    performanceMonitor.mark(milestone)
  }, [])

  const measure = React.useCallback((name: string, startMark: string, endMark?: string) => {
    return performanceMonitor.measure(name, startMark, endMark)
  }, [])

  return {
    metrics,
    recordMetric,
    mark,
    measure,
  }
}

// Performance budget checker
export class PerformanceBudget {
  private budgets: Record<string, number> = {
    LCP: 2500, // 2.5s
    FID: 100,  // 100ms
    CLS: 0.1,  // 0.1
    FCP: 1800, // 1.8s
    TTFB: 600, // 600ms
  }

  checkBudget(metric: string, value: number): boolean {
    const budget = this.budgets[metric]
    return budget ? value <= budget : true
  }

  getBudget(metric: string): number | undefined {
    return this.budgets[metric]
  }

  setBudget(metric: string, value: number) {
    this.budgets[metric] = value
  }

  getAllBudgets(): Record<string, number> {
    return { ...this.budgets }
  }
}

export const performanceBudget = new PerformanceBudget()
