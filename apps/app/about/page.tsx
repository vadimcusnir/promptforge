import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Users, Target, Award, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const timeline = [
    {
      year: "2024",
      title: "Foundation",
      description: "PromptForge was conceived as an industrial-grade solution for prompt engineering precision",
    },
    {
      year: "2024 Q3",
      title: "7D Parameter Engine",
      description: "Developed the revolutionary seven-dimensional parameter system for prompt control",
    },
    {
      year: "2024 Q4",
      title: "Module Library",
      description: "Built comprehensive library of 50 operational modules across 7 strategic vectors",
    },
    {
      year: "2025 Q1",
      title: "Public Launch",
      description: "Released PromptForge v3 with full enterprise capabilities and API access",
    },
  ]

  const values = [
    {
      icon: Target,
      title: "Precision",
      description: "Every prompt is engineered for maximum effectiveness and measurable outcomes",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Pushing the boundaries of what's possible in prompt engineering and AI interaction",
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a ecosystem of professionals who demand excellence in their AI workflows",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Setting the industry standard for industrial-grade prompt generation and management",
    },
  ]

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gold-400/10 text-gold-400 border-gold-400/20">Industrial Prompt Engineering</Badge>
          <h1 className="text-5xl font-bold text-white mb-6 font-montserrat">Forging the Future of AI Interaction</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto font-open-sans leading-relaxed">
            PromptForge™ represents a paradigm shift from generic AI tools to precision-engineered prompt systems. We
            believe that professional AI interaction demands industrial-grade tools, auditable processes, and measurable
            outcomes.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-gray-900/20 border border-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-white mb-6 font-montserrat">Our Mission</h2>
          <p className="text-lg text-gray-300 text-center max-w-4xl mx-auto font-open-sans leading-relaxed">
            To transform how professionals interact with AI by providing industrial-grade prompt engineering tools that
            deliver consistent, auditable, and scalable results. We're building the infrastructure that powers the next
            generation of AI-driven workflows.
          </p>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-white mb-12 font-montserrat">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="bg-gray-900/30 border-gray-800 text-center">
                  <CardContent className="p-6">
                    <Icon className="w-12 h-12 text-gold-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-3 font-montserrat">{value.title}</h3>
                    <p className="text-gray-400 font-open-sans">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-white mb-12 font-montserrat">Our Journey</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gold-400/30"></div>

              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <div key={index} className="relative flex items-start gap-6">
                    <div className="w-16 h-16 bg-gold-400 rounded-full flex items-center justify-center text-black font-bold font-montserrat relative z-10">
                      {item.year.slice(-2)}
                    </div>
                    <div className="flex-1 pb-8">
                      <h3 className="text-xl font-bold text-white mb-2 font-montserrat">{item.title}</h3>
                      <p className="text-gray-400 font-open-sans">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-900/20 border border-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 font-montserrat">Join the Revolution</h2>
          <p className="text-gray-400 mb-8 font-open-sans max-w-2xl mx-auto">
            Be part of the community that's defining the future of professional AI interaction. Start building better
            prompts today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-gold-400 hover:bg-gold-500 text-black font-semibold">
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
