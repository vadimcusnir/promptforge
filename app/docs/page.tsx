import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Book, Code, Zap, ArrowRight, Search } from "lucide-react"
import Link from "next/link"

export default function DocsPage() {
  const sections = [
    {
      title: "Getting Started",
      description: "Learn the basics of PromptForge and create your first prompt",
      icon: Zap,
      articles: [
        "Quick Start Guide",
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
    <div className="min-h-screen bg-[#0e0e0e] text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 font-montserrat">Documentation</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-open-sans">
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
              className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-gold-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <Card key={index} className="bg-gray-900/30 border-gray-800 hover:border-gold-400/30 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-gold-400 font-montserrat">
                    <Icon className="w-6 h-6" />
                    {section.title}
                  </CardTitle>
                  <p className="text-gray-400 font-open-sans">{section.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.articles.map((article, articleIndex) => (
                      <li key={articleIndex}>
                        <Link
                          href={`/docs/${article.toLowerCase().replace(/\s+/g, "-")}`}
                          className="text-gray-300 hover:text-gold-400 transition-colors flex items-center gap-2 font-open-sans"
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

        {/* Quick Links */}
        <div className="bg-gray-900/20 border border-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4 font-montserrat">Need Help?</h2>
          <p className="text-gray-400 mb-6 font-open-sans">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-gold-400 hover:bg-gold-500 text-black font-semibold">
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
            >
              <Link href="/guides">View Guides</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
