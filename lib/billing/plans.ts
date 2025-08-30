/**
 * Centralized plan configuration for PromptForge v3
 * This ensures consistency across all payment-related components
 */

import { z } from 'zod'

// Plan codes enum - standardized across the entire application
export const PLAN_CODES = {
  PILOT: 'pilot',
  PRO: 'pro',
  ENTERPRISE: 'enterprise'
} as const

export type PlanCode = typeof PLAN_CODES[keyof typeof PLAN_CODES]

// Plan metadata with consistent naming
export const PLAN_METADATA = {
  [PLAN_CODES.PILOT]: {
    id: 'pilot',
    name: 'Pilot',
    displayName: 'Free',
    description: 'Perfect for getting started',
    price_monthly: 0,
    price_annual: 0,
    currency: 'USD',
    seats: 1,
    popular: false,
    features: [
      'Modules M01, M10, M18',
      'Export txt, md',
      'Local history',
      'Community support'
    ],
    limitations: [
      'Export pdf, json',
      'Live Test Engine',
      'Cloud history',
      'API access'
    ],
    cta: 'Start Free'
  },
  [PLAN_CODES.PRO]: {
    id: 'pro',
    name: 'Pro',
    displayName: 'Pro',
    description: 'For professionals and teams',
    price_monthly: 49,
    price_annual: 490,
    currency: 'USD',
    seats: 1,
    popular: true,
    features: [
      'All modules (M01-M50)',
      'Export txt, md, pdf, json',
      'Live Test Engine',
      'Cloud history',
      'Advanced analytics',
      'Priority support'
    ],
    limitations: [
      'API access',
      'White-label'
    ],
    cta: 'Start Pro Trial'
  },
  [PLAN_CODES.ENTERPRISE]: {
    id: 'enterprise',
    name: 'Enterprise',
    displayName: 'Enterprise',
    description: 'For organizations at scale',
    price_monthly: 299,
    price_annual: 2990,
    currency: 'USD',
    seats: 5,
    popular: false,
    features: [
      'Everything in Pro',
      'API access',
      'Bundle.zip exports',
      'White-label options',
      '5 seats included',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee'
    ],
    limitations: [],
    cta: 'Contact Sales'
  }
} as const

// Plan entitlements mapping
export const PLAN_ENTITLEMENTS: Record<PlanCode, Record<string, boolean | number>> = {
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
    hasSeatsGT1: false,
    maxRunsPerDay: 10,
    maxTokensPerRun: 1000,
    canAccessAdvancedModules: false,
    canUseCustomPrompts: true,
    canExportHistory: false
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
    hasSeatsGT1: false,
    maxRunsPerDay: 100,
    maxTokensPerRun: 5000,
    canAccessAdvancedModules: true,
    canUseCustomPrompts: true,
    canExportHistory: true
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
    hasSeatsGT1: true,
    maxRunsPerDay: 1000,
    maxTokensPerRun: 10000,
    canAccessAdvancedModules: true,
    canUseCustomPrompts: true,
    canExportHistory: true
  }
}

// Validation schemas
export const planCodeSchema = z.enum([PLAN_CODES.PILOT, PLAN_CODES.PRO, PLAN_CODES.ENTERPRISE])

export const planMetadataSchema = z.object({
  id: z.string(),
  name: z.string(),
  displayName: z.string(),
  description: z.string(),
  price_monthly: z.number(),
  price_annual: z.number(),
  currency: z.string(),
  seats: z.number(),
  popular: z.boolean(),
  features: z.array(z.string()),
  limitations: z.array(z.string()),
  cta: z.string()
})

// Helper functions
export function isValidPlanCode(planCode: string): planCode is PlanCode {
  return Object.values(PLAN_CODES).includes(planCode as PlanCode)
}

export function getPlanMetadata(planCode: PlanCode) {
  return PLAN_METADATA[planCode]
}

export function getPlanEntitlements(planCode: PlanCode) {
  return PLAN_ENTITLEMENTS[planCode]
}

export function hasEntitlement(planCode: PlanCode, entitlement: string): boolean {
  const entitlements = getPlanEntitlements(planCode)
  return Boolean(entitlements[entitlement])
}

export function getAllPlans() {
  return Object.values(PLAN_METADATA)
}

export function getPopularPlan() {
  return Object.values(PLAN_METADATA).find(plan => plan.popular) || PLAN_METADATA[PLAN_CODES.PRO]
}

// Stripe price ID mapping (environment variables)
export const STRIPE_PRICE_IDS = {
  [PLAN_CODES.PILOT]: {
    monthly: process.env.STRIPE_PILOT_MONTHLY_PRICE_ID,
    annual: process.env.STRIPE_PILOT_ANNUAL_PRICE_ID
  },
  [PLAN_CODES.PRO]: {
    monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    annual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID
  },
  [PLAN_CODES.ENTERPRISE]: {
    monthly: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID,
    annual: process.env.STRIPE_ENTERPRISE_ANNUAL_PRICE_ID
  }
} as const

// Validate that all required price IDs are configured
export function validateStripePriceIds() {
  const missing: string[] = []
  
  Object.entries(STRIPE_PRICE_IDS).forEach(([planCode, priceIds]) => {
    if (!priceIds.monthly) missing.push(`STRIPE_${planCode.toUpperCase()}_MONTHLY_PRICE_ID`)
    if (!priceIds.annual) missing.push(`STRIPE_${planCode.toUpperCase()}_ANNUAL_PRICE_ID`)
  })
  
  if (missing.length > 0) {
    throw new Error(`Missing required Stripe price ID environment variables: ${missing.join(', ')}`)
  }
  
  return true
}
