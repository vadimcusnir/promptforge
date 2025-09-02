"use client"

import { useState } from "react"
import { getEntitlementValue, hasEntitlement } from "@/lib/entitlements"

// Mock user context - in real app this would come from auth
const mockUser = {
  id: "1",
  plan: "free", // This would be dynamic based on user's subscription
  email: "user@example.com",
}

export function useEntitlements() {
  const [userPlan, setUserPlan] = useState(mockUser.plan)

  const checkEntitlement = (flag: string): boolean => {
    return hasEntitlement(userPlan, flag)
  }

  const getEntitlement = (flag: string): boolean | number => {
    return getEntitlementValue(userPlan, flag)
  }

  const upgradePlan = (newPlan: string) => {
    setUserPlan(newPlan)
    // In real app, this would trigger Stripe checkout
  }

  return {
    userPlan,
    checkEntitlement,
    getEntitlement,
    upgradePlan,
    user: mockUser,
  }
}
