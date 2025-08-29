import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

// Enhanced rate limiting for launch control
interface RateLimitConfig {
  requests: number
  window: number // in seconds
  burst?: number // allow burst requests
  degrade?: boolean // enable graceful degradation
}

interface LaunchMode {
  isCanary: boolean
  trafficPercentage: number
  emergencyMode: boolean
}

// Rate limit configurations for different endpoints
const RATE_LIMITS: Record<string, RateLimitConfig> = {
  '/api/gpt-test': {
    requests: 60,
    window: 60,
    burst: 10,
    degrade: true
  },
  '/api/run': {
    requests: 60,
    window: 60,
    burst: 5,
    degrade: true
  },
  '/api/analytics': {
    requests: 120,
    window: 60,
    burst: 20
  },
  '/api/export': {
    requests: 10,
    window: 300, // 5 minutes
    burst: 2,
    degrade: true
  },
  '/api/webhooks': {
    requests: 100,
    window: 60,
    burst: 15
  }
}

// Launch mode configuration
let launchMode: LaunchMode = {
  isCanary: false,
  trafficPercentage: 100,
  emergencyMode: false
}

// Redis client for rate limiting
let redis: Redis | null = null

// Initialize Redis connection
function getRedisClient(): Redis {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  }
  return redis
}

// Generate rate limit key
function getRateLimitKey(pathname: string, identifier: string): string {
  return `rate_limit:${pathname}:${identifier}`
}

// Check if request should be rate limited
async function checkRateLimit(
  pathname: string,
  identifier: string,
  config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const redis = getRedisClient()
  const key = getRateLimitKey(pathname, identifier)
  
  const now = Math.floor(Date.now() / 1000)
  const windowStart = now - config.window
  
  try {
    // Get current request count
    const requests = await redis.zcount(key, windowStart, '+inf')
    
    // Check if within burst limit
    const burstLimit = config.burst || 0
    const isBurstAllowed = requests < burstLimit
    
    // Check if within regular limit
    const isWithinLimit = requests < config.requests
    
    const allowed = isBurstAllowed || isWithinLimit
    const remaining = Math.max(0, config.requests - requests)
    
    // Add current request to tracking
    if (allowed) {
      await redis.zadd(key, { score: now, member: `${now}-${Math.random()}` })
      await redis.expire(key, config.window)
    }
    
    return {
      allowed,
      remaining,
      resetTime: now + config.window
    }
  } catch (error) {
    console.error('Rate limit check failed:', error)
    // Fail open in case of Redis issues
    return { allowed: true, remaining: config.requests, resetTime: now + config.window }
  }
}

// Graceful degradation response
function createDegradedResponse(request: NextRequest, reason: string): NextResponse {
  const isApiRequest = request.nextUrl.pathname.startsWith('/api/')
  
  if (isApiRequest) {
    return NextResponse.json(
      {
        error: 'Service temporarily degraded',
        message: reason,
        retryAfter: 60,
        degraded: true
      },
      { status: 503 }
    )
  }
  
  // For non-API requests, return a degraded page
  return NextResponse.rewrite(new URL('/degraded', request.url))
}

// Set launch mode
export function setLaunchMode(mode: Partial<LaunchMode>) {
  launchMode = { ...launchMode, ...mode }
}

// Get current launch mode
export function getLaunchMode(): LaunchMode {
  return launchMode
}

// Main rate limiting middleware
export async function rateLimit(
  request: NextRequest,
  pathname: string = request.nextUrl.pathname
): Promise<{ allowed: boolean; response?: NextResponse }> {
  // Skip rate limiting for certain paths
  if (pathname.startsWith('/_next/') || 
      pathname.startsWith('/favicon') || 
      pathname === '/health') {
    return { allowed: true }
  }
  
  // Get rate limit configuration
  const config = RATE_LIMITS[pathname]
  if (!config) {
    return { allowed: true }
  }
  
  // Get client identifier
  const identifier = getClientIdentifier(request)
  
  // Check rate limit
  const rateLimitResult = await checkRateLimit(pathname, identifier, config)
  
  if (!rateLimitResult.allowed) {
    // Add rate limit headers
    const response = NextResponse.json(
      {
        error: 'Rate limit exceeded',
        retryAfter: rateLimitResult.resetTime - Math.floor(Date.now() / 1000),
        remaining: rateLimitResult.remaining
      },
      { status: 429 }
    )
    
    response.headers.set('X-RateLimit-Limit', config.requests.toString())
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
    response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString())
    response.headers.set('Retry-After', (rateLimitResult.resetTime - Math.floor(Date.now() / 1000)).toString())
    
    return { allowed: false, response }
  }
  
  // Check for graceful degradation during launch
  if (launchMode.emergencyMode && config.degrade) {
    const degradeProbability = 0.1 // 10% chance of degradation during emergency
    if (Math.random() < degradeProbability) {
      const degradedResponse = createDegradedResponse(
        request,
        'Service degraded during launch maintenance'
      )
      return { allowed: false, response: degradedResponse }
    }
  }
  
  // Add rate limit headers for successful requests
  return { allowed: true }
}

// Get client identifier (IP, user ID, or organization ID)
function getClientIdentifier(request: NextRequest): string {
  // Try to get organization ID from headers or query params
  const orgId = request.headers.get('x-organization-id') || 
                request.nextUrl.searchParams.get('orgId')
  
  if (orgId) {
    return `org:${orgId}`
  }
  
  // Try to get user ID from headers
  const userId = request.headers.get('x-user-id')
  if (userId) {
    return `user:${userId}`
  }
  
  // Fall back to IP address
  const ip = request.ip || 
             request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') ||
             'unknown'
  
  return `ip:${ip}`
}

// Enhanced rate limiting middleware with launch control
export async function enhancedRateLimit(request: NextRequest): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname
  
  // Apply rate limiting
  const rateLimitResult = await rateLimit(request, pathname)
  
  if (!rateLimitResult.allowed) {
    return rateLimitResult.response!
  }
  
  // Check launch mode restrictions
  if (launchMode.isCanary && launchMode.trafficPercentage < 100) {
    const shouldAllow = Math.random() * 100 < launchMode.trafficPercentage
    
    if (!shouldAllow) {
      return NextResponse.json(
        {
          error: 'Service temporarily unavailable',
          message: 'Canary deployment in progress',
          retryAfter: 300
        },
        { status: 503 }
      )
    }
  }
  
  // Add launch mode headers
  const response = NextResponse.next()
  response.headers.set('X-Launch-Mode', launchMode.isCanary ? 'canary' : 'stable')
  response.headers.set('X-Traffic-Percentage', launchMode.trafficPercentage.toString())
  
  if (launchMode.emergencyMode) {
    response.headers.set('X-Emergency-Mode', 'true')
  }
  
  return null // Continue with normal processing
}

// Cleanup function for Redis connections
export async function cleanupRateLimit(): Promise<void> {
  if (redis) {
    await redis.quit()
    redis = null
  }
}

// Export default middleware
export default async function middleware(request: NextRequest): Promise<NextResponse | Response> {
  // Apply enhanced rate limiting
  const rateLimitResponse = await enhancedRateLimit(request)
  if (rateLimitResponse) {
    return rateLimitResponse
  }
  
  // Continue with normal request processing
  return NextResponse.next()
}

// Configure which paths to run middleware on
export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
