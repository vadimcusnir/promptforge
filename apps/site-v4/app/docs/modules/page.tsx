import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Target, Brain, Layers, Eye, Sparkles, Database, Shield, Star, Clock, ArrowRight } from "lucide-react"

export default function ModulesPage() {
  const vectors = [
    {
      id: 1,
      name: "Strategic",
      icon: Target,
      color: "text-blue-400",
      description: "Planning, operations, and business strategy modules",
      modules: [
        "M01: PromptForge™ v3.0.SOPFORGE™",
        "M09: Post-Purchase Subscription Engine",
        "M11: Funnel Nota Doi",
        "M12: Diagnostic Vizibilitate",
      ],
      count: 12,
    },
    {
      id: 2,
      name: "Retoric",
      icon: Brain,
      color: "text-purple-400",
      description: "Persuasion, messaging, and communication modules",
      modules: [
        "M02: PromptForge™ v3.0.LATENTMAP™",
        "M03: Codul 7:1™",
        "M06: Agentic GPT Sales",
        "M07: Risk & Trust Reversal",
      ],
      count: 8,
    },
    {
      id: 3,
      name: "Content",
      icon: Layers,
      color: "text-green-400",
      description: "Content creation, optimization, and management modules",
      modules: ["M16: HeyGen AI Clone", "M17: Sora Shot-by-Shot", "M18: Carusele RFA", "M19: Rescriere după algoritm"],
      count: 10,
    },
    {
      id: 4,
      name: "Cognitive",
      icon: Eye,
      color: "text-yellow-400",
      description: "Analysis, insights, and cognitive processing modules",
      modules: ["M05: ORAKON Memory Grid", "M13: Pricing Psychology", "M26: JTBD Matrix", "M27: Schwartz Ladder"],
      count: 6,
    },
    {
      id: 5,
      name: "Memetic",
      icon: Sparkles,
      color: "text-pink-400",
      description: "Brand, culture, and memetic engineering modules",
      modules: [
        "M04: Dicționarul Semiotic 8VULTUS™",
        "M36: Semiotic Brand Architecture",
        "M37: Ritual de Inițiere pentru The Architect",
      ],
      count: 4,
    },
    {
      id: 6,
      name: "Data",
      icon: Database,
      color: "text-cyan-400",
      description: "Analytics, metrics, and data processing modules",
      modules: [
        "M10: Zero-Party Data OS",
        "M31: Closed-Loop Telemetry",
        "M32: Cohort Experiments",
        "M33: Lead Scoring Model",
      ],
      count: 7,
    },
    {
      id: 7,
      name: "Crisis",
      icon: Shield,
      color: "text-red-400",
      description: "Risk management, crisis response, and reputation modules",
      modules: [
        "M24: PR Personal",
        "M41: Agent de Criză PR",
        "M42: Contra-cadru mediatic",
        "M43: Politica de Transparență",
      ],
      count: 3,
    },
  ]

  const featuredModules = [
    {
      code: "M01",
      name: "PromptForge™ v3.0.SOPFORGE™",
      description: "Transformă un subiect definit în SOP standardizat, cu telemetrie și criterii de acceptare",
      vector: "Strategic",
      difficulty: "Advanced",
      score: 87,
      time: "5-10 min",
      plan: "Pilot",
    },
    {
      code: "M10",
      name: "Zero-Party Data OS",
      description: "Sistem operațional pentru colectarea datelor zero-party",
      vector: "Data",
      difficulty: "Expert",
      score: 93,
      time: "13-19 min",
      plan: "Pilot",
    },
    {
      code: "M50",
      name: "Sistemul CUSNIR.OS™",
      description: "Sistemul operațional CUSNIR complet",
      vector: "Strategic",
      difficulty: "Expert",
      score: 97,
      time: "17-23 min",
      plan: "Enterprise",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 font-mono neon-text">Module Library</h1>
          <p className="text-xl text-muted-foreground font-mono leading-relaxed mb-8">
            50 industrial-grade modules organized into 7 vectors. Each module is a micro-service with KPIs and
            guardrails.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm font-mono">
            <Badge variant="outline" className="border-primary/50 text-primary">
              50 Total Modules
            </Badge>
            <Badge variant="outline" className="border-primary/50 text-primary">
              7 Vector Categories
            </Badge>
            <Badge variant="outline" className="border-primary/50 text-primary">
              AI Score ≥ 80
            </Badge>
          </div>
        </div>
      </section>

      {/* Vector Overview */}
      <section className="py-20 px-6 bg-card/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-primary mb-12 text-center font-mono neon-text">Vector Categories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vectors.map((vector) => {
              const IconComponent = vector.icon
              return (
                <Card
                  key={vector.id}
                  className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                        <IconComponent className={`w-5 h-5 ${vector.color}`} />
                      </div>
                      <Badge variant="outline" className="border-primary/50 text-primary font-mono text-xs">
                        {vector.count} modules
                      </Badge>
                    </div>
                    <CardTitle className="text-foreground font-mono text-lg group-hover:text-primary transition-colors">
                      {vector.name}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground font-mono text-sm">
                      {vector.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 mb-4">
                      {vector.modules.slice(0, 3).map((module) => (
                        <li key={module} className="text-muted-foreground font-mono text-xs">
                          <span className="text-primary">•</span> {module}
                        </li>
                      ))}
                      {vector.modules.length > 3 && (
                        <li className="text-muted-foreground font-mono text-xs">
                          <span className="text-primary">•</span> +{vector.modules.length - 3} more...
                        </li>
                      )}
                    </ul>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-primary hover:bg-primary/10 font-mono text-xs"
                    >
                      View All Modules
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Modules */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-primary mb-12 text-center font-mono neon-text">Featured Modules</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {featuredModules.map((module) => (
              <Card
                key={module.code}
                className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-primary text-primary font-mono text-xs">
                        {module.code}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-secondary/20 text-secondary-foreground font-mono text-xs"
                      >
                        {module.vector}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-primary font-mono text-lg font-bold">
                        <Star className="w-4 h-4 mr-1" />
                        {module.score}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-foreground font-mono text-lg group-hover:text-primary transition-colors leading-tight">
                    {module.name}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground font-mono text-sm leading-relaxed">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center text-muted-foreground font-mono">
                        <Clock className="w-3 h-3 mr-1" />
                        {module.time}
                      </div>
                      <Badge variant="outline" className="border-border text-muted-foreground font-mono">
                        {module.difficulty}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="border-primary/50 text-primary font-mono">
                      {module.plan}+
                    </Badge>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-sm">
                    Run Module
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Module Usage Guide */}
      <section className="py-20 px-6 bg-card/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-primary mb-12 text-center font-mono neon-text">How to Use Modules</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-mono font-bold text-lg">1</span>
                </div>
                <h3 className="text-foreground font-mono font-bold mb-2">Select Module</h3>
                <p className="text-muted-foreground font-mono text-sm">
                  Browse by vector or search for specific functionality
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-mono font-bold text-lg">2</span>
                </div>
                <h3 className="text-foreground font-mono font-bold mb-2">Configure 7D</h3>
                <p className="text-muted-foreground font-mono text-sm">
                  Set parameters for domain, scale, urgency, and more
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-mono font-bold text-lg">3</span>
                </div>
                <h3 className="text-foreground font-mono font-bold mb-2">Export Results</h3>
                <p className="text-muted-foreground font-mono text-sm">
                  Download in multiple formats with quality guarantees
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
