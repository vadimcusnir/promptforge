import { useState } from "react"
import { useToast } from "./use-toast"

interface CheckoutOptions {
  planId: string
  isAnnual: boolean
  userId?: string
}

export function useStripeCheckout() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const createCheckoutSession = async ({ planId, isAnnual, userId }: CheckoutOptions) => {
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          isAnnual,
          userId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session")
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout Error",
        description: error instanceof Error ? error.message : "Failed to start checkout",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createCheckoutSession,
    isLoading,
  }
}
