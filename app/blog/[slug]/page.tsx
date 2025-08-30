import type { Metadata } from "next"
import Link from 'next/link'
import { notFound } from 'next/navigation'

// Static blog posts data
const blogPosts = [
  {
    id: '1',
    title: 'The Complete Guide to Prompt Engineering: From Basics to Advanced Techniques',
    excerpt: 'Master the art of prompt engineering with our comprehensive guide covering fundamental principles, advanced strategies, and real-world applications.',
    content: 'Full content here...',
    author: 'Dr. Sarah Chen',
    publishedAt: '2024-01-15',
    readTime: 12,
    category: 'Prompt Engineering',
    tags: ['basics', 'advanced', 'techniques', 'ai', 'gpt'],
    featured: true,
    views: 15420,
    likes: 892,
    shares: 234,
    slug: 'complete-guide-prompt-engineering'
  },
  {
    id: '2',
    title: '7D Framework: Revolutionizing Business Communication with AI',
    excerpt: 'Discover how the 7D framework transforms business communication by providing structured, scalable, and effective prompt strategies.',
    content: 'Full content here...',
    author: 'Marcus Rodriguez',
    publishedAt: '2024-01-12',
    readTime: 8,
    category: 'Business Strategy',
    tags: ['7d-framework', 'business', 'communication', 'strategy', 'ai'],
    featured: true,
    views: 12850,
    likes: 756,
    shares: 189,
    slug: '7d-framework-business-communication-ai'
  }
]

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find(p => p.slug === slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} - PromptForge Blog`,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = blogPosts.find(p => p.slug === slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">{post.title}</span>
          </div>
        </nav>

        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {post.title}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between mb-8">
              <div className="text-sm text-gray-500">
                By {post.author} • {new Date(post.publishedAt).toLocaleDateString()} • {post.readTime} min read
              </div>
            </div>
          </header>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p>{post.content}</p>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <Link href="/blog" className="text-blue-600 hover:text-blue-800">
                ← Back to Blog
              </Link>
              
              <Link href="/generator" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Try PromptForge →
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}