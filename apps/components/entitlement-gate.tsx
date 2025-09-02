"use client"

import { type ReactNode, useState } from "react"
import { useEntitlements } from "@/hooks/use-entitlements"
import { PaywallModal } from "./paywall-modal"
import { Lock } from "lucide-react"

interface EntitlementGateProps {
  flag: string
  requiredPlan?: string
  feature?: string
  children: ReactNode
  fallback?: ReactNode
  showLock?: boolean
}

export function EntitlementGate({
  flag,
  requiredPlan = "pro",
  feature = "This feature",
  children,
  fallback,
  showLock = true,
}: EntitlementGateProps) {
  const { checkEntitlement, upgradePlan } = useEntitlements()
  const [showPaywall, setShowPaywall] = useState(false)

  const hasAccess = checkEntitlement(flag)

  if (hasAccess) {
    return <>{children}</>
  }

  const handleUpgrade = (plan: string) => {
    upgradePlan(plan)
    setShowPaywall(false)
  }

  if (fallback) {
    return <>{fallback}</>
  }

  return (
    <>
      <div className="relative cursor-pointer group" onClick={() => setShowPaywall(true)}>
        <div className="opacity-50 pointer-events-none">{children}</div>
        {showLock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg group-hover:bg-black/30 transition-colors">
            <div className="flex items-center gap-2 px-3 py-1 bg-black/80 rounded-full border border-gold-400/30">
              <Lock className="w-4 h-4 text-gold-400" />
              <span className="text-sm text-gold-400 font-medium">
                {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)}+ Required
              </span>
            </div>
          </div>
        )}
      </div>

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature={feature}
        requiredPlan={requiredPlan}
        onUpgrade={handleUpgrade}
      />
    </>
  )
}
