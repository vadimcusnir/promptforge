import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

// Legacy slug mappings for module redirects
const LEGACY_SLUG_MAPPINGS: Record<string, string> = {
  'risk-and-trust-reversal': 'trust-reversal-protocol',
  'crisis-communication': 'crisis-communication-playbook',
  'social-media-calendar': 'social-content-grid',
  'content-calendar-optimizer': 'social-content-grid', // M14 fusion
  'landing-page-optimizer': 'landing-page-alchemist',
  'influencer-partnership-framework': 'influence-partnership-frame',
  'content-performance-analyzer': 'content-analytics-dashboard',
  'content-personalization-engine': 'momentum-campaign-builder',
  'database-design-optimizer': 'data-schema-optimizer',
  'microservices-architecture': 'microservices-grid',
  'security-architecture-framework': 'security-fortress-frame',
  'performance-optimization-engine': 'performance-engine',
  'container-orchestration-strategy': 'orchestration-matrix',
  'cloud-infrastructure-architect': 'cloud-infra-map',
  'sales-process-optimizer': 'sales-flow-architect',
  'sales-operations-framework': 'sales-flow-architect', // M31 fusion
  'sales-enablement-framework': 'enablement-frame',
  'sales-intelligence-framework': 'negotiation-dynamics',
  'quality-management-system': 'quality-system-map',
  'supply-chain-optimizer': 'supply-flow-optimizer',
  'change-management-framework': 'change-force-field',
  'executive-prompt-report': 'executive-prompt-dossier'
}

// Honeypot routes that should return 404 and log attempts
const HONEYPOT_ROUTES = [
  '/admin',
  '/.env',
  '/wp-admin',
  '/phpmyadmin',
  '/admin.php',
  '/administrator',
  '/.git',
  '/config',
  '/backup',
  '/test',
  '/debug',
  '/api/v1/admin',
  '/api/admin',
  '/api/debug'
]

// Injection patterns to detect and block
const INJECTION_PATTERNS = [
  // SQL Injection
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
  /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
  /(\b(OR|AND)\s+'.*?'\s*=\s*'.*?')/i,
  /(\b(OR|AND)\s+".*?"\s*=\s*".*?")/i,
  
  // XSS patterns
  /<script[^>]*>.*?<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<iframe[^>]*>.*?<\/iframe>/gi,
  /<object[^>]*>.*?<\/object>/gi,
  /<embed[^>]*>.*?<\/embed>/gi,
  
  // Path traversal
  /\.\.\//g,
  /\.\.\\/g,
  /%2e%2e%2f/gi,
  /%2e%2e%5c/gi,
  
  // Command injection
  /[;&|`$()]/,
  /\b(cat|ls|pwd|whoami|id|uname|ps|netstat|ifconfig)\b/i
]

// Generate nonce for CSP
function generateNonce(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
}

// Security headers configuration
function getSecurityHeaders(nonce: string) {
  return {
    // Content Security Policy
    'Content-Security-Policy': [
      "default-src 'self'",
      `script-src 'self' 'strict-dynamic' 'nonce-${nonce}'`,
      "connect-src 'self' https://api.stripe.com https://*.supabase.co https://*.supabase.io",
      "img-src 'self' data: blob: https://*.supabase.co https://*.supabase.io",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; '),
    
    // Additional security headers
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    
    // Rate limiting headers
    'X-RateLimit-Policy': 'strict'
  }
}

// Check for injection attempts
function detectInjection(input: string): boolean {
  return INJECTION_PATTERNS.some(pattern => pattern.test(input))
}

// Validate request schema
function validateRequestSchema(request: NextRequest): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  try {
    // Check URL parameters
    const url = new URL(request.url)
    const searchParams = url.searchParams
    
    for (const [key, value] of searchParams.entries()) {
      if (detectInjection(key) || detectInjection(value)) {
        errors.push(`Injection detected in URL parameter: ${key}`)
      }
    }
    
    // Check headers
    const headers = request.headers
    for (const [key, value] of headers.entries()) {
      if (detectInjection(key) || detectInjection(value)) {
        errors.push(`Injection detected in header: ${key}`)
      }
    }
    
    return { valid: errors.length === 0, errors }
  } catch (error) {
    return { valid: false, errors: ['Request validation failed'] }
  }
}

// Log security events
async function logSecurityEvent(
  event: string,
  details: Record<string, any>,
  request: NextRequest
) {
  try {
    const logData = {
      event,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      path: request.nextUrl.pathname,
      method: request.method,
      ...details
    }
    
    // In production, this would send to your audit system
    console.warn('[SECURITY]', logData)
    
    // Send to audit trail system
    try {
      const { auditTrail } = await import('@/lib/security/audit-trail')
      await auditTrail.logSecurityEvent({
        event_type: event as any,
        severity: details.severity || 'medium',
        details: logData
      }, request)
    } catch (auditError) {
      console.error('Failed to log to audit trail:', auditError)
    }
  } catch (error) {
    console.error('Failed to log security event:', error)
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Generate nonce for CSP
  const nonce = generateNonce()
  
  // 1. Honeypot detection - block and log suspicious routes
  if (HONEYPOT_ROUTES.some(route => pathname.startsWith(route))) {
    await logSecurityEvent('honeypot_access_attempt', {
      route: pathname,
      suspicious: true
    }, request)
    
    return new NextResponse('Not Found', { status: 404 })
  }
  
  // 2. Request validation - check for injection attempts
  const validation = validateRequestSchema(request)
  if (!validation.valid) {
    await logSecurityEvent('injection_attempt', {
      errors: validation.errors,
      blocked: true
    }, request)
    
    return new NextResponse('Bad Request', { status: 400 })
  }
  
  // 3. Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const rateLimitResult = await rateLimit(request, pathname)
    if (!rateLimitResult.allowed) {
      await logSecurityEvent('rate_limit_exceeded', {
        path: pathname,
        blocked: true
      }, request)
      return rateLimitResult.response!
    }
  }

  // 4. Handle legacy module slug redirects
  if (pathname.startsWith('/modules/') || pathname.startsWith('/generator?module=')) {
    const pathSegments = pathname.split('/')
    const lastSegment = pathSegments[pathSegments.length - 1]
    
    // Extract slug from URL (remove query params)
    const slug = lastSegment.split('?')[0]
    
    // Check if this is a legacy slug that needs redirecting
    if (LEGACY_SLUG_MAPPINGS[slug]) {
      const newSlug = LEGACY_SLUG_MAPPINGS[slug]
      const newUrl = new URL(request.url)
      
      // Replace the legacy slug with the new slug
      if (pathname.startsWith('/modules/')) {
        newUrl.pathname = pathname.replace(`/modules/${slug}`, `/modules/${newSlug}`)
      } else if (pathname.startsWith('/generator')) {
        newUrl.searchParams.set('module', newSlug)
      }
      
      // Log legacy redirect event for telemetry
      await logLegacyRedirectEvent(slug, newSlug, request)
      
      // Return 308 permanent redirect
      return NextResponse.redirect(newUrl, { status: 308 })
    }
  }

  // 5. Create response with security headers
  const response = NextResponse.next()
  
  // Apply security headers
  const securityHeaders = getSecurityHeaders(nonce)
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  // Add nonce to response headers for client-side use
  response.headers.set('X-Nonce', nonce)
  
  // 6. Prevent API routes from being accessed during build time
  if (process.env.NODE_ENV === 'production' && request.nextUrl.pathname.startsWith('/api/')) {
    // Add cache control headers to prevent static generation
    response.headers.set('Cache-Control', 'no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }

  return response
}

// Log legacy redirect events for telemetry
async function logLegacyRedirectEvent(oldSlug: string, newSlug: string, request: NextRequest) {
  try {
    // This would integrate with your telemetry system
    // For now, we'll just log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Legacy redirect: ${oldSlug} → ${newSlug}`, {
        userAgent: request.headers.get('user-agent'),
        ip: request.headers.get('x-forwarded-for') || 'unknown'
      })
    }
  } catch (error) {
    // Fail silently for telemetry
    console.error('Failed to log legacy redirect event:', error)
  }
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
