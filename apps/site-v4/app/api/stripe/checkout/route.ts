import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getPackById } from "@/lib/marketplace-data"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const { packId, priceId } = await request.json()

    const pack = getPackById(packId)
    if (!pack) {
      return NextResponse.json({ error: "Pack not found" }, { status: 404 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: pack.name,
              description: pack.description,
              images: [`${process.env.NEXT_PUBLIC_BASE_URL}/api/og/pack/${pack.id}`],
              metadata: {
                packId: pack.id,
                modules: pack.modules.join(","),
                category: pack.category,
              },
            },
            unit_amount: pack.price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/shop/${packId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/shop/${packId}`,
      metadata: {
        packId: pack.id,
        packName: pack.name,
        packPrice: pack.price.toString(),
      },
      customer_email: undefined, // Will be collected during checkout
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU", "DE", "FR", "ES", "IT", "NL", "SE", "NO", "DK"],
      },
      phone_number_collection: {
        enabled: true,
      },
      custom_text: {
        submit: {
          message: "You will receive your module pack via email within 24 hours.",
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
