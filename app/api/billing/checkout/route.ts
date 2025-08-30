import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { config, isServiceAvailable } from "@/lib/config"
import { createRateLimit, getClientIdentifier, RATE_LIMITS } from "@/lib/rate-limit"

// Request schema validation
const checkoutRequestSchema = z.object({
  priceId: z.string().min(1, 'Price ID is required'),
  orgId: z.string().uuid('Invalid organization ID'),
  successUrl: z.string().url('Invalid success URL').optional(),
  cancelUrl: z.string().url('Invalid cancel URL').optional()
})

// Rate limiting for checkout requests
const checkoutLimiter = createRateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute
  message: 'Rate limit exceeded. Please try again later.'
})

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimitResult = checkoutLimiter(clientId)
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
          error: 'Billing checkout not available during launch phase',
          code: 'LAUNCH_MODE'
        },
        { status: 503 }
      )
    }

    // Import Stripe only when needed
    const { stripe } = await import("@/lib/billing/stripe")

    // Parse and validate request body
    const body = await request.json()
    const { priceId, orgId, successUrl, cancelUrl } = checkoutRequestSchema.parse(body)
    
    // Get user ID from request (this would come from your auth middleware)
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${config.baseUrl}/thankyou?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${config.baseUrl}/pricing`,
      metadata: {
        org_id: orgId,
        user_id: userId
      },
      subscription_data: {
        metadata: {
          org_id: orgId,
          user_id: userId
        }
      }
    })
    
    console.log(`✅ Checkout session created for org ${orgId}`)
    
    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      orgId
    })
    
  } catch (error) {
    console.error('Checkout API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
} 
