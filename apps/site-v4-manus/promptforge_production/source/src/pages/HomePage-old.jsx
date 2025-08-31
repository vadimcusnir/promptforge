import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, 
  Target, 
  Download, 
  Shield, 
  Clock, 
  BarChart3,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Code,
  Globe,
  Users,
  Settings,
  FileText,
  Briefcase,
  GraduationCap,
  Rocket,
  Star
} from 'lucide-react'

const HomePage = () => {
  const moduleHighlights = [
    {
      title: 'Strategic Framework',
      description: 'Build comprehensive frameworks for business planning',
      difficulty: 'Intermediate',
      score: 85,
      vector: 'Strategic'
    },
    {
      title: 'Content Strategy',
      description: 'Design data-driven content strategies with performance KPIs',
      difficulty: 'Advanced',
      score: 92,
      vector: 'Content'
    },
    {
      title: 'Crisis Management',
      description: 'Emergency response protocols and communication strategies',
      difficulty: 'Expert',
      score: 88,
      vector: 'Crisis'
    },
    {
      title: 'Analytics Engine',
      description: 'Performance metrics and data visualization frameworks',
      difficulty: 'Advanced',
      score: 90,
      vector: 'Analytics'
    },
    {
      title: 'Brand Architecture',
      description: 'Comprehensive brand system design and positioning',
      difficulty: 'Expert',
      score: 94,
      vector: 'Branding'
    },
    {
      title: 'Sales Optimization',
      description: 'Conversion funnel analysis and sales process improvement',
      difficulty: 'Intermediate',
      score: 87,
      vector: 'Sales'
    }
  ]

  const useCases = [
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: 'Agencies',
      description: 'Deliver client-ready artifacts with KPIs.',
      color: 'text-blue-400'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Consultants',
      description: 'Turn prompts into repeatable playbooks.',
      color: 'text-green-400'
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: 'Educators',
      description: 'Export branded handouts & training packs.',
      color: 'text-purple-400'
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Founders',
      description: 'Test, validate & ship faster with 7-D scoring.',
      color: 'text-orange-400'
    }
  ]

  const testimonials = [
    {
      quote: "Cut prep from 3 weeks to 3 days.",
      author: "Agency Director",
      location: "San Francisco",
      avatar: "AD"
    },
    {
      quote: "Clients pay more when outputs are audit-ready.",
      author: "Consultant",
      location: "Austin",
      avatar: "CO"
    },
    {
      quote: "Finally, a prompt system, not chaos.",
      author: "Product Lead",
      location: "New York",
      avatar: "PL"
    }
  ]

  const faqItems = [
    {
      question: "Can I change plans anytime?",
      answer: "Yes, instantly."
    },
    {
      question: "Do you accept all cards?",
      answer: "Yes, via Stripe."
    },
    {
      question: "Is there a trial?",
      answer: "Free plan + 14-day trial on paid tiers."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, access stays until billing ends."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="block text-gradient-primary">Your operational</span>
              <span className="block text-gradient-primary">prompt engine.</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto">
              50 modules. 7 vectors. Verified exports in under 60 seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/generator">
                <Button size="lg" className="btn-primary text-lg px-8 py-4">
                  Start the Forge
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/modules">
                <Button size="lg" variant="outline" className="btn-outline text-lg px-8 py-4">
                  Browse Modules
                  <Code className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Proof Bar */}
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">TTA &lt; 60s</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">AI Score ≥ 80</span>
              </div>
              <div className="flex items-center space-x-2">
                <Download className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Export .md/.json/.pdf</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Social Proof Indicators */}
      <section className="py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              Backed by SaaS founders • Used by consultants • Trusted in early enterprise pilots
            </p>
          </div>
        </div>
      </section>

      {/* 3. How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Stop improvising prompts. Start forging systems.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="card-industrial text-center">
              <div className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Settings className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Configure 7-D</h3>
                <p className="text-muted-foreground">
                  Domain, scale, urgency, complexity, resources, application, output.
                </p>
              </div>
            </Card>

            <Card className="card-industrial text-center">
              <div className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Run a Module</h3>
                <p className="text-muted-foreground">
                  Every module scored with KPIs + guardrails.
                </p>
              </div>
            </Card>

            <Card className="card-industrial text-center">
              <div className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Download className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Export</h3>
                <p className="text-muted-foreground">
                  .md/.json/.pdf with manifest + checksum.
                </p>
              </div>
            </Card>
          </div>

          <div className="text-center">
            <Link to="/generator">
              <Button className="btn-primary">
                Try the Generator
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Module Highlights */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Explore 50 operational modules</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {moduleHighlights.map((module, index) => (
              <Card key={index} className="card-industrial">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge className="badge-primary">{module.vector}</Badge>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Score</div>
                      <div className="text-lg font-bold text-primary">{module.score}%</div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                  <p className="text-muted-foreground mb-4">{module.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{module.difficulty}</Badge>
                    <Button size="sm" className="btn-outline">
                      Use Module
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/modules">
              <Button className="btn-primary">
                Browse All Modules
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Use Cases */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built for the way you work</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="card-industrial text-center">
                <div className="p-6">
                  <div className={`${useCase.color} mb-4 flex justify-center`}>
                    {useCase.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                  <p className="text-muted-foreground">{useCase.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What early users are saying</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-industrial">
                <div className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-lg mb-4 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Pricing Inline Summary */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose your plan</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="card-industrial">
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">Free</h3>
                <p className="text-muted-foreground mb-4">.txt only, 3 core modules</p>
                <Button className="btn-outline w-full">Get Started</Button>
              </div>
            </Card>

            <Card className="card-industrial ring-2 ring-primary">
              <div className="p-6 text-center">
                <Badge className="badge-primary mb-2">Most Popular</Badge>
                <h3 className="text-xl font-semibold mb-2">Creator</h3>
                <p className="text-muted-foreground mb-4">.txt + .md</p>
                <Button className="btn-primary w-full">Start Trial</Button>
              </div>
            </Card>

            <Card className="card-industrial">
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">Pro</h3>
                <p className="text-muted-foreground mb-4">.txt + .md + .json + .pdf, Test Engine Live</p>
                <Button className="btn-outline w-full">Upgrade</Button>
              </div>
            </Card>

            <Card className="card-industrial">
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                <p className="text-muted-foreground mb-4">All formats + .zip bundles, API, white-label</p>
                <Button className="btn-outline w-full">Contact Sales</Button>
              </div>
            </Card>
          </div>

          <div className="text-center">
            <Link to="/pricing">
              <Button className="btn-primary">
                View Full Pricing
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {faqItems.map((faq, index) => (
              <Card key={index} className="card-industrial">
                <div className="p-6">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Closing CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Stop brainstorming. Start exporting.</h2>
          <Link to="/generator">
            <Button size="lg" className="btn-primary text-lg px-8 py-4">
              Start the Forge
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage

