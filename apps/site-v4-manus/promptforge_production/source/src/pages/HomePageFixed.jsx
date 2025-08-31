import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowRight, 
  CheckCircle, 
  Star,
  Layers,
  Zap,
  Package,
  Users,
  Globe,
  Briefcase,
  Target,
  Shield,
  FileText
} from 'lucide-react'
import '../styles/mathematical-proportions.css'

const HomePageFixed = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: Layers,
      title: "Configure 7-D",
      description: "Domain, scale, urgency, complexity, resources, application, output.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Zap,
      title: "Run a Module",
      description: "Every module scored with KPIs + guardrails.",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Package,
      title: "Export",
      description: ".md/.json/.pdf with manifest + checksum.",
      color: "from-purple-500 to-violet-600"
    }
  ]

  const modules = [
    {
      icon: Target,
      title: "Strategic Framework",
      description: "Build comprehensive business strategies",
      level: "Advanced",
      score: "92%",
      color: "blue"
    },
    {
      icon: FileText,
      title: "Content Engine",
      description: "Generate high-converting content",
      level: "Intermediate", 
      score: "88%",
      color: "green"
    },
    {
      icon: Shield,
      title: "Crisis Management",
      description: "Handle emergencies with precision",
      level: "Expert",
      score: "95%",
      color: "red"
    }
  ]

  const workflowSteps = [
    {
      icon: Briefcase,
      title: "Agencies",
      description: "Test, validate & ship faster with 7-D scoring",
      features: ["Rapid validation", "Data-driven decisions", "Faster iteration"]
    },
    {
      icon: Users,
      title: "Consultants", 
      description: "Scale expertise with systematic prompt engineering",
      features: ["Consistent delivery", "Quality assurance", "Client satisfaction"]
    },
    {
      icon: Globe,
      title: "Enterprises",
      description: "Deploy at scale with enterprise-grade security",
      features: ["Enterprise security", "Team collaboration", "Advanced analytics"]
    }
  ]

  const testimonials = [
    {
      text: "Cut prep from 3 weeks to 3 days. PromptForge gave us consistency we couldn't get from ChatGPT alone.",
      author: "Sarah Chen",
      role: "Agency Director, San Francisco",
      rating: 5,
      avatar: "SC"
    },
    {
      text: "Finally, a system that works. Clients pay more when outputs are audit-ready.",
      author: "Mike Rodriguez", 
      role: "AI Consultant, Austin",
      rating: 5,
      avatar: "MR"
    },
    {
      text: "The 7-D framework turned our chaotic prompt workflow into a repeatable process. Zero surprises.",
      author: "Emma Thompson",
      role: "Product Lead, New York", 
      rating: 5,
      avatar: "ET"
    }
  ]

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      description: ".txt only, 3 core modules",
      features: ["3 core modules", "Text export only", "Community support"],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Creator", 
      price: "$29",
      description: ".txt + .md",
      features: ["All 50 modules", "Text + Markdown export", "Email support", "7-D Framework"],
      cta: "Start Trial",
      popular: true
    },
    {
      name: "Pro",
      price: "$99", 
      description: ".txt + .md + .json + .pdf",
      features: ["Everything in Creator", "JSON + PDF export", "Priority support", "Advanced analytics"],
      cta: "Start Trial",
      popular: false
    },
    {
      name: "Enterprise",
      price: "$299",
      description: "All formats + .zip bundles", 
      features: ["Everything in Pro", "ZIP bundles", "Custom integrations", "Dedicated support"],
      cta: "Contact Sales",
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section - Mathematical proportions */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        <div className="container-pro">
          <div className="text-center max-w-4xl mx-auto">
            {/* Trust indicators */}
            <div className="mb-8">
              <p className="text-sm text-muted-foreground">
                Backed by SaaS founders • Used by consultants • Trusted in early enterprise pilots
              </p>
            </div>

            {/* Main headline - 8:5 ratio */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="block">Stop improvising prompts.</span>
              <span className="block text-gradient-primary">Start forging systems.</span>
            </h1>

            {/* Subheadline - Golden ratio proportion */}
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Industrial prompt engineering platform. 50 modules, 7 vectors, verified exports in under 60 seconds.
            </p>

            {/* CTA Section */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                to="/generator"
                className="btn-primary-pro text-lg px-8 py-4 min-w-[200px]"
              >
                Start the Forge
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/docs"
                className="btn-secondary-pro text-lg px-8 py-4 min-w-[200px]"
              >
                View Documentation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - 3-column grid with perfect proportions */}
      <section className="py-20 bg-muted/30">
        <div className="container-pro">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div
                  key={index}
                  className="card-pro text-center p-8 h-[280px] flex flex-col justify-between"
                >
                  <div>
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link
              to="/generator"
              className="btn-primary-pro text-lg px-8 py-4"
            >
              Try the Generator
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-20">
        <div className="container-pro">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore 50 operational modules
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Each module is precision-engineered for specific use cases with built-in quality scoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {modules.map((module, index) => {
              const IconComponent = module.icon
              return (
                <div
                  key={index}
                  className="card-pro p-6 h-[320px] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <span className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full font-medium">
                        {module.score}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3">{module.title}</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {module.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-muted text-sm rounded-full">
                      {module.level}
                    </span>
                    <Link
                      to={`/modules/${module.title.toLowerCase().replace(' ', '-')}`}
                      className="text-primary hover:text-primary/80 font-medium flex items-center"
                    >
                      View Details
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="text-center">
            <Link
              to="/modules"
              className="btn-outline-pro px-8 py-3"
            >
              Browse All Modules
            </Link>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 bg-muted/30">
        <div className="container-pro">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for the way you work
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're an agency, consultant, or enterprise, PromptForge scales with your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {workflowSteps.map((step, index) => {
              const IconComponent = step.icon
              return (
                <div
                  key={index}
                  className="card-pro p-8 h-[300px] flex flex-col justify-between"
                >
                  <div>
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {step.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container-pro">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What early users are saying
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="card-pro p-6 h-[280px] flex flex-col justify-between"
              >
                <div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </blockquote>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-foreground font-bold text-sm">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-muted/30">
        <div className="container-pro">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose your plan
            </h2>
            <p className="text-lg text-muted-foreground">
              Start free, scale as you grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`card-pro p-6 h-[400px] flex flex-col justify-between relative ${
                  plan.popular ? 'ring-2 ring-primary' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.price !== "$0" && <span className="text-muted-foreground">/month</span>}
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={plan.name === "Enterprise" ? "/contact" : "/auth"}
                  className={`${
                    plan.popular ? 'btn-primary-pro' : 'btn-outline-pro'
                  } text-center py-3`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/pricing"
              className="btn-outline-pro px-8 py-3"
            >
              View Full Pricing
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="container-pro">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Stop brainstorming. Start exporting.
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of professionals who've upgraded from improvised prompts to industrial-grade systems.
            </p>
            <Link
              to="/generator"
              className="btn-primary-pro text-lg px-8 py-4"
            >
              Start the Forge
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePageFixed

