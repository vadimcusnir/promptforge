import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createRateLimit, RATE_LIMITS, getClientIdentifier } from "@/lib/rate-limit"

export function middleware(request: NextRequest) {
  const comingSoonEnabled = process.env.NEXT_PUBLIC_COMING_SOON === "true"
  const pathname = request.nextUrl.pathname

  // Apply rate limiting to sensitive routes
  if (pathname.startsWith("/api/")) {
    try {
      const clientId = getClientIdentifier(request);
      
      // Apply different rate limits based on route type
      if (pathname.startsWith("/api/gpt-editor") || pathname.startsWith("/api/gpt-test")) {
        const rateLimit = createRateLimit(RATE_LIMITS.AI_OPERATIONS);
        rateLimit(clientId);
      } else if (pathname.startsWith("/api/run") || pathname.startsWith("/api/export")) {
        const rateLimit = createRateLimit(RATE_LIMITS.AI_OPERATIONS);
        rateLimit(clientId);
      } else if (pathname.startsWith("/api/auth") || pathname.startsWith("/api/login")) {
        const rateLimit = createRateLimit(RATE_LIMITS.AUTH_ATTEMPTS);
        rateLimit(clientId);
      } else {
        // General API rate limiting
        const rateLimit = createRateLimit(RATE_LIMITS.API_GENERAL);
        rateLimit(clientId);
      }
    } catch (error) {
      // Rate limit exceeded
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Rate limit exceeded' },
        { status: 429 }
      );
    }
  }

  // Protect dashboard and export routes - redirect to login if not authenticated
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/export")) {
    // Check for auth token in cookies or headers
    const authToken = request.cookies.get('auth-token')?.value || 
                     request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!authToken) {
      // Redirect to login page
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Allow access to coming soon page, thank you page, API routes, and static assets
  if (
    pathname === "/coming-soon" ||
    pathname === "/thankyou" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/og/") ||
    pathname.startsWith("/public/") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg") ||
    pathname.endsWith(".gif") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".webp") ||
    pathname.endsWith(".css") ||
    pathname.endsWith(".js") ||
    pathname.endsWith(".woff") ||
    pathname.endsWith(".woff2") ||
    pathname.endsWith(".ttf") ||
    pathname.endsWith(".eot")
  ) {
    const response = NextResponse.next()
    
    // Add security headers to all responses
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')
    response.headers.set('X-Download-Options', 'noopen')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    
    return response
  }

  // If coming soon is enabled, redirect all other routes to coming soon page
  if (comingSoonEnabled) {
    const response = NextResponse.redirect(new URL("/coming-soon", request.url))
    
    // Add security headers to redirect responses
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')
    response.headers.set('X-Download-Options', 'noopen')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    
    return response
  }

  const response = NextResponse.next()
  
  // Add security headers to all other responses
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')
  response.headers.set('X-Download-Options', 'noopen')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
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
