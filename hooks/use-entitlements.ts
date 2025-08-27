"use client"

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './use-auth'
import type { FeatureFlag, PlanType } from '@/lib/entitlements/types'

export interface Entitlements {
  canUseAllModules: boolean
  canExportMD: boolean
  canExportPDF: boolean
  canExportJSON: boolean
  canUseGptTestReal: boolean
  hasCloudHistory: boolean
  hasEvaluatorAI: boolean
  hasAPI: boolean
  canExportBundleZip: boolean
  hasWhiteLabel: boolean
  hasSeatsGT1: boolean
  canAccessModule: boolean
}

export interface EntitlementStatus {
  entitlements: Entitlements | null
  isLoading: boolean
  error: string | null
  hasEntitlement: (flag: keyof Entitlements) => boolean
  refresh: () => Promise<void>
  getRequiredPlan: (flag: keyof Entitlements) => PlanType | null
}

const defaultEntitlements: Entitlements = {
  canUseAllModules: false,
  canExportMD: true,
  canExportPDF: false,
  canExportJSON: false,
  canUseGptTestReal: false,
  hasCloudHistory: false,
  hasEvaluatorAI: false,
  hasAPI: false,
  canExportBundleZip: false,
  hasWhiteLabel: false,
  hasSeatsGT1: false,
  canAccessModule: false
}

// Map feature flags to plan requirements
const FEATURE_PLAN_MAP: Record<keyof Entitlements, PlanType> = {
  canUseAllModules: 'pro',
  canExportMD: 'pilot',
  canExportPDF: 'pro',
  canExportJSON: 'pro',
  canUseGptTestReal: 'pro',
  hasCloudHistory: 'pro',
  hasEvaluatorAI: 'pro',
  hasAPI: 'enterprise',
  canExportBundleZip: 'enterprise',
  hasWhiteLabel: 'enterprise',
  hasSeatsGT1: 'pro',
  canAccessModule: 'pilot'
}

export function useEntitlements(orgId?: string): EntitlementStatus {
  const [entitlements, setEntitlements] = useState<Entitlements | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchEntitlements = useCallback(async () => {
    if (!orgId || !user) {
      setEntitlements(defaultEntitlements)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/entitlements?orgId=${orgId}`, {
        headers: {
          'x-user-id': user.id,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch entitlements: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success && data.entitlements) {
        setEntitlements(data.entitlements)
      } else {
        throw new Error('Invalid entitlements response')
      }
    } catch (err) {
      console.error('Error fetching entitlements:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch entitlements')
      setEntitlements(defaultEntitlements)
    } finally {
      setIsLoading(false)
    }
  }, [orgId, user])

  const hasEntitlement = useCallback((flag: keyof Entitlements): boolean => {
    if (!entitlements) return false
    return entitlements[flag] || false
  }, [entitlements])

  const getRequiredPlan = useCallback((flag: keyof Entitlements): PlanType | null => {
    return FEATURE_PLAN_MAP[flag] || null
  }, [])

  const refresh = useCallback(async () => {
    await fetchEntitlements()
  }, [fetchEntitlements])

  useEffect(() => {
    fetchEntitlements()
  }, [fetchEntitlements])

  return {
    entitlements,
    isLoading,
    error,
    hasEntitlement,
    refresh,
    getRequiredPlan
  }
}

// Hook for checking specific entitlements
export function useEntitlement(flag: keyof Entitlements, orgId?: string): boolean {
  const { hasEntitlement } = useEntitlements(orgId)
  return hasEntitlement(flag)
}

// Hook for multiple entitlements
export function useEntitlementsMulti(flags: (keyof Entitlements)[], orgId?: string): boolean {
  const { hasEntitlement } = useEntitlements(orgId)
  return flags.every(flag => hasEntitlement(flag))
}

// Hook for getting required plan for a feature
export function useRequiredPlan(flag: keyof Entitlements): PlanType | null {
  const { getRequiredPlan } = useEntitlements()
  return getRequiredPlan(flag)
}
