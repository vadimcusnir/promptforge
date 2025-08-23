"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Star, ArrowRight, Zap, Shield, Users, Code, Download } from "lucide-react";
import { STRIPE_PRODUCTS, type StripeProduct } from "@/lib/stripe/products";
import { useEntitlements } from "@/hooks/use-entitlements";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function PricingPage() {
  const router = useRouter();
  const { entitlements, loading, subscription } = useEntitlements('mock-org-id'); // Replace with actual org ID
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  // Get current user's plan
  const currentPlan = subscription?.plan_code || 'pilot';

  // Calculate yearly savings
  const yearlySavings = (plan: StripeProduct) => {
    if (!plan.yearlyPrice) return 0;
    const monthlyTotal = plan.monthlyPrice * 12;
    return Math.round(((monthlyTotal - plan.yearlyPrice) / monthlyTotal) * 100);
  };

  // Handle plan selection
  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  // Handle checkout
  const handleCheckout = async (product: StripeProduct) => {
    if (product.id === 'enterprise') {
      router.push('/contact?plan=enterprise');
      return;
    }

    if (product.monthlyPrice === 0) {
      // Free plan - no checkout needed
      return;
    }

    setIsCreatingCheckout(true);

    try {
      // Get current user and org info (you'll need to implement this)
      const userInfo = await getUserInfo();
      
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          orgId: userInfo.orgId,
          userId: userInfo.userId,
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`,
          customerEmail: userInfo.email,
        }),
      });

      const data = await response.json();

      if (data.error) {
        if (data.redirectTo) {
          router.push(data.redirectTo);
        } else {
          console.error('Checkout error:', data.error);
          // Handle error (show toast, etc.)
        }
        return;
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  // Mock function - replace with actual user info retrieval
  const getUserInfo = async () => {
    // This should get the actual user and org info from your auth system
    return {
      orgId: 'mock-org-id',
      userId: 'mock-user-id',
      email: 'user@example.com',
    };
  };

  // Get current plan details
  const currentPlanDetails = STRIPE_PRODUCTS.find(p => p.id === currentPlan);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          Choose Your Plan
        </h1>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
          Start with our free Pilot plan and scale up as you grow. All plans include our core AI prompt engineering tools.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center mt-8 mb-12">
          <span className={`mr-4 text-sm ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
               }`}
            />
          </button>
          <span className={`ml-4 text-sm ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-400'}`}>
            Yearly
            <Badge variant="secondary" className="ml-2 bg-green-600 text-white">
              Save up to 20%
            </Badge>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {STRIPE_PRODUCTS.map((product) => {
            const isCurrentPlan = product.id === currentPlan;
            const isPopular = product.popular;
            const isRecommended = product.recommended;
            const price = billingCycle === 'yearly' && product.yearlyPrice 
              ? product.yearlyPrice 
              : product.monthlyPrice;
            const savings = billingCycle === 'yearly' ? yearlySavings(product) : 0;

            return (
              <Card 
                key={product.id}
                className={`relative transition-all duration-300 hover:scale-105 ${
                  isCurrentPlan 
                    ? 'ring-2 ring-blue-500 bg-blue-950/20' 
                    : 'bg-slate-800/50 border-slate-700'
                } ${isPopular ? 'ring-2 ring-yellow-500' : ''}`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-yellow-500 text-black font-semibold px-4 py-2">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* Recommended Badge */}
                {isRecommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white font-semibold px-4 py-2">
                      <Zap className="w-4 h-4 mr-1" />
                      Recommended
                    </Badge>
                  </div>
                )}

                {/* Current Plan Badge */}
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white font-semibold px-4 py-2">
                      <Check className="w-4 h-4 mr-1" />
                      Current Plan
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-white">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    {product.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Pricing */}
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">$</span>
                      <span className="text-6xl font-bold text-white">
                        {price === 0 ? '0' : price}
                      </span>
                      {price > 0 && (
                        <span className="text-xl text-slate-400 ml-2">
                          /{billingCycle === 'yearly' ? 'year' : 'month'}
                        </span>
                      )}
                    </div>
                    
                    {savings > 0 && (
                      <p className="text-green-400 text-sm mt-2">
                        Save {savings}% with yearly billing
                      </p>
                    )}

                    {product.id === 'enterprise' && (
                      <p className="text-blue-400 text-sm mt-2">
                        Custom pricing for your needs
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limits */}
                  <div className="bg-slate-700/30 rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold text-white text-sm mb-3">Plan Limits</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center">
                        <Code className="w-3 h-3 text-blue-400 mr-2" />
                        <span className="text-slate-300">
                          {product.limits.promptsPerMonth === 999999 ? 'Unlimited' : `${product.limits.promptsPerMonth.toLocaleString()}`} prompts
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-3 h-3 text-green-400 mr-2" />
                        <span className="text-slate-300">
                          {product.limits.modules === 999999 ? 'Unlimited' : product.limits.modules} modules
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Download className="w-3 h-3 text-purple-400 mr-2" />
                        <span className="text-slate-300">
                          {product.limits.exportFormats.join(', ').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Shield className="w-3 h-3 text-yellow-400 mr-2" />
                        <span className="text-slate-300">
                          {product.limits.support} support
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-4">
                  {isCurrentPlan ? (
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700" 
                      disabled
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Current Plan
                    </Button>
                  ) : product.id === 'enterprise' ? (
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleCheckout(product)}
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Contact Sales
                    </Button>
                  ) : (
                    <Button 
                      className={`w-full ${
                        isPopular 
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-black' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                      onClick={() => handleCheckout(product)}
                      disabled={isCreatingCheckout}
                    >
                      {isCreatingCheckout ? (
                        'Creating checkout...'
                      ) : (
                        <>
                          {price === 0 ? 'Get Started' : 'Subscribe Now'}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 pb-16">
        <Separator className="bg-slate-700 mb-12" />
        
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Can I change plans anytime?
                </h3>
                <p className="text-slate-300">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Is there a free trial?
                </h3>
                <p className="text-slate-300">
                  Creator and Pro plans include a free trial period. Pilot is always free, and Enterprise offers custom trials.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  What happens if I exceed my limits?
                </h3>
                <p className="text-slate-300">
                  You'll receive a notification when approaching limits. Upgrade anytime to continue without interruption.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Can I cancel anytime?
                </h3>
                <p className="text-slate-300">
                  Absolutely. Cancel your subscription anytime and continue using the service until the end of your billing period.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your AI Prompts?
          </h2>
          <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
            Join thousands of professionals who are already using PROMPTFORGE™ to create better AI experiences.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4"
            onClick={() => router.push('/dashboard')}
          >
            Get Started Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
