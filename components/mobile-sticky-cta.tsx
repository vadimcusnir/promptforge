"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useAnalytics } from '@/hooks/use-analytics'
import { useStripeCheckout } from '@/hooks/use-stripe-checkout'
import { 
  Zap, 
  ArrowUp, 
  CreditCard, 
  Shield, 
  CheckCircle,
  Star,
  TrendingUp
} from 'lucide-react'

interface MobileStickyCTAProps {
  variant?: 'primary' | 'secondary' | 'upgrade'
  plan?: 'free' | 'creator' | 'pro' | 'enterprise'
  price?: string
  originalPrice?: string
  ctaText?: string
  subtext?: string
  features?: string[]
  className?: string
}

export function MobileStickyCTA({
  variant = 'primary',
  plan = 'pro',
  price = '$49',
  originalPrice = '$99',
  ctaText = 'Upgrade Now',
  subtext = 'Unlock all features',
  features = ['50+ modules', 'Real GPT testing', 'Export all formats'],
  className
}: MobileStickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const analytics = useAnalytics()
  const { createCheckoutSession } = useStripeCheckout()

  // Show CTA after scrolling down
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsVisible(scrollY > 300)
      setIsScrolled(scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Hide CTA when near bottom of page
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const documentHeight = document.documentElement.scrollHeight
      const windowHeight = window.innerHeight
      
      if (scrollY + windowHeight > documentHeight - 200) {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleUpgradeClick = async () => {
    if (isProcessing) return

    setIsProcessing(true)
    
    try {
      // Track analytics
      analytics.ctaClick('upgrade', 'mobile_sticky', plan)

      // Initiate Stripe checkout
      const priceId = getPriceId(plan)
      if (priceId) {
        await createCheckoutSession({
          planId: priceId,
          isAnnual: false,
          userId: undefined
        })
      } else {
        throw new Error('Price ID not found for plan')
      }

      toast({
        title: "Redirecting to checkout",
        description: "Please complete your payment to upgrade",
        variant: "default"
      })

    } catch (error) {
      console.error('Upgrade error:', error)
      toast({
        title: "Upgrade failed",
        description: "Please try again or contact support",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getPriceId = (plan: string) => {
    const priceIds = {
      creator: process.env.NEXT_PUBLIC_STRIPE_CREATOR_PRICE_ID,
      pro: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
      enterprise: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID
    }
    return priceIds[plan as keyof typeof priceIds] || priceIds.pro
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-white dark:bg-gray-800 border-2 border-yellow-400 text-gray-900 dark:text-white'
      case 'upgrade':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
      default:
        return 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
    }
  }

  const getPlanBadge = () => {
    const planConfig = {
      creator: { color: 'bg-green-500', text: 'Creator' },
      pro: { color: 'bg-blue-500', text: 'Pro' },
      enterprise: { color: 'bg-purple-500', text: 'Enterprise' }
    }
    
    const config = planConfig[plan as keyof typeof planConfig]
    if (!config) return null

    return (
      <Badge className={`${config.color} text-white text-xs px-2 py-1`}>
        {config.text}
      </Badge>
    )
  }

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop blur effect */}
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/80 dark:from-gray-900/80 to-transparent pointer-events-none z-40" />
      
      {/* Sticky CTA */}
      <div className={`
        fixed bottom-4 left-4 right-4 z-50 transition-all duration-300 ease-out
        ${isScrolled ? 'scale-100 opacity-100' : 'scale-95 opacity-90'}
        ${className}
      `}>
        <div className={`
          relative rounded-2xl p-4 shadow-2xl backdrop-blur-lg
          ${getVariantStyles()}
          border border-white/20
        `}>
          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <ArrowUp className="w-3 h-3 text-gray-600 dark:text-gray-400" />
          </button>

          <div className="flex items-center gap-3">
            {/* Icon and main content */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg truncate">{ctaText}</h3>
                {getPlanBadge()}
              </div>
              
              <p className="text-sm opacity-90 mb-2">{subtext}</p>
              
              {/* Features preview */}
              <div className="flex items-center gap-2 text-xs opacity-80">
                {features.slice(0, 2).map((feature, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>{feature}</span>
                  </div>
                ))}
                {features.length > 2 && (
                  <span className="opacity-60">+{features.length - 2} more</span>
                )}
              </div>
            </div>

            {/* Price and CTA */}
            <div className="flex-shrink-0 text-right">
              <div className="mb-1">
                {originalPrice && (
                  <span className="text-xs opacity-60 line-through mr-2">
                    {originalPrice}
                  </span>
                )}
                <span className="text-xl font-bold">{price}</span>
                <span className="text-sm opacity-80">/mo</span>
              </div>
              
              <Button
                onClick={handleUpgradeClick}
                disabled={isProcessing}
                className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-4 py-2 rounded-xl text-sm shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    {variant === 'upgrade' ? 'Upgrade' : 'Get Started'}
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-white/20 text-xs opacity-70">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              <span>Trusted</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Proven</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom safe area for mobile */}
      <div className="h-6" />
    </>
  )
}

// Hook for managing sticky CTA visibility
export function useStickyCTA() {
  const [showCTA, setShowCTA] = useState(false)
  const [ctaConfig, setCTAConfig] = useState({
    variant: 'primary' as const,
    plan: 'pro' as const,
    price: '$49',
    originalPrice: '$99',
    ctaText: 'Upgrade Now',
    subtext: 'Unlock all features',
    features: ['50+ modules', 'Real GPT testing', 'Export all formats']
  })

  const updateCTA = (config: Partial<typeof ctaConfig>) => {
    setCTAConfig(prev => ({ ...prev, ...config }))
  }

  const show = () => setShowCTA(true)
  const hide = () => setShowCTA(false)

  return {
    showCTA,
    ctaConfig,
    updateCTA,
    show,
    hide
  }
} 
