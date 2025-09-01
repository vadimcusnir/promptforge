'use client'

import { Check, X, Lock } from 'lucide-react'
import { BillingCycle } from './pricing-section'

interface PlanComparisonProps {
  billingCycle?: BillingCycle
}

const FEATURES = [
  {
    category: 'Core Features',
    items: [
      { name: 'Simulate Test', free: true, creator: true, pro: true, enterprise: true },
      { name: 'Run Real Test', free: false, creator: false, pro: true, enterprise: true },
      { name: 'All 50 Modules', free: false, creator: true, pro: true, enterprise: true },
      { name: 'Live Evaluator', free: false, creator: false, pro: true, enterprise: true },
    ]
  },
  {
    category: 'Export Formats',
    items: [
      { name: 'Export .txt', free: true, creator: true, pro: true, enterprise: true },
      { name: 'Export .md', free: false, creator: true, pro: true, enterprise: true },
      { name: 'Export .pdf', free: false, creator: false, pro: true, enterprise: true },
      { name: 'Export .json', free: false, creator: false, pro: true, enterprise: true },
      { name: 'Bundle .zip', free: false, creator: false, pro: false, enterprise: true },
    ]
  },
  {
    category: 'Storage & History',
    items: [
      { name: 'Local History', free: true, creator: true, pro: true, enterprise: true },
      { name: 'Cloud History', free: false, creator: true, pro: true, enterprise: true },
      { name: 'Unlimited Storage', free: false, creator: false, pro: false, enterprise: true },
    ]
  },
  {
    category: 'Advanced Features',
    items: [
      { name: 'RUM Dashboards', free: false, creator: false, pro: true, enterprise: true },
      { name: 'API Access', free: false, creator: false, pro: false, enterprise: true },
      { name: 'White-label', free: false, creator: false, pro: false, enterprise: true },
      { name: 'Custom Integrations', free: false, creator: false, pro: false, enterprise: true },
    ]
  },
  {
    category: 'Support',
    items: [
      { name: 'Basic Support', free: true, creator: true, pro: true, enterprise: true },
      { name: 'Priority Support', free: false, creator: true, pro: true, enterprise: true },
      { name: 'Dedicated Support', free: false, creator: false, pro: false, enterprise: true },
    ]
  }
]

const PLANS = [
  { id: 'free', name: 'Free', price: 0 },
  { id: 'creator', name: 'Creator', price: 19 },
  { id: 'pro', name: 'Pro', price: 49 },
  { id: 'enterprise', name: 'Enterprise', price: 199 }
]

export function PlanComparison({ billingCycle = 'monthly' }: PlanComparisonProps) {
  const getPrice = (basePrice: number) => {
    if (basePrice === 0) return 'Free'
    return billingCycle === 'annual' ? `$${basePrice * 10}/year` : `$${basePrice}/month`
  }

  const getFeatureIcon = (hasFeature: boolean) => {
    if (hasFeature) {
      return <Check className="w-5 h-5 text-[var(--accent)]" />
    }
    return <X className="w-5 h-5 text-[var(--fg-muted)]" />
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Compare Plans</h2>
        <p className="text-[var(--fg-muted)] max-w-2xl mx-auto">
          Choose the plan that fits your needs. All plans include our core prompt engineering tools, 
          with advanced features unlocked as you grow.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Header */}
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left py-4 px-6 font-semibold">Features</th>
              {PLANS.map((plan) => (
                <th key={plan.id} className="text-center py-4 px-6">
                  <div className="font-semibold text-lg">{plan.name}</div>
                  <div className="text-[var(--fg-muted)] text-sm mt-1">
                    {getPrice(plan.price)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Features */}
          <tbody>
            {FEATURES.map((category, categoryIndex) => (
              <React.Fragment key={categoryIndex}>
                {/* Category Header */}
                <tr className="border-b border-[var(--border)]/50">
                  <td colSpan={5} className="py-3 px-6 font-semibold text-[var(--brand)] bg-[var(--border)]/10">
                    {category.category}
                  </td>
                </tr>
                
                {/* Category Items */}
                {category.items.map((item, itemIndex) => (
                  <tr key={itemIndex} className="border-b border-[var(--border)]/30 hover:bg-[var(--border)]/5">
                    <td className="py-3 px-6 text-[var(--fg-primary)]">
                      {item.name}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {getFeatureIcon(item.free)}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {getFeatureIcon(item.creator)}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {getFeatureIcon(item.pro)}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {getFeatureIcon(item.enterprise)}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Trial Note */}
      <div className="mt-8 p-4 bg-[var(--brand)]/10 border border-[var(--brand)]/20 rounded-lg">
        <div className="flex items-center gap-2 text-[var(--brand)] font-medium">
          <Lock className="w-5 h-5" />
          Pro Plan Trial
        </div>
        <p className="text-[var(--fg-muted)] mt-2">
          Try Pro for 7 days with watermarked exports. Upgrade to remove watermarks and unlock 
          full professional features.
        </p>
      </div>
    </div>
  )
}
