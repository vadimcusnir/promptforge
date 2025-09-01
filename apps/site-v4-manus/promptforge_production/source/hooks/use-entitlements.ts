import { useState, useEffect, useCallback } from 'react';

// =================================
// ENTITLEMENTS HOOK - PLAN CAPABILITIES
// =================================

export type PlanType = 'FREE' | 'CREATOR' | 'PRO' | 'ENTERPRISE';

interface Entitlements {
  userPlan: PlanType | null;
  canExportPDF: boolean;
  canExportJSON: boolean;
  canExportZIP: boolean;
  canUseTestEngine: boolean;
  canUseAPI: boolean;
  maxModules: number;
  maxExportsPerDay: number;
  maxTokensPerRequest: number;
  hasCloudHistory: boolean;
  hasTeamCollaboration: boolean;
  hasPrioritySupport: boolean;
}

interface PlanCapabilities {
  [key in PlanType]: {
    name: string;
    price: number;
    features: string[];
    limits: {
      maxModules: number;
      maxExportsPerDay: number;
      maxTokensPerRequest: number;
    };
    capabilities: {
      canExportPDF: boolean;
      canExportJSON: boolean;
      canExportZIP: boolean;
      canUseTestEngine: boolean;
      canUseAPI: boolean;
      hasCloudHistory: boolean;
      hasTeamCollaboration: boolean;
      hasPrioritySupport: boolean;
    };
  };
}

const PLAN_CAPABILITIES: PlanCapabilities = {
  FREE: {
    name: 'Free',
    price: 0,
    features: [
      'Access to basic modules (M01, M10, M18)',
      'Export to TXT format',
      'Basic prompt generation',
      'Community support'
    ],
    limits: {
      maxModules: 3,
      maxExportsPerDay: 5,
      maxTokensPerRequest: 500
    },
    capabilities: {
      canExportPDF: false,
      canExportJSON: false,
      canExportZIP: false,
      canUseTestEngine: false,
      canUseAPI: false,
      hasCloudHistory: false,
      hasTeamCollaboration: false,
      hasPrioritySupport: false
    }
  },
  CREATOR: {
    name: 'Creator',
    price: 29,
    features: [
      'Access to all modules',
      'Export to TXT and MD formats',
      'Advanced prompt generation',
      'Email support',
      'Basic analytics'
    ],
    limits: {
      maxModules: 50,
      maxExportsPerDay: 50,
      maxTokensPerRequest: 1500
    },
    capabilities: {
      canExportPDF: false,
      canExportJSON: false,
      canExportZIP: false,
      canUseTestEngine: false,
      canUseAPI: false,
      hasCloudHistory: false,
      hasTeamCollaboration: false,
      hasPrioritySupport: false
    }
  },
  PRO: {
    name: 'Pro',
    price: 99,
    features: [
      'Access to all modules',
      'Export to TXT, MD, PDF, and JSON formats',
      'Live Test Engine',
      'Cloud history and analytics',
      'Priority support',
      'Advanced 7D optimization'
    ],
    limits: {
      maxModules: 50,
      maxExportsPerDay: 200,
      maxTokensPerRequest: 4000
    },
    capabilities: {
      canExportPDF: true,
      canExportJSON: true,
      canExportZIP: false,
      canUseTestEngine: true,
      canUseAPI: false,
      hasCloudHistory: true,
      hasTeamCollaboration: false,
      hasPrioritySupport: true
    }
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 299,
    features: [
      'Access to all modules',
      'Export to all formats including ZIP bundles',
      'Full API access',
      'Team collaboration',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantees'
    ],
    limits: {
      maxModules: 50,
      maxExportsPerDay: 1000,
      maxTokensPerRequest: 8000
    },
    capabilities: {
      canExportPDF: true,
      canExportJSON: true,
      canExportZIP: true,
      canUseTestEngine: true,
      canUseAPI: true,
      hasCloudHistory: true,
      hasTeamCollaboration: true,
      hasPrioritySupport: true
    }
  }
};

export function useEntitlements(): Entitlements {
  const [userPlan, setUserPlan] = useState<PlanType | null>(null);
  const [entitlements, setEntitlements] = useState<Entitlements>({
    userPlan: null,
    canExportPDF: false,
    canExportJSON: false,
    canExportZIP: false,
    canUseTestEngine: false,
    canUseAPI: false,
    maxModules: 3,
    maxExportsPerDay: 5,
    maxTokensPerRequest: 500,
    hasCloudHistory: false,
    hasTeamCollaboration: false,
    hasPrioritySupport: false
  });

  // Load user plan from storage or API
  useEffect(() => {
    const loadUserPlan = async () => {
      try {
        // Check localStorage first
        const storedPlan = localStorage.getItem('user_plan') as PlanType;
        if (storedPlan && PLAN_CAPABILITIES[storedPlan]) {
          setUserPlan(storedPlan);
          updateEntitlements(storedPlan);
          return;
        }

        // Fallback to API call
        const response = await fetch('/api/user/plan');
        if (response.ok) {
          const { plan } = await response.json();
          if (plan && PLAN_CAPABILITIES[plan]) {
            setUserPlan(plan);
            updateEntitlements(plan);
            localStorage.setItem('user_plan', plan);
          }
        }
      } catch (error) {
        console.warn('Failed to load user plan:', error);
        // Default to FREE plan
        setUserPlan('FREE');
        updateEntitlements('FREE');
      }
    };

    loadUserPlan();
  }, []);

  const updateEntitlements = useCallback((plan: PlanType) => {
    const capabilities = PLAN_CAPABILITIES[plan];
    setEntitlements({
      userPlan: plan,
      ...capabilities.capabilities,
      ...capabilities.limits
    });
  }, []);

  const upgradePlan = useCallback(async (newPlan: PlanType) => {
    try {
      const response = await fetch('/api/user/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: newPlan }),
      });

      if (response.ok) {
        setUserPlan(newPlan);
        updateEntitlements(newPlan);
        localStorage.setItem('user_plan', newPlan);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to upgrade plan:', error);
      return false;
    }
  }, [updateEntitlements]);

  const checkModuleAccess = useCallback((requiredPlan: PlanType): boolean => {
    if (!userPlan) return false;
    
    const planLevels = { FREE: 0, CREATOR: 1, PRO: 2, ENTERPRISE: 3 };
    return planLevels[userPlan] >= planLevels[requiredPlan];
  }, [userPlan]);

  const checkExportCapability = useCallback((format: string): boolean => {
    switch (format.toLowerCase()) {
      case 'pdf':
        return entitlements.canExportPDF;
      case 'json':
        return entitlements.canExportJSON;
      case 'zip':
        return entitlements.canExportZIP;
      case 'txt':
      case 'md':
        return true;
      default:
        return false;
    }
  }, [entitlements]);

  const getPlanInfo = useCallback((plan: PlanType) => {
    return PLAN_CAPABILITIES[plan];
  }, []);

  const getUpgradePath = useCallback((currentPlan: PlanType | null): PlanType[] => {
    if (!currentPlan) return ['CREATOR', 'PRO', 'ENTERPRISE'];
    
    const planOrder: PlanType[] = ['FREE', 'CREATOR', 'PRO', 'ENTERPRISE'];
    const currentIndex = planOrder.indexOf(currentPlan);
    return planOrder.slice(currentIndex + 1);
  }, []);

  return {
    ...entitlements,
    // Additional methods
    upgradePlan,
    checkModuleAccess,
    checkExportCapability,
    getPlanInfo,
    getUpgradePath
  };
}

// Export plan capabilities for use in other components
export { PLAN_CAPABILITIES };
export type { Entitlements, PlanCapabilities };
