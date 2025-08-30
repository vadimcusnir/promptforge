import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Search, Code, Book, ArrowRight, FileText, Settings, Zap, Download, Table, ExternalLink, Shield } from "lucide-react"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "PromptForge Documentation - Industrial Prompt Engineering Platform",
  description: "Complete documentation for PromptForge industrial prompt engineering platform. Learn about 7D parameters, 50 modules, scoring system, exports, and API integration.",
  keywords: ["prompt engineering documentation", "industrial prompts", "7D parameters", "API documentation", "module reference"],
  openGraph: {
    title: "PromptForge Documentation - Industrial Prompt Engineering Platform",
    description: "Complete documentation for PromptForge industrial prompt engineering platform. Learn about 7D parameters, 50 modules, scoring system, exports, and API integration.",
    type: "website",
  },
  alternates: {
    canonical: "/docs",
  },
}

export default function DocsPage() {
  const sections = [
    {
      id: "overview",
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
      id: "7d-parameters",
      title: "7D Parameter Engine",
      description: "Master the seven-dimensional parameter system for precise prompt configuration",
      icon: Settings,
      articles: [
        "Domain Selection (Business, Marketing, Sales, Analytics, Education)",
        "Scale Configuration (Startup, SMB, Enterprise)",
        "Urgency Levels (Standard, High, Critical)",
        "Complexity Settings (Basic, Intermediate, Advanced, Expert)",
        "Resource Allocation (Limited, Standard, Unlimited)",
        "Application Context (Content, Strategy, Analysis, Operations)",
        "Output Format (Text, Structured, Visual, Interactive)"
      ],
    },
    {
      id: "modules",
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
      id: "scoring",
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
      id: "exports",
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
    {
      id: "api",
      title: "API Reference",
      description: "Complete API documentation for enterprise integration",
      icon: Code,
      articles: [
        "Authentication & Security",
        "Endpoint /api/run/{moduleId}",
        "Request/Response Formats",
        "Rate Limiting & Quotas",
        "Error Handling & Codes",
        "Webhook Integration",
        "SDK & Libraries"
      ],
    },
    {
      id: "privacy-data",
      title: "Privacy & Data Transparency",
      description: "Understanding what data we collect, store, and how we protect your privacy",
      icon: Shield,
      articles: [
        "Data We Store (Metadata, Usage, Analytics)",
        "Data We Don't Store (Prompt Content, Personal Data)",
        "Legal Basis for Data Processing (GDPR Article 6)",
        "Audit & Telemetry Transparency",
        "Data Retention Policies",
        "Your Privacy Rights & Controls",
        "Security Measures & Encryption"
      ],
    },
  ]

  // Table of Contents for sticky sidebar
  const tocItems = sections.map(section => ({
    id: section.id,
    title: section.title,
    href: `#${section.id}`
  }))

  const breadcrumbItems = [
    { label: "Documentation", current: true }
  ]

  return (
    <div className="min-h-screen text-white relative z-10">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>

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
              className="w-full pl-12 pr-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-accent focus:outline-none focus:ring-accent/20"
            />
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex gap-8">
          {/* Sticky Table of Contents */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Table className="w-4 h-4" />
                  Table of Contents
                </h3>
                <nav className="space-y-2">
                  {tocItems.map((item) => (
                    <a
                      key={item.id}
                      href={item.href}
                      className="block text-sm text-gray-400 hover:text-accent transition-colors py-1"
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Documentation Sections */}
          <div className="flex-1">
            <div className="space-y-12">
              {sections.map((section, index) => {
                const Icon = section.icon
                return (
                  <section key={section.id} id={section.id}>
                    <Card className="bg-card border border-border hover:border-accent/30 transition-colors">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-accent text-2xl">
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
                  </section>
                )
              })}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-card border border-border p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Start Building?</h2>
          <p className="text-gray-400 mb-6">
            Put your knowledge into practice. Open the Generator and start creating industrial-grade prompts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-accent hover:bg-accent/80 text-accent-foreground font-semibold">
              <Link href="/generator">
                Start Building Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
