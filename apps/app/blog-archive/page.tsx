"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, ArrowRight, Flame, Zap, Target, Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const articles = [
  {
    id: 1,
    slug: "cognitive-stratification-mastery",
    title: "Cognitive Stratification: From Tool User to System Architect",
    excerpt:
      "Discover the three-tier progression that separates industrial operators from casual users. Learn the behavioral markers that unlock advanced capabilities.",
    coverImage: "/industrial-prompt-engineering-dashboard.png",
    author: "Dr. Sarah Chen",
    authorImage: "/professional-woman-portrait.png",
    publishDate: "2024-01-15",
    readTime: "12 min",
    tier: "Architecture",
    domain: "Cognitive Systems",
    vectors: ["Complexity", "Scale", "Domain"],
    featured: true,
  },
  {
    id: 2,
    slug: "7d-parameter-engine-deep-dive",
    title: "The 7D Parameter Engine: Industrial-Grade Prompt Architecture",
    excerpt:
      "Master the seven dimensions that transform simple prompts into auditable, scalable systems. Domain, Scale, Urgency, Complexity, Resources, Application, Output.",
    coverImage: "/industrial-factory-automation-systems.png",
    author: "Marcus Rodriguez",
    authorImage: "/professional-man-portrait.png",
    publishDate: "2024-01-12",
    readTime: "18 min",
    tier: "Automation",
    domain: "Engineering",
    vectors: ["Precision", "Scale", "Complexity"],
    featured: true,
  },
  {
    id: 3,
    slug: "behavioral-screening-algorithms",
    title: "Behavioral Screening: Identifying Systems Thinkers",
    excerpt:
      "How PromptForge's qualification algorithms separate tactical users from strategic operators. The 80% failure rate is by design.",
    coverImage: "/digital-audit-trail-compliance-dashboard.png",
    author: "Dr. Elena Vasquez",
    authorImage: "/professional-woman-scientist.png",
    publishDate: "2024-01-10",
    readTime: "15 min",
    tier: "Architecture",
    domain: "Psychology",
    vectors: ["Complexity", "Domain", "Application"],
    featured: false,
  },
  {
    id: 4,
    slug: "module-m01-m50-mastery",
    title: "The 50-Module Arsenal: From M01 to Industrial Mastery",
    excerpt:
      "Navigate the complete module ecosystem. Learn which modules unlock at each cognitive tier and how to progress through the qualification system.",
    coverImage: "/organized-industrial-tool-library.png",
    author: "James Park",
    authorImage: "/professional-engineer.png",
    publishDate: "2024-01-08",
    readTime: "22 min",
    tier: "Automation",
    domain: "Operations",
    vectors: ["Application", "Resources", "Scale"],
    featured: false,
  },
  {
    id: 5,
    slug: "exclusionary-pricing-philosophy",
    title: "Why We Price to Exclude: The Anti-SaaS Approach",
    excerpt:
      "Traditional SaaS optimizes for inclusion. PromptForge optimizes for cognitive advancement. Learn why our pricing creates better outcomes.",
    coverImage: "/industrial-prompt-engineering-dashboard.png",
    author: "Alexandra Kim",
    authorImage: "/professional-woman-portrait.png",
    publishDate: "2024-01-05",
    readTime: "10 min",
    tier: "Architecture",
    domain: "Strategy",
    vectors: ["Domain", "Complexity", "Output"],
    featured: false,
  },
  {
    id: 6,
    slug: "prompt-education-vs-transformation",
    title: "Beyond Prompt Education: Cognitive Transformation",
    excerpt:
      "Why teaching prompts keeps users dependent. How PromptForge builds independent system operators through behavioral architecture.",
    coverImage: "/industrial-factory-automation-systems.png",
    author: "Dr. Michael Torres",
    authorImage: "/professional-man-portrait.png",
    publishDate: "2024-01-03",
    readTime: "14 min",
    tier: "Prompting",
    domain: "Education",
    vectors: ["Application", "Domain", "Complexity"],
    featured: false,
  },
]

const tiers = ["All", "Prompting", "Automation", "Architecture"]
const domains = ["All", "Cognitive Systems", "Engineering", "Psychology", "Operations", "Strategy", "Education"]
const vectors = ["Precision", "Scale", "Complexity", "Urgency", "Resources", "Domain", "Application", "Output"]

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTier, setSelectedTier] = useState("All")
  const [selectedDomain, setSelectedDomain] = useState("All")
  const [selectedVectors, setSelectedVectors] = useState<string[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTier = selectedTier === "All" || article.tier === selectedTier
    const matchesDomain = selectedDomain === "All" || article.domain === selectedDomain
    const matchesVectors =
      selectedVectors.length === 0 || selectedVectors.some((vector) => article.vectors.includes(vector))

    return matchesSearch && matchesTier && matchesDomain && matchesVectors
  })

  const toggleVector = (vector: string) => {
    setSelectedVectors((prev) => (prev.includes(vector) ? prev.filter((v) => v !== vector) : [...prev, vector]))
  }

  const featuredArticles = articles.filter((article) => article.featured)

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white font-sans">
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="font-montserrat text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              The <span className="text-[#d1a954]">Forge</span> Chronicles
            </h1>
            <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto px-4">
              Industrial insights for cognitive advancement. From prompt education to system architecture.
            </p>
          </div>

          {/* Featured Articles */}
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {featuredArticles.map((article) => (
              <Card
                key={article.id}
                className="bg-[#1a1a1a] border-gray-700 hover:border-[#d1a954] transition-all duration-300 group"
              >
                <CardContent className="p-0">
                  <Link href={`/blog/${article.slug}`}>
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <Image
                        src={article.coverImage || "/placeholder.svg"}
                        alt={`Cover image for ${article.title}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        priority={article.featured}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-[#d1a954] text-black font-semibold">
                          <Flame className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                          {article.tier}
                        </Badge>
                        <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                          {article.domain}
                        </Badge>
                        <div className="flex items-center text-gray-400 text-xs ml-auto">
                          <Clock className="w-3 h-3 mr-1" />
                          {article.readTime}
                        </div>
                      </div>
                      <h2 className="font-montserrat text-lg sm:text-xl font-bold text-white group-hover:text-[#d1a954] transition-colors mb-3">
                        {article.title}
                      </h2>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <Image
                            src={article.authorImage || "/placeholder.svg"}
                            alt={`${article.author} profile picture`}
                            width={24}
                            height={24}
                            className="rounded-full flex-shrink-0"
                          />
                          <span className="text-gray-300 text-sm truncate">{article.author}</span>
                        </div>
                        <span className="text-gray-500 text-xs flex-shrink-0 ml-2">
                          {new Date(article.publishDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="lg:hidden mb-6">
          <Button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:border-[#d1a954] hover:text-[#d1a954]"
            aria-label="Toggle filters menu"
          >
            {sidebarOpen ? <X className="w-4 h-4 mr-2" /> : <Menu className="w-4 h-4 mr-2" />}
            Filters
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div
            className={`lg:w-80 space-y-6 ${sidebarOpen ? "block" : "hidden lg:block"} ${sidebarOpen ? "fixed inset-0 z-50 bg-[#0e0e0e] p-4 overflow-y-auto lg:relative lg:inset-auto lg:z-auto lg:bg-transparent lg:p-0" : ""}`}
          >
            {sidebarOpen && (
              <div className="lg:hidden flex justify-between items-center mb-6">
                <h2 className="font-montserrat text-xl font-bold">Filters</h2>
                <Button onClick={() => setSidebarOpen(false)} variant="ghost" size="sm" aria-label="Close filters menu">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Search */}
            <Card className="bg-[#1a1a1a] border-gray-700">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search the chronicles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-[#0e0e0e] border-gray-600 text-white placeholder-gray-400"
                    aria-label="Search articles"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Cognitive Tier Filter */}
            <Card className="bg-[#1a1a1a] border-gray-700">
              <CardContent className="p-4">
                <h3 className="font-montserrat font-semibold mb-3 flex items-center">
                  <Target className="w-4 h-4 mr-2 text-[#d1a954]" />
                  Cognitive Tier
                </h3>
                <div className="space-y-2" role="group" aria-label="Filter by cognitive tier">
                  {tiers.map((tier) => (
                    <button
                      key={tier}
                      onClick={() => {
                        setSelectedTier(tier)
                        setSidebarOpen(false)
                      }}
                      className={`block w-full text-left px-3 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[#d1a954] ${
                        selectedTier === tier
                          ? "bg-[#d1a954] text-black font-medium"
                          : "text-gray-300 hover:text-white hover:bg-gray-800"
                      }`}
                      aria-pressed={selectedTier === tier}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Domain Filter */}
            <Card className="bg-[#1a1a1a] border-gray-700">
              <CardContent className="p-4">
                <h3 className="font-montserrat font-semibold mb-3 flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-[#d1a954]" />
                  Domain
                </h3>
                <div className="space-y-2" role="group" aria-label="Filter by domain">
                  {domains.map((domain) => (
                    <button
                      key={domain}
                      onClick={() => {
                        setSelectedDomain(domain)
                        setSidebarOpen(false)
                      }}
                      className={`block w-full text-left px-3 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[#d1a954] ${
                        selectedDomain === domain
                          ? "bg-[#d1a954] text-black font-medium"
                          : "text-gray-300 hover:text-white hover:bg-gray-800"
                      }`}
                      aria-pressed={selectedDomain === domain}
                    >
                      {domain}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Vector Filter */}
            <Card className="bg-[#1a1a1a] border-gray-700">
              <CardContent className="p-4">
                <h3 className="font-montserrat font-semibold mb-3">7D Vectors</h3>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by 7D vectors">
                  {vectors.map((vector) => (
                    <Badge
                      key={vector}
                      variant={selectedVectors.includes(vector) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#d1a954] ${
                        selectedVectors.includes(vector)
                          ? "bg-[#d1a954] text-black hover:bg-[#b8954a]"
                          : "border-gray-600 text-gray-300 hover:border-[#d1a954] hover:text-[#d1a954]"
                      }`}
                      onClick={() => toggleVector(vector)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          toggleVector(vector)
                        }
                      }}
                      aria-pressed={selectedVectors.includes(vector)}
                    >
                      {vector}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Essential Reading */}
            <Card className="bg-[#1a1a1a] border-gray-700">
              <CardContent className="p-4">
                <h3 className="font-montserrat font-semibold mb-3">Essential Reading</h3>
                <div className="space-y-3">
                  {articles.slice(0, 3).map((article) => (
                    <Link
                      key={article.id}
                      href={`/blog/${article.slug}`}
                      className="block group focus:outline-none focus:ring-2 focus:ring-[#d1a954] rounded"
                    >
                      <div className="flex gap-3">
                        <Image
                          src={article.coverImage || "/placeholder.svg"}
                          alt={`Thumbnail for ${article.title}`}
                          width={60}
                          height={40}
                          className="rounded object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-white group-hover:text-[#d1a954] transition-colors line-clamp-2">
                            {article.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                              {article.tier}
                            </Badge>
                            <span className="text-xs text-gray-400">{article.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6 sm:mb-8">
              <h2 className="font-montserrat text-xl sm:text-2xl font-bold mb-2">All Chronicles</h2>
              <p className="text-gray-400">
                {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {/* Articles Grid */}
            <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {filteredArticles
                .filter((article) => !article.featured)
                .map((article) => (
                  <Card
                    key={article.id}
                    className="bg-[#1a1a1a] border-gray-700 hover:border-[#d1a954] transition-all duration-300 group"
                  >
                    <CardContent className="p-0">
                      <Link
                        href={`/blog/${article.slug}`}
                        className="focus:outline-none focus:ring-2 focus:ring-[#d1a954] rounded-lg"
                      >
                        <div className="aspect-video relative overflow-hidden rounded-t-lg">
                          <Image
                            src={article.coverImage || "/placeholder.svg"}
                            alt={`Cover image for ${article.title}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          />
                        </div>
                        <div className="p-4 sm:p-6">
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                              {article.tier}
                            </Badge>
                            <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                              {article.domain}
                            </Badge>
                            <div className="flex items-center text-gray-400 text-xs ml-auto">
                              <Clock className="w-3 h-3 mr-1" />
                              {article.readTime}
                            </div>
                          </div>
                          <h2 className="font-montserrat text-lg sm:text-xl font-bold text-white group-hover:text-[#d1a954] transition-colors mb-3 line-clamp-2">
                            {article.title}
                          </h2>
                          <p className="text-gray-400 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              <Image
                                src={article.authorImage || "/placeholder.svg"}
                                alt={`${article.author} profile picture`}
                                width={24}
                                height={24}
                                className="rounded-full flex-shrink-0"
                              />
                              <span className="text-gray-300 text-sm truncate">{article.author}</span>
                            </div>
                            <span className="text-gray-500 text-xs flex-shrink-0 ml-2">
                              {new Date(article.publishDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {filteredArticles.filter((article) => !article.featured).length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg mb-4">No articles found matching your criteria.</p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedTier("All")
                    setSelectedDomain("All")
                    setSelectedVectors([])
                  }}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:border-[#d1a954] hover:text-[#d1a954]"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 sm:mt-16">
          <Card className="bg-gradient-to-r from-[#d1a954] to-[#b8954a] border-0">
            <CardContent className="p-6 sm:p-8 text-center">
              <h3 className="font-montserrat text-xl sm:text-2xl font-bold text-black mb-2">
                Join the Cognitive Elite
              </h3>
              <p className="text-black/80 mb-6 text-sm sm:text-base">
                Receive industrial insights and advancement opportunities. For operators, not users.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
                <Input
                  placeholder="Enter your email"
                  className="bg-white border-0 text-black placeholder-gray-600 flex-1"
                  type="email"
                  aria-label="Email address"
                />
                <Button className="bg-black text-white hover:bg-gray-800 whitespace-nowrap px-6">
                  Begin Advancement <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
