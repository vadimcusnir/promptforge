import { createClient } from '@supabase/supabase-js';
import { ValidationError } from './validator';

// Supabase client for entitlements
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Feature flags from ruleset.yml
export type FeatureFlag = 
  | 'canExportPDF'
  | 'canExportJSON'
  | 'canExportBundleZip'
  | 'canUseGptTestReal'
  | 'canUseAPI'
  | 'canCreateModules'
  | 'canManageProjects'
  | 'canViewAnalytics'
  | 'canExportCustomFormats'
  | 'canUseAdvancedFeatures'
  | 'canExportHistory';

// Plan types
export type PlanType = 'pilot' | 'pro' | 'enterprise';

// Entitlement source types
export type EntitlementSource = 'plan' | 'addon' | 'license' | 'trial';

/**
 * Check if user has access to a specific feature
 */
export async function checkEntitlement(
  userId: string,
  orgId: string,
  flag: FeatureFlag
): Promise<{
  hasAccess: boolean;
  source: EntitlementSource | null;
  planName?: string;
  expiresAt?: Date;
  metadata?: any;
}> {
  try {
    // Check user_entitlements view for effective entitlements
    const { data, error } = await supabase
      .from('entitlements')
      .select('*')
      .eq('org_id', orgId)
      .eq('flag', flag)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }

    if (!data) {
      return {
        hasAccess: false,
        source: null
      };
    }

    return {
      hasAccess: true,
      source: data.source_type as EntitlementSource,
      planName: data.plan_name,
      expiresAt: data.expires_at ? new Date(data.expires_at) : undefined,
      metadata: data.value
    };
  } catch (error) {
    console.error('Error checking entitlement:', error);
    return {
      hasAccess: false,
      source: null
    };
  }
}

/**
 * Check multiple entitlements at once
 */
export async function checkMultipleEntitlements(
  userId: string,
  orgId: string,
  flags: FeatureFlag[]
): Promise<Record<FeatureFlag, boolean>> {
  try {
    const { data: entitlements, error } = await supabase
      .from('user_entitlements')
      .select('flag')
      .eq('user_id', userId)
      .eq('org_id', orgId)
      .in('flag', flags);

    if (error) {
      throw error;
    }

    const result: Record<FeatureFlag, boolean> = {} as Record<FeatureFlag, boolean>;
    
    // Initialize all flags as false
    flags.forEach(flag => {
      result[flag] = false;
    });

    // Set true for flags that exist
    entitlements?.forEach(entitlement => {
      if (entitlement.flag in result) {
        result[entitlement.flag as FeatureFlag] = true;
      }
    });

    return result;
  } catch (error) {
    console.error('Error checking multiple entitlements:', error);
    // Return all false on error
    const result: Record<FeatureFlag, boolean> = {} as Record<FeatureFlag, boolean>;
    flags.forEach(flag => {
      result[flag] = false;
    });
    return result;
  }
}

/**
 * Get user's effective plan information
 */
export async function getUserPlan(
  userId: string,
  orgId: string
): Promise<{
  planSlug: PlanType | null;
  planName: string | null;
  features: Record<FeatureFlag, boolean>;
  limits: Record<string, any>;
  isActive: boolean;
}> {
  try {
    // Get user's active subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select(`
        *,
        plans (
          slug,
          name,
          features,
          limits
        )
      `)
      .eq('user_id', userId)
      .eq('org_id', orgId)
      .eq('status', 'active')
      .single();

    if (subError && subError.code !== 'PGRST116') {
      throw subError;
    }

    if (!subscription) {
      return {
        planSlug: null,
        planName: null,
        features: {} as Record<FeatureFlag, boolean>,
        limits: {},
        isActive: false
      };
    }

    const plan = subscription.plans;
    const features = plan?.features || {};
    const limits = plan?.limits || {};

    return {
      planSlug: plan?.slug as PlanType,
      planName: plan?.name || null,
      features: features as Record<FeatureFlag, boolean>,
      limits,
      isActive: true
    };
  } catch (error) {
    console.error('Error getting user plan:', error);
    return {
      planSlug: null,
      planName: null,
      features: {} as Record<FeatureFlag, boolean>,
      limits: {},
      isActive: false
    };
  }
}

/**
 * Validate that user can access a specific feature
 * Throws ValidationError if access is denied
 */
export async function validateEntitlement(
  userId: string,
  orgId: string,
  flag: FeatureFlag,
  operation: string = 'access'
): Promise<void> {
  const entitlement = await checkEntitlement(userId, orgId, flag);
  
  if (!entitlement.hasAccess) {
    throw new ValidationError(
      `ENTITLEMENT_REQUIRED: ${flag} is required to ${operation}`,
      'VALIDATION_FAILED',
      {
        requiredFlag: flag,
        operation,
        userId,
        orgId
      }
    );
  }
}

/**
 * Check if user can export specific formats
 */
export async function checkExportPermissions(
  userId: string,
  orgId: string,
  formats: string[]
): Promise<{
  allowedFormats: string[];
  deniedFormats: string[];
  canExportBundle: boolean;
}> {
  const exportFlags: FeatureFlag[] = ['canExportPDF', 'canExportJSON', 'canExportBundleZip'];
  const entitlements = await checkMultipleEntitlements(userId, orgId, exportFlags);

  const allowedFormats: string[] = [];
  const deniedFormats: string[] = [];

  formats.forEach(format => {
    switch (format.toLowerCase()) {
      case 'pdf':
        if (entitlements.canExportPDF) {
          allowedFormats.push(format);
        } else {
          deniedFormats.push(format);
        }
        break;
      case 'json':
        if (entitlements.canExportJSON) {
          allowedFormats.push(format);
        } else {
          deniedFormats.push(format);
        }
        break;
      case 'txt':
      case 'md':
        // Basic formats are always allowed
        allowedFormats.push(format);
        break;
      default:
        // Custom formats require bundle export permission
        if (entitlements.canExportBundleZip) {
          allowedFormats.push(format);
        } else {
          deniedFormats.push(format);
        }
    }
  });

  return {
    allowedFormats,
    deniedFormats,
    canExportBundle: entitlements.canExportBundleZip
  };
}

/**
 * Check API access permissions
 */
export async function checkAPIAccess(
  userId: string,
  orgId: string
): Promise<{
  hasAccess: boolean;
  rateLimit: number;
  permissions: string[];
}> {
  try {
    const entitlement = await checkEntitlement(userId, orgId, 'canUseAPI');
    
    if (!entitlement.hasAccess) {
      return {
        hasAccess: false,
        rateLimit: 0,
        permissions: []
      };
    }

    // Get API-specific permissions from metadata
    const metadata = entitlement.metadata || {};
    const rateLimit = metadata.rateLimit || 60; // requests per minute
    const permissions = metadata.permissions || ['read', 'write'];

    return {
      hasAccess: true,
      rateLimit,
      permissions
    };
  } catch (error) {
    console.error('Error checking API access:', error);
    return {
      hasAccess: false,
      rateLimit: 0,
      permissions: []
    };
  }
}

/**
 * Check GPT test permissions
 */
export async function checkGPTTestAccess(
  userId: string,
  orgId: string
): Promise<{
  hasAccess: boolean;
  modelAccess: string[];
  testTypes: string[];
}> {
  try {
    const entitlement = await checkEntitlement(userId, orgId, 'canUseGptTestReal');
    
    if (!entitlement.hasAccess) {
      return {
        hasAccess: false,
        modelAccess: [],
        testTypes: []
      };
    }

    // Get test-specific permissions from metadata
    const metadata = entitlement.metadata || {};
    const modelAccess = metadata.modelAccess || ['gpt-4o', 'gpt-4o-mini'];
    const testTypes = metadata.testTypes || ['validation', 'execution', 'quality'];

    return {
      hasAccess: true,
      modelAccess,
      testTypes
    };
  } catch (error) {
    console.error('Error checking GPT test access:', error);
    return {
      hasAccess: false,
      modelAccess: [],
      testTypes: []
    };
  }
}

/**
 * Get organization-wide entitlements
 */
export async function getOrgEntitlements(orgId: string): Promise<{
  features: Record<FeatureFlag, boolean>;
  limits: Record<string, any>;
  memberCount: number;
}> {
  try {
    // Get organization statistics
    const { data: orgStats, error: statsError } = await supabase
      .from('org_statistics')
      .select('*')
      .eq('org_id', orgId)
      .single();

    if (statsError && statsError.code !== 'PGRST116') {
      throw statsError;
    }

    // Get organization-wide entitlements
    const { data: orgEntitlements, error: entError } = await supabase
      .from('entitlements')
      .select('*')
      .eq('org_id', orgId)
      .is('user_id', null);

    if (entError) {
      throw entError;
    }

    const features: Record<FeatureFlag, boolean> = {} as Record<FeatureFlag, boolean>;
    const limits: Record<string, any> = {};

    // Initialize all features as false
    const allFlags: FeatureFlag[] = [
      'canExportPDF', 'canExportJSON', 'canExportBundleZip', 'canUseGptTestReal',
      'canUseAPI', 'canCreateModules', 'canManageProjects', 'canViewAnalytics',
      'canExportCustomFormats', 'canUseAdvancedFeatures'
    ];

    allFlags.forEach(flag => {
      features[flag] = false;
    });

    // Set features based on org entitlements
    orgEntitlements?.forEach(entitlement => {
      if (entitlement.flag in features) {
        features[entitlement.flag as FeatureFlag] = true;
      }
      if (entitlement.flag.includes('limit')) {
        limits[entitlement.flag] = entitlement.value;
      }
    });

    return {
      features,
      limits,
      memberCount: orgStats?.member_count || 0
    };
  } catch (error) {
    console.error('Error getting org entitlements:', error);
    return {
      features: {} as Record<FeatureFlag, boolean>,
      limits: {},
      memberCount: 0
    };
  }
}

/**
 * Check if user can perform a specific operation
 */
export async function canPerformOperation(
  userId: string,
  orgId: string,
  operation: string,
  resource?: string
): Promise<{
  allowed: boolean;
  reason?: string;
  metadata?: any;
}> {
  try {
    // Map operations to required entitlements
    const operationMap: Record<string, FeatureFlag[]> = {
      'export_pdf': ['canExportPDF'],
      'export_json': ['canExportJSON'],
      'export_bundle': ['canExportBundleZip'],
      'gpt_test': ['canUseGptTestReal'],
      'api_access': ['canUseAPI'],
      'create_module': ['canCreateModules'],
      'manage_project': ['canManageProjects'],
      'view_analytics': ['canViewAnalytics'],
      'export_custom': ['canExportCustomFormats'],
      'use_advanced': ['canUseAdvancedFeatures']
    };

    const requiredFlags = operationMap[operation] || [];
    
    if (requiredFlags.length === 0) {
      return {
        allowed: true,
        reason: 'No specific entitlements required for this operation'
      };
    }

    const entitlements = await checkMultipleEntitlements(userId, orgId, requiredFlags);
    const hasAllRequired = requiredFlags.every(flag => entitlements[flag]);

    if (!hasAllRequired) {
      const missingFlags = requiredFlags.filter(flag => !entitlements[flag]);
      return {
        allowed: false,
        reason: `Missing required entitlements: ${missingFlags.join(', ')}`,
        metadata: { missingFlags, requiredFlags }
      };
    }

    return {
      allowed: true,
      reason: 'All required entitlements present',
      metadata: { requiredFlags, entitlements }
    };
  } catch (error) {
    console.error('Error checking operation permissions:', error);
    return {
      allowed: false,
      reason: 'Error checking permissions',
      metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
    };
  }
}

/**
 * Get effective entitlements for a user across all sources
 */
export async function getEffectiveEntitlements(
  userId: string,
  orgId: string
): Promise<{
  features: Record<FeatureFlag, boolean>;
  limits: Record<string, number>;
  memberCount: number;
  planName?: string;
  expiresAt?: Date;
}> {
  try {
    // Get user's effective entitlements from the view
    const { data: entitlements, error } = await supabase
      .from('user_entitlements')
      .select('*')
      .eq('user_id', userId)
      .eq('org_id', orgId);

    if (error) {
      throw error;
    }

    // Initialize all features as false
    const allFlags: FeatureFlag[] = [
      'canExportPDF', 'canExportJSON', 'canExportBundleZip', 'canUseGptTestReal',
      'canUseAPI', 'canCreateModules', 'canManageProjects', 'canViewAnalytics',
      'canExportCustomFormats', 'canUseAdvancedFeatures'
    ];

    const features: Record<FeatureFlag, boolean> = {} as Record<FeatureFlag, boolean>;
    const limits: Record<string, number> = {};

    allFlags.forEach(flag => {
      features[flag] = false;
    });

    // Set features based on effective entitlements
    entitlements?.forEach(entitlement => {
      if (entitlement.flag in features) {
        features[entitlement.flag as FeatureFlag] = true;
      }
      if (entitlement.flag.includes('limit')) {
        limits[entitlement.flag] = entitlement.value;
      }
    });

    // Get org stats for member count
    const { data: orgStats } = await supabase
      .from('organizations')
      .select('member_count')
      .eq('id', orgId)
      .single();

    return {
      features,
      limits,
      memberCount: orgStats?.member_count || 0,
      planName: entitlements?.[0]?.plan_name,
      expiresAt: entitlements?.[0]?.expires_at ? new Date(entitlements[0].expires_at) : undefined
    };
  } catch (error) {
    console.error('Error getting effective entitlements:', error);
    return {
      features: {} as Record<FeatureFlag, boolean>,
      limits: {},
      memberCount: 0
    };
  }
}
