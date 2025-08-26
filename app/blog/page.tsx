"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock data for articles
const articles = [
  {
    id: 1,
    slug: "mastering-7d-parameter-engine",
    title: "Mastering the 7D Parameter Engine: A Complete Guide",
    excerpt:
      "Learn how to leverage all seven dimensions of our parameter engine to create industrial-grade prompts that deliver consistent, auditable results.",
    coverImage: "/industrial-prompt-engineering-dashboard.png",
    author: "Sarah Chen",
    authorImage: "/professional-woman-portrait.png",
    publishDate: "2024-01-15",
    readTime: "8 min",
    domain: "Engineering",
    vectors: ["Precision", "Scale", "Complexity"],
  },
  {
    id: 2,
    slug: "from-prototype-to-production",
    title: "From Prototype to Production: Scaling Your Prompt Systems",
    excerpt:
      "Discover the essential patterns and practices for taking your prompt experiments from local testing to enterprise-grade deployment.",
    coverImage: "/industrial-factory-automation-systems.png",
    author: "Marcus Rodriguez",
    authorImage: "/professional-man-portrait.png",
    publishDate: "2024-01-12",
    readTime: "12 min",
    domain: "Operations",
    vectors: ["Scale", "Urgency", "Resources"],
  },
  {
    id: 3,
    slug: "audit-trails-compliance",
    title: "Building Audit Trails for AI Compliance",
    excerpt:
      "Ensure your AI systems meet regulatory requirements with comprehensive logging, versioning, and traceability features.",
    coverImage: "/digital-audit-trail-compliance-dashboard.png",
    author: "Dr. Elena Vasquez",
    authorImage: "/professional-woman-scientist.png",
    publishDate: "2024-01-10",
    readTime: "15 min",
    domain: "Compliance",
    vectors: ["Complexity", "Domain", "Output"],
  },
  {
    id: 4,
    slug: "module-library-best-practices",
    title: "Module Library Best Practices: Organizing Your Prompt Arsenal",
    excerpt:
      "Structure your prompt modules for maximum reusability and team collaboration with proven organizational patterns.",
    coverImage: "/organized-industrial-tool-library.png",
    author: "James Park",
    authorImage: "/professional-engineer.png",
    publishDate: "2024-01-08",
    readTime: "6 min",
    domain: "Architecture",
    vectors: ["Application", "Resources", "Scale"],
  },
]

const domains = ["All", "Engineering", "Operations", "Compliance", "Architecture"]
const vectors = ["Precision", "Scale", "Complexity", "Urgency", "Resources", "Domain", "Application", "Output"]

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDomain, setSelectedDomain] = useState("All")
  const [selectedVectors, setSelectedVectors] = useState<string[]>([])

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDomain = selectedDomain === "All" || article.domain === selectedDomain
    const matchesVectors =
      selectedVectors.length === 0 || selectedVectors.some((vector) => article.vectors.includes(vector))

    return matchesSearch && matchesDomain && matchesVectors
  })

  const toggleVector = (vector: string) => {
    setSelectedVectors((prev) => (prev.includes(vector) ? prev.filter((v) => v !== vector) : [...prev, vector]))
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white">
      {/* Hero Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="font-montserrat text-4xl md:text-5xl font-bold mb-4">
              Blog <span className="text-[#d1a954]">PromptForge™</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Industrial-grade insights, patterns, and practices for building production-ready prompt systems
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* Search */}
            <Card className="bg-[#1a1a1a] border-gray-700">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-[#0e0e0e] border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Domain Filter */}
            <Card className="bg-[#1a1a1a] border-gray-700">
              <CardContent className="p-4">
                <h3 className="font-montserrat font-semibold mb-3">Domain</h3>
                <div className="space-y-2">
                  {domains.map((domain) => (
                    <button
                      key={domain}
                      onClick={() => setSelectedDomain(domain)}
                      className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                        selectedDomain === domain
                          ? "bg-[#d1a954] text-black font-medium"
                          : "text-gray-300 hover:text-white hover:bg-gray-800"
                      }`}
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
                <h3 className="font-montserrat font-semibold mb-3">Vectors</h3>
                <div className="flex flex-wrap gap-2">
                  {vectors.map((vector) => (
                    <Badge
                      key={vector}
                      variant={selectedVectors.includes(vector) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        selectedVectors.includes(vector)
                          ? "bg-[#d1a954] text-black hover:bg-[#b8954a]"
                          : "border-gray-600 text-gray-300 hover:border-[#d1a954] hover:text-[#d1a954]"
                      }`}
                      onClick={() => toggleVector(vector)}
                    >
                      {vector}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Articles */}
            <Card className="bg-[#1a1a1a] border-gray-700">
              <CardContent className="p-4">
                <h3 className="font-montserrat font-semibold mb-3">Recommended</h3>
                <div className="space-y-3">
                  {articles.slice(0, 3).map((article) => (
                    <Link key={article.id} href={`/blog/${article.slug}`} className="block group">
                      <div className="flex gap-3">
                        <Image
                          src={article.coverImage || "/placeholder.svg"}
                          alt={article.title}
                          width={60}
                          height={40}
                          className="rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-white group-hover:text-[#d1a954] transition-colors line-clamp-2">
                            {article.title}
                          </h4>
                          <p className="text-xs text-gray-400 mt-1">{article.readTime}</p>
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
            {/* Articles Grid */}
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filteredArticles.map((article) => (
                <Card
                  key={article.id}
                  className="bg-[#1a1a1a] border-gray-700 hover:border-[#d1a954] transition-all duration-300 group"
                >
                  <CardContent className="p-0">
                    <Link href={`/blog/${article.slug}`}>
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <Image
                          src={article.coverImage || "/placeholder.svg"}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                            {article.domain}
                          </Badge>
                          <div className="flex items-center text-gray-400 text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {article.readTime}
                          </div>
                        </div>
                        <h2 className="font-montserrat text-xl font-bold text-white group-hover:text-[#d1a954] transition-colors mb-3 line-clamp-2">
                          {article.title}
                        </h2>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Image
                              src={article.authorImage || "/placeholder.svg"}
                              alt={article.author}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                            <span className="text-gray-300 text-sm">{article.author}</span>
                          </div>
                          <span className="text-gray-500 text-xs">
                            {new Date(article.publishDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No articles found matching your criteria.</p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedDomain("All")
                    setSelectedVectors([])
                  }}
                  variant="outline"
                  className="mt-4 border-gray-600 text-gray-300 hover:border-[#d1a954] hover:text-[#d1a954]"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-[#d1a954] to-[#b8954a] border-0">
            <CardContent className="p-8 text-center">
              <h3 className="font-montserrat text-2xl font-bold text-black mb-2">Stay Updated with PromptForge</h3>
              <p className="text-black/80 mb-6">
                Get the latest insights on industrial prompt engineering delivered to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input placeholder="Enter your email" className="bg-white border-0 text-black placeholder-gray-600" />
                <Button className="bg-black text-white hover:bg-gray-800 whitespace-nowrap">
                  Subscribe <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
