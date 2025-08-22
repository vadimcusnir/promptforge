export interface TelemetryEvent {
  id: string
  timestamp: Date
  sessionId: string
  userId?: string
  event: string
  category: "user" | "system" | "performance" | "error" | "business"
  data: Record<string, any>
  metadata: {
    userAgent?: string
    viewport?: { width: number; height: number }
    location?: string
    tier: string
    version: string
  }
}

export interface PerformanceMetrics {
  pageLoadTime: number
  promptGenerationTime: number
  gptOptimizationTime: number
  testExecutionTime: number
  exportTime: number
  memoryUsage: number
  cpuUsage: number
}

export interface UserBehaviorMetrics {
  sessionDuration: number
  promptsGenerated: number
  optimizationsUsed: number
  testsExecuted: number
  exportsCreated: number
  modulesUsed: string[]
  vectorsUsed: string[]
  featuresUsed: string[]
  clickHeatmap: Array<{ x: number; y: number; count: number }>
}

export interface SystemHealthMetrics {
  uptime: number
  errorRate: number
  responseTime: number
  throughput: number
  activeUsers: number
  systemLoad: number
  memoryUtilization: number
  storageUtilization: number
}

export interface BusinessMetrics {
  conversionRate: number
  retentionRate: number
  churnRate: number
  averageSessionValue: number
  premiumUpgrades: number
  featureAdoption: Record<string, number>
  revenueMetrics: {
    mrr: number
    arr: number
    ltv: number
    cac: number
  }
}

export interface GlitchProtocolMetrics {
  count: number // Number of glitch elements per page
  run_times: number[] // Animation durations in ms
  hover_replays: number // Number of hover-triggered replays
  disabled_by_reduced_motion: boolean // Whether disabled by accessibility
  page_url: string // Current page URL
  h1_h2_count: number // Number of H1/H2 elements with glitch
  performance: {
    cpu_usage_percent: number // Estimated CPU usage
    frame_time_p95: number // 95th percentile frame time
    cls_prevented: boolean // Whether CLS prevention is active
  }
}

export class TelemetryEngine {
  private static instance: TelemetryEngine
  private events: TelemetryEvent[] = []
  private sessionId: string
  private startTime: Date
  private performanceObserver?: PerformanceObserver
  private isEnabled = true

  private constructor() {
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    this.startTime = new Date()
    this.initializePerformanceMonitoring()
    this.initializeUserBehaviorTracking()
  }

  static getInstance(): TelemetryEngine {
    if (!TelemetryEngine.instance) {
      TelemetryEngine.instance = new TelemetryEngine()
    }
    return TelemetryEngine.instance
  }

  private initializePerformanceMonitoring(): void {
    if (typeof window === "undefined") return

    // Monitor performance entries
    if ("PerformanceObserver" in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.trackEvent("performance_entry", "performance", {
            name: entry.name,
            duration: entry.duration,
            startTime: entry.startTime,
            entryType: entry.entryType,
          })
        }
      })

      this.performanceObserver.observe({ entryTypes: ["measure", "navigation", "resource"] })
    }

    // Monitor memory usage
    if ("memory" in performance) {
      setInterval(() => {
        const memory = (performance as any).memory
        this.trackEvent("memory_usage", "performance", {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        })
      }, 30000) // Every 30 seconds
    }
  }

  private initializeUserBehaviorTracking(): void {
    if (typeof window === "undefined") return

    // Track page visibility changes
    document.addEventListener("visibilitychange", () => {
      this.trackEvent("visibility_change", "user", {
        hidden: document.hidden,
        visibilityState: document.visibilityState,
      })
    })

    // Track clicks for heatmap
    document.addEventListener("click", (event) => {
      this.trackEvent("click", "user", {
        x: event.clientX,
        y: event.clientY,
        target: event.target instanceof Element ? event.target.tagName : "unknown",
        timestamp: Date.now(),
      })
    })

    // Track scroll behavior
    let scrollTimeout: NodeJS.Timeout
    window.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        this.trackEvent("scroll", "user", {
          scrollY: window.scrollY,
          scrollX: window.scrollX,
          documentHeight: document.documentElement.scrollHeight,
          viewportHeight: window.innerHeight,
        })
      }, 250)
    })
  }

  trackEvent(event: string, category: TelemetryEvent["category"], data: Record<string, any> = {}): void {
    if (!this.isEnabled) return

    const telemetryEvent: TelemetryEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date(),
      sessionId: this.sessionId,
      event,
      category,
      data,
      metadata: {
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        viewport: typeof window !== "undefined" ? { width: window.innerWidth, height: window.innerHeight } : undefined,
        location: typeof window !== "undefined" ? window.location.pathname : undefined,
        tier: "free", // This would be dynamically set
        version: "3.0.0",
      },
    }

    this.events.push(telemetryEvent)

    // Keep only last 1000 events in memory
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000)
    }

    // Send to analytics service (in production)
    this.sendToAnalyticsService(telemetryEvent)
  }

  private async sendToAnalyticsService(event: TelemetryEvent): Promise<void> {
    try {
      // In production, this would send to your analytics service
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // })

      console.log("[Telemetry]", event.event, event.data)
    } catch (error) {
      console.error("Failed to send telemetry event:", error)
    }
  }

  getPerformanceMetrics(): PerformanceMetrics {
    const performanceEvents = this.events.filter((e) => e.category === "performance")

    return {
      pageLoadTime: this.calculateAverageMetric(performanceEvents, "navigation", "duration"),
      promptGenerationTime: this.calculateAverageMetric(performanceEvents, "prompt_generation", "duration"),
      gptOptimizationTime: this.calculateAverageMetric(performanceEvents, "gpt_optimization", "duration"),
      testExecutionTime: this.calculateAverageMetric(performanceEvents, "test_execution", "duration"),
      exportTime: this.calculateAverageMetric(performanceEvents, "export", "duration"),
      memoryUsage: this.getLatestMetric(performanceEvents, "memory_usage", "usedJSHeapSize") || 0,
      cpuUsage: 0, // Would be calculated from performance entries
    }
  }

  getUserBehaviorMetrics(): UserBehaviorMetrics {
    const userEvents = this.events.filter((e) => e.category === "user")
    const businessEvents = this.events.filter((e) => e.category === "business")

    const clickEvents = userEvents.filter((e) => e.event === "click")
    const clickHeatmap = this.generateClickHeatmap(clickEvents)

    return {
      sessionDuration: Date.now() - this.startTime.getTime(),
      promptsGenerated: businessEvents.filter((e) => e.event === "prompt_generated").length,
      optimizationsUsed: businessEvents.filter((e) => e.event === "gpt_optimization").length,
      testsExecuted: businessEvents.filter((e) => e.event === "test_executed").length,
      exportsCreated: businessEvents.filter((e) => e.event === "export_created").length,
      modulesUsed: [...new Set(businessEvents.map((e) => e.data.moduleId).filter(Boolean))],
      vectorsUsed: [...new Set(businessEvents.map((e) => e.data.vector).filter(Boolean))],
      featuresUsed: [...new Set(businessEvents.map((e) => e.event))],
      clickHeatmap,
    }
  }

  getSystemHealthMetrics(): SystemHealthMetrics {
    const errorEvents = this.events.filter((e) => e.category === "error")
    const performanceEvents = this.events.filter((e) => e.category === "performance")

    return {
      uptime: Date.now() - this.startTime.getTime(),
      errorRate: (errorEvents.length / Math.max(this.events.length, 1)) * 100,
      responseTime: this.calculateAverageMetric(performanceEvents, "api_call", "duration"),
      throughput: this.events.length / ((Date.now() - this.startTime.getTime()) / 1000 / 60), // events per minute
      activeUsers: 1, // Would be calculated from server-side data
      systemLoad: 0, // Would be calculated from server metrics
      memoryUtilization: this.getLatestMetric(performanceEvents, "memory_usage", "usedJSHeapSize") || 0,
      storageUtilization: 0, // Would be calculated from storage metrics
    }
  }

  getBusinessMetrics(): BusinessMetrics {
    const businessEvents = this.events.filter((e) => e.category === "business")

    return {
      conversionRate: 0, // Would be calculated from conversion events
      retentionRate: 0, // Would be calculated from user return data
      churnRate: 0, // Would be calculated from user activity data
      averageSessionValue: 0, // Would be calculated from revenue events
      premiumUpgrades: businessEvents.filter((e) => e.event === "tier_upgrade").length,
      featureAdoption: this.calculateFeatureAdoption(businessEvents),
      revenueMetrics: {
        mrr: 0, // Monthly Recurring Revenue
        arr: 0, // Annual Recurring Revenue
        ltv: 0, // Lifetime Value
        cac: 0, // Customer Acquisition Cost
      },
    }
  }

  private calculateAverageMetric(events: TelemetryEvent[], eventName: string, metricKey: string): number {
    const relevantEvents = events.filter((e) => e.event === eventName && e.data[metricKey] !== undefined)
    if (relevantEvents.length === 0) return 0

    const sum = relevantEvents.reduce((acc, event) => acc + (event.data[metricKey] || 0), 0)
    return sum / relevantEvents.length
  }

  private getLatestMetric(events: TelemetryEvent[], eventName: string, metricKey: string): number | null {
    const relevantEvents = events
      .filter((e) => e.event === eventName && e.data[metricKey] !== undefined)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    return relevantEvents.length > 0 ? relevantEvents[0].data[metricKey] : null
  }

  private generateClickHeatmap(clickEvents: TelemetryEvent[]): Array<{ x: number; y: number; count: number }> {
    const heatmapData = new Map<string, number>()

    clickEvents.forEach((event) => {
      const x = Math.floor((event.data.x || 0) / 50) * 50 // Group into 50px buckets
      const y = Math.floor((event.data.y || 0) / 50) * 50
      const key = `${x},${y}`
      heatmapData.set(key, (heatmapData.get(key) || 0) + 1)
    })

    return Array.from(heatmapData.entries()).map(([key, count]) => {
      const [x, y] = key.split(",").map(Number)
      return { x, y, count }
    })
  }

  private calculateFeatureAdoption(businessEvents: TelemetryEvent[]): Record<string, number> {
    const featureUsage = new Map<string, number>()

    businessEvents.forEach((event) => {
      featureUsage.set(event.event, (featureUsage.get(event.event) || 0) + 1)
    })

    return Object.fromEntries(featureUsage)
  }

  // Public methods for tracking specific events
  trackPromptGeneration(moduleId: number, vector: string, duration: number): void {
    this.trackEvent("prompt_generated", "business", { moduleId, vector, duration })
  }

  trackGPTOptimization(duration: number, confidence: number): void {
    this.trackEvent("gpt_optimization", "business", { duration, confidence })
  }

  trackTestExecution(testMode: string, duration: number, score: number): void {
    this.trackEvent("test_executed", "business", { testMode, duration, score })
  }

  trackExport(format: string, size: number, duration: number): void {
    this.trackEvent("export_created", "business", { format, size, duration })
  }

  trackError(error: Error, context?: string): void {
    this.trackEvent("error", "error", {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now(),
    })
  }

  trackFeatureUsage(feature: string, metadata?: Record<string, any>): void {
    this.trackEvent("feature_used", "user", { feature, ...metadata })
  }

  trackTierUpgrade(fromTier: string, toTier: string): void {
    this.trackEvent("tier_upgrade", "business", { fromTier, toTier })
  }

  trackGlitchProtocol(metrics: GlitchProtocolMetrics): void {
    this.trackEvent("glitch_protocol", "performance", {
      glitch_count: metrics.count,
      run_times_p95: metrics.run_times.length > 0 ? 
        metrics.run_times.sort((a, b) => a - b)[Math.floor(metrics.run_times.length * 0.95)] : 0,
      hover_replays: metrics.hover_replays,
      disabled_by_reduced_motion: metrics.disabled_by_reduced_motion,
      page_url: metrics.page_url,
      h1_h2_count: metrics.h1_h2_count,
      cpu_usage_percent: metrics.performance.cpu_usage_percent,
      frame_time_p95: metrics.performance.frame_time_p95,
      cls_prevented: metrics.performance.cls_prevented,
      protocol_version: "1.0.0",
      compliant: metrics.count <= 6 && 
                 metrics.run_times.every(t => t >= 280 && t <= 420) &&
                 metrics.performance.cpu_usage_percent <= 1 &&
                 metrics.performance.frame_time_p95 <= 16
    })
  }

  // Analytics export
  exportAnalytics(): {
    events: TelemetryEvent[]
    performance: PerformanceMetrics
    userBehavior: UserBehaviorMetrics
    systemHealth: SystemHealthMetrics
    business: BusinessMetrics
  } {
    return {
      events: this.events,
      performance: this.getPerformanceMetrics(),
      userBehavior: this.getUserBehaviorMetrics(),
      systemHealth: this.getSystemHealthMetrics(),
      business: this.getBusinessMetrics(),
    }
  }

  // Privacy controls
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
  }

  clearData(): void {
    this.events = []
  }

  getSessionId(): string {
    return this.sessionId
  }
}

// Global telemetry instance
export const telemetry = TelemetryEngine.getInstance()
