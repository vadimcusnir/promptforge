'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BrandLinterAlert } from '@/components/ui/brand-linter-alert';

import { Hero } from '@/components/Hero';

import { SkipLink } from '@/components/SkipLink';
import { brandLinter, type BrandLinterResult } from '@/lib/brand-linter';
import { COPY } from '@/lib/copy';
import { GTMEvents } from '@/lib/gtm-events';
import { Zap, Crown, Brain, TrendingUp, Award, X, Cpu, Activity, Rocket, Shield, Target } from 'lucide-react';

export default function HomePage() {
  const [demoInput, setDemoInput] = useState('marketing strategy');
  const [demoOutput, setDemoOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const demoExamples = [
    'marketing strategy',
    'code review',
    'content creation',
    'data analysis',
    'customer support',
  ];

  const faqData = [
    {
      question: 'What do I get after subscribing?',
      answer:
        'Unlimited access to 50 AI modules, GPT optimization, all export formats, priority support, and regular updates with new features.',
    },
    {
      question: 'Can I cancel anytime?',
      answer:
        'Yes, absolutely. Cancel with one click from your dashboard. No questions asked, no hidden fees.',
    },
    {
      question: 'How does this compare to ChatGPT alone?',
      answer:
        'PROMPTFORGE provides structured, professional prompts with built-in optimization, testing, and export capabilities. ChatGPT gives you raw responses - we give you a complete prompt engineering system.',
    },
    {
      question: 'Do you offer refunds?',
      answer:
        "Yes, we offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment in full.",
    },
    {
      question: 'Is my data secure?',
      answer:
        'Absolutely. We use enterprise-grade encryption and never store your prompts on our servers. Everything is processed securely and deleted after use.',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [linterResult, setLinterResult] = useState<BrandLinterResult | null>(null);

  const generateDemo = async () => {
    if (!demoInput.trim()) return;

    // Track the generation event
    GTMEvents.topicGenerate(demoInput.trim());

    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

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

Generate the optimized ${demoInput} strategy now.`;

    setDemoOutput(generatedPrompt);

    const result = brandLinter.validatePrompt(generatedPrompt);
    setLinterResult(result);

    setIsGenerating(false);
  };

  const handleApplyFixes = () => {
    if (demoOutput) {
      const fixedPrompt = brandLinter.applyAutoFixes(demoOutput);
      setDemoOutput(fixedPrompt);
      const newResult = brandLinter.validatePrompt(fixedPrompt);
      setLinterResult(newResult);
    }
  };





  return (
    <>
      {/* Header Spacer */}
      <div className="h-16" />

      <div className="min-h-screen bg-black text-white font-mono relative">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
        <SkipLink />

        <main id="main" tabIndex={-1}>
          {/* HERO SECTION */}
          <Hero />

          {/* PROOF BAR */}
          <section className="w-full py-6 bg-black border-t border-lead-gray/20">
            <div className="container mx-auto max-w-[1240px] px-6">
              <div className="flex items-center justify-center gap-8 flex-wrap">
                <div className="flex items-center gap-2 text-green-400 font-mono text-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  TTA &lt; 60s
                </div>
                <div className="flex items-center gap-2 text-gold-industrial font-mono text-sm">
                  <span className="w-2 h-2 bg-gold-industrial rounded-full animate-pulse"></span>
                  Score ≥80
                </div>
                <div className="flex items-center gap-2 text-orange-400 font-mono text-sm">
                  <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
                  Export .md/.pdf/.json
                </div>
                <div className="flex items-center gap-2 text-purple-400 font-mono text-sm opacity-75">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                  .zip Enterprise
                </div>
              </div>
            </div>
          </section>

          {/* FREE DEMO MODULES SECTION */}
          <section className="w-full py-24 bg-black">
            <div className="container mx-auto max-w-[1240px] px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-6 text-white">
                  Start with 3 Free Demo Modules
                </h2>
                <p className="text-xl text-lead-gray max-w-3xl mx-auto">
                  Experience the power of PROMPTFORGE™ with these professional-grade modules. 
                  No registration required, instant access to production-ready prompts.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {/* Free Module 1 */}
                <Card className="bg-lead-gray/10 border-lead-gray/30 hover:border-gold-industrial/50 transition-all duration-300 group">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gold-industrial/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-gold-industrial/30 transition-colors">
                      <Rocket className="w-8 h-8 text-gold-industrial" />
                    </div>
                    <CardTitle className="text-xl text-white group-hover:text-gold-industrial transition-colors">
                      Strategic Planning
                    </CardTitle>
                    <CardDescription className="text-lead-gray">
                      Generate comprehensive strategic plans with measurable outcomes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="flex justify-center gap-2 mb-4">
                      <span className="px-2 py-1 text-xs bg-gold-industrial/20 text-gold-industrial border border-gold-industrial/30 rounded">
                        .md
                      </span>
                      <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded">
                        .json
                      </span>
                    </div>
                    <Button 
                      className="w-full bg-gold-industrial text-black hover:bg-gold-industrial/90 transition-colors"
                      onClick={() => GTMEvents.demoBundlePreview()}
                    >
                      Try Free Module
                    </Button>
                  </CardContent>
                </Card>

                {/* Free Module 2 */}
                <Card className="bg-lead-gray/10 border-lead-gray/30 hover:border-gold-industrial/50 transition-all duration-300 group">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gold-industrial/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-gold-industrial/30 transition-colors">
                      <Target className="w-8 h-8 text-gold-industrial" />
                    </div>
                    <CardTitle className="text-xl text-white group-hover:text-gold-industrial transition-colors">
                      Market Analysis
                    </CardTitle>
                    <CardDescription className="text-lead-gray">
                      Deep market research with actionable insights and competitive positioning
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="flex justify-center gap-2 mb-4">
                      <span className="px-2 py-1 text-xs bg-gold-industrial/20 text-gold-industrial border border-gold-industrial/30 rounded">
                        .md
                      </span>
                      <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded">
                        .json
                      </span>
                    </div>
                    <Button 
                      className="w-full bg-gold-industrial text-black hover:bg-gold-industrial/90 transition-colors"
                      onClick={() => GTMEvents.demoBundlePreview()}
                    >
                      Try Free Module
                    </Button>
                  </CardContent>
                </Card>

                {/* Free Module 3 */}
                <Card className="bg-lead-gray/10 border-lead-gray/30 hover:border-gold-industrial/50 transition-all duration-300 group">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gold-industrial/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-gold-industrial/30 transition-colors">
                      <Shield className="w-8 h-8 text-gold-industrial" />
                    </div>
                    <CardTitle className="text-xl text-white group-hover:text-gold-industrial transition-colors">
                      Content Strategy
                    </CardTitle>
                    <CardDescription className="text-lead-gray">
                      Content planning and execution frameworks for maximum engagement
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="flex justify-center gap-2 mb-4">
                      <span className="px-2 py-1 text-xs bg-gold-industrial/20 text-gold-industrial border border-gold-industrial/30 rounded">
                        .md
                      </span>
                      <span className="px-2 py-1 text-xs bg-green-500/20 text-green-300 border border-green-400/30 rounded">
                        .pdf
                      </span>
                    </div>
                    <Button 
                      className="w-full bg-gold-industrial text-black hover:bg-gold-industrial/90 transition-colors"
                      onClick={() => GTMEvents.demoBundlePreview()}
                    >
                      Try Free Module
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <p className="text-lead-gray mb-6">
                  Ready to unlock all 50 modules and advanced features?
                </p>
                <Button 
                  className="bg-gold-industrial text-black hover:bg-gold-industrial/90 transition-colors px-8 py-3 text-lg"
                  onClick={() => GTMEvents.heroCTA()}
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Upgrade to Pro
                </Button>
              </div>
            </div>
          </section>

          {/* SOCIAL PROOF ROW */}
          <section className="w-full py-8 bg-black border-t border-lead-gray/20">
            <div className="container mx-auto max-w-[1240px] px-6">
              <div className="flex items-center justify-center gap-8 flex-wrap">
                {/* Badge-uri de încredere */}
                <div className="flex items-center gap-2 text-xs text-lead-gray font-mono">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Stripe Verified
                </div>
                <div className="flex items-center gap-2 text-xs text-lead-gray font-mono">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  GDPR Ready
                </div>
                <div className="flex items-center gap-2 text-xs text-lead-gray font-mono">
                  <span className="w-2 h-2 bg-gold-industrial rounded-full"></span>
                  SOC 2 Compliant
                </div>
              </div>
            </div>
          </section>

          {/* LIVE DEMO SECTION */}
          <section className="w-full py-24 bg-black">
            <div className="container mx-auto max-w-[1240px] px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-6 text-white">
                  See PROMPTFORGE™ in Action
                </h2>
                <p className="text-xl text-lead-gray max-w-3xl mx-auto">
                  Enter any topic and watch our 7D Engine create a professional prompt in seconds. 
                  Experience the difference between raw AI and structured prompt engineering.
                </p>
              </div>

              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="block text-sm text-gold-industrial mb-2 font-mono font-semibold">
                      What would you like to create?
                    </label>
                    <Input
                      value={demoInput}
                      onChange={e => setDemoInput(e.target.value)}
                      placeholder="e.g., marketing strategy, code review, content creation..."
                      className="h-11 bg-black border-2 border-lead-gray/50 text-white placeholder:text-lead-gray/50 font-mono text-base px-4 focus:border-gold-industrial focus:outline-none transition-colors"
                      aria-label="Enter your topic for prompt generation"
                    />
                    
                    <div className="flex gap-2 flex-wrap">
                      {demoExamples.map(example => (
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
                      className="w-full bg-gold-industrial text-black hover:bg-gold-industrial/90 transition-colors h-11"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full mr-2"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Generate Professional Prompt
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm text-gold-industrial mb-2 font-mono font-semibold">
                      Generated Professional Prompt
                    </label>
                    <div className="bg-lead-gray/10 border border-lead-gray/30 rounded-lg p-4 h-48 overflow-y-auto">
                      {demoOutput ? (
                        <div className="relative">
                          <pre className="text-sm text-white whitespace-pre-wrap font-mono">
                            {demoOutput}
                          </pre>
                          <button
                            onClick={() => navigator.clipboard.writeText(demoOutput)}
                            className="absolute top-2 right-2 bg-gold-industrial text-black px-2 py-1 text-xs font-mono hover:bg-gold-industrial/90 transition-colors rounded"
                            aria-label="Copy generated prompt to clipboard"
                          >
                            Copy
                          </button>
                        </div>
                      ) : (
                        <p className="text-lead-gray/70 italic font-mono">
                          Your professional prompt will appear here...
                        </p>
                      )}
                    </div>

                    {demoOutput && (
                      <div className="space-y-3">
                        <Button className="w-full bg-gold-industrial text-black hover:bg-gold-industrial/90 transition-colors">
                          <Crown className="w-4 h-4 mr-2" />
                          Save & Export (Pro)
                        </Button>
                        <Button
                          className="w-full bg-transparent border border-lead-gray/50 text-lead-gray hover:bg-lead-gray/20 transition-colors"
                          onClick={() => GTMEvents.demoBundlePreview()}
                        >
                          Preview Demo Bundle
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {linterResult && (
                  <div className="mt-8">
                    <BrandLinterAlert
                      result={linterResult}
                      onApplyFixes={handleApplyFixes}
                      onDismiss={() => setLinterResult(null)}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* VALUE PROPOSITION SECTION */}
          <section className="py-20 border-t border-lead-gray/30">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <div className="bg-lead-gray/10 border border-lead-gray/30 rounded-lg p-8">
                  <h2 className="text-4xl font-black mb-8 text-white">
                    The Future of Prompt Engineering Is Industrial
                  </h2>

                  <div className="space-y-6 text-lg text-lead-gray">
                    <p>
                      Most teams waste{' '}
                      <span className="text-gold-industrial font-bold">2-4 hours</span> tweaking a
                      single prompt. With PROMPTFORGE™ v3, you'll do it in{' '}
                      <span className="text-gold-industrial font-bold">30 minutes flat</span> —
                      scored, validated, and export-ready.
                    </p>

                    <p>
                      Not another playground.
                      <br />
                      The first cognitive operating system for prompts, built on CUSNIR.OS
                      architecture —<br />
                      50 semantic modules orchestrated by the 7D Parameter Engine.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ENGINE FEATURES SECTION */}
          <section className="py-20 bg-gradient-to-b from-black to-lead-gray/10">
            <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-black text-center mb-16 text-white">
                  The Engine Behind the Revolution
                </h2>

                <div className="grid md:grid-cols-5 gap-8">
                  <div className="bg-lead-gray/10 border border-lead-gray/30 rounded-lg p-6 text-center">
                    <div className="w-16 h-16 bg-gold-industrial/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-8 h-8 text-gold-industrial" />
                    </div>
                    <h3 className="font-bold text-white mb-2">50 Pre-Built Modules</h3>
                    <p className="text-sm text-lead-gray">
                      (M01–M50) → Strategy, Rhetoric, Content, Cognitive, Memetic, Data, Crisis
                    </p>
                  </div>

                  <div className="bg-lead-gray/10 border border-lead-gray/30 rounded-lg p-6 text-center">
                    <div className="w-16 h-16 bg-gold-industrial/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Cpu className="w-8 h-8 text-gold-industrial" />
                    </div>
                    <h3 className="font-bold text-white mb-2">Parameter Engine 7D</h3>
                    <p className="text-sm text-lead-gray">
                      Domain • Scale • Urgency • Complexity • Resources • Application • Output
                    </p>
                  </div>

                  <div className="bg-lead-gray/10 border border-lead-gray/30 rounded-lg p-6 text-center">
                    <div className="w-16 h-16 bg-gold-industrial/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-gold-industrial" />
                    </div>
                    <h3 className="font-bold text-white mb-2">Live GPT Integration</h3>
                    <p className="text-sm text-lead-gray">
                      Editor + Test Engine with ≥80 score thresholds
                    </p>
                  </div>

                  <div className="bg-lead-gray/10 border border-lead-gray/30 rounded-lg p-6 text-center">
                    <div className="w-16 h-16 bg-gold-industrial/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Activity className="w-8 h-8 text-gold-industrial" />
                    </div>
                    <h3 className="font-bold text-white mb-2">Audit & Telemetry</h3>
                    <p className="text-sm text-lead-gray">Every run scored, logged, checkpointed</p>
                  </div>

                  <div className="bg-lead-gray/10 border border-lead-gray/30 rounded-lg p-6 text-center">
                    <div className="w-16 h-16 bg-gold-industrial/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-gold-industrial" />
                    </div>
                    <h3 className="font-bold text-white mb-2">Export Without Friction</h3>
                    <div className="text-sm text-lead-gray space-y-1">
                      <div>.txt, .md (Free)</div>
                      <div className="flex items-center gap-2 justify-center">
                        <span>.json, .pdf</span>
                        <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded">
                          Pro
                        </span>
                      </div>
                      <div className="flex items-center gap-2 justify-center">
                        <span>.zip bundles</span>
                        <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-400/30 rounded">
                          Enterprise
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-12">
                  <blockquote className="text-sm text-lead-gray font-light tracking-widest italic">
                    "The rising use of AI, particularly in Natural Language Processing, is
                    increasing the demand for prompt engineers."
                  </blockquote>
                  <cite className="block text-xs text-gold-industrial mt-2 font-mono">
                    — PRECEDENCE RESEARCH
                  </cite>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ SECTION */}
          <section className="py-20 bg-gradient-to-b from-lead-gray/10 to-black">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-black text-center mb-16 text-white">
                  Frequently Asked Questions
                </h2>

                <div className="space-y-6">
                  {faqData.map((faq, i) => (
                    <Card key={i} className="bg-lead-gray/10 border border-lead-gray/30">
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

          {/* FINAL CTA SECTION */}
          <section className="py-20 bg-black">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-black mb-8 text-white">
                  Ready to Transform Your Prompt Engineering?
                </h2>
                <p className="text-xl text-lead-gray mb-12">
                  Join thousands of professionals who've already upgraded their AI workflow. 
                  Start with 3 free modules, then unlock the full power of PROMPTFORGE™.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    className="bg-gold-industrial text-black hover:bg-gold-industrial/90 transition-colors px-8 py-4 text-lg"
                    onClick={() => GTMEvents.heroCTA()}
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    Start Free Trial
                  </Button>
                  <Button 
                    className="bg-transparent border border-lead-gray/50 text-lead-gray hover:bg-lead-gray/20 transition-colors px-8 py-4 text-lg"
                    onClick={() => GTMEvents.demoBundlePreview()}
                  >
                    <Shield className="w-5 h-5 mr-2" />
                    View Demo Bundle
                  </Button>
                </div>

                <p className="text-sm text-lead-gray/70 mt-6">
                  No credit card required • 7-day free trial • Cancel anytime
                </p>
              </div>
            </div>
          </section>

          {showExitPopup && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
              <Card className="bg-lead-gray/10 border border-lead-gray/30 max-w-md w-full animate-in slide-in-from-bottom-4 duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-gold-industrial">
                        Start Your Free Trial
                      </CardTitle>
                      <CardDescription className="text-lead-gray">
                        Get 50 bonus prompts when you start now
                      </CardDescription>
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
                    <div className="text-2xl font-black text-white mb-2">
                      7-Day Free Trial
                    </div>
                    <p className="text-lead-gray">Full access to all Pro features</p>
                  </div>

                  <Button
                    className="w-full bg-gold-industrial text-black hover:bg-gold-industrial/90 transition-colors"
                    aria-label="Start free trial and get 50 bonus prompts"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Start Free Trial + Get 50 Bonus Prompts
                  </Button>

                  <p className="text-xs text-lead-gray text-center">
                    No credit card required • Cancel anytime
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Glitch Protocol v1 Script */}
          <script defer src="/glitch-keywords.js"></script>
        </main>
      </div>
    </>
  );
}
