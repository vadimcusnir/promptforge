'use client';

import React, { ReactNode } from 'react';
import { useEntitlements, UserEntitlements } from '@/hooks/use-entitlements';
import { PaywallModal } from './PaywallModal';
import { PaywallInline } from './PaywallInline';

interface EntitlementGateProps {
  /**
   * Organization ID for checking entitlements
   */
  orgId: string;

  /**
   * Feature key to check in entitlements
   */
  feature: keyof UserEntitlements;

  /**
   * Content to show when user has access
   */
  children: ReactNode;

  /**
   * Display mode for paywall
   */
  mode?: 'modal' | 'inline' | 'replace';

  /**
   * Custom trigger message for paywall
   */
  trigger?: string;

  /**
   * Fallback content when access is denied (for 'replace' mode)
   */
  fallback?: ReactNode;

  /**
   * Show loading state while checking entitlements
   */
  showLoading?: boolean;

  /**
   * Custom className for styling
   */
  className?: string;
}

/**
 * EntitlementGate - Modern feature gating component
 *
 * Checks user entitlements and shows appropriate paywall when access is denied.
 * Supports multiple display modes and integrates with real Stripe billing.
 */
export function EntitlementGate({
  orgId,
  feature,
  children,
  mode = 'modal',
  trigger,
  fallback,
  showLoading = true,
  className,
}: EntitlementGateProps) {
  const { entitlements, loading, error, canUseFeature } = useEntitlements(orgId);
  const [showPaywall, setShowPaywall] = React.useState(false);

  // Handle loading state
  if (loading && showLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-slate-800/50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-700 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state - show children with warning
  if (error) {
    console.warn(`[EntitlementGate] Error checking ${feature}:`, error);
    return (
      <div className={className}>
        {children}
        {error.includes('offline') && (
          <div className="mt-2 text-xs text-amber-400">⚠️ Using cached permissions</div>
        )}
      </div>
    );
  }

  // Check if user has access to the feature
  const hasAccess = canUseFeature(feature);

  if (hasAccess) {
    return <div className={className}>{children}</div>;
  }

  // User doesn't have access - show paywall based on mode
  const featureTrigger = trigger || getDefaultTrigger(feature);

  switch (mode) {
    case 'modal':
      return (
        <div className={className}>
          <div onClick={() => setShowPaywall(true)} className="cursor-pointer">
            {children}
          </div>
          <PaywallModal
            isOpen={showPaywall}
            onClose={() => setShowPaywall(false)}
            trigger={featureTrigger}
            feature={feature}
            orgId={orgId}
          />
        </div>
      );

    case 'inline':
      return (
        <div className={className}>
          <PaywallInline trigger={featureTrigger} feature={feature} orgId={orgId} />
        </div>
      );

    case 'replace':
      return (
        <div className={className}>
          {fallback || (
            <EntitlementLocked feature={feature} onUpgrade={() => setShowPaywall(true)} />
          )}
          <PaywallModal
            isOpen={showPaywall}
            onClose={() => setShowPaywall(false)}
            trigger={featureTrigger}
            feature={feature}
            orgId={orgId}
          />
        </div>
      );

    default:
      return <div className={className}>{children}</div>;
  }
}

/**
 * Default locked placeholder for replace mode
 */
function EntitlementLocked({
  feature,
  onUpgrade,
}: {
  feature: keyof UserEntitlements;
  onUpgrade: () => void;
}) {
  const getFeatureInfo = (feature: keyof UserEntitlements) => {
    const featureMap = {
      canUseGptTestReal: {
        icon: Zap,
        name: 'GPT Test Engine',
        plan: 'Pro',
      },
      canExportPDF: {
        icon: Crown,
        name: 'PDF Export',
        plan: 'Pro',
      },
      canExportJSON: {
        icon: Crown,
        name: 'JSON Export',
        plan: 'Pro',
      },
      canExportBundleZip: {
        name: 'Bundle Export',
        plan: 'Enterprise',
      },
      hasAPI: {
        name: 'API Access',
        plan: 'Enterprise',
      },
      hasEvaluatorAI: {
        icon: Zap,
        name: 'Evaluator AI',
        plan: 'Pro',
      },
    };

    return (
      featureMap[feature] || {
        name: 'Premium Feature',
        plan: 'Pro',
      }
    );
  };

  const info = getFeatureInfo(feature);
  const IconComponent = info.icon;

  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6 text-center">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full">
          <IconComponent className="w-6 h-6 text-amber-400" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mb-2"></h3>

      <p className="text-slate-300 text-sm mb-4">Upgrade to {info.plan} to unlock this feature</p>

      <button
        onClick={onUpgrade}
        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-medium rounded-lg hover:from-amber-400 hover:to-orange-400 transition-all"
      >
        Upgrade to {info.plan}
      </button>
    </div>
  );
}

/**
 * Get default trigger message for features
 */
function getDefaultTrigger(feature: keyof UserEntitlements): string {
  const triggerMap: Record<keyof UserEntitlements, string> = {
    canUseAllModules: 'access_all_modules',
    canExportMD: 'export_markdown',
    canExportPDF: 'export_pdf',
    canExportJSON: 'export_json',
    canExportBundleZip: 'export_bundle',
    canUseGptTestReal: 'gpt_test_real',
    hasCloudHistory: 'cloud_history',
    hasEvaluatorAI: 'evaluator_ai',
    hasAPI: 'api_access',
    hasWhiteLabel: 'white_label',
    hasSeatsGT1: 'multi_seat',
    hasExportDesigner: 'export_designer',
    hasFinTechPack: 'fintech_pack',
    hasEduPack: 'edu_pack',
    hasIndustryTemplates: 'industry_templates',
    maxRunsPerDay: 'run_limit',
    maxSeats: 'seat_limit',
  };

  return triggerMap[feature] || 'premium_feature';
}

/**
 * Higher-order component for wrapping components with entitlement checks
 */
export function withEntitlementGate<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  feature: keyof UserEntitlements,
  options: {
    mode?: EntitlementGateProps['mode'];
    trigger?: string;
    fallback?: ReactNode;
  } = {}
) {
  return function EntitlementWrappedComponent(props: P & { orgId: string }) {
    const { orgId, ...componentProps } = props;

    return (
      <EntitlementGate
        orgId={orgId}
        feature={feature}
        mode={options.mode}
        trigger={options.trigger}
        fallback={options.fallback}
      >
        <WrappedComponent {...(componentProps as P)} />
      </EntitlementGate>
    );
  };
}

/**
 * Hook for conditional rendering based on entitlements
 */
export function useFeatureAccess(orgId: string, feature: keyof UserEntitlements) {
  const { canUseFeature, loading, error } = useEntitlements(orgId);

  return {
    hasAccess: canUseFeature(feature),
    loading,
    error,
  };
}
