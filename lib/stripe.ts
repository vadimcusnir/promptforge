import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

export const STRIPE_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: [
      '5 modules per month',
      'Basic export (PDF)',
      'Community support',
    ],
    limits: {
      modules: 5,
      exports: 3,
      aiGenerations: 10,
    }
  },
  CREATOR: {
    name: 'Creator',
    price: 29,
    priceId: process.env.STRIPE_CREATOR_PRICE_ID,
    features: [
      '50 modules per month',
      'All export formats',
      'AI-powered generation',
      'Priority support',
    ],
    limits: {
      modules: 50,
      exports: 20,
      aiGenerations: 100,
    }
  },
  PRO: {
    name: 'Pro',
    price: 99,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      'Unlimited modules',
      'Advanced AI features',
      'Real-time collaboration',
      'Custom integrations',
      'Dedicated support',
    ],
    limits: {
      modules: -1, // unlimited
      exports: -1, // unlimited
      aiGenerations: -1, // unlimited
    }
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 299,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    features: [
      'Everything in Pro',
      'Custom deployment',
      'SLA guarantee',
      'White-label options',
      '24/7 phone support',
    ],
    limits: {
      modules: -1,
      exports: -1,
      aiGenerations: -1,
    }
  }
} as const

export type PlanType = keyof typeof STRIPE_PLANS

export async function createCheckoutSession(
  priceId: string,
  customerId?: string,
  successUrl?: string,
  cancelUrl?: string
) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer: customerId,
    success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    metadata: {
      userId: customerId || 'anonymous',
    },
  })

  return session
}

export async function createCustomerPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  })

  return session
}

export async function getSubscription(customerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1,
  })

  return subscriptions.data[0] || null
}
