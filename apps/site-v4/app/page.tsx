import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full floating"></div>
          <div
            className="absolute top-1/3 right-1/3 w-1 h-1 bg-accent rounded-full floating"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-primary/50 rounded-full floating"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 right-1/4 w-1 h-1 bg-accent rounded-full floating"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 neon-text text-primary font-mono text-balance">
            Your operational prompt engine.
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground font-mono leading-relaxed">
            50 modules. 7 vectors. Export in under 60 seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-black font-mono text-lg px-8 py-4 neon-text"
            >
              Start the Forge
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400 font-mono text-lg px-8 py-4 bg-transparent"
            >
              Browse Modules
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm font-mono">
            <Badge variant="outline" className="border-primary/50 text-primary">
              TTA &lt; 60s
            </Badge>
            <Badge variant="outline" className="border-primary/50 text-primary">
              AI Score ≥ 80
            </Badge>
            <Badge variant="outline" className="border-primary/50 text-primary">
              Export .md/.json/.pdf
            </Badge>
          </div>
        </div>

        {/* Geometric Shapes */}
        <div className="absolute top-20 left-20 w-20 h-20 border-2 border-primary/30 rotate-45 floating"></div>
        <div
          className="absolute bottom-20 right-20 w-16 h-16 border-2 border-accent/30 rotate-12 floating"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-primary font-mono neon-text">How It Works</h2>
            <p className="text-xl text-muted-foreground font-mono">You don't write prompts. You configure systems.</p>
            <p className="text-lg text-muted-foreground font-mono mt-2">Three steps, always the same:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 text-center">
              <div className="text-3xl font-mono text-primary mb-4 neon-text">01</div>
              <h3 className="text-xl font-mono text-accent mb-4">Set 7-D Parameters</h3>
              <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                domain, scale, urgency, complexity, resources, application, output.
              </p>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 text-center">
              <div className="text-3xl font-mono text-primary mb-4 neon-text">02</div>
              <h3 className="text-xl font-mono text-accent mb-4">Run a Module</h3>
              <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                each module is a micro-service with KPIs and guardrails.
              </p>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 text-center">
              <div className="text-3xl font-mono text-primary mb-4 neon-text">03</div>
              <h3 className="text-xl font-mono text-accent mb-4">Export Artifacts</h3>
              <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                .md, .json, .pdf with manifest and checksum.
              </p>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-lg font-mono text-foreground mb-4">Result: repeatable, audit-ready outputs.</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-card/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary font-mono neon-text text-balance">
            Modules Grid
          </h2>
          <p className="text-xl text-muted-foreground font-mono mb-4">50 operational modules.</p>
          <p className="text-lg text-muted-foreground font-mono mb-8">
            From strategic planning (M01) to crisis response (M50).
            <br />
            Pick, run, export.
          </p>
          <Button
            variant="outline"
            size="lg"
            className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400 font-mono text-lg px-8 py-4 bg-transparent"
          >
            👉 Browse the full module library
          </Button>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-primary font-mono neon-text">Why PromptForge™</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 text-center">
              <h3 className="text-lg font-mono text-accent mb-3 neon-text">Predictable</h3>
              <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                every output scored ≥80 by the Test Engine.
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 text-center">
              <h3 className="text-lg font-mono text-accent mb-3 neon-text">Repeatable</h3>
              <p className="text-sm text-muted-foreground font-mono leading-relaxed">same cut, every time.</p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 text-center">
              <h3 className="text-lg font-mono text-accent mb-3 neon-text">Verifiable</h3>
              <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                export with manifest + checksum.
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 text-center">
              <h3 className="text-lg font-mono text-accent mb-3 neon-text">On-brand</h3>
              <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                built-in linter enforces your voice.
              </p>
            </Card>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-black font-mono text-lg px-8 py-4 neon-text"
            >
              👉 Start the Forge
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-card/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-primary font-mono neon-text">Testimonials</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
              <p className="text-muted-foreground font-mono text-sm leading-relaxed mb-4">
                "PromptForge cut our campaign prep from 3 weeks to 3 days. Every deliverable came out client-ready."
              </p>
              <p className="text-accent font-mono text-xs">— Agency Director, New York</p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
              <p className="text-muted-foreground font-mono text-sm leading-relaxed mb-4">
                "The 7-D engine gave us a common language across product, sales, and marketing. Finally, one system
                instead of chaos."
              </p>
              <p className="text-accent font-mono text-xs">— VP Product, SaaS Scaleup, San Francisco</p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
              <p className="text-muted-foreground font-mono text-sm leading-relaxed mb-4">
                "As a solo consultant, I deliver more in hours than I used to in weeks. Clients think I cloned myself."
              </p>
              <p className="text-accent font-mono text-xs">— Independent Consultant, Austin</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-primary font-mono neon-text">Use Cases</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 text-center">
              <h3 className="text-xl font-mono text-accent mb-4 neon-text">Agencies</h3>
              <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                package prompts as client deliverables with KPIs.
              </p>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 text-center">
              <h3 className="text-xl font-mono text-accent mb-4 neon-text">Educators</h3>
              <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                export branded playbooks and handouts in minutes.
              </p>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 text-center">
              <h3 className="text-xl font-mono text-accent mb-4 neon-text">Founders</h3>
              <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                test, validate, and ship faster with verified artifacts.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-card/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-primary font-mono neon-text">Pricing</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
              <h3 className="text-xl font-mono text-accent mb-2 neon-text">Pilot</h3>
              <p className="text-sm text-muted-foreground font-mono mb-4">"Ship the core"</p>
              <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                → Generator + 12 starter modules + export .md
              </p>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 ring-2 ring-primary/50">
              <h3 className="text-xl font-mono text-accent mb-2 neon-text">Pro</h3>
              <p className="text-sm text-muted-foreground font-mono mb-4">"Ship at scale"</p>
              <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                → All modules + Test Engine live + export .json/.pdf
              </p>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
              <h3 className="text-xl font-mono text-accent mb-2 neon-text">Enterprise</h3>
              <p className="text-sm text-muted-foreground font-mono mb-4">"Ship with governance"</p>
              <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                → Custom modules, API hooks, audit-grade exports
              </p>
            </Card>
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              size="lg"
              className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400 font-mono text-lg px-8 py-4 bg-transparent"
            >
              👉 View Pricing
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary font-mono neon-text text-balance">
            Stop brainstorming. Start exporting.
          </h2>
          <p className="text-xl text-muted-foreground font-mono mb-4">This is not ChatGPT.</p>
          <p className="text-2xl text-foreground font-mono mb-8 neon-text">This is PromptForge™.</p>
          <Button
            size="lg"
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-mono text-xl px-12 py-6 neon-text"
          >
            👉 Start the Forge
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground font-mono">{'> system.status: "poetry.exe running successfully"'}</p>
          <p className="text-sm text-muted-foreground/60 mt-2 font-mono">
            Crafted in the digital realm • Where bytes become verses
          </p>
        </div>
      </footer>
    </div>
  )
}
