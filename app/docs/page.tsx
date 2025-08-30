import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ForgeGlyphInteractive } from "@/components/forge/ForgeGlyphInteractive"
import { BookOpen, Zap, Target, Download, Code, BarChart3, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function DocsPage() {
  const sections = [
    {
      id: "overview",
      title: "Overview",
      description: "Introduction to PromptForge and the 7D Parameter Engine",
      icon: BookOpen,
      status: "complete",
      href: "/docs/overview"
    },
    {
      id: "7d-engine",
      title: "7D Parameter Engine",
      description: "Understanding the seven dimensions of prompt engineering",
      icon: Zap,
      status: "complete",
      href: "/docs/7d-engine"
    },
    {
      id: "modules-catalog",
      title: "Modules Catalog",
      description: "Complete guide to all 50 industrial modules (M01-M50)",
      icon: Target,
      status: "complete",
      href: "/docs/modules"
    },
    {
      id: "scoring-system",
      title: "Scoring System ≥80",
      description: "How prompts are evaluated and scored for quality",
      icon: BarChart3,
      status: "complete",
      href: "/docs/scoring"
    },
    {
      id: "exports-entitlements",
      title: "Exports & Entitlements",
      description: "Export formats and plan-based access controls",
      icon: Download,
      status: "complete",
      href: "/docs/exports"
    },
    {
      id: "api-reference",
      title: "API Reference",
      description: "Technical documentation for API integration",
      icon: Code,
      status: "coming-soon",
      href: "/docs/api"
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/95 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center mb-6">
            <ForgeGlyphInteractive 
              status="ready" 
              size="lg"
            />
          </div>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">
              Documentation
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Complete guide to PromptForge&apos;s industrial prompt engineering system
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <Card
                key={section.id}
                className={`bg-zinc-900/80 border border-zinc-700 hover:border-yellow-600/50 transition-all duration-300 ${
                  section.status === 'coming-soon' ? 'opacity-75' : 'cursor-pointer'
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-yellow-600/20">
                      <Icon className="w-6 h-6 text-yellow-400" />
                    </div>
                    {section.status === 'coming-soon' && (
                      <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-xl font-serif text-white">
                    {section.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {section.status === 'complete' ? (
                    <Link href={section.href}>
                      <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold">
                        Read Documentation
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  ) : (
                    <Button 
                      disabled 
                      className="w-full bg-gray-600 text-gray-400 cursor-not-allowed"
                    >
                      Coming Soon
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Start Guide */}
        <div className="mt-12">
          <Card className="bg-zinc-900/80 border border-zinc-700">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-white">Quick Start Guide</CardTitle>
              <CardDescription className="text-gray-400">
                Get up and running with PromptForge in minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-yellow-600/20 flex items-center justify-center">
                    <span className="text-yellow-400 font-bold text-lg">1</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Choose Module</h3>
                  <p className="text-sm text-gray-400">
                    Select from 50 industrial modules or start with M01 (SOP Forge)
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-yellow-600/20 flex items-center justify-center">
                    <span className="text-yellow-400 font-bold text-lg">2</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Configure 7D</h3>
                  <p className="text-sm text-gray-400">
                    Set the seven dimensions: domain, scale, urgency, audience, format, constraints, success metrics
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-yellow-600/20 flex items-center justify-center">
                    <span className="text-yellow-400 font-bold text-lg">3</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Generate & Export</h3>
                  <p className="text-sm text-gray-400">
                    Generate your prompt, test it, and export in your preferred format
                  </p>
                </div>
              </div>
              <div className="mt-8 text-center">
                <Link href="/generator">
                  <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold">
                    Start Generating
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}