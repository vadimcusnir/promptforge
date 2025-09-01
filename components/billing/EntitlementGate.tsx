'use client'

import { ReactNode } from 'react'
import { useEntitlements } from '@/hooks/use-entitlements'
import { UpgradePaywall } from '@/components/paywall/UpgradePaywall'

interface EntitlementGateProps {
  feature: string
  requiredPlan: 'CREATOR' | 'PRO' | 'ENTERPRISE'
  children: ReactNode
  fallback?: ReactNode
  showPaywall?: boolean
}

export function EntitlementGate({ 
  feature, 
  requiredPlan, 
  children, 
  fallback,
  showPaywall = true 
}: EntitlementGateProps) {
  const { hasEntitlement } = useEntitlements()

  const hasAccess = hasEntitlement(feature as any)

  if (hasAccess) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  if (showPaywall) {
    return (
      <UpgradePaywall feature={feature} requiredPlan={requiredPlan}>
        {children}
      </UpgradePaywall>
    )
  }

  return null
}