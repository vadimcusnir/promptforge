import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
})

export async function POST(request: NextRequest) {
  try {
    const { planId, isAnnual, userId } = await request.json()

    // Validate plan
    const plans = {
      creator: {
        monthly: { 
          price: process.env.STRIPE_CREATOR_MONTHLY_PRICE_ID || "price_creator_monthly", 
          amount: 1900 
        }, // $19.00
        annual: { 
          price: process.env.STRIPE_CREATOR_ANNUAL_PRICE_ID || "price_creator_annual", 
          amount: 19000 
        }, // $190.00
      },
      pro: {
        monthly: { 
          price: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "price_pro_monthly", 
          amount: 4900 
        }, // $49.00
        annual: { 
          price: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || "price_pro_annual", 
          amount: 49000 
        }, // $490.00
      },
      enterprise: {
        monthly: { 
          price: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID || "price_enterprise_monthly", 
          amount: 29900 
        }, // $299.00
        annual: { 
          price: process.env.STRIPE_ENTERPRISE_ANNUAL_PRICE_ID || "price_enterprise_annual", 
          amount: 299000 
        }, // $2990.00
      },
    }

    const plan = plans[planId as keyof typeof plans]
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const billingCycle = isAnnual ? "annual" : "monthly"
    const priceData = plan[billingCycle as keyof typeof plan]

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
              description: `${billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1)} subscription`,
            },
            unit_amount: priceData.amount,
            recurring: {
              interval: billingCycle === "annual" ? "year" : "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?canceled=true`,
      metadata: {
        userId: userId || "anonymous",
        planId,
        billingCycle,
      },
      customer_email: userId ? undefined : undefined, // Will be collected in checkout if no user
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
