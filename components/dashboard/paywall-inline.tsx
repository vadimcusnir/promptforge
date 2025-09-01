'use client'

import { useState, useCallback } from 'react'
import { useTelemetry } from '@/hooks/use-telemetry'
import { useEntitlements } from '@/hooks/use-entitlements'
import { 
  Lock, 
  Zap, 
  Crown, 
  ArrowRight, 
  Check, 
  X,
  Star,
  Users,
  Download,
  Code,
  BarChart3
} from 'lucide-react'

interface PaywallInlineProps {
  feature: string
  reason: 'plan_required' | 'score_too_low' | 'trial_expired' | 'usage_limit'
  currentPlan: string
  requiredPlan: string
  currentScore?: number
  requiredScore?: number
  onUpgrade: () => void
  onViewPricing: () => void
  onClose?: () => void
  showClose?: boolean
}

const PLAN_FEATURES = {
  creator: {
    name: 'Creator',
    price: '$19/month',
    features: [
      'Unlimited prompt runs',
      'Basic analytics',
      'Export to PDF',
      'Community support'
    ],
    icon: Users,
    color: 'text-blue-500'
  },
  pro: {
    name: 'Pro',
    price: '$49/month',
    features: [
      'Everything in Creator',
      'Advanced analytics',
      'Export to JSON/ZIP',
      'API access',
      'Priority support',
      'Custom integrations'
    ],
    icon: Crown,
    color: 'text-purple-500'
  },
  enterprise: {
    name: 'Enterprise',
    price: 'Custom',
    features: [
      'Everything in Pro',
      'Unlimited users',
      'Custom branding',
      'Dedicated support',
      'SLA guarantee',
      'On-premise deployment'
    ],
    icon: Star,
    color: 'text-yellow-500'
  }
}

const FEATURE_ICONS = {
  export: Download,
  api: Code,
  analytics: BarChart3,
  real_test: Zap,
  watermark_removal: Crown
}

export function PaywallInline({
  feature,
  reason,
  currentPlan,
  requiredPlan,
  currentScore,
  requiredScore,
  onUpgrade,
  onViewPricing,
  onClose,
  showClose = true
}: PaywallInlineProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { trackPaywallShown, trackPaywallAccepted, trackUserAction } = useTelemetry()
  const { entitlements } = useEntitlements()

  const currentPlanInfo = PLAN_FEATURES[currentPlan as keyof typeof PLAN_FEATURES]
  const requiredPlanInfo = PLAN_FEATURES[requiredPlan as keyof typeof PLAN_FEATURES]
  const FeatureIcon = FEATURE_ICONS[feature as keyof typeof FEATURE_ICONS] || Lock

  const handleUpgrade = useCallback(() => {
    trackPaywallAccepted({
      feature,
      reason,
      current_plan: currentPlan,
      required_plan: requiredPlan,
      current_score: currentScore,
      required_score: requiredScore
    })
    onUpgrade()
  }, [feature, reason, currentPlan, requiredPlan, currentScore, requiredScore, onUpgrade, trackPaywallAccepted])

  const handleViewPricing = useCallback(() => {
    trackUserAction('paywall_pricing_viewed', {
      feature,
      reason,
      current_plan: currentPlan,
      required_plan: requiredPlan
    })
    onViewPricing()
  }, [feature, reason, currentPlan, requiredPlan, onViewPricing, trackUserAction])

  const handleExpand = useCallback(() => {
    setIsExpanded(!isExpanded)
    trackUserAction('paywall_expanded', { feature, reason })
  }, [isExpanded, feature, reason, trackUserAction])

  const getReasonMessage = () => {
    switch (reason) {
      case 'plan_required':
        return `This feature requires ${requiredPlanInfo.name} plan or higher`
      case 'score_too_low':
        return `Score must be ${requiredScore} or higher to export`
      case 'trial_expired':
        return 'Your trial has expired. Upgrade to continue using this feature'
      case 'usage_limit':
        return 'You\'ve reached your usage limit for this feature'
      default:
        return 'This feature is not available with your current plan'
    }
  }

  const getReasonIcon = () => {
    switch (reason) {
      case 'plan_required':
        return Lock
      case 'score_too_low':
        return X
      case 'trial_expired':
        return Crown
      case 'usage_limit':
        return BarChart3
      default:
        return Lock
    }
  }

  const getReasonColor = () => {
    switch (reason) {
      case 'plan_required':
        return 'text-blue-500'
      case 'score_too_low':
        return 'text-red-500'
      case 'trial_expired':
        return 'text-yellow-500'
      case 'usage_limit':
        return 'text-orange-500'
      default:
        return 'text-gray-500'
    }
  }

  const ReasonIcon = getReasonIcon()

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg bg-gray-700 ${getReasonColor()}`}>
          <ReasonIcon className="h-6 w-6" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-white">
              {reason === 'score_too_low' ? 'Score Too Low' : 'Upgrade Required'}
            </h3>
            {showClose && onClose && (
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <p className="text-gray-300 mb-4">
            {getReasonMessage()}
          </p>

          {reason === 'score_too_low' && currentScore && requiredScore && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Current Score</span>
                <span className="text-sm font-medium text-red-500">{currentScore.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-gray-300">Required Score</span>
                <span className="text-sm font-medium text-green-500">{requiredScore}</span>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((currentScore / requiredScore) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <button
              onClick={handleUpgrade}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Crown className="h-4 w-4" />
              <span>Upgrade to {requiredPlanInfo.name}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={handleViewPricing}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              View Pricing
            </button>

            <button
              onClick={handleExpand}
              className="px-3 py-2 text-gray-400 hover:text-white transition-colors"
            >
              {isExpanded ? 'Less' : 'More'} Details
            </button>
          </div>

          {isExpanded && (
            <div className="mt-6 space-y-4">
              {/* Current Plan */}
              <div className="p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  {currentPlanInfo && (
                    <>
                      <currentPlanInfo.icon className={`h-5 w-5 ${currentPlanInfo.color}`} />
                      <h4 className="font-medium text-white">{currentPlanInfo.name}</h4>
                      <span className="text-sm text-gray-400">({currentPlanInfo.price})</span>
                    </>
                  )}
                </div>
                <div className="space-y-2">
                  {currentPlanInfo?.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Plan */}
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <requiredPlanInfo.icon className={`h-5 w-5 ${requiredPlanInfo.color}`} />
                  <h4 className="font-medium text-white">{requiredPlanInfo.name}</h4>
                  <span className="text-sm text-gray-400">({requiredPlanInfo.price})</span>
                </div>
                <div className="space-y-2">
                  {requiredPlanInfo.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature Comparison */}
              <div className="p-4 bg-gray-700 rounded-lg">
                <h4 className="font-medium text-white mb-3">What you'll get with {requiredPlanInfo.name}:</h4>
                <div className="space-y-2">
                  {requiredPlanInfo.features
                    .filter(f => !currentPlanInfo?.features.includes(f))
                    .map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Trial Information */}
              {requiredPlan === 'pro' && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <h4 className="font-medium text-white">7-Day Free Trial</h4>
                  </div>
                  <p className="text-sm text-gray-300">
                    Try {requiredPlanInfo.name} free for 7 days. No credit card required.
                    Cancel anytime during the trial period.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
