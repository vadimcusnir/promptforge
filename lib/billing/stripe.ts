import Stripe from 'stripe'
import { z } from 'zod'

// Environment validation schema
const envSchema = z.object({
  STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required'),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, 'STRIPE_WEBHOOK_SECRET is required'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1, 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required')
})

// Validate environment variables at boot
const env = envSchema.parse({
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
})

// Initialize Stripe client
export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil'
})

// Plan codes enum
export const PLAN_CODES = {
  PILOT: 'pilot',
  PRO: 'pro',
  ENTERPRISE: 'enterprise'
} as const

export type PlanCode = typeof PLAN_CODES[keyof typeof PLAN_CODES]

// Billing intervals
export const BILLING_INTERVALS = {
  MONTH: 'month',
  YEAR: 'year'
} as const

export type BillingInterval = typeof BILLING_INTERVALS[keyof typeof BILLING_INTERVALS]

// Plan entitlements mapping
export const PLAN_ENTITLEMENTS: Record<PlanCode, Record<string, boolean>> = {
  [PLAN_CODES.PILOT]: {
    canUseAllModules: false,
    canExportMD: true,
    canExportPDF: false,
    canExportJSON: false,
    canUseGptTestReal: false,
    hasCloudHistory: false,
    hasEvaluatorAI: false,
    hasAPI: false,
    canExportBundleZip: false,
    hasWhiteLabel: false,
    hasSeatsGT1: false
  },
  [PLAN_CODES.PRO]: {
    canUseAllModules: true,
    canExportMD: true,
    canExportPDF: true,
    canExportJSON: true,
    canUseGptTestReal: true,
    hasCloudHistory: true,
    hasEvaluatorAI: true,
    hasAPI: false,
    canExportBundleZip: false,
    hasWhiteLabel: false,
    hasSeatsGT1: false
  },
  [PLAN_CODES.ENTERPRISE]: {
    canUseAllModules: true,
    canExportMD: true,
    canExportPDF: true,
    canExportJSON: true,
    canUseGptTestReal: true,
    hasCloudHistory: true,
    hasEvaluatorAI: true,
    hasAPI: true,
    canExportBundleZip: true,
    hasWhiteLabel: true,
    hasSeatsGT1: true
  }
}

// Price lookup by plan code and interval
export async function getPriceByPlanAndInterval(
  planCode: PlanCode,
  interval: BillingInterval
): Promise<Stripe.Price | null> {
  try {
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product']
    })

    const price = prices.data.find(price => {
      const product = price.product as Stripe.Product
      return (
        product.metadata?.plan_code === planCode &&
        price.recurring?.interval === interval
      )
    })

    return price || null
  } catch (error) {
    console.error('Error looking up price:', error)
    return null
  }
}

// Get all prices for a plan
export async function getPricesByPlan(planCode: PlanCode): Promise<Stripe.Price[]> {
  try {
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product']
    })

    return prices.data.filter(price => {
      const product = price.product as Stripe.Product
      return product.metadata?.plan_code === planCode
    })
  } catch (error) {
    console.error('Error looking up prices:', error)
    return []
  }
}

// Get plan code from price ID
export async function getPlanCodeFromPrice(priceId: string): Promise<PlanCode | null> {
  try {
    const price = await stripe.prices.retrieve(priceId, {
      expand: ['product']
    })

    const product = price.product as Stripe.Product
    const planCode = product.metadata?.plan_code as PlanCode

    if (Object.values(PLAN_CODES).includes(planCode)) {
      return planCode
    }

    return null
  } catch (error) {
    console.error('Error getting plan code from price:', error)
    return null
  }
}

// Get plan code from subscription
export async function getPlanCodeFromSubscription(subscriptionId: string): Promise<PlanCode | null> {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['items.data.price.product']
    })

    const price = subscription.items.data[0]?.price
    if (!price) return null

    const product = price.product as Stripe.Product
    const planCode = product.metadata?.plan_code as PlanCode

    if (Object.values(PLAN_CODES).includes(planCode)) {
      return planCode
    }

    return null
  } catch (error) {
    console.error('Error getting plan code from subscription:', error)
    return null
  }
}

// Validate plan code
export function isValidPlanCode(planCode: string): planCode is PlanCode {
  return Object.values(PLAN_CODES).includes(planCode as PlanCode)
}

// Get plan entitlements
export function getPlanEntitlements(planCode: PlanCode): Record<string, boolean> {
  return PLAN_ENTITLEMENTS[planCode] || PLAN_ENTITLEMENTS[PLAN_CODES.PILOT]
}

// Check if plan has specific entitlement
export function hasEntitlement(planCode: PlanCode, entitlement: string): boolean {
  const entitlements = getPlanEntitlements(planCode)
  return entitlements[entitlement] || false
}

// Get plan metadata
export function getPlanMetadata(planCode: PlanCode) {
  switch (planCode) {
    case PLAN_CODES.PILOT:
      return {
        name: 'Pilot',
        description: 'Free tier for getting started',
        seats: 1,
        price_monthly: 0,
        price_yearly: 0
      }
    case PLAN_CODES.PRO:
      return {
        name: 'Pro',
        description: 'Professional plan with advanced features',
        seats: 1,
        price_monthly: 49,
        price_yearly: 490
      }
    case PLAN_CODES.ENTERPRISE:
      return {
        name: 'Enterprise',
        description: 'Enterprise plan with full features and 5 seats included',
        seats: 5,
        price_monthly: 299,
        price_yearly: 2990
      }
    default:
      return null
  }
}

// Webhook event validation
export function constructWebhookEvent(
  body: string | Buffer,
  signature: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET)
}

// Export environment for client-side
export const stripeConfig = {
  publishableKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
}
