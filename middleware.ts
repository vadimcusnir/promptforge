import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Handle /collaborate redirect
  if (request.nextUrl.pathname === '/collaborate') {
    // Track legacy redirect hit for analytics
    console.log('legacy_redirect_hit: /collaborate -> /docs/api')
    
    // 308 Permanent Redirect to /docs/api
    return NextResponse.redirect(new URL('/docs/api', request.url), 308)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/collaborate']
}
