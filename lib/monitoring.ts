// Comprehensive monitoring and error tracking system
export interface BusinessMetrics {
  conversion_rate: number
  average_order_value: number
  churn_rate: number
  monthly_recurring_revenue: number
  customer_lifetime_value: number
}

export interface PerformanceMetrics {
  page_load_time: number
  api_response_time: number
  checkout_completion_time: number
  error_rate: number
}

export interface UserBehaviorMetrics {
  plan_views: Record<string, number>
  plan_clicks: Record<string, number>
  checkout_starts: Record<string, number>
  checkout_completions: Record<string, number>
  feature_usage: Record<string, number>
}

class MonitoringService {
  private static instance: MonitoringService
  private metrics: BusinessMetrics
  private performanceMetrics: PerformanceMetrics
  private userBehaviorMetrics: UserBehaviorMetrics
  private errorCount: number = 0
  private isInitialized: boolean = false

  private constructor() {
    this.metrics = {
      conversion_rate: 0,
      average_order_value: 0,
      churn_rate: 0,
      monthly_recurring_revenue: 0,
      customer_lifetime_value: 0,
    }

    this.performanceMetrics = {
      page_load_time: 0,
      api_response_time: 0,
      checkout_completion_time: 0,
      error_rate: 0,
    }

    this.userBehaviorMetrics = {
      plan_views: {},
      plan_clicks: {},
      checkout_starts: {},
      checkout_completions: {},
      feature_usage: {},
    }
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService()
    }
    return MonitoringService.instance
  }

  // Initialize monitoring service
  public async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Initialize Sentry if available
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        console.log('Sentry monitoring initialized')
      }

      // Initialize performance monitoring
      this.initializePerformanceMonitoring()
      
      // Initialize business metrics tracking
      this.initializeBusinessMetrics()

      this.isInitialized = true
      console.log('Monitoring service initialized successfully')
    } catch (error) {
      console.error('Failed to initialize monitoring service:', error)
    }
  }

  // Performance monitoring
  private initializePerformanceMonitoring(): void {
    if (typeof window === 'undefined') return

    // Page load time
    window.addEventListener('load', () => {
      const loadTime = performance.now()
      this.performanceMetrics.page_load_time = loadTime
      this.trackMetric('page_load_time', loadTime)
    })

    // API response time monitoring
    this.interceptFetchRequests()
  }

  // Intercept fetch requests to monitor API performance
  private interceptFetchRequests(): void {
    if (typeof window === 'undefined') return

    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const startTime = performance.now()
      
      try {
        const response = await originalFetch(...args)
        const endTime = performance.now()
        const responseTime = endTime - startTime
        
        this.performanceMetrics.api_response_time = responseTime
        this.trackMetric('api_response_time', responseTime)
        
        return response
      } catch (error) {
        this.trackError('fetch_error', error)
        throw error
      }
    }
  }

  // Business metrics tracking
  private initializeBusinessMetrics(): void {
    // Load historical data from localStorage or API
    this.loadHistoricalMetrics()
    
    // Set up periodic metrics calculation
    setInterval(() => {
      this.calculateBusinessMetrics()
    }, 60000) // Every minute
  }

  // Track business events
  public trackBusinessEvent(event: string, data: any): void {
    try {
      switch (event) {
        case 'plan_view':
          this.userBehaviorMetrics.plan_views[data.planId] = 
            (this.userBehaviorMetrics.plan_views[data.planId] || 0) + 1
          break
          
        case 'plan_click':
          this.userBehaviorMetrics.plan_clicks[data.planId] = 
            (this.userBehaviorMetrics.plan_clicks[data.planId] || 0) + 1
          break
          
        case 'checkout_start':
          this.userBehaviorMetrics.checkout_starts[data.planId] = 
            (this.userBehaviorMetrics.checkout_starts[data.planId] || 0) + 1
          break
          
        case 'checkout_complete':
          this.userBehaviorMetrics.checkout_completions[data.planId] = 
            (this.userBehaviorMetrics.checkout_completions[data.planId] || 0) + 1
          this.trackRevenue(data.amount, data.planId)
          break
          
        case 'feature_usage':
          this.userBehaviorMetrics.feature_usage[data.feature] = 
            (this.userBehaviorMetrics.feature_usage[data.feature] || 0) + 1
          break
      }

      // Send to analytics service
      this.sendToAnalytics(event, data)
      
    } catch (error) {
      this.trackError('business_event_tracking_error', error)
    }
  }

  // Track revenue for business metrics
  private trackRevenue(amount: number, planId: string): void {
    // Update MRR calculation
    const planMonthlyValue = this.getPlanMonthlyValue(planId)
    this.metrics.monthly_recurring_revenue += planMonthlyValue
    
    // Update AOV
    this.updateAverageOrderValue(amount)
    
    // Update conversion rate
    this.updateConversionRate()
  }

  // Calculate business metrics
  private calculateBusinessMetrics(): void {
    try {
      // Calculate conversion rate
      this.metrics.conversion_rate = this.calculateConversionRate()
      
      // Calculate churn rate (simplified)
      this.metrics.churn_rate = this.calculateChurnRate()
      
      // Calculate CLV
      this.metrics.customer_lifetime_value = this.calculateCustomerLifetimeValue()
      
      // Update error rate
      this.performanceMetrics.error_rate = this.errorCount / 1000 // Per 1000 requests
      
      // Save metrics
      this.saveMetrics()
      
    } catch (error) {
      this.trackError('metrics_calculation_error', error)
    }
  }

  // Calculate conversion rate
  private calculateConversionRate(): number {
    let totalViews = 0
    let totalConversions = 0
    
    Object.keys(this.userBehaviorMetrics.plan_views).forEach(planId => {
      totalViews += this.userBehaviorMetrics.plan_views[planId]
      totalConversions += this.userBehaviorMetrics.checkout_completions[planId] || 0
    })
    
    return totalViews > 0 ? (totalConversions / totalViews) * 100 : 0
  }

  // Calculate churn rate (simplified)
  private calculateChurnRate(): number {
    // This would typically come from subscription data
    // For now, return a placeholder
    return 0.05 // 5% monthly churn
  }

  // Calculate customer lifetime value
  private calculateCustomerLifetimeValue(): number {
    const avgMonthlyRevenue = this.metrics.monthly_recurring_revenue
    const churnRate = this.metrics.churn_rate / 100
    
    if (churnRate === 0) return 0
    
    // CLV = Monthly Revenue / Churn Rate
    return avgMonthlyRevenue / churnRate
  }

  // Update average order value
  private updateAverageOrderValue(newAmount: number): void {
    const currentAOV = this.metrics.average_order_value
    const totalOrders = Object.values(this.userBehaviorMetrics.checkout_completions)
      .reduce((sum, count) => sum + count, 0)
    
    if (totalOrders > 0) {
      this.metrics.average_order_value = 
        ((currentAOV * (totalOrders - 1)) + newAmount) / totalOrders
    } else {
      this.metrics.average_order_value = newAmount
    }
  }

  // Update conversion rate
  private updateConversionRate(): void {
    this.metrics.conversion_rate = this.calculateConversionRate()
  }

  // Get plan monthly value for MRR calculation
  private getPlanMonthlyValue(planId: string): number {
    const planValues: Record<string, number> = {
      creator: 19,
      pro: 49,
      enterprise: 299
    }
    
    return planValues[planId] || 0
  }

  // Track errors
  public trackError(errorType: string, error: any): void {
    this.errorCount++
    
    try {
      // Send to Sentry if available
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureException(error, {
          tags: { errorType, source: 'monitoring_service' }
        })
      }
      
      // Log error locally
      console.error(`[${errorType}]`, error)
      
      // Send to error tracking service
      this.sendToErrorTracking(errorType, error)
      
    } catch (trackingError) {
      console.error('Failed to track error:', trackingError)
    }
  }

  // Track custom metrics
  public trackMetric(metricName: string, value: number): void {
    try {
      // Send to analytics service
      this.sendToAnalytics('metric', { name: metricName, value })
      
      // Update local metrics
      if (metricName in this.performanceMetrics) {
        (this.performanceMetrics as any)[metricName] = value
      }
      
    } catch (error) {
      this.trackError('metric_tracking_error', error)
    }
  }

  // Send data to analytics service
  private async sendToAnalytics(event: string, data: any): Promise<void> {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, data, timestamp: Date.now() })
      })
    } catch (error) {
      this.trackError('analytics_send_error', error)
    }
  }

  // Send errors to error tracking service
  private async sendToErrorTracking(errorType: string, error: any): Promise<void> {
    try {
      await fetch('/api/analytics/error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          errorType, 
          error: error.message || error.toString(),
          stack: error.stack,
          timestamp: Date.now() 
        })
      })
    } catch (sendError) {
      console.error('Failed to send error to tracking service:', sendError)
    }
  }

  // Load historical metrics
  private loadHistoricalMetrics(): void {
    if (typeof window === 'undefined') return
    
    try {
      const stored = localStorage.getItem('promptforge_metrics')
      if (stored) {
        const parsed = JSON.parse(stored)
        this.metrics = { ...this.metrics, ...parsed.metrics }
        this.performanceMetrics = { ...this.performanceMetrics, ...parsed.performance }
        this.userBehaviorMetrics = { ...this.userBehaviorMetrics, ...parsed.userBehavior }
      }
    } catch (error) {
      this.trackError('metrics_load_error', error)
    }
  }

  // Save metrics to localStorage
  private saveMetrics(): void {
    if (typeof window === 'undefined') return
    
    try {
      const data = {
        metrics: this.metrics,
        performance: this.performanceMetrics,
        userBehavior: this.userBehaviorMetrics,
        timestamp: Date.now()
      }
      
      localStorage.setItem('promptforge_metrics', JSON.stringify(data))
    } catch (error) {
      this.trackError('metrics_save_error', error)
    }
  }

  // Get current metrics
  public getMetrics(): BusinessMetrics {
    return { ...this.metrics }
  }

  // Get performance metrics
  public getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics }
  }

  // Get user behavior metrics
  public getUserBehaviorMetrics(): UserBehaviorMetrics {
    return { ...this.userBehaviorMetrics }
  }

  // Get comprehensive dashboard data
  public getDashboardData() {
    return {
      business: this.metrics,
      performance: this.performanceMetrics,
      userBehavior: this.userBehaviorMetrics,
      summary: {
        totalErrors: this.errorCount,
        isHealthy: this.errorCount < 10,
        lastUpdated: new Date().toISOString()
      }
    }
  }

  // Health check
  public healthCheck(): boolean {
    return this.isInitialized && this.errorCount < 100
  }
}

// Export singleton instance
export const monitoringService = MonitoringService.getInstance()

// Export convenience functions
export const trackBusinessEvent = (event: string, data: any) => 
  monitoringService.trackBusinessEvent(event, data)

export const trackError = (errorType: string, error: any) => 
  monitoringService.trackError(errorType, error)

export const trackMetric = (metricName: string, value: number) => 
  monitoringService.trackMetric(metricName, value)

export const getMetrics = () => monitoringService.getMetrics()
export const getDashboardData = () => monitoringService.getDashboardData()
export const healthCheck = () => monitoringService.healthCheck()
