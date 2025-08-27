"use client"

import { useEffect, useContext } from "react"
import { useAnalytics as useAnalyticsContext } from "@/components/analytics-provider"

interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  userId?: string
  timestamp?: number
}

interface PricingAnalytics {
  planView: (planId: string, isAnnual: boolean) => void
  planClick: (planId: string, isAnnual: boolean, position: number) => void
  checkoutStart: (planId: string, isAnnual: boolean, userId?: string) => void
  checkoutComplete: (planId: string, isAnnual: boolean, amount: number, userId?: string) => void
  checkoutAbandon: (planId: string, isAnnual: boolean, step: string) => void
  toggleBilling: (isAnnual: boolean) => void
  featureHover: (feature: string, planId: string) => void
  faqView: (question: string) => void
  scrollDepth: (depth: number) => void
  timeOnPage: (seconds: number) => void
  enterpriseContact: (data: Record<string, any>) => void
  enterpriseContactSuccess: (data: Record<string, any>) => void
  enterpriseContactError: (error: string) => void
}

interface PLGAnalytics {
  // Landing page events
  landingCtaClick: (ctaType: string, position: string) => void
  
  // Pricing events
  pricingView: (source?: string) => void
  planSelected: (planId: string, planType: 'free' | 'pro' | 'enterprise', isAnnual: boolean) => void
  
  // Checkout events
  checkoutStarted: (planId: string, planType: string, isAnnual: boolean, userId?: string) => void
  checkoutCompleted: (planId: string, planType: string, amount: number, isAnnual: boolean, userId?: string) => void
  
  // Gate events
  gateHit: (feature: string, gateType: 'score' | 'plan' | 'entitlement') => void
  
  // Paywall events
  paywallViewed: (feature: string, planRequired: string) => void
  paywallCtaClick: (feature: string, planRequired: string, ctaType: 'upgrade' | 'contact_sales' | 'close') => void
  
  // Feature usage events
  gptTestReal: (moduleId: string, params: Record<string, any>) => void
  exportPDF: (moduleId: string, options: Record<string, any>) => void
  exportJSON: (moduleId: string, options: Record<string, any>) => void
  exportBundle: (moduleId: string, options: Record<string, any>) => void
  apiUsage: (endpoint: string, params: Record<string, any>) => void
  
  // Additional analytics methods
  trackEvent: (eventName: string, properties: Record<string, any>) => void
  ctaClick: (ctaType: string, variant: string, plan?: string) => void
  paymentSuccess: (plan: string, paymentMethod: string, source: string) => void
  blogPostView: (postId: string, postTitle: string) => void
  moduleView: (moduleId: string, moduleName: string) => void
}

export function useAnalytics(): PricingAnalytics & PLGAnalytics {
  const { trackEvent } = useAnalyticsContext()

  const trackAnalyticsEvent = (event: AnalyticsEvent) => {
    // Send to analytics service (Google Analytics, Mixpanel, etc.)
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", event.event, {
        ...event.properties,
        user_id: event.userId,
        timestamp: event.timestamp || Date.now(),
      })
    }

    // Send to internal analytics API
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    }).catch(console.error)

    // Console log for development
    if (process.env.NODE_ENV === "development") {
      console.log("Analytics Event:", event)
    }
  }

  // PLG Events Implementation
  const landingCtaClick = (ctaType: string, position: string) => {
    trackEvent('PF_LANDING_CTA_CLICK', {
      cta_type: ctaType,
      position,
      page: window.location.pathname
    })
  }

  const pricingView = (source?: string) => {
    trackEvent('PF_PRICING_VIEW', {
      source: source || 'direct',
      page: 'pricing'
    })
  }

  const planSelected = (planId: string, planType: 'free' | 'pro' | 'enterprise', isAnnual: boolean) => {
    trackEvent('PF_PLAN_SELECTED', {
      plan_id: planId,
      plan_type: planType,
      billing_cycle: isAnnual ? 'annual' : 'monthly',
      page: 'pricing'
    })
  }

  const checkoutStarted = (planId: string, planType: string, isAnnual: boolean, userId?: string) => {
    trackEvent('PF_CHECKOUT_STARTED', {
      plan_id: planId,
      plan_type: planType,
      billing_cycle: isAnnual ? 'annual' : 'monthly',
      user_id: userId,
      page: 'checkout'
    })
  }

  const checkoutCompleted = (planId: string, planType: string, amount: number, isAnnual: boolean, userId?: string) => {
    trackEvent('PF_CHECKOUT_COMPLETED', {
      plan_id: planId,
      plan_type: planType,
      amount,
      currency: 'USD',
      billing_cycle: isAnnual ? 'annual' : 'monthly',
      user_id: userId,
      page: 'checkout'
    })
  }

  const gateHit = (feature: string, gateType: 'score' | 'plan' | 'entitlement') => {
    trackEvent('PF_GATE_HIT', {
      feature,
      gate_type: gateType,
      page: window.location.pathname
    })
  }

  const paywallViewed = (feature: string, planRequired: string) => {
    trackEvent('PF_PAYWALL_VIEWED', {
      feature,
      plan_required: planRequired,
      page: window.location.pathname
    })
  }

  const paywallCtaClick = (feature: string, planRequired: string, ctaType: 'upgrade' | 'contact_sales' | 'close') => {
    trackEvent('PF_PAYWALL_CTA_CLICK', {
      feature,
      plan_required: planRequired,
      cta_type: ctaType,
      page: window.location.pathname
    })
  }

  const gptTestReal = (moduleId: string, params: Record<string, any>) => {
    trackEvent('PF_GPT_TEST_REAL', {
      module_id: moduleId,
      params,
      page: window.location.pathname
    })
  }

  const exportPDF = (moduleId: string, options: Record<string, any>) => {
    trackEvent('PF_EXPORT_PDF', {
      module_id: moduleId,
      options,
      page: window.location.pathname
    })
  }

  const exportJSON = (moduleId: string, options: Record<string, any>) => {
    trackEvent('PF_EXPORT_JSON', {
      module_id: moduleId,
      options,
      page: window.location.pathname
    })
  }

  const exportBundle = (moduleId: string, options: Record<string, any>) => {
    trackEvent('PF_EXPORT_BUNDLE', {
      module_id: moduleId,
      options,
      page: window.location.pathname
    })
  }

  const apiUsage = (endpoint: string, params: Record<string, any>) => {
    trackEvent('PF_API_USAGE', {
      endpoint,
      params,
      page: window.location.pathname
    })
  }

  // Legacy pricing analytics methods
  const planView = (planId: string, isAnnual: boolean) => {
    trackEvent('plan_view', {
      plan_id: planId,
      billing_cycle: isAnnual ? "annual" : "monthly",
      page: "pricing",
    })
  }

  const planClick = (planId: string, isAnnual: boolean, position: number) => {
    trackEvent('plan_click', {
      plan_id: planId,
      billing_cycle: isAnnual ? "annual" : "monthly",
      position,
      page: "pricing",
    })
  }

  const checkoutStart = (planId: string, isAnnual: boolean, userId?: string) => {
    trackEvent('checkout_start', {
      plan_id: planId,
      billing_cycle: isAnnual ? "annual" : "monthly",
      page: "pricing",
    })
  }

  const checkoutComplete = (planId: string, isAnnual: boolean, amount: number, userId?: string) => {
    trackEvent('checkout_complete', {
      plan_id: planId,
      billing_cycle: isAnnual ? "annual" : "monthly",
      amount,
      currency: "USD",
      page: "pricing",
    })
  }

  const checkoutAbandon = (planId: string, isAnnual: boolean, step: string) => {
    trackEvent('checkout_abandon', {
      plan_id: planId,
      billing_cycle: isAnnual ? "annual" : "monthly",
      step,
      page: "pricing",
    })
  }

  const toggleBilling = (isAnnual: boolean) => {
    trackEvent('billing_toggle', {
      billing_cycle: isAnnual ? "annual" : "monthly",
      page: "pricing",
    })
  }

  const featureHover = (feature: string, planId: string) => {
    trackEvent('feature_hover', {
      feature,
      plan_id: planId,
      page: "pricing",
    })
  }

  const faqView = (question: string) => {
    trackEvent('faq_view', {
      question,
      page: "pricing",
    })
  }

  const scrollDepth = (depth: number) => {
    trackEvent('scroll_depth', {
      depth_percentage: depth,
      page: "pricing",
    })
  }

  const timeOnPage = (seconds: number) => {
    trackEvent('time_on_page', {
      duration_seconds: seconds,
      page: "pricing",
    })
  }

  // Track scroll depth
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout
    let lastScrollDepth = 0

    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const scrollPercent = Math.round((scrollTop / docHeight) * 100)
        
        // Track at 25%, 50%, 75%, 100%
        if (scrollPercent >= 25 && lastScrollDepth < 25) {
          scrollDepth(25)
          lastScrollDepth = 25
        } else if (scrollPercent >= 50 && lastScrollDepth < 50) {
          scrollDepth(50)
          lastScrollDepth = 50
        } else if (scrollPercent >= 75 && lastScrollDepth < 75) {
          scrollDepth(75)
          lastScrollDepth = 75
        } else if (scrollPercent >= 100 && lastScrollDepth < 100) {
          scrollDepth(100)
          lastScrollDepth = 100
        }
      }, 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  // Track time on page
  useEffect(() => {
    const startTime = Date.now()
    
    const trackTimeOnPage = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000)
      timeOnPage(timeSpent)
    }

    // Track every 30 seconds
    const interval = setInterval(trackTimeOnPage, 30000)
    
    // Track on page unload
    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000)
      timeOnPage(timeSpent)
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  // Enterprise contact methods
  const enterpriseContact = (data: Record<string, any>) => {
    trackEvent('PF_ENTERPRISE_CONTACT', data)
  }

  const enterpriseContactSuccess = (data: Record<string, any>) => {
    trackEvent('PF_ENTERPRISE_CONTACT_SUCCESS', data)
  }

  const enterpriseContactError = (error: string) => {
    trackEvent('PF_ENTERPRISE_CONTACT_ERROR', { error })
  }

  // Additional analytics methods
  const ctaClick = (ctaType: string, variant: string, plan?: string) => {
    trackEvent('PF_CTA_CLICK', { cta_type: ctaType, variant, plan })
  }

  const paymentSuccess = (plan: string, paymentMethod: string, source: string) => {
    trackEvent('PF_PAYMENT_SUCCESS', { plan, payment_method: paymentMethod, source })
  }

  const blogPostView = (postId: string, postTitle: string) => {
    trackEvent('PF_BLOG_POST_VIEW', { post_id: postId, post_title: postTitle })
  }

  const moduleView = (moduleId: string, moduleName: string) => {
    trackEvent('PF_MODULE_VIEW', { module_id: moduleId, module_name: moduleName })
  }

  const adminAction = (action: string, targetId?: string) => {
    trackEvent('PF_ADMIN_ACTION', { action, target_id: targetId })
  }

  return {
    // PLG Events
    landingCtaClick,
    pricingView,
    planSelected,
    checkoutStarted,
    checkoutCompleted,
    gateHit,
    paywallViewed,
    paywallCtaClick,
    gptTestReal,
    exportPDF,
    exportJSON,
    exportBundle,
    apiUsage,
    
    // Legacy Pricing Analytics
    planView,
    planClick,
    checkoutStart,
    checkoutComplete,
    checkoutAbandon,
    toggleBilling,
    featureHover,
    faqView,
    scrollDepth,
    timeOnPage,
    
    // Enterprise contact methods
    enterpriseContact,
    enterpriseContactSuccess,
    enterpriseContactError,
    
    // Additional analytics methods
    trackEvent,
    ctaClick,
    paymentSuccess,
    blogPostView,
    moduleView,
  }
}
