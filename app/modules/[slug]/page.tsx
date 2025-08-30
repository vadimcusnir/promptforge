import type { Metadata } from "next"
import Link from 'next/link'
import { notFound } from 'next/navigation'

// Static modules data
const modules = [
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
    content: "This module helps you create comprehensive business strategies using our proven 7D parameter framework...",
    slug: "strategic-business-planning"
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
    content: "Learn to systematically assess and mitigate business risks using our proven framework...",
    slug: "risk-reversal-framework"
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
    content: "Optimize your conversion funnels with data-driven strategies and proven methodologies...",
    slug: "funnel-optimization"
  }
]

export async function generateStaticParams() {
  return modules.map((module) => ({
    slug: module.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const module = modules.find(m => m.slug === slug)
  
  if (!module) {
    return {
      title: 'Module Not Found',
    }
  }

  return {
    title: `${module.name} (${module.id}) - PromptForge Modules`,
    description: module.description,
    keywords: [...module.tags, 'prompt engineering', 'AI modules', module.vector.toLowerCase()],
    openGraph: {
      title: `${module.name} (${module.id})`,
      description: module.description,
      type: 'article',
    },
    alternates: {
      canonical: `/modules/${module.slug}`,
    },
  }
}

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const module = modules.find(m => m.slug === slug)

  if (!module) {
    notFound()
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return 'bg-green-500'
      case 'intermediate': return 'bg-blue-500'
      case 'advanced': return 'bg-orange-500'
      case 'expert': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen pattern-bg text-white">
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-yellow-400 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/modules" className="hover:text-yellow-400 transition-colors">Modules</Link>
            <span>/</span>
            <span className="text-white">{module.name}</span>
          </div>
        </nav>

        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-mono text-sm text-yellow-400">{module.id}</span>
              <span className={`${getComplexityColor(module.complexity)} text-white text-xs px-2 py-1 rounded`}>
                {module.complexity}
              </span>
              <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded">
                {module.vector}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4 font-serif">
              {module.name}
            </h1>
            
            <p className="text-xl text-gray-400 mb-6">
              {module.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
              <span>⏱️ {module.estimated_time_minutes} min</span>
              <span>📂 {module.category}</span>
              <span>🏢 {module.domain_slug}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none prose-invert">
            <p className="text-gray-300">{module.content}</p>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="flex flex-wrap gap-2 mb-6">
              {module.tags.map((tag) => (
                <span key={tag} className="bg-gray-800 text-gray-300 px-3 py-1 rounded text-sm">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <Link href="/modules" className="text-yellow-400 hover:text-yellow-300">
                ← Back to Modules
              </Link>
              
              <Link 
                href={`/generator?module=${module.id}`} 
                className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600"
              >
                Use in Generator →
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
