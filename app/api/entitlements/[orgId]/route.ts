// PromptForge v3 - Entitlements API
// Obține entitlements pentru o organizație (pentru gating UI)

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client only when needed
let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!supabaseInstance) {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE environment variables are required');
    }
    
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
  }
  return supabaseInstance;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;

    if (!orgId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    // Obține entitlements pentru organizație
    const { data: entitlements, error: entitlementsError } = await getSupabase()
      .from('entitlements')
      .select('flag, value, source, expires_at')
      .eq('org_id', orgId)
      .is('user_id', null); // Only org-wide entitlements

    if (entitlementsError) {
      throw entitlementsError;
    }

    // Type assertion for entitlements data
    const typedEntitlements = (entitlements || []) as Array<{
      flag: string;
      value: boolean;
      source: string;
      expires_at: string | null;
    }>;

    if (entitlementsError) {
      throw entitlementsError;
    }

    // Filtrează entitlements expirate
    const activeEntitlements = typedEntitlements.filter(e => 
      !e.expires_at || new Date(e.expires_at) > new Date()
    );

    // Convertește în format pentru UI
    const flags = Object.fromEntries(
      activeEntitlements
        .filter(e => e.value === true)
        .map(e => [e.flag, true])
    );

    // Obține informații despre subscripție
    const { data: subscription } = await getSupabase()
      .from('subscriptions')
      .select('plan_code, status, trial_end, seats')
      .eq('org_id', orgId)
      .single();

    // Type assertion for subscription data
    const typedSubscription = subscription as {
      plan_code: string;
      status: string;
      trial_end: string | null;
      seats: number;
    } | null;

    // Obține informații despre plan
    const { data: plan } = await getSupabase()
      .from('plans')
      .select('code, name')
      .eq('code', typedSubscription?.plan_code || 'free')
      .single();

    // Type assertion for plan data
    const typedPlan = plan as {
      code: string;
      name: string;
    } | null;

    // Determină capabilitățile de export
    const exportCapabilities = {
      txt: true,
      md: true,
      json: flags.canExportJSON || false,
      pdf: flags.canExportPDF || false,
      zip: flags.canExportBundleZip || false
    };

    // Determină modulele disponibile
    const moduleAccess = {
      canUseAllModules: flags.canUseAllModules || false,
      maxModules: flags.canUseAllModules ? 50 : 10 // Basic vs Full access
    };

    // Determină features disponibile
    const features = {
      cloudHistory: flags.hasCloudHistory || false,
      gptTestReal: flags.canUseGptTestReal || false,
      evaluatorAI: flags.hasEvaluatorAI || false,
      api: flags.hasAPI || false,
      whiteLabel: flags.hasWhiteLabel || false,
      multipleSeats: flags.hasSeatsGT1 || false
    };

    // Verifică dacă este în trial
    const isTrialing = typedSubscription?.status === 'trialing';
    const trialEndsAt = typedSubscription?.trial_end;

    return NextResponse.json({
      orgId,
      plan: {
        code: typedPlan?.code || 'free',
        name: typedPlan?.name || 'Free',
        status: typedSubscription?.status || 'inactive'
      },
      trial: {
        isActive: isTrialing,
        endsAt: trialEndsAt
      },
      seats: {
        used: 1, // TODO: Calculate actual usage
        total: typedSubscription?.seats || 1
      },
      flags,
      capabilities: {
        export: exportCapabilities,
        modules: moduleAccess,
        features
      },
      restrictions: {
        needsProFor: [
          ...(flags.canExportJSON ? [] : ['JSON export']),
          ...(flags.canExportPDF ? [] : ['PDF export']),
          ...(flags.canUseGptTestReal ? [] : ['GPT Test Real']),
          ...(flags.hasCloudHistory ? [] : ['Cloud History'])
        ],
        needsEnterpriseFor: [
          ...(flags.canExportBundleZip ? [] : ['ZIP bundles']),
          ...(flags.hasAPI ? [] : ['API access']),
          ...(flags.hasWhiteLabel ? [] : ['White-label'])
        ]
      },
      entitlements: activeEntitlements.map(e => ({
        flag: e.flag,
        value: e.value,
        source: e.source,
        expiresAt: e.expires_at
      }))
    });

  } catch (error) {
    console.error('Entitlements API error:', error);
    
    return NextResponse.json(
      { 
        error: 'INTERNAL_ERROR',
        message: 'Failed to fetch entitlements'
      },
      { status: 500 }
    );
  }
}
