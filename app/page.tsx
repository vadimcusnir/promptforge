"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AnimatedCodeBlock } from "@/components/ui/animated-code-block"
import { BrandLinterAlert } from "@/components/ui/brand-linter-alert"
import { CyberPoeticBackground } from "@/components/background/cyber-poetic-background"
import { brandLinter } from "@/lib/brand-linter"
import {
  Zap,
  Crown,
  Download,
  Brain,
  TrendingUp,
  Award,
  X,
  Cpu,
  Crosshair,
  Activity,
  Shield,
  Home,
  ChevronRight,
} from "lucide-react"

export default function HomePage() {
  const [demoInput, setDemoInput] = useState("")
  const [demoOutput, setDemoOutput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showExitPopup, setShowExitPopup] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ hours: 47, minutes: 32, seconds: 15 })
  const [linterResult, setLinterResult] = useState(null)
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0)
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0)

  const legendaryQuotes = [
    "They always say time changes things, but you actually have to change them yourself.",
    "The key is in not spending time, but in investing it.",
    "Lost time is never found again.",
    "In the middle of difficulty lies opportunity.",
  ]

  const rotatingTitles = [
    {
      line1: "Prompt-Forge™ v3",
      line2: "1st Cognitive-OS for Prompts with 50 semantic Modules and 7D Parameter Engine",
    },
  ]

  const rotatingSubtitles = ["Just Try, it is Free Today!"]

  const generateDemo = async () => {
    if (!demoInput.trim()) return

    setIsGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const generatedPrompt = `You are an expert ${demoInput} specialist with 10+ years of experience. Your task is to provide comprehensive, actionable advice that delivers measurable results.

CONTEXT: You're working with a client who needs immediate, practical solutions that can be implemented within 24-48 hours.

REQUIREMENTS:
- Provide 3-5 specific, actionable steps
- Include metrics for measuring success
- Address potential obstacles and solutions
- Use industry best practices and proven methodologies

OUTPUT FORMAT:
1. Immediate Action Items (0-24 hours)
2. Short-term Strategy (1-7 days)  
3. Success Metrics & KPIs
4. Risk Mitigation Plan

TONE: Professional, confident, results-oriented. Avoid generic advice.

Generate the optimized ${demoInput} strategy now.`

    setDemoOutput(generatedPrompt)

    const result = brandLinter.validatePrompt(generatedPrompt)
    setLinterResult(result)

    setIsGenerating(false)
  }

  const handleApplyFixes = () => {
    if (demoOutput) {
      const fixedPrompt = brandLinter.applyAutoFixes(demoOutput)
      setDemoOutput(fixedPrompt)
      const newResult = brandLinter.validatePrompt(fixedPrompt)
      setLinterResult(newResult)
    }
  }

  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % legendaryQuotes.length)
    }, 4000)

    const titleTimer = setInterval(() => {
      setCurrentTitleIndex((prev) => (prev + 1) % rotatingTitles.length)
    }, 7000)

    const subtitleTimer = setInterval(() => {
      setCurrentSubtitleIndex((prev) => (prev + 1) % rotatingSubtitles.length)
    }, 12500)

    return () => {
      clearInterval(quoteTimer)
      clearInterval(titleTimer)
      clearInterval(subtitleTimer)
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-mono relative">
      <CyberPoeticBackground />

      <header className="sticky top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800/50 transition-all duration-300 ease-out">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-center py-2 text-xs text-gray-400 border-b border-gray-800/30">
            <Home className="w-3 h-3 mr-1" />
            <span>Prompt-Forge™</span>
            <ChevronRight className="w-3 h-3 mx-1" />
            <span className="text-[#d1a954]">Cognitive OS</span>
            <ChevronRight className="w-3 h-3 mx-1" />
            <span>Homepage</span>
          </div>

          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="text-[#d1a954] font-black text-xl tracking-wider font-mono">Prompt-Forge™</div>
                <div className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-xs font-mono text-green-400">
                  FREE
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-4 text-sm font-mono">
                <span className="text-gray-400">€29/mo</span>
                <span className="text-gray-600">|</span>
                 <button
                  className="text-white font-bold tracking-wider underline cursor-pointer font-mono hover:text-[#d1a954] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#d1a954]/50 focus:ring-offset-2 focus:ring-offset-black"
                  aria-label="Navigate to Generator"
                >
                  GENERATOR
                </button>
                <button
                  className="text-white font-bold tracking-wider underline cursor-pointer font-mono hover:text-[#d1a954] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#d1a954]/50 focus:ring-offset-2 focus:ring-offset-black"
                  aria-label="View Pricing"
                >
                  PRICING
                </button>
                <button
                  className="text-white font-bold tracking-wider underline cursor-pointer font-mono hover:text-[#d1a954] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#d1a954]/50 focus:ring-offset-2 focus:ring-offset-black"
                  aria-label="Join Community"
                >
                  COMMUNITY
                </button>
              </nav>

              <div className="flex items-center space-x-2">
                <Button
                  className="btn-primary px-6 py-3 font-bold text-sm font-mono transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-[#d1a954]/50 focus:ring-offset-2 focus:ring-offset-black"
                  aria-label="Sign up for Prompt-Forge"
                >
                  SIGN UP
                </Button>
                <Button
                  className="btn-secondary px-6 py-3 font-bold text-sm font-mono transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
                  aria-label="Sign in to Prompt-Forge"
                >
                  SIGN IN
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <button
        onClick={() => setShowExitPopup(true)}
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 bg-[#d1a954] text-black px-3 py-6 rounded-l-lg font-bold text-sm tracking-wider hover:bg-[#d1a954]/90 transition-all duration-300 shadow-lg font-mono focus:outline-none focus:ring-2 focus:ring-[#d1a954]/50 focus:ring-offset-2 focus:ring-offset-black"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        aria-label="Start free trial"
      >
        FREE TRIAL
      </button>

      <section className="relative overflow-hidden pt-24 min-h-screen flex items-center cyber-bg-layer-7">
        <div className="max-w-[1440px] mx-auto px-6 w-full">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 text-center">
              <div className="space-y-16">
                <div className="flex justify-center">
                  <div className="bg-[#d1a954]/10 border border-[#d1a954]/30 rounded-none px-6 py-2 backdrop-blur-sm">
                    <span className="font-bold tracking-widest text-xs font-mono text-[#d1a954]">
                      Prompt-Forge™ v3.0
                    </span>
                    <div className="inline-block w-2 h-2 bg-[#00FF7F] rounded-full ml-2 animate-pulse"></div>
                  </div>
                </div>

                <div className="max-w-5xl mx-auto">
                  <h1
                    className="text-h1 mb-8 text-center font-sans"
                    style={{ color: "#ffffff", textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                  >
                    <div className="transition-all duration-500 ease-out my-0 py-0 mb-3 text-center tracking-tight">
                      {rotatingTitles[currentTitleIndex].line1}
                    </div>
                    {rotatingTitles[currentTitleIndex].line2 && (
                      <div className="text-3xl md:text-4xl lg:text-5xl text-[#d1a954] transition-all duration-500 ease-out text-center tracking-tight font-mono">
                        {rotatingTitles[currentTitleIndex].line2}
                      </div>
                    )}
                  </h1>

                  <div
                    className="text-subtitle transition-all duration-500 ease-out mt-6 text-center font-sans"
                    style={{ color: "rgba(255,255,255,0.9)" }}
                  >
                    {rotatingSubtitles[currentSubtitleIndex]}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12 cyber-bg-layer-8">
                  <Button
                    className="btn-primary text-xl px-20 py-8 font-black tracking-wider font-mono transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-[#d1a954]/50 focus:ring-offset-2 focus:ring-offset-black"
                    aria-label="Start the Prompt-Forge Forge system"
                  >
                    <Crosshair className="w-6 h-6 mr-4" />
                    START THE FORGE
                  </Button>
                  <Button
                    className="btn-secondary text-xl px-20 py-8 font-black tracking-wider font-mono transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
                    aria-label="View Prompt-Forge modules"
                  >
                    <Shield className="w-6 h-6 mr-4" />
                    VIEW MODULES
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden pt-16 min-h-screen flex items-center">
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute inset-0 military-grid opacity-5"></div>
        <div className="absolute top-20 right-20 crosshair-overlay opacity-10"></div>

        <div className="relative container mx-auto px-6 text-center">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="seven-d-engine mt-20">
              <h3 className="text-xl font-bold text-gold-industrial mb-8 tracking-widest">7D PARAMETER ENGINE</h3>
              <div className="flex justify-center items-center gap-4 flex-wrap">
                {[
                  { name: "DOMAIN", icon: "🎯" },
                  { name: "SCALE", icon: "📊" },
                  { name: "URGENCY", icon: "⚡" },
                  { name: "COMPLEXITY", icon: "🧠" },
                  { name: "RESOURCES", icon: "💎" },
                  { name: "APPLICATION", icon: "🚀" },
                  { name: "OUTPUT", icon: "📋" },
                ].map((param, i) => (
                  <div key={param.name} className="seven-d-circle" style={{ animationDelay: `${i * 0.2}s` }}>
                    <div className="circle-icon">{param.icon}</div>
                    <div className="circle-label">{param.name}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="before-after-metrics mt-20">
              <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                <div className="metrics-column before">
                  <h4 className="text-red-400 font-black text-xl mb-6">BEFORE</h4>
                  <div className="metric-item">
                    <span className="metric-value flip-animation">4h</span>
                    <span className="metric-label">Per Prompt</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-value flip-animation">30%</span>
                    <span className="metric-label">Success Rate</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-value flip-animation">∞</span>
                    <span className="metric-label">Iterations</span>
                  </div>
                </div>

                <div className="metrics-column after">
                  <h4 className="text-gold-industrial font-black text-xl mb-6">AFTER</h4>
                  <div className="metric-item">
                    <span className="metric-value flip-animation">30m</span>
                    <span className="metric-label">Per Prompt</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-value flip-animation">98%</span>
                    <span className="metric-label">Success Rate</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-value flip-animation">1</span>
                    <span className="metric-label">Iteration</span>
                  </div>
                </div>
              </div>
              <div className="progress-bar-container mt-8">
                <div className="progress-bar-fill"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-lead-gray/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="military-frame p-8">
              <h2 className="text-4xl font-black mb-8 military-font">The Future of Prompt Engineering Is Industrial</h2>

              <div className="space-y-6 text-lg text-lead-gray">
                <p>
                  Most teams waste <span className="text-gold-industrial font-bold">2-4 hours</span> tweaking a single
                  prompt. With PromptForge v3, you'll do it in{" "}
                  <span className="text-gold-industrial font-bold">30 minutes flat</span> — scored, validated, and
                  export-ready.
                </p>

                <p>
                  Not another playground.
                  <br />
                  The first cognitive operating system for prompts, built on CUSNIR.OS architecture —<br />
                  50 semantic modules orchestrated by the 7D Parameter Engine.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-black to-gray-900/20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-black mb-8">You're Bleeding Hours.</h2>

            <div className="space-y-6 text-lg text-lead-gray">
              <p>
                Every prompt you tweak manually costs you <span className="text-red-400 font-bold">2-4 hours</span>.
                Multiply that by a team, by a week, by a quarter.
                <br />
                That's <span className="text-red-400 font-bold">months of lost market share</span>.
              </p>

              <p className="text-xl text-white font-bold">
                Your competitor isn't smarter. He's just faster.
                <br />
                He's shipping AI features while you're still debating synonyms.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-black text-center mb-16 military-font">The Engine Behind the Revolution</h2>

            <div className="grid md:grid-cols-5 gap-8">
              <div className="military-module">
                <div className="animated-icon-container">
                  <Brain className="w-8 h-8 text-gold-industrial animated-pulse" />
                </div>
                <h3 className="font-bold text-white mb-2">50 Pre-Built Modules</h3>
                <p className="text-sm text-lead-gray">
                  (M01–M50) → Strategy, Rhetoric, Content, Cognitive, Memetic, Data, Crisis
                </p>
              </div>

              <div className="military-module">
                <div className="animated-icon-container">
                  <Cpu className="w-8 h-8 text-gold-industrial animated-rotate" />
                </div>
                <h3 className="font-bold text-white mb-2">Parameter Engine 7D</h3>
                <p className="text-sm text-lead-gray">
                  Domain • Scale • Urgency • Complexity • Resources • Application • Output
                </p>
              </div>

              <div className="military-module">
                <div className="animated-icon-container">
                  <Zap className="w-8 h-8 text-gold-industrial animated-spark" />
                </div>
                <h3 className="font-bold text-white mb-2">Live GPT Integration</h3>
                <p className="text-sm text-lead-gray">Editor + Test Engine with ≥80 score thresholds</p>
              </div>

              <div className="military-module">
                <div className="animated-icon-container">
                  <Activity className="w-8 h-8 text-gold-industrial animated-heartbeat" />
                </div>
                <h3 className="font-bold text-white mb-2">Audit & Telemetry</h3>
                <p className="text-sm text-lead-gray">Every run scored, logged, checkpointed</p>
              </div>

              <div className="military-module">
                <div className="animated-icon-container">
                  <Download className="w-8 h-8 text-gold-industrial animated-bounce" />
                </div>
                <h3 className="font-bold text-white mb-2">Export Without Friction</h3>
                <p className="text-sm text-lead-gray">.txt, .md, .json, .pdf, Enterprise .zip</p>
              </div>
            </div>

            <div className="text-center mt-12">
              <blockquote className="text-sm text-lead-gray font-light tracking-widest italic">
                "The rising use of AI, particularly in Natural Language Processing, is increasing the demand for prompt
                engineers."
              </blockquote>
              <cite className="block text-xs text-gold-industrial mt-2 font-mono">— PRECEDENCE RESEARCH</cite>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-black to-gray-900/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">See It In Action</h2>
            <p className="text-xl text-lead-gray">
              Enter any topic and watch PROMPTFORGE create a professional prompt instantly
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <AnimatedCodeBlock
                title="PROMPTFORGE Engine"
                language="typescript"
                code={`// PROMPTFORGE Live Generation
const prompt = await generatePrompt({
  module: "M03-Codul-7-1",
  domain: "${demoInput || "marketing"}",
  urgency: "sprint",
  output: "pdf"
})

// AI Score: ${linterResult?.score || "calculating..."}
// TTA: ${Math.floor(Math.random() * 45 + 15)}s
// Status: ${linterResult?.score >= 80 ? "APPROVED" : "OPTIMIZING"}`}
                showRun={true}
                onRun={() => {}}
              />

              <div className="space-y-4">
                <div className="military-frame p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="w-4 h-4 text-gold-industrial" />
                    <span className="text-sm font-medium">System Status</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-lead-gray">Active Modules</span>
                      <span className="text-green-400">50/50</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-lead-gray">Avg Response Time</span>
                      <span className="text-blue-400">&lt; 60s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-lead-gray">Success Rate</span>
                      <span className="text-green-400">98.7%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="military-frame p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-gold-industrial mb-3">Enter Your Topic</label>
                  <Input
                    value={demoInput}
                    onChange={(e) => setDemoInput(e.target.value)}
                    placeholder="e.g., marketing strategy, code review, content creation..."
                    className="military-input mb-4"
                  />
                  <Button
                    onClick={generateDemo}
                    disabled={isGenerating || !demoInput.trim()}
                    className="military-btn-primary w-full"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Generate Prompt
                      </>
                    )}
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gold-industrial mb-3">
                    Generated Professional Prompt
                  </label>
                  <div className="military-frame p-4 h-48 overflow-y-auto">
                    {demoOutput ? (
                      <pre className="text-sm text-white whitespace-pre-wrap font-mono">{demoOutput}</pre>
                    ) : (
                      <p className="text-lead-gray italic">Your professional prompt will appear here...</p>
                    )}
                  </div>
                  {demoOutput && (
                    <Button className="military-btn-primary w-full mt-4">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Save & Export
                    </Button>
                  )}
                </div>
              </div>

              {linterResult && (
                <div className="mt-6">
                  <BrandLinterAlert
                    result={linterResult}
                    onApplyFixes={handleApplyFixes}
                    onDismiss={() => setLinterResult(null)}
                  />
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-black mb-8">Built by AI & Prompt Engineering Experts</h2>
            <p className="text-xl text-lead-gray mb-12">
              Our team has trained AI models at leading tech companies and created prompts that power millions of
              interactions daily.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <Award className="w-12 h-12 text-gold-industrial mx-auto mb-4" />
                <div className="text-2xl font-bold text-white">10+ Years</div>
                <p className="text-lead-gray">AI Research Experience</p>
              </div>
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gold-industrial mx-auto mb-4" />
                <div className="text-2xl font-bold text-white">1M+</div>
                <p className="text-lead-gray">Prompts Analyzed</p>
              </div>
              <div className="text-center">
                <Brain className="w-12 h-12 text-gold-industrial mx-auto mb-4" />
                <div className="text-2xl font-bold text-white">50+</div>
                <p className="text-lead-gray">AI Models Trained</p>
              </div>
            </div>

            <Card className="glass-effect p-8">
              <CardContent>
                <h3 className="text-2xl font-bold mb-4">Free Prompt Engineering Guide</h3>
                <p className="text-lead-gray mb-6">
                  Download our comprehensive 50-page guide on advanced prompt engineering techniques used by Fortune 500
                  companies.
                </p>
                <Button className="btn-primary">
                  <Download className="w-4 h-4 mr-2" />
                  Download Free Guide
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-black to-gray-900/20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-black text-center mb-16">Frequently Asked Questions</h2>

            <div className="space-y-6">
              {[
                {
                  q: "What do I get after subscribing?",
                  a: "Unlimited access to 50 AI modules, GPT optimization, all export formats, priority support, and regular updates with new features.",
                },
                {
                  q: "Can I cancel anytime?",
                  a: "Yes, absolutely. Cancel with one click from your dashboard. No questions asked, no hidden fees.",
                },
                {
                  q: "How does this compare to ChatGPT alone?",
                  a: "PROMPTFORGE provides structured, professional prompts with built-in optimization, testing, and export capabilities. ChatGPT gives you raw responses - we give you a complete prompt engineering system.",
                },
                {
                  q: "Do you offer refunds?",
                  a: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment in full.",
                },
                {
                  q: "Is my data secure?",
                  a: "Absolutely. We use enterprise-grade encryption and never store your prompts on our servers. Everything is processed securely and deleted after use.",
                },
              ].map((faq, i) => (
                <Card key={i} className="glass-effect">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">{faq.q}</h3>
                    <p className="text-lead-gray">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {showExitPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <Card className="military-frame max-w-md w-full animate-in slide-in-from-bottom-4 duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-gold-industrial military-font">Start Your Free Trial</CardTitle>
                  <CardDescription className="text-lead-gray">Get 50 bonus prompts when you start now</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowExitPopup(false)}
                  className="text-lead-gray hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
                  aria-label="Close popup"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-black text-white mb-2 military-font">7-Day Free Trial</div>
                <p className="text-lead-gray">Full access to all Pro features</p>
              </div>

              <Button
                className="military-btn-primary w-full focus:outline-none focus:ring-2 focus:ring-[#d1a954]/50 focus:ring-offset-2 focus:ring-offset-black"
                aria-label="Start free trial and get 50 bonus prompts"
              >
                <Crown className="w-4 h-4 mr-2" />
                Start Free Trial + Get 50 Bonus Prompts
              </Button>

              <p className="text-xs text-lead-gray text-center">No credit card required • Cancel anytime</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
