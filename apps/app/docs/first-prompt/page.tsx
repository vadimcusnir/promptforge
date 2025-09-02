"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle, Play, Copy, Target, Clock, ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function FirstPromptGuide() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const steps = [
    {
      title: "Understanding the 7D Parameter System",
      content:
        "PromptForge uses a seven-dimensional parameter system to create industrial-grade prompts. Each dimension affects the output quality and specificity.",
      action: "Learn the 7D Framework",
    },
    {
      title: "Select Your First Module",
      content:
        "Choose Module M01 - Strategic Framework Generator. This beginner-friendly module helps you create structured business strategies.",
      action: "Open Module M01",
    },
    {
      title: "Configure Parameters",
      content:
        "Set Domain: Marketing, Scale: Startup, Urgency: Standard, Complexity: Simple, Resources: Limited, Application: Content, Output: Text",
      action: "Apply Configuration",
    },
    {
      title: "Generate Your Prompt",
      content:
        "Click 'Simulate Test' to generate your first prompt using our deterministic testing engine. This is free for all users.",
      action: "Generate Prompt",
    },
    {
      title: "Review and Export",
      content:
        "Analyze the generated prompt, check the quality score, and export in your preferred format (TXT available for free users).",
      action: "Export Result",
    },
  ]

  const markStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex])
    }
  }

  const openGenerator = () => {
    const config = {
      module: "M01",
      domain: "marketing",
      scale: "startup",
      urgency: "standard",
      complexity: "simple",
      resources: "limited",
      application: "content",
      output: "text",
    }
    const params = new URLSearchParams(config)
    window.open(`/generator?${params.toString()}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link href="/docs" className="text-gray-400 hover:text-[#d1a954] transition-colors">
            Documentation
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-[#d1a954]">Generate Your First Prompt</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#d1a954]/20 rounded-lg">
              <Play className="w-6 h-6 text-[#d1a954]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold font-montserrat">Generate Your First Prompt</h1>
              <div className="flex items-center gap-4 mt-2">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Beginner</Badge>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />5 minutes
                </div>
              </div>
            </div>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl">
            Learn the fundamentals of PromptForge by creating your first industrial-grade prompt using our 7D parameter
            system and Module M01.
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="bg-gradient-to-r from-[#d1a954]/10 to-transparent border-[#d1a954]/20 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#d1a954]">Progress</h3>
              <span className="text-sm text-gray-400">
                {completedSteps.length}/{steps.length} completed
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-[#d1a954] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* What You'll Learn */}
            <Card className="bg-[#1a1a1a] border-gray-800 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-montserrat">
                  <Target className="w-5 h-5 text-[#d1a954]" />
                  What You'll Learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>How the 7D parameter system creates context-aware prompts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Module selection strategies for different use cases</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Parameter configuration for optimal results</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Testing and validation using simulation engine</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Export workflows and format selection</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Step-by-Step Guide */}
            <div className="space-y-6">
              {steps.map((step, index) => {
                const isCompleted = completedSteps.includes(index)
                const isCurrent = currentStep === index

                return (
                  <Card
                    key={index}
                    className={`border transition-all ${
                      isCurrent
                        ? "bg-[#d1a954]/5 border-[#d1a954]/30"
                        : isCompleted
                          ? "bg-emerald-500/5 border-emerald-500/30"
                          : "bg-[#1a1a1a] border-gray-800"
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            isCompleted
                              ? "bg-emerald-500 text-white"
                              : isCurrent
                                ? "bg-[#d1a954] text-black"
                                : "bg-gray-700 text-gray-400"
                          }`}
                        >
                          {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                        </div>
                        <CardTitle className="font-montserrat">{step.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-4">{step.content}</p>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => {
                            setCurrentStep(index)
                            markStepComplete(index)
                          }}
                          variant={isCompleted ? "outline" : "default"}
                          className={
                            isCompleted
                              ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                              : "bg-[#d1a954] hover:bg-[#d1a954]/80 text-black"
                          }
                        >
                          {isCompleted ? "Completed" : step.action}
                        </Button>
                        {index === 2 && (
                          <Button
                            onClick={openGenerator}
                            variant="outline"
                            className="border-gray-700 hover:border-[#d1a954] hover:text-[#d1a954] bg-transparent"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Try in Generator
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Next Steps */}
            <Card className="bg-gradient-to-r from-[#d1a954]/10 to-transparent border-[#d1a954]/20 mt-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 font-montserrat">Next Steps</h3>
                <p className="text-gray-400 mb-6">
                  Congratulations! You've generated your first prompt. Ready to dive deeper?
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="bg-[#d1a954] hover:bg-[#d1a954]/80 text-black">
                    <Link href="/docs/module-selection">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Learn Module Selection
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-gray-700 hover:border-[#d1a954] hover:text-[#d1a954] bg-transparent"
                  >
                    <Link href="/docs/7d-parameters">Master 7D Parameters</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg font-montserrat">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={openGenerator} className="w-full bg-[#d1a954] hover:bg-[#d1a954]/80 text-black">
                  <Play className="w-4 h-4 mr-2" />
                  Open Generator
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-700 hover:border-[#d1a954] hover:text-[#d1a954] bg-transparent"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Configuration
                </Button>
              </CardContent>
            </Card>

            {/* Related Guides */}
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg font-montserrat">Related Guides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  href="/docs/module-selection"
                  className="block p-3 rounded-lg border border-gray-800 hover:border-[#d1a954]/30 transition-colors"
                >
                  <div className="font-medium text-white">Choosing the Right Module</div>
                  <div className="text-sm text-gray-400">Navigate our 50-module library</div>
                </Link>
                <Link
                  href="/docs/7d-parameters"
                  className="block p-3 rounded-lg border border-gray-800 hover:border-[#d1a954]/30 transition-colors"
                >
                  <div className="font-medium text-white">7D Parameter Mastery</div>
                  <div className="text-sm text-gray-400">Deep dive into all dimensions</div>
                </Link>
              </CardContent>
            </Card>

            {/* Help */}
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg font-montserrat">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">Stuck on something? Our support team is here to help.</p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-gray-700 hover:border-[#d1a954] hover:text-[#d1a954] bg-transparent"
                >
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-800">
          <Button asChild variant="ghost" className="text-gray-400 hover:text-white">
            <Link href="/docs">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Documentation
            </Link>
          </Button>
          <Button asChild className="bg-[#d1a954] hover:bg-[#d1a954]/80 text-black">
            <Link href="/docs/module-selection">
              Next: Module Selection
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
