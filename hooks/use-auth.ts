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
      // Check for stored token
      const storedToken = localStorage.getItem('accessToken')
      if (storedToken) {
        setAccessToken(storedToken)
        
        const response = await fetch("/api/auth/me", {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        })
        
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          // Token expired or invalid
          localStorage.removeItem('accessToken')
          setAccessToken(null)
          setUser(null)
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      localStorage.removeItem('accessToken')
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
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setAccessToken(userData.accessToken)
        
        // Store token securely
        localStorage.setItem('accessToken', userData.accessToken)
        
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
      if (accessToken) {
        await fetch("/api/auth/logout", { 
          method: "POST",
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
      }
      
      setUser(null)
      setAccessToken(null)
      localStorage.removeItem('accessToken')
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      })
    } catch (error) {
      console.error("Logout failed:", error)
      // Still clear local state even if server logout fails
      setUser(null)
      setAccessToken(null)
      localStorage.removeItem('accessToken')
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
          "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`
        },
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
          "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`
        },
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
