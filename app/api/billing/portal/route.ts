import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerId, returnUrl } = body

    if (!customerId) {
      return NextResponse.json({
        success: false,
        error: 'MISSING_CUSTOMER_ID',
        message: 'Customer ID is required'
      }, { status: 400 })
    }

    // Create Stripe Customer Portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/billing`,
    })

    return NextResponse.json({
      success: true,
      portal_url: session.url
    })

  } catch (error) {
    console.error('Billing portal error:', error)
    return NextResponse.json({
      success: false,
      error: 'PORTAL_CREATION_FAILED',
      message: 'Failed to create billing portal session'
    }, { status: 500 })
  }
}