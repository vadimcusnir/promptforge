import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';

/**
 * Entitlements API
 * Returns effective entitlements for the current user's organization
 * Used by frontend for feature gating and paywall logic
 */

export async function GET(req: NextRequest) {
  try {
    // Get current session
    const session = await getServerSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get org_id from query params or derive from user
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get('org_id');
    const userId = session.user.id;

    if (!orgId) {
      return NextResponse.json({ error: 'org_id required' }, { status: 400 });
    }

    // Create Supabase client with user session
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
      global: {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      },
    });

    // Verify user is member of the organization
    const { data: membership, error: memberError } = await supabase
      .from('org_members')
      .select('role')
      .eq('org_id', orgId)
      .eq('user_id', userId)
      .single();

    if (memberError || !membership) {
      return NextResponse.json({ error: 'Not a member of this organization' }, { status: 403 });
    }

    // Get effective entitlements for the user in this org
    const { data: entitlements, error: entError } = await supabase
      .from('entitlements_effective_user')
      .select('flag, value, sources, earliest_expiry')
      .eq('org_id', orgId)
      .eq('user_id', userId);

    if (entError) {
      console.error('[Entitlements API] Error fetching user entitlements:', entError);
      // Fall back to org-wide entitlements
      const { data: orgEntitlements, error: orgError } = await supabase
        .from('entitlements_effective_org')
        .select('flag, value, sources, earliest_expiry')
        .eq('org_id', orgId);

      if (orgError) {
        console.error('[Entitlements API] Error fetching org entitlements:', orgError);
        return NextResponse.json({ error: 'Failed to fetch entitlements' }, { status: 500 });
      }

      // Convert to entitlements object
      const entitlementsObj = convertEntitlementsToObject(orgEntitlements || []);

      return NextResponse.json({
        org_id: orgId,
        user_id: userId,
        entitlements: entitlementsObj,
        fallback: 'org', // Indicates we fell back to org-wide entitlements
      });
    }

    // Convert to entitlements object
    const entitlementsObj = convertEntitlementsToObject(entitlements || []);

    // Get current subscription info for additional context
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan_code, status, seats, trial_end, current_period_end')
      .eq('org_id', orgId)
      .single();

    return NextResponse.json({
      org_id: orgId,
      user_id: userId,
      entitlements: entitlementsObj,
      subscription: subscription || null,
      membership: {
        role: membership.role,
      },
    });
  } catch (error) {
    console.error('[Entitlements API] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Convert entitlements array to typed object
 */
function convertEntitlementsToObject(
  entitlements: Array<{ flag: string; value: boolean }>
): UserEntitlements {
  const entitlementsMap: Record<string, boolean> = {};

  entitlements.forEach(ent => {
    entitlementsMap[ent.flag] = ent.value;
  });

  return {
    // Core module access
    canUseAllModules: entitlementsMap.canUseAllModules || false,

    // Export capabilities
    canExportMD: entitlementsMap.canExportMD || false,
    canExportPDF: entitlementsMap.canExportPDF || false,
    canExportJSON: entitlementsMap.canExportJSON || false,
    canExportBundleZip: entitlementsMap.canExportBundleZip || false,

    // GPT and AI features
    canUseGptTestReal: entitlementsMap.canUseGptTestReal || false,
    hasEvaluatorAI: entitlementsMap.hasEvaluatorAI || false,

    // Cloud and storage
    hasCloudHistory: entitlementsMap.hasCloudHistory || false,

    // API access
    hasAPI: entitlementsMap.hasAPI || false,

    // Enterprise features
    hasWhiteLabel: entitlementsMap.hasWhiteLabel || false,
    hasSeatsGT1: entitlementsMap.hasSeatsGT1 || false,

    // Add-ons and packs
    hasExportDesigner: entitlementsMap.hasExportDesigner || false,
    hasFinTechPack: entitlementsMap.hasFinTechPack || false,
    hasEduPack: entitlementsMap.hasEduPack || false,
    hasIndustryTemplates: entitlementsMap.hasIndustryTemplates || false,

    // Limits
    maxRunsPerDay: parseInt(entitlementsMap.maxRunsPerDay as string) || 10,
    maxSeats: parseInt(entitlementsMap.maxSeats as string) || 1,
  };
}

/**
 * TypeScript interface for user entitlements
 * Should match the feature flags in plans table
 */
export interface UserEntitlements {
  // Core features
  canUseAllModules: boolean;
  canExportMD: boolean;
  canExportPDF: boolean;
  canExportJSON: boolean;
  canExportBundleZip: boolean;
  canUseGptTestReal: boolean;

  // Premium features
  hasCloudHistory: boolean;
  hasEvaluatorAI: boolean;
  hasAPI: boolean;
  hasWhiteLabel: boolean;
  hasSeatsGT1: boolean;

  // Add-ons
  hasExportDesigner: boolean;
  hasFinTechPack: boolean;
  hasEduPack: boolean;
  hasIndustryTemplates: boolean;

  // Limits
  maxRunsPerDay: number;
  maxSeats: number;
}
