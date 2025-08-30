import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { BookOpen, Zap, Settings, TestTube, Download, Code, CheckCircle, Play, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "PromptForge Guides - Industrial Prompt Engineering Tutorials",
  description: "Master industrial prompt engineering with comprehensive guides covering 7D parameters, module mastery, testing, and API integration. Learn from beginner to advanced levels.",
  keywords: ["prompt engineering guides", "AI tutorials", "industrial prompts", "7D parameters", "module mastery", "API integration"],
  openGraph: {
    title: "PromptForge Guides - Industrial Prompt Engineering Tutorials",
    description: "Master industrial prompt engineering with comprehensive guides covering 7D parameters, module mastery, testing, and API integration.",
    type: "website",
  },
  alternates: {
    canonical: "/guides",
  },
}

// Lazy load the client-side interactive components - temporarily disabled
// const GuidesClient = dynamic(() => import("@/components/guides/GuidesClient"), {
//   loading: () => <GuidesSkeleton />
// })

// Import skeleton components
import { CardSkeleton, ListSkeleton } from "@/components/ui/skeleton"



// Server-side content for SEO
const serverSideGuides = [
  // Getting Started Section
  {
    id: "first-prompt",
    title: "Generate Your First Prompt",
    description: "Learn the basics of prompt generation with PromptForge's industrial-grade system.",
    category: "getting-started",
    duration: "5 min",
    difficulty: "Beginner",
    icon: BookOpen
  },
  {
    id: "platform-overview",
    title: "Platform Overview & Navigation",
    description: "Understand the PromptForge interface and core concepts.",
    category: "getting-started",
    duration: "6 min",
    difficulty: "Beginner",
    icon: BookOpen
  },
  {
    id: "account-setup",
    title: "Account Setup & Preferences",
    description: "Configure your account settings and workspace preferences.",
    category: "getting-started",
    duration: "4 min",
    difficulty: "Beginner",
    icon: BookOpen
  },
  
  // Module Mastery Section
  {
    id: "module-selection",
    title: "Choosing the Right Module",
    description: "Navigate the 50-module library to find the perfect tool for your use case.",
    category: "module-mastery",
    duration: "8 min",
    difficulty: "Beginner",
    icon: Zap
  },
  {
    id: "module-combinations",
    title: "Module Combinations & Workflows",
    description: "Learn how to combine multiple modules for complex prompt engineering tasks.",
    category: "module-mastery",
    duration: "10 min",
    difficulty: "Intermediate",
    icon: Zap
  },
  {
    id: "module-optimization",
    title: "Module Performance Optimization",
    description: "Optimize module selection and configuration for maximum efficiency.",
    category: "module-mastery",
    duration: "7 min",
    difficulty: "Intermediate",
    icon: Zap
  },
  
  // 7D Optimization Section
  {
    id: "7d-parameters",
    title: "Master the 7D Parameter Engine",
    description: "Deep dive into domain, scale, urgency, complexity, resources, application, and output.",
    category: "7d-optimization",
    duration: "12 min",
    difficulty: "Intermediate",
    icon: Settings
  },
  {
    id: "domain-selection",
    title: "Domain Selection Strategies",
    description: "Choose the right domain for your specific use case and industry.",
    category: "7d-optimization",
    duration: "6 min",
    difficulty: "Beginner",
    icon: Settings
  },
  {
    id: "scale-urgency-config",
    title: "Scale & Urgency Configuration",
    description: "Configure scale and urgency parameters for optimal results.",
    category: "7d-optimization",
    duration: "8 min",
    difficulty: "Intermediate",
    icon: Settings
  },
  
  // Test Engine Section
  {
    id: "test-simulate",
    title: "Testing with Simulation Engine",
    description: "Learn how to validate prompts using our deterministic testing system.",
    category: "test-engine",
    duration: "10 min",
    difficulty: "Intermediate",
    icon: TestTube
  },
  {
    id: "quality-scoring",
    title: "Quality Scoring & Validation",
    description: "Understand the scoring system and achieve 80+ scores for export eligibility.",
    category: "test-engine",
    duration: "9 min",
    difficulty: "Intermediate",
    icon: TestTube
  },
  {
    id: "a-b-testing",
    title: "A/B Testing & Comparison",
    description: "Compare different prompt variations and measure performance.",
    category: "test-engine",
    duration: "11 min",
    difficulty: "Advanced",
    icon: TestTube
  },
  
  // Export Workflow Section
  {
    id: "export-bundles",
    title: "Export and Bundle Management",
    description: "Master the art of exporting prompts in multiple formats with checksums.",
    category: "export-workflow",
    duration: "7 min",
    difficulty: "Beginner",
    icon: Download
  },
  {
    id: "format-selection",
    title: "Export Format Selection",
    description: "Choose the right export format (TXT, MD, JSON, PDF) for your needs.",
    category: "export-workflow",
    duration: "5 min",
    difficulty: "Beginner",
    icon: Download
  },
  {
    id: "batch-export",
    title: "Batch Export & Automation",
    description: "Export multiple prompts efficiently and set up automated workflows.",
    category: "export-workflow",
    duration: "8 min",
    difficulty: "Advanced",
    icon: Download
  },
  
  // Integration API Section
  {
    id: "api-integration",
    title: "Enterprise API Integration",
    description: "Integrate PromptForge into your workflow using our REST API.",
    category: "integration-api",
    duration: "15 min",
    difficulty: "Advanced",
    icon: Code
  },
  {
    id: "api-authentication",
    title: "API Authentication & Security",
    description: "Set up secure API authentication and manage API keys.",
    category: "integration-api",
    duration: "6 min",
    difficulty: "Intermediate",
    icon: Code
  },
  {
    id: "webhook-integration",
    title: "Webhook Integration & Events",
    description: "Set up webhooks for real-time notifications and event handling.",
    category: "integration-api",
    duration: "12 min",
    difficulty: "Advanced",
    icon: Code
  }
]

const categories = [
  { id: "getting-started", name: "Getting Started", icon: BookOpen, color: "text-emerald-400" },
  { id: "module-mastery", name: "Module Mastery", icon: Zap, color: "text-blue-400" },
  { id: "7d-optimization", name: "7D Optimization", icon: Settings, color: "text-purple-400" },
  { id: "test-engine", name: "Test Engine", icon: TestTube, color: "text-orange-400" },
  { id: "export-workflow", name: "Export Workflow", icon: Download, color: "text-green-400" },
  { id: "integration-api", name: "Integration API", icon: Code, color: "text-red-400" },
]

function GuidesSkeleton() {
  return (
    <div className="grid gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

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

export default function GuidesPage() {
  // Breadcrumb will be automatically generated from path

  // Structured data for guides
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "PromptForge Guides",
    "description": "Comprehensive guides for industrial prompt engineering",
    "url": "/guides",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": serverSideGuides.map((guide, index) => ({
        "@type": "Article",
        "position": index + 1,
        "name": guide.title,
        "description": guide.description,
        "url": `/guides/${guide.id}`,
        "timeRequired": guide.duration || "5 min",
        "educationalLevel": guide.difficulty || "Beginner",
        "about": {
          "@type": "Thing",
          "name": guide.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        }
      }))
    }
  }

  return (
    <div className="min-h-screen text-white relative z-10">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb path="/guides" />
        </div>

        {/* Server-side rendered header for SEO */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-accent" />
            <h1 className="text-4xl font-bold font-serif">PromptForge™ Guides</h1>
          </div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Master the art of industrial prompt engineering. From first generation to enterprise integration.
            Learn the 7D parameter engine, module mastery, and advanced workflows with our comprehensive guides.
          </p>
        </div>

        {/* Server-side category overview for SEO */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => {
            const Icon = category.icon
            const categoryGuides = serverSideGuides.filter(g => g.category === category.id)
            
            return (
              <Card key={category.id} className="bg-card border border-border hover:border-accent/30 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-accent">
                    <Icon className="w-6 h-6" />
                    {category.name}
                  </CardTitle>
                  <p className="text-gray-400 text-sm">
                    {category.id === "getting-started" && "Start your journey with PromptForge fundamentals"}
                    {category.id === "module-mastery" && "Learn to navigate and utilize our 50-module library"}
                    {category.id === "7d-optimization" && "Master the seven-dimensional parameter system"}
                    {category.id === "test-engine" && "Validate and score your prompts with precision"}
                    {category.id === "export-workflow" && "Export, bundle, and manage your prompt artifacts"}
                    {category.id === "integration-api" && "Integrate PromptForge into your enterprise workflow"}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categoryGuides.map((guide) => (
                      <div key={guide.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">{guide.title}</span>
                        <Badge className={getDifficultyColor(guide.difficulty || 'Beginner')}>
                          {guide.difficulty || 'Beginner'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Server-side featured guides for SEO */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 font-serif">Featured Learning Paths</h2>
          <div className="grid gap-6">
            {serverSideGuides.slice(0, 3).map((guide) => {
              const Icon = guide.icon
              return (
                <Card
                  key={guide.id}
                  className="bg-card border border-border hover:border-accent/30 transition-all"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="w-5 h-5 text-accent" />
                          <CardTitle className="text-xl font-serif">{guide.title}</CardTitle>
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
                        className="flex-1 border-border hover:border-accent hover:text-accent bg-transparent"
                        disabled
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Read Guide (Coming Soon)
                      </Button>

                      <Button
                        className="flex-1 bg-accent hover:bg-accent/80 text-accent-foreground"
                        asChild
                      >
                        <Link href="/generator">
                          <Play className="w-4 h-4 mr-2" />
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

        {/* Client-side interactive components - temporarily disabled */}
        {/* <Suspense fallback={<GuidesSkeleton />}>
          <GuidesClient />
        </Suspense> */}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="bg-card border border-border border-accent/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 font-serif">Ready to Start Building?</h3>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Put your knowledge into practice. Open the Generator and start creating industrial-grade prompts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/80 text-accent-foreground"
                  asChild
                >
                  <Link href="/generator">
                    Start Building Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
                  asChild
                >
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}