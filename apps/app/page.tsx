import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap, Settings, Download, Check, ArrowUpRight } from "lucide-react"
import LiveGenerationDemo from "@/components/home/LiveGenerationDemo"
import { PageLayout } from "@/components/layout/page-layout"
import { HeroBlock } from "@/components/layout/hero-block"

export const metadata: Metadata = {
  title: "PromptForge - Industrial Prompt Engineering Platform | 50 Modules, 7D Parameters",
  description:
    "Professional prompt generation platform with 50 specialized modules, 7-dimensional parameter engine, and enterprise-grade exports. Build auditable, reproducible prompt systems in <60s.",
  keywords:
    "prompt engineering, AI prompts, industrial AI, prompt generation, GPT prompts, AI automation, enterprise AI, prompt optimization, cognitive stratification, meta-prompts",
  authors: [{ name: "PromptForge Team" }],
  creator: "PromptForge",
  publisher: "PromptForge",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://promptforge.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PromptForge - Industrial Prompt Engineering Platform",
    description:
      "Professional prompt generation with 50 modules, 7D parameters, and enterprise exports. Build auditable, reproducible prompt systems.",
    url: "https://promptforge.com",
    siteName: "PromptForge",
    images: [
      {
        url: "/og-homepage.png",
        width: 1200,
        height: 630,
        alt: "PromptForge - Industrial Prompt Engineering Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptForge - Industrial Prompt Engineering Platform",
    description: "Professional prompt generation with 50 modules, 7D parameters, and enterprise exports.",
    images: ["/og-homepage.png"],
    creator: "@promptforge",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
}

function StructuredData() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PromptForge",
    url: "https://promptforge.com",
    logo: "https://promptforge.com/logo.png",
    description: "Industrial prompt engineering platform for professional AI workflows",
    foundingDate: "2024",
    sameAs: [
      "https://twitter.com/promptforge",
      "https://linkedin.com/company/promptforge",
      "https://github.com/promptforge",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-555-FORGE",
      contactType: "customer service",
      email: "support@promptforge.com",
    },
  }

  const productData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PromptForge",
    description: "Industrial prompt engineering platform with 50 specialized modules and 7D parameter optimization",
    url: "https://promptforge.com",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    offers: [
      {
        "@type": "Offer",
        name: "Free Plan",
        price: "0",
        priceCurrency: "USD",
        description: "Access to basic modules and export formats",
      },
      {
        "@type": "Offer",
        name: "Pro Plan",
        price: "49",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "49",
          priceCurrency: "USD",
          billingDuration: "P1M",
        },
        description: "Full access to all 50 modules with advanced exports",
      },
      {
        "@type": "Offer",
        name: "Enterprise Plan",
        price: "299",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "299",
          priceCurrency: "USD",
          billingDuration: "P1M",
        },
        description: "Enterprise features with API access and white-label options",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "247",
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productData) }} />
    </>
  )
}

export default function HomePage() {
  return (
    <>
      <StructuredData />
      <PageLayout variant="marketing">
        <HeroBlock
          title="Your Operational Prompt Generator"
          subtitle="50 modules. 7 vectors. Export in <60s. Build auditable, reproducible prompt systems for professional workflows."
        >
          <div className="mb-8">
            <Badge className="bg-[#CDA434]/20 text-[#CDA434] border-[#CDA434]/30 mb-8">
              Industrial Prompt Engineering
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" className="bg-[#CDA434] hover:bg-[#CDA434]/90 text-lg px-8 py-6">
              Start the Forge
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-border text-lg px-8 py-6 bg-transparent">
              View Demo
            </Button>
          </div>

          {/* Proof Bar */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              TTA {"<"} 60s
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Score ≥ 80
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Export .md/.json/.pdf
            </div>
          </div>
        </HeroBlock>

        <LiveGenerationDemo />

        {/* How It Works */}
        <section className="py-24">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="font-cinzel text-[28px] md:text-[32px] leading-[1.35] font-bold mb-4">How It Works</h2>
              <p className="font-space-grotesk text-muted-foreground text-lg">
                Three steps to professional prompt generation
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="glass-card">
                <CardHeader>
                  <div className="w-12 h-12 bg-[#CDA434]/20 rounded-lg flex items-center justify-center mb-4">
                    <Settings className="w-6 h-6 text-[#CDA434]" />
                  </div>
                  <CardTitle className="font-cinzel">Configure 7D Parameters</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Set domain, scale, urgency, complexity, resources, application, and output format
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <div className="w-12 h-12 bg-[#CDA434]/20 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-[#CDA434]" />
                  </div>
                  <CardTitle className="font-cinzel">Run Selected Module</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Choose from 50 specialized modules across 7 semantic vectors for your use case
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <div className="w-12 h-12 bg-[#CDA434]/20 rounded-lg flex items-center justify-center mb-4">
                    <Download className="w-6 h-6 text-[#CDA434]" />
                  </div>
                  <CardTitle className="font-cinzel">Export Professional Bundle</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Get structured outputs with checksums, manifests, and telemetry data
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Modules Grid */}
        <section id="modules" className="py-24">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="font-cinzel text-[28px] md:text-[32px] leading-[1.35] font-bold mb-4">
                50 Industrial Modules
              </h2>
              <p className="font-space-grotesk text-muted-foreground text-lg">
                Organized across 7 semantic vectors for maximum precision
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-12">
              {[
                { id: "M01", name: "SOP Forge", vector: "Strategic" },
                { id: "M07", name: "Risk Reversal", vector: "Strategic" },
                { id: "M11", name: "Funnel Nota", vector: "Rhetoric" },
                { id: "M12", name: "Visibility Diag", vector: "Strategic" },
                { id: "M13", name: "Pricing Psych", vector: "Rhetoric" },
                { id: "M22", name: "Lead Gen", vector: "Content" },
                { id: "M24", name: "Personal PR", vector: "Content" },
                { id: "M32", name: "Cohort Test", vector: "Analytics" },
                { id: "M35", name: "Content Heat", vector: "Branding" },
                { id: "M40", name: "Crisis Mgmt", vector: "Crisis" },
                { id: "M45", name: "Learning Path", vector: "Cognitive" },
                { id: "M50", name: "Brand Voice", vector: "Branding" },
              ].map((module) => (
                <Card
                  key={module.id}
                  className="glass-card hover:border-yellow-600/50 transition-colors cursor-pointer group"
                >
                  <CardContent className="p-4">
                    <div className="text-yellow-500 font-mono text-sm mb-1">{module.id}</div>
                    <div className="font-medium text-sm mb-2">{module.name}</div>
                    <Badge variant="secondary" className="text-xs bg-zinc-800 text-zinc-500">
                      {module.vector}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" className="border-border bg-transparent">
                View All 50 Modules
                <ArrowUpRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 bg-card/50">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="font-cinzel text-[28px] md:text-[32px] leading-[1.35] font-bold mb-4">Choose Your Plan</h2>
              <p className="font-space-grotesk text-muted-foreground text-lg">
                Scale from pilot to enterprise with clear upgrade paths
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Pilot Plan */}
              <Card className="glass-card">
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
                  <Button className="w-full bg-transparent" variant="outline">
                    Start Free
                  </Button>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className="glass-card border-yellow-600 relative">
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
                  <Button className="w-full bg-[#CDA434] hover:bg-[#CDA434]/90">Start Pro Trial</Button>
                </CardContent>
              </Card>

              {/* Enterprise Plan */}
              <Card className="glass-card">
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
        <section className="py-24">
          <div className="max-w-[1280px] mx-auto px-6 text-center">
            <h2 className="font-cinzel text-[28px] md:text-[32px] leading-[1.35] font-bold mb-6">
              Ready to Build Industrial-Grade Prompts?
            </h2>
            <p className="font-space-grotesk text-xl text-muted-foreground mb-8">
              Join professionals who demand auditable, reproducible prompt systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#CDA434] hover:bg-[#CDA434]/90 text-lg px-8 py-6">
                Start Building Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-border text-lg px-8 py-6 bg-transparent">
                Schedule Demo
              </Button>
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  )
}
