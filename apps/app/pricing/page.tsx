"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import { PageLayout } from "@/components/layout/page-layout"
import { HeroBlock } from "@/components/layout/hero-block"

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: "Free",
      monthlyPrice: 0,
      annualPrice: 0,
      period: "forever",
      description: "Perfect for getting started",
      features: [
        { name: "Modules M01, M10, M18", included: true },
        { name: "Export txt", included: true },
        { name: "Local history", included: true },
        { name: "Community support", included: true },
        { name: "Export md", included: false },
        { name: "Live Test Engine", included: false },
        { name: "Cloud history", included: false },
        { name: "API access", included: false },
      ],
      cta: "Start Free",
      popular: false,
    },
    {
      name: "Creator",
      monthlyPrice: 19,
      annualPrice: 15, // 20% discount
      period: "month",
      description: "For content creators and solopreneurs",
      features: [
        { name: "All modules", included: true },
        { name: "Export txt, md", included: true },
        { name: "Local history", included: true },
        { name: "Community support", included: true },
        { name: "Export pdf, json", included: false },
        { name: "Live Test Engine", included: false },
        { name: "Cloud history", included: false },
        { name: "API access", included: false },
      ],
      cta: "Start Creator",
      popular: false,
    },
    {
      name: "Pro",
      monthlyPrice: 49,
      annualPrice: 39, // 20% discount
      period: "month",
      description: "For professionals and teams",
      features: [
        { name: "All modules", included: true },
        { name: "Export pdf, json", included: true },
        { name: "Live Test Engine", included: true },
        { name: "Cloud history", included: true },
        { name: "Evaluator", included: true },
        { name: "Priority support", included: true },
        { name: "API access", included: false },
        { name: "White-label", included: false },
      ],
      cta: "Start Pro Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      monthlyPrice: 299,
      annualPrice: 239, // 20% discount
      period: "month",
      description: "For organizations at scale",
      features: [
        { name: "Everything in Pro", included: true },
        { name: "API access", included: true },
        { name: "Bundle.zip exports", included: true },
        { name: "White-label options", included: true },
        { name: "5 seats included", included: true },
        { name: "Custom integrations", included: true },
        { name: "Dedicated support", included: true },
        { name: "SLA guarantee", included: true },
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ]

  return (
    <PageLayout
      variant="marketing"
      subnav={
        <div className="flex items-center gap-4">
          <span
            className={`transition-colors font-space-grotesk ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}
          >
            Monthly
          </span>
          <div className="relative">
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              aria-label={`Switch to ${isAnnual ? "monthly" : "annual"} billing`}
              className={`w-12 h-6 rounded-full cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#00FF7F] ${
                isAnnual ? "bg-[#CDA434]" : "bg-muted"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-background rounded-full transition-transform ${
                  isAnnual ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <span
            className={`transition-colors font-space-grotesk ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}
          >
            Annual
          </span>
          <Badge className="bg-[#CDA434] text-background font-space-grotesk">Save 20%</Badge>
        </div>
      }
    >
      <HeroBlock title="Choose Your Plan" subtitle="Scale from pilot to enterprise with clear upgrade paths" />

      <section className="py-24">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`glass-card relative transition-all duration-300 ${
                  plan.popular
                    ? "border-2 border-[#CDA434] scale-105 shadow-2xl shadow-[#CDA434]/20"
                    : "border border-border hover:border-muted-foreground"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-[#CDA434] to-[#b8941f] text-background font-semibold px-4 py-1 shadow-lg font-space-grotesk">
                      ⭐ Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="font-cinzel text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground font-space-grotesk">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold font-cinzel">
                      ${plan.name === "Free" ? "0" : isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-muted-foreground font-space-grotesk">
                      /{plan.name === "Free" ? plan.period : isAnnual ? "month" : plan.period}
                    </span>
                    {isAnnual && plan.name !== "Free" && (
                      <div className="text-sm text-[#CDA434] mt-1 font-space-grotesk">
                        Save ${(plan.monthlyPrice - plan.annualPrice) * 12}/year
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <span
                          className={`text-sm font-space-grotesk ${feature.included ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full transition-all duration-200 font-space-grotesk ${
                      plan.popular
                        ? "bg-gradient-to-r from-[#CDA434] to-[#b8941f] hover:from-[#b8941f] hover:to-[#a08419] text-background font-semibold shadow-lg"
                        : "bg-transparent border border-border hover:border-[#CDA434] hover:bg-[#CDA434]/10"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-card/50">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-cinzel text-[28px] md:text-[32px] leading-[1.35] font-bold mb-8">
              Complete Feature Comparison
            </h2>
          </div>
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full max-w-6xl mx-auto glass-card rounded-lg min-w-[800px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-cinzel text-lg sticky left-0 bg-background/90">Features</th>
                  <th className="text-center p-4 font-cinzel text-lg">Free</th>
                  <th className="text-center p-4 font-cinzel text-lg">Creator</th>
                  <th className="text-center p-4 font-cinzel text-lg relative">
                    Pro
                    <Badge className="absolute -top-2 -right-2 bg-[#CDA434] text-background text-xs font-space-grotesk">
                      Popular
                    </Badge>
                  </th>
                  <th className="text-center p-4 font-cinzel text-lg">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {/* Core Access */}
                <tr className="border-b border-border">
                  <td colSpan={5} className="p-3 bg-card/50 font-semibold text-[#CDA434] font-cinzel">
                    🔧 Core Access
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 text-muted-foreground font-space-grotesk sticky left-0 bg-background/90">
                    Module Access
                  </td>
                  <td className="p-4 text-center font-space-grotesk">3 modules (M01, M10, M18)</td>
                  <td className="p-4 text-center font-space-grotesk">All 50 modules</td>
                  <td className="p-4 text-center font-space-grotesk">All 50 modules</td>
                  <td className="p-4 text-center font-space-grotesk">All 50 modules</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 text-muted-foreground font-space-grotesk sticky left-0 bg-background/90">
                    7D Parameter Engine
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 text-muted-foreground font-space-grotesk sticky left-0 bg-background/90">
                    Monthly Prompts
                  </td>
                  <td className="p-4 text-center font-space-grotesk">10</td>
                  <td className="p-4 text-center font-space-grotesk">Unlimited</td>
                  <td className="p-4 text-center font-space-grotesk">Unlimited</td>
                  <td className="p-4 text-center font-space-grotesk">Unlimited</td>
                </tr>

                {/* Export Options */}
                <tr className="border-b border-border">
                  <td colSpan={5} className="p-3 bg-card/50 font-semibold text-[#CDA434] font-cinzel">
                    📤 Export Options
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 text-muted-foreground font-space-grotesk sticky left-0 bg-background/90">
                    Text Export (.txt)
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 text-muted-foreground font-space-grotesk sticky left-0 bg-background/90">
                    Markdown Export (.md)
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 text-muted-foreground font-space-grotesk sticky left-0 bg-background/90">
                    PDF Export
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 text-muted-foreground font-space-grotesk sticky left-0 bg-background/90">
                    JSON Export
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 text-muted-foreground font-space-grotesk sticky left-0 bg-background/90">
                    Bundle.zip Export
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>

                {/* Testing & Analytics */}
                <tr className="border-b border-border">
                  <td colSpan={5} className="p-3 bg-card/50 font-semibold text-[#CDA434] font-cinzel">
                    🧪 Testing & Analytics
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 text-muted-foreground font-space-grotesk sticky left-0 bg-background/90">
                    Simulation Testing
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 text-muted-foreground font-space-grotesk sticky left-0 bg-background/90">
                    Live GPT Testing
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 text-muted-foreground font-space-grotesk sticky left-0 bg-background/90">
                    Advanced Evaluator
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 text-muted-foreground font-space-grotesk sticky left-0 bg-background/90">
                    Performance Analytics
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>

                {/* History & Storage */}
                <tr className="border-b border-border">
                  <td colSpan={5} className="p-3 bg-card/50 font-semibold text-[#CDA434] font-cinzel">
                    💾 History & Storage
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 text-muted-foreground font-space-grotesk sticky left-0 bg-background/90">
                    Local History
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 text-muted-foreground font-space-grotesk sticky left-0 bg-background/90">
                    Cloud History & Sync
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 text-muted-foreground font-space-grotesk sticky left-0 bg-background/90">
                    Version Control
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>

                {/* API & Integration */}
                <tr className="border-b border-border">
                  <td colSpan={5} className="p-3 bg-card/50 font-semibold text-[#CDA434] font-cinzel">
                    🔌 API & Integration
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 text-muted-foreground font-space-grotesk sticky left-0 bg-background/90">
                    REST API Access
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 text-muted-foreground font-space-grotesk sticky left-0 bg-background/90">
                    Webhook Support
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 text-muted-foreground font-space-grotesk sticky left-0 bg-background/90">
                    Custom Integrations
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>

                {/* Support & Collaboration */}
                <tr className="border-b border-border">
                  <td colSpan={5} className="p-3 bg-card/50 font-semibold text-[#CDA434] font-cinzel">
                    🤝 Support & Collaboration
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 text-muted-foreground font-space-grotesk sticky left-0 bg-background/90">
                    Community Support
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 text-muted-foreground font-space-grotesk sticky left-0 bg-background/90">
                    Priority Support
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 text-muted-foreground font-space-grotesk sticky left-0 bg-background/90">
                    Dedicated Support
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 text-muted-foreground font-space-grotesk sticky left-0 bg-background/90">
                    Team Seats
                  </td>
                  <td className="p-4 text-center font-space-grotesk">1</td>
                  <td className="p-4 text-center font-space-grotesk">1</td>
                  <td className="p-4 text-center font-space-grotesk">1</td>
                  <td className="p-4 text-center font-space-grotesk">5 included</td>
                </tr>
                <tr>
                  <td className="p-4 text-muted-foreground font-space-grotesk sticky left-0 bg-background/90">
                    SLA Guarantee
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">
                    <X className="w-5 h-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="p-4 text-center font-space-grotesk">99.9% uptime</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-cinzel text-[28px] md:text-[32px] leading-[1.35] font-bold mb-8">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="glass-card text-left">
              <CardHeader>
                <CardTitle className="font-cinzel text-lg">What's included in the free plan?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-space-grotesk">
                  The free plan includes access to 3 core modules (M01, M10, M18), basic text exports, and local history
                  storage. Perfect for trying out the platform.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card text-left">
              <CardHeader>
                <CardTitle className="font-cinzel text-lg">Can I upgrade or downgrade anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-space-grotesk">
                  Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take
                  effect at the next billing cycle.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card text-left">
              <CardHeader>
                <CardTitle className="font-cinzel text-lg">
                  What's the difference between simulated and live testing?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-space-grotesk">
                  Simulated testing uses our internal algorithms to score prompts. Live testing uses actual GPT models
                  for more accurate evaluation (Pro+ only).
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card text-left">
              <CardHeader>
                <CardTitle className="font-cinzel text-lg">Do you offer enterprise discounts?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-space-grotesk">
                  Yes, we offer volume discounts for teams of 10+ users and custom pricing for large organizations.
                  Contact our sales team for details.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
