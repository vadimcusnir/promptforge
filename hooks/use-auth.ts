"use client"

import { useState, useEffect } from "react"
import { useToast } from "./use-toast"

interface User {
  id: string
  email: string
  plan: string
  isAnnual: boolean
  subscriptionId?: string
  trialEndsAt?: string
  creditsRemaining: number
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      // Check authentication status via /api/auth/me
      // This will use httpOnly cookies automatically
      const response = await fetch("/api/auth/me", {
        credentials: 'include' // Include cookies in request
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setAccessToken('authenticated') // Indicate we're authenticated
      } else {
        // Not authenticated
        setAccessToken(null)
        setUser(null)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setAccessToken(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include', // Include cookies in request
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setAccessToken('authenticated') // Indicate we're authenticated
        
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        })
        return true
      } else {
        const error = await response.json()
        throw new Error(error.message || "Login failed")
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
      return false
    }
  }

  const logout = async () => {
    try {
      // Call logout API to clear server-side session and cookies
      await fetch("/api/auth/logout", { 
        method: "POST",
        credentials: 'include' // Include cookies in request
      })
      
      setUser(null)
      setAccessToken(null)
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      })
    } catch (error) {
      console.error("Logout failed:", error)
      // Still clear local state even if server logout fails
      setUser(null)
      setAccessToken(null)
    }
  }

  const upgradePlan = async (planId: string, isAnnual: boolean) => {
    if (!user || !accessToken) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upgrade your plan",
        variant: "destructive",
      })
      return false
    }

    try {
      const response = await fetch("/api/subscriptions/upgrade", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        credentials: 'include', // Include cookies in request
        body: JSON.stringify({
          userId: user.id,
          planId,
          isAnnual,
        }),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
        toast({
          title: "Plan Upgraded",
          description: `Successfully upgraded to ${planId} plan`,
        })
        return true
      } else {
        const error = await response.json()
        throw new Error(error.message || "Upgrade failed")
      }
    } catch (error) {
      toast({
        title: "Upgrade Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
      return false
    }
  }

  const cancelSubscription = async () => {
    if (!user?.subscriptionId || !accessToken) {
      toast({
        title: "No Active Subscription",
        description: "You don't have an active subscription to cancel",
        variant: "destructive",
      })
      return false
    }

    try {
      const response = await fetch("/api/subscriptions/cancel", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        credentials: 'include', // Include cookies in request
        body: JSON.stringify({
          userId: user.id,
          subscriptionId: user.subscriptionId,
        }),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
        toast({
          title: "Subscription Cancelled",
          description: "Your subscription will end at the current billing period",
        })
        return true
      } else {
        const error = await response.json()
        throw new Error(error.message || "Cancellation failed")
      }
    } catch (error) {
      toast({
        title: "Cancellation Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
      return false
    }
  }

  return {
    user,
    isLoading,
    accessToken,
    login,
    logout,
    upgradePlan,
    cancelSubscription,
    checkAuthStatus,
  }
}
