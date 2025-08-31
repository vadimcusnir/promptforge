import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Play, Download, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function GettingStartedPage() {
  const steps = [
    {
      step: "01",
      title: "Create Your Account",
      description: "Sign up for PromptForge™ and choose your plan",
      details: [
        "Visit chatgpt-prompting.com and click 'Sign Up'",
        "Choose between Free, Creator, Pro, or Enterprise",
        "Verify your email address",
        "Complete your profile setup",
      ],
      time: "2 minutes",
    },
    {
      step: "02",
      title: "Configure 7D Framework",
      description: "Set up your first 7-dimensional parameter set",
      details: [
        "Navigate to the Generator page",
        "Select your domain (FIN, ECOM, EDU, etc.)",
        "Configure scale, urgency, and complexity",
        "Set resources, application, and output format",
      ],
      time: "5 minutes",
    },
    {
      step: "03",
      title: "Run Your First Module",
      description: "Execute a module and generate your first prompt",
      details: [
        "Browse the Module Library",
        "Select a starter module (M01-M12)",
        "Provide context and requirements",
        "Click 'Generate' and review results",
      ],
      time: "3 minutes",
    },
    {
      step: "04",
      title: "Export Your Results",
      description: "Download your generated prompts in various formats",
      details: [
        "Review quality metrics and AI score",
        "Choose export format (.txt, .md, .pdf, .json)",
        "Download with manifest and checksum",
        "Save to your project library",
      ],
      time: "1 minute",
    },
  ]

  const concepts = [
    {
      title: "7D Framework",
      description: "Seven-dimensional parameter system for precise prompt configuration",
      details: [
        "Domain: Industry vertical (FIN, ECOM, EDU, etc.)",
        "Scale: Project scope (solo, team, org, market)",
        "Urgency: Timeline pressure (low, normal, high, crisis)",
        "Complexity: Technical difficulty level",
        "Resources: Available assets and constraints",
        "Application: Use case category",
        "Output: Desired format and structure",
      ],
    },
    {
      title: "Module System",
      description: "50 industrial-grade modules organized into 7 vectors",
      details: [
        "Strategic (M01-M12): Planning and operations",
        "Retoric (M13-M20): Persuasion and messaging",
        "Content (M21-M30): Creation and optimization",
        "Cognitive (M31-M38): Analysis and insights",
        "Memetic (M39-M42): Brand and culture",
        "Data (M43-M47): Analytics and metrics",
        "Crisis (M48-M50): Risk and reputation management",
      ],
    },
    {
      title: "Quality Scoring",
      description: "AI-powered quality assessment with guaranteed thresholds",
      details: [
        "Clarity: How well-defined and understandable",
        "Execution: Actionability and implementation",
        "Business Fit: Alignment with objectives",
        "Ambiguity Score: Inverse measure of confusion",
        "Overall Score: Weighted composite metric",
        "Plan Guarantees: Free (Standard), Creator (≥75), Pro (≥80), Enterprise (≥85)",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 font-mono neon-text">Getting Started</h1>
            <p className="text-xl text-muted-foreground font-mono leading-relaxed">
              Master PromptForge™ in 4 simple steps. From setup to your first export in under 15 minutes.
            </p>
          </div>

          {/* Quick Start Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <Card
                key={step.step}
                className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-mono font-bold text-lg">{step.step}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-foreground font-mono">{step.title}</CardTitle>
                        <Badge variant="outline" className="border-primary/50 text-primary font-mono text-xs">
                          {step.time}
                        </Badge>
                      </div>
                      <CardDescription className="text-muted-foreground font-mono">{step.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 ml-16">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start text-muted-foreground font-mono text-sm">
                        <CheckCircle className="w-4 h-4 text-primary mr-3 flex-shrink-0 mt-0.5" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Core Concepts */}
      <section className="py-20 px-6 bg-card/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-primary mb-12 text-center font-mono neon-text">Core Concepts</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {concepts.map((concept) => (
              <Card
                key={concept.title}
                className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-foreground font-mono">{concept.title}</CardTitle>
                  <CardDescription className="text-muted-foreground font-mono text-sm">
                    {concept.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {concept.details.map((detail, index) => (
                      <li key={index} className="text-muted-foreground font-mono text-sm leading-relaxed">
                        <span className="text-primary">•</span> {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary mb-6 font-mono neon-text">Ready to Start?</h2>
          <p className="text-xl text-muted-foreground font-mono mb-8">
            You're all set! Choose your next step to dive deeper into PromptForge™.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <Play className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-foreground font-mono font-bold mb-2">Try the Generator</h3>
                <p className="text-muted-foreground font-mono text-sm mb-4">
                  Jump right in and generate your first prompt
                </p>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono" asChild>
                  <Link href="/generator">
                    Start Generating
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <Download className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-foreground font-mono font-bold mb-2">Browse Modules</h3>
                <p className="text-muted-foreground font-mono text-sm mb-4">Explore all 50 industrial modules</p>
                <Button
                  variant="outline"
                  className="border-primary/50 text-primary hover:bg-primary/10 font-mono bg-transparent"
                  asChild
                >
                  <Link href="/modules">
                    View Modules
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-foreground font-mono font-bold mb-2">API Integration</h3>
                <p className="text-muted-foreground font-mono text-sm mb-4">Integrate with your existing workflow</p>
                <Button
                  variant="outline"
                  className="border-primary/50 text-primary hover:bg-primary/10 font-mono bg-transparent"
                  asChild
                >
                  <Link href="/docs/api">
                    View API Docs
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
