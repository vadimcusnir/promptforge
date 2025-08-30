import type { Metadata } from "next"
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Clock, 
  User, 
  ArrowRight,
  Star,
  Eye,
  Heart,
  Share2
} from 'lucide-react'
import { Suspense } from "react"
import dynamic from "next/dynamic"

// Lazy load the client-side interactive components
const BlogClient = dynamic(() => import("@/components/blog/BlogClient"), {
  loading: () => <BlogSkeleton />,
  ssr: false
})



// Server-side content for SEO
const serverSidePosts = [
  {
    id: '1',
    title: 'The Complete Guide to Prompt Engineering: From Basics to Advanced Techniques',
    excerpt: 'Master the art of prompt engineering with our comprehensive guide covering fundamental principles, advanced strategies, and real-world applications.',
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
  },
  {
    id: '3',
    title: 'Building Scalable AI Workflows: A Developer\'s Perspective',
    excerpt: 'Learn how to design and implement scalable AI workflows that can handle enterprise-level demands and maintain quality standards.',
    author: 'Alex Thompson',
    publishedAt: '2024-01-10',
    readTime: 15,
    category: 'Development',
    tags: ['workflows', 'scalability', 'enterprise', 'development', 'ai'],
    featured: false,
    views: 9870,
    likes: 543,
    shares: 156,
    slug: 'building-scalable-ai-workflows'
  },
  {
    id: '4',
    title: 'Prompt Quality Metrics: Measuring Success in AI Applications',
    excerpt: 'Understand the key metrics for evaluating prompt quality and how to implement them in your AI applications for better results.',
    author: 'Dr. Emily Watson',
    publishedAt: '2024-01-08',
    readTime: 10,
    category: 'Analytics',
    tags: ['metrics', 'quality', 'evaluation', 'analytics', 'ai'],
    featured: false,
    views: 7650,
    likes: 432,
    shares: 98,
    slug: 'prompt-quality-metrics-ai-applications'
  },
  {
    id: '5',
    title: 'Enterprise AI Integration: Best Practices and Common Pitfalls',
    excerpt: 'Navigate the complexities of enterprise AI integration with proven best practices and learn to avoid common pitfalls.',
    author: 'Jennifer Kim',
    publishedAt: '2024-01-05',
    readTime: 18,
    category: 'Enterprise',
    tags: ['enterprise', 'integration', 'best-practices', 'ai', 'business'],
    featured: false,
    views: 6540,
    likes: 387,
    shares: 145,
    slug: 'enterprise-ai-integration-best-practices'
  },
  {
    id: '6',
    title: 'The Future of Prompt Engineering: Trends and Predictions for 2024',
    excerpt: 'Explore emerging trends in prompt engineering and get insights into what the future holds for AI-powered communication.',
    author: 'David Park',
    publishedAt: '2024-01-03',
    readTime: 9,
    category: 'Trends',
    tags: ['future', 'trends', 'predictions', '2024', 'ai'],
    featured: false,
    views: 5430,
    likes: 298,
    shares: 87,
    slug: 'future-prompt-engineering-trends-2024'
  }
]

function BlogSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="group hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              <div className="h-6 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Server-side rendered header for SEO */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            PromptForge Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Expert insights, tutorials, and best practices for mastering AI prompt engineering 
            and building scalable AI workflows. Learn from industry professionals and stay ahead of the curve.
          </p>
        </div>

        {/* Server-side featured posts for SEO */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" />
            Featured Articles
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {serverSidePosts.filter(post => post.featured).map((post) => (
              <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-white opacity-80" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-yellow-500 text-white">Featured</Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{post.category}</Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime} min read
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                  
                  <CardDescription className="text-base">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-sm font-medium">{post.author}</span>
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(post.publishedAt)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {formatNumber(post.views)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {formatNumber(post.likes)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="w-4 h-4" />
                        {formatNumber(post.shares)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Server-side all posts preview for SEO */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Latest Articles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serverSidePosts.slice(2, 5).map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{post.category}</Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime} min
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                  
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">{post.author}</span>
                    <span className="text-sm text-gray-500">{formatDate(post.publishedAt)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {formatNumber(post.views)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {formatNumber(post.likes)}
                      </span>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="group-hover:text-blue-600">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Client-side interactive components */}
        <Suspense fallback={<BlogSkeleton />}>
          <BlogClient />
        </Suspense>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Get the latest insights on prompt engineering, AI workflows, and industry trends 
            delivered to your inbox every week.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              placeholder="Enter your email"
              className="flex-1 text-gray-900 px-4 py-2 rounded-lg"
            />
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
          
          <p className="text-xs text-blue-200 mt-3">
            No spam, unsubscribe at any time. We respect your privacy.
          </p>
        </div>
      </div>
    </div>
  )
}