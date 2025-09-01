import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// CSP Configuration - strict policy as per specification
const CSP_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'strict-dynamic' 'nonce-<nonce>' https://js.stripe.com",
  "connect-src 'self' https://*.supabase.co https://api.stripe.com",
  "img-src 'self' data: blob:",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'"
].join('; ')

// Honeypot endpoints that should return 404 and log access
const HONEYPOT_ENDPOINTS = [
  '/.env',
  '/.env.local',
  '/.env.production',
  '/api/admin/users',
  '/api/debug/dump',
  '/api/internal/status',
  '/admin',
  '/wp-admin',
  '/phpmyadmin',
  '/.git',
  '/config.php',
  '/backup.sql'
]

// WAF patterns for common attacks
const WAF_PATTERNS = {
  sqlInjection: [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
    /(\b(OR|AND)\s+['"]\s*=\s*['"])/i,
    /(\bUNION\s+SELECT\b)/i,
    /(\bDROP\s+TABLE\b)/i
  ],
  xss: [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /<object[^>]*>.*?<\/object>/gi,
    /<embed[^>]*>.*?<\/embed>/gi
  ],
  pathTraversal: [
    /\.\.\//g,
    /\.\.\\/g,
    /%2e%2e%2f/gi,
    /%2e%2e%5c/gi,
    /\.\.%2f/gi,
    /\.\.%5c/gi
  ],
  promptInjection: [
    /ignore\s+(previous|above|all)\s+(instructions?|prompts?)/gi,
    /forget\s+(everything|all|previous)/gi,
    /you\s+are\s+now\s+(a\s+)?(different|new)/gi,
    /pretend\s+to\s+be/gi,
    /act\s+as\s+if/gi,
    /roleplay\s+as/gi,
    /system\s*:\s*override/gi,
    /admin\s*:\s*bypass/gi
  ]
}

// API request schemas for validation
const API_SCHEMAS = {
  '/api/run': z.object({
    module_id: z.string().regex(/^M\d{2}$/),
    domain: z.string(),
    output_format: z.string(),
    inputs: z.record(z.any()),
    custom: z.record(z.any()).optional()
  }),
  '/api/export': z.object({
    run_id: z.string().uuid(),
    format: z.enum(['txt', 'md', 'pdf', 'json', 'zip']),
    include_telemetry: z.boolean().optional()
  }),
  '/api/gpt-test': z.object({
    prompt: z.string().min(1).max(2000),
    model: z.string().optional(),
    temperature: z.number().min(0).max(2).optional()
  })
}

// Generate nonce for CSP
function generateNonce(): string {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('base64')
}

// Apply CSP headers
export function applyCSPHeaders(request: NextRequest): NextResponse | null {
  const nonce = generateNonce()
  const cspWithNonce = CSP_POLICY.replace('<nonce>', nonce)
  
  const response = NextResponse.next()
  
  // Set security headers
  response.headers.set('Content-Security-Policy', cspWithNonce)
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  
  // Add nonce to request for use in components
  request.headers.set('x-nonce', nonce)
  
  return null // Continue processing
}

// Honeypot guard
export function honeypotGuard(request: NextRequest): NextResponse | null {
  const pathname = request.nextUrl.pathname
  
  // Check if path matches honeypot patterns
  const isHoneypot = HONEYPOT_ENDPOINTS.some(endpoint => 
    pathname === endpoint || pathname.startsWith(endpoint)
  )
  
  if (isHoneypot) {
    // Log honeypot access attempt
    logSecurityEvent('honeypot_access', {
      path: pathname,
      ip: getClientIP(request),
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    })
    
    // Return 404 to hide the endpoint
    return NextResponse.json(
      { error: 'NOT_FOUND', message: 'Endpoint not found' },
      { status: 404 }
    )
  }
  
  return null // Continue processing
}

// WAF guard
export function wafGuard(request: NextRequest): NextResponse | null {
  const pathname = request.nextUrl.pathname
  const url = request.nextUrl.toString()
  const userAgent = request.headers.get('user-agent') || ''
  
  // Check URL for malicious patterns
  const maliciousPatterns = [
    ...WAF_PATTERNS.sqlInjection,
    ...WAF_PATTERNS.xss,
    ...WAF_PATTERNS.pathTraversal,
    ...WAF_PATTERNS.promptInjection
  ]
  
  const fullRequest = `${pathname}${url}${userAgent}`
  
  for (const pattern of maliciousPatterns) {
    if (pattern.test(fullRequest)) {
      // Log WAF block
      logSecurityEvent('waf_blocked', {
        path: pathname,
        pattern: pattern.toString(),
        ip: getClientIP(request),
        userAgent,
        timestamp: new Date().toISOString()
      })
      
      return NextResponse.json(
        { error: 'FORBIDDEN', message: 'Request blocked by security policy' },
        { status: 403 }
      )
    }
  }
  
  return null // Continue processing
}

// Schema validation for API requests
export async function schemaValidate(request: NextRequest): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname
  
  // Get schema for this endpoint
  const schema = API_SCHEMAS[pathname as keyof typeof API_SCHEMAS]
  if (!schema) {
    return null // No schema defined, continue
  }
  
  try {
    // Parse request body
    const body = await request.text()
    if (!body) {
      return NextResponse.json(
        { error: 'BAD_REQUEST', message: 'Request body required' },
        { status: 400 }
      )
    }
    
    const data = JSON.parse(body)
    
    // Validate against schema
    const result = schema.safeParse(data)
    
    if (!result.success) {
      // Log validation failure
      logSecurityEvent('schema_validation_failed', {
        path: pathname,
        errors: result.error.errors,
        ip: getClientIP(request),
        timestamp: new Date().toISOString()
      })
      
      return NextResponse.json(
        { 
          error: 'VALIDATION_ERROR', 
          message: 'Request validation failed',
          details: result.error.errors
        },
        { status: 400 }
      )
    }
    
    return null // Validation passed, continue
  } catch (error) {
    // Log parsing error
    logSecurityEvent('request_parsing_failed', {
      path: pathname,
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: getClientIP(request),
      timestamp: new Date().toISOString()
    })
    
    return NextResponse.json(
      { error: 'BAD_REQUEST', message: 'Invalid request format' },
      { status: 400 }
    )
  }
}

// Get client IP address
function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for') || 
         request.headers.get('x-real-ip') || 
         'unknown'
}

// Log security events
function logSecurityEvent(eventType: string, data: Record<string, any>) {
  // In production, this would send to your security monitoring system
  // For now, we'll log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[SECURITY] ${eventType}:`, data)
  }
  
  // TODO: Integrate with audit trail system
  // This should write to the audits table with tamper-evident hashing
}
