"use client"

import { useState } from "react"
import { SevenDPanel } from "@/components/generator/SevenDPanel"
import { PromptEditor } from "@/components/generator/PromptEditor"
import { TestEngine } from "@/components/generator/TestEngine"
import { ExportBar } from "@/components/generator/ExportBar"
import { HistoryPanel } from "@/components/generator/HistoryPanel"
import { TelemetryBadge } from "@/components/ui/TelemetryBadge"
import { PaywallModal } from "@/components/paywall/PaywallModal"
import { PremiumGate } from "@/lib/premium-features"
import { modules } from "@/lib/modules"
import type { SevenDConfig, GeneratedPrompt, TestResult } from "@/types/promptforge"

export default function GeneratorPage() {
  const [selectedModule, setSelectedModule] = useState(modules[0])
  const [sevenDConfig, setSevenDConfig] = useState<SevenDConfig>({
    domain: "business",
    scale: "enterprise",
    urgency: "high",
    complexity: "advanced",
    resources: "unlimited",
    application: "production",
    output: "structured",
  })
  const [generatedPrompt, setGeneratedPrompt] = useState<GeneratedPrompt | null>(null)
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [showPaywall, setShowPaywall] = useState(false)
  const [paywallTrigger, setPaywallTrigger] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isTesting, setIsTesting] = useState(false)

  const premiumGate = PremiumGate.getInstance()
  const currentTier = premiumGate.getCurrentTier()
  const canUseGptTest = premiumGate.canUseGPTOptimization().allowed

  const handleGeneratePrompt = async () => {
    const canGenerate = premiumGate.canGeneratePrompt()
    if (!canGenerate.allowed) {
      setPaywallTrigger("generate")
      setShowPaywall(true)
      return
    }

    setIsGenerating(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const prompt: GeneratedPrompt = {
      id: `pf_${selectedModule.id}_${Date.now().toString(36)}`,
      moduleId: selectedModule.id,
      sevenDConfig,
      content: generatePromptContent(selectedModule, sevenDConfig),
      timestamp: new Date(),
      hash: generateHash(),
      tokens: Math.floor(Math.random() * 500) + 300,
      tta: Math.random() * 2 + 0.5,
    }

    setGeneratedPrompt(prompt)
    premiumGate.consumeRun()
    setIsGenerating(false)

    setTimeout(() => {
      document.getElementById("prompt-editor")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }, 100)
  }

  const handleRunTest = async () => {
    if (!canUseGptTest) {
      setPaywallTrigger("test")
      setShowPaywall(true)
      return
    }

    if (!generatedPrompt) return

    setIsTesting(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const result: TestResult = {
      id: `test_${Date.now()}`,
      promptId: generatedPrompt.id,
      scores: {
        clarity: Math.floor(Math.random() * 30) + 70,
        execution: Math.floor(Math.random() * 30) + 70,
        ambiguity: Math.floor(Math.random() * 30) + 10,
        business_fit: Math.floor(Math.random() * 30) + 70,
      },
      verdict: "PASS",
      recommendations: [],
      timestamp: new Date(),
    }

    const passCount = [
      result.scores.clarity >= 80,
      result.scores.execution >= 80,
      result.scores.ambiguity <= 20,
      result.scores.business_fit >= 75,
    ].filter(Boolean).length

    result.verdict = passCount === 4 ? "PASS" : passCount >= 2 ? "PARTIAL" : "FAIL"

    setTestResult(result)
    premiumGate.consumeGPTOptimization()
    setIsTesting(false)

    setTimeout(() => {
      document.getElementById("test-verdict")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }, 100)
  }

  const handleExport = (format: string) => {
    if (!premiumGate.canExportFormat(format)) {
      setPaywallTrigger(`export-${format}`)
      setShowPaywall(true)
      return
    }

    console.log(`[v0] Exporting in format: ${format}`)
  }

  const generatePromptContent = (module: any, config: SevenDConfig): string => {
    return `# ROLE & GOAL
You are an expert ${config.domain} strategist operating at ${config.scale} scale with ${config.urgency} urgency.

# CONTEXT (7-D)
Domain: ${config.domain}
Scale: ${config.scale}  
Urgency: ${config.urgency}
Complexity: ${config.complexity}
Resources: ${config.resources}
Application: ${config.application}
Output: ${config.output}

# OUTPUT SPECIFICATION
${module.output}

# PROCESS
${module.spec}

# GUARDRAILS
${module.guardrails}

# EVALUATION HOOKS
KPI: ${module.kpi}

# TELEMETRY KEYS
module_id: ${module.id}
signature_7d: ${JSON.stringify(config)}
requirements: ${module.requirements}`
  }

  const generateHash = (): string => {
    return Math.random().toString(36).substring(2, 10)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-lead-gray/20 bg-black/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white font-montserrat">Generezi. Testezi. Exporți.</h1>
              <p className="text-lead-gray mt-1">7-D controlează tot. Scor ≥80 sau îl strângem.</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-lead-gray">Plan: {currentTier.name}</div>
              <div className="text-xs text-gold-industrial">
                {premiumGate.getUsageStats().runs.used}/
                {currentTier.limits.monthlyRuns === -1 ? "∞" : currentTier.limits.monthlyRuns} runs
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <SevenDPanel
              selectedModule={selectedModule}
              onModuleChange={setSelectedModule}
              sevenDConfig={sevenDConfig}
              onConfigChange={setSevenDConfig}
            />
          </div>

          <div className="space-y-6">
            <div className="glass-effect rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold font-montserrat">Prompt Editor</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleGeneratePrompt}
                    disabled={isGenerating}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      isGenerating
                        ? "bg-lead-gray/20 text-lead-gray cursor-not-allowed"
                        : "bg-gold-industrial text-black hover:bg-gold-industrial/90 hover:shadow-lg hover:shadow-gold-industrial/20"
                    }`}
                  >
                    {isGenerating ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                        Generating...
                      </span>
                    ) : (
                      "Generate Prompt"
                    )}
                  </button>
                </div>
              </div>

              <PromptEditor prompt={generatedPrompt} onPromptChange={setGeneratedPrompt} />
            </div>
          </div>
        </div>

        {generatedPrompt && (
          <div className="mt-8">
            <TestEngine
              prompt={generatedPrompt}
              testResult={testResult}
              onRunTest={handleRunTest}
              isTesting={isTesting}
              canUseGptTest={canUseGptTest}
            />
          </div>
        )}

        <div className="mt-8">
          <HistoryPanel
            onRestoreConfig={(config) => {
              setSevenDConfig(config.sevenDConfig)
              setSelectedModule(modules.find((m) => m.id === config.moduleId) || modules[0])
            }}
          />
        </div>
      </div>

      {generatedPrompt && <ExportBar prompt={generatedPrompt} testResult={testResult} onExport={handleExport} />}

      {testResult && (
        <TelemetryBadge
          runId={generatedPrompt?.id || ""}
          tta={generatedPrompt?.tta || 0}
          tokens={generatedPrompt?.tokens || 0}
          score={testResult}
        />
      )}

      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} trigger={paywallTrigger} />
    </div>
  )
}
