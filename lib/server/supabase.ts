import { createClient } from '@supabase/supabase-js';
import { APIError } from './validation';

/**
 * Server-side Supabase client utilities
 * Uses service role key for admin operations
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_SUPABASE_SERVICE_ROLE_KEY environment variables');
}

// Service role client for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// User client factory for RLS operations
export function createUserClient(userToken: string) {
  return createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  });
}

/**
 * Database operation helpers
 */

export interface RunRecord {
  id: string;
  org_id: string;
  user_id: string;
  module_id: string;
  seven_d: any;
  signature_7d: string;
  status: 'queued' | 'success' | 'error';
  tokens_in: number;
  tokens_out: number;
  cost_usd: number;
  score_total?: number;
  started_at: string;
  finished_at?: string;
  version: number;
}

export interface PromptScore {
  run_id: string;
  clarity: number;
  execution: number;
  ambiguity: number;
  business_fit: number;
  composite: number;
  breakdown: any;
  created_at: string;
}

export interface BundleRecord {
  id: string;
  run_id: string;
  org_id: string;
  formats: string[];
  manifest: any;
  checksum: string;
  license_notice: string;
  storage_path: string;
  created_at: string;
}

export interface EntitlementRecord {
  org_id: string;
  user_id?: string;
  flag: string;
  value: boolean;
  source: string;
  source_ref?: string;
  expires_at?: string;
}

export interface APIKeyRecord {
  id: string;
  org_id: string;
  key_hash: string;
  name: string;
  enabled: boolean;
  last_used_at?: string;
  created_at: string;
}

/**
 * Check if user is member of organization
 */
export async function verifyOrgMembership(orgId: string, userId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('org_members')
    .select('role')
    .eq('org_id', orgId)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return false;
  }

  return true;
}

/**
 * Get effective entitlements for user/org
 */
export async function getEffectiveEntitlements(
  orgId: string,
  userId?: string
): Promise<Record<string, boolean>> {
  let query = supabaseAdmin
    .from('entitlements')
    .select('flag, value')
    .eq('org_id', orgId)
    .eq('value', true);

  if (userId) {
    query = query.or(`user_id.is.null,user_id.eq.${userId}`);
  } else {
    query = query.is('user_id', null);
  }

  const { data, error } = await query;

  if (error) {
    throw new APIError('INTERNAL_RUN_ERROR', `Failed to fetch entitlements: ${error.message}`);
  }

  const entitlements: Record<string, boolean> = {};
  data?.forEach(ent => {
    entitlements[ent.flag] = ent.value;
  });

  return entitlements;
}

/**
 * Check specific entitlement
 */
export async function hasEntitlement(
  orgId: string,
  flag: string,
  userId?: string
): Promise<boolean> {
  const entitlements = await getEffectiveEntitlements(orgId, userId);
  return entitlements[flag] === true;
}

/**
 * Create new run record
 */
export async function createRun(
  run: Omit<RunRecord, 'id' | 'started_at' | 'version'>
): Promise<RunRecord> {
  const { data, error } = await supabaseAdmin
    .from('runs')
    .insert({
      ...run,
      started_at: new Date().toISOString(),
      version: 1,
    })
    .select()
    .single();

  if (error) {
    throw new APIError('INTERNAL_RUN_ERROR', `Failed to create run: ${error.message}`);
  }

  return data;
}

/**
 * Update run status
 */
export async function updateRunStatus(
  runId: string,
  status: RunRecord['status'],
  updates: Partial<Pick<RunRecord, 'tokens_in' | 'tokens_out' | 'cost_usd' | 'score_total'>> = {}
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('runs')
    .update({
      status,
      finished_at: status !== 'queued' ? new Date().toISOString() : undefined,
      ...updates,
    })
    .eq('id', runId);

  if (error) {
    throw new APIError('INTERNAL_RUN_ERROR', `Failed to update run: ${error.message}`);
  }
}

/**
 * Save prompt scores
 */
export async function savePromptScore(score: PromptScore): Promise<void> {
  const { error } = await supabaseAdmin.from('prompt_scores').insert({
    ...score,
    created_at: new Date().toISOString(),
  });

  if (error) {
    throw new APIError('INTERNAL_RUN_ERROR', `Failed to save prompt score: ${error.message}`);
  }
}

/**
 * Create bundle record
 */
export async function createBundle(
  bundle: Omit<BundleRecord, 'id' | 'created_at'>
): Promise<BundleRecord> {
  const { data, error } = await supabaseAdmin
    .from('bundles')
    .insert({
      ...bundle,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw new APIError('INTERNAL_RUN_ERROR', `Failed to create bundle: ${error.message}`);
  }

  return data;
}

/**
 * Verify API key and get organization
 */
export async function verifyAPIKey(
  keyHash: string
): Promise<{ orgId: string; keyId: string } | null> {
  const { data, error } = await supabaseAdmin
    .from('api_keys')
    .select('id, org_id, enabled')
    .eq('key_hash', keyHash)
    .eq('enabled', true)
    .single();

  if (error || !data) {
    return null;
  }

  // Update last_used_at
  await supabaseAdmin
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', data.id);

  return {
    orgId: data.org_id,
    keyId: data.id,
  };
}

/**
 * Rate limiting helpers
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number = 60000
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const now = Date.now();
  const windowStart = now - windowMs;

  // This is a simple in-memory rate limiter for demo
  // In production, use Redis or a proper rate limiting service
  const rateLimitKey = `rate_limit:${key}`;

  // For now, return allowed=true (implement proper rate limiting with Redis)
  return {
    allowed: true,
    remaining: limit - 1,
    resetTime: now + windowMs,
  };
}

/**
 * Get module information
 */
export async function getModule(
  moduleId: string
): Promise<{ id: string; name: string; enabled: boolean } | null> {
  const { data, error } = await supabaseAdmin
    .from('modules')
    .select('module_id, name, enabled')
    .eq('module_id', moduleId)
    .single();

  if (error || !data || !data.enabled) {
    return null;
  }

  return {
    id: data.module_id,
    name: data.name,
    enabled: data.enabled,
  };
}
