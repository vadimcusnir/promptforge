import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { wafMiddleware } from '@/lib/security/waf-middleware'
import { redirectTelemetry } from '@/lib/redirect-telemetry-edge'

// Legacy slug mappings for module redirects (legacy slug -> module ID)
const LEGACY_SLUG_MAPPINGS: Record<string, string> = {
  'risk-and-trust-reversal': 'M07', // TRUST REVERSAL PROTOCOL™
  'crisis-communication': 'M10', // CRISIS COMMUNICATION PLAYBOOK™
  'social-media-calendar': 'M14', // SOCIAL CONTENT GRID™
  'content-calendar-optimizer': 'M14', // SOCIAL CONTENT GRID™ (fusion)
  'landing-page-optimizer': 'M15', // LANDING PAGE ALCHEMIST™
  'influencer-partnership-framework': 'M17', // INFLUENCE PARTNERSHIP FRAME™
  'content-performance-analyzer': 'M18', // CONTENT ANALYTICS DASHBOARD™
  'content-personalization-engine': 'M19', // AUDIENCE SEGMENT PERSONALIZER™
  'database-design-optimizer': 'M21', // DATA SCHEMA OPTIMIZER™
  'microservices-architecture': 'M22', // MICROSERVICES GRID™
  'security-architecture-framework': 'M23', // SECURITY FORTRESS FRAME™
  'performance-optimization-engine': 'M24', // PERFORMANCE ENGINE™
  'container-orchestration-strategy': 'M25', // ORCHESTRATION MATRIX™
  'cloud-infrastructure-architect': 'M26', // CLOUD INFRA MAP™
  'sales-process-optimizer': 'M31', // SALES FLOW ARCHITECT™
  'sales-operations-framework': 'M31', // SALES FLOW ARCHITECT™ (fusion)
  'sales-enablement-framework': 'M32', // ENABLEMENT FRAME™
  'sales-intelligence-framework': 'M33', // NEGOTIATION DYNAMICS™
  'quality-management-system': 'M41', // QUALITY SYSTEM MAP™
  'supply-chain-optimizer': 'M42', // SUPPLY FLOW OPTIMIZER™
  'change-management-framework': 'M43', // CHANGE FORCE FIELD™
  'executive-prompt-report': 'M50' // EXECUTIVE PROMPT DOSSIER™
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
      const moduleId = LEGACY_SLUG_MAPPINGS[slug]
      const newUrl = new URL(request.url)
      
      // Replace the legacy slug with the module ID
      if (pathname.startsWith('/modules/')) {
        newUrl.pathname = pathname.replace(`/modules/${slug}`, `/modules/${moduleId}`)
      } else if (pathname.startsWith('/generator')) {
        newUrl.searchParams.set('module', moduleId)
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
