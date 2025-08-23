// PROMPTFORGE™ v3 - Entitlements Gating System
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export interface EntitlementGate {
  orgId: string;
  featureFlags: string[];
  callback?: () => Promise<void>;
}

export interface EntitlementCheck {
  hasAccess: boolean;
  missingFlags: string[];
  plan: string;
  expiresAt?: Date;
}

/**
 * Wrapper function to check entitlements before executing protected operations
 */
export async function withEntitlementGate(
  orgId: string,
  requiredFlags: string[],
  callback?: () => Promise<void>
): Promise<void> {
  const check = await checkEntitlements(orgId, requiredFlags);

  if (!check.hasAccess) {
    throw new Error(
      `Access denied. Missing entitlements: ${check.missingFlags.join(', ')}. ` +
        `Required plan: ${check.plan}`
    );
  }

  if (callback) {
    await callback();
  }
}

/**
 * Check if an organization has access to specific feature flags
 */
export async function checkEntitlements(
  orgId: string,
  requiredFlags: string[]
): Promise<EntitlementCheck> {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get organization's plan and entitlements
    const { data: org, error: orgError } = await supabase
      .from('orgs')
      .select(
        `
        id,
        plan,
        plan_expires_at,
        entitlements:org_entitlements(
          feature_flag,
          is_enabled,
          expires_at
        )
      `
      )
      .eq('id', orgId)
      .single();

    if (orgError || !org) {
      throw new Error(`Organization not found: ${orgId}`);
    }

    // Check if plan is active
    if (org.plan_expires_at && new Date(org.plan_expires_at) < new Date()) {
      return {
        hasAccess: false,
        missingFlags: requiredFlags,
        plan: org.plan,
        expiresAt: new Date(org.plan_expires_at),
      };
    }

    // Check feature flags
    const enabledFlags = new Set(
      org.entitlements?.filter((e: any) => e.is_enabled)?.map((e: any) => e.feature_flag) || []
    );

    const missingFlags = requiredFlags.filter(flag => !enabledFlags.has(flag));

    return {
      hasAccess: missingFlags.length === 0,
      missingFlags,
      plan: org.plan,
      expiresAt: org.plan_expires_at ? new Date(org.plan_expires_at) : undefined,
    };
  } catch (error) {
    console.error('Entitlement check failed:', error);
    return {
      hasAccess: false,
      missingFlags: requiredFlags,
      plan: 'unknown',
    };
  }
}

/**
 * Check if user has access to a specific module
 */
export async function checkModuleAccess(orgId: string, moduleId: string): Promise<boolean> {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check if module is available for the org's plan
    const { data: moduleAccess, error } = await supabase
      .from('module_access')
      .select('is_enabled')
      .eq('org_id', orgId)
      .eq('module_id', moduleId)
      .single();

    if (error || !moduleAccess) {
      return false;
    }

    return moduleAccess.is_enabled;
  } catch (error) {
    console.error('Module access check failed:', error);
    return false;
  }
}

/**
 * Get all available features for an organization
 */
export async function getAvailableFeatures(orgId: string): Promise<string[]> {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const { data: entitlements, error } = await supabase
      .from('org_entitlements')
      .select('feature_flag')
      .eq('org_id', orgId)
      .eq('is_enabled', true);

    if (error) {
      return [];
    }

    return entitlements.map((e: any) => e.feature_flag);
  } catch (error) {
    console.error('Failed to get available features:', error);
    return [];
  }
}
