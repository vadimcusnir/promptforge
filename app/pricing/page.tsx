"use client"

import { useState, useEffect } from "react"
import { PricingTable } from "@/components/ui/pricing-table"
import { PricingFAQ } from "@/components/ui/pricing-faq"
import { Countdown } from "@/components/ui/countdown"

export default function PricingPage() {
  const [showExitIntent, setShowExitIntent] = useState(false)

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShowExitIntent(true)
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave)
    return () => document.removeEventListener("mouseleave", handleMouseLeave)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-[#d1a954]/20 to-[#d1a954]/10 border-b border-[#5a5a5a]/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-4">
            <span className="text-[#d1a954] font-medium">🔥 Limited Time Offer</span>
            <Countdown />
            <span className="text-sm text-[#5a5a5a]">-20% off Pro Plan</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-[#5a5a5a] bg-clip-text text-transparent">
            How Much Time Do You Want to Waste Without Good Prompts?
          </h1>
          <p className="text-xl text-[#5a5a5a] mb-8 max-w-3xl mx-auto">
            Activate PromptForge and escape the creative blocks. Stop improvising. Start engineering.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-[#5a5a5a]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>7-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Instant activation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <PricingTable />
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 border-t border-[#5a5a5a]/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 opacity-60">
            <div className="text-[#5a5a5a] text-sm">Secured by Stripe</div>
            <div className="text-[#5a5a5a] text-sm">PayPal Accepted</div>
            <div className="text-[#5a5a5a] text-sm">GDPR Compliant</div>
            <div className="text-[#5a5a5a] text-sm">SOC 2 Certified</div>
          </div>
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
              <h3 className="text-2xl font-bold mb-4 text-[#d1a954]">Wait! Don't Leave Empty-Handed</h3>
              <p className="text-[#5a5a5a] mb-6">Get 100 premium prompts FREE when you start now</p>
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
    </div>
  )
}
