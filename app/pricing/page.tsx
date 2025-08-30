'use client'

import { useState } from 'react'
import { NavBar } from '@/components/ui/navbar'
import { BadgePlan } from '@/components/ui/badge-plan'
import { cn } from '@/lib/utils'

interface PricingFeature {
  name: string
  free: boolean | string
  creator: boolean | string
  pro: boolean | string
  enterprise: boolean | string
}

const pricingFeatures: PricingFeature[] = [
  {
    name: 'Module Access',
    free: '5 modules',
    creator: '15 modules',
    pro: '50 modules',
    enterprise: 'Unlimited'
  },
  {
    name: 'Export Formats',
    free: 'Text only',
    creator: 'Text + Markdown',
    pro: 'Text + Markdown + PDF + JSON',
    enterprise: 'All formats + Bundle ZIP'
  },
  {
    name: 'Real Test Execution',
    free: false,
    creator: false,
    pro: true,
    enterprise: true
  },
  {
    name: 'API Access',
    free: false,
    creator: false,
    pro: false,
    enterprise: true
  },
  {
    name: 'Custom Integrations',
    free: false,
    creator: false,
    pro: false,
    enterprise: true
  },
  {
    name: 'Priority Support',
    free: false,
    creator: false,
    pro: true,
    enterprise: true
  },
  {
    name: 'Advanced Analytics',
    free: false,
    creator: false,
    pro: true,
    enterprise: true
  }
]

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: { monthly: 0, annual: 0 },
    description: 'Get started with basic prompt engineering',
    features: ['5 modules', 'Text export', 'Community support'],
    cta: 'Get Started',
    popular: false
  },
  {
    id: 'creator',
    name: 'Creator',
    price: { monthly: 29, annual: 290 },
    description: 'Perfect for content creators and writers',
    features: ['15 modules', 'Markdown export', 'Email support'],
    cta: 'Start Creator',
    popular: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price: { monthly: 99, annual: 990 },
    description: 'Full-featured for professionals and teams',
    features: ['50 modules', 'All exports', 'Real tests', 'Priority support'],
    cta: 'Go Pro',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: { monthly: 299, annual: 2990 },
    description: 'Custom solutions for large organizations',
    features: ['Unlimited modules', 'API access', 'Custom integrations', 'Dedicated support'],
    cta: 'Contact Sales',
    popular: false
  }
]

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)
  const [currentPlan] = useState<'free' | 'creator' | 'pro' | 'enterprise'>('free')

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free'
    return `$${price}`
  }

  const getFeatureValue = (feature: PricingFeature, planId: string) => {
    const value = feature[planId as keyof PricingFeature]
    if (typeof value === 'boolean') {
      return value ? '✓' : '✗'
    }
    return value
  }

  const getFeatureColor = (feature: PricingFeature, planId: string) => {
    const value = feature[planId as keyof PricingFeature]
    if (typeof value === 'boolean') {
      return value ? 'text-brand' : 'text-textMuted'
    }
    return 'text-text'
  }

  return (
    <div className="min-h-screen bg-bg">
      <NavBar plan={currentPlan} />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-text mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-textMuted font-ui max-w-2xl mx-auto mb-8">
            Scale your prompt engineering with our comprehensive module library
          </p>

            {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={cn('font-ui text-sm', !isAnnual ? 'text-text' : 'text-textMuted')}>
              Monthly
              </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-surfaceAlt border border-border transition-colors focus-ring"
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-brand transition-transform',
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
            <span className={cn('font-ui text-sm', isAnnual ? 'text-text' : 'text-textMuted')}>
              Annual
            </span>
            {isAnnual && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-brand/10 text-brand border border-brand/20">
                Save 17%
              </span>
              )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => (
            <div
                key={plan.id}
              className={cn(
                'relative rounded-xl border p-6 transition-all duration-200',
                plan.popular
                  ? 'border-brand bg-surfaceAlt shadow-glow'
                  : 'border-border bg-surface hover:border-brand/50'
              )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand text-bg">
                    Most Popular
                  </span>
                  </div>
                )}

              <div className="text-center mb-6">
                <BadgePlan plan={plan.id as any} className="mb-3" />
                <h3 className="font-display text-xl font-semibold text-text mb-2">
                  {plan.name}
                </h3>
                <p className="text-textMuted font-ui text-sm mb-4">
                  {plan.description}
                </p>
                <div className="mb-4">
                  <span className="font-display text-3xl font-bold text-text">
                    {formatPrice(isAnnual ? plan.price.annual : plan.price.monthly)}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className="font-ui text-textMuted">
                      /{isAnnual ? 'year' : 'month'}
                    </span>
                  )}
                </div>
                <button
                  className={cn(
                    'w-full py-3 px-4 rounded-md font-ui font-medium transition-all duration-200 focus-ring',
                    plan.popular
                      ? 'bg-brand text-bg hover:bg-brand/90 active:scale-98'
                      : 'bg-surfaceAlt text-text border border-border hover:border-brand/50'
                  )}
                >
                  {plan.cta}
                </button>
              </div>

              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="rune-executable w-4 h-4 flex-shrink-0">
                      <div className="star-8 w-2 h-2" />
                    </div>
                    <span className="text-textMuted font-ui text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                      </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="font-display text-2xl font-semibold text-text">
              Feature Comparison
            </h2>
                </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-ui font-medium text-text">Features</th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="text-center p-4 font-ui font-medium text-text">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pricingFeatures.map((feature, index) => (
                  <tr key={index} className="border-b border-border last:border-b-0">
                    <td className="p-4 font-ui text-text">{feature.name}</td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="text-center p-4">
                        <span className={cn('font-ui text-sm', getFeatureColor(feature, plan.id))}>
                          {getFeatureValue(feature, plan.id)}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="font-display text-2xl font-semibold text-text text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-ui font-semibold text-text mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-textMuted font-ui text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="font-ui font-semibold text-text mb-2">
                What's included in the free plan?
              </h3>
              <p className="text-textMuted font-ui text-sm">
                The free plan includes access to 5 basic modules and text export functionality.
            </p>
          </div>
            <div>
              <h3 className="font-ui font-semibold text-text mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-textMuted font-ui text-sm">
                We offer a 30-day money-back guarantee for all paid plans.
              </p>
        </div>
            <div>
              <h3 className="font-ui font-semibold text-text mb-2">
                Is there a team discount?
              </h3>
              <p className="text-textMuted font-ui text-sm">
                Yes, Enterprise plans include volume discounts for teams of 10+ users.
              </p>
      </div>
          </div>
        </div>
      </div>
    </div>
  )
}