'use client'

import { useState, useEffect } from 'react'
import { ArrowUp, X } from 'lucide-react'
import { useEntitlements } from '@/hooks/use-entitlements'
import { useTelemetry } from '@/hooks/use-telemetry'

export function StickyUpgradeBar() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const { userPlan } = useEntitlements()
  const { trackUserAction } = useTelemetry()

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      // Show after scrolling 50% of the page
      const shouldShow = scrollTop > (documentHeight - windowHeight) * 0.5
      setIsVisible(shouldShow && !isDismissed)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isDismissed])

  const handleUpgrade = () => {
    trackUserAction('sticky_upgrade', { 
      location: 'upgrade_bar', 
      userPlan: userPlan || 'unknown' 
    })
    
    // Scroll to pricing section
    const pricingSection = document.querySelector('[data-pricing-section]')
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    setIsVisible(false)
    
    trackUserAction('sticky_dismiss', { 
      location: 'upgrade_bar', 
      userPlan: userPlan || 'unknown' 
    })
  }

  if (!isVisible || userPlan === 'ENTERPRISE') {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-pf-black border-t border-pf-border shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ArrowUp className="w-5 h-5 text-pf-accent" />
              <span className="font-medium text-pf-text">Ready to upgrade?</span>
            </div>
            <p className="text-sm text-pf-text-muted hidden sm:block">
              Unlock professional features and advanced AI testing
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleUpgrade}
              className="bg-pf-gold text-black px-6 py-2 rounded-md font-medium hover:bg-pf-gold-dark transition-colors"
            >
              Upgrade Now
            </button>
            <button
              onClick={handleDismiss}
              className="p-2 text-pf-text-muted hover:text-pf-text transition-colors"
              aria-label="Dismiss upgrade bar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}