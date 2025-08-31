import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Target, 
  Shield, 
  Zap, 
  CheckCircle,
  ArrowRight,
  Briefcase,
  Users,
  GraduationCap,
  Rocket,
  Settings,
  BarChart3,
  FileText
} from 'lucide-react'

const AboutPage = () => {
  const beliefs = [
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Predictability',
      description: 'outputs scored and verified before use.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Proof',
      description: 'manifest + checksum on every export.'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Speed',
      description: 'time-to-artifact in under 60 seconds.'
    }
  ]

  const features = [
    {
      icon: <Settings className="w-6 h-6" />,
      title: 'A 7-D parameter engine',
      description: 'that locks context.'
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: '50 modules covering',
      description: 'strategy, content, sales, crisis, and more.'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'A Test Engine',
      description: 'that ensures every export meets quality standards.'
    }
  ]

  const audiences = [
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: 'Agencies',
      description: 'Deliver audit-ready client artifacts.',
      color: 'text-blue-400'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Consultants',
      description: 'Turn one-off deliverables into repeatable playbooks.',
      color: 'text-green-400'
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: 'Educators',
      description: 'Generate training packs, lesson plans, and compliance-safe outputs.',
      color: 'text-purple-400'
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Founders',
      description: 'Test, validate, and ship ideas with verified results.',
      color: 'text-orange-400'
    }
  ]

  const differences = [
    'Industrial, not improvisational.',
    'System, not text.',
    'Outputs you can prove, not just believe.'
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="block">We don't just write prompts.</span>
              <span className="block text-gradient-primary">We forge them.</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto">
              PromptForge™ is the world's first operational prompt engine: 50 modules, a 7-vector framework, and exports you can trust.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Most AI tools give you text. We give you systems.
            </p>
            <p className="text-lg text-muted-foreground mb-12">
              PromptForge™ was built to turn the chaos of ad-hoc prompting into an industrial process: repeatable, measurable, and exportable.
            </p>
          </div>

          <div className="mb-16">
            <h3 className="text-2xl font-semibold mb-8 text-center">We believe every team deserves:</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {beliefs.map((belief, index) => (
                <Card key={index} className="card-industrial text-center">
                  <div className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                      {belief.icon}
                    </div>
                    <h4 className="text-xl font-semibold mb-2">{belief.title}</h4>
                    <p className="text-muted-foreground">{belief.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Story</h2>
            <p className="text-lg text-muted-foreground mb-8">
              PromptForge™ was born from frustration. Agencies, consultants, and founders were spending hours re-inventing prompts that delivered inconsistent results. We built a system to fix that — a forge instead of a sandbox.
            </p>
          </div>

          <Card className="card-industrial mb-12">
            <div className="p-8">
              <h3 className="text-2xl font-semibold mb-6 text-center">
                Today, PromptForge™ runs as an operational layer for AI work:
              </h3>
              
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-1">{feature.title}</h4>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Who We Serve</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {audiences.map((audience, index) => (
              <Card key={index} className="card-industrial text-center">
                <div className="p-6">
                  <div className={`${audience.color} mb-4 flex justify-center`}>
                    {audience.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{audience.title}</h3>
                  <p className="text-muted-foreground">{audience.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* The Difference */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-8">The Difference</h2>
            
            <div className="space-y-6">
              {differences.map((difference, index) => (
                <div key={index} className="flex items-center justify-center space-x-4">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                  <p className="text-xl font-medium">{difference}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-industrial">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Precision</h3>
                <p className="text-muted-foreground">
                  Every output is measured, scored, and verified. No guesswork, no surprises.
                </p>
              </div>
            </Card>

            <Card className="card-industrial">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Reliability</h3>
                <p className="text-muted-foreground">
                  Industrial-grade systems that work the same way, every time.
                </p>
              </div>
            </Card>

            <Card className="card-industrial">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Speed</h3>
                <p className="text-muted-foreground">
                  From concept to export in under 60 seconds. Time is your most valuable resource.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            PromptForge™ is not just software. It's a standard.
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join the industrial revolution of prompt engineering.
          </p>
          <Link to="/generator">
            <Button size="lg" className="btn-primary text-lg px-8 py-4">
              Start the Forge
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Industrial Modules</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">7</div>
              <div className="text-muted-foreground">Semantic Vectors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">&lt;60s</div>
              <div className="text-muted-foreground">Time to Artifact</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">98.7%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage

