"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap, Settings, Download, Check } from "lucide-react"
import dynamic from "next/dynamic"
import { useAnalytics } from "@/hooks/use-analytics"
import { Suspense } from "react"

// Lazy load non-critical components for better LCP
const LiveGenerationDemo = dynamic(() => import("@/components/home/LiveGenerationDemo"), {
  loading: () => <DemoSkeleton />,
  ssr: false
})

const ForgeGlyphInteractive = dynamic(() => import("@/components/forge/ForgeGlyphInteractive").then(mod => ({ default: mod.ForgeGlyphInteractive })), {
  loading: () => <div className="w-16 h-16 bg-gray-700 rounded animate-pulse" />,
  ssr: false
})

// Skeleton loader for better perceived performance
function DemoSkeleton() {
  return (
    <section className="mt-24 border-t border-gray-700 pt-16 px-4 sm:px-8 lg:px-16">
      <div className="bg-[#0e0e0e] border border-gray-700 rounded-xl p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
          <div className="h-32 bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  const analytics = useAnalytics()

  const handleStartForgeClick = () => {
    analytics.landingCtaClick('start_forge', 'hero_primary')
  }

  const handleViewDemoClick = () => {
    analytics.landingCtaClick('view_demo', 'hero_secondary')
  }
  
  return (
    <div id="main-content" className="min-h-screen text-white relative z-10">
      {/* Hero Section - Forge Branding Integration */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="mb-8">
            {/* Forge Glyph Interactive */}
            <div className="flex justify-center mb-8">
              <ForgeGlyphInteractive 
                status="ready" 
                size="xl"
                onGlitch={() => console.log("Forge glyph glitch triggered")}
                minimizeOnScroll={true}
              />
            </div>
            
            <Badge className="hero-badge">
              Industrial Prompt Engineering
            </Badge>
            {/* Critical LCP element - optimized rendering with critical CSS */}
            <h1 className="hero-title font-montserrat">
              Your Operational
              <br />
              <span className="hero-title-accent">Prompt Generator</span>
            </h1>
            <p className="hero-description font-sans">
              50 modules. 7 vectors. Export in {"<"}60s.
              <br />
              Build auditable, reproducible prompt systems for professional workflows.
            </p>
          </div>

          <div className="hero-buttons">
            <Button 
              size="lg" 
              className="hero-primary-button" 
              ariaLabel="Start using PromptForge generator"
              onClick={handleStartForgeClick}
            >
              Start the Forge
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="hero-secondary-button" 
              ariaLabel="Explore modules catalog"
              onClick={() => window.location.href = '/modules'}
            >
              Explore Modules
            </Button>
          </div>

          {/* Proof Bar */}
          <div className="hero-proof-bar">
            <div className="hero-proof-item">
              <div className="hero-proof-dot"></div>
              TTA {"<"} 60s
            </div>
            <div className="hero-proof-item">
              <div className="hero-proof-dot"></div>
              Score ≥ 80
            </div>
            <div className="hero-proof-item">
              <div className="hero-proof-dot"></div>
              Export .md/.json/.pdf
            </div>
          </div>
        </div>
      </section>

      {/* Lazy loaded demo component with Suspense boundary */}
      <Suspense fallback={<DemoSkeleton />}>
        <LiveGenerationDemo />
      </Suspense>

      {/* How It Works - Simplified for better performance */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">How It Works</h2>
            <p className="text-zinc-500 text-lg">Three steps to professional prompt generation</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-zinc-900/80 border border-zinc-700">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6 text-yellow-500" />
                </div>
                <CardTitle className="font-serif">Configure 7D Parameters</CardTitle>
                <CardDescription className="text-zinc-500">
                  Set domain, scale, urgency, complexity, resources, application, and output format
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-zinc-900/80 border border-zinc-700">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-yellow-500" />
                </div>
                <CardTitle className="font-serif">Run Selected Module</CardTitle>
                <CardDescription className="text-zinc-500">
                  Choose from 50 specialized modules across 7 semantic vectors for your use case
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-zinc-900/80 border border-zinc-700">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Download className="w-6 h-6 text-yellow-500" />
                </div>
                <CardTitle className="font-serif">Export Professional Bundle</CardTitle>
                <CardDescription className="text-zinc-500">
                  Get structured outputs with checksums, manifests, and telemetry data
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Simplified Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">Core Features</h2>
            <p className="text-zinc-500 text-lg">Industrial-grade prompt engineering tools</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-zinc-900/80 border border-zinc-700">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-yellow-500" />
                </div>
                <CardTitle className="font-serif">7D Scoring Engine</CardTitle>
                <CardDescription className="text-zinc-500">
                  Advanced evaluation system that tests prompts across 7 dimensions for optimal performance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-zinc-900/80 border border-zinc-700">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6 text-yellow-500" />
                </div>
                <CardTitle className="font-serif">50 Specialized Modules</CardTitle>
                <CardDescription className="text-zinc-500">
                  Comprehensive library of prompt modules across 7 semantic vectors for every use case
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-zinc-900/80 border border-zinc-700">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Download className="w-6 h-6 text-yellow-500" />
                </div>
                <CardTitle className="font-serif">Professional Export</CardTitle>
                <CardDescription className="text-zinc-500">
                  Export prompts in multiple formats with checksums, manifests, and telemetry data
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">Choose Your Plan</h2>
            <p className="text-zinc-500 text-lg">Scale from pilot to enterprise with clear upgrade paths</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Pilot Plan */}
            <Card className="bg-zinc-900/80 border border-zinc-700">
              <CardHeader>
                <CardTitle className="font-serif">Pilot</CardTitle>
                <CardDescription className="text-zinc-500">Perfect for getting started</CardDescription>
                <div className="text-3xl font-bold font-serif">Free</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Modules M01-M10</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Export .txt, .md</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Local history</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Community support</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-transparent" 
                  variant="outline" 
                  ariaLabel="Start free pilot plan"
                  onClick={() => analytics.landingCtaClick('start_free_plan', 'pricing_free')}
                >
                  Start Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-zinc-900/80 border border-yellow-600 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-yellow-600 text-white">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="font-serif">Pro</CardTitle>
                <CardDescription className="text-zinc-500">For professionals and teams</CardDescription>
                <div className="text-3xl font-bold font-serif">
                  $49<span className="text-lg font-normal text-zinc-500">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">All 50 modules</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Export .pdf, .json</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Live Test Engine</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Cloud history</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Advanced Evaluator</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-yellow-600 hover:bg-yellow-700" 
                  ariaLabel="Start Pro plan trial"
                  onClick={() => analytics.landingCtaClick('start_pro_trial', 'pricing_pro')}
                >
                  Start Pro Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-zinc-900/80 border border-zinc-700">
              <CardHeader>
                <CardTitle className="font-serif">Enterprise</CardTitle>
                <CardDescription className="text-zinc-500">For organizations at scale</CardDescription>
                <div className="text-3xl font-bold font-serif">
                  $299<span className="text-lg font-normal text-zinc-500">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Everything in Pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Public API access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Bundle.zip exports</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">White-label options</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">5 seats included</span>
                  </li>
                </ul>
                <Button className="w-full bg-transparent" variant="outline">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6">Ready to Build Industrial-Grade Prompts?</h2>
          <p className="text-xl text-zinc-500 mb-8">
            Join professionals who demand auditable, reproducible prompt systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-lg px-8 py-6">
              Start Building Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-zinc-700 text-lg px-8 py-6 bg-transparent">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}