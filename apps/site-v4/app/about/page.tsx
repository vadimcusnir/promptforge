import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Target, Shield, Users, Award, Rocket, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/20">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-emerald-600/20 text-emerald-400 border-emerald-500/50">About PromptForge™</Badge>
          <h1 className="text-5xl font-bold text-white mb-6 font-mono">
            We don't just write prompts. <span className="text-emerald-400">We forge them.</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            PromptForge™ is the world's first operational prompt engine: 50 modules, a 7-vector framework, and exports
            you can trust.
          </p>
        </div>

        {/* Mission */}
        <div className="mb-16">
          <Card className="bg-slate-800/50 border-slate-700 max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white mb-4">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300 text-lg leading-relaxed text-center font-bold">
                Most AI tools give you text. We give you systems.
              </p>
              <p className="text-slate-300 leading-relaxed text-center">
                PromptForge™ was built to turn the chaos of ad-hoc prompting into an industrial process: repeatable,
                measurable, and exportable.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-emerald-400 font-bold mb-2">Predictability</div>
                  <div className="text-slate-400 text-sm">outputs scored and verified before use.</div>
                </div>
                <div className="text-center">
                  <div className="text-emerald-400 font-bold mb-2">Proof</div>
                  <div className="text-slate-400 text-sm">manifest + checksum on every export.</div>
                </div>
                <div className="text-center">
                  <div className="text-emerald-400 font-bold mb-2">Speed</div>
                  <div className="text-slate-400 text-sm">time-to-artifact in under 60 seconds.</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12 font-mono">
            Core <span className="text-emerald-400">Values</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-all duration-300">
              <CardHeader>
                <Target className="w-8 h-8 text-emerald-400 mb-4" />
                <CardTitle className="text-white">Precision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Every module is engineered for accuracy. We measure, test, and optimize until results are predictable
                  and reliable.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-all duration-300">
              <CardHeader>
                <Shield className="w-8 h-8 text-emerald-400 mb-4" />
                <CardTitle className="text-white">Reliability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Industrial-grade systems require industrial-grade reliability. Our modules work consistently, every
                  time.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-all duration-300">
              <CardHeader>
                <Zap className="w-8 h-8 text-emerald-400 mb-4" />
                <CardTitle className="text-white">Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Time is valuable. Our 7-D framework and pre-built modules deliver results in under 60 seconds.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-all duration-300">
              <CardHeader>
                <Users className="w-8 h-8 text-emerald-400 mb-4" />
                <CardTitle className="text-white">Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Great systems are built by great teams. We foster collaboration between humans and AI, creators and
                  consumers.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-all duration-300">
              <CardHeader>
                <Award className="w-8 h-8 text-emerald-400 mb-4" />
                <CardTitle className="text-white">Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  We don't ship until it's excellent. Every module, every feature, every interaction is crafted with
                  care.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-all duration-300">
              <CardHeader>
                <Rocket className="w-8 h-8 text-emerald-400 mb-4" />
                <CardTitle className="text-white">Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  We push the boundaries of what's possible with AI, creating new paradigms for human-AI collaboration.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* The Story */}
        <div className="mb-16">
          <Card className="bg-slate-800/50 border-slate-700 max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-white text-center mb-4">Our Story</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-300 leading-relaxed">
                PromptForge™ was born from frustration. Agencies, consultants, and founders were spending hours
                re-inventing prompts that delivered inconsistent results. We built a system to fix that — a forge
                instead of a sandbox.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Today, PromptForge™ runs as an operational layer for AI work:
              </p>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start">
                  <span className="text-emerald-400 mr-3">•</span>A 7-D parameter engine that locks context.
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-400 mr-3">•</span>
                  50 modules covering strategy, content, sales, crisis, and more.
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-400 mr-3">•</span>A Test Engine that ensures every export meets quality
                  standards.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Who We Serve */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12 font-mono">
            Who We <span className="text-emerald-400">Serve</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white text-lg">Agencies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm">Deliver audit-ready client artifacts.</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white text-lg">Consultants</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm">Turn one-off deliverables into repeatable playbooks.</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white text-lg">Educators</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm">
                  Generate training packs, lesson plans, and compliance-safe outputs.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white text-lg">Founders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm">Test, validate, and ship ideas with verified results.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* The Difference */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-emerald-900/20 to-slate-800/50 border-emerald-500/30 max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-white text-center mb-4">The Difference</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div className="text-emerald-300 text-lg font-mono">Industrial, not improvisational.</div>
              <div className="text-emerald-300 text-lg font-mono">System, not text.</div>
              <div className="text-emerald-300 text-lg font-mono">Outputs you can prove, not just believe.</div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-400 font-mono mb-2">50</div>
            <div className="text-slate-400">Industrial Modules</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-400 font-mono mb-2">7</div>
            <div className="text-slate-400">Parameter Dimensions</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-400 font-mono mb-2">89%</div>
            <div className="text-slate-400">Average AI Score</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-400 font-mono mb-2">&lt;60s</div>
            <div className="text-slate-400">Time to Artifact</div>
          </div>
        </div>

        {/* Philosophy */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-emerald-900/20 to-slate-800/50 border-emerald-500/30 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <blockquote className="text-xl text-emerald-300 font-mono italic mb-4">
                "Identitatea e putere. Nu e nevoie să o pronunți."
              </blockquote>
              <p className="text-slate-400 text-sm">Identity is power. No need to pronounce it.</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-emerald-900/20 to-slate-800/50 border-emerald-500/30 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                PromptForge™ is not just software. It's a standard.
              </h3>
              <Link href="/generator">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono">
                  Start the Forge
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <div className="mt-6">
                <blockquote className="text-lg text-emerald-300 font-mono italic mb-2">
                  "Identitatea e putere. Nu e nevoie să o pronunți."
                </blockquote>
                <p className="text-slate-400 text-sm">Identity is power. No need to pronounce it.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
