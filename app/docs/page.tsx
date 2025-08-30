"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ForgeGlyphInteractive } from "@/components/forge/ForgeGlyphInteractive"
import { BookOpen, Zap, Target, Download, Code, BarChart3, ArrowRight, Search, Clock, Bell } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { TableOfContents } from "@/components/docs/table-of-contents"

export default function DocsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // TOC items for the documentation sections
  const tocItems = [
    { id: "overview", title: "Overview", level: 1 },
    { id: "7d-engine", title: "7D Parameter Engine", level: 1 },
    { id: "modules-catalog", title: "Modules Catalog", level: 1 },
    { id: "scoring-system", title: "Scoring System ≥80", level: 1 },
    { id: "exports-entitlements", title: "Exports & Entitlements", level: 1 },
    { id: "api-reference", title: "API Reference", level: 1 },
    { id: "quick-start", title: "Quick Start Guide", level: 1 },
  ]

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
      href: "/docs/api",
      timeline: "2-3 weeks",
      notifySignup: true
    }
  ]

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-black text-fg-primary">
      {/* Header */}
      <div className="border-b border-border bg-bg-primary/95 backdrop-blur">
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
            <p className="text-xl text-fg-secondary max-w-3xl mx-auto">
              Complete guide to PromptForge&apos;s industrial prompt engineering system
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="mb-8">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fg-secondary w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-fg-primary placeholder-fg-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSections.map((section) => {
            const Icon = section.icon
            return (
              <Card
                key={section.id}
                id={section.id}
                className={`bg-card border border-border hover:border-accent/50 transition-all duration-300 ${
                  section.status === 'coming-soon' ? 'opacity-75' : 'cursor-pointer'
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-accent/20">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    {section.status === 'coming-soon' && (
                      <span className="text-xs bg-muted text-fg-secondary px-2 py-1 rounded">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-xl font-serif text-fg-primary">
                    {section.title}
                  </CardTitle>
                  <CardDescription className="text-fg-secondary">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {section.status === 'complete' ? (
                    <Link href={section.href}>
                      <Button className="w-full bg-accent hover:bg-accent-hover text-accent-contrast font-semibold">
                        Read Documentation
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-fg-secondary">
                        <Clock className="w-4 h-4" />
                        <span>Publishes in {section.timeline}</span>
                      </div>
                      {section.notifySignup && (
                        <Button 
                          variant="outline"
                          className="w-full border-accent/30 text-accent hover:bg-accent/10"
                        >
                          <Bell className="w-4 h-4 mr-2" />
                          Notify Me
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
            </div>

            {/* Quick Start Guide */}
            <div className="mt-12" id="quick-start">
              <Card className="bg-card border border-border">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-fg-primary">Quick Start Guide</CardTitle>
                  <CardDescription className="text-fg-secondary">
                    Get up and running with PromptForge in minutes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                        <span className="text-accent font-bold text-lg">1</span>
                      </div>
                      <h3 className="font-semibold text-fg-primary mb-2">Choose Module</h3>
                      <p className="text-sm text-fg-secondary">
                        Select from 50 industrial modules or start with M01 (SOP Forge)
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                        <span className="text-accent font-bold text-lg">2</span>
                      </div>
                      <h3 className="font-semibold text-fg-primary mb-2">Configure 7D</h3>
                      <p className="text-sm text-fg-secondary">
                        Set the seven dimensions: domain, scale, urgency, audience, format, constraints, success metrics
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                        <span className="text-accent font-bold text-lg">3</span>
                      </div>
                      <h3 className="font-semibold text-fg-primary mb-2">Generate & Export</h3>
                      <p className="text-sm text-fg-secondary">
                        Generate your prompt, test it, and export in your preferred format
                      </p>
                    </div>
                  </div>
                  <div className="mt-8 text-center">
                    <Link href="/generator">
                      <Button size="lg" className="bg-accent hover:bg-accent-hover text-accent-contrast font-semibold">
                        Start Generating
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar - Table of Contents */}
          <div className="lg:col-span-1">
            <TableOfContents items={tocItems} />
          </div>
        </div>
      </div>
    </div>
  )
}