"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AnimatedCodeBlock } from "@/components/ui/animated-code-block"
import { BrandLinterAlert } from "@/components/ui/brand-linter-alert"

import { SkipLink } from "@/components/SkipLink"
import { brandLinter, type BrandLinterResult } from "@/lib/brand-linter"
import { COPY } from "@/lib/copy"
import { GTMEvents } from "@/lib/gtm-events"
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
  const [demoInput, setDemoInput] = useState("marketing strategy")
  const [demoOutput, setDemoOutput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  
  const demoExamples = [
    "marketing strategy",
    "code review",
    "content creation",
    "data analysis",
    "customer support",
  ]
  
  const faqData = [
    {
      question: "What do I get after subscribing?",
      answer: "Unlimited access to 50 AI modules, GPT optimization, all export formats, priority support, and regular updates with new features."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, absolutely. Cancel with one click from your dashboard. No questions asked, no hidden fees."
    },
    {
      question: "How does this compare to ChatGPT alone?",
      answer: "PROMPTFORGE provides structured, professional prompts with built-in optimization, testing, and export capabilities. ChatGPT gives you raw responses - we give you a complete prompt engineering system."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment in full."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade encryption and never store your prompts on our servers. Everything is processed securely and deleted after use."
    }
  ]
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
  const [showExitPopup, setShowExitPopup] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ hours: 47, minutes: 32, seconds: 15 })
  const [linterResult, setLinterResult] = useState<BrandLinterResult | null>(null)
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
      line1: "The 1st Cognitive OS for Prompts",
      line2: "50 modules orchestrated by the 7D Engine → production-ready prompts scored ≥80 and exportable in minutes.",
    },
  ]

  const rotatingSubtitles = ["TTA < 60s • Score ≥ 80 • Export .md/.json/.pdf • Audit & Telemetry"]

  const generateDemo = async () => {
    if (!demoInput.trim()) return

    // Track the generation event
    GTMEvents.topicGenerate(demoInput.trim())

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
    <div className="min-h-screen bg-black text-white font-mono relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <SkipLink />



      <main id="main" tabIndex={-1}>
        
        <section className="w-full py-24 bg-black">
          <div className="container mx-auto max-w-[1240px] px-6 text-center">
            <h1 className="console-typing text-h1 text-white font-mono mb-8">
              The <span className="text-[#FFD700]" data-glitch>
                Cognitive‑OS
              </span> for Prompts
            </h1>
            
            <h2 className="text-h2 text-gray-300 mb-12 font-mono">
              Turn 4h into 30m. 50 modules + 7D Engine → score ≥80, export‑ready.
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
              <button
                className="btn-notched text-base px-8 py-3"
                onClick={() => GTMEvents.heroCTA()}
                aria-label="Start the Forge - Begin free trial"
              >
                Start the Forge
              </button>
              <button
                className="bg-transparent border-2 border-gray-600 text-gray-300 hover:border-[#FFD700] hover:text-[#FFD700] font-mono text-base px-8 py-3 transition-all"
                onClick={() => GTMEvents.seeModules()}
                aria-label="View all available modules"
              >
                View Modules
              </button>
            </div>
            
            <div className="text-sm text-gray-400 text-center mt-6 mb-8 font-mono">
              Start free — no credit card. Upgrade to Pro (€29/mo) for PDF/JSON; Enterprise for .zip.
            </div>
            
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <span className="bg-black border border-[#FFD700] text-[#FFD700] px-3 py-1 text-xs font-mono">TTA &lt; 60s</span>
              <span className="bg-black border border-[#FFD700] text-[#FFD700] px-3 py-1 text-xs font-mono">Score ≥ 80</span>
              <span className="bg-black border border-[#FFD700] text-[#FFD700] px-3 py-1 text-xs font-mono">Export .md/.pdf/.json</span>
              <span className="bg-black border border-[#FFD700] text-[#FFD700] px-3 py-1 text-xs font-mono opacity-75">.zip on Enterprise</span>
            </div>
          </div>
        </section>

        {/* See it in action - Micro Demo */}
        <section className="w-full py-24 bg-black">
          <div className="container mx-auto max-w-[1240px] px-6">
            <h2 className="text-h2 text-[#FFD700] text-center mb-4 font-mono">See it in action</h2>
            <p className="text-body text-gray-300 text-center mb-12 font-mono">
              Enter any topic and watch the <span className="text-[#FFD700]">7D Engine</span> generate a professional prompt
            </p>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-sm text-[#FFD700] mb-2 font-mono">Topic</label>
                  <Input
                    value={demoInput}
                    onChange={(e) => setDemoInput(e.target.value)}
                    placeholder="fintech KYC, ecommerce CRO, healthcare intake..."
                    className="console-theme text-[#FFD700] placeholder:text-gray-500 font-mono"
                    aria-label="Enter topic for prompt generation"
                  />
                  <p className="text-xs text-gray-500 mt-1 font-mono">No data stored.</p>
                  
                  <div className="flex gap-2 flex-wrap">
                    <select 
                      className="console-theme text-[#FFD700] text-sm px-3 py-2 font-mono"
                      onChange={(e) => setDemoInput(e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>Choose preset...</option>
                      <option value="fintech KYC">fintech KYC</option>
                      <option value="ecommerce CRO">ecommerce CRO</option>
                      <option value="healthcare intake">healthcare intake</option>
                    </select>
                  </div>
                  
                  <button
                    onClick={generateDemo}
                    disabled={isGenerating || !demoInput.trim()}
                    className="btn-notched w-full"
                  >
                    {isGenerating ? "Generating..." : "Generate"}
                  </button>
                </div>
                
                <div className="space-y-4">
                  <label className="block text-sm text-[#FFD700] mb-2 font-mono">Generated Prompt</label>
                  <div className="console-theme p-4 h-48 overflow-y-auto" aria-live="polite">
                    {demoOutput ? (
                      <div className="relative">
                        <pre className="text-sm text-[#FFD700] whitespace-pre-wrap font-mono">{demoOutput}</pre>
                        <button
                          onClick={() => navigator.clipboard.writeText(demoOutput)}
                          className="absolute top-2 right-2 bg-[#FFD700] text-black px-2 py-1 text-xs font-mono hover:bg-yellow-400 transition-colors"
                          aria-label="Copy generated prompt to clipboard"
                        >
                          Copy
                        </button>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic font-mono">Your prompt will appear here...</p>
                    )}
                  </div>
                  
                  <button 
                    className="bg-transparent border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black w-full text-sm font-mono py-2 transition-all"
                    onClick={() => GTMEvents.demoBundlePreview()}
                  >
                    Preview a Bundle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Module Grid */}
        <section className="w-full py-24 bg-black">
          <div className="container mx-auto max-w-[1240px] px-6">
            <h2 className="text-h2 text-[#FFD700] text-center mb-4 font-mono">
              Module Grid
            </h2>
            <p className="text-body text-gray-300 text-center mb-12 font-mono">
              50 semantic modules orchestrated by the <span className="text-[#FFD700]">7D</span> Parameter Engine
            </p>
          
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <select className="console-theme text-[#FFD700] text-sm px-3 py-2 font-mono">
                <option>Vector (All)</option>
                <option>V1 - Strategy</option>
                <option>V2 - Content</option>
                <option>V3 - Analysis</option>
              </select>
              <input 
                type="text" 
                placeholder="Search modules..." 
                className="console-theme text-[#FFD700] placeholder:text-gray-500 text-sm px-3 py-2 font-mono"
              />
              <select className="console-theme text-[#FFD700] text-sm px-3 py-2 font-mono">
                <option>Output (All)</option>
                <option>Spec</option>
                <option>Playbook</option>
                <option>JSON</option>
                <option>PDF</option>
              </select>
            </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[
              { id: "M01", vector: "V1", title: "Strategic Planning", description: "Generate comprehensive strategic plans", outputs: ["md", "json", "pdf"] },
              { id: "M02", vector: "V1", title: "Market Analysis", description: "Deep market research and insights", outputs: ["md", "json"] },
              { id: "M03", vector: "V2", title: "Content Strategy", description: "Content planning and execution", outputs: ["md", "pdf"] },
              { id: "M04", vector: "V2", title: "Brand Messaging", description: "Consistent brand communication", outputs: ["md", "json", "pdf"] },
              { id: "M05", vector: "V3", title: "Data Analysis", description: "Statistical analysis and reporting", outputs: ["json", "pdf"] },
              { id: "M06", vector: "V3", title: "Performance Metrics", description: "KPI tracking and optimization", outputs: ["json", "pdf"] },
              { id: "M07", vector: "V1", title: "Risk Assessment", description: "Comprehensive risk evaluation", outputs: ["md", "pdf"] },
              { id: "M08", vector: "V2", title: "User Research", description: "User behavior and preferences", outputs: ["md", "json"] },
            ].map((module) => (
              <div key={module.id} className="bg-black border-2 border-[#FFD700] p-4 hover:bg-[#FFD700]/5 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-black border border-[#FFD700] text-[#FFD700] px-2 py-1 text-xs font-mono">{module.id}</span>
                  <span className="text-xs text-[#FFD700] font-mono">{module.vector}</span>
                </div>
                
                <h3 className="text-lg text-white mb-2 font-mono">{module.title}</h3>
                <p className="text-sm text-gray-400 mb-4 font-mono">{module.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 flex-wrap">
                    {module.outputs.map((output) => {
                      const isPro = output === 'json' || output === 'pdf'
                      const isEnterprise = output === 'zip'
                      return (
                        <span 
                          key={output} 
                          className={`text-xs px-2 py-1 font-mono flex items-center gap-1 min-w-[60px] justify-center ${
                            isPro ? 'bg-blue-900/30 text-blue-300 border border-blue-500' :
                            isEnterprise ? 'bg-purple-900/30 text-purple-300 border border-purple-500' :
                            'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]'
                          }`}
                        >
                          .{output}
                          {isPro && <span className="text-xs opacity-70">Pro</span>}
                          {isEnterprise && <span className="text-xs opacity-70">Ent</span>}
                        </span>
                      )
                    })}
                  </div>
                  <button className="bg-transparent border border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black text-xs px-3 py-1 font-mono transition-all">
                    Specs
                  </button>
                </div>
              </div>
            ))}
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
                That's <span className="text-red-400 font-bold">months of lost market share</span>.
              </p>

              <p className="text-xl text-white font-bold">
                Your competitor isn't smarter. He's just faster.
              </p>
              
              <div className="mt-8">
                <button className="btn-notched text-lg px-8 py-4" onClick={() => GTMEvents.heroCTA()}>
                  Run a 30‑minute test
                </button>
              </div>
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
                <div className="text-sm text-lead-gray space-y-1">
                  <div>.txt, .md (Free)</div>
                  <div className="flex items-center gap-2">
                    <span>.json, .pdf</span>
                    <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded">Pro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>.zip bundles</span>
                    <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-400/30 rounded">Enterprise</span>
                  </div>
                </div>
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

// AI Score: ${linterResult?.score ?? "calculating..."}
// TTA: ${Math.floor(Math.random() * 45 + 15)}s
// Status: ${linterResult?.score ? (linterResult.score >= 80 ? "APPROVED" : "OPTIMIZING") : "CALCULATING"}`}
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
                    className="military-input mb-3"
                  />
                  <div className="flex flex-wrap gap-2 mb-4">
                    {demoExamples.map((example) => (
                      <button
                        key={example}
                        onClick={() => setDemoInput(example)}
                        className="px-3 py-1 text-xs bg-gold-industrial/20 text-gold-industrial border border-gold-industrial/30 rounded-full hover:bg-gold-industrial/30 transition-colors"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
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
                    <div className="space-y-3 mt-4">
                      <Button className="military-btn-primary w-full">
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade to Save & Export
                      </Button>
                      <Button 
                        className="btn-secondary w-full text-sm"
                        onClick={() => GTMEvents.demoBundlePreview()}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Preview Demo Bundle
                      </Button>
                    </div>
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
              {faqData.map((faq, i) => (
                <Card key={i} className="glass-effect">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                    <p className="text-lead-gray">{faq.answer}</p>
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
      
      {/* Glitch Protocol v1 Script */}
      <script defer src="/glitch-keywords.js"></script>
      
      {/* Footer */}
      <footer className="border-t border-[#FFD700] py-16 bg-black">
        <div className="container mx-auto max-w-[1240px] px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg text-[#FFD700] mb-4 font-mono">Product</h3>
              <ul className="space-y-2 text-sm text-gray-300 font-mono">
                <li><a href="/generator" className="hover:text-[#FFD700] transition-colors">Generator</a></li>
                <li><a href="/modules" className="hover:text-[#FFD700] transition-colors">Modules</a></li>
                <li><a href="/pricing" className="hover:text-[#FFD700] transition-colors">Pricing</a></li>
                <li><a href="/demo-bundle" className="hover:text-[#FFD700] transition-colors">Demo Bundle</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg text-[#FFD700] mb-4 font-mono">Docs</h3>
              <ul className="space-y-2 text-sm text-gray-300 font-mono">
                <li><a href="/docs" className="hover:text-[#FFD700] transition-colors">Documentation</a></li>
                <li><a href="/docs/api" className="hover:text-[#FFD700] transition-colors">API Reference</a></li>
                <li><a href="/docs/guides" className="hover:text-[#FFD700] transition-colors">Guides</a></li>
                <li><a href="/docs/examples" className="hover:text-[#FFD700] transition-colors">Examples</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg text-[#FFD700] mb-4 font-mono">Pricing</h3>
              <ul className="space-y-2 text-sm text-gray-300 font-mono">
                <li><a href="/pricing" className="hover:text-[#FFD700] transition-colors">Plans</a></li>
                <li><a href="/enterprise" className="hover:text-[#FFD700] transition-colors">Enterprise</a></li>
                <li><a href="/contact" className="hover:text-[#FFD700] transition-colors">Contact Sales</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg text-[#FFD700] mb-4 font-mono">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-300 font-mono">
                <li><a href="/privacy" className="hover:text-[#FFD700] transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-[#FFD700] transition-colors">Terms of Service</a></li>
                <li><a href="/security" className="hover:text-[#FFD700] transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-[#FFD700] mt-12 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4 text-sm">
                <span className="bg-[#FFD700] text-black px-3 py-1 font-mono text-xs">STRIPE VERIFIED</span>
                <span className="bg-[#FFD700] text-black px-3 py-1 font-mono text-xs">GDPR COMPLIANT</span>
              </div>
              <div className="text-sm text-[#FFD700] font-mono font-semibold">
                Start free • Pro €29/mo • Cancel anytime.
              </div>
            </div>
            <div className="text-sm text-gray-400 text-center font-mono">
              © 2024 PromptForge. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
      </main>
    </div>
  )
}
