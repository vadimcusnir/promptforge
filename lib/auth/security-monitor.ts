import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export interface SecurityEvent {
  id?: string
  userId?: string
  sessionId?: string
  eventType: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  metadata: Record<string, any>
  ipAddress?: string
  userAgent?: string
  pathname?: string
  method?: string
  blocked?: boolean
  responseCode?: number
  createdAt?: string
}

export class SecurityMonitor {
  private supabase: any | null = null
  private rateLimitStore = new Map<string, { count: number; resetTime: number }>()

  private getSupabase() {
    if (!this.supabase) {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        this.supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        )
      } else {
        // Mock client for build time
        this.supabase = {
          from: () => ({
            insert: () => Promise.resolve({ data: null, error: null })
          })
        }
      }
    }
    return this.supabase
  }

  // Get client IP from request
  getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const clientIP = forwarded?.split(',')[0] || realIP || 'unknown'
    return clientIP
  }

  // Check rate limit for IP
  async checkRateLimit(ip: string, endpoint: string): Promise<boolean> {
    const key = `${ip}:${endpoint}`
    const now = Date.now()
    const windowMs = 5 * 60 * 1000 // 5 minutes
    const maxRequests = endpoint === 'login' ? 5 : 100

    const current = this.rateLimitStore.get(key)
    
    if (!current || now > current.resetTime) {
      this.rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      })
      return true
    }
    
    if (current.count >= maxRequests) {
      return false
    }
    
    current.count++
    this.rateLimitStore.set(key, current)
    return true
  }

  // Log security event
  async logSecurityEvent(
    eventType: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    description: string,
    metadata: Record<string, any>,
    request: NextRequest,
    userId?: string,
    sessionId?: string
  ): Promise<void> {
    const securityEvent: SecurityEvent = {
      userId,
      sessionId,
      eventType,
      severity,
      description,
      metadata,
      ipAddress: this.getClientIP(request),
      userAgent: request.headers.get('user-agent') || 'unknown',
      pathname: request.nextUrl.pathname,
      method: request.method,
      blocked: false,
      responseCode: 200,
      createdAt: new Date().toISOString()
    }

    try {
      await this.getSupabase()
        .from('security_events')
        .insert(securityEvent)
    } catch (error) {
      console.error('Failed to log security event:', error)
    }
  }

  // Log failed login attempt
  async logFailedLogin(
    email: string,
    reason: string,
    request: NextRequest,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    await this.logSecurityEvent(
      'login_failed',
      'medium',
      `Failed login attempt for ${email}: ${reason}`,
      { email, reason, ...metadata },
      request
    )
  }

  // Log successful login
  async logSuccessfulLogin(
    userId: string,
    email: string,
    request: NextRequest,
    sessionId: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    await this.logSecurityEvent(
      'login_success',
      'low',
      `Successful login for ${email}`,
      { email, ...metadata },
      request,
      userId,
      sessionId
    )
  }

  // Log MFA event
  async logMFAEvent(
    eventType: 'mfa_success' | 'mfa_failed' | 'mfa_enabled' | 'mfa_disabled',
    userId: string,
    request: NextRequest,
    sessionId: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    const severity = eventType.includes('failed') ? 'medium' : 'low'
    const description = eventType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    
    await this.logSecurityEvent(
      eventType,
      severity,
      description,
      metadata,
      request,
      userId,
      sessionId
    )
  }

  // Get security metrics
  async getSecurityMetrics(userId?: string, hours: number = 24): Promise<{
    totalEvents: number
    failedLogins: number
    mfaFailures: number
    suspiciousActivity: number
    recentEvents: SecurityEvent[]
  }> {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
    
    let query = this.getSupabase()
      .from('security_events')
      .select('*')
      .gte('created_at', since)
      .order('created_at', { ascending: false })

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data: events, error } = await query

    if (error) {
      console.error('Error fetching security metrics:', error)
      return {
        totalEvents: 0,
        failedLogins: 0,
        mfaFailures: 0,
        suspiciousActivity: 0,
        recentEvents: []
      }
    }

    const failedLogins = events?.filter((e: SecurityEvent) => e.eventType === 'login_failed').length || 0
    const mfaFailures = events?.filter((e: SecurityEvent) => e.eventType === 'mfa_failed').length || 0
    const suspiciousActivity = events?.filter((e: SecurityEvent) => e.severity === 'high' || e.severity === 'critical').length || 0

    return {
      totalEvents: events?.length || 0,
      failedLogins,
      mfaFailures,
      suspiciousActivity,
      recentEvents: events?.slice(0, 10) || []
    }
  }

  // Get security dashboard data
  async getSecurityDashboard(userId: string): Promise<{
    totalEvents: number
    failedLogins: number
    mfaFailures: number
    suspiciousActivity: number
    recentEvents: SecurityEvent[]
  }> {
    return await this.getSecurityMetrics(userId, 24)
  }

  // Clean up old rate limit entries
  cleanupRateLimits(): void {
    const now = Date.now()
    for (const [key, value] of this.rateLimitStore.entries()) {
      if (now > value.resetTime) {
        this.rateLimitStore.delete(key)
      }
    }
  }
}

// Export singleton instance
export const securityMonitor = new SecurityMonitor()

// Clean up rate limits every 5 minutes
setInterval(() => {
  securityMonitor.cleanupRateLimits()
}, 5 * 60 * 1000)