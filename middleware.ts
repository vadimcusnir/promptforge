import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
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
  matcher: '/api/:path*',
}
