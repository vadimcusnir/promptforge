"use client"


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Lock, ArrowRight, Info, Clock, Tag, Building, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import dynamic from "next/dynamic"

// Lazy load the client-side interactive components
const ModulesClient = dynamic(() => import("@/components/modules/ModulesClient"), {
  loading: () => <ModulesSkeleton />,
  ssr: false
})



// Server-side content for SEO
const serverSideModules = [
  {
    id: "M01",
    name: "Strategic Business Planning",
    description: "Generate comprehensive business strategies using the 7D parameter engine",
    category: "business",
    domain_slug: "business",
    complexity: "intermediate",
    estimated_time_minutes: 15,
    tags: ["strategy", "planning", "business"],
    vector: "Strategic"
  },
  {
    id: "M07",
    name: "Risk Reversal Framework",
    description: "Systematic risk assessment and mitigation strategies for business operations",
    category: "risk",
    domain_slug: "business",
    complexity: "advanced",
    estimated_time_minutes: 20,
    tags: ["risk", "assessment", "mitigation"],
    vector: "Strategic"
  },
  {
    id: "M11",
    name: "Funnel Optimization",
    description: "Conversion funnel analysis and optimization strategies for marketing campaigns",
    category: "marketing",
    domain_slug: "marketing",
    complexity: "intermediate",
    estimated_time_minutes: 12,
    tags: ["funnel", "conversion", "marketing"],
    vector: "Rhetoric"
  },
  {
    id: "M12",
    name: "Visibility Diagnostics",
    description: "Comprehensive visibility analysis for brand and product positioning",
    category: "branding",
    domain_slug: "marketing",
    complexity: "intermediate",
    estimated_time_minutes: 18,
    tags: ["visibility", "branding", "positioning"],
    vector: "Strategic"
  },
  {
    id: "M13",
    name: "Pricing Psychology",
    description: "Psychological pricing strategies and value proposition optimization",
    category: "pricing",
    domain_slug: "business",
    complexity: "advanced",
    estimated_time_minutes: 16,
    tags: ["pricing", "psychology", "value"],
    vector: "Rhetoric"
  },
  {
    id: "M22",
    name: "Lead Generation",
    description: "Systematic lead generation strategies and qualification frameworks",
    category: "sales",
    domain_slug: "sales",
    complexity: "intermediate",
    estimated_time_minutes: 14,
    tags: ["leads", "generation", "qualification"],
    vector: "Content"
  },
  {
    id: "M24",
    name: "Personal PR Strategy",
    description: "Personal branding and public relations strategy development",
    category: "branding",
    domain_slug: "marketing",
    complexity: "intermediate",
    estimated_time_minutes: 22,
    tags: ["personal", "branding", "pr"],
    vector: "Content"
  },
  {
    id: "M32",
    name: "Cohort Testing",
    description: "Statistical cohort analysis and A/B testing methodologies",
    category: "analytics",
    domain_slug: "analytics",
    complexity: "advanced",
    estimated_time_minutes: 25,
    tags: ["cohort", "testing", "analytics"],
    vector: "Analytics"
  },
  {
    id: "M35",
    name: "Content Heat Mapping",
    description: "Content performance analysis and optimization strategies",
    category: "content",
    domain_slug: "marketing",
    complexity: "intermediate",
    estimated_time_minutes: 19,
    tags: ["content", "heatmap", "optimization"],
    vector: "Branding"
  },
  {
    id: "M40",
    name: "Crisis Management",
    description: "Comprehensive crisis communication and management protocols",
    category: "crisis",
    domain_slug: "business",
    complexity: "expert",
    estimated_time_minutes: 30,
    tags: ["crisis", "management", "communication"],
    vector: "Crisis"
  },
  {
    id: "M45",
    name: "Learning Path Design",
    description: "Structured learning curriculum and skill development frameworks",
    category: "education",
    domain_slug: "education",
    complexity: "advanced",
    estimated_time_minutes: 28,
    tags: ["learning", "curriculum", "skills"],
    vector: "Cognitive"
  },
  {
    id: "M50",
    name: "Brand Voice Development",
    description: "Comprehensive brand voice and tone guidelines for consistent communication",
    category: "branding",
    domain_slug: "marketing",
    complexity: "intermediate",
    estimated_time_minutes: 24,
    tags: ["brand", "voice", "communication"],
    vector: "Branding"
  }
]

function ModulesSkeleton() {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="bg-zinc-900/80 border border-zinc-700">
          <CardHeader>
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              <div className="h-6 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function ModulesPage() {
  return (
    <div className="min-h-screen pattern-bg text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Server-side rendered header for SEO */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-serif mb-4">50 Operational Modules. 7 Vectors. Zero Improvisation.</h1>
          <p className="text-xl text-gray-400 mb-6">
            Industrial-grade prompt modules for professional workflows. Each module is designed for specific use cases 
            across 7 semantic vectors: Strategic, Rhetoric, Content, Analytics, Branding, Crisis, and Cognitive.
          </p>
          
          {/* Server-side module preview for SEO */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {serverSideModules.slice(0, 6).map((module) => (
              <Card
                key={module.id}
                className="bg-zinc-900/80 border border-zinc-700 hover:border-yellow-400/50 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm text-yellow-400">{module.id}</span>
                    <Badge variant="secondary" className="text-xs bg-zinc-800 text-zinc-500">
                      {module.vector}
                    </Badge>
                  </div>
                  <CardTitle className="font-serif text-lg">{module.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={`${
                      module.complexity === 'beginner' ? 'bg-green-500' :
                      module.complexity === 'intermediate' ? 'bg-blue-500' :
                      module.complexity === 'advanced' ? 'bg-orange-500' :
                      'bg-red-500'
                    } text-white text-xs`}>
                      {module.complexity}
                    </Badge>
                    <Badge className="bg-gray-600 text-white text-xs">
                      {module.domain_slug}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 mb-3">{module.description}</CardDescription>
                  
                  <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {module.estimated_time_minutes} min
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {module.category}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {module.tags.slice(0, 3).map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs border-gray-600 text-gray-300"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {module.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                        +{module.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <Button
                    className="w-full bg-yellow-600 hover:bg-yellow-700"
                    asChild
                  >
                    <Link href={`/generator?module=${module.id}`}>
                      Use in Generator
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Client-side interactive components */}
        <Suspense fallback={<ModulesSkeleton />}>
          <ModulesClient />
        </Suspense>
      </div>
    </div>
  )
}