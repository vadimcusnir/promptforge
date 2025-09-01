'use client'

import React from 'react'
import { Check, X, Lock } from 'lucide-react'
import { PLANS, PLAN_FEATURES, PlanType, BillingCycle } from '@/lib/plans'

interface PlanComparisonMatrixProps {
  billingCycle?: BillingCycle
}

const FEATURE_CATEGORIES = [
  {
    name: 'Core Features',
    features: [
      { id: 'modules', name: 'Module Access', description: 'Access to prompt engineering modules' },
      { id: 'live_testing', name: 'Run Real Tests', description: 'Test prompts against real AI models' },
      { id: 'cloud_history', name: 'Cloud History', description: 'Store and sync prompt history' },
    ]
  },
  {
    name: 'Export Formats',
    features: [
      { id: 'txt_export', name: '.txt Export', description: 'Plain text export' },
      { id: 'md_export', name: '.md Export', description: 'Markdown formatted export' },
      { id: 'pdf_export', name: '.pdf Export', description: 'Professional PDF documents' },
      { id: 'json_export', name: '.json Export', description: 'Structured data export' },
      { id: 'zip_export', name: '.zip Bundle', description: 'Complete prompt packages' },
    ]
  },
  {
    name: 'Advanced Features',
    features: [
      { id: 'api_access', name: 'API Access', description: 'High-performance API endpoints' },
      { id: 'team_seats', name: 'Team Seats', description: 'Collaborate with team members' },
      { id: 'custom_limits', name: 'Custom Rate Limits', description: 'Customizable API limits' },
    ]
  }
]

const PLAN_ORDER: PlanType[] = ['FREE', 'CREATOR', 'PRO', 'ENTERPRISE']

export function PlanComparisonMatrix({ billingCycle = 'monthly' }: PlanComparisonMatrixProps) {
  const getFeatureIcon = (featureId: string, planId: PlanType) => {
    const feature = PLAN_FEATURES.find(f => f.id === featureId)
    if (!feature) return <X className="w-4 h-4 text-pf-text-muted" />
    
    const isAvailable = feature.availableIn.includes(planId)
    if (isAvailable) {
      return <Check className="w-4 h-4 text-pf-gold" />
    }
    return <X className="w-4 h-4 text-pf-text-muted" />
  }

  const getPlanPrice = (planId: PlanType) => {
    const plan = PLANS[planId]
    if (plan.monthlyPrice === 0) return 'Free'
    return billingCycle === 'annual' ? `$${plan.annualPrice}/year` : `$${plan.monthlyPrice}/month`
  }

  return (
    <div className="bg-pf-card rounded-lg p-8 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-pf-text mb-4">
          Compare All Plans
        </h2>
        <p className="text-pf-text-muted max-w-2xl mx-auto">
          Choose the plan that fits your needs. All plans include our core prompt engineering tools, 
          with advanced features unlocked as you grow.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Header */}
          <thead>
            <tr className="border-b border-pf-border">
              <th className="text-left py-4 px-6 font-semibold text-pf-text">Features</th>
              {PLAN_ORDER.map((planId) => {
                const plan = PLANS[planId]
                return (
                  <th key={planId} className="text-center py-4 px-6">
                    <div className="font-semibold text-lg text-pf-text">{plan.name}</div>
                    <div className="text-pf-text-muted text-sm mt-1">
                      {getPlanPrice(planId)}
                    </div>
                    {plan.popular && (
                      <div className="text-xs text-pf-gold font-medium mt-1">Recommended</div>
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>

          {/* Features */}
          <tbody>
            {FEATURE_CATEGORIES.map((category, categoryIndex) => (
              <React.Fragment key={categoryIndex}>
                {/* Category Header */}
                <tr className="border-b border-pf-border/50">
                  <td colSpan={5} className="py-3 px-6 font-semibold text-pf-gold bg-pf-input/20">
                    {category.name}
                  </td>
                </tr>
                
                {/* Category Items */}
                {category.features.map((feature, itemIndex) => (
                  <tr key={itemIndex} className="border-b border-pf-border/30 hover:bg-pf-input/10">
                    <td className="py-3 px-6 text-pf-text">
                      <div className="font-medium">{feature.name}</div>
                      <div className="text-xs text-pf-text-muted">{feature.description}</div>
                    </td>
                    {PLAN_ORDER.map((planId) => (
                      <td key={planId} className="py-3 px-6 text-center">
                        {getFeatureIcon(feature.id, planId)}
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Trial Note */}
      <div className="mt-8 p-4 bg-pf-gold/10 border border-pf-gold/20 rounded-lg">
        <div className="flex items-center gap-2 text-pf-gold font-medium">
          <Lock className="w-5 h-5" />
          Pro Plan Trial
        </div>
        <p className="text-pf-text-muted mt-2">
          Try Pro for 7 days with watermarked exports. Upgrade to remove watermarks and unlock 
          full professional features.
        </p>
      </div>
    </div>
  )
}
