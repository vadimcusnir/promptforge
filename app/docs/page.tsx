"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Code, Book, ArrowRight, FileText, Settings, Zap, Download } from "lucide-react"
import Link from "next/link"



export default function DocsPage() {
  const sections = [
    {
      title: "Overview",
      description: "Complete introduction to PromptForge industrial prompt engineering platform",
      icon: Book,
      articles: [
        "What is PromptForge?",
        "Industrial vs Traditional Prompt Engineering",
        "Platform Architecture & Components",
        "Getting Started Checklist",
        "Best Practices Overview",
        "Common Use Cases"
      ],
    },
    {
      title: "7D Parameter Engine",
      description: "Master the seven-dimensional parameter system for precise prompt configuration",
      icon: Settings,
      articles: [
        "Domain Selection (Business, Marketing, Sales, etc.)",
        "Scale Configuration (Startup, SMB, Enterprise)",
        "Urgency Levels (Standard, High, Critical)",
        "Complexity Settings (Basic, Intermediate, Advanced)",
        "Resource Allocation (Limited, Standard, Unlimited)",
        "Application Context (Content, Strategy, Analysis)",
        "Output Format (Text, Structured, Visual)"
      ],
    },
    {
      title: "Modules Catalog M01–M50",
      description: "Complete reference for all 50 operational modules across 7 semantic vectors",
      icon: Zap,
      articles: [
        "Strategic Vector Modules (M01-M10)",
        "Rhetoric Vector Modules (M11-M20)",
        "Content Vector Modules (M21-M30)",
        "Analytics Vector Modules (M31-M40)",
        "Branding Vector Modules (M41-M45)",
        "Crisis Vector Modules (M46-M48)",
        "Cognitive Vector Modules (M49-M50)",
        "Module Selection Matrix",
        "Cross-Module Combinations"
      ],
    },
    {
      title: "Scoring System ≥80",
      description: "Understanding the quality scoring system and achieving export-ready prompts",
      icon: FileText,
      articles: [
        "Scoring Algorithm Overview",
        "Quality Metrics & Criteria",
        "Achieving 80+ Score Threshold",
        "Common Score Issues & Solutions",
        "Score Optimization Techniques",
        "Export Eligibility Requirements",
        "Score History & Analytics"
      ],
    },
    {
      title: "Exports & Entitlements",
      description: "Export formats, licensing, and plan-based entitlements",
      icon: Download,
      articles: [
        "Export Format Options (TXT, MD, PDF, JSON, ZIP)",
        "Plan-Based Export Limits",
        "License Notices & Watermarks",
        "Bundle Creation & Management",
        "API Export Endpoints",
        "White-label Export Options",
        "Export Analytics & Tracking"
      ],
    },
  ]

  return (
    <div className="min-h-screen text-white relative z-10">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 font-serif">Documentation</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-6">
            Everything you need to master PromptForge industrial prompt engineering. From basic usage to advanced 
            enterprise integration, our comprehensive documentation covers all aspects of the platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span>• 50 Industrial Modules</span>
            <span>• 7D Parameter Engine</span>
            <span>• Enterprise API</span>
            <span>• Professional Export</span>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500/20"
            />
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <Card key={index} className="bg-zinc-900/80 border border-zinc-700 hover:border-yellow-500/30 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-yellow-500">
                    <Icon className="w-6 h-6" />
                    {section.title}
                  </CardTitle>
                  <p className="text-gray-400">{section.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.articles.map((article, articleIndex) => (
                      <li key={articleIndex}>
                        <span className="text-gray-300 flex items-center gap-2">
                          <ArrowRight className="w-3 h-3" />
                          {article}
                          <span className="text-xs text-gray-500 ml-2">(Coming Soon)</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Essential Links */}
        <div className="bg-zinc-900/80 border border-zinc-700 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Need Help?</h2>
          <p className="text-gray-400 mb-6">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button asChild variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black">
              <Link href="/guides">Browse Guides</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
