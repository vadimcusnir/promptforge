import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { wafMiddleware } from '@/lib/security/waf-middleware'
import { redirectTelemetry } from '@/lib/redirect-telemetry-edge'

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

export async function middleware(request: NextRequest) {
  // Process request through WAF first
  const wafResponse = await wafMiddleware.processRequest(request)
  if (wafResponse) {
    return wafResponse
  }

  // Handle legacy module slug redirects
  const pathname = request.nextUrl.pathname
  
  console.log('Middleware processing:', pathname)
  
  // Check for module-related paths that might need redirects
  if (pathname.startsWith('/modules/') || pathname.startsWith('/generator?module=')) {
    const pathSegments = pathname.split('/')
    const lastSegment = pathSegments[pathSegments.length - 1]
    
    // Extract slug from URL (remove query params)
    const slug = lastSegment.split('?')[0]
    
    console.log('Checking slug:', slug, 'in mappings:', Object.keys(LEGACY_SLUG_MAPPINGS))
    
    // Check if this is a legacy slug that needs redirecting
    if (LEGACY_SLUG_MAPPINGS[slug]) {
      console.log('Found legacy slug, redirecting:', slug, '->', LEGACY_SLUG_MAPPINGS[slug])
      const newSlug = LEGACY_SLUG_MAPPINGS[slug]
      const newUrl = new URL(request.url)
      
      // Replace the legacy slug with the new slug
      if (pathname.startsWith('/modules/')) {
        newUrl.pathname = pathname.replace(`/modules/${slug}`, `/modules/${newSlug}`)
      } else if (pathname.startsWith('/generator')) {
        newUrl.searchParams.set('module', newSlug)
      }
      
      // Track redirect for telemetry
      try {
        redirectTelemetry.trackRedirect(
          slug,
          request.headers.get('user-agent') || undefined,
          request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined
        );
      } catch (error) {
        console.error('Failed to track redirect telemetry:', error);
      }
      
      // Return 308 permanent redirect
      return NextResponse.redirect(newUrl, { status: 308 })
    }
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
