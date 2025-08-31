import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = headers()
    const signature = headersList.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        // Extract pack information from metadata
        const packId = session.metadata?.packId
        const packName = session.metadata?.packName
        const packPrice = session.metadata?.packPrice
        const customerEmail = session.customer_details?.email

        console.log("Payment successful:", {
          sessionId: session.id,
          packId,
          packName,
          packPrice,
          customerEmail,
          amount: session.amount_total,
        })

        // Here you would typically:
        // 1. Save the purchase to your database
        // 2. Send the module pack files to the customer
        // 3. Update analytics/sales counters
        // 4. Send confirmation email

        // Example database save (implement based on your database):
        // await savePurchase({
        //   sessionId: session.id,
        //   packId,
        //   customerEmail,
        //   amount: session.amount_total,
        //   status: 'completed',
        //   createdAt: new Date(),
        // })

        // Example email sending (implement based on your email service):
        // await sendPackDeliveryEmail({
        //   to: customerEmail,
        //   packId,
        //   packName,
        //   downloadLinks: generateDownloadLinks(packId),
        // })

        break
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session
        console.log("Checkout session expired:", session.id)
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log("Payment failed:", paymentIntent.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
