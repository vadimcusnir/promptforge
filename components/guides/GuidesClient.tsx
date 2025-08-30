'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Zap, Settings, TestTube, Download, Code, CheckCircle, Play, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function GuidesClient() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [
    { id: "getting-started", name: "Getting Started", icon: BookOpen, color: "text-emerald-400" },
    { id: "module-mastery", name: "Module Mastery", icon: Zap, color: "text-blue-400" },
    { id: "7d-optimization", name: "7D Optimization", icon: Settings, color: "text-purple-400" },
    { id: "test-engine", name: "Test Engine", icon: TestTube, color: "text-orange-400" },
    { id: "export-workflow", name: "Export Workflow", icon: Download, color: "text-green-400" },
    { id: "integration-api", name: "Integration API", icon: Code, color: "text-red-400" },
  ]

  const interactiveGuides = [
    {
      id: "interactive-demo",
      title: "Interactive 7D Parameter Demo",
      description: "Hands-on demonstration of the 7D parameter system with real-time feedback.",
      category: "7d-optimization",
      duration: "10 min",
      difficulty: "Beginner",
      icon: Settings,
      interactive: true
    },
    {
      id: "module-workshop",
      title: "Module Selection Workshop",
      description: "Interactive workshop to help you choose the right modules for your use case.",
      category: "module-mastery",
      duration: "15 min",
      difficulty: "Intermediate",
      icon: Zap,
      interactive: true
    },
    {
      id: "testing-lab",
      title: "Prompt Testing Laboratory",
      description: "Test and validate your prompts with our interactive testing environment.",
      category: "test-engine",
      duration: "20 min",
      difficulty: "Advanced",
      icon: TestTube,
      interactive: true
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "Intermediate":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      case "Advanced":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <div className="space-y-8">
      {/* Interactive Learning Paths */}
      <div>
        <h2 className="text-2xl font-bold mb-6 font-serif">Interactive Learning Paths</h2>
        <div className="grid gap-6">
          {interactiveGuides.map((guide) => {
            const Icon = guide.icon
            return (
              <Card
                key={guide.id}
                className="bg-card border border-border hover:border-accent/30 transition-all group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-5 h-5 text-accent" />
                        <CardTitle className="text-xl font-serif group-hover:text-accent transition-colors">
                          {guide.title}
                        </CardTitle>
                        <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-600/30">
                          Interactive
                        </Badge>
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
                      className="flex-1 bg-accent hover:bg-accent/80 text-accent-foreground"
                      asChild
                    >
                      <Link href={`/guides/${guide.id}`}>
                        <Play className="w-4 h-4 mr-2" />
                        Start Interactive Guide
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      className="flex-1 border-border hover:border-accent hover:text-accent bg-transparent"
                      asChild
                    >
                      <Link href="/generator">
                        <Zap className="w-4 h-4 mr-2" />
                        Try in Generator
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="text-xl font-bold mb-4 font-serif">Filter by Category</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className={selectedCategory === null ? "bg-accent text-accent-foreground" : "border-border text-foreground hover:bg-accent hover:text-accent-foreground"}
          >
            All Categories
          </Button>
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "bg-accent text-accent-foreground" : "border-border text-foreground hover:bg-accent hover:text-accent-foreground"}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.name}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Progress Tracking */}
      <div>
        <h3 className="text-xl font-bold mb-4 font-serif">Your Learning Progress</h3>
        <Card className="bg-card border border-border">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">0</div>
                <div className="text-sm text-gray-400">Guides Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">0</div>
                <div className="text-sm text-gray-400">Modules Mastered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">0</div>
                <div className="text-sm text-gray-400">Skills Unlocked</div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                asChild
              >
                <Link href="/signup">
                  Sign Up to Track Progress
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-bold mb-4 font-serif">Quick Actions</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-20 border-border hover:border-accent hover:text-accent bg-transparent"
            asChild
          >
            <Link href="/generator">
              <div className="text-center">
                <Zap className="w-6 h-6 mx-auto mb-2" />
                <div className="font-semibold">Start Building</div>
                <div className="text-sm text-gray-400">Jump into the generator</div>
              </div>
            </Link>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 border-border hover:border-accent hover:text-accent bg-transparent"
            asChild
          >
            <Link href="/modules">
              <div className="text-center">
                <Settings className="w-6 h-6 mx-auto mb-2" />
                <div className="font-semibold">Explore Modules</div>
                <div className="text-sm text-gray-400">Browse all 50 modules</div>
              </div>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}