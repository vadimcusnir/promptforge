import { NextRequest, NextResponse } from 'next/server'
import { edgeRateLimiter } from './rate-limiter-edge'
import { inputSanitizerServer } from './input-sanitizer-server'

export class WAFMiddleware {
  // Process request through WAF
  async processRequest(request: NextRequest): Promise<NextResponse | null> {
    const pathname = request.nextUrl.pathname
    
    // Check honeypot endpoints
    if (edgeRateLimiter.isHoneypotEndpoint(pathname)) {
      const fingerprint = await edgeRateLimiter.generateFingerprint(request as any)
      edgeRateLimiter.handleHoneypotAccess(fingerprint, pathname)
      return this.createHoneypotResponse()
    }

    // Generate fingerprint for rate limiting
    const fingerprint = await edgeRateLimiter.generateFingerprint(request as any)
    
    // Check burst protection
    const burstCheck = edgeRateLimiter.checkBurstLimit(fingerprint)
    if (!burstCheck.allowed) {
      return this.createRateLimitResponse('Burst limit exceeded', 429)
    }

    // Check endpoint-specific rate limits
    const rateCheck = edgeRateLimiter.checkRateLimit(fingerprint, pathname)
    if (!rateCheck.allowed) {
      return this.createRateLimitResponse('Rate limit exceeded', 429, rateCheck)
    }

    // Sanitize request body for POST/PUT requests
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      const sanitizationResult = await this.sanitizeRequestBody(request)
      if (sanitizationResult.blocked) {
        return this.createSecurityResponse('Malicious content detected', 400, sanitizationResult.warnings)
      }
    }

    // Add security headers
    const response = NextResponse.next()
    this.addSecurityHeaders(response)
    this.addRateLimitHeaders(response, rateCheck)

    return response
  }

  // Sanitize request body
  private async sanitizeRequestBody(request: NextRequest): Promise<{ blocked: boolean; warnings: string[] }> {
    try {
      const contentType = request.headers.get('content-type') || ''
      const warnings: string[] = []

      if (contentType.includes('application/json')) {
        const body = await request.text()
        const sanitized = inputSanitizerServer.sanitizeJSON(body)
        
        if (!sanitized.valid) {
          return { blocked: true, warnings: ['Invalid JSON format'] }
        }
        
        warnings.push(...sanitized.warnings)
        
        // Check for prompt injection in JSON
        if (body.includes('prompt') || body.includes('input') || body.includes('text')) {
          const injectionCheck = inputSanitizerServer.detectPromptInjection(body)
          if (injectionCheck.risk === 'high') {
            return { blocked: true, warnings: ['High-risk prompt injection detected'] }
          }
          warnings.push(...injectionCheck.patterns.map(p => `Injection pattern: ${p}`))
        }
      } else if (contentType.includes('text/plain') || contentType.includes('application/x-www-form-urlencoded')) {
        const body = await request.text()
        const injectionCheck = inputSanitizerServer.detectPromptInjection(body)
        
        if (injectionCheck.risk === 'high') {
          return { blocked: true, warnings: ['High-risk prompt injection detected'] }
        }
        
        warnings.push(...injectionCheck.patterns.map(p => `Injection pattern: ${p}`))
      }

      return { blocked: false, warnings }
    } catch (error) {
      return { blocked: true, warnings: ['Request processing error'] }
    }
  }

  // Add security headers
  private addSecurityHeaders(response: NextResponse): void {
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    
    // CSP header
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "media-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
    
    response.headers.set('Content-Security-Policy', csp)
  }

  // Add rate limit headers
  private addRateLimitHeaders(response: NextResponse, rateCheck: any): void {
    const headers = edgeRateLimiter.getRateLimitHeaders(rateCheck.remaining, rateCheck.resetTime)
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
  }

  // Create rate limit response
  private createRateLimitResponse(message: string, status: number, rateCheck?: any): NextResponse {
    const response = NextResponse.json(
      { error: 'RATE_LIMIT_EXCEEDED', message, retryAfter: rateCheck?.resetTime || 60 },
      { status }
    )
    
    if (rateCheck?.resetTime) {
      response.headers.set('Retry-After', Math.ceil((rateCheck.resetTime - Date.now()) / 1000).toString())
    }
    
    return response
  }

  // Create security response
  private createSecurityResponse(message: string, status: number, warnings: string[]): NextResponse {
    return NextResponse.json(
      { error: 'SECURITY_VIOLATION', message, warnings },
      { status }
    )
  }

  // Create honeypot response
  private createHoneypotResponse(): NextResponse {
    return NextResponse.json(
      { error: 'NOT_FOUND', message: 'Endpoint not found' },
      { status: 404 }
    )
  }
}

// Export singleton instance
export const wafMiddleware = new WAFMiddleware()
