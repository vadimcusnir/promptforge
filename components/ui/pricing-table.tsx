'use client';

import { Check, X } from 'lucide-react';
import { GTMEvents } from '@/lib/gtm-events';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    subtitle: 'Get Started with Prompt Engineering',
    price: '$0',
    period: 'forever',
    description: 'Try the 7D engine with limits',
    cta: 'Start Free',
    popular: false,
    features: [
      { name: '10 runs/month', included: true },
      { name: '5 basic modules (M01-M05)', included: true },
      { name: 'Demo test engine', included: true },
      { name: 'Export .txt only', included: true },
      { name: 'Basic analytics', included: true },
      { name: 'API access', included: false },
      { name: 'Community support', included: true },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    subtitle: 'Production-Ready Prompt Engineering',
    price: '$29',
    period: 'month',
    originalPrice: '$36',
    description: 'Complete 7D Parameter Engine + 50 Modules',
    cta: 'Upgrade to Pro',
    popular: true,
    socialProof: '78% choose this plan',
    features: [
      { name: '1,000 runs/month', included: true },
      { name: '50 semantic modules (M01-M50)', included: true },
      { name: 'GPT-4 test engine (≥80 score)', included: true },
      { name: 'Export .txt/.md/.json/.pdf', included: true },
      { name: 'Audit & telemetry dashboard', included: true },
      { name: 'API access (500 calls/mo)', included: false },
      { name: 'Priority support (<24h)', included: true },
    ],
  },
  {
    id: 'team',
    name: 'Team',
    subtitle: 'Enterprise Prompt Operations',
    price: '$99',
    period: 'month',
    description: 'Scale prompt engineering across teams',
    cta: 'Contact Sales',
    popular: false,
    socialProof: '+1,200 active teams',
    features: [
      { name: '10,000 runs/month', included: true },
      { name: 'Unlimited seats (5+ users)', included: true },
      { name: 'White-label deployment', included: true },
      { name: 'Full API access (unlimited)', included: true },
      { name: 'Custom module development', included: true },
      { name: 'Dedicated success manager', included: true },
      { name: '99.9% SLA guarantee', included: true },
    ],
  },
];

export function PricingTable() {
  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {plans.map(plan => (
        <div
          key={plan.id}
          className={`relative rounded-lg border p-8 glass-effect ${
            plan.popular
              ? 'border-[#d1a954] bg-gradient-to-b from-[#d1a954]/10 to-transparent'
              : 'border-[#5a5a5a]/30'
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-[#d1a954] to-[#d1a954]/80 text-black px-4 py-2 rounded-full text-sm font-semibold">
                Most Popular
              </div>
            </div>
          )}

          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <p className="text-[#5a5a5a] text-sm mb-4">{plan.subtitle}</p>

            <div className="mb-4">
              {plan.originalPrice && (
                <span className="text-[#5a5a5a] line-through text-lg mr-2">
                  {plan.originalPrice}
                </span>
              )}
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-[#5a5a5a]">/{plan.period}</span>
            </div>

            <button
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                plan.popular
                  ? 'bg-gradient-to-r from-[#d1a954] to-[#d1a954]/80 text-black hover:shadow-lg hover:shadow-[#d1a954]/25'
                  : plan.id === 'basic'
                    ? 'border border-[#5a5a5a] text-[#5a5a5a] hover:border-white hover:text-white'
                    : 'bg-white text-black hover:bg-[#5a5a5a] hover:text-white'
              }`}
              onClick={() => {
                const price = plan.id === 'basic' ? 0 : plan.id === 'pro' ? 29 : 99;
                GTMEvents.pricingUpgrade(plan.name, price);
              }}
            >
              {plan.cta}
            </button>

            {plan.socialProof && <p className="text-sm text-[#5a5a5a] mt-3">{plan.socialProof}</p>}
          </div>

          <div className="space-y-4">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                {feature.included ? (
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <X className="w-5 h-5 text-[#5a5a5a] flex-shrink-0" />
                )}
                <span className={feature.included ? 'text-white' : 'text-[#5a5a5a]'}>
                  {feature.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
