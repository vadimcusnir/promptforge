"use client";

import React from 'react';
import { X, Zap, Building, Crown, Check, ArrowRight } from 'lucide-react';
import { useEntitlements, UserEntitlements } from '@/hooks/use-entitlements';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: string;
  feature: keyof UserEntitlements;
  orgId: string;
}

interface PlanFeature {
  code: 'pilot' | 'pro' | 'enterprise';
  name: string;
  price: number;
  annualPrice: number;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  recommended?: boolean;
}

const PLANS: PlanFeature[] = [
  {
    code: 'pilot',
    name: 'Pilot',
    price: 0,
    annualPrice: 0,
    icon: Zap,
    features: [
      'Basic prompt generation',
      'Markdown export',
      '10 runs per day',
      'Community support'
    ],
  },
  {
    code: 'pro',
    name: 'Pro',
    price: 29,
    annualPrice: 290, // ~17% discount
    icon: Crown,
    recommended: true,
    features: [
      'All modules unlocked',
      'GPT Test Engine',
      'PDF & JSON export',
      'Cloud history',
      'Evaluator AI',
      '100 runs per day',
      'Priority support'
    ],
  },
  {
    code: 'enterprise',
    name: 'Enterprise',
    price: 99,
    annualPrice: 990,
    icon: Building,
    features: [
      'Everything in Pro',
      'API access',
      'Bundle ZIP export',
      'White-label options',
      'Multi-seat support',
      '1000 runs per day',
      'Dedicated support'
    ],
  },
];

export function PaywallModal({ isOpen, onClose, trigger, feature, orgId }: PaywallModalProps) {
  const { subscription, isPlan } = useEntitlements(orgId);
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'annual'>('monthly');

  if (!isOpen) return null;

  const getTriggerMessage = (trigger: string, feature: keyof UserEntitlements) => {
    const messages: Record<string, string> = {
      gpt_test_real: 'Real GPT test scoring requires Pro plan. Get detailed analysis and optimization recommendations.',
      export_pdf: 'PDF reports require Pro plan. Generate professional documentation with your branding.',
      export_json: 'JSON export with metadata requires Pro plan. Export structured data for integrations.',
      export_bundle: 'Bundle exports require Enterprise plan. Get complete packages with assets and manifests.',
      api_access: 'API access requires Enterprise plan. Integrate PromptForge into your workflows.',
      evaluator_ai: 'AI evaluation requires Pro plan. Get intelligent scoring and improvement suggestions.',
      cloud_history: 'Cloud history requires Pro plan. Access your prompts from anywhere.',
      multi_seat: 'Multi-seat access requires Enterprise plan. Collaborate with your team.',
      white_label: 'White-label options require Enterprise plan. Brand the platform as your own.',
    };

    return messages[trigger] || `${feature.replace(/([A-Z])/g, ' $1').toLowerCase()} requires a premium plan. Upgrade to unlock advanced capabilities.`;
  };

  const getRecommendedPlan = (feature: keyof UserEntitlements): 'pro' | 'enterprise' => {
    const enterpriseFeatures: (keyof UserEntitlements)[] = [
      'hasAPI',
      'canExportBundleZip',
      'hasWhiteLabel',
      'hasSeatsGT1'
    ];

    return enterpriseFeatures.includes(feature) ? 'enterprise' : 'pro';
  };

  const recommendedPlanCode = getRecommendedPlan(feature);
  const currentPlan = subscription?.plan_code;

  const handleUpgrade = async (planCode: 'pro' | 'enterprise') => {
    try {
      // Create Stripe checkout session
      const response = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orgId,
          planCode,
          billingCycle,
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
      // You could show an error toast here
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/50 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">
              Upgrade Required
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Trigger Message */}
          <div className="mb-8 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-amber-300 text-lg">
              {getTriggerMessage(trigger, feature)}
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-slate-800 p-1 rounded-lg inline-flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === 'annual'
                    ? 'bg-white text-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Annual
                <span className="ml-1 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded">
                  Save 17%
                </span>
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => {
              const IconComponent = plan.icon;
              const isCurrentPlan = currentPlan === plan.code;
              const isRecommended = plan.code === recommendedPlanCode;
              const price = billingCycle === 'annual' ? plan.annualPrice : plan.price;
              const monthlyPrice = billingCycle === 'annual' ? Math.round(plan.annualPrice / 12) : plan.price;

              return (
                <div
                  key={plan.code}
                  className={`relative p-6 rounded-xl border transition-all ${
                    isRecommended
                      ? 'border-amber-500/50 bg-gradient-to-br from-amber-500/5 to-orange-500/5 ring-2 ring-amber-500/20'
                      : isCurrentPlan
                      ? 'border-blue-500/50 bg-blue-500/5'
                      : 'border-slate-700/50 bg-slate-800/30'
                  }`}
                >
                  {isRecommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                        Recommended
                      </div>
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Current Plan
                      </div>
                    </div>
                  )}

                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className={`p-3 rounded-full ${
                        isRecommended 
                          ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20' 
                          : 'bg-slate-700/50'
                      }`}>
                        <IconComponent className={`w-6 h-6 ${
                          isRecommended ? 'text-amber-400' : 'text-slate-300'
                        }`} />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {plan.name}
                      </h3>
                      <div className="space-y-1">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-3xl font-bold text-white">
                            ${monthlyPrice}
                          </span>
                          <span className="text-slate-400">/month</span>
                        </div>
                        {billingCycle === 'annual' && plan.price > 0 && (
                          <div className="text-sm text-green-400">
                            ${price}/year (save ${(plan.price * 12) - plan.annualPrice})
                          </div>
                        )}
                      </div>
                    </div>

                    <ul className="space-y-3 text-sm">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-slate-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-4">
                      {isCurrentPlan ? (
                        <div className="w-full py-3 px-4 bg-blue-500/20 text-blue-300 rounded-lg font-medium">
                          Current Plan
                        </div>
                      ) : plan.code === 'pilot' ? (
                        <div className="w-full py-3 px-4 bg-slate-700/50 text-slate-400 rounded-lg font-medium">
                          Free Forever
                        </div>
                      ) : (
                        <button
                          onClick={() => handleUpgrade(plan.code as 'pro' | 'enterprise')}
                          className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                            isRecommended
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:from-amber-400 hover:to-orange-400'
                              : 'bg-slate-700 text-white hover:bg-slate-600'
                          }`}
                        >
                          Upgrade to {plan.name}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <div className="flex items-center justify-center gap-8 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                30-day money-back guarantee
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                Cancel anytime
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                Instant activation
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
