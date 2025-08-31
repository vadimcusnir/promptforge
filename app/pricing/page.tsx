"use client";

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Zap, Crown, Building, ArrowRight } from 'lucide-react'
import { STRIPE_PLANS } from '@/lib/stripe'

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (planType: keyof typeof STRIPE_PLANS) => {
    setLoading(planType)
    
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType,
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`,
        }),
      })

      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('No checkout URL received')
      }
    } catch (error) {
      console.error('Subscription error:', error)
    } finally {
      setLoading(null)
    }
  }

  const plans = [
    {
      key: 'FREE' as const,
      icon: <Zap className="w-6 h-6" />,
      popular: false,
      color: 'text-gray-400',
      bgColor: 'bg-gray-100',
    },
    {
      key: 'CREATOR' as const,
      icon: <Zap className="w-6 h-6" />,
      popular: true,
      color: 'text-gold-industrial',
      bgColor: 'bg-gold-industrial/10',
    },
    {
      key: 'PRO' as const,
      icon: <Crown className="w-6 h-6" />,
      popular: false,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
    },
    {
      key: 'ENTERPRISE' as const,
      icon: <Building className="w-6 h-6" />,
      popular: false,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
    },
  ]

  return (
    <div className="min-h-screen bg-pf-black py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-pf-text mb-6">
            Choose Your <span className="text-gold-industrial">Plan</span>
          </h1>
          <p className="text-xl text-pf-text-muted max-w-3xl mx-auto">
            Unlock the full potential of AI prompt engineering with our flexible pricing plans. 
            Start free and scale as you grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan) => {
            const planData = STRIPE_PLANS[plan.key]
            const isFree = plan.key === 'FREE'
            
            return (
              <Card
                key={plan.key}
                className={`relative bg-pf-surface border-pf-text-muted/30 ${
                  plan.popular ? 'border-gold-industrial ring-2 ring-gold-industrial/20' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gold-industrial text-pf-black px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-full ${plan.bgColor} flex items-center justify-center ${plan.color}`}>
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl text-pf-text">{planData.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-pf-text">
                      ${planData.price}
                    </span>
                    {!isFree && <span className="text-pf-text-muted">/month</span>}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-pf-text font-semibold mb-3">Features:</h4>
                    <ul className="space-y-2">
                      {planData.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-pf-text-muted">
                          <Check className="w-4 h-4 text-gold-industrial mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-pf-text font-semibold mb-3">Limits:</h4>
                    <div className="space-y-2 text-sm text-pf-text-muted">
                      <div className="flex justify-between">
                        <span>Modules:</span>
                        <span>{planData.limits.modules === -1 ? 'Unlimited' : planData.limits.modules}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Exports:</span>
                        <span>{planData.limits.exports === -1 ? 'Unlimited' : planData.limits.exports}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>AI Generations:</span>
                        <span>{planData.limits.aiGenerations === -1 ? 'Unlimited' : planData.limits.aiGenerations}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => isFree ? window.location.href = '/dashboard' : handleSubscribe(plan.key)}
                    disabled={loading === plan.key}
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gold-industrial text-pf-black hover:bg-gold-industrial-dark' 
                        : 'bg-pf-surface border border-pf-text-muted/30 text-pf-text hover:bg-pf-text-muted/10'
                    }`}
                  >
                    {loading === plan.key ? (
                      'Processing...'
                    ) : isFree ? (
                      'Get Started Free'
                    ) : (
                      <>
                        Subscribe Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-pf-text text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-pf-text mb-2">
                  Can I change plans anytime?
                </h3>
                <p className="text-pf-text-muted">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-pf-text mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-pf-text-muted">
                  We accept all major credit cards through Stripe. Your payment information is secure and encrypted.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-pf-text mb-2">
                  Is there a free trial?
                </h3>
                <p className="text-pf-text-muted">
                  Yes! The Free plan gives you access to basic features. All paid plans come with a 14-day free trial.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-pf-text mb-2">
                  Can I cancel anytime?
                </h3>
                <p className="text-pf-text-muted">
                  Absolutely. You can cancel your subscription at any time. You'll retain access until the end of your billing period.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
