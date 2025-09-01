'use client'

import { useState } from 'react'
import { Lock, Star, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useEntitlements } from '@/hooks/use-entitlements'
import { useTelemetry } from '@/hooks/use-telemetry'

interface UpgradePaywallProps {
  feature: string
  requiredPlan: 'CREATOR' | 'PRO' | 'ENTERPRISE'
  children: React.ReactNode
  className?: string
}

export function UpgradePaywall({ 
  feature, 
  requiredPlan, 
  children, 
  className = '' 
}: UpgradePaywallProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { userPlan, hasEntitlement } = useEntitlements()
  const { trackExportBlocked } = useTelemetry()

  // Check if user has access to the feature
  const hasAccess = hasEntitlement(feature as any)

  if (hasAccess) {
    return <>{children}</>
  }

  const handleUpgradeClick = () => {
    trackExportBlocked(feature, userPlan || 'free', 'upgrade_paywall', {
      requiredPlan,
      currentPlan: userPlan
    })
  }

  const getPlanInfo = () => {
    switch (requiredPlan) {
      case 'CREATOR':
        return {
          name: 'Creator',
          price: '$19/month',
          features: ['All 50 modules', 'Markdown exports', 'Cloud history']
        }
      case 'PRO':
        return {
          name: 'Pro',
          price: '$49/month',
          features: ['Run Real Tests', 'PDF/JSON exports', 'Advanced analytics']
        }
      case 'ENTERPRISE':
        return {
          name: 'Enterprise',
          price: '$199/month',
          features: ['API access', 'Bundle exports', 'Team collaboration']
        }
    }
  }

  const planInfo = getPlanInfo()

  return (
    <div className={`relative ${className}`}>
      {/* Blurred content */}
      <div className="blur-sm pointer-events-none select-none">
        {children}
      </div>

      {/* Paywall overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg)]/80 backdrop-blur-sm rounded-lg">
        <div className="text-center p-6 max-w-md">
          {/* Lock icon */}
          <div className="mb-4">
            <Lock className="w-12 h-12 text-[var(--fg-muted)] mx-auto" />
          </div>

          {/* Feature name */}
          <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-2">
            {feature} is locked
          </h3>

          {/* Description */}
          <p className="text-[var(--fg-muted)] mb-4">
            This feature is available in the {planInfo.name} plan and above.
          </p>

          {/* Plan highlights */}
          <div className="bg-[var(--border)]/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-5 h-5 text-[var(--brand)]" />
              <span className="font-semibold text-[var(--fg-primary)]">
                {planInfo.name} Plan
              </span>
            </div>
            <div className="text-2xl font-bold text-[var(--brand)] mb-2">
              {planInfo.price}
            </div>
            <ul className="space-y-1 text-sm text-[var(--fg-muted)]">
              {planInfo.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-[var(--accent)] flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Button */}
          <Link
            href="/pricing"
            onClick={handleUpgradeClick}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] text-black px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-[var(--brand)]/25 transition-all duration-200"
          >
            Upgrade to {planInfo.name}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}