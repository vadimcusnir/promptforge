// PromptForge v3 - Public API System pentru Enterprise
// API programatic cu API keys și rate limiting

import { createClient } from '@supabase/supabase-js';
import { BudgetGuard, createBudgetForPlan } from './agent/budgets';
import { stripSecrets } from './agent/hygiene';
import { validate7D, type SevenD } from './ruleset';

// SACF - Development mode fallback
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://dev-placeholder.supabase.co';
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dev-placeholder';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

export interface APIKey {
  id: string;
  org_id: string;
  name: string;
  key_hash: string; // SHA-256 hash of the actual key
  key_prefix: string; // First 8 chars pentru identificare
  scopes: APIScope[];
  rate_limit_rpm: number;
  monthly_request_limit: number;
  requests_used_this_month: number;
  last_used_at?: string;
  created_by: string;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
}

export type APIScope = 
  | 'prompts:generate'    // Generate prompts
  | 'prompts:test'        // Test prompts on models
  | 'prompts:score'       // Score prompt quality
  | 'exports:bundle'      // Export bundles
  | 'history:read'        // Read cloud history
  | 'history:write'       // Write to cloud history
  | 'analytics:read'      // Read analytics data
  | 'presets:read'        // Read industry presets
  | 'admin:manage';       // Admin operations

export interface APIUsage {
  org_id: string;
  api_key_id: string;
  endpoint: string;
  method: string;
  status_code: number;
  tokens_used: number;
  cost_usd: number;
  duration_ms: number;
  user_agent?: string;
  ip_address?: string;
  timestamp: string;
}

export interface PublicAPIRequest {
  endpoint: string;
  method: string;
  scopes_required: APIScope[];
  seven_d?: Partial<SevenD>;
  payload?: any;
  response_format?: 'json' | 'stream';
}

export interface PublicAPIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  usage: {
    tokens_used: number;
    cost_usd: number;
    duration_ms: number;
    rate_limit_remaining: number;
    monthly_usage_remaining: number;
  };
  request_id: string;
}

class PublicAPIManager {
  private static instance: PublicAPIManager;
  private budgetGuards: Map<string, BudgetGuard> = new Map();

  private constructor() {}

  public static getInstance(): PublicAPIManager {
    if (!PublicAPIManager.instance) {
      PublicAPIManager.instance = new PublicAPIManager();
    }
    return PublicAPIManager.instance;
  }

  // Validează API key și returnează organizația
  async validateAPIKey(apiKey: string): Promise<{
    valid: boolean;
    orgId?: string;
    keyData?: APIKey;
    error?: string;
  }> {
    if (SUPABASE_URL.includes('dev-placeholder')) {
      // Development mode - accept any key starting with 'pk_dev'
      if (apiKey.startsWith('pk_dev_')) {
        return {
          valid: true,
          orgId: 'dev-org',
          keyData: {
            id: 'dev-key',
            org_id: 'dev-org',
            name: 'Development Key',
            key_hash: 'dev-hash',
            key_prefix: 'pk_dev_',
            scopes: ['prompts:generate', 'prompts:test', 'exports:bundle', 'history:read'],
            rate_limit_rpm: 100,
            monthly_request_limit: 10000,
            requests_used_this_month: 0,
            created_by: 'dev-user',
            is_active: true,
            created_at: new Date().toISOString()
          } as APIKey
        };
      }
      return { valid: false, error: 'Invalid API key format' };
    }

    try {
      // Extract prefix (first 8 chars)
      const keyPrefix = apiKey.slice(0, 8);
      
      // Hash the key pentru comparison
      const keyHash = await this.hashAPIKey(apiKey);

      // Găsește API key în DB
      const { data: keyData, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('key_prefix', keyPrefix)
        .eq('key_hash', keyHash)
        .eq('is_active', true)
        .maybeSingle();

      if (error || !keyData) {
        return { valid: false, error: 'Invalid or inactive API key' };
      }

      // Verifică expirarea
      if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) {
        return { valid: false, error: 'API key has expired' };
      }

      // Verifică monthly limit
      if (keyData.requests_used_this_month >= keyData.monthly_request_limit) {
        return { valid: false, error: 'Monthly request limit exceeded' };
      }

      // Update last_used_at
      await supabase
        .from('api_keys')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', keyData.id);

      return {
        valid: true,
        orgId: keyData.org_id,
        keyData
      };

    } catch (error) {
      return { 
        valid: false, 
        error: error instanceof Error ? error.message : 'Key validation failed' 
      };
    }
  }

  // Verifică rate limiting
  async checkRateLimit(keyData: APIKey): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
  }> {
    const keyId = keyData.id;
    
    // Obține sau creează budget guard pentru această cheie
    if (!this.budgetGuards.has(keyId)) {
      const budget = {
        tokensMax: 50000, // Per session
        requestsPerMin: keyData.rate_limit_rpm,
        costUsdMax: 10.0, // Per session
        timeoutMs: 30000
      };
      this.budgetGuards.set(keyId, new BudgetGuard(budget));
    }

    const guard = this.budgetGuards.get(keyId)!;
    const check = guard.can(0, 0); // Just check rate limit

    if (!check.allowed) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + 60000 // 1 minute from now
      };
    }

    const utilization = guard.getUtilization();
    const remaining = Math.max(0, keyData.rate_limit_rpm - (keyData.rate_limit_rpm * utilization.requests / 100));

    return {
      allowed: true,
      remaining: Math.floor(remaining),
      resetTime: Date.now() + 60000
    };
  }

  // Verifică scope-uri
  checkScopes(keyData: APIKey, requiredScopes: APIScope[]): {
    allowed: boolean;
    missingScopes: APIScope[];
  } {
    const missingScopes = requiredScopes.filter(
      scope => !keyData.scopes.includes(scope)
    );

    return {
      allowed: missingScopes.length === 0,
      missingScopes
    };
  }

  // Înregistrează usage
  async recordUsage(params: {
    orgId: string;
    apiKeyId: string;
    endpoint: string;
    method: string;
    statusCode: number;
    tokensUsed: number;
    costUsd: number;
    durationMs: number;
    userAgent?: string;
    ipAddress?: string;
  }): Promise<void> {
    if (SUPABASE_URL.includes('dev-placeholder')) {
      console.log('Dev mode: API usage recorded', params);
      return;
    }

    const usage: Omit<APIUsage, 'timestamp'> = {
      org_id: params.orgId,
      api_key_id: params.apiKeyId,
      endpoint: params.endpoint,
      method: params.method,
      status_code: params.statusCode,
      tokens_used: params.tokensUsed,
      cost_usd: params.costUsd,
      duration_ms: params.durationMs,
      user_agent: params.userAgent,
      ip_address: params.ipAddress
    };

    // Salvează usage în DB
    await supabase
      .from('api_usage')
      .insert([{
        ...usage,
        timestamp: new Date().toISOString()
      }]);

    // Update monthly usage counter
    await supabase
      .from('api_keys')
      .update({
        requests_used_this_month: supabase.raw('requests_used_this_month + 1')
      })
      .eq('id', params.apiKeyId);

    // Update budget guard
    const guard = this.budgetGuards.get(params.apiKeyId);
    if (guard) {
      guard.add(params.tokensUsed, params.costUsd);
    }
  }

  // Generează răspuns standardizat
  createResponse<T>(params: {
    success: boolean;
    data?: T;
    error?: { code: string; message: string; details?: any };
    tokensUsed: number;
    costUsd: number;
    durationMs: number;
    rateLimitRemaining: number;
    monthlyUsageRemaining: number;
    requestId: string;
  }): PublicAPIResponse<T> {
    return {
      success: params.success,
      data: params.data,
      error: params.error,
      usage: {
        tokens_used: params.tokensUsed,
        cost_usd: params.costUsd,
        duration_ms: params.durationMs,
        rate_limit_remaining: params.rateLimitRemaining,
        monthly_usage_remaining: params.monthlyUsageRemaining
      },
      request_id: params.requestId
    };
  }

  // Creează API key nou
  async createAPIKey(params: {
    orgId: string;
    name: string;
    scopes: APIScope[];
    rateLimitRpm?: number;
    monthlyLimit?: number;
    expiresAt?: string;
    createdBy: string;
  }): Promise<{ apiKey: string; keyData: APIKey }> {
    if (SUPABASE_URL.includes('dev-placeholder')) {
      const mockKey = `pk_dev_${Date.now()}${Math.random().toString(36).slice(2, 10)}`;
      return {
        apiKey: mockKey,
        keyData: {
          id: 'new-dev-key',
          org_id: params.orgId,
          name: params.name,
          key_hash: 'dev-hash',
          key_prefix: mockKey.slice(0, 8),
          scopes: params.scopes,
          rate_limit_rpm: params.rateLimitRpm || 60,
          monthly_request_limit: params.monthlyLimit || 10000,
          requests_used_this_month: 0,
          created_by: params.createdBy,
          is_active: true,
          expires_at: params.expiresAt,
          created_at: new Date().toISOString()
        } as APIKey
      };
    }

    // Generează API key (pk_live_ + random)
    const keyId = crypto.randomUUID();
    const randomPart = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    const apiKey = `pk_live_${randomPart}`;
    const keyPrefix = apiKey.slice(0, 8);
    const keyHash = await this.hashAPIKey(apiKey);

    const keyData: Omit<APIKey, 'id' | 'created_at'> = {
      org_id: params.orgId,
      name: params.name,
      key_hash: keyHash,
      key_prefix: keyPrefix,
      scopes: params.scopes,
      rate_limit_rpm: params.rateLimitRpm || 60,
      monthly_request_limit: params.monthlyLimit || 10000,
      requests_used_this_month: 0,
      created_by: params.createdBy,
      is_active: true,
      expires_at: params.expiresAt
    };

    const { data, error } = await supabase
      .from('api_keys')
      .insert([keyData])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create API key: ${error.message}`);
    }

    return { apiKey, keyData: data };
  }

  // Revoke API key
  async revokeAPIKey(keyId: string, orgId: string): Promise<void> {
    if (SUPABASE_URL.includes('dev-placeholder')) {
      console.log('Dev mode: API key revoked', keyId);
      return;
    }

    const { error } = await supabase
      .from('api_keys')
      .update({ is_active: false })
      .eq('id', keyId)
      .eq('org_id', orgId);

    if (error) {
      throw new Error(`Failed to revoke API key: ${error.message}`);
    }

    // Remove from budget guards
    this.budgetGuards.delete(keyId);
  }

  // Helper pentru hash
  private async hashAPIKey(apiKey: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(apiKey);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Cleanup expired budget guards (rulează periodic)
  cleanupBudgetGuards(): void {
    // În production ar rula ca background job
    // Pentru now, cleanup manual când e nevoie
    const activeKeys = Array.from(this.budgetGuards.keys());
    console.log(`Budget guards active for ${activeKeys.length} API keys`);
  }
}

// Export singleton
export const publicAPIManager = PublicAPIManager.getInstance();
