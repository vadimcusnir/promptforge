// PROMPTFORGE™ v3 - Cloud History System
// Istoricul prompturilor cu RLS multi-user și retention policies

import { createClient } from '@supabase/supabase-js';
import { type Domain, type SevenD } from './ruleset';
import { stripSecrets } from './agent/hygiene';

// SACF - Development mode fallback
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://dev-placeholder.supabase.co';
const SUPABASE_SERVICE_ROLE =
  process.env.SUPABASE_SERVICE_ROLE || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dev-placeholder';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

export interface PromptHistoryEntry {
  id: string;
  org_id: string;
  user_id: string;
  module_id?: string;
  preset_id?: string;
  domain: Domain;
  seven_d_config: SevenD;
  prompt_hash: string; // SHA-256 hash pentru deduplication
  prompt_preview: string; // First 200 chars pentru preview
  full_prompt?: string; // Full content doar pentru Pro+
  model_response?: string; // Response doar pentru Pro+
  score?: {
    clarity: number;
    execution: number;
    ambiguity: number;
    business_fit: number;
    composite: number;
  };
  usage: {
    tokens_input: number;
    tokens_output: number;
    cost_usd: number;
    duration_ms: number;
  };
  tags: string[];
  is_favorite: boolean;
  shared_with_org: boolean;
  created_at: string;
  updated_at: string;
  expires_at?: string; // Pentru retention policy
}

export interface HistoryFilters {
  domain?: Domain;
  module_id?: string;
  preset_id?: string;
  tags?: string[];
  date_from?: string;
  date_to?: string;
  min_score?: number;
  only_favorites?: boolean;
  shared_only?: boolean;
  user_id?: string; // Pentru admins să vadă istoricul altor useri
}

export interface HistoryStats {
  total_entries: number;
  total_tokens_used: number;
  total_cost_usd: number;
  average_score: number;
  top_domains: { domain: Domain; count: number }[];
  recent_activity: { date: string; count: number }[];
  retention_summary: {
    active_entries: number;
    expiring_soon: number; // în următoarele 30 zile
    expired_entries: number;
  };
}

class CloudHistoryManager {
  private static instance: CloudHistoryManager;

  private constructor() {}

  public static getInstance(): CloudHistoryManager {
    if (!CloudHistoryManager.instance) {
      CloudHistoryManager.instance = new CloudHistoryManager();
    }
    return CloudHistoryManager.instance;
  }

  // Salvează un entry în istoricul cloud
  async saveToHistory(params: {
    orgId: string;
    userId: string;
    moduleId?: string;
    presetId?: string;
    domain: Domain;
    sevenDConfig: SevenD;
    promptText: string;
    modelResponse?: string;
    score?: PromptHistoryEntry['score'];
    usage: PromptHistoryEntry['usage'];
    tags?: string[];
    shareWithOrg?: boolean;
  }): Promise<string> {
    if (SUPABASE_URL.includes('dev-placeholder')) {
      // Development mode - return mock ID
      console.log('Dev mode: Cloud history save simulated');
      return 'dev-history-' + Date.now();
    }

    const {
      orgId,
      userId,
      moduleId,
      presetId,
      domain,
      sevenDConfig,
      promptText,
      modelResponse,
      score,
      usage,
      tags = [],
      shareWithOrg = false,
    } = params;

    // Verifică entitlements pentru cloud history
    const hasCloudHistory = await this.checkCloudHistoryEntitlement(orgId);
    if (!hasCloudHistory) {
      throw new Error('ENTITLEMENT_REQUIRED: hasCloudHistory required for cloud storage');
    }

    // Sanitizează prompt-ul pentru securitate
    const sanitizedPrompt = stripSecrets(promptText);
    const sanitizedResponse = modelResponse ? stripSecrets(modelResponse) : undefined;

    // Calculează hash pentru deduplication
    const promptHash = await this.calculatePromptHash(
      sanitizedPrompt + JSON.stringify(sevenDConfig)
    );

    // Verifică dacă există deja
    const existing = await this.findExistingEntry(orgId, userId, promptHash);
    if (existing) {
      // Update existing entry
      return this.updateHistoryEntry(existing.id, {
        score,
        usage,
        tags: [...new Set([...existing.tags, ...tags])],
        updated_at: new Date().toISOString(),
      });
    }

    // Obține retention policy
    const retentionDays = await this.getRetentionDays(orgId);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + retentionDays);

    const entry: Omit<PromptHistoryEntry, 'id' | 'created_at' | 'updated_at'> = {
      org_id: orgId,
      user_id: userId,
      module_id: moduleId,
      preset_id: presetId,
      domain,
      seven_d_config: sevenDConfig,
      prompt_hash: promptHash,
      prompt_preview: sanitizedPrompt.slice(0, 200),
      full_prompt: sanitizedPrompt,
      model_response: sanitizedResponse,
      score,
      usage,
      tags,
      is_favorite: false,
      shared_with_org: shareWithOrg,
      expires_at: expiresAt.toISOString(),
    };

    const { data, error } = await supabase
      .from('prompt_history')
      .insert([entry])
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to save to cloud history: ${error.message}`);
    }

    return data.id;
  }

  // Obține istoricul cu filtrare și paginare
  async getHistory(params: {
    orgId: string;
    userId: string;
    filters?: HistoryFilters;
    page?: number;
    limit?: number;
    includeFullContent?: boolean;
  }): Promise<{
    entries: PromptHistoryEntry[];
    total: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
  }> {
    if (SUPABASE_URL.includes('dev-placeholder')) {
      // Development mode - return mock data
      return {
        entries: [],
        total: 0,
        page: 1,
        limit: 20,
        hasNextPage: false,
      };
    }

    const {
      orgId,
      userId,
      filters = {},
      page = 1,
      limit = 20,
      includeFullContent = false,
    } = params;

    // Verifică entitlements
    const hasCloudHistory = await this.checkCloudHistoryEntitlement(orgId);
    if (!hasCloudHistory) {
      throw new Error('ENTITLEMENT_REQUIRED: hasCloudHistory required');
    }

    // Construiește query cu RLS
    let query = supabase.from('prompt_history').select('*', { count: 'exact' }).eq('org_id', orgId);

    // Adaugă filtre pentru user (pentru propria istorie sau shared)
    if (!filters.user_id) {
      // Vezi doar propriile entries + cele shared cu org
      query = query.or(`user_id.eq.${userId},shared_with_org.eq.true`);
    } else {
      // Admin view - poate vedea istoricul unui user specific
      const isAdmin = await this.checkAdminAccess(orgId, userId);
      if (!isAdmin) {
        throw new Error('FORBIDDEN: Admin access required to view other users history');
      }
      query = query.eq('user_id', filters.user_id);
    }

    // Aplică filtrele
    if (filters.domain) query = query.eq('domain', filters.domain);
    if (filters.module_id) query = query.eq('module_id', filters.module_id);
    if (filters.preset_id) query = query.eq('preset_id', filters.preset_id);
    if (filters.date_from) query = query.gte('created_at', filters.date_from);
    if (filters.date_to) query = query.lte('created_at', filters.date_to);
    if (filters.min_score) query = query.gte('score->composite', filters.min_score);
    if (filters.only_favorites) query = query.eq('is_favorite', true);
    if (filters.shared_only) query = query.eq('shared_with_org', true);

    // Filtrare după tags
    if (filters.tags && filters.tags.length > 0) {
      query = query.contains('tags', filters.tags);
    }

    // Exclude expired entries
    query = query.or('expires_at.is.null,expires_at.gt.' + new Date().toISOString());

    // Paginare și sortare
    const offset = (page - 1) * limit;
    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch history: ${error.message}`);
    }

    // Filtrează conținutul pe baza entitlements
    const hasFullAccess = await this.checkFullContentAccess(orgId);
    const processedEntries = (data || []).map(entry => {
      if (!includeFullContent || !hasFullAccess) {
        // Elimină conținutul complet pentru planuri Basic
        return {
          ...entry,
          full_prompt: undefined,
          model_response: undefined,
        };
      }
      return entry;
    });

    return {
      entries: processedEntries,
      total: count || 0,
      page,
      limit,
      hasNextPage: (count || 0) > offset + limit,
    };
  }

  // Obține statistici pentru dashboard
  async getHistoryStats(orgId: string, userId: string): Promise<HistoryStats> {
    if (SUPABASE_URL.includes('dev-placeholder')) {
      // Development mode - return mock stats
      return {
        total_entries: 0,
        total_tokens_used: 0,
        total_cost_usd: 0,
        average_score: 0,
        top_domains: [],
        recent_activity: [],
        retention_summary: {
          active_entries: 0,
          expiring_soon: 0,
          expired_entries: 0,
        },
      };
    }

    const hasCloudHistory = await this.checkCloudHistoryEntitlement(orgId);
    if (!hasCloudHistory) {
      throw new Error('ENTITLEMENT_REQUIRED: hasCloudHistory required');
    }

    // Query pentru statistici de bază
    const { data: basicStats } = await supabase
      .from('prompt_history')
      .select('domain, usage, score')
      .eq('org_id', orgId)
      .or(`user_id.eq.${userId},shared_with_org.eq.true`)
      .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString());

    if (!basicStats) {
      throw new Error('Failed to fetch history stats');
    }

    // Calculează statistici
    const totalEntries = basicStats.length;
    const totalTokens = basicStats.reduce(
      (sum, entry) => sum + (entry.usage?.tokens_input || 0) + (entry.usage?.tokens_output || 0),
      0
    );
    const totalCost = basicStats.reduce((sum, entry) => sum + (entry.usage?.cost_usd || 0), 0);
    const avgScore =
      basicStats.length > 0
        ? basicStats.reduce((sum, entry) => sum + (entry.score?.composite || 0), 0) /
          basicStats.length
        : 0;

    // Top domenii
    const domainCounts = basicStats.reduce(
      (acc, entry) => {
        acc[entry.domain] = (acc[entry.domain] || 0) + 1;
        return acc;
      },
      {} as Record<Domain, number>
    );

    const topDomains = Object.entries(domainCounts)
      .map(([domain, count]) => ({ domain: domain as Domain, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Activitate recentă (ultimele 7 zile)
    const recentActivity: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const { count } = await supabase
        .from('prompt_history')
        .select('*', { count: 'exact', head: true })
        .eq('org_id', orgId)
        .or(`user_id.eq.${userId},shared_with_org.eq.true`)
        .gte('created_at', dateStr + 'T00:00:00Z')
        .lt('created_at', dateStr + 'T23:59:59Z');

      recentActivity.push({ date: dateStr, count: count || 0 });
    }

    // Retention summary
    const now = new Date();
    const in30Days = new Date();
    in30Days.setDate(in30Days.getDate() + 30);

    const { count: activeEntries } = await supabase
      .from('prompt_history')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', orgId)
      .or(`user_id.eq.${userId},shared_with_org.eq.true`)
      .or('expires_at.is.null,expires_at.gt.' + now.toISOString());

    const { count: expiringSoon } = await supabase
      .from('prompt_history')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', orgId)
      .or(`user_id.eq.${userId},shared_with_org.eq.true`)
      .gte('expires_at', now.toISOString())
      .lte('expires_at', in30Days.toISOString());

    return {
      total_entries: totalEntries,
      total_tokens_used: totalTokens,
      total_cost_usd: totalCost,
      average_score: avgScore,
      top_domains: topDomains,
      recent_activity: recentActivity,
      retention_summary: {
        active_entries: activeEntries || 0,
        expiring_soon: expiringSoon || 0,
        expired_entries: 0, // Expired entries sunt deja filtrate
      },
    };
  }

  // Marchează/demarchează ca favorit
  async toggleFavorite(historyId: string, userId: string): Promise<boolean> {
    if (SUPABASE_URL.includes('dev-placeholder')) {
      return true; // Mock success
    }

    const { data, error } = await supabase
      .from('prompt_history')
      .select('is_favorite')
      .eq('id', historyId)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw new Error('History entry not found or access denied');
    }

    const newFavoriteStatus = !data.is_favorite;

    const { error: updateError } = await supabase
      .from('prompt_history')
      .update({ is_favorite: newFavoriteStatus, updated_at: new Date().toISOString() })
      .eq('id', historyId)
      .eq('user_id', userId);

    if (updateError) {
      throw new Error(`Failed to update favorite status: ${updateError.message}`);
    }

    return newFavoriteStatus;
  }

  // Șterge entry din istoric
  async deleteHistoryEntry(historyId: string, userId: string): Promise<void> {
    if (SUPABASE_URL.includes('dev-placeholder')) {
      return; // Mock success
    }

    const { error } = await supabase
      .from('prompt_history')
      .delete()
      .eq('id', historyId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to delete history entry: ${error.message}`);
    }
  }

  // Helper methods
  private async calculatePromptHash(content: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async findExistingEntry(orgId: string, userId: string, promptHash: string): Promise<any> {
    if (SUPABASE_URL.includes('dev-placeholder')) {
      return null;
    }

    const { data } = await supabase
      .from('prompt_history')
      .select('id, tags')
      .eq('org_id', orgId)
      .eq('user_id', userId)
      .eq('prompt_hash', promptHash)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    return data;
  }

  private async updateHistoryEntry(historyId: string, updates: any): Promise<string> {
    if (SUPABASE_URL.includes('dev-placeholder')) {
      return historyId;
    }

    const { error } = await supabase.from('prompt_history').update(updates).eq('id', historyId);

    if (error) {
      throw new Error(`Failed to update history entry: ${error.message}`);
    }

    return historyId;
  }

  private async checkCloudHistoryEntitlement(orgId: string): Promise<boolean> {
    if (SUPABASE_URL.includes('dev-placeholder')) {
      return true;
    }

    const { data } = await supabase
      .from('entitlements')
      .select('value')
      .eq('org_id', orgId)
      .eq('flag', 'hasCloudHistory')
      .eq('value', true)
      .maybeSingle();

    return !!data;
  }

  private async checkFullContentAccess(orgId: string): Promise<boolean> {
    if (SUPABASE_URL.includes('dev-placeholder')) {
      return true;
    }

    // Pro+ plans au acces la conținut complet
    const { data } = await supabase
      .from('entitlements')
      .select('value')
      .eq('org_id', orgId)
      .eq('flag', 'canExportPDF') // Proxy pentru Pro+
      .eq('value', true)
      .maybeSingle();

    return !!data;
  }

  private async checkAdminAccess(orgId: string, userId: string): Promise<boolean> {
    if (SUPABASE_URL.includes('dev-placeholder')) {
      return true;
    }

    const { data } = await supabase
      .from('org_members')
      .select('role')
      .eq('org_id', orgId)
      .eq('user_id', userId)
      .in('role', ['owner', 'admin'])
      .maybeSingle();

    return !!data;
  }

  private async getRetentionDays(orgId: string): Promise<number> {
    if (SUPABASE_URL.includes('dev-placeholder')) {
      return 90; // Mock retention
    }

    // Obține retention pe baza planului
    const { data } = await supabase
      .from('subscriptions')
      .select('plan_code')
      .eq('org_id', orgId)
      .maybeSingle();

    const plan = data?.plan_code || 'pilot';

    // Retention days pe plan conform ruleset.yml
    const retentionMap: Record<string, number> = {
      promptforge_pilot: 30,
      promptforge_pro: 90,
      promptforge_enterprise: 365,
    };

    return retentionMap[plan] || 30;
  }
}

// Export singleton
export const cloudHistory = CloudHistoryManager.getInstance();
