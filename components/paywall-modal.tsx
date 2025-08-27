"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Crown, Zap, Building, Lock } from "lucide-react"
import { useAnalytics } from "@/hooks/use-analytics"
import type { PlanType } from "@/lib/entitlements/types"

interface PaywallModalProps {
  trigger: React.ReactNode
  featureName?: string
  planRequired?: PlanType
  onUpgrade?: (plan: string) => void
}

const PLANS = {
  pilot: {
    name: 'Pilot',
    price_monthly: 0,
    price_yearly: 0,
    features: [
      'Basic Prompt Generation',
      'Score Calculation',
      'Markdown Export'
    ]
  },
  pro: {
    name: 'Pro',
    price_monthly: 49,
    price_yearly: 490,
    features: [
      'PDF & JSON Export',
      'Real GPT Testing',
      'Cloud History',
      'AI Evaluator',
      'Advanced Analytics'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price_monthly: 299,
    price_yearly: 2990,
    features: [
      'Bundle Export (ZIP)',
      'API Access',
      'White Labeling',
      'Team Management',
      'Priority Support'
    ]
  }
}

export function PaywallModal({ trigger, featureName = 'This feature', planRequired = 'pro', onUpgrade }: PaywallModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(planRequired)
  const plan = PLANS[selectedPlan]
  const analytics = useAnalytics()

  // Track paywall view when modal opens
  useEffect(() => {
    if (isOpen) {
      analytics.paywallViewed(featureName, planRequired)
    }
  }, [isOpen, featureName, planRequired, analytics])

  const planIcons = {
    pilot: Crown,
    pro: Zap,
    enterprise: Building,
  }

  const Icon = planIcons[selectedPlan as keyof typeof planIcons] || Zap

  // Don't show paywall for pilot plans
  if (planRequired === 'pilot') {
    return <>{trigger}</>
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-md bg-black/95 border border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-gold-400 flex items-center justify-center gap-2">
            <Icon className="w-6 h-6" />
            Upgrade Required
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-300 mb-2">
              <span className="font-semibold text-gold-400">{featureName}</span> requires a {plan.name} plan
            </p>
            <p className="text-sm text-gray-400">Unlock this feature and more with an upgrade</p>
          </div>

          <Card className="bg-gray-900/50 border-gold-400/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg text-gold-400 flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  {plan.name}
                </h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {plan.price_monthly === 0 ? 'Free' : `$${plan.price_monthly}`}
                  </div>
                  <div className="text-sm text-gray-400">
                    {plan.price_monthly === 0 ? 'forever' : 'per month'}
                  </div>
                </div>
              </div>

              <ul className="space-y-2">
                {plan.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                analytics.paywallCtaClick(featureName, planRequired, 'close')
                setIsOpen(false)
              }}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
            >
              Maybe Later
            </Button>
            {plan.price_monthly === 0 ? (
              <Button
                onClick={() => {
                  analytics.paywallCtaClick(featureName, planRequired, 'upgrade')
                  onUpgrade?.(selectedPlan)
                  setIsOpen(false)
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                Get Started
              </Button>
            ) : (
              <Button
                onClick={() => {
                  analytics.paywallCtaClick(featureName, planRequired, 'upgrade')
                  onUpgrade?.(selectedPlan)
                  setIsOpen(false)
                }}
                className="flex-1 bg-gold-400 hover:bg-gold-500 text-black font-semibold"
              >
                Upgrade Now
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
