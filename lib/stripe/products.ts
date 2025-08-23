// Stripe Products Configuration for PromptForge
export interface StripeProduct {
  id: string;
  name: string;
  description: string;
  priceId: string;
  monthlyPrice: number;
  yearlyPrice?: number;
  features: string[];
  limits: {
    promptsPerMonth: number;
    modules: number;
    exportFormats: string[];
    apiCalls: number;
    support: string;
  };
  entitlements: string[];
  popular?: boolean;
  recommended?: boolean;
}

export const STRIPE_PRODUCTS: StripeProduct[] = [
  {
    id: 'pilot',
    name: 'Pilot',
    description: 'Perfect for individuals and small teams getting started with AI prompts',
    priceId: 'price_pilot_monthly', // Will be replaced with actual Stripe price ID
    monthlyPrice: 0,
    features: [
      'Up to 100 prompts per month',
      'Access to 5 core modules',
      'Basic export (TXT, MD)',
      'Community support',
      'Standard templates',
      'Basic analytics',
    ],
    limits: {
      promptsPerMonth: 100,
      modules: 5,
      exportFormats: ['txt', 'md'],
      apiCalls: 100,
      support: 'community',
    },
    entitlements: ['canUseBasicModules', 'canExportBasic'],
  },
  {
    id: 'creator',
    name: 'Creator',
    description: 'Ideal for content creators and marketing teams',
    priceId: 'price_1RzCg4GcCmkUZPV64xBL3k7Z', // Creator monthly price
    monthlyPrice: 29,
    yearlyPrice: 290,
    features: [
      'Up to 1,000 prompts per month',
      'Access to 15 modules',
      'Advanced export (TXT, MD, JSON)',
      'Priority support',
      'Custom templates',
      'Advanced analytics',
      'Team collaboration (up to 3 users)',
      'Industry-specific packs',
    ],
    limits: {
      promptsPerMonth: 1000,
      modules: 15,
      exportFormats: ['txt', 'md', 'json'],
      apiCalls: 1000,
      support: 'priority',
    },
    entitlements: ['canUseAllModules', 'canExportJSON', 'canUseIndustryPacks', 'canCollaborate'],
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For professional teams and agencies',
    priceId: 'price_1RzCgDGcCmkUZPV617YU0ATE', // Pro monthly price
    monthlyPrice: 99,
    yearlyPrice: 990,
    features: [
      'Up to 10,000 prompts per month',
      'Access to all modules',
      'Premium export (TXT, MD, JSON, PDF)',
      'Dedicated support',
      'Custom branding',
      'Advanced analytics & reporting',
      'Team collaboration (up to 10 users)',
      'API access',
      'White-label options',
      'Advanced security features',
    ],
    limits: {
      promptsPerMonth: 10000,
      modules: 999,
      exportFormats: ['txt', 'md', 'json', 'pdf'],
      apiCalls: 10000,
      support: 'dedicated',
    },
    entitlements: [
      'canUseAllModules',
      'canExportJSON',
      'canExportPDF',
      'canUseIndustryPacks',
      'canCollaborate',
      'hasAPI',
      'canWhiteLabel',
      'canUseAdvancedSecurity',
    ],
    recommended: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    priceId: 'price_enterprise_custom', // Custom pricing
    monthlyPrice: 0, // Custom pricing
    features: [
      'Unlimited prompts per month',
      'Access to all modules + custom modules',
      'All export formats (TXT, MD, JSON, PDF, ZIP)',
      '24/7 dedicated support',
      'Custom branding & white-label',
      'Advanced analytics & custom reporting',
      'Unlimited team collaboration',
      'Full API access',
      'Custom integrations',
      'Advanced security & compliance',
      'SLA guarantees',
      'Custom training & onboarding',
    ],
    limits: {
      promptsPerMonth: 999999,
      modules: 999999,
      exportFormats: ['txt', 'md', 'json', 'pdf', 'zip'],
      apiCalls: 999999,
      support: '24/7',
    },
    entitlements: [
      'canUseAllModules',
      'canExportJSON',
      'canExportPDF',
      'canExportBundleZip',
      'canUseIndustryPacks',
      'canCollaborate',
      'hasAPI',
      'canWhiteLabel',
      'canUseAdvancedSecurity',
      'canUseCustomModules',
      'canUseCustomIntegrations',
    ],
  },
];

// Helper functions
export function getProductById(id: string): StripeProduct | undefined {
  return STRIPE_PRODUCTS.find(product => product.id === id);
}

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return STRIPE_PRODUCTS.find(product => product.priceId === priceId);
}

export function getPopularProducts(): StripeProduct[] {
  return STRIPE_PRODUCTS.filter(product => product.popular || product.recommended);
}

export function getProductsByTier(tier: 'free' | 'paid' | 'enterprise'): StripeProduct[] {
  switch (tier) {
    case 'free':
      return STRIPE_PRODUCTS.filter(product => product.monthlyPrice === 0);
    case 'paid':
      return STRIPE_PRODUCTS.filter(
        product => product.monthlyPrice > 0 && product.id !== 'enterprise'
      );
    case 'enterprise':
      return STRIPE_PRODUCTS.filter(product => product.id === 'enterprise');
    default:
      return STRIPE_PRODUCTS;
  }
}
