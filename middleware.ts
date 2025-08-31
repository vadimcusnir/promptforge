import { NextRequest, NextResponse } from 'next/server';
import redirects from './redirects.json';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for redirects
  const redirect = redirects.redirects.find(r => r.source === pathname);
  
  if (redirect) {
    // Log legacy redirect hit for analytics
    console.log(`[LEGACY_REDIRECT] ${pathname} -> ${redirect.destination} (${redirect.statusCode})`);
    
    // Create redirect response
    const response = NextResponse.redirect(
      new URL(redirect.destination, request.url),
      { status: redirect.statusCode }
    );
    
    // Add custom header for tracking
    response.headers.set('X-Redirect-Source', pathname);
    response.headers.set('X-Redirect-Type', 'legacy');
    
    return response;
  }
  
  // Continue with normal request processing
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};