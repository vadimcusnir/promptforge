// P0 Launch Configuration with fallbacks for missing environment variables
export const config = {
  // Base URLs
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://chatgpt-prompting.com',
  
  // Supabase (optional for P0)
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key',
  },
  
  // Stripe (optional for P0)
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || 'placeholder-secret',
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'placeholder-publishable',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'placeholder-webhook',
    portalConfigId: process.env.STRIPE_PORTAL_CONFIGURATION_ID,
    prices: {
      creator: {
        monthly: process.env.STRIPE_CREATOR_MONTHLY_PRICE_ID || 'price_creator_monthly',
        annual: process.env.STRIPE_CREATOR_ANNUAL_PRICE_ID || 'price_creator_annual',
      },
      pro: {
        monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly',
        annual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || 'price_pro_annual',
      },
      enterprise: {
        monthly: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID || 'price_enterprise_monthly',
        annual: process.env.STRIPE_ENTERPRISE_ANNUAL_PRICE_ID || 'price_enterprise_annual',
      },
    },
  },
  
  // Admin (required for P0)
  admin: {
    apiToken: process.env.ADMIN_API_TOKEN || 'placeholder-admin-token',
  },
  
  // Launch mode
  isLaunchMode: process.env.NEXT_PUBLIC_COMING_SOON === 'true',
  
  // Check if required services are configured
  services: {
    hasSupabase: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    hasStripe: !!(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
    hasAdmin: !!process.env.ADMIN_API_TOKEN,
  },
}

// Helper function to check if a service is available
export function isServiceAvailable(service: keyof typeof config.services): boolean {
  return config.services[service]
}

// Helper function to get config with type safety
export function getConfig<T extends keyof typeof config>(key: T): typeof config[T] {
  return config[key]
}
