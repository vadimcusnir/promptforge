import type { Metadata } from "next"
import Link from 'next/link'
import { notFound } from 'next/navigation'

// Static guides data
const guides = [
  {
    id: "first-prompt",
    title: "Generate Your First Prompt",
    description: "Learn the basics of prompt generation with PromptForge's industrial-grade system.",
    category: "getting-started",
    duration: "5 min",
    difficulty: "Beginner",
    content: "This guide will walk you through creating your first prompt using PromptForge's industrial-grade system...",
    slug: "first-prompt"
  },
  {
    id: "module-selection",
    title: "Choosing the Right Module",
    description: "Navigate the 50-module library to find the perfect tool for your use case.",
    category: "module-mastery",
    duration: "8 min",
    difficulty: "Beginner",
    content: "Learn how to select the most appropriate module for your specific use case...",
    slug: "module-selection"
  },
  {
    id: "7d-parameters",
    title: "Master the 7D Parameter Engine",
    description: "Deep dive into domain, scale, urgency, complexity, resources, application, and output.",
    category: "7d-optimization",
    duration: "12 min",
    difficulty: "Intermediate",
    content: "Master the seven-dimensional parameter system for precise prompt configuration...",
    slug: "7d-parameters"
  }
]

export async function generateStaticParams() {
  return guides.map((guide) => ({
    slug: guide.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const guide = guides.find(g => g.slug === slug)
  
  if (!guide) {
    return {
      title: 'Guide Not Found',
    }
  }

  return {
    title: `${guide.title} - PromptForge Guides`,
    description: guide.description,
    keywords: ['prompt engineering guide', 'AI prompt tutorial', 'industrial prompt engineering', guide.category],
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: 'article',
    },
    alternates: {
      canonical: `/guides/${guide.slug}`,
    },
  }
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = guides.find(g => g.slug === slug)

  if (!guide) {
    notFound()
  }

  return (
    <div className="min-h-screen text-white relative z-10">
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-yellow-400 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-yellow-400 transition-colors">Guides</Link>
            <span>/</span>
            <span className="text-white">{guide.title}</span>
          </div>
        </nav>

        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded text-sm">
                {guide.difficulty}
              </span>
              <span className="text-gray-400 text-sm">{guide.duration}</span>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4 font-serif">
              {guide.title}
            </h1>
            
            <p className="text-xl text-gray-400 mb-6">
              {guide.description}
            </p>
          </header>

          <div className="prose prose-lg max-w-none prose-invert">
            <p className="text-gray-300">{guide.content}</p>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <Link href="/guides" className="text-yellow-400 hover:text-yellow-300">
                ← Back to Guides
              </Link>
              
              <Link href="/generator" className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600">
                Try in Generator →
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
