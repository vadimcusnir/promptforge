import { NextRequest, NextResponse } from 'next/server'
import { SessionManager } from './session-manager'
import { SecurityMonitor } from './security-monitor'
import { AnomalyDetector } from './anomaly-detector'
import { CSRFProtection } from './csrf-protection'
import { DeviceFingerprintCollector } from './device-fingerprint'

export interface SecurityContext {
  userId?: string
  sessionId?: string
  ipAddress: string
  userAgent?: string
  deviceFingerprint?: any
  isAuthenticated: boolean
  requiresMFA: boolean
  isBlocked: boolean
}

export class SecurityMiddleware {
  private sessionManager: SessionManager
  private securityMonitor: SecurityMonitor
  private anomalyDetector: AnomalyDetector
  private csrfProtection: CSRFProtection

  constructor() {
    this.sessionManager = new SessionManager()
    this.securityMonitor = new SecurityMonitor()
    this.anomalyDetector = new AnomalyDetector()
    this.csrfProtection = new CSRFProtection()
  }

  /**
   * Process request through security pipeline
   */
  async processRequest(request: NextRequest): Promise<{
    context: SecurityContext
    response?: NextResponse
    error?: string
  }> {
    const context: SecurityContext = {
      ipAddress: this.getClientIP(request),
      userAgent: request.headers.get('user-agent') || undefined,
      isAuthenticated: false,
      requiresMFA: false,
      isBlocked: false
    }

    try {
      // 1. Check rate limits
      const isRateLimited = await this.checkRateLimits(request, context)
      if (isRateLimited) {
        return {
          context,
          response: new NextResponse(
            JSON.stringify({ error: 'Rate limit exceeded' }),
            { status: 429, headers: { 'Content-Type': 'application/json' } }
          )
        }
      }

      // 2. Validate session
      const sessionValidation = await this.validateSession(request, context)
      if (sessionValidation.error) {
        return { context, error: sessionValidation.error }
      }
      context.isAuthenticated = sessionValidation.isAuthenticated
      context.userId = sessionValidation.userId
      context.sessionId = sessionValidation.sessionId

      // 3. Check CSRF protection for state-changing operations
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
        const csrfValid = await this.validateCSRF(request, context)
        if (!csrfValid) {
          return {
            context,
            response: new NextResponse(
              JSON.stringify({ error: 'CSRF token validation failed' }),
              { status: 403, headers: { 'Content-Type': 'application/json' } }
            )
          }
        }
      }

      // 4. Anomaly detection
      if (context.isAuthenticated) {
        await this.detectAnomalies(request, context)
      }

      // 5. Log security event
      await this.logSecurityEvent(request, context)

      return { context }

    } catch (error) {
      console.error('Security middleware error:', error)
      return {
        context,
        response: new NextResponse(
          JSON.stringify({ error: 'Security validation failed' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }
  }

  /**
   * Check rate limits
   */
  private async checkRateLimits(request: NextRequest, context: SecurityContext): Promise<boolean> {
    const action = `${request.method}:${request.nextUrl.pathname}`
    const identifier = context.userId || context.ipAddress

    const isAllowed = await this.securityMonitor.checkRateLimit(identifier, action)
    return !isAllowed
  }

  /**
   * Validate session
   */
  private async validateSession(
    request: NextRequest,
    context: SecurityContext
  ): Promise<{
    isAuthenticated: boolean
    userId?: string
    sessionId?: string
    error?: string
  }> {
    const sessionToken = request.cookies.get('session_token')?.value

    if (!sessionToken) {
      return { isAuthenticated: false }
    }

    try {
      const session = await this.sessionManager.getSession(sessionToken)
      if (!session) {
        return { isAuthenticated: false, error: 'Invalid session' }
      }

      return {
        isAuthenticated: true,
        userId: session.userId,
        sessionId: session.id
      }
    } catch (error) {
      return { isAuthenticated: false, error: 'Session validation failed' }
    }
  }

  /**
   * Validate CSRF token
   */
  private async validateCSRF(request: NextRequest, context: SecurityContext): Promise<boolean> {
    if (!context.userId) {
      return true // Skip CSRF for unauthenticated requests
    }

    // Skip CSRF for certain endpoints
    const pathname = request.nextUrl.pathname
    const skipCSRF = [
      '/api/auth/login',
      '/api/auth/signup',
      '/api/auth/refresh',
      '/api/auth/forgot-password'
    ].some(endpoint => pathname.includes(endpoint))

    if (skipCSRF) {
      return true
    }

    return await this.csrfProtection.validateRequest(request, context.userId)
  }

  /**
   * Detect anomalies
   */
  private async detectAnomalies(request: NextRequest, context: SecurityContext): Promise<void> {
    if (!context.userId) return

    const eventType = this.getEventType(request)
    const metadata = {
      path: request.nextUrl.pathname,
      method: request.method,
      timestamp: new Date().toISOString()
    }

    const anomalies = await this.anomalyDetector.analyzeEvent(
      context.userId,
      eventType,
      metadata,
      context.ipAddress,
      context.userAgent
    )

    // Handle detected anomalies
    for (const anomaly of anomalies) {
      if (anomaly.severity === 'critical') {
        context.isBlocked = true
      }
    }
  }

  /**
   * Log security event
   */
  private async logSecurityEvent(request: NextRequest, context: SecurityContext): Promise<void> {
    const eventType = this.getEventType(request)
    const severity = this.getEventSeverity(eventType, context)

    await this.securityMonitor.logSecurityEvent(
      eventType,
      severity,
      `API request to ${request.nextUrl.pathname}`,
      {
        method: request.method,
        path: request.nextUrl.pathname,
        authenticated: context.isAuthenticated,
        hasSession: !!context.sessionId
      },
      request,
      context.userId,
      context.sessionId
    )
  }

  /**
   * Get event type from request
   */
  private getEventType(request: NextRequest): string {
    const pathname = request.nextUrl.pathname
    const method = request.method

    if (pathname.includes('/auth/login')) return 'login_attempt'
    if (pathname.includes('/auth/logout')) return 'logout'
    if (pathname.includes('/auth/forgot-password')) return 'password_reset_request'
    if (pathname.includes('/auth/reset-password')) return 'password_reset'
    if (pathname.includes('/mfa/')) return 'mfa_attempt'
    if (pathname.includes('/api/')) return 'api_request'
    
    return 'page_request'
  }

  /**
   * Get event severity
   */
  private getEventSeverity(eventType: string, context: SecurityContext): 'low' | 'medium' | 'high' | 'critical' {
    if (context.isBlocked) return 'critical'
    if (eventType.includes('login') || eventType.includes('mfa')) return 'medium'
    if (eventType.includes('password_reset')) return 'high'
    return 'low'
  }

  /**
   * Get client IP address
   */
  private getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    
    if (forwarded) {
      return forwarded.split(',')[0].trim()
    }
    
    if (realIP) {
      return realIP
    }
    
    return (request as any).ip || 'unknown'
  }
}

/**
 * Middleware wrapper for API routes
 */
export function withSecurityMiddleware(handler: Function) {
  return async (request: NextRequest, context: any) => {
    const securityMiddleware = new SecurityMiddleware()
    const { context: securityContext, response, error } = await securityMiddleware.processRequest(request)

    if (response) {
      return response
    }

    if (error) {
      return new NextResponse(
        JSON.stringify({ error }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Add security context to request
    ;(request as any).securityContext = securityContext

    return handler(request, context)
  }
}

/**
 * Middleware for authenticated routes only
 */
export function withAuthentication(handler: Function) {
  return withSecurityMiddleware(async (request: NextRequest, context: any) => {
    const securityContext = (request as any).securityContext as SecurityContext

    if (!securityContext.isAuthenticated) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return handler(request, context)
  })
}
