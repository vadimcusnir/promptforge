// KPI/SLA Monitoring System with Alerts
import { trackGA4Event } from './analytics'

// SLA Thresholds
export const SLA_THRESHOLDS = {
  PASS_RATE: 99, // 99% pass rate required
  P95_TTA_TEXT: 60, // 95th percentile TTA ≤60s for text
  P95_TTA_SOP: 300, // 95th percentile TTA ≤300s for SOP
  P95_SCORE: 80, // 95th percentile score ≥80
  WEBHOOK_FAIL_RATE: 1, // <1% webhook failure rate
  ERROR_RATE: 1, // <1% error rate
  STRIPE_WEBHOOK_FAILURES: 3, // <3 failures per minute
} as const

// Alert Severity Levels
export type AlertSeverity = 'info' | 'warning' | 'critical'

// Alert Interface
export interface Alert {
  id: string
  severity: AlertSeverity
  title: string
  message: string
  metric: string
  currentValue: number
  threshold: number
  timestamp: Date
  acknowledged: boolean
  acknowledgedBy?: string
  acknowledgedAt?: Date
}

// KPI Metrics Interface
export interface KPIMetrics {
  pass_rate_pct: number
  p95_tta_text: number
  p95_tta_sop: number
  p95_score: number
  webhook_fail_rate: number
  error_rate: number
  stripe_webhook_failures_per_min: number
  total_runs: number
  successful_runs: number
  failed_runs: number
  total_webhooks: number
  failed_webhooks: number
  last_updated: Date
}

// Alert Manager Class
class AlertManager {
  private static instance: AlertManager
  private alerts: Alert[] = []
  private alertHandlers: ((alert: Alert) => void)[] = []

  private constructor() {}

  public static getInstance(): AlertManager {
    if (!AlertManager.instance) {
      AlertManager.instance = new AlertManager()
    }
    return AlertManager.instance
  }

  // Add alert handler
  public addAlertHandler(handler: (alert: Alert) => void) {
    this.alertHandlers.push(handler)
  }

  // Create new alert
  public createAlert(
    severity: AlertSeverity,
    title: string,
    message: string,
    metric: string,
    currentValue: number,
    threshold: number
  ): Alert {
    const alert: Alert = {
      id: `${metric}_${Date.now()}`,
      severity,
      title,
      message,
      metric,
      currentValue,
      threshold,
      timestamp: new Date(),
      acknowledged: false,
    }

    this.alerts.push(alert)
    
    // Notify handlers
    this.alertHandlers.forEach(handler => handler(alert))
    
    // Track in GA4
    trackGA4Event({
      event: 'PF_ALERT_CREATED',
      parameters: {
        alert_severity: severity,
        alert_metric: metric,
        current_value: currentValue,
        threshold: threshold,
      }
    })

    return alert
  }

  // Acknowledge alert
  public acknowledgeAlert(alertId: string, acknowledgedBy: string) {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.acknowledged = true
      alert.acknowledgedBy = acknowledgedBy
      alert.acknowledgedAt = new Date()
    }
  }

  // Get active alerts
  public getActiveAlerts(): Alert[] {
    return this.alerts.filter(a => !a.acknowledged)
  }

  // Get all alerts
  public getAllAlerts(): Alert[] {
    return [...this.alerts]
  }

  // Clear old alerts (older than 24 hours)
  public clearOldAlerts() {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000)
    this.alerts = this.alerts.filter(a => a.timestamp > cutoff)
  }
}

// KPI Monitor Class
class KPIMonitor {
  private static instance: KPIMonitor
  private alertManager: AlertManager
  private metrics: KPIMetrics
  private monitoringInterval?: NodeJS.Timeout

  private constructor() {
    this.alertManager = AlertManager.getInstance()
    this.metrics = this.getDefaultMetrics()
  }

  public static getInstance(): KPIMonitor {
    if (!KPIMonitor.instance) {
      KPIMonitor.instance = new KPIMonitor()
    }
    return KPIMonitor.instance
  }

  // Start monitoring
  public startMonitoring(intervalMs: number = 60000) { // Default: 1 minute
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
    }

    this.monitoringInterval = setInterval(() => {
      this.checkSLACompliance()
    }, intervalMs)

    console.log('KPI monitoring started with interval:', intervalMs, 'ms')
  }

  // Stop monitoring
  public stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
      this.monitoringInterval = undefined
    }
    console.log('KPI monitoring stopped')
  }

  // Check SLA compliance and create alerts
  private async checkSLACompliance() {
    try {
      // Update metrics (this would fetch from your data source)
      await this.updateMetrics()
      
      // Check each metric against thresholds
      this.checkPassRate()
      this.checkTTAMetrics()
      this.checkScoreMetrics()
      this.checkWebhookMetrics()
      this.checkErrorRate()
      this.checkStripeWebhookFailures()
      
    } catch (error) {
      console.error('Failed to check SLA compliance:', error)
      this.alertManager.createAlert(
        'critical',
        'SLA Monitoring Failed',
        'Failed to check SLA compliance',
        'monitoring_system',
        0,
        0
      )
    }
  }

  // Check pass rate
  private checkPassRate() {
    const { pass_rate_pct } = this.metrics
    if (pass_rate_pct < SLA_THRESHOLDS.PASS_RATE) {
      this.alertManager.createAlert(
        'critical',
        'Pass Rate Below SLA',
        `Pass rate ${pass_rate_pct.toFixed(1)}% is below required ${SLA_THRESHOLDS.PASS_RATE}%`,
        'pass_rate',
        pass_rate_pct,
        SLA_THRESHOLDS.PASS_RATE
      )
    }
  }

  // Check TTA metrics
  private checkTTAMetrics() {
    const { p95_tta_text, p95_tta_sop } = this.metrics
    
    if (p95_tta_text > SLA_THRESHOLDS.P95_TTA_TEXT) {
      this.alertManager.createAlert(
        'warning',
        'Text TTA Above SLA',
        `P95 Text TTA ${p95_tta_text}s is above required ${SLA_THRESHOLDS.P95_TTA_TEXT}s`,
        'p95_tta_text',
        p95_tta_text,
        SLA_THRESHOLDS.P95_TTA_TEXT
      )
    }

    if (p95_tta_sop > SLA_THRESHOLDS.P95_TTA_SOP) {
      this.alertManager.createAlert(
        'warning',
        'SOP TTA Above SLA',
        `P95 SOP TTA ${p95_tta_sop}s is above required ${SLA_THRESHOLDS.P95_TTA_SOP}s`,
        'p95_tta_sop',
        p95_tta_sop,
        SLA_THRESHOLDS.P95_TTA_SOP
      )
    }
  }

  // Check score metrics
  private checkScoreMetrics() {
    const { p95_score } = this.metrics
    if (p95_score < SLA_THRESHOLDS.P95_SCORE) {
      this.alertManager.createAlert(
        'warning',
        'Score Below SLA',
        `P95 Score ${p95_score} is below required ${SLA_THRESHOLDS.P95_SCORE}`,
        'p95_score',
        p95_score,
        SLA_THRESHOLDS.P95_SCORE
      )
    }
  }

  // Check webhook metrics
  private checkWebhookMetrics() {
    const { webhook_fail_rate } = this.metrics
    if (webhook_fail_rate > SLA_THRESHOLDS.WEBHOOK_FAIL_RATE) {
      this.alertManager.createAlert(
        'critical',
        'Webhook Fail Rate Above SLA',
        `Webhook fail rate ${webhook_fail_rate.toFixed(2)}% is above required ${SLA_THRESHOLDS.WEBHOOK_FAIL_RATE}%`,
        'webhook_fail_rate',
        webhook_fail_rate,
        SLA_THRESHOLDS.WEBHOOK_FAIL_RATE
      )
    }
  }

  // Check error rate
  private checkErrorRate() {
    const { error_rate } = this.metrics
    if (error_rate > SLA_THRESHOLDS.ERROR_RATE) {
      this.alertManager.createAlert(
        'critical',
        'Error Rate Above SLA',
        `Error rate ${error_rate.toFixed(2)}% is above required ${SLA_THRESHOLDS.ERROR_RATE}%`,
        'error_rate',
        error_rate,
        SLA_THRESHOLDS.ERROR_RATE
      )
    }
  }

  // Check Stripe webhook failures
  private checkStripeWebhookFailures() {
    const { stripe_webhook_failures_per_min } = this.metrics
    if (stripe_webhook_failures_per_min > SLA_THRESHOLDS.STRIPE_WEBHOOK_FAILURES) {
      this.alertManager.createAlert(
        'critical',
        'Stripe Webhook Failures Above SLA',
        `Stripe webhook failures ${stripe_webhook_failures_per_min}/min is above required ${SLA_THRESHOLDS.STRIPE_WEBHOOK_FAILURES}/min`,
        'stripe_webhook_failures',
        stripe_webhook_failures_per_min,
        SLA_THRESHOLDS.STRIPE_WEBHOOK_FAILURES
      )
    }
  }

  // Update metrics (mock implementation - replace with real data source)
  private async updateMetrics(): Promise<void> {
    // This would typically fetch from your database or monitoring service
    // For now, using mock data
    this.metrics = {
      pass_rate_pct: 95.5,
      p95_tta_text: 45,
      p95_tta_sop: 280,
      p95_score: 82,
      webhook_fail_rate: 0.5,
      error_rate: 0.8,
      stripe_webhook_failures_per_min: 1,
      total_runs: 1000,
      successful_runs: 955,
      failed_runs: 45,
      total_webhooks: 500,
      failed_webhooks: 3,
      last_updated: new Date(),
    }
  }

  // Get current metrics
  public getMetrics(): KPIMetrics {
    return { ...this.metrics }
  }

  // Get default metrics
  private getDefaultMetrics(): KPIMetrics {
    return {
      pass_rate_pct: 0,
      p95_tta_text: 0,
      p95_tta_sop: 0,
      p95_score: 0,
      webhook_fail_rate: 0,
      error_rate: 0,
      stripe_webhook_failures_per_min: 0,
      total_runs: 0,
      successful_runs: 0,
      failed_runs: 0,
      total_webhooks: 0,
      failed_webhooks: 0,
      last_updated: new Date(),
    }
  }

  // Force test alert
  public forceTestAlert(metric: string = 'test_metric') {
    this.alertManager.createAlert(
      'info',
      'Test Alert',
      'This is a test alert for monitoring system verification',
      metric,
      100,
      50
    )
  }
}

// Export singleton instances
export const alertManager = AlertManager.getInstance()
export const kpiMonitor = KPIMonitor.getInstance()

// Export convenience functions
export const startKPIMonitoring = (intervalMs?: number) => 
  kpiMonitor.startMonitoring(intervalMs)

export const stopKPIMonitoring = () => 
  kpiMonitor.stopMonitoring()

export const getKPIMetrics = () => 
  kpiMonitor.getMetrics()

export const getActiveAlerts = () => 
  alertManager.getActiveAlerts()

export const acknowledgeAlert = (alertId: string, acknowledgedBy: string) => 
  alertManager.acknowledgeAlert(alertId, acknowledgedBy)

export const forceTestAlert = (metric?: string) => 
  kpiMonitor.forceTestAlert(metric)
