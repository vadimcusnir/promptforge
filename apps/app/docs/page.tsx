"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PageLayout } from "@/components/layout/page-layout"
import { HeroBlock } from "@/components/layout/hero-block"
import { SubnavTabs } from "@/components/layout/subnav-tabs"
import {
  BookOpen,
  Zap,
  Settings,
  TestTube,
  Download,
  Code,
  CheckCircle,
  Play,
  Clock,
  ArrowRight,
  Menu,
  X,
  Search,
  Book,
} from "lucide-react"
import Link from "next/link"

interface Guide {
  id: string
  title: string
  description: string
  category: string
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  completed?: boolean
  generatorConfig?: {
    module: string
    domain: string
    scale: string
    urgency: string
    complexity: string
    resources: string
    application: string
    output: string
  }
}

const categories = [
  { id: "getting-started", name: "Getting Started", icon: BookOpen, color: "text-emerald-400" },
  { id: "module-mastery", name: "Module Mastery", icon: Zap, color: "text-blue-400" },
  { id: "7d-optimization", name: "7D Optimization", icon: Settings, color: "text-purple-400" },
  { id: "test-engine", name: "Test Engine", icon: TestTube, color: "text-orange-400" },
  { id: "export-workflow", name: "Export Workflow", icon: Download, color: "text-green-400" },
  { id: "integration-api", name: "Integration API", icon: Code, color: "text-red-400" },
]

const guides: Guide[] = [
  {
    id: "first-prompt",
    title: "Generate Your First Prompt",
    description: "Learn the basics of prompt generation with PromptForge's industrial-grade system.",
    category: "getting-started",
    duration: "5 min",
    difficulty: "Beginner",
    generatorConfig: {
      module: "M01",
      domain: "marketing",
      scale: "startup",
      urgency: "standard",
      complexity: "simple",
      resources: "limited",
      application: "content",
      output: "text",
    },
  },
  {
    id: "module-selection",
    title: "Choosing the Right Module",
    description: "Navigate the 50-module library to find the perfect tool for your use case.",
    category: "module-mastery",
    duration: "8 min",
    difficulty: "Beginner",
  },
  {
    id: "7d-parameters",
    title: "Master the 7D Parameter Engine",
    description: "Deep dive into domain, scale, urgency, complexity, resources, application, and output.",
    category: "7d-optimization",
    duration: "12 min",
    difficulty: "Intermediate",
    generatorConfig: {
      module: "M12",
      domain: "business",
      scale: "enterprise",
      urgency: "critical",
      complexity: "advanced",
      resources: "unlimited",
      application: "strategy",
      output: "structured",
    },
  },
  {
    id: "test-simulate",
    title: "Testing with Simulation Engine",
    description: "Learn how to validate prompts using our deterministic testing system.",
    category: "test-engine",
    duration: "10 min",
    difficulty: "Intermediate",
  },
  {
    id: "export-bundles",
    title: "Export and Bundle Management",
    description: "Master the art of exporting prompts in multiple formats with checksums.",
    category: "export-workflow",
    duration: "7 min",
    difficulty: "Beginner",
  },
  {
    id: "api-integration",
    title: "Enterprise API Integration",
    description: "Integrate PromptForge into your workflow using our REST API.",
    category: "integration-api",
    duration: "15 min",
    difficulty: "Advanced",
  },
]

const apiSections = [
  {
    title: "API Reference",
    description: "Complete API documentation for Enterprise users",
    icon: Code,
    articles: ["Authentication", "POST /api/run/{moduleId}", "Response Format", "Rate Limits & Quotas"],
  },
  {
    title: "Advanced Features",
    description: "Master the advanced capabilities of PromptForge",
    icon: Book,
    articles: ["Custom Module Creation", "Batch Processing", "Export Formats", "Team Collaboration"],
  },
]

export default function DocsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("getting-started")
  const [completedGuides, setCompletedGuides] = useState<string[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)
  const [activeTab, setActiveTab] = useState<"guides" | "reference">("guides")

  useEffect(() => {
    // Load completed guides from localStorage
    const completed = localStorage.getItem("promptforge-completed-guides")
    if (completed) {
      const completedList = JSON.parse(completed)
      setCompletedGuides(completedList)
      setOverallProgress((completedList.length / guides.length) * 100)
    }
  }, [])

  const filteredGuides = guides.filter((guide) => guide.category === selectedCategory)
  const completedCount = completedGuides.length

  const handleTryInGenerator = (config?: Guide["generatorConfig"]) => {
    if (config) {
      const params = new URLSearchParams(config)
      window.open(`/generator?${params.toString()}`, "_blank")
    } else {
      window.open("/generator", "_blank")
    }
  }

  const handleTabSwitch = (tab: "guides" | "reference") => {
    setActiveTab(tab)
    // Prevent layout shift by maintaining scroll position
    const currentScrollY = window.scrollY
    requestAnimationFrame(() => {
      window.scrollTo(0, currentScrollY)
    })
  }

  const getDifficultyColor = (difficulty: Guide["difficulty"]) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "Intermediate":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      case "Advanced":
        return "bg-red-500/20 text-red-400 border-red-500/30"
    }
  }

  const subnavTabs = [
    {
      id: "guides",
      label: "Interactive Guides",
      onClick: () => setActiveTab("guides"),
    },
    {
      id: "reference",
      label: "API Reference",
      onClick: () => setActiveTab("reference"),
    },
  ]

  return (
    <PageLayout
      variant="marketing"
      subnav={<SubnavTabs tabs={subnavTabs} activeTab={activeTab} variant="underline" />}
      breadcrumb={[{ label: "Home", href: "/" }, { label: "Documentation" }]}
    >
      <HeroBlock
        title="Documentation"
        subtitle="Everything you need to master PromptForge and build industrial-grade prompts."
      />

      <div className="max-w-[1280px] mx-auto px-6">
        {activeTab === "guides" && (
          <div className="sticky top-20 z-40 bg-background/80 backdrop-blur-sm border-b border-border mb-8">
            <div className="py-3">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-medium text-muted-foreground">Learning Progress</h2>
                <span className="text-sm text-primary">
                  {completedGuides.length}/{guides.length} completed
                </span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
          </div>
        )}

        <div className="min-h-[800px] transition-all duration-300 ease-in-out">
          {activeTab === "guides" ? (
            <div className="flex gap-8 opacity-100 transition-opacity duration-200">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden fixed top-24 left-4 z-50"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>

              {/* Sidebar */}
              <div
                className={`
                fixed lg:static inset-y-0 left-0 z-40 w-80 bg-card border-r border-border 
                transform transition-transform duration-300 ease-in-out lg:transform-none
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
              `}
              >
                <div className="p-6">
                  <h3 className="font-cinzel text-lg font-semibold mb-6 text-primary">Categories</h3>
                  <nav className="space-y-2">
                    {categories.map((category) => {
                      const Icon = category.icon
                      const isActive = selectedCategory === category.id
                      const categoryGuides = guides.filter((g) => g.category === category.id)
                      const categoryCompleted = categoryGuides.filter((g) => completedGuides.includes(g.id)).length

                      return (
                        <button
                          key={category.id}
                          onClick={() => {
                            setSelectedCategory(category.id)
                            setSidebarOpen(false)
                          }}
                          className={`
                            w-full flex items-center justify-between p-3 rounded-lg transition-all duration-150
                            ${
                              isActive
                                ? "bg-primary/20 border border-primary/30 text-primary"
                                : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`w-5 h-5 ${isActive ? "text-primary" : category.color}`} />
                            <span className="font-medium font-space-grotesk">{category.name}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {categoryCompleted}/{categoryGuides.length}
                          </Badge>
                        </button>
                      )
                    })}
                  </nav>

                  {/* Continue Learning */}
                  {completedGuides.length > 0 && completedGuides.length < guides.length && (
                    <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <h4 className="font-cinzel font-semibold text-primary mb-2">Continue Learning</h4>
                      <p className="text-sm text-muted-foreground mb-3 font-space-grotesk">
                        You're making great progress! Keep going to master PromptForge.
                      </p>
                      <Button size="sm" className="w-full">
                        <Play className="w-4 h-4 mr-2" />
                        Continue
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 lg:ml-0">
                <div className="mb-8">
                  <h2 className="font-cinzel text-[28px] md:text-[32px] leading-[1.35] font-bold mb-2">
                    {categories.find((c) => c.id === selectedCategory)?.name}
                  </h2>
                  <p className="font-space-grotesk text-muted-foreground max-w-[75ch]">
                    {selectedCategory === "getting-started" && "Start your journey with PromptForge fundamentals"}
                    {selectedCategory === "module-mastery" && "Learn to navigate and utilize our 50-module library"}
                    {selectedCategory === "7d-optimization" && "Master the seven-dimensional parameter system"}
                    {selectedCategory === "test-engine" && "Validate and score your prompts with precision"}
                    {selectedCategory === "export-workflow" && "Export, bundle, and manage your prompt artifacts"}
                    {selectedCategory === "integration-api" && "Integrate PromptForge into your enterprise workflow"}
                  </p>
                </div>

                <div className="grid gap-6">
                  {filteredGuides.map((guide) => {
                    const isCompleted = completedGuides.includes(guide.id)

                    return (
                      <Card key={guide.id} className="hover:border-primary/30 transition-all duration-150">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <CardTitle className="font-cinzel text-xl">{guide.title}</CardTitle>
                                {isCompleted && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                              </div>
                              <CardDescription className="max-w-[75ch] font-space-grotesk">
                                {guide.description}
                              </CardDescription>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 mt-4">
                            <Badge className={getDifficultyColor(guide.difficulty)}>{guide.difficulty}</Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground font-space-grotesk">
                              <Clock className="w-4 h-4" />
                              {guide.duration}
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent>
                          <div className="flex gap-3">
                            <Button asChild variant="outline" className="flex-1 bg-transparent">
                              <Link href={`/docs/${guide.id}`}>
                                <BookOpen className="w-4 h-4 mr-2" />
                                Read Guide
                              </Link>
                            </Button>

                            {guide.generatorConfig && (
                              <Button onClick={() => handleTryInGenerator(guide.generatorConfig)} className="flex-1">
                                <Play className="w-4 h-4 mr-2" />
                                Try in Generator
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Call to Action */}
                <div className="mt-12 text-center">
                  <Card className="bg-primary/10 border-primary/20">
                    <CardContent className="p-8">
                      <h3 className="font-cinzel text-[28px] md:text-[32px] leading-[1.35] font-bold mb-4">
                        Ready to forge your first prompt?
                      </h3>
                      <p className="font-space-grotesk text-muted-foreground mb-6 max-w-[75ch] mx-auto">
                        Put your knowledge into practice. Open the Generator and start creating industrial-grade
                        prompts.
                      </p>
                      <Button size="lg" onClick={() => handleTryInGenerator()}>
                        Open Generator
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Overlay for mobile */}
              {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
              )}
            </div>
          ) : (
            <div className="opacity-100 transition-opacity duration-200">
              {/* Search */}
              <div className="max-w-2xl mx-auto mb-12">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search documentation..."
                    className="w-full pl-12 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-[#00FF7F]"
                  />
                </div>
              </div>

              {/* Documentation Sections */}
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {apiSections.map((section, index) => {
                  const Icon = section.icon
                  return (
                    <Card key={index} className="hover:border-primary/30 transition-colors duration-150">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-primary font-cinzel">
                          <Icon className="w-6 h-6" />
                          {section.title}
                        </CardTitle>
                        <p className="text-muted-foreground max-w-[75ch] font-space-grotesk">{section.description}</p>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {section.articles.map((article, articleIndex) => (
                            <li key={articleIndex}>
                              <Link
                                href={`/docs/${article.toLowerCase().replace(/\s+/g, "-")}`}
                                className="text-muted-foreground hover:text-primary transition-colors duration-150 flex items-center gap-2 font-space-grotesk"
                              >
                                <ArrowRight className="w-3 h-3" />
                                {article}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Quick Links */}
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <h2 className="font-cinzel text-[28px] md:text-[32px] leading-[1.35] font-bold text-foreground mb-4">
                  Need Help?
                </h2>
                <p className="font-space-grotesk text-muted-foreground mb-6 max-w-[75ch] mx-auto">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild>
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/generator">Try Generator</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
