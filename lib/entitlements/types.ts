// Centralized entitlements configuration for PromptForge v3
// This file defines all feature flags and their plan requirements

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
  | 'canExportMD'
  | 'hasCloudHistory'
  | 'hasEvaluatorAI'
  | 'hasWhiteLabel'
  | 'hasSeatsGT1';

export type PlanType = 'pilot' | 'pro' | 'enterprise';

export type EntitlementSource = 'plan' | 'addon' | 'license' | 'trial';

// Plan requirements for each feature flag
export const FEATURE_PLAN_REQUIREMENTS: Record<FeatureFlag, PlanType> = {
  // Export features
  canExportMD: 'pilot',           // Basic export - available to all
  canExportPDF: 'pro',            // PDF export - Pro and above
  canExportJSON: 'pro',           // JSON export - Pro and above
  canExportBundleZip: 'enterprise', // Bundle export - Enterprise only
  
  // GPT testing
  canUseGptTestReal: 'pro',       // Real GPT testing - Pro and above
  
  // API access
  canUseAPI: 'enterprise',        // API access - Enterprise only
  
  // Module management
  canCreateModules: 'pro',        // Create modules - Pro and above
  canManageProjects: 'pro',       // Project management - Pro and above
  
  // Analytics and advanced features
  canViewAnalytics: 'pro',        // Analytics - Pro and above
  canExportCustomFormats: 'enterprise', // Custom formats - Enterprise only
  canUseAdvancedFeatures: 'enterprise', // Advanced features - Enterprise only
  
  // Additional features
  hasCloudHistory: 'pro',         // Cloud history - Pro and above
  hasEvaluatorAI: 'pro',          // AI evaluator - Pro and above
  hasWhiteLabel: 'enterprise',    // White labeling - Enterprise only
  hasSeatsGT1: 'pro'              // Multiple seats - Pro and above
};

// Plan entitlements matrix
export const PLAN_ENTITLEMENTS: Record<PlanType, Record<FeatureFlag, boolean>> = {
  pilot: {
    canExportMD: true,
    canExportPDF: false,
    canExportJSON: false,
    canExportBundleZip: false,
    canUseGptTestReal: false,
    canUseAPI: false,
    canCreateModules: false,
    canManageProjects: false,
    canViewAnalytics: false,
    canExportCustomFormats: false,
    canUseAdvancedFeatures: false,
    hasCloudHistory: false,
    hasEvaluatorAI: false,
    hasWhiteLabel: false,
    hasSeatsGT1: false
  },
  pro: {
    canExportMD: true,
    canExportPDF: true,
    canExportJSON: true,
    canExportBundleZip: false,
    canUseGptTestReal: true,
    canUseAPI: false,
    canCreateModules: true,
    canManageProjects: true,
    canViewAnalytics: true,
    canExportCustomFormats: false,
    canUseAdvancedFeatures: false,
    hasCloudHistory: true,
    hasEvaluatorAI: true,
    hasWhiteLabel: false,
    hasSeatsGT1: true
  },
  enterprise: {
    canExportMD: true,
    canExportPDF: true,
    canExportJSON: true,
    canExportBundleZip: true,
    canUseGptTestReal: true,
    canUseAPI: true,
    canCreateModules: true,
    canManageProjects: true,
    canViewAnalytics: true,
    canExportCustomFormats: true,
    canUseAdvancedFeatures: true,
    hasCloudHistory: true,
    hasEvaluatorAI: true,
    hasWhiteLabel: true,
    hasSeatsGT1: true
  }
};

// Helper function to check if a plan has access to a feature
export function hasFeatureAccess(plan: PlanType, feature: FeatureFlag): boolean {
  return PLAN_ENTITLEMENTS[plan]?.[feature] || false;
}

// Helper function to get required plan for a feature
export function getRequiredPlan(feature: FeatureFlag): PlanType {
  return FEATURE_PLAN_REQUIREMENTS[feature];
}

// Helper function to check if current plan can access feature
export function canAccessFeature(currentPlan: PlanType, requiredPlan: PlanType): boolean {
  const planHierarchy: PlanType[] = ['pilot', 'pro', 'enterprise'];
  const currentIndex = planHierarchy.indexOf(currentPlan);
  const requiredIndex = planHierarchy.indexOf(requiredPlan);
  
  return currentIndex >= requiredIndex;
}

// Export operation entitlements mapping
export const EXPORT_OPERATION_ENTITLEMENTS: Record<string, FeatureFlag> = {
  'export_pdf': 'canExportPDF',
  'export_json': 'canExportJSON',
  'export_bundle': 'canExportBundleZip',
  'export_md': 'canExportMD'
};

// API operation entitlements mapping
export const API_OPERATION_ENTITLEMENTS: Record<string, FeatureFlag> = {
  'gpt_test_real': 'canUseGptTestReal',
  'api_access': 'canUseAPI',
  'export_bundle': 'canExportBundleZip'
};

// Entitlement validation error codes
export const ENTITLEMENT_ERROR_CODES = {
  ENTITLEMENT_REQUIRED: 'ENTITLEMENT_REQUIRED',
  PLAN_UPGRADE_REQUIRED: 'PLAN_UPGRADE_REQUIRED',
  FEATURE_NOT_AVAILABLE: 'FEATURE_NOT_AVAILABLE'
} as const;

export type EntitlementErrorCode = typeof ENTITLEMENT_ERROR_CODES[keyof typeof ENTITLEMENT_ERROR_CODES];

// Entitlement validation result
export interface EntitlementValidationResult {
  hasAccess: boolean;
  requiredPlan?: PlanType;
  currentPlan?: PlanType;
  errorCode?: EntitlementErrorCode;
  message?: string;
}
