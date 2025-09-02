import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, ArrowLeft, Share2, Bookmark, ChevronRight, Target, Zap, Brain } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function BlogArticlePage() {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white font-sans">
      {/* Navigation Breadcrumb */}
      <div className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
            <Link href="/" className="text-gray-400 hover:text-[#d1a954] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <Link href="/blog" className="text-gray-400 hover:text-[#d1a954] transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className="text-gray-300">Cognitive Stratification</span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-400 hover:text-[#d1a954] transition-colors mb-6 focus:outline-none focus:ring-2 focus:ring-[#d1a954] rounded"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chronicles
          </Link>

          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Badge className="bg-[#d1a954] text-black font-semibold">Architecture</Badge>
            <Badge variant="outline" className="border-gray-600 text-gray-300">
              Cognitive Systems
            </Badge>
            <div className="flex items-center text-gray-400 text-sm ml-auto">
              <Clock className="w-4 h-4 mr-1" />
              12 min read
            </div>
          </div>

          <h1 className="font-montserrat text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Cognitive Stratification: From Tool User to System Architect
          </h1>

          <p className="text-xl text-gray-400 mb-8 leading-relaxed">
            Discover the three-tier progression that separates industrial operators from casual users. Learn the
            behavioral markers that unlock advanced capabilities.
          </p>

          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Image
                src="/professional-woman-portrait.png"
                alt="Dr. Sarah Chen profile picture"
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <p className="font-medium text-white">Dr. Sarah Chen</p>
                <p className="text-sm text-gray-400">January 15, 2024</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:border-[#d1a954] hover:text-[#d1a954] bg-transparent"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:border-[#d1a954] hover:text-[#d1a954] bg-transparent"
              >
                <Bookmark className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="aspect-video relative overflow-hidden rounded-lg mb-12">
          <Image
            src="/industrial-prompt-engineering-dashboard.png"
            alt="Industrial prompt engineering dashboard showing cognitive stratification levels"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          {/* TL;DR Section */}
          <Card className="bg-[#1a1a1a] border-[#d1a954] mb-12">
            <CardContent className="p-6">
              <h2 className="font-montserrat text-xl font-bold text-[#d1a954] mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                TL;DR - Key Insights
              </h2>
              <ul className="space-y-2 text-gray-300">
                <li>• Three cognitive tiers: Prompting (masses), Automation (filtering), Architecture (elite)</li>
                <li>• 80% designed failure rate separates tactical users from systems thinkers</li>
                <li>• Behavioral markers, not payments, determine advancement eligibility</li>
                <li>• Each tier requires different cognitive frameworks and operational mindsets</li>
              </ul>
            </CardContent>
          </Card>

          {/* Table of Contents */}
          <Card className="bg-[#1a1a1a] border-gray-700 mb-12">
            <CardContent className="p-6">
              <h2 className="font-montserrat text-lg font-bold mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-[#d1a954]" />
                Navigation Map
              </h2>
              <nav className="space-y-2">
                <a href="#tier-one" className="block text-gray-300 hover:text-[#d1a954] transition-colors py-1">
                  1. Tier One: The Prompting Masses
                </a>
                <a href="#tier-two" className="block text-gray-300 hover:text-[#d1a954] transition-colors py-1">
                  2. Tier Two: Automation Operators
                </a>
                <a href="#tier-three" className="block text-gray-300 hover:text-[#d1a954] transition-colors py-1">
                  3. Tier Three: System Architects
                </a>
                <a
                  href="#behavioral-markers"
                  className="block text-gray-300 hover:text-[#d1a954] transition-colors py-1"
                >
                  4. Behavioral Screening Mechanisms
                </a>
                <a href="#advancement-path" className="block text-gray-300 hover:text-[#d1a954] transition-colors py-1">
                  5. The Advancement Protocol
                </a>
              </nav>
            </CardContent>
          </Card>

          {/* Article Body */}
          <div className="space-y-8">
            <section id="tier-one">
              <h2 className="font-montserrat text-2xl sm:text-3xl font-bold mb-6 text-white">
                Tier One: The Prompting Masses
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                The first tier represents the entry point into PromptForge's cognitive ecosystem. Here, users encounter
                what appears to be prompt education but functions as behavioral screening. The majority—by design—will
                remain at this level, generating revenue while unconsciously participating in qualification algorithms.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Tier One users exhibit tactical thinking patterns: they seek immediate solutions, focus on tool mastery
                rather than system understanding, and approach prompts as isolated commands rather than components of
                larger operational frameworks. This isn't a limitation—it's a necessary foundation that reveals
                cognitive readiness for advancement.
              </p>
              <Card className="bg-[#1a1a1a] border-gray-700 mb-6">
                <CardContent className="p-6">
                  <h3 className="font-montserrat font-bold mb-3 text-[#d1a954]">Tier One Characteristics:</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Access to modules M01, M10, M18 (basic prompt templates)</li>
                    <li>• Focus on immediate problem-solving over system design</li>
                    <li>• Revenue generation through educational content consumption</li>
                    <li>• Behavioral data collection for advancement algorithms</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="tier-two">
              <h2 className="font-montserrat text-2xl sm:text-3xl font-bold mb-6 text-white">
                Tier Two: Automation Operators
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                The transition to Tier Two marks a fundamental cognitive shift. Users begin thinking in systems rather
                than tools, understanding workflows rather than individual prompts. They demonstrate the ability to
                abstract patterns and apply frameworks across different domains—the hallmark of operational thinking.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Tier Two operators gain access to the full 50-module arsenal and advanced testing capabilities. They're
                no longer consuming education—they're building operational capacity. The platform becomes a force
                multiplier for their existing expertise rather than a learning tool.
              </p>
            </section>

            <section id="tier-three">
              <h2 className="font-montserrat text-2xl sm:text-3xl font-bold mb-6 text-white">
                Tier Three: System Architects
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Tier Three represents the cognitive elite—users who don't just operate systems but design them. These
                individuals contribute to PromptForge's evolution, participating in co-creation workflows and strategic
                direction. They've transcended tool usage to become platform architects.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                At this level, the relationship becomes symbiotic. Tier Three architects help define new modules,
                influence platform development, and participate in revenue sharing models. They're not customers—they're
                cognitive partners in the platform's advancement.
              </p>
            </section>

            <section id="behavioral-markers">
              <h2 className="font-montserrat text-2xl sm:text-3xl font-bold mb-6 text-white">
                Behavioral Screening Mechanisms
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                PromptForge's advancement algorithms analyze behavioral patterns rather than explicit performance
                metrics. The system tracks how users approach problems, their pattern recognition capabilities, and
                their ability to abstract solutions across domains.
              </p>
              <Card className="bg-gradient-to-r from-[#d1a954]/10 to-[#b8954a]/10 border-[#d1a954]/30 mb-6">
                <CardContent className="p-6">
                  <h3 className="font-montserrat font-bold mb-3 text-[#d1a954] flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Key Behavioral Indicators:
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4 text-gray-300">
                    <div>
                      <h4 className="font-semibold mb-2">Systems Thinking:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Workflow optimization over task completion</li>
                        <li>• Pattern abstraction across domains</li>
                        <li>• Framework development tendencies</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Cognitive Markers:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Strategic vs. tactical problem approach</li>
                        <li>• Meta-cognitive awareness</li>
                        <li>• Operational scalability focus</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="advancement-path">
              <h2 className="font-montserrat text-2xl sm:text-3xl font-bold mb-6 text-white">
                The Advancement Protocol
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Advancement through PromptForge's cognitive tiers isn't purchased—it's earned through demonstrated
                behavioral evolution. The platform's algorithms continuously assess user interactions, looking for
                indicators of cognitive readiness for the next tier.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                This creates a natural selection mechanism that ensures each tier contains users with appropriate
                cognitive frameworks. The result is a stratified ecosystem where each level operates at its optimal
                cognitive frequency, maximizing both individual outcomes and platform effectiveness.
              </p>
            </section>
          </div>

          {/* Author Bio */}
          <Card className="bg-[#1a1a1a] border-gray-700 mt-12">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Image
                  src="/professional-woman-portrait.png"
                  alt="Dr. Sarah Chen profile picture"
                  width={80}
                  height={80}
                  className="rounded-full flex-shrink-0"
                />
                <div>
                  <h3 className="font-montserrat text-lg font-bold text-white mb-2">Dr. Sarah Chen</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Cognitive Systems Architect and founding researcher at PromptForge. Dr. Chen specializes in
                    behavioral screening algorithms and cognitive stratification methodologies. Her work focuses on
                    identifying and developing systems thinking capabilities in operational environments.
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                      Cognitive Systems
                    </Badge>
                    <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                      Behavioral Analysis
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Articles */}
          <div className="mt-12">
            <h3 className="font-montserrat text-xl font-bold mb-6">Continue Your Advancement</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="bg-[#1a1a1a] border-gray-700 hover:border-[#d1a954] transition-all duration-300 group">
                <CardContent className="p-0">
                  <Link href="/blog/7d-parameter-engine-deep-dive" className="block">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <Image
                        src="/industrial-factory-automation-systems.png"
                        alt="7D Parameter Engine visualization"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-montserrat font-bold text-white group-hover:text-[#d1a954] transition-colors mb-2">
                        The 7D Parameter Engine: Industrial-Grade Prompt Architecture
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Master the seven dimensions that transform simple prompts into auditable, scalable systems.
                      </p>
                    </div>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-[#1a1a1a] border-gray-700 hover:border-[#d1a954] transition-all duration-300 group">
                <CardContent className="p-0">
                  <Link href="/blog/behavioral-screening-algorithms" className="block">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <Image
                        src="/digital-audit-trail-compliance-dashboard.png"
                        alt="Behavioral screening algorithms dashboard"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-montserrat font-bold text-white group-hover:text-[#d1a954] transition-colors mb-2">
                        Behavioral Screening: Identifying Systems Thinkers
                      </h4>
                      <p className="text-gray-400 text-sm">
                        How PromptForge's qualification algorithms separate tactical users from strategic operators.
                      </p>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
