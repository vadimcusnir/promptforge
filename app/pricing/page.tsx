"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, User, CreditCard } from "lucide-react"
import { useStripeCheckout } from "@/hooks/use-stripe-checkout"
import { useAuth } from "@/hooks/use-auth"
import { useAnalytics } from "@/hooks/use-analytics"
import { useABTesting } from "@/hooks/use-ab-testing"
import { useLocalization } from "@/hooks/use-localization"
import { monitoringService, trackBusinessEvent, trackMetric } from "@/lib/monitoring"

// Performance optimizations will be added in the component

interface PlanFeature {
  name: string
  included: boolean
}

interface Plan {
  id: string
  name: string
  price_monthly: number
  price_annual: number
  description: string
  features: PlanFeature[]
  cta: string
  popular: boolean
}

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD')
  const [showLoginModal, setShowLoginModal] = useState(false)
  
  // Hooks
  const { createCheckoutSession, isLoading: isCheckoutLoading } = useStripeCheckout()
  const { user, logout, isLoading: isAuthLoading } = useAuth()
  const analytics = useAnalytics()
  const { currentVariant, getVariantPricing, getVariantFeatures, getVariantCTA, trackVariantConversion } = useABTesting()
  const { t, getFeatures } = useLocalization()

  // Track pricing page view
  useEffect(() => {
    analytics.pricingView('pricing_page')
  }, [analytics])

  // Plans with A/B testing integration - Normalized plan names
  const plans: Plan[] = [
    {
      id: "free",
      name: "Free",
      price_monthly: 0,
      price_annual: 0,
      description: "Perfect for getting started",
      features: [
        { name: "Modules M01, M10, M18", included: true },
        { name: "Export txt, md", included: true },
        { name: "Local history", included: true },
        { name: "Community support", included: true },
        { name: "Export pdf, json", included: false },
        { name: "Live Test Engine", included: false },
        { name: "Cloud history", included: false },
        { name: "API access", included: false },
      ],
      cta: "Start Free",
      popular: false,
    },
    {
      id: "creator",
      name: "Creator",
      price_monthly: currentVariant ? (getVariantPricing("creator", false) || 19) : 19,
      price_annual: currentVariant ? (getVariantPricing("creator", true) || 190) : 190,
      description: "For content creators and solopreneurs",
      features: currentVariant 
        ? getVariantFeatures("creator").map(f => ({ name: f, included: true }))
        : [
            { name: "All modules (M01-M40)", included: true },
            { name: "Export txt, md, pdf", included: true },
            { name: "Local history", included: true },
            { name: "Community support", included: true },
            { name: "Export json", included: false },
            { name: "Live Test Engine", included: false },
            { name: "Cloud history", included: false },
            { name: "API access", included: false },
          ],
      cta: currentVariant ? getVariantCTA("creator") : "Start Creator",
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      price_monthly: currentVariant ? (getVariantPricing("pro", false) || 49) : 49,
      price_annual: currentVariant ? (getVariantPricing("pro", true) || 490) : 490,
      description: "For professionals and teams",
      features: currentVariant 
        ? getVariantFeatures("pro").map(f => ({ name: f, included: true }))
        : [
            { name: "All modules (M01-M50)", included: true },
            { name: "Export txt, md, pdf, json", included: true },
            { name: "Live Test Engine", included: true },
            { name: "Cloud history", included: true },
            { name: "Advanced analytics", included: true },
            { name: "Priority support", included: true },
            { name: "API access", included: false },
            { name: "White-label", included: false },
          ],
      cta: currentVariant ? getVariantCTA("pro") : "Start Pro Trial",
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price_monthly: currentVariant ? (getVariantPricing("enterprise", false) || 299) : 299,
      price_annual: currentVariant ? (getVariantPricing("enterprise", true) || 2990) : 2990,
      description: "For organizations at scale",
      features: currentVariant 
        ? getVariantFeatures("enterprise").map(f => ({ name: f, included: true }))
        : [
            { name: "Everything in Pro", included: true },
            { name: "API access", included: true },
            { name: "Bundle.zip exports", included: true },
            { name: "White-label options", included: true },
            { name: "5 seats included", included: true },
            { name: "Custom integrations", included: true },
            { name: "Dedicated support", included: true },
            { name: "SLA guarantee", included: true },
          ],
      cta: currentVariant ? getVariantCTA("enterprise") : "Contact Sales",
      popular: false,
    },
  ]

  // Performance optimizations
  const memoizedPlans = useMemo(() => plans, [plans])
  const memoizedFeatures = useMemo(() => getFeatures("creator"), [getFeatures])
  
  // Memoized callbacks for better performance
  const handleCheckout = useCallback(async (planId: string) => {
    if (planId === "free") return
    
    analytics.checkoutStart(planId, isAnnual, user?.id)
    
    if (currentVariant) {
      trackVariantConversion(currentVariant.id, "pricing_v1", planId, isAnnual)
    }

    if (!user) {
      setShowLoginModal(true)
      return
    }

    // Track business event for monitoring
    trackBusinessEvent('checkout_start', { planId, isAnnual, userId: user.id })
    
    // Track performance metric
    const startTime = performance.now()
    
    try {
      await createCheckoutSession({
        planId,
        isAnnual,
        userId: user.id,
      })
      
      // Track successful checkout completion time
      const completionTime = performance.now() - startTime
      trackMetric('checkout_completion_time', completionTime)
      
      // Track successful conversion
      trackBusinessEvent('checkout_complete', { 
        planId, 
        isAnnual, 
        userId: user.id,
        completionTime 
      })
      
    } catch (error) {
      // Track checkout errors
      trackBusinessEvent('checkout_error', { 
        planId, 
        isAnnual, 
        userId: user.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    }
  }, [analytics, currentVariant, trackVariantConversion, user, isAnnual, createCheckoutSession])

  const handlePlanClick = useCallback((planId: string, position: number) => {
    analytics.planClick(planId, isAnnual, position)
    
    // Track business event for monitoring
    trackBusinessEvent('plan_click', { 
      planId, 
      isAnnual, 
      position,
      userId: user?.id 
    })
  }, [analytics, isAnnual, user?.id])

  const handleToggleBilling = useCallback(() => {
    setIsAnnual(!isAnnual)
    analytics.toggleBilling(!isAnnual)
    
    // Track business event for monitoring
    trackBusinessEvent('billing_toggle', { 
      newValue: !isAnnual,
      userId: user?.id 
    })
  }, [isAnnual, analytics, user?.id])

  // Initialize monitoring service
  useEffect(() => {
    monitoringService.initialize()
  }, [])

  // Analytics tracking
  useEffect(() => {
    analytics.planView("pricing_overview", isAnnual)
    
    // Track business event for monitoring
    trackBusinessEvent('plan_view', { 
      viewType: "pricing_overview", 
      isAnnual,
      userId: user?.id 
    })
  }, [isAnnual, analytics, user?.id])

  // Functions are now memoized above

  const getPrice = (plan: Plan): string => {
    if (plan.price_monthly === 0) return currency === 'EUR' ? '€0' : '$0'
    let price = isAnnual ? plan.price_annual : plan.price_monthly

    // Convert to EUR if needed (approximate conversion rate)
    if (currency === 'EUR') {
      price = Math.round(price * 0.85) // 1 USD = 0.85 EUR approximation
    }

    return currency === 'EUR' ? `€${price}` : `$${price}`
  }

  const getPeriod = (plan: Plan): string => {
    if (plan.price_monthly === 0) return "forever"
    return isAnnual ? "year" : "month"
  }

  const getSavings = (plan: Plan): number | null => {
    if (plan.price_monthly === 0 || !isAnnual) return null
    const monthlyTotal = plan.price_monthly * 12
    const annualPrice = plan.price_annual
    const savings = monthlyTotal - annualPrice
    const savingsPercent = Math.round((savings / monthlyTotal) * 100)
    return savingsPercent
  }

  return (
    <div className="min-h-screen pattern-bg text-white">
      {/* Header with user status */}
      <div className="absolute top-4 right-4 flex items-center gap-4 z-10">
        {/* User Status */}
        {user ? (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-300">{user.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-400 hover:text-white"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLoginModal(true)}
            className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
          >
            Login
          </Button>
        )}
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-serif mb-4 text-fg-primary">{t("pricing.title")}</h1>
          <p className="text-xl text-fg-secondary mb-8">{t("pricing.subtitle")}</p>

          <div className="flex flex-col gap-6 mb-8">
            {/* Currency Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`${currency === 'USD' ? 'text-fg-primary' : 'text-fg-secondary'}`}>
                USD ($)
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={currency === 'EUR'}
                  onChange={() => setCurrency(currency === 'USD' ? 'EUR' : 'USD')}
                />
                <div className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${
                  currency === 'EUR' ? 'bg-accent' : 'bg-muted'
                }`}></div>
                <div className={`absolute top-1 w-4 h-4 bg-fg-primary rounded-full transition-transform ${
                  currency === 'EUR' ? 'translate-x-7' : 'translate-x-1'
                }`}></div>
              </div>
              <span className={`${currency === 'EUR' ? 'text-fg-primary' : 'text-fg-secondary'}`}>
                EUR (€)
              </span>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`${!isAnnual ? 'text-fg-primary' : 'text-fg-secondary'}`}>
                {t("pricing.monthly")}
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isAnnual}
                  onChange={() => handleToggleBilling()}
                />
                <div className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${
                  isAnnual ? 'bg-accent' : 'bg-muted'
                }`}></div>
                <div className={`absolute top-1 w-4 h-4 bg-fg-primary rounded-full transition-transform ${
                  isAnnual ? 'translate-x-7' : 'translate-x-1'
                }`}></div>
              </div>
              <span className={`${isAnnual ? 'text-fg-primary' : 'text-fg-secondary'}`}>
                {t("pricing.annual")}
              </span>
              {isAnnual && (
                <Badge className="bg-accent text-accent-contrast">{t("pricing.save")}</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const savings = getSavings(plan)
            return (
              <Card
                key={plan.id}
                className={`bg-zinc-900/80 border border-zinc-700 relative ${plan.popular ? "border-yellow-400 scale-105" : ""}`}
                onClick={() => handlePlanClick(plan.id, index + 1)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-yellow-600 text-black">{t("pricing.mostPopular")}</Badge>
                  </div>
                )}

                {savings && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-green-600 text-white">Save {savings}%</Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="font-serif text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-400">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold font-serif">{getPrice(plan)}</span>
                                      <span className="text-gray-400">/{getPeriod(plan)}</span>
                </div>
                {isAnnual && plan.price_monthly > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Billed annually • ${Math.round(plan.price_annual / 12)}/month
                  </p>
                )}
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li 
                        key={featureIndex} 
                        className="flex items-center gap-3"
                        onMouseEnter={() => analytics.featureHover(feature.name, plan.id)}
                      >
                        {feature.included ? (
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${feature.included ? "text-white" : "text-gray-500"}`}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-yellow-600 hover:bg-yellow-700 text-black"
                        : "bg-transparent border border-gray-700 hover:border-yellow-400"
                    }`}
                    onClick={() => handleCheckout(plan.id)}
                    disabled={isCheckoutLoading}
                  >
                    {isCheckoutLoading ? (
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 " />
                        Processing...
                      </div>
                    ) : (
                      plan.cta
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold font-serif mb-8">{t("pricing.faq.title")}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card 
              className="bg-zinc-900/80 border border-zinc-700 text-left"
              onMouseEnter={() => analytics.faqView(t("pricing.faq.freePlan"))}
            >
              <CardHeader>
                <CardTitle className="font-serif text-lg">{t("pricing.faq.freePlan")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">{t("pricing.faq.freePlanAnswer")}</p>
              </CardContent>
            </Card>

            <Card 
              className="bg-zinc-900/80 border border-zinc-700 text-left"
              onMouseEnter={() => analytics.faqView(t("pricing.faq.upgradeDowngrade"))}
            >
              <CardHeader>
                <CardTitle className="font-serif text-lg">{t("pricing.faq.upgradeDowngrade")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">{t("pricing.faq.upgradeDowngradeAnswer")}</p>
              </CardContent>
            </Card>

            <Card 
              className="bg-zinc-900/80 border border-zinc-700 text-left"
              onMouseEnter={() => analytics.faqView(t("pricing.faq.testing"))}
            >
              <CardHeader>
                <CardTitle className="font-serif text-lg">{t("pricing.faq.testing")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">{t("pricing.faq.testingAnswer")}</p>
              </CardContent>
            </Card>

            <Card 
              className="bg-zinc-900/80 border border-zinc-700 text-left"
              onMouseEnter={() => analytics.faqView(t("pricing.faq.enterprise"))}
            >
              <CardHeader>
                <CardTitle className="font-serif text-lg">{t("pricing.faq.enterprise")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">{t("pricing.faq.enterpriseAnswer")}</p>
              </CardContent>
            </Card>

            <Card 
              className="bg-zinc-900/80 border border-zinc-700 text-left"
              onMouseEnter={() => analytics.faqView(t("pricing.faq.dataPrivacy"))}
            >
              <CardHeader>
                <CardTitle className="font-serif text-lg">{t("pricing.faq.dataPrivacy")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">{t("pricing.faq.dataPrivacyAnswer")}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Legal Links */}
        <div className="mt-16 text-center">
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <Link href="/legal" className="hover:text-gold-400 transition-colors">
                Legal Center
              </Link>
              <Link href="/legal/privacy" className="hover:text-gold-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/legal/terms" className="hover:text-gold-400 transition-colors">
                Terms of Use
              </Link>
              <a href="mailto:legal@promptforge.ai" className="hover:text-yellow-400 transition-colors">
                legal@promptforge.ai
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              All exports include appropriate license notices and watermarks based on your plan
            </p>
          </div>
        </div>

        {/* A/B Testing Indicator (Development only) */}
        {process.env.NODE_ENV === "development" && currentVariant && (
          <div className="mt-8 text-center">
            <Badge variant="outline" className="border-yellow-400 text-yellow-400">
              A/B Test: {currentVariant.name} (ID: {currentVariant.id})
            </Badge>
          </div>
        )}
      </div>

      {/* Sticky CTA Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 z-50 md:hidden">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-yellow-400 rounded-full "></div>
            <span className="text-white font-medium">
              Start Pro – {getPrice(plans.find(p => p.id === 'pro')!)}
            </span>
          </div>
          <Button 
            onClick={() => handlePlanClick('pro', 2)}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6"
          >
            Start Now
          </Button>
        </div>
      </div>
    </div>
  )
}
