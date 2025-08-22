import { useState, useEffect, useCallback } from 'react';
// Types for entitlements
export interface UserEntitlements {
  canUseAllModules: boolean;
  canExportMD: boolean;
  canExportPDF: boolean;
  canExportJSON: boolean;
  canUseGptTestReal: boolean;
  hasCloudHistory: boolean;
  hasEvaluatorAI: boolean;
  hasAPI: boolean;
  hasWhiteLabel: boolean;
  canExportBundleZip: boolean;
  hasSeatsGT1: boolean;
}

interface EntitlementsResponse {
  org_id: string;
  user_id: string;
  entitlements: UserEntitlements;
  subscription?: {
    plan_code: 'pilot' | 'pro' | 'enterprise';
    status: string;
    seats: number;
    trial_end?: string;
    current_period_end?: string;
  };
  membership: {
    role: string;
  };
  fallback?: 'org';
}

interface UseEntitlementsReturn {
  entitlements: UserEntitlements | null;
  subscription: EntitlementsResponse['subscription'] | null;
  membership: EntitlementsResponse['membership'] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  
  // Convenience methods for common checks
  canUseFeature: (feature: keyof UserEntitlements) => boolean;
  isPlan: (plan: 'pilot' | 'pro' | 'enterprise') => boolean;
  isTrialing: () => boolean;
  daysUntilExpiry: () => number | null;
}

/**
 * Hook for accessing user entitlements and subscription status
 * Handles caching, error states, and provides convenience methods
 */
export function useEntitlements(orgId: string): UseEntitlementsReturn {
  const [data, setData] = useState<EntitlementsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntitlements = useCallback(async () => {
    if (!orgId) {
      setError('Organization ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/entitlements?org_id=${orgId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const entitlementsData: EntitlementsResponse = await response.json();
      setData(entitlementsData);
      
      // Cache in localStorage for offline access
      localStorage.setItem(
        `promptforge_entitlements_${orgId}`,
        JSON.stringify({
          data: entitlementsData,
          timestamp: Date.now(),
        })
      );

    } catch (err) {
      console.error('[useEntitlements] Error fetching entitlements:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch entitlements');
      
      // Try to load from cache as fallback
      try {
        const cached = localStorage.getItem(`promptforge_entitlements_${orgId}`);
        if (cached) {
          const { data: cachedData, timestamp } = JSON.parse(cached);
          // Use cache if less than 5 minutes old
          if (Date.now() - timestamp < 5 * 60 * 1000) {
            setData(cachedData);
            setError('Using cached data (offline)');
          }
        }
      } catch (cacheErr) {
        console.error('[useEntitlements] Cache fallback failed:', cacheErr);
      }
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  // Initial fetch
  useEffect(() => {
    fetchEntitlements();
  }, [fetchEntitlements]);

  // Convenience methods
  const canUseFeature = useCallback((feature: keyof UserEntitlements): boolean => {
    if (!data?.entitlements) return false;
    const value = data.entitlements[feature];
    return typeof value === 'boolean' ? value : false;
  }, [data]);

  const isPlan = useCallback((plan: 'pilot' | 'pro' | 'enterprise'): boolean => {
    return data?.subscription?.plan_code === plan;
  }, [data]);

  const isTrialing = useCallback((): boolean => {
    const subscription = data?.subscription;
    if (!subscription?.trial_end) return false;
    return new Date(subscription.trial_end) > new Date();
  }, [data]);

  const daysUntilExpiry = useCallback((): number | null => {
    const subscription = data?.subscription;
    if (!subscription?.current_period_end) return null;
    
    const expiryDate = new Date(subscription.current_period_end);
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  }, [data]);

  return {
    entitlements: data?.entitlements || null,
    subscription: data?.subscription || null,
    membership: data?.membership || null,
    loading,
    error,
    refetch: fetchEntitlements,
    canUseFeature,
    isPlan,
    isTrialing,
    daysUntilExpiry,
  };
}

/**
 * Default entitlements for pilot plan (fallback)
 */
export const DEFAULT_PILOT_ENTITLEMENTS: UserEntitlements = {
  canUseAllModules: false,
  canExportMD: true,
  canExportPDF: false,
  canExportJSON: false,
  canExportBundleZip: false,
  canUseGptTestReal: false,
  hasCloudHistory: false,
  hasEvaluatorAI: false,
  hasAPI: false,
  hasWhiteLabel: false,
  hasSeatsGT1: false,
  hasExportDesigner: false,
  hasFinTechPack: false,
  hasEduPack: false,
  hasIndustryTemplates: false,
  maxRunsPerDay: 10,
  maxSeats: 1,
};

/**
 * Hook for checking a specific entitlement without loading all data
 * Useful for simple feature gates
 */
export function useEntitlement(orgId: string, feature: keyof UserEntitlements): boolean {
  const { canUseFeature } = useEntitlements(orgId);
  return canUseFeature(feature);
}

/**
 * Context provider for entitlements (optional, for global state)
 */
import { createContext, useContext, ReactNode } from 'react';

interface EntitlementsContextValue {
  entitlements: UserEntitlements | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const EntitlementsContext = createContext<EntitlementsContextValue | null>(null);

interface EntitlementsProviderProps {
  children: ReactNode;
  orgId: string;
}

export function EntitlementsProvider({ children, orgId }: EntitlementsProviderProps) {
  const entitlementsData = useEntitlements(orgId);
  
  const value: EntitlementsContextValue = {
    entitlements: entitlementsData.entitlements,
    loading: entitlementsData.loading,
    error: entitlementsData.error,
    refetch: entitlementsData.refetch,
  };

  return (
    <EntitlementsContext.Provider value={value}>
      {children}
    </EntitlementsContext.Provider>
  );
}

export function useEntitlementsContext(): EntitlementsContextValue {
  const context = useContext(EntitlementsContext);
  if (!context) {
    throw new Error('useEntitlementsContext must be used within EntitlementsProvider');
  }
  return context;
}
