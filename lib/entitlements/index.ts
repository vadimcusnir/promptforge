import { PlanType } from './types'

// Central configuration for gating thresholds and entitlements
export const ENTITLEMENTS_CONFIG = {
  // Score thresholds
  MIN_EXPORT_SCORE: 80,
  
  // Plan-based feature flags
  FEATURES: {
    canExportPDF: {
      FREE: false,
      CREATOR: true,
      PRO: true,
      ENTERPRISE: true,
    },
    canExportJSON: {
      FREE: false,
      CREATOR: true,
      PRO: true,
      ENTERPRISE: true,
    },
    canExportZIP: {
      FREE: false,
      CREATOR: false,
      PRO: true,
      ENTERPRISE: true,
    },
    canUseGptTestReal: {
      FREE: false,
      CREATOR: false,
      PRO: true,
      ENTERPRISE: true,
    },
    canExportBundleZip: {
      FREE: false,
      CREATOR: false,
      PRO: true,
      ENTERPRISE: true,
    },
  },
  
  // Export format restrictions
  EXPORT_FORMATS: {
    FREE: ['md'],
    CREATOR: ['md', 'pdf', 'json'],
    PRO: ['md', 'pdf', 'json', 'zip'],
    ENTERPRISE: ['md', 'pdf', 'json', 'zip'],
  },
} as const

export function checkEntitlement(plan: PlanType, feature: keyof typeof ENTITLEMENTS_CONFIG.FEATURES): boolean {
  return ENTITLEMENTS_CONFIG.FEATURES[feature][plan]
}

export function getAvailableExportFormats(plan: PlanType): string[] {
  return [...ENTITLEMENTS_CONFIG.EXPORT_FORMATS[plan]]
}

export function canExportFormat(plan: PlanType, format: string, score?: number): boolean {
  const availableFormats = getAvailableExportFormats(plan)
  const hasFormatAccess = availableFormats.includes(format)
  
  // PDF/JSON require score >= 80
  if ((format === 'pdf' || format === 'json') && score !== undefined) {
    return hasFormatAccess && score >= ENTITLEMENTS_CONFIG.MIN_EXPORT_SCORE
  }
  
  return hasFormatAccess
}

export function getEntitlementReason(plan: PlanType, format: string, score?: number): string {
  const availableFormats = getAvailableExportFormats(plan)
  
  if (!availableFormats.includes(format)) {
    return `Export to ${format.toUpperCase()} requires ${plan === 'FREE' ? 'CREATOR' : 'PRO'} plan or higher`
  }
  
  if ((format === 'pdf' || format === 'json') && score !== undefined && score < ENTITLEMENTS_CONFIG.MIN_EXPORT_SCORE) {
    return `Export to ${format.toUpperCase()} requires score ≥ ${ENTITLEMENTS_CONFIG.MIN_EXPORT_SCORE} (current: ${score})`
  }
  
  return ''
}
