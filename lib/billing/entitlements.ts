import { z } from 'zod'
import type { Stripe } from 'stripe'

// Plan codes enum
export const PLAN_CODES = {
  PILOT: 'pilot',
  PRO: 'pro',
  ENTERPRISE: 'enterprise'
} as const

export type PlanCode = 'pilot' | 'pro' | 'enterprise'

// Subscription schema
const subscriptionSchema = z.object({
  id: z.string(),
  org_id: z.string().uuid(),
  stripe_customer_id: z.string(),
  stripe_subscription_id: z.string(),
  plan_code: z.nativeEnum(PLAN_CODES),
  status: z.enum(['active', 'canceled', 'paused', 'past_due', 'unpaid']),
  seats: z.number().min(1),
  trial_end: z.string().nullable(),
  current_period_start: z.string(),
  current_period_end: z.string(),
  created_at: z.string(),
  updated_at: z.string()
})

export type Subscription = z.infer<typeof subscriptionSchema>

// Entitlement schema
const entitlementSchema = z.object({
  id: z.string(),
  org_id: z.string().uuid(),
  flag: z.string(),
  value: z.union([z.boolean(), z.number(), z.string()]),
  source: z.enum(['plan', 'addon', 'trial']),
  expires_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string()
})

export type Entitlement = z.infer<typeof entitlementSchema>

/**
 * Get Supabase client (only when needed and available)
 */
async function getSupabaseClient() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }
  
  try {
    const { createClient } = await import('@supabase/supabase-js');
    return createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  } catch (error) {
    console.warn('Supabase client not available:', error);
    return null;
  }
}

/**
 * Get Stripe client (only when needed and available)
 */
async function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }
  
  try {
    const { default: Stripe } = await import('stripe');
    return new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-07-30.basil'
    });
  } catch (error) {
    console.warn('Stripe client not available:', error);
    return null;
  }
}

// Apply plan entitlements using SQL helper function
export async function applyPlanEntitlements(orgId: string, planCode: PlanCode): Promise<void> {
  try {
    const supabase = await getSupabaseClient();
    
    if (!supabase) {
      console.log(`🔧 Entitlements not available during launch phase for org ${orgId}, plan: ${planCode}`);
      return;
    }

    console.log(`🔧 Applying entitlements for org ${orgId}, plan: ${planCode}`)
    
    // Call the SQL helper function
    const { error } = await supabase.rpc('pf_apply_plan_entitlements', {
      p_org_id: orgId,
      p_plan_code: planCode
    })
    
    if (error) {
      console.error('Error calling pf_apply_plan_entitlements:', error)
      throw new Error(`Failed to apply plan entitlements: ${error.message}`)
    }
    
    console.log(`✅ Entitlements applied successfully for org ${orgId}, plan: ${planCode}`)
  } catch (error) {
    console.error('Error applying plan entitlements:', error)
    throw error
  }
}

// Upsert subscription in database
export async function upsertSubscription(
  stripeSubscription: Stripe.Subscription,
  orgId: string
): Promise<Subscription> {
  try {
    const supabase = await getSupabaseClient();
    
    if (!supabase) {
      console.log(`📝 Subscription upsert not available during launch phase for org ${orgId}`);
      // Return mock subscription for P0 launch
      return {
        id: 'mock-subscription-id',
        org_id: orgId,
        stripe_customer_id: 'mock-customer-id',
        stripe_subscription_id: stripeSubscription.id,
        plan_code: PLAN_CODES.PILOT,
        status: 'active',
        seats: 1,
        trial_end: null,
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    console.log(`📝 Upserting subscription ${stripeSubscription.id} for org ${orgId}`)
    
    // Get plan code from subscription
    const planCode = await getPlanCodeFromSubscription(stripeSubscription.id)
    if (!planCode) {
      throw new Error('Could not determine plan code from subscription')
    }
    
    // Get customer ID
    const customerId = typeof stripeSubscription.customer === 'string' 
      ? stripeSubscription.customer 
      : stripeSubscription.customer.id
    
    // Prepare subscription data
    const subscriptionData = {
      id: stripeSubscription.id,
      org_id: orgId,
      stripe_customer_id: customerId,
      stripe_subscription_id: stripeSubscription.id,
      plan_code: planCode,
      status: stripeSubscription.status,
      seats: stripeSubscription.items.data[0]?.quantity || 1,
      trial_end: stripeSubscription.trial_end ? new Date(stripeSubscription.trial_end * 1000).toISOString() : null,
      current_period_start: new Date((stripeSubscription as any).current_period_start * 1000).toISOString(),
      current_period_end: new Date((stripeSubscription as any).current_period_end * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    // Upsert subscription
    const { data, error } = await supabase
      .from('subscriptions')
      .upsert(subscriptionData, { onConflict: 'id' })
      .select()
      .single()
    
    if (error) {
      console.error('Error upserting subscription:', error)
      throw new Error(`Failed to upsert subscription: ${error.message}`)
    }
    
    console.log(`✅ Subscription upserted successfully for org ${orgId}`)
    
    // Apply plan entitlements
    await applyPlanEntitlements(orgId, planCode)
    
    return data
  } catch (error) {
    console.error('Error upserting subscription:', error)
    throw error
  }
}

// Get current subscription for an organization
export async function getCurrentSubscription(orgId: string): Promise<Subscription | null> {
  try {
    const supabase = await getSupabaseClient();
    
    if (!supabase) {
      console.log(`📋 Subscription retrieval not available during launch phase for org ${orgId}`);
      return null;
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('org_id', orgId)
      .eq('status', 'active')
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error getting current subscription:', error)
      throw error
    }
    
    return data
  } catch (error) {
    console.error('Error getting current subscription:', error)
    return null
  }
}

// Validate organization membership
export async function validateOrgMembership(userId: string, orgId: string): Promise<boolean> {
  try {
    const supabase = await getSupabaseClient();
    
    if (!supabase) {
      console.log(`🔐 Org membership validation not available during launch phase for user ${userId}, org ${orgId}`);
      // For P0 launch, assume access is granted
      return true;
    }

    const { data, error } = await supabase
      .from('org_members')
      .select('role')
      .eq('org_id', orgId)
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error validating org membership:', error)
      throw error
    }
    
    return !!data
  } catch (error) {
    console.error('Error validating org membership:', error)
    return false
  }
}

// Get effective entitlements for an organization
export async function getEffectiveEntitlements(orgId: string): Promise<Record<string, boolean | number | string>> {
  try {
    const supabase = await getSupabaseClient();
    
    if (!supabase) {
      console.log(`🎯 Entitlements not available during launch phase for org ${orgId}`);
      // Return default entitlements for P0 launch
      return {
        canExportMD: true,
        canExportJSON: false,
        canExportPDF: false,
        canExportBundleZip: false,
        canUseGptTestReal: false,
        maxRunsPerDay: 10,
        maxTokensPerRun: 1000,
        canAccessAdvancedModules: false,
        canUseCustomPrompts: true,
        canExportHistory: false
      };
    }

    const { data, error } = await supabase
      .from('entitlements')
      .select('flag, value')
      .eq('org_id', orgId)
      .is('expires_at', null)
    
    if (error) {
      console.error('Error getting entitlements:', error)
      throw error
    }
    
    // Convert to record
    const entitlements: Record<string, boolean | number | string> = {}
    data?.forEach(entitlement => {
      entitlements[entitlement.flag] = entitlement.value
    })
    
    return entitlements
  } catch (error) {
    console.error('Error getting effective entitlements:', error)
    // Return default entitlements on error
    return {
      canExportMD: true,
      canExportJSON: false,
      canExportPDF: false,
      canExportBundleZip: false,
      canUseGptTestReal: false,
      maxRunsPerDay: 10,
      maxTokensPerRun: 1000,
      canAccessAdvancedModules: false,
      canUseCustomPrompts: true,
      canExportHistory: false
    }
  }
}

// Get plan entitlements
export function getPlanEntitlements(planCode: PlanCode): Record<string, boolean | number | string> {
  const entitlements = {
    [PLAN_CODES.PILOT]: {
      canExportMD: true,
      canExportJSON: false,
      canExportPDF: false,
      canExportBundleZip: false,
      canUseGptTestReal: false,
      maxRunsPerDay: 10,
      maxTokensPerRun: 1000,
      canAccessAdvancedModules: false,
      canUseCustomPrompts: true,
      canExportHistory: false
    },
    [PLAN_CODES.PRO]: {
      canExportMD: true,
      canExportJSON: true,
      canExportPDF: true,
      canExportBundleZip: false,
      canUseGptTestReal: true,
      maxRunsPerDay: 100,
      maxTokensPerRun: 5000,
      canAccessAdvancedModules: true,
      canUseCustomPrompts: true,
      canExportHistory: true
    },
    [PLAN_CODES.ENTERPRISE]: {
      canExportMD: true,
      canExportJSON: true,
      canExportPDF: true,
      canExportBundleZip: true,
      canUseGptTestReal: true,
      maxRunsPerDay: 1000,
      maxTokensPerRun: 10000,
      canAccessAdvancedModules: true,
      canUseCustomPrompts: true,
      canExportHistory: true
    }
  }
  
  return entitlements[planCode] || entitlements['pilot']
}

// Get plan code from subscription
export async function getPlanCodeFromSubscription(subscriptionId: string): Promise<PlanCode | null> {
  try {
    const stripe = await getStripeClient();
    
    if (!stripe) {
      console.log(`💳 Stripe not available during launch phase for subscription ${subscriptionId}`);
      return PLAN_CODES.PILOT;
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    
    // Map Stripe price IDs to plan codes
    const priceId = subscription.items.data[0]?.price.id
    
    if (priceId?.includes('pilot') || priceId?.includes('creator')) {
      return PLAN_CODES.PILOT
    } else if (priceId?.includes('pro')) {
      return PLAN_CODES.PRO
    } else if (priceId?.includes('enterprise')) {
      return PLAN_CODES.ENTERPRISE
    }
    
    return PLAN_CODES.PILOT
  } catch (error) {
    console.error('Error getting plan code from subscription:', error)
    return PLAN_CODES.PILOT
  }
}
