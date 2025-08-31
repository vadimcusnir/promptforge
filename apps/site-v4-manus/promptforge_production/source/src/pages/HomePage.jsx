import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import '../styles/professional-ui.css'
import { 
  ArrowRight, 
  Zap, 
  Target, 
  Shield, 
  Clock, 
  CheckCircle,
  Star,
  Users,
  TrendingUp,
  Award,
  Rocket,
  BarChart3,
  Layers,
  Code,
  Briefcase,
  Globe,
  Download,
  FileText,
  Package
} from 'lucide-react'

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const modules = [
    {
      id: 'strategic',
      name: 'Strategic Framework',
      description: 'Build comprehensive business strategies',
      difficulty: 'Advanced',
      score: '92%',
      icon: Target,
      color: 'text-blue-400'
    },
    {
      id: 'content',
      name: 'Content Engine',
      description: 'Generate high-converting content',
      difficulty: 'Intermediate',
      score: '88%',
      icon: FileText,
      color: 'text-green-400'
    },
    {
      id: 'crisis',
      name: 'Crisis Management',
      description: 'Handle emergencies with precision',
      difficulty: 'Expert',
      score: '95%',
      icon: Shield,
      color: 'text-red-400'
    },
    {
      id: 'analytics',
      name: 'Analytics & Insights',
      description: 'Data-driven decision making',
      difficulty: 'Intermediate',
      score: '90%',
      icon: BarChart3,
      color: 'text-purple-400'
    },
    {
      id: 'branding',
      name: 'Brand Authority',
      description: 'Build powerful brand presence',
      difficulty: 'Advanced',
      score: '87%',
      icon: Award,
      color: 'text-yellow-400'
    },
    {
      id: 'sales',
      name: 'Sales Accelerator',
      description: 'Optimize conversion funnels',
      difficulty: 'Expert',
      score: '94%',
      icon: TrendingUp,
      color: 'text-cyan-400'
    }
  ]

  const useCases = [
    {
      title: 'Agencies',
      description: 'Deliver client-ready artifacts with KPIs',
      icon: Briefcase,
      benefits: ['Audit-ready outputs', 'Faster delivery', 'Higher margins']
    },
    {
      title: 'Consultants',
      description: 'Turn prompts into repeatable playbooks',
      icon: Users,
      benefits: ['Scalable processes', 'Consistent quality', 'Premium pricing']
    },
    {
      title: 'Educators',
      description: 'Export branded handouts & training packs',
      icon: Globe,
      benefits: ['GDPR compliant', 'Branded materials', 'Easy distribution']
    },
    {
      title: 'Founders',
      description: 'Test, validate & ship faster with 7-D scoring',
      icon: Rocket,
      benefits: ['Rapid validation', 'Data-driven decisions', 'Faster iteration']
    }
  ]

  const testimonials = [
    {
      id: 1,
      text: "Cut prep from 3 weeks to 3 days. PromptForge gave us consistency we couldn't get from ChatGPT alone.",
      author: "Sarah Chen",
      role: "Agency Director",
      location: "San Francisco",
      rating: 5
    },
    {
      id: 2,
      text: "Finally, a system that works. Clients pay more when outputs are audit-ready.",
      author: "Mike Rodriguez",
      role: "Independent Consultant",
      location: "Austin",
      rating: 5
    },
    {
      id: 3,
      text: "The 7-D framework turned our chaotic prompt workflow into a repeatable process. Zero surprises.",
      author: "Emma Thompson",
      role: "Product Lead",
      location: "New York",
      rating: 5
    }
  ]

  const faqItems = [
    {
      question: "Can I change plans anytime?",
      answer: "Yes, instantly. Upgrades and downgrades take effect immediately."
    },
    {
      question: "Do you accept all cards?",
      answer: "Yes, via Stripe. All major credit cards accepted securely."
    },
    {
      question: "Is there a trial?",
      answer: "Free plan + 14-day trial on paid tiers. No credit card required."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, access stays until billing ends. No cancellation fees."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main id="main-content" className="container-safe">
        {/* Hero Section */}
        <section className="section-spacing-lg text-center-pro">
          <div className="container-pro">
            <div className={`fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <h1 className="hero-headline text-gradient-primary">
                Your operational prompt engine.
              </h1>
              
              <p className="subheadline max-w-4xl mx-auto">
                50 modules. 7 vectors. Verified exports in under 60 seconds.
              </p>

              {/* Proof Bar */}
              <div className="flex flex-wrap justify-center items-center gap-6 mb-8 text-sm">
                <div className="flex items-center space-x-2 emphasis-primary">
                  <Clock className="w-4 h-4" />
                  <span>TTA &lt; 60s</span>
                </div>
                <div className="flex items-center space-x-2 emphasis-primary">
                  <Target className="w-4 h-4" />
                  <span>AI Score ≥ 80</span>
                </div>
                <div className="flex items-center space-x-2 emphasis-primary">
                  <Download className="w-4 h-4" />
                  <span>Export .md/.json/.pdf</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link to="/generator" className="btn-primary-pro stagger-1">
                  Start the Forge
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/modules" className="btn-secondary-pro stagger-2">
                  Browse Modules
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="section-padding border-t border-border">
          <div className="text-center mb-12">
            <p className="text-muted-foreground text-sm sm:text-base">
              Backed by SaaS founders • Used by consultants • Trusted in early enterprise pilots
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Stop improvising prompts. Start forging systems.
            </h2>
          </div>

          <div className="grid-responsive max-w-6xl mx-auto">
            <Card className="card-industrial text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Layers className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Configure 7-D</h3>
              <p className="text-muted-foreground leading-relaxed">
                Domain, scale, urgency, complexity, resources, application, output.
              </p>
            </Card>

            <Card className="card-industrial text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Run a Module</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every module scored with KPIs + guardrails.
              </p>
            </Card>

            <Card className="card-industrial text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Export</h3>
              <p className="text-muted-foreground leading-relaxed">
                .md/.json/.pdf with manifest + checksum.
              </p>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link to="/generator">
              <Button className="btn-primary">
                Try the Generator
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Module Highlights */}
        <section className="section-padding border-t border-border">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Explore 50 operational modules
            </h2>
          </div>

          <div className="grid-responsive max-w-6xl mx-auto">
            {modules.map((module) => {
              const IconComponent = module.icon
              return (
                <Card key={module.id} className="card-industrial">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg bg-muted/30 flex items-center justify-center ${module.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <Badge className="badge-primary">{module.score}</Badge>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2">{module.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {module.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {module.difficulty}
                    </Badge>
                    <Link 
                      to={`/modules/${module.id}`}
                      className="text-primary hover:text-primary/80 text-sm font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>

          <div className="text-center mt-8">
            <Link to="/modules">
              <Button variant="outline" className="btn-secondary">
                Browse All Modules
              </Button>
            </Link>
          </div>
        </section>

        {/* Use Cases */}
        <section className="section-padding border-t border-border">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Built for the way you work
            </h2>
          </div>

          <div className="grid-responsive max-w-6xl mx-auto">
            {useCases.map((useCase, index) => {
              const IconComponent = useCase.icon
              return (
                <Card key={index} className="card-industrial">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3">{useCase.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {useCase.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {useCase.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Testimonials */}
        <section className="section-padding border-t border-border">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What early users are saying
            </h2>
          </div>

          <div className="grid-responsive max-w-6xl mx-auto">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="card-industrial">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-muted-foreground mb-4 leading-relaxed">
                  "{testimonial.text}"
                </blockquote>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary font-bold text-sm">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-sm">{testimonial.author}</div>
                    <div className="text-muted-foreground text-xs">
                      {testimonial.role}, {testimonial.location}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="section-padding border-t border-border">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Choose your plan
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="card-industrial text-center">
              <h3 className="font-bold mb-2">Free</h3>
              <p className="text-muted-foreground text-sm mb-4">.txt only, 3 core modules</p>
              <div className="text-2xl font-bold mb-4">$0</div>
              <Button variant="outline" className="w-full">Get Started</Button>
            </Card>

            <Card className="card-industrial text-center border-primary">
              <Badge className="badge-primary mb-2">Most Popular</Badge>
              <h3 className="font-bold mb-2">Creator</h3>
              <p className="text-muted-foreground text-sm mb-4">.txt + .md</p>
              <div className="text-2xl font-bold mb-4">$29</div>
              <Button className="btn-primary w-full">Start Trial</Button>
            </Card>

            <Card className="card-industrial text-center">
              <h3 className="font-bold mb-2">Pro</h3>
              <p className="text-muted-foreground text-sm mb-4">.txt + .md + .json + .pdf</p>
              <div className="text-2xl font-bold mb-4">$99</div>
              <Button variant="outline" className="w-full">Start Trial</Button>
            </Card>

            <Card className="card-industrial text-center">
              <h3 className="font-bold mb-2">Enterprise</h3>
              <p className="text-muted-foreground text-sm mb-4">All formats + .zip bundles</p>
              <div className="text-2xl font-bold mb-4">$299</div>
              <Button variant="outline" className="w-full">Contact Sales</Button>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link to="/pricing">
              <Button variant="outline" className="btn-secondary">
                View Full Pricing
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-padding border-t border-border">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqItems.map((item, index) => (
              <Card key={index} className="card-industrial">
                <h3 className="font-bold mb-2">{item.question}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="section-padding border-t border-border text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Stop brainstorming. Start exporting.
          </h2>
          
          <div className="thumb-zone-cta">
            <Link to="/generator">
              <Button size="lg" className="btn-primary w-full sm:w-auto">
                Start the Forge
                <Rocket className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

export default HomePage

