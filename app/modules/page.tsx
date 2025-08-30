"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Search, Filter, Lock, ArrowRight, Info, Clock, Tag, Building, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import dynamic from "next/dynamic"

// Metadata is handled in layout.tsx for client components

// Lazy load the client-side interactive components - temporarily disabled
// const ModulesClient = dynamic(() => import("@/components/modules/ModulesClient"), {
//   loading: () => <ModulesSkeleton />
// })

// Import skeleton components
import { ModuleGridSkeleton } from "@/components/ui/skeleton"



// Server-side content for SEO - Complete M01-M50 grid
const serverSideModules = [
  // Strategic Vector (M01-M10)
  {
    id: "M01",
    name: "Strategic Business Planning",
    description: "Generate comprehensive business strategies using the 7D parameter engine",
    category: "business",
    domain_slug: "business",
    complexity: "intermediate",
    estimated_time_minutes: 15,
    tags: ["strategy", "planning", "business"],
    vector: "Strategic",
    input_schema: "Business context, objectives, constraints",
    outputs: "Strategic plan, action items, KPIs",
    kpi: "Strategic alignment score, feasibility rating",
    guardrails: "Industry compliance, risk assessment",
    min_entitlement: "Pro"
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
    vector: "Strategic",
    input_schema: "Risk context, business objectives, constraints",
    outputs: "Risk assessment, mitigation strategies, action plan",
    kpi: "Risk reduction score, mitigation effectiveness",
    guardrails: "Compliance requirements, industry standards",
    min_entitlement: "Pro"
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
    vector: "Rhetoric",
    input_schema: "Funnel data, conversion metrics, user journey",
    outputs: "Optimization recommendations, A/B test plans",
    kpi: "Conversion rate improvement, funnel efficiency",
    guardrails: "Data privacy, marketing compliance",
    min_entitlement: "Pro"
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
    vector: "Strategic",
    input_schema: "Brand assets, market data, competitor analysis",
    outputs: "Visibility report, positioning recommendations",
    kpi: "Brand awareness score, market position",
    guardrails: "Brand guidelines, competitive intelligence",
    min_entitlement: "Pro"
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
    vector: "Rhetoric",
    input_schema: "Product data, market research, competitor pricing",
    outputs: "Pricing strategy, value proposition framework",
    kpi: "Price sensitivity score, conversion optimization",
    guardrails: "Pricing regulations, market ethics",
    min_entitlement: "Pro"
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
    vector: "Content",
    input_schema: "Target audience, market data, sales goals",
    outputs: "Lead generation strategy, qualification framework",
    kpi: "Lead quality score, conversion rate",
    guardrails: "GDPR compliance, sales regulations",
    min_entitlement: "Pro"
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
    vector: "Content",
    input_schema: "Personal profile, goals, target audience",
    outputs: "PR strategy, content calendar, media plan",
    kpi: "Brand awareness, media coverage",
    guardrails: "Reputation management, media ethics",
    min_entitlement: "Pro"
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
    vector: "Analytics",
    input_schema: "User data, test parameters, success metrics",
    outputs: "Test results, statistical analysis, recommendations",
    kpi: "Statistical significance, effect size",
    guardrails: "Data privacy, statistical validity",
    min_entitlement: "Enterprise"
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
    vector: "Branding",
    input_schema: "Content assets, performance data, user behavior",
    outputs: "Heat map analysis, optimization recommendations",
    kpi: "Engagement score, content effectiveness",
    guardrails: "Content guidelines, user privacy",
    min_entitlement: "Pro"
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
    vector: "Crisis",
    input_schema: "Crisis context, stakeholders, communication channels",
    outputs: "Crisis response plan, communication strategy",
    kpi: "Response time, reputation recovery",
    guardrails: "Legal compliance, crisis protocols",
    min_entitlement: "Enterprise"
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
    vector: "Cognitive",
    input_schema: "Learning objectives, target audience, skill gaps",
    outputs: "Learning curriculum, assessment framework",
    kpi: "Learning effectiveness, skill acquisition",
    guardrails: "Educational standards, accessibility",
    min_entitlement: "Enterprise"
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
    vector: "Branding",
    input_schema: "Brand guidelines, target audience, tone preferences",
    outputs: "Voice guidelines, tone matrix, communication framework",
    kpi: "Brand consistency score, audience engagement",
    guardrails: "Brand compliance, cultural sensitivity",
    min_entitlement: "Pro"
  }
]

// Generate complete M01-M50 grid for display
const generateCompleteModuleGrid = () => {
  const modules = []
  const vectors = ["Strategic", "Rhetoric", "Content", "Analytics", "Branding", "Crisis", "Cognitive"]
  
  for (let i = 1; i <= 50; i++) {
    const moduleId = `M${i.toString().padStart(2, '0')}`
    const vectorIndex = Math.floor((i - 1) / 10)
    const vector = vectors[vectorIndex] || "Strategic"
    
    // Use existing module if available, otherwise generate placeholder
    const existingModule = serverSideModules.find(m => m.id === moduleId)
    
    if (existingModule) {
      modules.push(existingModule)
    } else {
      modules.push({
        id: moduleId,
        name: `${vector} Module ${moduleId}`,
        description: `Advanced ${vector.toLowerCase()} prompt engineering module`,
        category: vector.toLowerCase(),
        domain_slug: "business",
        complexity: i % 3 === 0 ? "advanced" : i % 2 === 0 ? "intermediate" : "beginner",
        estimated_time_minutes: 10 + (i % 20),
        tags: [vector.toLowerCase(), "module", "prompt"],
        vector: vector,
        input_schema: "Context, parameters, constraints",
        outputs: "Optimized prompt, recommendations",
        kpi: "Quality score, efficiency rating",
        guardrails: "Content safety, compliance",
        min_entitlement: i % 4 === 0 ? "Enterprise" : "Pro"
      })
    }
  }
  
  return modules
}

const allModules = generateCompleteModuleGrid()

function ModulesSkeleton() {
  return <ModuleGridSkeleton count={12} />
}

export default function ModulesPage() {
  // Breadcrumb will be automatically generated from path

  return (
    <div className="min-h-screen pattern-bg text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb path="/modules" />
        </div>

        {/* Server-side rendered header for SEO */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-serif mb-4">50 Operational Modules. 7 Vectors. Zero Improvisation.</h1>
          <p className="text-xl text-gray-400 mb-6">
            Industrial-grade prompt modules for professional workflows. Each module is designed for specific use cases 
            across 7 semantic vectors: Strategic, Rhetoric, Content, Analytics, Branding, Crisis, and Cognitive.
          </p>
          
          {/* Complete M01-M50 Module Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-4 mb-8">
            {allModules.map((module) => (
              <Card
                key={module.id}
                className="bg-zinc-900/80 border border-zinc-700 hover:border-yellow-400/50 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm text-yellow-400">{module.id}</span>
                    <Badge variant="secondary" className="text-xs bg-zinc-800 text-zinc-500">
                      {module.vector || 'Strategic'}
                    </Badge>
                  </div>
                  <CardTitle className="font-serif text-lg">{module.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={`${
                      (module.complexity || 'beginner') === 'beginner' ? 'bg-green-500' :
                      (module.complexity || 'beginner') === 'intermediate' ? 'bg-blue-500' :
                      (module.complexity || 'beginner') === 'advanced' ? 'bg-orange-500' :
                      'bg-red-500'
                    } text-white text-xs`}>
                      {module.complexity || 'beginner'}
                    </Badge>
                    <Badge className="bg-gray-600 text-white text-xs">
                      {module.domain_slug || 'business'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 mb-3">{module.description || 'Module description'}</CardDescription>
                  
                  <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {module.estimated_time_minutes || 10} min
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {module.category || 'business'}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {(module.tags || []).slice(0, 3).map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs border-gray-600 text-gray-300"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {(module.tags || []).length > 3 && (
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                        +{(module.tags || []).length - 3}
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

        {/* Client-side interactive components - temporarily disabled */}
        {/* <Suspense fallback={<ModulesSkeleton />}>
          <ModulesClient />
        </Suspense> */}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="bg-zinc-900/80 border border-zinc-700 border-yellow-500/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 font-serif">Ready to Start Building?</h3>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Choose a module and start creating industrial-grade prompts with the Generator.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-yellow-500 hover:bg-yellow-500/80 text-black"
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

        {/* Module Specifications Overlays */}
        {allModules.map((module) => (
          <div
            key={`overlay-${module.id}`}
            id={`module-${module.id}-overlay`}
            className="hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                e.currentTarget.classList.add('hidden')
              }
            }}
          >
            <div className="bg-zinc-900 border border-zinc-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{module.name}</h2>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-yellow-400">{module.id}</span>
                      <Badge variant="secondary" className="bg-zinc-800 text-zinc-500">
                        {module.vector}
                      </Badge>
                      <Badge className={`${
                        module.complexity === 'beginner' ? 'bg-green-500' :
                        module.complexity === 'intermediate' ? 'bg-blue-500' :
                        module.complexity === 'advanced' ? 'bg-orange-500' :
                        'bg-red-500'
                      } text-white`}>
                        {module.complexity}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      document.getElementById(`module-${module.id}-overlay`)?.classList.add('hidden')
                    }}
                  >
                    ×
                  </Button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                    <p className="text-gray-400">{module.description}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Input Schema</h3>
                      <p className="text-gray-400 text-sm">{module.input_schema}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Outputs</h3>
                      <p className="text-gray-400 text-sm">{module.outputs}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">KPI</h3>
                      <p className="text-gray-400 text-sm">{module.kpi}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Guardrails</h3>
                      <p className="text-gray-400 text-sm">{module.guardrails}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Minimum Entitlement</h3>
                    <Badge className="bg-yellow-600 text-white">{module.min_entitlement}</Badge>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {module.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      className="bg-yellow-600 hover:bg-yellow-700"
                      asChild
                    >
                      <Link href={`/generator?module=${module.id}`}>
                        Use in Generator
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
                    >
                      View Examples
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}