import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ForgeGlyphInteractive } from "@/components/forge/ForgeGlyphInteractive"
import { Play, Clock, Target, ArrowRight, Star } from "lucide-react"
import Link from "next/link"

export default function GuidesPage() {
  const guides = [
    {
      id: "getting-started",
      title: "Getting Started with PromptForge",
      description: "Learn the basics of industrial prompt engineering and the 7D system",
      difficulty: "Beginner",
      duration: "15 min",
      status: "complete",
      href: "/guides/getting-started",
      featured: true
    },
    {
      id: "7d-mastery",
      title: "Mastering the 7D Parameters",
      description: "Deep dive into each dimension and how to optimize them",
      difficulty: "Intermediate",
      duration: "25 min",
      status: "complete",
      href: "/guides/7d-mastery"
    },
    {
      id: "module-selection",
      title: "Choosing the Right Module",
      description: "Guide to selecting modules based on your use case and industry",
      difficulty: "Beginner",
      duration: "12 min",
      status: "complete",
      href: "/guides/module-selection"
    },
    {
      id: "scoring-optimization",
      title: "Optimizing for Score ≥80",
      description: "Techniques to consistently achieve high-quality prompt scores",
      difficulty: "Advanced",
      duration: "30 min",
      status: "complete",
      href: "/guides/scoring-optimization"
    },
    {
      id: "export-workflows",
      title: "Export Workflows & Automation",
      description: "Setting up efficient export pipelines for different formats",
      difficulty: "Intermediate",
      duration: "20 min",
      status: "complete",
      href: "/guides/export-workflows"
    },
    {
      id: "enterprise-integration",
      title: "Enterprise Integration",
      description: "API integration and team collaboration best practices",
      difficulty: "Advanced",
      duration: "45 min",
      status: "coming-soon",
      href: "/guides/enterprise-integration"
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting Common Issues",
      description: "Solutions for common problems and error states",
      difficulty: "Beginner",
      duration: "18 min",
      status: "complete",
      href: "/guides/troubleshooting"
    },
    {
      id: "advanced-techniques",
      title: "Advanced Prompt Engineering",
      description: "Expert-level techniques for complex use cases",
      difficulty: "Advanced",
      duration: "35 min",
      status: "coming-soon",
      href: "/guides/advanced-techniques"
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

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
              Guides
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Step-by-step tutorials to master industrial prompt engineering
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Featured Guide */}
        <div className="mb-8">
          {guides.filter(g => g.featured).map((guide) => (
            <Card key={guide.id} className="bg-gradient-to-r from-yellow-600/10 to-amber-600/10 border border-yellow-600/30">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-400">Featured Guide</span>
                </div>
                <CardTitle className="text-2xl font-serif text-white">{guide.title}</CardTitle>
                <CardDescription className="text-gray-300 text-lg">{guide.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <Badge className={getDifficultyColor(guide.difficulty)}>
                    {guide.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{guide.duration}</span>
                  </div>
                </div>
                <Link href={guide.href}>
                  <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold">
                    <Play className="w-5 h-5 mr-2" />
                    Start Guide
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* All Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.filter(g => !g.featured).map((guide) => (
            <Card
              key={guide.id}
              className={`bg-zinc-900/80 border border-zinc-700 hover:border-yellow-600/50 transition-all duration-300 ${
                guide.status === 'coming-soon' ? 'opacity-75' : 'cursor-pointer'
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-yellow-600/20">
                    <Target className="w-5 h-5 text-yellow-400" />
                  </div>
                  {guide.status === 'coming-soon' && (
                    <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                      Coming Soon
                    </span>
                  )}
                </div>
                <CardTitle className="text-lg font-serif text-white">
                  {guide.title}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {guide.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={getDifficultyColor(guide.difficulty)}>
                    {guide.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{guide.duration}</span>
                  </div>
                </div>
                {guide.status === 'complete' ? (
                  <Link href={guide.href}>
                    <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold">
                      <Play className="w-4 h-4 mr-2" />
                      Start Guide
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
          ))}
        </div>

        {/* Learning Path */}
        <div className="mt-12">
          <Card className="bg-zinc-900/80 border border-zinc-700">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-white">Recommended Learning Path</CardTitle>
              <CardDescription className="text-gray-400">
                Follow this sequence to master PromptForge from beginner to expert
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { step: 1, title: "Getting Started with PromptForge", href: "/guides/getting-started" },
                  { step: 2, title: "Choosing the Right Module", href: "/guides/module-selection" },
                  { step: 3, title: "Mastering the 7D Parameters", href: "/guides/7d-mastery" },
                  { step: 4, title: "Export Workflows & Automation", href: "/guides/export-workflows" },
                  { step: 5, title: "Optimizing for Score ≥80", href: "/guides/scoring-optimization" },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-4 p-4 rounded-lg bg-zinc-800/50">
                    <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center text-black font-bold text-sm">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{item.title}</h3>
                    </div>
                    <Link href={item.href}>
                      <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                        Start
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}