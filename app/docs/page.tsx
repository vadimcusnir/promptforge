import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Code, Book, ArrowRight } from "lucide-react"
import Link from "next/link"

// Force dynamic rendering to prevent build issues
export const dynamic = 'force-dynamic'

export default function DocsPage() {
  const sections = [
    {
      title: "Getting Started",
      description: "Learn the basics and get up and running efficiently",
      icon: Book,
      articles: [
        "Essential Start Guide",
        "Understanding the 7D Parameter Engine",
        "Your First Prompt Generation",
        "Module Selection Guide",
      ],
    },
    {
      title: "API Reference",
      description: "Complete API documentation for Enterprise users",
      icon: Code,
      articles: ["Authentication", "POST /api/run/{moduleId}", "Response Format", "Rate Limits & Quotas"],
    },
    {
      title: "Advanced Features",
      description: "Master the advanced capabilities of PromptForge",
      icon: Book,
      articles: ["Custom Module Creation", "Batch Processing", "Export Formats", "Team Collaboration"],
    },
  ]

  return (
    <div className="min-h-screen text-white relative z-10">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 font-serif">Documentation</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to master PromptForge and build better prompts
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500/20"
            />
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <Card key={index} className="bg-zinc-900/80 border border-zinc-700 hover:border-yellow-500/30 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-yellow-500">
                    <Icon className="w-6 h-6" />
                    {section.title}
                  </CardTitle>
                  <p className="text-gray-400">{section.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.articles.map((article, articleIndex) => (
                      <li key={articleIndex}>
                        <Link
                          href={`/docs/${article.toLowerCase().replace(/\s+/g, "-")}`}
                          className="text-gray-300 hover:text-yellow-500 transition-colors flex items-center gap-2"
                        >
                          <ArrowRight className="w-3 h-3" />
                          {article}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Essential Links */}
        <div className="bg-zinc-900/80 border border-zinc-700 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Need Help?</h2>
          <p className="text-gray-400 mb-6">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button asChild variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black">
              <Link href="/guides">Browse Guides</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
