import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { config, isServiceAvailable } from "@/lib/config"
import { createRateLimit, getClientIdentifier, RATE_LIMITS } from "@/lib/rate-limit"

// Request schema validation
const portalRequestSchema = z.object({
  orgId: z.string().uuid('Invalid organization ID'),
  returnUrl: z.string().url('Invalid return URL').optional()
})

// Rate limiting for portal requests
const portalLimiter = createRateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5, // 5 requests per minute
  message: 'Rate limit exceeded. Please try again later.'
})

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimitResult = portalLimiter(clientId)
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    // Check if Stripe is configured for P0 launch
    if (!isServiceAvailable('hasStripe')) {
      return NextResponse.json(
        { 
          error: 'Billing portal not available during launch phase',
          code: 'LAUNCH_MODE'
        },
        { status: 503 }
      )
    }

    // Import Stripe only when needed
    const { stripe } = await import("@/lib/billing/stripe")
    const { validateOrgMembership, getCurrentSubscription } = await import("@/lib/billing/entitlements")

    // Parse and validate request body
    const body = await request.json()
    const { orgId, returnUrl } = portalRequestSchema.parse(body)
    
    // Get user ID from request (this would come from your auth middleware)
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Validate organization membership
    const hasAccess = await validateOrgMembership(userId, orgId)
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied to organization' },
        { status: 403 }
      )
    }
    
    // Get current subscription for the organization
    const subscription = await getCurrentSubscription(orgId)
    if (!subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }
    
    // Get customer ID from subscription
    const customerId = subscription.stripe_customer_id
    
    // Create customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${config.baseUrl}/billing`,
      configuration: config.stripe.portalConfigId || undefined
    })
    
    console.log(`✅ Customer portal session created for org ${orgId}`)
    
    return NextResponse.json({
      success: true,
      url: session.url,
      orgId
    })
    
  } catch (error) {
    console.error('Customer portal API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create customer portal session' },
      { status: 500 }
    )
  }
}
