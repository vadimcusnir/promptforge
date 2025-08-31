import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight, User } from "lucide-react"
import Link from "next/link"

const blogPosts = [
  {
    id: "industrial-prompting-manifesto",
    title: "The Industrial Prompting Manifesto: Why Systems Beat Conversations",
    excerpt:
      "The future of AI belongs to systems, not conversations. Discover how PromptForge™ is transforming ad-hoc prompting into industrial-grade processes with predictable, repeatable, and verifiable outputs.",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Philosophy",
    author: "Alex Cusnir",
    tags: ["Industrial AI", "Prompt Engineering", "Systems Thinking"],
    featured: true,
  },
  {
    id: "7d-framework-complete-guide",
    title: "The 7-D Framework: Complete Guide to Dimensional Prompt Engineering",
    excerpt:
      "Master the seven dimensions that make prompts predictable and scalable. A comprehensive technical exploration of domain, scale, urgency, complexity, resources, application, and output parameters.",
    date: "2024-01-12",
    readTime: "12 min read",
    category: "Technical",
    author: "Dr. Sarah Chen",
    tags: ["7D Framework", "Prompt Engineering", "Technical Guide"],
    featured: true,
  },
  {
    id: "50-modules-case-studies",
    title: "50 Modules in Action: Real-World Case Studies and ROI Analysis",
    excerpt:
      "How agencies reduced campaign prep from 3 weeks to 3 days. How consultants deliver more in hours than they used to in weeks. Real case studies with measurable ROI from PromptForge™ implementations.",
    date: "2024-01-10",
    readTime: "15 min read",
    category: "Case Studies",
    author: "Marcus Rodriguez",
    tags: ["Case Studies", "ROI", "Business Impact"],
    featured: true,
  },
  {
    id: "ai-score-quality-metrics",
    title: "Understanding AI Score: Quality Metrics That Actually Matter",
    excerpt:
      "Not all AI outputs are created equal. Learn how PromptForge™ measures clarity, execution, business fit, and ambiguity to guarantee quality scores ≥80 for Pro users and ≥85 for Enterprise.",
    date: "2024-01-08",
    readTime: "10 min read",
    category: "Technical",
    author: "Dr. Emily Watson",
    tags: ["Quality Metrics", "AI Scoring", "Performance"],
    featured: false,
  },
  {
    id: "crisis-management-modules",
    title: "Crisis Management in the AI Age: M41-M50 Deep Dive",
    excerpt:
      "When reputation is on the line, you need more than ChatGPT. Explore PromptForge™'s crisis management modules: from PR response to media counter-narratives and ethical guardrails.",
    date: "2024-01-05",
    readTime: "11 min read",
    category: "Crisis Management",
    author: "Jennifer Park",
    tags: ["Crisis Management", "PR", "Risk Management"],
    featured: false,
  },
]

const categories = [
  { name: "All", count: blogPosts.length },
  { name: "Philosophy", count: blogPosts.filter((p) => p.category === "Philosophy").length },
  { name: "Technical", count: blogPosts.filter((p) => p.category === "Technical").length },
  { name: "Case Studies", count: blogPosts.filter((p) => p.category === "Case Studies").length },
  { name: "Crisis Management", count: blogPosts.filter((p) => p.category === "Crisis Management").length },
]

export default function BlogPage() {
  const featuredPosts = blogPosts.filter((post) => post.featured)
  const regularPosts = blogPosts.filter((post) => !post.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/50 font-mono">Blog</Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 font-mono neon-text">
            The <span className="text-accent">Forge</span> Journal
          </h1>
          <p className="text-xl text-muted-foreground font-mono max-w-3xl mx-auto leading-relaxed">
            Insights, case studies, and deep dives into the future of industrial AI prompting. Where systems thinking
            meets practical implementation.
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-10 px-6 bg-card/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/10 font-mono bg-transparent"
              >
                {category.name}
                <Badge variant="secondary" className="ml-2 bg-primary/20 text-primary font-mono text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-primary mb-12 text-center font-mono neon-text">Featured Articles</h2>
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {featuredPosts.map((post) => (
              <Card
                key={post.id}
                className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group"
              >
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg mb-4 flex items-center justify-center">
                  <div className="text-primary/60 font-mono text-sm">Featured Article Cover</div>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="border-primary/50 text-primary font-mono text-xs">
                      {post.category}
                    </Badge>
                    <div className="flex items-center text-muted-foreground text-xs font-mono">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="text-foreground font-mono text-lg group-hover:text-primary transition-colors leading-tight">
                    <Link href={`/blog/${post.id}`}>{post.title}</Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-mono text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs mb-4">
                    <div className="flex items-center text-muted-foreground font-mono">
                      <User className="w-3 h-3 mr-1" />
                      {post.author}
                    </div>
                    <div className="flex items-center text-muted-foreground font-mono">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-muted text-muted-foreground font-mono text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Link href={`/blog/${post.id}`}>
                    <Button variant="ghost" className="w-full text-primary hover:bg-primary/10 font-mono text-sm">
                      Read Article
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Regular Posts */}
      <section className="py-20 px-6 bg-card/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-primary mb-12 text-center font-mono neon-text">Latest Articles</h2>
          <div className="space-y-8">
            {regularPosts.map((post) => (
              <Card
                key={post.id}
                className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                <div className="md:flex">
                  <div className="md:w-1/3 aspect-video md:aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-l-lg flex items-center justify-center">
                    <div className="text-primary/40 font-mono text-sm">Article Cover</div>
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className="border-primary/50 text-primary font-mono text-xs">
                        {post.category}
                      </Badge>
                      <div className="flex items-center text-muted-foreground text-xs font-mono space-x-4">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {post.readTime}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-foreground hover:text-primary transition-colors mb-3 font-mono">
                      <Link href={`/blog/${post.id}`}>{post.title}</Link>
                    </h3>
                    <p className="text-muted-foreground font-mono text-sm leading-relaxed mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-muted-foreground text-xs font-mono">
                        <User className="w-3 h-3 mr-1" />
                        {post.author}
                      </div>
                      <Link href={`/blog/${post.id}`}>
                        <Button
                          variant="ghost"
                          className="text-primary hover:text-primary/80 hover:bg-primary/10 p-0 font-mono text-sm"
                        >
                          Read More
                          <ArrowRight className="ml-2 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm border-border text-center">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold text-primary mb-4 font-mono neon-text">Stay in the Loop</h3>
              <p className="text-muted-foreground font-mono mb-8 leading-relaxed">
                Get the latest insights on industrial AI prompting, case studies, and PromptForge™ updates delivered to
                your inbox. No spam, just value.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground font-mono text-sm"
                />
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono">Subscribe</Button>
              </div>
              <p className="text-muted-foreground font-mono text-xs mt-4">
                Join 2,500+ professionals already subscribed
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
