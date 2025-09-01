"use client";

import { useState, useEffect } from 'react';
import { PLANS, PlanType, BillingCycle, getPlanPrice, getPlanSavings } from '@/lib/plans';
import { PlanComparisonMatrix } from '@/components/pricing/plan-comparison-matrix';
import { StickyUpgradeBar } from '@/components/pricing/sticky-upgrade-bar';
import { PerformanceMonitor } from '@/components/performance/performance-monitor';
import { A11yMonitor } from '@/components/accessibility/a11y-monitor';
import { useTelemetry } from '@/hooks/use-telemetry';

export function PricingClient() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [loading, setLoading] = useState<PlanType | null>(null);
  const { 
    trackPageView, 
    trackUserAction, 
    trackConversion,
    trackPricingView,
    trackPlanSelected,
    trackCheckoutStarted,
    trackTrialStarted
  } = useTelemetry();

  // Track page view on mount
  useEffect(() => {
    trackPricingView({
      billingCycle,
      timestamp: Date.now()
    });
  }, [trackPricingView, billingCycle]);

  const handleSubscribe = async (planId: PlanType) => {
    // Track plan selection
    trackPlanSelected(planId, billingCycle, {
      price: getPlanPrice(planId, billingCycle)
    });

    // Track checkout started
    trackCheckoutStarted(planId, billingCycle, {
      price: getPlanPrice(planId, billingCycle)
    });

    if (planId === 'FREE') {
      // Track free plan selection
      trackConversion('free_plan_selected', 0, { planId });
      window.location.href = '/generator';
      return;
    }

    // Track trial start for Pro plan
    if (planId === 'PRO') {
      trackTrialStarted(planId, {
        billingCycle,
        price: getPlanPrice(planId, billingCycle)
      });
    }

    setLoading(planId);
    
    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          billingCycle,
          successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/checkout/cancel`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { checkout_url } = await response.json();
      
      // Track successful checkout session creation
      trackConversion('checkout_session_created', getPlanPrice(planId, billingCycle), {
        planId,
        billingCycle
      });
      
      window.location.href = checkout_url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      trackUserAction('checkout_error', {
        planId,
        billingCycle,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      alert('Failed to create checkout session. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const getButtonText = (planId: PlanType) => {
    if (loading === planId) return 'Processing...';
    if (planId === 'FREE') return 'Get Started Free';
    if (planId === 'PRO') return 'Start Pro Trial';
    if (planId === 'ENTERPRISE') return 'Contact Sales';
    return `Choose ${PLANS[planId].name}`;
  };

  const getButtonVariant = (planId: PlanType) => {
    if (planId === 'PRO') return 'bg-pf-gold text-black hover:bg-pf-gold-dark';
    if (planId === 'FREE' || planId === 'ENTERPRISE') return 'bg-pf-input text-pf-text hover:bg-pf-border';
    return 'bg-pf-gold text-black hover:bg-pf-gold-dark';
  };

  return (
    <main className="min-h-screen bg-pf-black py-8">
      <PerformanceMonitor />
      <A11yMonitor />
      <div className="max-w-7xl mx-auto px-6">
        {/* Header - Single H1 for SEO */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold text-pf-text mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-pf-text-muted max-w-3xl mx-auto mb-8">
            Unlock the full potential of prompt engineering with our flexible pricing plans. 
            From free simulation to enterprise-grade AI solutions.
          </p>
          
          {/* Moment of Value Highlight */}
          <div className="bg-gradient-to-r from-pf-gold/10 to-pf-accent/10 border border-pf-gold/20 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-3 text-pf-gold">
              🚀 Pro Plan Unlocks "Run Real Test"
            </h2>
            <p className="text-pf-text-muted">
              Move beyond simulation to live testing with real AI models. Get professional exports (.pdf/.json) 
              and access to our advanced Evaluator engine for production-ready prompts.
            </p>
          </div>
        </div>

        {/* Block A: Head-copy + Monthly/Annual switch */}
        <div className="bg-pf-card rounded-lg p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-pf-text mb-4">
              Start with Free, Scale with Pro
            </h2>
            <p className="text-pf-text-muted mb-6">
              All plans include our 7-D framework and 50+ industrial modules. 
              Upgrade to unlock Live Testing, professional exports, and enterprise features.
            </p>
            
            {/* Plan Aha Moments */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-pf-input/30 rounded-lg">
                <div className="text-pf-gold font-semibold mb-2">Free</div>
                <div className="text-sm text-pf-text-muted">Try prompt engineering risk-free</div>
              </div>
              <div className="text-center p-4 bg-pf-input/30 rounded-lg">
                <div className="text-pf-gold font-semibold mb-2">Creator</div>
                <div className="text-sm text-pf-text-muted">Access all 50 modules + .md exports</div>
              </div>
              <div className="text-center p-4 bg-pf-gold/20 rounded-lg border border-pf-gold/30">
                <div className="text-pf-gold font-semibold mb-2">Pro</div>
                <div className="text-sm text-pf-text-muted">Live testing + professional exports</div>
              </div>
              <div className="text-center p-4 bg-pf-input/30 rounded-lg">
                <div className="text-pf-gold font-semibold mb-2">Enterprise</div>
                <div className="text-sm text-pf-text-muted">API access + white-label solutions</div>
              </div>
            </div>
            
            {/* Monthly/Annual Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm ${billingCycle === 'monthly' ? 'text-pf-text' : 'text-pf-text-muted'}`}>
                Monthly
              </span>
                                      <button 
                          onClick={() => {
                            const newCycle = billingCycle === 'monthly' ? 'annual' : 'monthly';
                            setBillingCycle(newCycle);
                            trackUserAction('billing_cycle_changed', {
                              from: billingCycle,
                              to: newCycle
                            });
                          }}
                          className="relative inline-flex h-6 w-11 items-center rounded-full bg-pf-input transition-colors focus:outline-none focus:ring-2 focus:ring-pf-gold focus:ring-offset-2 focus:ring-offset-pf-black"
                          aria-label="Toggle billing period"
                        >
                <span 
                  className={`inline-block h-4 w-4 transform rounded-full bg-pf-gold transition-transform ${
                    billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                ></span>
              </button>
              <span className={`text-sm ${billingCycle === 'annual' ? 'text-pf-text' : 'text-pf-text-muted'}`}>
                Annual
              </span>
              {billingCycle === 'annual' && (
                <span className="text-sm text-pf-gold font-medium">Save 10× (Annual = 10× monthly)</span>
              )}
            </div>
          </div>
        </div>

        {/* Block B: Plan Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" data-pricing-section>
          {Object.values(PLANS).map((plan) => (
            <div 
              key={plan.id}
              className={`bg-pf-card rounded-lg p-6 border relative ${
                plan.popular ? 'border-2 border-pf-gold' : 'border-pf-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-pf-gold text-black px-3 py-1 rounded-full text-xs font-medium">
                    Recommended
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-pf-text mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-pf-text mb-1">
                  ${getPlanPrice(plan.id, billingCycle)}
                </div>
                <div className="text-sm text-pf-text-muted">
                  {plan.monthlyPrice === 0 ? 'Forever' : `per ${billingCycle === 'annual' ? 'year' : 'month'}`}
                </div>
                {billingCycle === 'annual' && plan.monthlyPrice > 0 && (
                  <div className="text-xs text-pf-gold mt-1">
                    Save {getPlanSavings(plan.id)}%
                  </div>
                )}
                {plan.trialDays && (
                  <div className="text-xs text-pf-accent mt-1">
                    {plan.trialDays}-day trial with watermarked exports
                  </div>
                )}
              </div>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-pf-text">
                    <span className="text-pf-gold mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id}
                className={`w-full py-2 rounded-md transition-colors font-medium ${
                  getButtonVariant(plan.id)
                } ${loading === plan.id ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {getButtonText(plan.id)}
              </button>
            </div>
          ))}
        </div>

        {/* Plan Comparison Matrix */}
        <PlanComparisonMatrix billingCycle={billingCycle} />

        {/* Block C: FAQ + CTA */}
        <div className="bg-pf-card rounded-lg p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-pf-text text-center mb-8">
              Frequently Asked Questions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-medium text-pf-text mb-3">How does billing work?</h3>
                <p className="text-pf-text-muted text-sm">
                  Annual plans save you 10× compared to monthly. You can upgrade, downgrade, or cancel anytime. 
                  Prorated billing for mid-cycle changes.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-pf-text mb-3">What's included in the Pro trial?</h3>
                <p className="text-pf-text-muted text-sm">
                  7-day free trial with full Pro features. Exports are watermarked during trial. 
                  No credit card required to start.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-pf-text mb-3">Can I export my prompts?</h3>
                <p className="text-pf-text-muted text-sm">
                  Yes! Free gets .txt, Creator adds .md, Pro adds .pdf/.json, Enterprise adds .zip bundles. 
                  All exports include your 7-D parameters.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-pf-text mb-3">What's "Run Real Test"?</h3>
                <p className="text-pf-text-muted text-sm">
                  Pro+ feature that tests your prompts against real GPT models and provides quality, 
                  risk, and cost scores. Essential for production use.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-pf-text-muted mb-4">
                Ready to unlock professional prompt engineering?
              </p>
              <button 
                onClick={() => handleSubscribe('PRO')}
                className="bg-pf-gold text-black px-8 py-3 rounded-md hover:bg-pf-gold-dark transition-colors font-medium"
              >
                Start the Forge
              </button>
            </div>
          </div>
        </div>

        {/* Annual Savings Note */}
        <div className="text-center mt-8 mb-8">
          <div className="bg-pf-card rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-lg text-pf-text-muted">
              💡 <strong className="text-pf-gold">Annual = 10× monthly</strong> - Save 2 months with annual billing
            </p>
            <p className="text-sm text-pf-text-muted mt-2">
              All annual plans include the same features as monthly plans, just with significant savings.
            </p>
          </div>
        </div>

        {/* Legal Links */}
        <div className="text-center mt-8 text-sm text-pf-text-muted">
          <div className="flex justify-center gap-6">
            <a href="/legal/terms" className="hover:text-pf-text transition-colors">Terms of Service</a>
            <a href="/legal/privacy" className="hover:text-pf-text transition-colors">Privacy Policy</a>
            <a href="/legal/dpa" className="hover:text-pf-text transition-colors">Data Processing Agreement</a>
          </div>
          <p className="mt-2">
            VAT handled by Stripe Tax • Secure payments powered by Stripe
          </p>
        </div>
      </div>
      
      {/* Sticky Upgrade Bar */}
      <StickyUpgradeBar />
      
      {/* Performance and Accessibility Monitoring */}
      <PerformanceMonitor />
      <A11yMonitor />
    </main>
  );
}
