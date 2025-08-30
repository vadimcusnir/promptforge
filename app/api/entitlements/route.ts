import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getEffectiveEntitlements, validateOrgMembership } from "@/lib/billing/entitlements"
import { requireAuth } from "@/lib/auth/server-auth"
import { createRateLimit, getClientIdentifier, RATE_LIMITS } from "@/lib/rate-limit"

// Query parameters schema
const entitlementsQuerySchema = z.object({
  orgId: z.string().uuid('Invalid organization ID')
})

// Rate limiting for entitlements requests
const entitlementsLimiter = createRateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
  message: 'Rate limit exceeded. Please try again later.'
})

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimitResult = entitlementsLimiter(clientId)
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    // Require authentication
    const user = await requireAuth(request)
    
    // Get and validate query parameters
    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('orgId')
    
    if (!orgId) {
      return NextResponse.json(
        { error: 'orgId query parameter is required' },
        { status: 400 }
      )
    }
    
    // Validate query parameters
    const { orgId: validatedOrgId } = entitlementsQuerySchema.parse({ orgId })
    
    // Validate organization membership - user must be a member of the organization
    const hasAccess = await validateOrgMembership(user.id, validatedOrgId)
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied to organization' },
        { status: 403 }
      )
    }
    
    // Get effective entitlements for the organization
    const entitlements = await getEffectiveEntitlements(validatedOrgId)
    
    console.log(`✅ Entitlements retrieved for org ${validatedOrgId} by user ${user.id}: ${Object.keys(entitlements).length} flags`)
    
    return NextResponse.json({
      success: true,
      orgId: validatedOrgId,
      entitlements,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Entitlements API error:', error)
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to retrieve entitlements' },
      { status: 500 }
    )
  }
}
