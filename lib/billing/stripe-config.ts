/**
 * Stripe Products and Pricing Configuration
 * Maps Stripe Price IDs to PromptForge plan codes
 */

export interface StripeProduct {
  productId: string;
  planCode: 'pilot' | 'pro' | 'enterprise';
  name: string;
  prices: {
    monthly?: string;
    annual?: string;
  };
}

export interface StripeAddon {
  productId: string;
  addonCode: string;
  name: string;
  prices: {
    monthly?: string;
    annual?: string;
  };
}

/**
 * Stripe Products Configuration
 * Update these IDs after creating products in Stripe Dashboard
 */
export const STRIPE_PRODUCTS: StripeProduct[] = [
  {
    productId: 'prod_pilot', // Replace with actual Stripe product ID
    planCode: 'pilot',
    name: 'Pilot',
    prices: {
      monthly: 'price_pilot_monthly', // Replace with actual price ID
      annual: 'price_pilot_annual', // Replace with actual price ID
    },
  },
  {
    productId: 'prod_pro', // Replace with actual Stripe product ID
    planCode: 'pro',
    name: 'Pro',
    prices: {
      monthly: 'price_pro_monthly', // Replace with actual price ID
      annual: 'price_pro_annual', // Replace with actual price ID
    },
  },
  {
    productId: 'prod_enterprise', // Replace with actual Stripe product ID
    planCode: 'enterprise',
    name: 'Enterprise',
    prices: {
      monthly: 'price_enterprise_monthly', // Replace with actual price ID
      annual: 'price_enterprise_annual', // Replace with actual price ID
    },
  },
];

/**
 * Stripe Add-ons Configuration
 * Optional: for individual feature purchases
 */
export const STRIPE_ADDONS: StripeAddon[] = [
  {
    productId: 'prod_evaluator_ai', // Replace with actual product ID
    addonCode: 'evaluator_ai',
    name: 'Evaluator AI',
    prices: {
      monthly: 'price_evaluator_ai_monthly',
    },
  },
  {
    productId: 'prod_export_designer', // Replace with actual product ID
    addonCode: 'export_designer',
    name: 'Export Designer',
    prices: {
      monthly: 'price_export_designer_monthly',
    },
  },
  {
    productId: 'prod_fintech_pack', // Replace with actual product ID
    addonCode: 'fintech_pack',
    name: 'FinTech Industry Pack',
    prices: {
      monthly: 'price_fintech_pack_monthly',
    },
  },
  {
    productId: 'prod_edu_pack', // Replace with actual product ID
    addonCode: 'edu_pack',
    name: 'Education Pack',
    prices: {
      monthly: 'price_edu_pack_monthly',
    },
  },
];

/**
 * Price ID to Plan Code mapping for fast webhook lookup
 */
export const PRICE_TO_PLAN_MAP = new Map<string, 'pilot' | 'pro' | 'enterprise'>();
export const PRICE_TO_ADDON_MAP = new Map<string, string>();

// Populate plan mappings
STRIPE_PRODUCTS.forEach(product => {
  if (product.prices.monthly) {
    PRICE_TO_PLAN_MAP.set(product.prices.monthly, product.planCode);
  }
  if (product.prices.annual) {
    PRICE_TO_PLAN_MAP.set(product.prices.annual, product.planCode);
  }
});

// Populate addon mappings
STRIPE_ADDONS.forEach(addon => {
  if (addon.prices.monthly) {
    PRICE_TO_ADDON_MAP.set(addon.prices.monthly, addon.addonCode);
  }
  if (addon.prices.annual) {
    PRICE_TO_ADDON_MAP.set(addon.prices.annual, addon.addonCode);
  }
});

/**
 * Helper functions
 */
export function mapPriceToPlanCode(priceId: string): 'pilot' | 'pro' | 'enterprise' | null {
  return PRICE_TO_PLAN_MAP.get(priceId) || null;
}

export function mapPriceToAddonCode(priceId: string): string | null {
  return PRICE_TO_ADDON_MAP.get(priceId) || null;
}

export function getProductByPlanCode(
  planCode: 'pilot' | 'pro' | 'enterprise'
): StripeProduct | null {
  return STRIPE_PRODUCTS.find(p => p.planCode === planCode) || null;
}

export function getAddonByCode(addonCode: string): StripeAddon | null {
  return STRIPE_ADDONS.find(a => a.addonCode === addonCode) || null;
}

/**
 * Environment validation
 */
export function validateStripeEnvironment(): void {
  const required = [
    'STRIPE_SECRET',
    'STRIPE_WEBHOOK_SECRET',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
