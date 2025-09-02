import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const auditTrail = new Map<string, { timestamp: number; action: string; ip: string; hash: string }>()

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded ? forwarded.split(",")[0] : request.ip || "unknown"
  return ip
}

function isRateLimited(key: string, limit = 100, windowMs = 60000): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return false
  }

  if (record.count >= limit) {
    return true
  }

  record.count++
  return false
}

function createAuditHash(data: string): string {
  // Simple hash for audit trail - in production use crypto.subtle
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return hash.toString(16)
}

function logAuditEvent(request: NextRequest, action: string) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.ip || "unknown"
  const timestamp = Date.now()
  const auditData = `${timestamp}-${action}-${ip}-${request.nextUrl.pathname}`
  const hash = createAuditHash(auditData)

  auditTrail.set(`${timestamp}-${Math.random()}`, {
    timestamp,
    action,
    ip,
    hash,
  })
}

async function checkAdminAccess(request: NextRequest): Promise<boolean> {
  try {
    // Get session from cookie
    const sessionCookie = request.cookies.get("sb-access-token")
    if (!sessionCookie) return false

    // In a real implementation, verify the session with Supabase
    // For now, we'll simulate admin check
    // This should be replaced with actual Supabase session verification
    return true // Placeholder - implement actual auth check
  } catch (error) {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const comingSoonEnabled = false
  const pathname = request.nextUrl.pathname
  const rateLimitKey = getRateLimitKey(request)

  const response = NextResponse.next()

  // Security headers
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

  if (pathname.startsWith("/api/")) {
    // Rate limiting for API routes
    if (isRateLimited(rateLimitKey, 100, 60000)) {
      logAuditEvent(request, "rate_limit_exceeded")
      return new NextResponse("Rate limit exceeded", { status: 429 })
    }

    // Audit log API access
    logAuditEvent(request, `api_access_${pathname}`)

    // Additional API security headers
    response.headers.set("X-API-Version", "v1")
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")

    return response
  }

  if (pathname.startsWith("/admin")) {
    const hasAdminAccess = await checkAdminAccess(request)

    if (!hasAdminAccess) {
      logAuditEvent(request, "admin_access_denied")
      return NextResponse.redirect(new URL("/login?redirect=/admin", request.url))
    }

    logAuditEvent(request, `admin_access_${pathname}`)
    return response
  }

  if (pathname.includes("/wp-admin") || pathname.includes("/.env")) {
    logAuditEvent(request, "honeypot_triggered")
    return new NextResponse("Not Found", { status: 404 })
  }

  // Allow access to coming soon page, thank you page, and static assets
  if (
    pathname === "/coming-soon" ||
    pathname === "/thankyou" ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon")
  ) {
    return response
  }

  // If coming soon is enabled, redirect all other routes to coming soon page
  if (comingSoonEnabled) {
    return NextResponse.redirect(new URL("/coming-soon", request.url))
  }

  logAuditEvent(request, `page_view_${pathname}`)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
