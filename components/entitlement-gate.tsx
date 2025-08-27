"use client"

import React from 'react'
import { useEntitlements, type Entitlements } from '@/hooks/use-entitlements'
import { PaywallModal } from './paywall-modal'
import { Button } from '@/components/ui/button'
import { Lock, Crown, Zap } from 'lucide-react'
import type { PlanType } from '@/lib/entitlements/types'

interface EntitlementGateProps {
  children: React.ReactNode
  flag: keyof Entitlements
  orgId?: string
  fallback?: React.ReactNode
  showPaywall?: boolean
  featureName?: string
  planRequired?: PlanType
  requiredPlan?: string
  feature?: string
}

interface EntitlementGateButtonProps {
  flag: keyof Entitlements
  orgId?: string
  onClick?: () => void
  children: React.ReactNode
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  className?: string
  showPaywall?: boolean
  featureName?: string
  planRequired?: PlanType
}

// Main EntitlementGate component
export function EntitlementGate({
  children,
  flag,
  orgId,
  fallback,
  showPaywall = true,
  featureName,
  planRequired
}: EntitlementGateProps) {
  const { hasEntitlement, isLoading, getRequiredPlan } = useEntitlements(orgId)
  
  // Use provided planRequired or get from flag mapping
  const requiredPlan = planRequired || getRequiredPlan(flag)

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 rounded h-8 w-24" />
  }

  if (hasEntitlement(flag)) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  if (showPaywall) {
    return (
      <PaywallModal
        featureName={featureName || flag}
        planRequired={requiredPlan || 'pro'}
        trigger={
          <div className="flex items-center gap-2 text-gray-500 cursor-pointer hover:text-gray-700">
            <Lock className="h-4 w-4" />
            <span className="text-sm">
              {requiredPlan === 'enterprise' ? 'Enterprise' : 'Pro'} required
            </span>
          </div>
        }
      />
    )
  }

  return null
}

// EntitlementGateButton component
export function EntitlementGateButton({
  flag,
  orgId,
  onClick,
  children,
  variant = 'default',
  size = 'default',
  disabled = false,
  className = '',
  showPaywall = true,
  featureName,
  planRequired
}: EntitlementGateButtonProps) {
  const { hasEntitlement, isLoading, getRequiredPlan } = useEntitlements(orgId)
  
  // Use provided planRequired or get from flag mapping
  const requiredPlan = planRequired || getRequiredPlan(flag)

  if (isLoading) {
    return (
      <Button variant={variant} size={size} disabled className={className}>
        <div className="animate-pulse bg-white/20 rounded h-4 w-16" />
      </Button>
    )
  }

  if (hasEntitlement(flag)) {
    return (
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        className={className}
        onClick={onClick}
      >
        {children}
      </Button>
    )
  }

  if (showPaywall) {
    return (
      <PaywallModal
        featureName={featureName || flag}
        planRequired={requiredPlan || 'pro'}
        trigger={
          <Button
            variant="outline"
            size={size}
            className={`${className} border-orange-200 text-orange-600 hover:bg-orange-50`}
          >
            <Lock className="h-4 w-4 mr-2" />
            {children}
          </Button>
        }
      />
    )
  }

  return (
    <Button
      variant="outline"
      size={size}
      disabled
      className={`${className} opacity-50 cursor-not-allowed`}
    >
      <Lock className="h-4 w-4 mr-2" />
      {children}
    </Button>
  )
}

// HOC for wrapping components with entitlement checks
export function withEntitlementGate<P extends object>(
  Component: React.ComponentType<P>,
  flag: keyof Entitlements,
  options: {
    orgId?: string
    fallback?: React.ReactNode
    showPaywall?: boolean
    featureName?: string
    planRequired?: PlanType
  } = {}
) {
  const WrappedComponent = (props: P) => (
    <EntitlementGate
      flag={flag}
      orgId={options.orgId}
      fallback={options.fallback}
      showPaywall={options.showPaywall}
      featureName={options.featureName}
      planRequired={options.planRequired}
    >
      <Component {...props} />
    </EntitlementGate>
  )

  WrappedComponent.displayName = `withEntitlementGate(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Feature badge component
export function FeatureBadge({
  flag,
  orgId,
  children,
  className = ''
}: {
  flag: keyof Entitlements
  orgId?: string
  children: React.ReactNode
  className?: string
}) {
  const { hasEntitlement, getRequiredPlan } = useEntitlements(orgId)
  const isEnabled = hasEntitlement(flag)
  const requiredPlan = getRequiredPlan(flag)

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
        isEnabled
          ? 'bg-green-100 text-green-800 border border-green-200'
          : 'bg-gray-100 text-gray-600 border border-gray-200'
      } ${className}`}
    >
      {isEnabled ? (
        <Zap className="h-3 w-3 text-green-600" />
      ) : (
        <Lock className="h-3 w-3 text-gray-500" />
      )}
      {children}
      {!isEnabled && requiredPlan && (
        <span className="ml-1 text-xs opacity-75">
          ({requiredPlan})
        </span>
      )}
    </div>
  )
}

// Plan requirement indicator
export function PlanRequirement({
  planRequired,
  className = ''
}: {
  planRequired: PlanType
  className?: string
}) {
  const planIcons = {
    pilot: Crown,
    pro: Zap,
    enterprise: Crown
  }
  
  const Icon = planIcons[planRequired]

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      <Icon className="h-3 w-3" />
      {planRequired === 'enterprise' ? 'Enterprise' : planRequired === 'pro' ? 'Pro' : 'Pilot'} Plan
    </div>
  )
}
