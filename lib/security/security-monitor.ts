import { createClient } from '@supabase/supabase-js'

export interface SecurityEvent {
  id?: string
  timestamp: string
  event_type: 'threat_detected' | 'rate_limit_exceeded' | 'injection_attempt' | 'honeypot_accessed' | 'suspicious_activity'
  severity: 'low' | 'medium' | 'high' | 'critical'
  fingerprint: string
  ip_address?: string
  user_agent?: string
  pathname: string
  method: string
  details: Record<string, any>
  blocked: boolean
  response_code: number
}

export interface SecurityMetrics {
  total_events: number
  blocked_requests: number
  threat_level: 'low' | 'medium' | 'high' | 'critical'
  recent_events: SecurityEvent[]
  top_threats: Record<string, number>
  rate_limit_violations: number
  injection_attempts: number
}

export class SecurityMonitor {
  private supabase: any | null = null
  private eventBuffer: SecurityEvent[] = []
  private bufferSize = 100
  private flushInterval = 30000 // 30 seconds

  constructor() {
    // Start periodic flushing
    setInterval(() => this.flushEvents(), this.flushInterval)
  }

  private getSupabase() {
    if (!this.supabase) {
      // Only create client when needed and environment variables are available
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        this.supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        )
      } else {
        // Return a mock client for build time
        this.supabase = {
          from: () => ({
            insert: async () => ({ data: null, error: null }),
            select: () => ({
              gte: () => ({
                order: () => ({
                  limit: async () => ({ data: [], error: null })
                })
              })
            })
          })
        }
      }
    }
    return this.supabase
  }

  // Log security event
  async logEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): Promise<void> {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString()
    }

    // Add to buffer
    this.eventBuffer.push(securityEvent)

    // Flush if buffer is full
    if (this.eventBuffer.length >= this.bufferSize) {
      await this.flushEvents()
    }

    // Log to console for immediate visibility
    this.logToConsole(securityEvent)
  }

  // Log threat detection
  async logThreat(
    eventType: SecurityEvent['event_type'],
    severity: SecurityEvent['severity'],
    fingerprint: string,
    request: any,
    details: Record<string, any>,
    blocked: boolean = false
  ): Promise<void> {
    await this.logEvent({
      event_type: eventType,
      severity,
      fingerprint,
      ip_address: request.ip || 'unknown',
      user_agent: request.headers?.get('user-agent') || 'unknown',
      pathname: request.nextUrl?.pathname || 'unknown',
      method: request.method || 'unknown',
      details,
      blocked,
      response_code: blocked ? 400 : 200
    })
  }

  // Log rate limit violation
  async logRateLimitViolation(fingerprint: string, request: any, endpoint: string): Promise<void> {
    await this.logEvent({
      event_type: 'rate_limit_exceeded',
      severity: 'medium',
      fingerprint,
      ip_address: request.ip || 'unknown',
      user_agent: request.headers?.get('user-agent') || 'unknown',
      pathname: request.nextUrl?.pathname || 'unknown',
      method: request.method || 'unknown',
      details: { endpoint, limit_type: 'rate_limit' },
      blocked: true,
      response_code: 429
    })
  }

  // Log injection attempt
  async logInjectionAttempt(
    fingerprint: string,
    request: any,
    patterns: string[],
    risk: 'low' | 'medium' | 'high',
    blocked: boolean
  ): Promise<void> {
    await this.logEvent({
      event_type: 'injection_attempt',
      severity: risk === 'high' ? 'high' : risk === 'medium' ? 'medium' : 'low',
      fingerprint,
      ip_address: request.ip || 'unknown',
      user_agent: request.headers?.get('user-agent') || 'unknown',
      pathname: request.nextUrl?.pathname || 'unknown',
      method: request.method || 'unknown',
      details: { patterns, risk, injection_type: 'prompt_injection' },
      blocked,
      response_code: blocked ? 400 : 200
    })
  }

  // Log honeypot access
  async logHoneypotAccess(fingerprint: string, request: any, pathname: string): Promise<void> {
    await this.logEvent({
      event_type: 'honeypot_accessed',
      severity: 'high',
      fingerprint,
      ip_address: request.ip || 'unknown',
      user_agent: request.headers?.get('user-agent') || 'unknown',
      pathname,
      method: request.method || 'unknown',
      details: { honeypot_type: 'admin_endpoint', suspicious: true },
      blocked: true,
      response_code: 404
    })
  }

  // Get security metrics
  async getSecurityMetrics(hours: number = 24): Promise<SecurityMetrics> {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
    
    const supabase = this.getSupabase()
    const { data: events, error } = await supabase
      .from('security_events')
      .select('*')
      .gte('timestamp', since)
      .order('timestamp', { ascending: false })

    if (error) {
      console.error('Error fetching security metrics:', error)
      return this.getDefaultMetrics()
    }

    const totalEvents = events.length
    const blockedRequests = events.filter((e: SecurityEvent) => e.blocked).length
    const rateLimitViolations = events.filter((e: SecurityEvent) => e.event_type === 'rate_limit_exceeded').length
    const injectionAttempts = events.filter((e: SecurityEvent) => e.event_type === 'injection_attempt').length

    // Calculate threat level
    let threatLevel: SecurityMetrics['threat_level'] = 'low'
    const highSeverityEvents = events.filter((e: SecurityEvent) => e.severity === 'high' || e.severity === 'critical').length
    if (highSeverityEvents > 10) threatLevel = 'critical'
    else if (highSeverityEvents > 5) threatLevel = 'high'
    else if (highSeverityEvents > 2) threatLevel = 'medium'

    // Get top threats
    const topThreats: Record<string, number> = {}
    events.forEach((event: SecurityEvent) => {
      const key = `${event.event_type}:${event.severity}`
      topThreats[key] = (topThreats[key] || 0) + 1
    })

    return {
      total_events: totalEvents,
      blocked_requests: blockedRequests,
      threat_level: threatLevel,
      recent_events: events.slice(0, 10),
      top_threats: topThreats,
      rate_limit_violations: rateLimitViolations,
      injection_attempts: injectionAttempts
    }
  }

  // Get default metrics (fallback)
  private getDefaultMetrics(): SecurityMetrics {
    return {
      total_events: 0,
      blocked_requests: 0,
      threat_level: 'low',
      recent_events: [],
      top_threats: {},
      rate_limit_violations: 0,
      injection_attempts: 0
    }
  }

  // Flush events to database
  private async flushEvents(): Promise<void> {
    if (this.eventBuffer.length === 0) return

    try {
      const eventsToFlush = [...this.eventBuffer]
      this.eventBuffer = []

      const supabase = this.getSupabase()
      const { error } = await supabase
        .from('security_events')
        .insert(eventsToFlush)

      if (error) {
        console.error('Error flushing security events:', error)
        // Re-add events to buffer for retry
        this.eventBuffer.unshift(...eventsToFlush)
      }
    } catch (error) {
      console.error('Error in security event flush:', error)
      // Re-add events to buffer for retry
      this.eventBuffer.unshift(...this.eventBuffer)
    }
  }

  // Log to console for immediate visibility
  private logToConsole(event: SecurityEvent): void {
    const emoji = this.getSeverityEmoji(event.severity)
    const timestamp = new Date(event.timestamp).toLocaleTimeString()
    
    console.log(`${emoji} [${timestamp}] ${event.event_type.toUpperCase()} - ${event.severity.toUpperCase()}`)
    console.log(`  Fingerprint: ${event.fingerprint}`)
    console.log(`  Path: ${event.method} ${event.pathname}`)
    console.log(`  IP: ${event.ip_address}`)
    console.log(`  Blocked: ${event.blocked}`)
    console.log(`  Details:`, event.details)
    console.log('---')
  }

  // Get severity emoji
  private getSeverityEmoji(severity: SecurityEvent['severity']): string {
    switch (severity) {
      case 'critical': return '🚨'
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '⚪'
    }
  }

  // Get real-time threat alerts
  async getThreatAlerts(): Promise<SecurityEvent[]> {
    const since = new Date(Date.now() - 5 * 60 * 1000).toISOString() // Last 5 minutes
    
    const supabase = this.getSupabase()
    const { data: events, error } = await supabase
      .from('security_events')
      .select('*')
      .gte('timestamp', since)
      .in('severity', ['high', 'critical'])
      .order('timestamp', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching threat alerts:', error)
      return []
    }

    return events || []
  }

  // Check if IP should be blocked
  async shouldBlockIP(ip: string): Promise<boolean> {
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString() // Last hour
    
    const supabase = this.getSupabase()
    const { data: events, error } = await supabase
      .from('security_events')
      .select('*')
      .eq('ip_address', ip)
      .gte('timestamp', since)
      .in('severity', ['high', 'critical'])

    if (error) {
      console.error('Error checking IP block status:', error)
      return false
    }

    // Block IP if it has 5+ high/critical events in the last hour
    return (events?.length || 0) >= 5
  }
}

// Export singleton instance
export const securityMonitor = new SecurityMonitor()
