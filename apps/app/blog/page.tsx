import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, Flame, Rss, BookOpen, Download } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Forge Chronicles: AI Prompt Engineering & Meta-Prompts Blog – PromptForge",
  description:
    "Discover industrial insights on AI prompting, custom GPTs, automation flows, and monetization strategies. Expert articles on cognitive stratification and system architecture.",
  canonical: "https://promptforge.com/blog",
  openGraph: {
    title: "Forge Chronicles: AI Prompt Engineering & Meta-Prompts Blog",
    description:
      "Discover industrial insights on AI prompting, custom GPTs, automation flows, and monetization strategies.",
    url: "https://promptforge.com/blog",
    siteName: "PromptForge",
    images: [
      {
        url: "https://promptforge.com/og-blog.png",
        width: 1200,
        height: 630,
        alt: "Forge Chronicles Blog",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Forge Chronicles: AI Prompt Engineering & Meta-Prompts Blog",
    description:
      "Discover industrial insights on AI prompting, custom GPTs, automation flows, and monetization strategies.",
    images: ["https://promptforge.com/og-blog.png"],
  },
}

const featuredArticles = [
  {
    id: 1,
    slug: "cognitive-stratification-mastery",
    title: "Cognitive Stratification: From Tool User to System Architect",
    excerpt:
      "Discover the three-tier progression that separates industrial operators from casual users. Learn the behavioral markers that unlock advanced capabilities.",
    coverImage: "/industrial-prompt-engineering-dashboard.png",
    author: {
      name: "Dr. Sarah Chen",
      avatar: "/professional-woman-portrait.png",
    },
    publishedAt: "2024-01-15",
    readingTime: 12,
    category: "Prompt Engineering",
    tags: ["Architecture", "Cognitive Systems"],
    featured: true,
  },
  {
    id: 2,
    slug: "7d-parameter-engine-deep-dive",
    title: "The 7D Parameter Engine: Industrial-Grade Prompt Architecture",
    excerpt:
      "Master the seven dimensions that transform simple prompts into auditable, scalable systems. Domain, Scale, Urgency, Complexity, Resources, Application, Output.",
    coverImage: "/industrial-factory-automation-systems.png",
    author: {
      name: "Marcus Rodriguez",
      avatar: "/professional-man-portrait.png",
    },
    publishedAt: "2024-01-12",
    readingTime: 18,
    category: "Automation",
    tags: ["Engineering", "Systems"],
    featured: true,
  },
]

const allArticles = [
  {
    id: 3,
    slug: "behavioral-screening-algorithms",
    title: "Behavioral Screening: Identifying Systems Thinkers",
    excerpt:
      "How PromptForge's qualification algorithms separate tactical users from strategic operators. The 80% failure rate is by design.",
    coverImage: "/digital-audit-trail-compliance-dashboard.png",
    author: {
      name: "Dr. Elena Vasquez",
      avatar: "/professional-woman-scientist.png",
    },
    publishedAt: "2024-01-10",
    readingTime: 15,
    category: "Architecture",
    tags: ["Psychology", "Systems"],
  },
  {
    id: 4,
    slug: "module-m01-m50-mastery",
    title: "The 50-Module Arsenal: From M01 to Industrial Mastery",
    excerpt:
      "Navigate the complete module ecosystem. Learn which modules unlock at each cognitive tier and how to progress through the qualification system.",
    coverImage: "/organized-industrial-tool-library.png",
    author: {
      name: "James Park",
      avatar: "/professional-engineer.png",
    },
    publishedAt: "2024-01-08",
    readingTime: 22,
    category: "Automation",
    tags: ["Operations", "Modules"],
  },
  {
    id: 5,
    slug: "exclusionary-pricing-philosophy",
    title: "Why We Price to Exclude: The Anti-SaaS Approach",
    excerpt:
      "Traditional SaaS optimizes for inclusion. PromptForge optimizes for cognitive advancement. Learn why our pricing creates better outcomes.",
    coverImage: "/industrial-prompt-engineering-dashboard.png",
    author: {
      name: "Alexandra Kim",
      avatar: "/professional-woman-portrait.png",
    },
    publishedAt: "2024-01-05",
    readingTime: 10,
    category: "Architecture",
    tags: ["Strategy", "Business"],
  },
  {
    id: 6,
    slug: "prompt-education-vs-transformation",
    title: "Beyond Prompt Education: Cognitive Transformation",
    excerpt:
      "Why teaching prompts keeps users dependent. How PromptForge builds independent system operators through behavioral architecture.",
    coverImage: "/industrial-factory-automation-systems.png",
    author: {
      name: "Dr. Michael Torres",
      avatar: "/professional-man-portrait.png",
    },
    publishedAt: "2024-01-03",
    readingTime: 14,
    category: "Prompting",
    tags: ["Education", "Psychology"],
  },
]

const categories = ["Prompt Engineering", "Automation", "Architecture"]
const domains = ["Cognitive Systems", "Engineering", "Psychology", "Operations", "Strategy", "Education"]

function LeadMagnetCTA() {
  const handleSubscribe = async (formData: FormData) => {
    "use server"
    const email = formData.get("email") as string

    // Log telemetry event
    console.log("[v0] Lead magnet subscribe:", { email: email?.substring(0, 3) + "***", source: "blog" })

    // TODO: Add to Supabase subscribers table
    // TODO: Send welcome email with PDF download link
  }

  return (
    <div className="bg-gradient-to-r from-[#CDA434] to-[#B8954A] rounded-lg p-8 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-4">
          <Download className="w-8 h-8 text-black mr-3" />
          <h3 className="font-cinzel text-2xl md:text-3xl font-bold text-black">Download ChatGPT Knows Your Future</h3>
        </div>
        <p className="text-black/80 text-lg mb-6">
          Hot Works Meta-Prompts + Advanced AI Playbook included. Free Ebook.
        </p>
        <form action={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            className="bg-white border-0 text-black placeholder-gray-600 flex-1"
            aria-label="Email address for ebook download"
          />
          <Button
            type="submit"
            className="bg-black text-white hover:bg-gray-800 whitespace-nowrap px-6 focus:ring-2 focus:ring-[#00FF7F]"
          >
            Subscribe for Free
          </Button>
        </form>
        <p className="text-black/60 text-sm mt-3">Join 10,000+ AI practitioners. Unsubscribe anytime.</p>
      </div>
    </div>
  )
}

function NewsletterCTA() {
  return (
    <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6 text-center">
      <h3 className="font-cinzel text-xl font-bold text-white mb-2">Stay ahead of AI. Join 10,000+ readers.</h3>
      <p className="text-gray-400 mb-4">Get weekly insights on prompt engineering and AI automation.</p>
      <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <Input
          type="email"
          placeholder="Enter your email"
          className="bg-[#0A0A0A] border-gray-600 text-white placeholder-gray-400 flex-1"
          aria-label="Email address for newsletter"
        />
        <Button className="bg-[#CDA434] text-black hover:bg-[#B8954A] focus:ring-2 focus:ring-[#00FF7F]">
          Subscribe
        </Button>
      </div>
    </div>
  )
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center mb-8">
            <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              Forge Chronicles: AI Prompt Engineering & Meta-Prompts Blog
            </h1>
            <h2 className="font-space-grotesk text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto mb-8">
              Discover industrial insights on AI prompting, custom GPTs, automation flows, and monetization strategies.
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                className="border-[#CDA434] text-[#CDA434] hover:bg-[#CDA434] hover:text-black focus:ring-2 focus:ring-[#00FF7F] bg-transparent"
              >
                <Rss className="w-4 h-4 mr-2" />
                RSS Feed
              </Button>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:border-[#CDA434] hover:text-[#CDA434] focus:ring-2 focus:ring-[#00FF7F] bg-transparent"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                All Articles
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-12 sm:py-16">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {featuredArticles.map((article) => (
              <Card
                key={article.id}
                className="bg-[#1a1a1a] border-gray-700 hover:border-[#CDA434] transition-all duration-300 group"
              >
                <CardContent className="p-0">
                  <Link
                    href={`/blog/${article.slug}`}
                    className="focus:outline-none focus:ring-2 focus:ring-[#00FF7F] rounded-lg"
                  >
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <Image
                        src={article.coverImage || "/placeholder.svg"}
                        alt={`Cover image for ${article.title}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-[#CDA434] text-black font-semibold">
                          <Flame className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Badge variant="outline" className="border-[#CDA434] text-[#CDA434] text-xs">
                          {article.category}
                        </Badge>
                        {article.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                            {tag}
                          </Badge>
                        ))}
                        <div className="flex items-center text-gray-400 text-xs ml-auto">
                          <Clock className="w-3 h-3 mr-1" />
                          {article.readingTime} min
                        </div>
                      </div>
                      <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white group-hover:text-[#CDA434] transition-colors mb-3">
                        {article.title}
                      </h2>
                      <p className="font-space-grotesk text-gray-400 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Image
                            src={article.author.avatar || "/placeholder.svg"}
                            alt={`${article.author.name} profile picture`}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                          <span className="font-space-grotesk text-gray-300 text-sm">{article.author.name}</span>
                        </div>
                        <span className="text-gray-500 text-xs">
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="py-8">
          <LeadMagnetCTA />
        </section>

        <section className="py-12 sm:py-16">
          <div className="mb-8">
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold mb-4">Explore All Forge Chronicles</h2>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search the chronicles..."
                  className="pl-10 bg-[#1a1a1a] border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00FF7F]"
                  aria-label="Search articles"
                />
              </div>
            </div>

            {/* Filter Chips */}
            <div className="mb-8">
              <div className="mb-4">
                <h3 className="font-space-grotesk text-sm font-semibold text-gray-300 mb-2">Cognitive Tier:</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant="outline"
                      className="cursor-pointer border-gray-600 text-gray-300 hover:border-[#CDA434] hover:text-[#CDA434] focus:ring-2 focus:ring-[#00FF7F]"
                      role="button"
                      tabIndex={0}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-space-grotesk text-sm font-semibold text-gray-300 mb-2">Domain:</h3>
                <div className="flex flex-wrap gap-2">
                  {domains.map((domain) => (
                    <Badge
                      key={domain}
                      variant="outline"
                      className="cursor-pointer border-gray-600 text-gray-300 hover:border-[#CDA434] hover:text-[#CDA434] focus:ring-2 focus:ring-[#00FF7F]"
                      role="button"
                      tabIndex={0}
                    >
                      {domain}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {allArticles.map((article) => (
              <Card
                key={article.id}
                className="bg-[#1a1a1a] border-gray-700 hover:border-[#CDA434] transition-all duration-300 group"
              >
                <CardContent className="p-0">
                  <Link
                    href={`/blog/${article.slug}`}
                    className="focus:outline-none focus:ring-2 focus:ring-[#00FF7F] rounded-lg"
                  >
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <Image
                        src={article.coverImage || "/placeholder.svg"}
                        alt={`Cover image for ${article.title}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Badge variant="outline" className="border-[#CDA434] text-[#CDA434] text-xs">
                          {article.category}
                        </Badge>
                        <div className="flex items-center text-gray-400 text-xs ml-auto">
                          <Clock className="w-3 h-3 mr-1" />
                          {article.readingTime} min
                        </div>
                      </div>
                      <h3 className="font-cinzel text-lg font-bold text-white group-hover:text-[#CDA434] transition-colors mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="font-space-grotesk text-gray-400 text-sm mb-3 line-clamp-2">{article.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Image
                            src={article.author.avatar || "/placeholder.svg"}
                            alt={`${article.author.name} profile picture`}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <span className="font-space-grotesk text-gray-300 text-xs truncate">
                            {article.author.name}
                          </span>
                        </div>
                        <span className="text-gray-500 text-xs">
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="py-8">
          <NewsletterCTA />
        </section>
      </main>
    </div>
  )
}
