import { createClient } from '@supabase/supabase-js'

export interface AnomalyRule {
  id: string
  name: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  enabled: boolean
  conditions: AnomalyCondition[]
  actions: AnomalyAction[]
}

export interface AnomalyCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'not_in'
  value: any
  timeWindow?: number // minutes
}

export interface AnomalyAction {
  type: 'log' | 'alert' | 'block' | 'require_mfa' | 'notify'
  config: Record<string, any>
}

export interface DetectedAnomaly {
  id: string
  ruleId: string
  userId: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  metadata: Record<string, any>
  detectedAt: Date
  resolved: boolean
}

export class AnomalyDetector {
  private supabase: any
  private rules: AnomalyRule[] = []

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    this.loadRules()
  }

  /**
   * Load anomaly detection rules
   */
  private async loadRules(): Promise<void> {
    // Default rules - in production, these would be stored in database
    this.rules = [
      {
        id: 'multiple_failed_logins',
        name: 'Multiple Failed Login Attempts',
        description: 'Detect multiple failed login attempts from same IP',
        severity: 'high',
        enabled: true,
        conditions: [
          {
            field: 'event_type',
            operator: 'equals',
            value: 'login_failed',
            timeWindow: 15
          }
        ],
        actions: [
          { type: 'log', config: {} },
          { type: 'alert', config: { threshold: 5 } },
          { type: 'block', config: { duration: 60 } }
        ]
      },
      {
        id: 'unusual_location',
        name: 'Unusual Login Location',
        description: 'Detect login from unusual geographic location',
        severity: 'medium',
        enabled: true,
        conditions: [
          {
            field: 'event_type',
            operator: 'equals',
            value: 'login_success'
          }
        ],
        actions: [
          { type: 'log', config: {} },
          { type: 'require_mfa', config: {} }
        ]
      },
      {
        id: 'concurrent_sessions',
        name: 'Excessive Concurrent Sessions',
        description: 'Detect too many concurrent sessions for user',
        severity: 'medium',
        enabled: true,
        conditions: [
          {
            field: 'event_type',
            operator: 'equals',
            value: 'concurrent_session'
          }
        ],
        actions: [
          { type: 'log', config: {} },
          { type: 'alert', config: {} }
        ]
      },
      {
        id: 'rapid_api_calls',
        name: 'Rapid API Calls',
        description: 'Detect unusually high API call frequency',
        severity: 'medium',
        enabled: true,
        conditions: [
          {
            field: 'event_type',
            operator: 'equals',
            value: 'api_request',
            timeWindow: 5
          }
        ],
        actions: [
          { type: 'log', config: {} },
          { type: 'alert', config: { threshold: 100 } }
        ]
      },
      {
        id: 'mfa_bypass_attempts',
        name: 'MFA Bypass Attempts',
        description: 'Detect attempts to bypass MFA',
        severity: 'critical',
        enabled: true,
        conditions: [
          {
            field: 'event_type',
            operator: 'equals',
            value: 'mfa_failed'
          }
        ],
        actions: [
          { type: 'log', config: {} },
          { type: 'block', config: { duration: 300 } },
          { type: 'notify', config: { channels: ['email', 'admin'] } }
        ]
      }
    ]
  }

  /**
   * Analyze security event for anomalies
   */
  async analyzeEvent(
    userId: string,
    eventType: string,
    metadata: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<DetectedAnomaly[]> {
    const detectedAnomalies: DetectedAnomaly[] = []

    for (const rule of this.rules) {
      if (!rule.enabled) continue

      const isAnomaly = await this.evaluateRule(rule, userId, eventType, metadata, ipAddress, userAgent)
      
      if (isAnomaly) {
        const anomaly: DetectedAnomaly = {
          id: this.generateAnomalyId(),
          ruleId: rule.id,
          userId,
          severity: rule.severity,
          description: rule.description,
          metadata: {
            ...metadata,
            ipAddress,
            userAgent,
            ruleName: rule.name
          },
          detectedAt: new Date(),
          resolved: false
        }

        detectedAnomalies.push(anomaly)
        
        // Execute rule actions
        await this.executeActions(rule.actions, anomaly)
      }
    }

    return detectedAnomalies
  }

  /**
   * Evaluate if a rule condition is met
   */
  private async evaluateRule(
    rule: AnomalyRule,
    userId: string,
    eventType: string,
    metadata: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<boolean> {
    for (const condition of rule.conditions) {
      const isMet = await this.evaluateCondition(condition, userId, eventType, metadata, ipAddress, userAgent)
      if (!isMet) {
        return false
      }
    }
    return true
  }

  /**
   * Evaluate individual condition
   */
  private async evaluateCondition(
    condition: AnomalyCondition,
    userId: string,
    eventType: string,
    metadata: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<boolean> {
    const { field, operator, value, timeWindow } = condition

    // Get field value from event data
    let fieldValue: any
    switch (field) {
      case 'event_type':
        fieldValue = eventType
        break
      case 'ip_address':
        fieldValue = ipAddress
        break
      case 'user_agent':
        fieldValue = userAgent
        break
      default:
        fieldValue = metadata[field]
    }

    // Evaluate condition
    switch (operator) {
      case 'equals':
        return fieldValue === value
      case 'not_equals':
        return fieldValue !== value
      case 'greater_than':
        return Number(fieldValue) > Number(value)
      case 'less_than':
        return Number(fieldValue) < Number(value)
      case 'contains':
        return String(fieldValue).includes(String(value))
      case 'in':
        return Array.isArray(value) && value.includes(fieldValue)
      case 'not_in':
        return Array.isArray(value) && !value.includes(fieldValue)
      default:
        return false
    }
  }

  /**
   * Execute rule actions
   */
  private async executeActions(actions: AnomalyAction[], anomaly: DetectedAnomaly): Promise<void> {
    for (const action of actions) {
      switch (action.type) {
        case 'log':
          await this.logAnomaly(anomaly)
          break
        case 'alert':
          await this.createAlert(anomaly, action.config)
          break
        case 'block':
          await this.blockUser(anomaly.userId, action.config.duration)
          break
        case 'require_mfa':
          await this.requireMFA(anomaly.userId)
          break
        case 'notify':
          await this.sendNotification(anomaly, action.config)
          break
      }
    }
  }

  /**
   * Log detected anomaly
   */
  private async logAnomaly(anomaly: DetectedAnomaly): Promise<void> {
    await this.supabase
      .from('security_events')
      .insert({
        user_id: anomaly.userId,
        event_type: 'anomaly_detected',
        severity: anomaly.severity,
        description: `Anomaly detected: ${anomaly.description}`,
        metadata: anomaly.metadata,
        created_at: anomaly.detectedAt.toISOString()
      })
  }

  /**
   * Create security alert
   */
  private async createAlert(anomaly: DetectedAnomaly, config: Record<string, any>): Promise<void> {
    // Implementation would create alerts in monitoring system
    console.log(`Security alert: ${anomaly.description}`, anomaly)
  }

  /**
   * Block user temporarily
   */
  private async blockUser(userId: string, durationMinutes: number): Promise<void> {
    const blockedUntil = new Date(Date.now() + durationMinutes * 60 * 1000)
    
    await this.supabase
      .from('rate_limits')
      .upsert({
        identifier: userId,
        action: 'login',
        blocked_until: blockedUntil.toISOString(),
        attempt_count: 999
      })
  }

  /**
   * Require MFA for user
   */
  private async requireMFA(userId: string): Promise<void> {
    // Implementation would flag user for MFA requirement
    console.log(`MFA required for user: ${userId}`)
  }

  /**
   * Send notification
   */
  private async sendNotification(anomaly: DetectedAnomaly, config: Record<string, any>): Promise<void> {
    // Implementation would send notifications via email, SMS, etc.
    console.log(`Notification sent for anomaly: ${anomaly.description}`)
  }

  /**
   * Get anomaly statistics
   */
  async getAnomalyStats(userId?: string, timeRange: number = 24): Promise<{
    total: number
    bySeverity: Record<string, number>
    recent: DetectedAnomaly[]
  }> {
    const since = new Date(Date.now() - timeRange * 60 * 60 * 1000)
    
    let query = this.supabase
      .from('security_events')
      .select('*')
      .eq('event_type', 'anomaly_detected')
      .gte('created_at', since.toISOString())

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to get anomaly stats: ${error.message}`)
    }

    const bySeverity = data.reduce((acc: Record<string, number>, event: any) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1
      return acc
    }, {})

    return {
      total: data.length,
      bySeverity,
      recent: data.slice(0, 10).map(this.mapSecurityEventToAnomaly)
    }
  }

  /**
   * Generate unique anomaly ID
   */
  private generateAnomalyId(): string {
    return `anomaly_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Map security event to anomaly
   */
  private mapSecurityEventToAnomaly(event: any): DetectedAnomaly {
    return {
      id: event.id,
      ruleId: event.metadata?.ruleId || 'unknown',
      userId: event.user_id,
      severity: event.severity,
      description: event.description,
      metadata: event.metadata || {},
      detectedAt: new Date(event.created_at),
      resolved: event.resolved || false
    }
  }
}