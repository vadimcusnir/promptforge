import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Code, Zap, Shield, Users, ArrowRight, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function DocsPage() {
  const sections = [
    {
      title: "Getting Started",
      description: "Quick start guide and basic concepts",
      icon: BookOpen,
      href: "/docs/getting-started",
      badge: "Essential",
      items: ["Installation", "First Module", "7D Framework", "Basic Exports"],
    },
    {
      title: "API Reference",
      description: "Complete API documentation and SDKs",
      icon: Code,
      href: "/docs/api",
      badge: "Technical",
      items: ["REST Endpoints", "Authentication", "SDKs", "Rate Limits"],
    },
    {
      title: "Module Library",
      description: "All 50 modules with examples and use cases",
      icon: Zap,
      href: "/docs/modules",
      badge: "Core",
      items: ["Strategic Modules", "Content Modules", "Crisis Modules", "Custom Modules"],
    },
    {
      title: "Security & Compliance",
      description: "Security measures and compliance information",
      icon: Shield,
      href: "/docs/security",
      badge: "Enterprise",
      items: ["Data Protection", "GDPR Compliance", "SOC 2", "Audit Logs"],
    },
    {
      title: "Team Management",
      description: "User management and collaboration features",
      icon: Users,
      href: "/docs/teams",
      badge: "Pro+",
      items: ["User Roles", "Permissions", "Collaboration", "Billing"],
    },
  ]

  const quickLinks = [
    { title: "7D Framework Guide", href: "/docs/7d-framework" },
    { title: "Module Execution", href: "/docs/execution" },
    { title: "Export Formats", href: "/docs/exports" },
    { title: "Quality Scoring", href: "/docs/quality" },
    { title: "Troubleshooting", href: "/docs/troubleshooting" },
    { title: "FAQ", href: "/docs/faq" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 font-mono neon-text">Documentation</h1>
          <p className="text-xl text-muted-foreground font-mono mb-8 leading-relaxed">
            Everything you need to master PromptForge™. From basic concepts to advanced integrations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono" asChild>
              <Link href="/docs/getting-started">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary/50 text-primary hover:bg-primary/10 font-mono bg-transparent"
              asChild
            >
              <Link href="/docs/api">
                API Reference
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Sections */}
      <section className="py-20 px-6 bg-card/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-primary mb-12 text-center font-mono neon-text">
            Documentation Sections
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section) => {
              const IconComponent = section.icon
              return (
                <Card
                  key={section.title}
                  className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <Badge variant="outline" className="border-primary/50 text-primary font-mono text-xs">
                        {section.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-foreground font-mono group-hover:text-primary transition-colors">
                      {section.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground font-mono text-sm">
                      {section.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {section.items.map((item) => (
                        <li key={item} className="flex items-center text-muted-foreground font-mono text-sm">
                          <div className="w-1 h-1 bg-primary rounded-full mr-3"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button variant="ghost" className="w-full text-primary hover:bg-primary/10 font-mono" asChild>
                      <Link href={section.href}>
                        Explore Section
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-primary mb-12 text-center font-mono neon-text">Quick Links</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link) => (
              <Card
                key={link.title}
                className="bg-card/30 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 group"
              >
                <CardContent className="p-4">
                  <Link
                    href={link.href}
                    className="flex items-center justify-between text-foreground group-hover:text-primary transition-colors"
                  >
                    <span className="font-mono text-sm">{link.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 px-6 bg-card/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary mb-6 font-mono neon-text">Need Help?</h2>
          <p className="text-xl text-muted-foreground font-mono mb-8">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono" asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary/50 text-primary hover:bg-primary/10 font-mono bg-transparent"
              asChild
            >
              <Link href="/docs/faq">View FAQ</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
