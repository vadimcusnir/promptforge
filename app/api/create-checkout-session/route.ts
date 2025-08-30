import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { requireAuth } from "@/lib/auth/server-auth"
import { stripe } from "@/lib/billing/stripe"
import { STRIPE_PRICE_IDS, PLAN_CODES, type PlanCode, getPlanMetadata } from "@/lib/billing/plans"
import { RATE_LIMITS } from "@/lib/rate-limit"

// Request validation schema
const checkoutRequestSchema = z.object({
  planId: z.enum([PLAN_CODES.PILOT, PLAN_CODES.PRO, PLAN_CODES.ENTERPRISE]),
  isAnnual: z.boolean(),
  orgId: z.string().uuid().optional()
})

// Rate limiting for checkout requests
const checkoutLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute
  message: 'Rate limit exceeded. Please try again later.'
})

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = checkoutLimiter.check(request)
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: rateLimitResult.message || 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    // Require authentication
    const user = await requireAuth(request)
    
    // Parse and validate request body
    const body = await request.json()
    const { planId, isAnnual, orgId } = checkoutRequestSchema.parse(body)

    // Get plan metadata
    const planMetadata = getPlanMetadata(planId)
    
    // Skip checkout for pilot plan (free)
    if (planId === PLAN_CODES.PILOT) {
      return NextResponse.json({
        success: true,
        message: 'Pilot plan is free - no checkout required',
        planId,
        isAnnual,
        userId: user.id
      })
    }

    // Get price ID from environment variables (no fallbacks)
    const priceIds = STRIPE_PRICE_IDS[planId]
    const priceId = isAnnual ? priceIds.annual : priceIds.monthly
    
    if (!priceId) {
      return NextResponse.json(
        { error: `Price ID not configured for ${planId} ${isAnnual ? 'annual' : 'monthly'} plan` },
        { status: 500 }
      )
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/thankyou?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        orgId: orgId || user.id, // Use provided orgId or default to user.id
        planId,
        billingCycle: isAnnual ? 'annual' : 'monthly',
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          orgId: orgId || user.id,
          planId,
          billingCycle: isAnnual ? 'annual' : 'monthly',
        }
      },
      customer_email: user.email,
      allow_promotion_codes: true,
    })

    console.log(`✅ Checkout session created for user ${user.id}, plan: ${planId}`)

    return NextResponse.json({ 
      success: true,
      sessionId: session.id, 
      url: session.url,
      planId,
      isAnnual,
      userId: user.id
    })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
