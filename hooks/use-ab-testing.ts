import { useState, useEffect } from "react"

interface ABTestVariant {
  id: string
  name: string
  weight: number // Percentage chance of being shown
  pricing: {
    creator: { monthly: number; annual: number }
    pro: { monthly: number; annual: number }
    enterprise: { monthly: number; annual: number }
  }
  features: {
    creator: string[]
    pro: string[]
    enterprise: string[]
  }
  cta: {
    creator: string
    pro: string
    enterprise: string
  }
}

interface ABTest {
  id: string
  name: string
  variants: ABTestVariant[]
  isActive: boolean
  startDate: string
  endDate?: string
}

export function useABTesting() {
  const [currentVariant, setCurrentVariant] = useState<ABTestVariant | null>(null)
  const [testId, setTestId] = useState<string | null>(null)

  // Define A/B test variants for pricing optimization
  const pricingTests: ABTest[] = [
    {
      id: "pricing_v1",
      name: "Pricing Optimization Test",
      isActive: true,
      startDate: "2024-01-01",
      variants: [
        {
          id: "control",
          name: "Control (Current)",
          weight: 50,
          pricing: {
            creator: { monthly: 19, annual: 190 },
            pro: { monthly: 49, annual: 490 },
            enterprise: { monthly: 299, annual: 2990 },
          },
          features: {
            creator: ["All modules (M01-M40)", "Export txt, md, pdf", "Local history", "Community support"],
            pro: ["All modules (M01-M50)", "Export txt, md, pdf, json", "Live Test Engine", "Cloud history"],
            enterprise: ["Everything in Pro", "API access", "Bundle.zip exports", "White-label options"],
          },
          cta: {
            creator: "Start Creator",
            pro: "Start Pro Trial",
            enterprise: "Contact Sales",
          },
        },
        {
          id: "variant_a",
          name: "Lower Entry Price",
          weight: 25,
          pricing: {
            creator: { monthly: 15, annual: 150 },
            pro: { monthly: 39, annual: 390 },
            enterprise: { monthly: 249, annual: 2490 },
          },
          features: {
            creator: ["All modules (M01-M40)", "Export txt, md, pdf", "Local history", "Community support"],
            pro: ["All modules (M01-M50)", "Export txt, md, pdf, json", "Live Test Engine", "Cloud history"],
            enterprise: ["Everything in Pro", "API access", "Bundle.zip exports", "White-label options"],
          },
          cta: {
            creator: "Start Creator - Save 21%",
            pro: "Start Pro Trial - Save 20%",
            enterprise: "Contact Sales - Save 17%",
          },
        },
        {
          id: "variant_b",
          name: "Premium Positioning",
          weight: 25,
          pricing: {
            creator: { monthly: 24, annual: 240 },
            pro: { monthly: 59, annual: 590 },
            enterprise: { monthly: 349, annual: 3490 },
          },
          features: {
            creator: ["All modules (M01-M40)", "Export txt, md, pdf", "Local history", "Community support", "Priority email support"],
            pro: ["All modules (M01-M50)", "Export txt, md, pdf, json", "Live Test Engine", "Cloud history", "Advanced analytics"],
            enterprise: ["Everything in Pro", "API access", "Bundle.zip exports", "White-label options", "Dedicated account manager"],
          },
          cta: {
            creator: "Start Creator Premium",
            pro: "Start Pro Premium",
            enterprise: "Contact Enterprise Sales",
          },
        },
      ],
    },
  ]

  useEffect(() => {
    assignVariant()
  }, [])

  const assignVariant = () => {
    const activeTest = pricingTests.find(test => test.isActive)
    if (!activeTest) return

    setTestId(activeTest.id)
    
    // Simple random assignment based on weights
    const random = Math.random() * 100
    let cumulativeWeight = 0
    
    for (const variant of activeTest.variants) {
      cumulativeWeight += variant.weight
      if (random <= cumulativeWeight) {
        setCurrentVariant(variant)
        break
      }
    }

    // Fallback to control if no variant assigned
    if (!currentVariant) {
      setCurrentVariant(activeTest.variants[0])
    }
  }

  const getVariantPricing = (planId: string, isAnnual: boolean) => {
    if (!currentVariant) return null
    
    const plan = currentVariant.pricing[planId as keyof typeof currentVariant.pricing]
    if (!plan) return null
    
    return isAnnual ? plan.annual : plan.monthly
  }

  const getVariantFeatures = (planId: string) => {
    if (!currentVariant) return []
    
    return currentVariant.features[planId as keyof typeof currentVariant.features] || []
  }

  const getVariantCTA = (planId: string) => {
    if (!currentVariant) return ""
    
    return currentVariant.cta[planId as keyof typeof currentVariant.cta] || ""
  }

  const trackVariantView = (variantId: string, testId: string) => {
    // Track which variant was shown
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "ab_test_view", {
        test_id: testId,
        variant_id: variantId,
        page: "pricing",
      })
    }

    // Send to internal analytics
    fetch("/api/analytics/ab-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        test_id: testId,
        variant_id: variantId,
        event: "view",
        page: "pricing",
      }),
    }).catch(console.error)
  }

  const trackVariantConversion = (variantId: string, testId: string, planId: string, isAnnual: boolean) => {
    // Track conversion for A/B test
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "ab_test_conversion", {
        test_id: testId,
        variant_id: variantId,
        plan_id: planId,
        billing_cycle: isAnnual ? "annual" : "monthly",
        page: "pricing",
      })
    }

    // Send to internal analytics
    fetch("/api/analytics/ab-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        test_id: testId,
        variant_id: variantId,
        event: "conversion",
        plan_id: planId,
        billing_cycle: isAnnual ? "annual" : "monthly",
        page: "pricing",
      }),
    }).catch(console.error)
  }

  useEffect(() => {
    if (currentVariant && testId) {
      trackVariantView(currentVariant.id, testId)
    }
  }, [currentVariant, testId])

  return {
    currentVariant,
    testId,
    getVariantPricing,
    getVariantFeatures,
    getVariantCTA,
    trackVariantConversion,
    isTestActive: pricingTests.some(test => test.isActive),
  }
}
