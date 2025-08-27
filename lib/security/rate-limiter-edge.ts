// Edge Runtime compatible rate limiter
// Uses Web Crypto API instead of Node.js crypto

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  // General API limits
  GENERAL: { requests: 100, window: 60 }, // 100 requests per minute
  AUTH: { requests: 10, window: 60 }, // 10 auth attempts per minute
  EXPORT: { requests: 20, window: 60 }, // 20 exports per minute
  ANALYTICS: { requests: 50, window: 60 }, // 50 analytics events per minute
  
  // Strict limits for sensitive operations
  LOGIN: { requests: 5, window: 300 }, // 5 login attempts per 5 minutes
  SIGNUP: { requests: 3, window: 600 }, // 3 signup attempts per 10 minutes
  PASSWORD_RESET: { requests: 3, window: 3600 }, // 3 password resets per hour
  
  // Burst protection
  BURST: { requests: 30, window: 10 }, // 30 requests per 10 seconds
}

// In-memory store for rate limiting (replace with Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Honeypot endpoints configuration
const HONEYPOT_ENDPOINTS = [
  '/api/admin/root',
  '/api/internal/debug',
  '/api/system/status',
  '/api/backup/restore',
  '/api/database/query',
  '/api/users/all',
  '/api/keys/export',
  '/api/logs/download',
  '/api/config/update',
  '/api/security/disable'
]

// Simple hash function for Edge Runtime
async function simpleHash(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export class EdgeRateLimiter {
  // Generate unique fingerprint for request
  async generateFingerprint(request: Request): Promise<string> {
    const components = [
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      request.headers.get('user-agent') || 'unknown',
      request.headers.get('accept-language') || 'unknown',
      request.headers.get('accept-encoding') || 'unknown',
      request.headers.get('sec-ch-ua') || 'unknown',
      request.headers.get('sec-ch-ua-platform') || 'unknown',
      request.headers.get('sec-ch-ua-mobile') || 'unknown',
    ]
    
    // Add behavioral patterns
    const timestamp = Math.floor(Date.now() / (5 * 60 * 1000)) // 5-minute windows
    components.push(timestamp.toString())
    
    // Add request pattern analysis
    const url = new URL(request.url)
    const path = url.pathname
    const method = request.method
    components.push(`${method}:${path}`)
    
    const combined = components.join('|')
    return await simpleHash(combined)
  }

  // Check rate limit for specific endpoint
  checkRateLimit(fingerprint: string, endpoint: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const key = `${fingerprint}:${endpoint}`
    
    // Get current rate limit config
    const config = this.getRateLimitConfig(endpoint)
    const windowMs = config.window * 1000
    
    // Get current state
    const current = rateLimitStore.get(key)
    
    if (!current || now > current.resetTime) {
      // First request or window expired
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      })
      return { allowed: true, remaining: config.requests - 1, resetTime: now + windowMs }
    }
    
    if (current.count >= config.requests) {
      // Rate limit exceeded
      return { allowed: false, remaining: 0, resetTime: current.resetTime }
    }
    
    // Increment counter
    current.count++
    rateLimitStore.set(key, current)
    
    return { 
      allowed: true, 
      remaining: config.requests - current.count, 
      resetTime: current.resetTime 
    }
  }

  // Get rate limit configuration for endpoint
  private getRateLimitConfig(endpoint: string): { requests: number; window: number } {
    if (endpoint.includes('/auth/login')) return RATE_LIMIT_CONFIG.LOGIN
    if (endpoint.includes('/auth/signup')) return RATE_LIMIT_CONFIG.SIGNUP
    if (endpoint.includes('/auth/reset')) return RATE_LIMIT_CONFIG.PASSWORD_RESET
    if (endpoint.includes('/export')) return RATE_LIMIT_CONFIG.EXPORT
    if (endpoint.includes('/analytics')) return RATE_LIMIT_CONFIG.ANALYTICS
    if (endpoint.includes('/auth')) return RATE_LIMIT_CONFIG.AUTH
    
    return RATE_LIMIT_CONFIG.GENERAL
  }

  // Check burst protection
  checkBurstLimit(fingerprint: string): { allowed: boolean; remaining: number } {
    const now = Date.now()
    const key = `${fingerprint}:burst`
    const config = RATE_LIMIT_CONFIG.BURST
    const windowMs = config.window * 1000
    
    const current = rateLimitStore.get(key)
    
    if (!current || now > current.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      })
      return { allowed: true, remaining: config.requests - 1 }
    }
    
    if (current.count >= config.requests) {
      return { allowed: false, remaining: 0 }
    }
    
    current.count++
    rateLimitStore.set(key, current)
    
    return { allowed: true, remaining: config.requests - current.count }
  }

  // Check if endpoint is a honeypot
  isHoneypotEndpoint(pathname: string): boolean {
    return HONEYPOT_ENDPOINTS.some(endpoint => pathname.startsWith(endpoint))
  }

  // Handle honeypot endpoint access
  handleHoneypotAccess(fingerprint: string, pathname: string): void {
    // Log suspicious activity
    console.warn(`🚨 Honeypot accessed: ${pathname} by fingerprint: ${fingerprint}`)
    
    // Add to suspicious activity tracking
    const key = `${fingerprint}:suspicious`
    const current = rateLimitStore.get(key) || { count: 0, resetTime: Date.now() + (24 * 60 * 60 * 1000) }
    current.count++
    rateLimitStore.set(key, current)
    
    // If multiple honeypot accesses, mark as malicious
    if (current.count >= 3) {
      console.error(`🚨 MALICIOUS ACTIVITY DETECTED: ${fingerprint} accessed ${current.count} honeypot endpoints`)
      // In production, this would trigger alerts and IP blocking
    }
  }

  // Get rate limit headers
  getRateLimitHeaders(remaining: number, resetTime: number): Record<string, string> {
    return {
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': new Date(resetTime).toISOString(),
      'X-RateLimit-Limit': '100', // Default limit
    }
  }

  // Clean up expired entries (run periodically)
  cleanup(): void {
    const now = Date.now()
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key)
      }
    }
  }

  // Get rate limit statistics
  getStats(): Record<string, any> {
    const stats: Record<string, any> = {}
    
    for (const [key, value] of rateLimitStore.entries()) {
      const [fingerprint, endpoint] = key.split(':')
      if (!stats[fingerprint]) {
        stats[fingerprint] = {}
      }
      stats[fingerprint][endpoint] = {
        count: value.count,
        resetTime: new Date(value.resetTime).toISOString(),
        active: Date.now() < value.resetTime
      }
    }
    
    return stats
  }
}

// Export singleton instance
export const edgeRateLimiter = new EdgeRateLimiter()

// Cleanup every 5 minutes
setInterval(() => edgeRateLimiter.cleanup(), 5 * 60 * 1000)
