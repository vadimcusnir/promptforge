'use client';

import React from 'react';
import { Crown, Zap, Building, ArrowRight, Sparkles } from 'lucide-react';
import { useEntitlements, UserEntitlements } from '@/hooks/use-entitlements';

interface PaywallInlineProps {
  trigger: string;
  feature: keyof UserEntitlements;
  orgId: string;
  compact?: boolean;
}

export function PaywallInline({ trigger, feature, orgId, compact = false }: PaywallInlineProps) {
  const { subscription, isPlan, isTrialing, daysUntilExpiry } = useEntitlements(orgId);

  const getFeatureInfo = (feature: keyof UserEntitlements) => {
    const featureMap = {
      canUseGptTestReal: {
        name: 'GPT Test Engine',
        description: 'Real-time testing with detailed analysis',
        requiredPlan: 'pro' as const,
        icon: Zap,
      },
      canExportPDF: {
        name: 'PDF Export',
        description: 'Professional PDF reports with your branding',
        requiredPlan: 'pro' as const,
        icon: Crown,
      },
      canExportJSON: {
        name: 'JSON Export',
        description: 'Structured data export for integrations',
        requiredPlan: 'pro' as const,
        icon: Crown,
      },
      canExportBundleZip: {
        name: 'Bundle Export',
        description: 'Complete packages with assets and manifests',
        requiredPlan: 'enterprise' as const,
        icon: Building,
      },
      hasAPI: {
        name: 'API Access',
        description: 'Integrate PromptForge into your workflows',
        requiredPlan: 'enterprise' as const,
        icon: Building,
      },
      hasEvaluatorAI: {
        name: 'Evaluator AI',
        description: 'Intelligent scoring and improvement suggestions',
        requiredPlan: 'pro' as const,
        icon: Sparkles,
      },
    };

    return (
      featureMap[feature] || {
        name: 'Premium Feature',
        description: 'Advanced functionality for professional use',
        requiredPlan: 'pro' as const,
        icon: Crown,
      }
    );
  };

  const featureInfo = getFeatureInfo(feature);
  const IconComponent = featureInfo.icon;
  const currentPlan = subscription?.plan_code || 'pilot';
  const isCurrentTrialing = isTrialing();
  const daysLeft = daysUntilExpiry();

  const handleUpgrade = async () => {
    try {
      const response = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orgId,
          billingCycle: 'monthly',
          successUrl: window.location.href,
          cancelUrl: window.location.href,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout:', error);
    }
  };

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg">
              <IconComponent className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-white">{featureInfo.name}</h4>
              <p className="text-xs text-slate-400">
                Requires {featureInfo.requiredPlan === 'pro' ? 'Pro' : 'Enterprise'}
              </p>
            </div>
          </div>

          <button
            onClick={handleUpgrade}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-sm font-medium rounded-md hover:from-amber-400 hover:to-orange-400 transition-all"
          >
            Upgrade
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-slate-700/50 rounded-xl p-6">
      <div className="text-center space-y-4">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full">
            <IconComponent className="w-8 h-8 text-amber-400" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white"></h3>
          <p className="text-slate-300">{featureInfo.description}</p>
        </div>

        {/* Plan Info */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">Current Plan</span>
            <span className="text-sm font-medium text-white capitalize">
              {currentPlan}
              {isCurrentTrialing && (
                <span className="ml-2 text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                  Trial
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Required Plan</span>
            <span className="text-sm font-medium text-amber-400 capitalize">
              {featureInfo.requiredPlan}
            </span>
          </div>

          {isCurrentTrialing && daysLeft !== null && (
            <div className="mt-3 pt-3 border-t border-slate-700/50">
              <div className="text-xs text-slate-400">
                Trial expires in {daysLeft} day{daysLeft !== 1 ? 's' : ''}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={handleUpgrade}
          className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-medium rounded-lg hover:from-amber-400 hover:to-orange-400 transition-all flex items-center justify-center gap-2"
        >
          Upgrade to {featureInfo.requiredPlan === 'pro' ? 'Pro' : 'Enterprise'}
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Footer */}
        <div className="text-xs text-slate-400 space-y-1">
          <div>✓ 30-day money-back guarantee</div>
          <div>✓ Instant activation</div>
        </div>
      </div>
    </div>
  );
}
