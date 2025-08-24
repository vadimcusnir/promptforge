"use client";
import React, { useState } from "react";
import { Check, Star, Zap, Shield, Users, Database, BarChart3, Download, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { SkipLink } from "@/components/SkipLink";
import { toast } from "@/hooks/use-toast";

interface PlanFeature {
  name: string;
  description: string;
  free: boolean;
  creator: boolean;
  pro: boolean;
  enterprise: boolean;
}

interface PlanTier {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  monthlyPrice: number;
  annualPrice: number;
  popular?: boolean;
  features: string[];
}

const PLAN_FEATURES: PlanFeature[] = [
  {
    name: "Prompt Generation",
    description: "Generate prompts using our 7-D parameter engine",
    free: true,
    creator: true,
    pro: true,
    enterprise: true,
  },
  {
    name: "Module Access",
    description: "Access to prompt modules (M01-M50)",
    free: true,
    creator: true,
    pro: true,
    enterprise: true,
  },
  {
    name: "Basic Export (.txt)",
    description: "Export prompts as plain text files",
    free: true,
    creator: true,
    pro: true,
    enterprise: true,
  },
  {
    name: "Markdown Export (.md)",
    description: "Export prompts as formatted markdown",
    free: false,
    creator: true,
    pro: true,
    enterprise: true,
  },
  {
    name: "JSON Export (.json)",
    description: "Export prompts with metadata and configuration",
    free: false,
    creator: true,
    pro: true,
    enterprise: true,
  },
  {
    name: "PDF Export (.pdf)",
    description: "Export prompts as professional PDF documents",
    free: false,
    creator: false,
    pro: true,
    enterprise: true,
  },
  {
    name: "Bundle Export (.zip)",
    description: "Export complete prompt packages with manifests",
    free: false,
    creator: false,
    pro: false,
    enterprise: true,
  },
  {
    name: "GPT Optimization",
    description: "AI-powered prompt testing and optimization",
    free: false,
    creator: true,
    pro: true,
    enterprise: true,
  },
  {
    name: "Cloud History",
    description: "Store and manage prompt history in the cloud",
    free: false,
    creator: true,
    pro: true,
    enterprise: true,
  },
  {
    name: "Advanced Analytics",
    description: "Detailed performance metrics and insights",
    free: false,
    creator: false,
    pro: true,
    enterprise: true,
  },
  {
    name: "Custom Modules",
    description: "Create and manage custom prompt modules",
    free: false,
    creator: false,
    pro: true,
    enterprise: true,
  },
  {
    name: "Team Collaboration",
    description: "Share prompts and collaborate with team members",
    free: false,
    creator: false,
    pro: true,
    enterprise: true,
  },
  {
    name: "Priority Support",
    description: "24/7 priority customer support",
    free: false,
    creator: false,
    pro: false,
    enterprise: true,
  },
  {
    name: "Enterprise API",
    description: "Access to high-performance API endpoints",
    free: false,
    creator: false,
    pro: false,
    enterprise: true,
  },
  {
    name: "Rate Limits",
    description: "Monthly generation and export limits",
    free: "10 prompts, 5 exports",
    creator: "100 prompts, 50 exports",
    pro: "1000 prompts, 500 exports",
    enterprise: "Unlimited",
  },
];

const PLAN_TIERS: PlanTier[] = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for getting started with prompt engineering",
    icon: <Star className="h-6 w-6" />,
    color: "text-gray-600",
    monthlyPrice: 0,
    annualPrice: 0,
    features: ["10 prompts/month", "Basic exports", "Community support"],
  },
  {
    id: "creator",
    name: "Creator",
    description: "Ideal for content creators and freelancers",
    icon: <Zap className="h-6 w-6" />,
    color: "text-blue-600",
    monthlyPrice: 19,
    annualPrice: 190,
    features: ["100 prompts/month", "Markdown & JSON exports", "GPT optimization", "Cloud history"],
  },
  {
    id: "pro",
    name: "Pro",
    description: "Built for professional teams and agencies",
    icon: <Shield className="h-6 w-6" />,
    color: "text-purple-600",
    monthlyPrice: 49,
    annualPrice: 490,
    popular: true,
    features: ["1000 prompts/month", "PDF exports", "Advanced analytics", "Custom modules", "Team collaboration"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations with advanced needs",
    icon: <Users className="h-6 w-6" />,
    color: "text-green-600",
    monthlyPrice: 199,
    annualPrice: 1990,
    features: ["Unlimited prompts", "Bundle exports", "Enterprise API", "Priority support", "Dedicated account manager"],
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    if (planId === "free") {
      toast({
        title: "Free Plan",
        description: "You're already on the free plan!",
      });
      return;
    }

    setLoading(planId);
    
    try {
      const response = await fetch("/api/billing/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          billingCycle,
          successUrl: `${window.location.origin}/dashboard?upgrade=success`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
      });
    } finally {
      setLoading(null);
    }
  };

  const getPrice = (plan: PlanTier) => {
    const price = billingCycle === "annual" ? plan.annualPrice : plan.monthlyPrice;
    if (price === 0) return "Free";
    
    const savings = billingCycle === "annual" ? Math.round((plan.monthlyPrice * 12 - plan.annualPrice) / (plan.monthlyPrice * 12) * 100) : 0;
    
    return (
      <div className="text-center">
        <div className="text-3xl font-bold">
          ${price}
          <span className="text-lg text-muted-foreground">
            /{billingCycle === "annual" ? "year" : "month"}
          </span>
        </div>
        {billingCycle === "annual" && savings > 0 && (
          <Badge variant="secondary" className="mt-2">
            Save {savings}%
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <SkipLink />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Choose the plan that fits your needs. All plans include our core prompt generation features.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === "annual" ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                  billingCycle === "annual" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm ${billingCycle === "annual" ? "text-foreground" : "text-muted-foreground"}`}>
              Annual
              <Badge variant="secondary" className="ml-2">
                Save up to 20%
              </Badge>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {PLAN_TIERS.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.popular ? "ring-2 ring-primary" : ""}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <div className={`mx-auto mb-4 ${plan.color}`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="text-center">
                <div className="mb-6">
                  {getPrice(plan)}
                </div>
                
                <ul className="space-y-3 mb-6 text-left">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading === plan.id}
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  {loading === plan.id ? (
                    "Processing..."
                  ) : plan.id === "free" ? (
                    "Current Plan"
                  ) : (
                    "Subscribe Now"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4">Free</th>
                  <th className="text-center p-4">Creator</th>
                  <th className="text-center p-4">Pro</th>
                  <th className="text-center p-4">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {PLAN_FEATURES.map((feature, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{feature.name}</div>
                        <div className="text-sm text-muted-foreground">{feature.description}</div>
                      </div>
                    </td>
                    <td className="text-center p-4">
                      {typeof feature.free === "boolean" ? (
                        feature.free ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : <span className="text-muted-foreground">—</span>
                      ) : (
                        <span className="text-sm">{feature.free}</span>
                      )}
                    </td>
                    <td className="text-center p-4">
                      {typeof feature.creator === "boolean" ? (
                        feature.creator ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : <span className="text-muted-foreground">—</span>
                      ) : (
                        <span className="text-sm">{feature.creator}</span>
                      )}
                    </td>
                    <td className="text-center p-4">
                      {typeof feature.pro === "boolean" ? (
                        feature.pro ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : <span className="text-muted-foreground">—</span>
                      ) : (
                        <span className="text-sm">{feature.pro}</span>
                      )}
                    </td>
                    <td className="text-center p-4">
                      {typeof feature.enterprise === "boolean" ? (
                        feature.enterprise ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : <span className="text-muted-foreground">—</span>
                      ) : (
                        <span className="text-sm">{feature.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change plans anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What happens if I exceed my limits?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You'll receive a notification when approaching limits. Upgrade your plan to continue generating prompts.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! Start with our free plan and upgrade when you need more features or higher limits.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do Enterprise API limits work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Enterprise plans include dedicated API endpoints with higher rate limits and priority processing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of users who are already creating better prompts with PromptForge.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => handleSubscribe("creator")} size="lg">
                  Start with Creator Plan
                </Button>
                <Button variant="outline" size="lg">
                  Contact Sales
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
