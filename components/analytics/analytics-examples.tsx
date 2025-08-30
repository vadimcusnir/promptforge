/**
 * Examples of how to use the new analytics events
 * This demonstrates the standard events implementation
 */

import { useAnalytics } from "@/components/analytics-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Download, CreditCard, Play } from "lucide-react"

export function AnalyticsExamples() {
  const analytics = useAnalytics()

  const handleCtaClick = () => {
    analytics.trackCtaClick(
      'start_building',
      'Start Building Now',
      'hero_primary',
      { targetUrl: '/generator' }
    )
  }

  const handlePricingSelect = () => {
    analytics.trackPricingSelect(
      'pro_monthly',
      'pro',
      'monthly',
      29
    )
  }

  const handleStartTrial = () => {
    analytics.trackStartTrial(
      'pro_trial',
      'pro_trial',
      { userId: 'user_123', email: 'user@example.com' }
    )
  }

  const handleExport = () => {
    analytics.trackExport(
      'pdf',
      { moduleId: 'M01', fileSize: 1024, userId: 'user_123' }
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="text-accent">Analytics Event Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Button onClick={handleCtaClick} className="bg-accent hover:bg-accent/80 text-accent-foreground">
              <Play className="w-4 h-4 mr-2" />
              Track CTA Click
            </Button>
            
            <Button onClick={handlePricingSelect} variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
              <CreditCard className="w-4 h-4 mr-2" />
              Track Pricing Select
            </Button>
            
            <Button onClick={handleStartTrial} variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
              <ArrowRight className="w-4 h-4 mr-2" />
              Track Start Trial
            </Button>
            
            <Button onClick={handleExport} variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
              <Download className="w-4 h-4 mr-2" />
              Track Export
            </Button>
          </div>
          
          <div className="text-sm text-gray-400 mt-4">
            <p>These buttons demonstrate the standard analytics events:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><code>cta_click</code> - Tracks button clicks with context</li>
              <li><code>pricing_select</code> - Tracks plan selections</li>
              <li><code>start_trial</code> - Tracks trial signups</li>
              <li><code>export</code> - Tracks file exports</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for easy analytics integration
export function useAnalyticsEvents() {
  const analytics = useAnalytics()

  return {
    // Page view tracking (automatic)
    trackPageView: (pagePath: string, pageTitle: string, category?: string) => {
      analytics.trackViewPage(pagePath, pageTitle, { pageCategory: category })
    },

    // CTA tracking
    trackCta: (type: string, text: string, position: string, targetUrl?: string) => {
      analytics.trackCtaClick(type, text, position, { targetUrl })
    },

    // Pricing tracking
    trackPricing: (planId: string, planType: 'free' | 'pro' | 'enterprise', billingCycle: 'monthly' | 'annual', price: number) => {
      analytics.trackPricingSelect(planId, planType, billingCycle, price)
    },

    // Trial tracking
    trackTrial: (planId: string, trialType: 'free' | 'pro_trial', userId?: string, email?: string) => {
      analytics.trackStartTrial(planId, trialType, { userId, email })
    },

    // Export tracking
    trackExport: (exportType: 'pdf' | 'json' | 'txt' | 'md' | 'zip', moduleId?: string, fileSize?: number, userId?: string) => {
      analytics.trackExport(exportType, { moduleId, fileSize, userId })
    }
  }
}
