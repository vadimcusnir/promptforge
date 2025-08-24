"use client";

import { createClient } from '@supabase/supabase-js';

export interface UserEntitlements {
  planTier: 'free' | 'creator' | 'pro' | 'enterprise';
  canGeneratePrompt: boolean;
  canUseGPTOptimization: boolean;
  canExportJSON: boolean;
  canExportPDF: boolean;
  canExportBundleZip: boolean;
  hasCloudHistory: boolean;
  hasAdvancedAnalytics: boolean;
  hasCustomModules: boolean;
  hasTeamCollaboration: boolean;
  hasPrioritySupport: boolean;
  monthlyRunsRemaining: number;
  monthlyGPTOptimizationsRemaining: number;
  monthlyExportsRemaining: number;
  maxTeamMembers: number;
  maxCustomModules: number;
  maxStorageGB: number;
}

export interface EntitlementCheck {
  allowed: boolean;
  reason?: string;
  upgradeRequired?: boolean;
  currentPlan: string;
  requiredPlan: string;
}

export class EntitlementsManager {
  private static instance: EntitlementsManager;
  private supabase: any;
  private entitlements: UserEntitlements | null = null;
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseAnonKey) {
      this.supabase = createClient(supabaseUrl, supabaseAnonKey);
    }
  }

  static getInstance(): EntitlementsManager {
    if (!EntitlementsManager.instance) {
      EntitlementsManager.instance = new EntitlementsManager();
    }
    return EntitlementsManager.instance;
  }

  async getUserEntitlements(userId: string, orgId: string): Promise<UserEntitlements> {
    // Check cache first
    if (this.entitlements && Date.now() - this.lastFetch < this.CACHE_DURATION) {
      return this.entitlements;
    }

    try {
      if (!this.supabase) {
        // Fallback to mock data if Supabase is not configured
        return this.getMockEntitlements('free');
      }

      // Fetch user's subscription and usage data from Supabase
      const { data: membership, error: membershipError } = await this.supabase
        .from('user_memberships')
        .select('plan_tier, runs_used_this_month, gpt_optimizations_used_this_month')
        .eq('user_id', userId)
        .eq('org_id', orgId)
        .single();

      if (membershipError && membershipError.code !== 'PGRST116') {
        console.error('Error fetching membership:', membershipError);
        return this.getMockEntitlements('free');
      }

      const planTier = membership?.plan_tier || 'free';
      const runsUsed = membership?.runs_used_this_month || 0;
      const gptOptimizationsUsed = membership?.gpt_optimizations_used_this_month || 0;

      // Calculate entitlements based on plan tier and usage
      const entitlements = this.calculateEntitlements(planTier, runsUsed, gptOptimizationsUsed);
      
      // Cache the result
      this.entitlements = entitlements;
      this.lastFetch = Date.now();
      
      return entitlements;

    } catch (error) {
      console.error('Error fetching entitlements:', error);
      return this.getMockEntitlements('free');
    }
  }

  private calculateEntitlements(planTier: string, runsUsed: number, gptOptimizationsUsed: number): UserEntitlements {
    const planLimits = this.getPlanLimits(planTier);
    
    return {
      planTier: planTier as any,
      canGeneratePrompt: runsUsed < planLimits.monthlyRuns,
      canUseGPTOptimization: planTier !== 'free' && gptOptimizationsUsed < planLimits.monthlyGPTOptimizations,
      canExportJSON: planTier !== 'free',
      canExportPDF: planTier === 'pro' || planTier === 'enterprise',
      canExportBundleZip: planTier === 'enterprise',
      hasCloudHistory: planTier !== 'free',
      hasAdvancedAnalytics: planTier === 'pro' || planTier === 'enterprise',
      hasCustomModules: planTier === 'enterprise',
      hasTeamCollaboration: planTier === 'pro' || planTier === 'enterprise',
      hasPrioritySupport: planTier === 'enterprise',
      monthlyRunsRemaining: Math.max(0, planLimits.monthlyRuns - runsUsed),
      monthlyGPTOptimizationsRemaining: Math.max(0, planLimits.monthlyGPTOptimizations - gptOptimizationsUsed),
      monthlyExportsRemaining: planLimits.monthlyExports,
      maxTeamMembers: planLimits.maxTeamMembers,
      maxCustomModules: planLimits.maxCustomModules,
      maxStorageGB: planLimits.maxStorageGB,
    };
  }

  private getPlanLimits(planTier: string): {
    monthlyRuns: number;
    monthlyGPTOptimizations: number;
    monthlyExports: number;
    maxTeamMembers: number;
    maxCustomModules: number;
    maxStorageGB: number;
  } {
    switch (planTier) {
      case 'free':
        return {
          monthlyRuns: 10,
          monthlyGPTOptimizations: 0,
          monthlyExports: 5,
          maxTeamMembers: 1,
          maxCustomModules: 0,
          maxStorageGB: 1,
        };
      case 'creator':
        return {
          monthlyRuns: 100,
          monthlyGPTOptimizations: 25,
          monthlyExports: 50,
          maxTeamMembers: 3,
          maxCustomModules: 5,
          maxStorageGB: 10,
        };
      case 'pro':
        return {
          monthlyRuns: 500,
          monthlyGPTOptimizations: 150,
          monthlyExports: 200,
          maxTeamMembers: 10,
          maxCustomModules: 25,
          maxStorageGB: 50,
        };
      case 'enterprise':
        return {
          monthlyRuns: -1, // Unlimited
          monthlyGPTOptimizations: -1, // Unlimited
          monthlyExports: -1, // Unlimited
          maxTeamMembers: -1, // Unlimited
          maxCustomModules: -1, // Unlimited
          maxStorageGB: -1, // Unlimited
        };
      default:
        return this.getPlanLimits('free');
    }
  }

  private getMockEntitlements(planTier: string): UserEntitlements {
    return this.calculateEntitlements(planTier, 0, 0);
  }

  async canGeneratePrompt(userId: string, orgId: string): Promise<EntitlementCheck> {
    const entitlements = await this.getUserEntitlements(userId, orgId);
    
    if (entitlements.canGeneratePrompt) {
      return {
        allowed: true,
        currentPlan: entitlements.planTier,
        requiredPlan: entitlements.planTier,
      };
    }

    return {
      allowed: false,
      reason: `Monthly limit reached. Upgrade to continue generating prompts.`,
      upgradeRequired: true,
      currentPlan: entitlements.planTier,
      requiredPlan: 'creator',
    };
  }

  async canUseGPTOptimization(userId: string, orgId: string): Promise<EntitlementCheck> {
    const entitlements = await this.getUserEntitlements(userId, orgId);
    
    if (entitlements.canUseGPTOptimization) {
      return {
        allowed: true,
        currentPlan: entitlements.planTier,
        requiredPlan: entitlements.planTier,
      };
    }

    return {
      allowed: false,
      reason: `GPT optimization requires Creator plan or higher.`,
      upgradeRequired: true,
      currentPlan: entitlements.planTier,
      requiredPlan: 'creator',
    };
  }

  async canExportFormat(userId: string, orgId: string, format: string): Promise<EntitlementCheck> {
    const entitlements = await this.getUserEntitlements(userId, orgId);
    
    let allowed = false;
    let requiredPlan = 'free';
    
    switch (format) {
      case 'txt':
      case 'md':
        allowed = true;
        requiredPlan = 'free';
        break;
      case 'json':
        allowed = entitlements.canExportJSON;
        requiredPlan = 'creator';
        break;
      case 'pdf':
        allowed = entitlements.canExportPDF;
        requiredPlan = 'pro';
        break;
      case 'zip':
        allowed = entitlements.canExportBundleZip;
        requiredPlan = 'enterprise';
        break;
      default:
        allowed = false;
        requiredPlan = 'creator';
    }

    if (allowed) {
      return {
        allowed: true,
        currentPlan: entitlements.planTier,
        requiredPlan: entitlements.planTier,
      };
    }

    return {
      allowed: false,
      reason: `${format.toUpperCase()} export requires ${requiredPlan} plan or higher.`,
      upgradeRequired: true,
      currentPlan: entitlements.planTier,
      requiredPlan,
    };
  }

  async trackPromptGeneration(userId: string, orgId: string): Promise<void> {
    try {
      if (!this.supabase) return;

      // Update usage in Supabase
      await this.supabase
        .from('user_memberships')
        .update({ 
          runs_used_this_month: this.supabase.raw('runs_used_this_month + 1'),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('org_id', orgId);

      // Invalidate cache to force refresh
      this.entitlements = null;
    } catch (error) {
      console.error('Error tracking prompt generation:', error);
    }
  }

  async trackGPTOptimization(userId: string, orgId: string): Promise<void> {
    try {
      if (!this.supabase) return;

      // Update usage in Supabase
      await this.supabase
        .from('user_memberships')
        .update({ 
          gpt_optimizations_used_this_month: this.supabase.raw('gpt_optimizations_used_this_month + 1'),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('org_id', orgId);

      // Invalidate cache to force refresh
      this.entitlements = null;
    } catch (error) {
      console.error('Error tracking GPT optimization:', error);
    }
  }

  getUpgradeRecommendation(currentPlan: string, feature: string): string {
    const recommendations = {
      'generate': {
        'free': 'Upgrade to Creator plan for 100 monthly runs',
        'creator': 'Upgrade to Pro plan for 500 monthly runs',
        'pro': 'Upgrade to Enterprise for unlimited runs',
      },
      'test': {
        'free': 'Upgrade to Creator plan for GPT optimization',
        'creator': 'Upgrade to Pro plan for 150 monthly GPT tests',
        'pro': 'Upgrade to Enterprise for unlimited GPT tests',
      },
      'export-json': {
        'free': 'Upgrade to Creator plan for JSON export',
      },
      'export-pdf': {
        'free': 'Upgrade to Pro plan for PDF export',
        'creator': 'Upgrade to Pro plan for PDF export',
      },
      'export-zip': {
        'free': 'Upgrade to Enterprise for bundle export',
        'creator': 'Upgrade to Enterprise for bundle export',
        'pro': 'Upgrade to Enterprise for bundle export',
      },
    };

    return recommendations[feature as keyof typeof recommendations]?.[currentPlan as keyof typeof recommendations[keyof typeof recommendations]] || 
           'Upgrade your plan to access this feature';
  }

  // Method to invalidate cache (useful after plan changes)
  invalidateCache(): void {
    this.entitlements = null;
    this.lastFetch = 0;
  }
}

