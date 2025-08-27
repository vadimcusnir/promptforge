"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
} from "lucide-react"

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
              complexity: "basic",
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

export default function GuidesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("getting-started")
  const [completedGuides, setCompletedGuides] = useState<string[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)

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

  return (
    <div className="min-h-screen text-white relative z-10">
      {/* Progress Bar */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-300">Learning Progress</h2>
            <span className="text-sm text-yellow-500">
              {completedCount}/{guides.length} completed
            </span>
          </div>
          <Progress value={overallProgress} className="h-2 bg-gray-800" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-yellow-500" />
            <h1 className="text-4xl font-bold font-serif">PromptForge™ Guides</h1>
          </div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Master the art of industrial prompt engineering. From first generation to enterprise integration.
          </p>
        </div>

        <div className="flex gap-8">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden fixed top-4 left-4 z-50"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          {/* Sidebar */}
          <div
            className={`
            fixed lg:static inset-y-0 left-0 z-40 w-80 bg-gray-900/90 backdrop-blur-sm border-r border-gray-800 
            transform transition-transform duration-300 ease-in-out lg:transform-none
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-6 text-yellow-500">Categories</h3>
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
                        w-full flex items-center justify-between p-3 rounded-lg transition-all
                        ${
                          isActive
                            ? "bg-yellow-500/20 border border-yellow-500/30 text-yellow-500"
                            : "hover:bg-gray-800 text-gray-300 hover:text-white"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isActive ? "text-yellow-500" : category.color}`} />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {categoryCompleted}/{categoryGuides.length}
                      </Badge>
                    </button>
                  )
                })}
              </nav>

              {/* Continue Learning */}
              {completedCount > 0 && completedCount < guides.length && (
                <div className="mt-8 p-4 bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-lg">
                  <h4 className="font-semibold text-yellow-500 mb-2">Continue Learning</h4>
                  <p className="text-sm text-gray-400 mb-3">
                    You're making great progress! Keep going to master PromptForge.
                  </p>
                  <Button size="sm" className="w-full bg-yellow-500 hover:bg-yellow-500/80 text-black">
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
              <h2 className="text-2xl font-bold mb-2 font-serif">
                {categories.find((c) => c.id === selectedCategory)?.name}
              </h2>
              <p className="text-gray-400">
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
                  <Card
                    key={guide.id}
                    className="bg-zinc-900/80 border border-zinc-700 hover:border-yellow-500/30 transition-all"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl font-serif">{guide.title}</CardTitle>
                            {isCompleted && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                          </div>
                          <CardDescription className="text-gray-400">{guide.description}</CardDescription>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-4">
                        <Badge className={getDifficultyColor(guide.difficulty)}>{guide.difficulty}</Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          {guide.duration}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="flex-1 border-gray-700 hover:border-yellow-500 hover:text-yellow-500 bg-transparent"
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          Read Guide
                        </Button>

                        {guide.generatorConfig && (
                          <Button
                            onClick={() => handleTryInGenerator(guide.generatorConfig)}
                            className="flex-1 bg-yellow-500 hover:bg-yellow-500/80 text-black"
                          >
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
              <Card className="bg-zinc-900/80 border border-zinc-700 border-yellow-500/20">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4 font-serif">Ready to forge your first prompt?</h3>
                  <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                    Put your knowledge into practice. Open the Generator and start creating industrial-grade prompts.
                  </p>
                  <Button
                    size="lg"
                    onClick={() => handleTryInGenerator()}
                    className="bg-yellow-500 hover:bg-yellow-500/80 text-black"
                  >
                    Open Generator
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
