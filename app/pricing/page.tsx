"use client";

import { useState, useEffect } from "react";
import { PricingTable } from "@/components/ui/pricing-table";
import { PricingFAQ } from "@/components/ui/pricing-faq";
import { Countdown } from "@/components/ui/countdown";

export default function PricingPage() {
  const [showExitIntent, setShowExitIntent] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShowExitIntent(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "For individuals getting started",
      features: [
        "5 prompts/month",
        "Basic modules (M01-M10)",
        ".txt export only",
        "Community support",
      ],
      cta: "Start Free",
      popular: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "For professional prompt engineers",
      features: [
        "500 prompts/month",
        "All 50 modules (M01-M50)",
        ".md/.json/.pdf exports",
        "7D Parameter Engine",
        "Priority support",
      ],
      cta: "Start Pro",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$299",
      period: "/month",
      description: "For teams and organizations",
      features: [
        "Unlimited prompts",
        "All modules + custom",
        "All exports + .zip bundles",
        "API access",
        "10 team seats",
        "Dedicated support",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#ECFEFF]">
      {/* Static Grid Background */}
      <div className="grid-static"></div>

      {/* Pricing Section */}
      <section className="container mx-auto max-w-[1240px] px-6 py-24">
        <h1 className="text-h1 text-[#ECFEFF] text-center mb-4">
          <span className="kw" data-glitch>
            <span className="kw__text">Pricing</span>
            <span className="kw__glitch" aria-hidden="true"></span>
          </span>
        </h1>
        <div className="pf-yard-line mx-auto max-w-md"></div>
        <p className="text-body text-[#ECFEFF]/80 text-center mb-16">
          Choose your plan and start engineering better prompts today
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`pf-block p-8 relative ${plan.popular ? "ring-2 ring-[#164E63]" : ""}`}
            >
              <span className="pf-corner tl"></span>
              <span className="pf-corner tr"></span>
              <span className="pf-corner bl"></span>
              <span className="pf-corner br"></span>

              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#164E63] text-[#ECFEFF] px-4 py-1 text-micro font-semibold rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-h3 text-[#ECFEFF] mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-4xl font-bold text-[#ECFEFF]">
                    {plan.price}
                  </span>
                  <span className="text-[#ECFEFF]/60 ml-1">{plan.period}</span>
                </div>
                <p className="text-micro text-[#ECFEFF]/80">
                  {plan.description}
                </p>
              </div>

              <div className="pf-yard-line mb-6"></div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center text-micro text-[#ECFEFF]/90"
                  >
                    <div className="w-2 h-2 bg-[#16A34A] rounded-full mr-3 flex-shrink-0"></div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 font-semibold transition-all ${
                  plan.popular ? "btn-notched" : "btn"
                }`}
              >
                {plan.cta}
              </button>

              {plan.name !== "Enterprise" && (
                <p className="text-center text-xs text-[#ECFEFF]/60 mt-4">
                  7-day refund • cancel anytime
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center gap-6 mt-16">
          <span className="proof-chip">Stripe/GDPR</span>
          <span className="proof-chip">SOC 2</span>
          <span className="proof-chip">Enterprise Ready</span>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <PricingFAQ />
        </div>
      </section>

      {/* Exit Intent Popup */}
      {showExitIntent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e0e0e] border border-[#5a5a5a]/30 rounded-lg p-8 max-w-md w-full glass-effect">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4 text-[#d1a954]">
                Wait! Don't Leave Empty-Handed
              </h3>
              <p className="text-[#5a5a5a] mb-6">
                Get 100 premium prompts FREE when you start now
              </p>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-[#d1a954] to-[#d1a954]/80 text-black font-semibold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-[#d1a954]/25 transition-all">
                  Claim Free Prompts
                </button>
                <button
                  onClick={() => setShowExitIntent(false)}
                  className="w-full text-[#5a5a5a] hover:text-white transition-colors"
                >
                  No thanks, I'll figure it out myself
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Glitch Protocol v1 Script */}
      <script defer src="/glitch-keywords.js"></script>
    </div>
  );
}
