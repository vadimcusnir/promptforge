import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, User, Tag } from "lucide-react";
import { generateBlogIndexJSONLD } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "Blog — PromptForge™ v3",
  description: "Latest insights, tutorials, and updates on prompt engineering, AI workflows, and the 7D framework",
  keywords: "prompt engineering blog, AI tutorials, 7D framework, prompt optimization, AI workflows",
  openGraph: {
    title: "Blog — PromptForge™ v3",
    description: "Latest insights, tutorials, and updates on prompt engineering, AI workflows, and the 7D framework",
    type: "website",
    images: [
      {
        url: "/og-blog.png",
        width: 1200,
        height: 630,
        alt: "PromptForge™ v3 Blog",
      },
    ],
  },
  alternates: {
    canonical: "https://chatgpt-prompting.com/blog",
  },
};

// Mock blog posts data - in production this would come from a CMS or database
const blogPosts = [
  {
    slug: "introduction-to-7d-framework",
    title: "Introduction to the 7D Framework for Prompt Engineering",
    excerpt: "Learn how the 7D framework revolutionizes prompt engineering with structured parameters for consistent, high-quality AI outputs.",
    cover: "/blog/7d-framework-intro.jpg",
    categories: ["Tutorial", "7D Framework"],
    tags: ["prompt-engineering", "7d-framework", "ai-optimization"],
    published_at: "2024-12-20T10:00:00Z",
    author: {
      name: "PromptForge Team",
      avatar: "/authors/promptforge-team.jpg",
    },
    read_time: "8 min read",
  },
  {
    slug: "optimizing-prompt-performance",
    title: "Optimizing Prompt Performance: A Complete Guide",
    excerpt: "Discover advanced techniques for improving prompt performance, including parameter tuning and quality validation strategies.",
    cover: "/blog/prompt-optimization.jpg",
    categories: ["Performance", "Optimization"],
    tags: ["performance", "optimization", "prompt-tuning"],
    published_at: "2024-12-18T14:30:00Z",
    author: {
      name: "Alex Chen",
      avatar: "/authors/alex-chen.jpg",
    },
    read_time: "12 min read",
  },
  {
    slug: "api-integration-best-practices",
    title: "API Integration Best Practices for PromptForge",
    excerpt: "Learn how to effectively integrate PromptForge APIs into your applications with real-world examples and best practices.",
    cover: "/blog/api-integration.jpg",
    categories: ["API", "Integration"],
    tags: ["api", "integration", "best-practices"],
    published_at: "2024-12-15T09:15:00Z",
    author: {
      name: "Sarah Johnson",
      avatar: "/authors/sarah-johnson.jpg",
    },
    read_time: "10 min read",
  },
  {
    slug: "understanding-prompt-scoring",
    title: "Understanding Prompt Scoring and Quality Metrics",
    excerpt: "Deep dive into how PromptForge evaluates prompt quality and what metrics matter most for your use cases.",
    cover: "/blog/prompt-scoring.jpg",
    categories: ["Quality", "Metrics"],
    tags: ["scoring", "quality-metrics", "evaluation"],
    published_at: "2024-12-12T16:45:00Z",
    author: {
      name: "Dr. Michael Rodriguez",
      avatar: "/authors/michael-rodriguez.jpg",
    },
    read_time: "15 min read",
  },
  {
    slug: "export-pipeline-deep-dive",
    title: "Export Pipeline Deep Dive: From Prompt to Production",
    excerpt: "Explore the complete export pipeline that transforms your prompts into production-ready formats with quality validation.",
    cover: "/blog/export-pipeline.jpg",
    categories: ["Export", "Production"],
    tags: ["export", "pipeline", "production"],
    published_at: "2024-12-10T11:20:00Z",
    author: {
      name: "Emma Wilson",
      avatar: "/authors/emma-wilson.jpg",
    },
    read_time: "9 min read",
  },
  {
    slug: "prompt-engineering-trends-2024",
    title: "Prompt Engineering Trends to Watch in 2024",
    excerpt: "Stay ahead of the curve with our analysis of emerging trends in prompt engineering and AI workflow optimization.",
    cover: "/blog/trends-2024.jpg",
    categories: ["Trends", "Analysis"],
    tags: ["trends", "2024", "future-of-ai"],
    published_at: "2024-12-08T13:00:00Z",
    author: {
      name: "David Kim",
      avatar: "/authors/david-kim.jpg",
    },
    read_time: "7 min read",
  },
];

const categories = [
  { name: "All", slug: "all", count: blogPosts.length },
  { name: "Tutorial", slug: "tutorial", count: 1 },
  { name: "Performance", slug: "performance", count: 1 },
  { name: "API", slug: "api", count: 1 },
  { name: "Quality", slug: "quality", count: 1 },
  { name: "Export", slug: "export", count: 1 },
  { name: "Trends", slug: "trends", count: 1 },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-[#5a5a5a]/30 bg-[#0e0e0e]">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-[#d1a954] rounded" />
            <span className="font-mono font-bold text-[#d1a954] text-xl">PromptForge™ v3</span>
          </div>
          <h1 className="font-sans text-4xl font-bold text-white mb-4">
            Blog
          </h1>
          <p className="text-xl text-[#a0a0a0] font-sans max-w-3xl">
            Latest insights, tutorials, and updates on prompt engineering, AI workflows, and the 7D framework
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div className="bg-[#1a1a1a] border border-[#5a5a5a]/30 rounded-lg p-6">
                <h2 className="font-sans text-lg font-semibold text-white mb-4">
                  Categories
                </h2>
                <nav className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/blog?category=${category.slug}`}
                      className="flex items-center justify-between text-[#a0a0a0] hover:text-white transition-colors font-sans text-sm"
                    >
                      <span>{category.name}</span>
                      <span className="text-xs bg-[#2a2a2a] px-2 py-1 rounded">
                        {category.count}
                      </span>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Newsletter */}
              <div className="bg-[#1a1a1a] border border-[#5a5a5a]/30 rounded-lg p-6">
                <h2 className="font-sans text-lg font-semibold text-white mb-4">
                  Stay Updated
                </h2>
                <p className="text-[#a0a0a0] font-sans text-sm mb-4">
                  Get the latest posts delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#5a5a5a]/30 rounded-md text-white placeholder-[#a0a0a0] font-sans text-sm focus:outline-none focus:border-[#d1a954]"
                  />
                  <button className="w-full bg-[#d1a954] text-black px-4 py-2 rounded-md font-sans font-medium text-sm hover:bg-[#d1a954]/90 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Post */}
            <div className="mb-12">
              <div className="bg-[#1a1a1a] border border-[#5a5a5a]/30 rounded-lg overflow-hidden">
                <div className="relative h-64 bg-gradient-to-r from-[#d1a954]/20 to-[#d1a954]/10">
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-[#d1a954] text-black text-xs font-mono font-semibold rounded">
                        FEATURED
                      </span>
                      <span className="text-[#d1a954] text-xs font-sans">
                        {blogPosts[0].categories[0]}
                      </span>
                    </div>
                    <h2 className="font-sans text-2xl font-bold text-white mb-2">
                      {blogPosts[0].title}
                    </h2>
                    <p className="text-[#a0a0a0] font-sans text-sm mb-4 line-clamp-2">
                      {blogPosts[0].excerpt}
                    </p>
                    <Link
                      href={`/blog/${blogPosts[0].slug}`}
                      className="inline-flex items-center text-[#d1a954] hover:text-[#d1a954]/80 transition-colors font-sans text-sm"
                    >
                      Read more <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {blogPosts.slice(1).map((post) => (
                <article
                  key={post.slug}
                  className="bg-[#1a1a1a] border border-[#5a5a5a]/30 rounded-lg overflow-hidden hover:border-[#d1a954]/50 transition-all duration-200"
                >
                  <div className="relative h-48 bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a]">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-4 left-4">
                      <span className="px-2 py-1 bg-[#d1a954] text-black text-xs font-mono font-semibold rounded">
                        {post.categories[0]}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-sans text-lg font-semibold text-white mb-2 line-clamp-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-[#d1a954] transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-[#a0a0a0] font-sans text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-[#a0a0a0] font-sans">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{post.author.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(post.published_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span>{post.read_time}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center space-x-2">
              <button
                disabled
                className="px-3 py-2 bg-[#2a2a2a] border border-[#5a5a5a]/30 rounded-md text-[#a0a0a0] font-sans text-sm cursor-not-allowed"
              >
                Previous
              </button>
              <button className="px-3 py-2 bg-[#d1a954] text-black rounded-md font-sans font-medium text-sm">
                1
              </button>
              <button className="px-3 py-2 bg-[#2a2a2a] border border-[#5a5a5a]/30 rounded-md text-white hover:bg-[#2a2a2a]/80 font-sans text-sm">
                2
              </button>
              <button className="px-3 py-2 bg-[#2a2a2a] border border-[#5a5a5a]/30 rounded-md text-white hover:bg-[#2a2a2a]/80 font-sans text-sm">
                3
              </button>
              <button className="px-3 py-2 bg-[#2a2a2a] border border-[#5a5a5a]/30 rounded-md text-white hover:bg-[#2a2a2a]/80 font-sans text-sm">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBlogIndexJSONLD({
            title: "Blog — PromptForge™ v3",
            description: "Latest insights, tutorials, and updates on prompt engineering, AI workflows, and the 7D framework",
            url: "https://chatgpt-prompting.com/blog",
            posts: blogPosts.map(post => ({
              title: post.title,
              url: `https://chatgpt-prompting.com/blog/${post.slug}`,
              publishedAt: post.published_at,
              author: post.author.name,
              excerpt: post.excerpt,
            }))
          }))
        }}
      />
    </div>
  );
}