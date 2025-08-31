import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
  typescript: true,
})

export const getStripeJs = async () => {
  const stripeJs = await import("@stripe/stripe-js")
  return stripeJs.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
}

// Utility functions for common Stripe operations
export async function createCheckoutSession({
  packId,
  packName,
  packDescription,
  packPrice,
  successUrl,
  cancelUrl,
}: {
  packId: string
  packName: string
  packDescription: string
  packPrice: number
  successUrl: string
  cancelUrl: string
}) {
  return await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: packName,
            description: packDescription,
            metadata: {
              packId,
            },
          },
          unit_amount: packPrice * 100, // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      packId,
      packName,
      packPrice: packPrice.toString(),
    },
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
  })
}

export async function retrieveCheckoutSession(sessionId: string) {
  return await stripe.checkout.sessions.retrieve(sessionId)
}

export async function createCustomer({
  email,
  name,
  metadata = {},
}: {
  email: string
  name?: string
  metadata?: Record<string, string>
}) {
  return await stripe.customers.create({
    email,
    name,
    metadata,
  })
}

export async function createPaymentIntent({
  amount,
  currency = "usd",
  customerId,
  metadata = {},
}: {
  amount: number
  currency?: string
  customerId?: string
  metadata?: Record<string, string>
}) {
  return await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency,
    customer: customerId,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  })
}

// Helper function to format currency
export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

// Helper function to validate webhook signature
export function validateWebhookSignature(payload: string, signature: string, secret: string) {
  try {
    return stripe.webhooks.constructEvent(payload, signature, secret)
  } catch (error) {
    throw new Error(`Webhook signature verification failed: ${error}`)
  }
}
