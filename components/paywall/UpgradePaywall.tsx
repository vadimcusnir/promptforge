"use client";

import React from "react";
import { X, Check, Star, Zap, Shield, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export interface PlanFeature {
  name: string;
  free: number;
  creator: number;
  pro: number;
  enterprise: number;
}

export interface PlanTier {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
}

const PLAN_FEATURES: PlanFeature[] = [
  { name: "Monthly Prompt Generations", free: 10, creator: 100, pro: 1000, enterprise: -1 },
  { name: "GPT Optimizations", free: 0, creator: 25, pro: 100, enterprise: -1 },
  { name: "Export Formats", free: 2, creator: 4, pro: 6, enterprise: 8 },
  { name: "Cloud History", free: 0, creator: 30, pro: 90, enterprise: -1 },
  { name: "Team Members", free: 1, creator: 3, pro: 10, enterprise: -1 },
  { name: "Custom Modules", free: 0, creator: 5, pro: 25, enterprise: -1 },
  { name: "Priority Support", free: 0, creator: 0, pro: 1, enterprise: 1 },
  { name: "Advanced Analytics", free: 0, creator: 0, pro: 1, enterprise: 1 },
];

const PLAN_TIERS: PlanTier[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: ["10 monthly generations", "Basic exports", "Community support"],
    icon: <Star className="w-5 h-5" />,
    color: "text-gray-600",
  },
  {
    id: "creator",
    name: "Creator",
    price: "$29",
    description: "For individual creators and small teams",
    features: ["100 monthly generations", "GPT optimization", "JSON/MD exports", "Cloud history"],
    icon: <Zap className="w-5 h-5" />,
    color: "text-blue-600",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$99",
    description: "For growing businesses and teams",
    features: ["1000 monthly generations", "Advanced analytics", "PDF exports", "Team collaboration"],
    popular: true,
    icon: <Shield className="w-5 h-5" />,
    color: "text-purple-600",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$299",
    description: "For large organizations",
    features: ["Unlimited generations", "Bundle exports", "Custom modules", "Priority support"],
    icon: <Crown className="w-5 h-5" />,
    color: "text-amber-600",
  },
];

interface UpgradePaywallProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  currentPlan: string;
  requiredPlan: string;
  reason: string;
}

export function UpgradePaywall({ isOpen, onClose, feature, currentPlan, requiredPlan, reason }: UpgradePaywallProps) {
  const handleUpgrade = async (planId: string) => {
    try {
      // Create Stripe checkout session
      const response = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          successUrl: `${window.location.origin}/generator?upgrade=success`,
          cancelUrl: `${window.location.origin}/generator?upgrade=cancelled`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      // Fallback to manual upgrade flow
      console.log('Please contact support to upgrade your plan.');
      // TODO: Replace with proper toast notification
    }
  };

  const getFeatureIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return <Star className="w-4 h-4" />;
      case 'creator':
        return <Zap className="w-4 h-4" />;
      case 'pro':
        return <Shield className="w-4 h-4" />;
      case 'enterprise':
        return <Crown className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const getFeatureColor = (planId: string) => {
    switch (planId) {
      case 'free':
        return 'text-gray-600';
      case 'creator':
        return 'text-blue-600';
      case 'pro':
        return 'text-purple-600';
      case 'enterprise':
        return 'text-amber-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Upgrade Your Plan</DialogTitle>
          <DialogDescription className="text-lg">
            {reason}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Plan Status */}
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-full">
                  {getFeatureIcon(currentPlan)}
                </div>
                <div>
                  <h3 className="font-semibold text-amber-800">
                    Current Plan: {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
                  </h3>
                  <p className="text-amber-700 text-sm">
                    You're currently on the {currentPlan} plan. Upgrade to access {feature}.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plan Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLAN_TIERS.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto p-3 rounded-full bg-muted ${plan.color}`}>
                    {plan.icon}
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">{plan.price}</div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handleUpgrade(plan.id)}
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.id === currentPlan ? 'Current Plan' : 'Upgrade'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Feature</th>
                      <th className="text-center p-2">Free</th>
                      <th className="text-center p-2">Creator</th>
                      <th className="text-center p-2">Pro</th>
                      <th className="text-center p-2">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PLAN_FEATURES.map((feature, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{feature.name}</td>
                        <td className="p-2 text-center">
                          {typeof feature.free === 'boolean' 
                            ? (feature.free ? '✓' : '✗')
                            : feature.free === -1 ? '∞' : feature.free
                          }
                        </td>
                        <td className="p-2 text-center">
                          {typeof feature.creator === 'boolean' 
                            ? (feature.creator ? '✓' : '✗')
                            : feature.creator === -1 ? '∞' : feature.creator
                          }
                        </td>
                        <td className="p-2 text-center">
                          {typeof feature.pro === 'boolean' 
                            ? (feature.pro ? '✓' : '✗')
                            : feature.pro === -1 ? '∞' : feature.pro
                          }
                        </td>
                        <td className="p-2 text-center">
                          {typeof feature.enterprise === 'boolean' 
                            ? (feature.enterprise ? '✓' : '✗')
                            : feature.enterprise === -1 ? '∞' : feature.enterprise
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">Can I change plans anytime?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </div>
              <div>
                <h4 className="font-medium">What happens to my data when I upgrade?</h4>
                <p className="text-sm text-muted-foreground">
                  All your data, prompts, and history are preserved when you upgrade. You'll immediately gain access to new features.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Is there a free trial for paid plans?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, all paid plans come with a 14-day free trial. No credit card required to start.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center pt-4">
          <Button variant="ghost" onClick={onClose}>
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
