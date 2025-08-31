import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession, STRIPE_PLANS } from '@/lib/stripe'
import { z } from 'zod'

const CheckoutSchema = z.object({
  planType: z.enum(['CREATOR', 'PRO', 'ENTERPRISE']),
  customerId: z.string().optional(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { planType, customerId, successUrl, cancelUrl } = CheckoutSchema.parse(body)

    const plan = STRIPE_PLANS[planType]
    if (!plan.priceId) {
      return NextResponse.json(
        { error: 'Plan not available for checkout' },
        { status: 400 }
      )
    }

    const session = await createCheckoutSession(
      plan.priceId,
      customerId,
      successUrl,
      cancelUrl
    )

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }

    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
