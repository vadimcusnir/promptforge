import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { wafMiddleware } from '@/lib/security/waf-middleware'

export async function middleware(request: NextRequest) {
  // Process request through WAF first
  const wafResponse = await wafMiddleware.processRequest(request)
  if (wafResponse) {
    return wafResponse
  }

  // Prevent API routes from being accessed during build time
  if (process.env.NODE_ENV === 'production' && request.nextUrl.pathname.startsWith('/api/')) {
    // Add cache control headers to prevent static generation
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
