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
              className="hero-primary-button ritual-hover ritual-pulse" 
              ariaLabel="Start using PromptForge generator"
              onClick={handleStartForgeClick}
            >
              Start the Forge
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="hero-secondary-button ritual-hover" 
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
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-fg-primary">How It Works</h2>
            <p className="text-fg-secondary text-lg">Three steps to professional prompt generation</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card border border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="font-serif text-fg-primary">Configure 7D Parameters</CardTitle>
                <CardDescription className="text-fg-secondary">
                  Set domain, scale, urgency, complexity, resources, application, and output format
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="font-serif text-fg-primary">Run Selected Module</CardTitle>
                <CardDescription className="text-fg-secondary">
                  Choose from 50 specialized modules across 7 semantic vectors for your use case
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Download className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="font-serif text-fg-primary">Export Professional Bundle</CardTitle>
                <CardDescription className="text-fg-secondary">
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
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-fg-primary">Core Features</h2>
            <p className="text-fg-secondary text-lg">Industrial-grade prompt engineering tools</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card border border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="font-serif text-fg-primary">7D Scoring Engine</CardTitle>
                <CardDescription className="text-fg-secondary">
                  Advanced evaluation system that tests prompts across 7 dimensions for optimal performance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="font-serif text-fg-primary">50 Specialized Modules</CardTitle>
                <CardDescription className="text-fg-secondary">
                  Comprehensive library of prompt modules across 7 semantic vectors for every use case
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Download className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="font-serif text-fg-primary">Professional Export</CardTitle>
                <CardDescription className="text-fg-secondary">
                  Export prompts in multiple formats with checksums, manifests, and telemetry data
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-fg-primary">Choose Your Plan</h2>
            <p className="text-fg-secondary text-lg">Scale from pilot to enterprise with clear upgrade paths</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="font-serif text-fg-primary">Free</CardTitle>
                <CardDescription className="text-fg-secondary">Perfect for getting started</CardDescription>
                <div className="text-3xl font-bold font-serif text-fg-primary">Free</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-state-success" />
                    <span className="text-sm text-fg-primary">Modules M01-M10</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-state-success" />
                    <span className="text-sm text-fg-primary">Export .txt, .md</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-state-success" />
                    <span className="text-sm text-fg-primary">Local history</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-state-success" />
                    <span className="text-sm text-fg-primary">Community support</span>
                  </li>
                </ul>
                <Button
                  className="w-full bg-transparent border-border text-fg-primary hover:bg-accent/10"
                  variant="outline"
                  ariaLabel="Start free plan"
                  onClick={() => analytics.landingCtaClick('start_free_plan', 'pricing_free')}
                >
                  Start Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-card border border-accent relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-accent text-accent-contrast">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="font-serif text-fg-primary">Pro</CardTitle>
                <CardDescription className="text-fg-secondary">For professionals and teams</CardDescription>
                <div className="text-3xl font-bold font-serif text-fg-primary">
                  $49<span className="text-lg font-normal text-fg-secondary">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-state-success" />
                    <span className="text-sm text-fg-primary">All 50 modules</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-state-success" />
                    <span className="text-sm text-fg-primary">Export .pdf, .json</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-state-success" />
                    <span className="text-sm text-fg-primary">Live Test Engine</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-state-success" />
                    <span className="text-sm text-fg-primary">Cloud history</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-state-success" />
                    <span className="text-sm text-fg-primary">Advanced Evaluator</span>
                  </li>
                </ul>
                <Button
                  className="w-full bg-accent hover:bg-accent-hover text-accent-contrast ritual-hover"
                  ariaLabel="Start Pro plan trial"
                  onClick={() => analytics.landingCtaClick('start_pro_trial', 'pricing_pro')}
                >
                  Start Pro Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="font-serif text-fg-primary">Enterprise</CardTitle>
                <CardDescription className="text-fg-secondary">For organizations at scale</CardDescription>
                <div className="text-3xl font-bold font-serif text-fg-primary">
                  $299<span className="text-lg font-normal text-fg-secondary">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-state-success" />
                    <span className="text-sm text-fg-primary">Everything in Pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-state-success" />
                    <span className="text-sm text-fg-primary">Public API access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-state-success" />
                    <span className="text-sm text-fg-primary">Bundle.zip exports</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-state-success" />
                    <span className="text-sm text-fg-primary">White-label options</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-state-success" />
                    <span className="text-sm text-fg-primary">5 seats included</span>
                  </li>
                </ul>
                <Button className="w-full bg-transparent border-border text-fg-primary hover:bg-accent/10" variant="outline">
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
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6 text-fg-primary">Ready to Build Industrial-Grade Prompts?</h2>
          <p className="text-xl text-fg-secondary mb-8">
            Join professionals who demand auditable, reproducible prompt systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-accent hover:bg-accent-hover text-accent-contrast text-lg px-8 py-6 ritual-hover ritual-pulse">
              Start Building Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-border text-fg-primary hover:bg-accent/10 text-lg px-8 py-6 bg-transparent ritual-hover">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}