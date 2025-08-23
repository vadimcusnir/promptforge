/**
 * Export Bundle - License Management
 * Maps subscription plans to license notices
 */

export type PlanCode = 'pilot' | 'pro' | 'enterprise';

/**
 * Get license notice for subscription plan
 */
export function licenseNoticeForPlan(plan: PlanCode): string {
  switch (plan) {
    case 'pilot':
      return '© PROMPTFORGE v3 — Pilot License (Non-Commercial Use)';
    case 'pro':
      return '© PROMPTFORGE v3 — Pro License';
    case 'enterprise':
      return '© PROMPTFORGE v3 — Enterprise License';
    default:
      return '© PROMPTFORGE v3 — Standard License';
  }
}

/**
 * Get watermark text for trial users
 */
export function getTrialWatermark(): string {
  return process.env.EXPORT_WATERMARK_TRIAL || 'TRIAL — Not for Redistribution';
}

/**
 * Check if plan allows specific export format
 */
export function planAllowsFormat(plan: PlanCode, format: string): boolean {
  const formatPermissions: Record<PlanCode, string[]> = {
    pilot: ['md'],
    pro: ['md', 'json', 'pdf'],
    enterprise: ['md', 'json', 'pdf', 'zip'],
  };

  return formatPermissions[plan]?.includes(format) || false;
}

/**
 * Get all allowed formats for plan
 */
export function getAllowedFormats(plan: PlanCode): string[] {
  const formatPermissions: Record<PlanCode, string[]> = {
    pilot: ['md'],
    pro: ['md', 'json', 'pdf'],
    enterprise: ['md', 'json', 'pdf', 'zip'],
  };

  return formatPermissions[plan] || [];
}
