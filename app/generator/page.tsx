"use client";

import React, { useState } from "react";
import { PaywallModal } from "@/components/paywall/PaywallModal";
import { PremiumGate } from "@/lib/premium-features";
import { Header } from "@/components/Header";
import { SkipLink } from "@/components/SkipLink";
import { modules } from "@/lib/modules";
import type {
  SevenDConfig,
  GeneratedPrompt,
  TestResult,
} from "@/types/promptforge";

export default function GeneratorPage() {
  const [selectedModule] = useState(modules[0]);
  const [sevenDConfig, setSevenDConfig] = useState<SevenDConfig>({
    domain: "business",
    scale: "enterprise",
    urgency: "high",
    complexity: "advanced",
    resources: "unlimited",
    application: "production",
    output: "structured",
    outputFormat: "structured",
    vector: "V3",
  });
  const [generatedPrompt, setGeneratedPrompt] =
    useState<GeneratedPrompt | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallTrigger, setPaywallTrigger] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const premiumGate = PremiumGate.getInstance();
  // const currentTier = premiumGate.getCurrentTier(); // TODO: Implement tier display
  const canUseGptTest = premiumGate.canUseGPTOptimization().allowed;

  const handleGeneratePrompt = async () => {
    const canGenerate = premiumGate.canGeneratePrompt();
    if (!canGenerate.allowed) {
      setPaywallTrigger("generate");
      setShowPaywall(true);
      return;
    }

    setIsGenerating(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const prompt: GeneratedPrompt = {
      id: `pf_${selectedModule.id}_${Date.now().toString(36)}`,
      moduleId: selectedModule.id,
      sevenDConfig,
      content: generatePromptContent(selectedModule, sevenDConfig),
      prompt: generatePromptContent(selectedModule, sevenDConfig), // Alias for content
      config: sevenDConfig, // Alias for sevenDConfig
      timestamp: new Date(),
      hash: generateHash(),
      tokens: Math.floor(Math.random() * 500) + 300,
      tta: Math.random() * 2 + 0.5,
    };

    setGeneratedPrompt(prompt);
    premiumGate.consumeRun();
    setIsGenerating(false);

    setTimeout(() => {
      document.getElementById("prompt-editor")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const handleRunTest = async () => {
    if (!canUseGptTest) {
      setPaywallTrigger("test");
      setShowPaywall(true);
      return;
    }

    if (!generatedPrompt) return;

    setIsTesting(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

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
    };

    const passCount = [
      result.scores.clarity >= 80,
      result.scores.execution >= 80,
      result.scores.ambiguity <= 20,
      result.scores.business_fit >= 75,
    ].filter(Boolean).length;

    result.verdict =
      passCount === 4 ? "PASS" : passCount >= 2 ? "PARTIAL" : "FAIL";

    setTestResult(result);
    premiumGate.consumeGPTOptimization();
    setIsTesting(false);

    setTimeout(() => {
      document.getElementById("test-verdict")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const handleExport = (format: string) => {
    if (!premiumGate.canExportFormat(format)) {
      setPaywallTrigger(`export-${format}`);
      setShowPaywall(true);
      return;
    }

    // console.log(`[v0] Exporting in format: ${format}`); // TODO: Replace with proper logging
  };

  const generatePromptContent = (module: typeof modules[0], config: SevenDConfig): string => {
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
requirements: ${module.requirements}`;
  };

  const generateHash = (): string => {
    return Math.random().toString(36).substring(2, 10);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#ECFEFF]">
      {/* Static Grid Background */}
      <div className="grid-static"></div>

      <SkipLink />
      <Header showBreadcrumbs={true} />

      <main id="main" tabIndex={-1}>
        <div className="container mx-auto max-w-[1240px] px-6 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: 7D Configurator */}
            <div className="space-y-6">
              <div className="glass-effect p-6">
                <h2 className="text-h3 text-[#ECFEFF] mb-4">7D Configurator</h2>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(sevenDConfig).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-micro text-[#ECFEFF]/80 mb-2 capitalize">
                        {key}
                      </label>
                      <select
                        value={value}
                        onChange={(e) =>
                          setSevenDConfig((prev) => ({
                            ...prev,
                            [key]: e.target.value as keyof SevenDConfig,
                          }))
                        }
                        className="glass-effect text-[#ECFEFF] text-micro px-3 py-2 border-0 w-full"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleGeneratePrompt}
                  disabled={isGenerating}
                  className="btn-primary w-full mt-6"
                >
                  {isGenerating ? "Generating..." : "Generate Prompt"}
                </button>
              </div>
            </div>

            {/* Right: Prompt Preview */}
            <div className="space-y-6">
              <div className="glass-effect p-6">
                <h2 className="text-h3 text-[#ECFEFF] mb-4">Prompt Preview</h2>
                <div className="bg-[#0A0A0A]/50 p-4 rounded border border-[#ECFEFF]/10 min-h-[300px]">
                  {generatedPrompt ? (
                    <pre className="text-micro text-[#ECFEFF] whitespace-pre-wrap font-mono">
                      {generatedPrompt.content}
                    </pre>
                  ) : (
                    <p className="text-[#ECFEFF]/50 italic">
                      Configure 7D parameters and generate your prompt...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Test Engine */}
          {generatedPrompt && (
            <div className="mt-8 glass-effect p-6">
              <h2 className="text-h3 text-[#ECFEFF] mb-4">Test Engine</h2>
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-h2 text-[#ECFEFF] mb-1">
                    {testResult?.scores.clarity || "--"}
                  </div>
                  <div className="text-micro text-[#ECFEFF]/80">Clarity</div>
                  <div className="w-full bg-[#ECFEFF]/10 rounded-full h-2 mt-2">
                    <div
                      className="bg-[#16A34A] h-2 rounded-full transition-all"
                      style={{ width: `${testResult?.scores.clarity || 0}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-h2 text-[#ECFEFF] mb-1">
                    {testResult?.scores.execution || "--"}
                  </div>
                  <div className="text-micro text-[#ECFEFF]/80">Execution</div>
                  <div className="w-full bg-[#ECFEFF]/10 rounded-full h-2 mt-2">
                    <div
                      className="bg-[#16A34A] h-2 rounded-full transition-all"
                      style={{ width: `${testResult?.scores.execution || 0}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-h2 text-[#ECFEFF] mb-1">
                    {testResult?.scores.ambiguity || "--"}
                  </div>
                  <div className="text-micro text-[#ECFEFF]/80">Ambiguity</div>
                  <div className="w-full bg-[#ECFEFF]/10 rounded-full h-2 mt-2">
                    <div
                      className="bg-[#F59E0B] h-2 rounded-full transition-all"
                      style={{ width: `${testResult?.scores.ambiguity || 0}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-h2 text-[#ECFEFF] mb-1">
                    {testResult?.scores.business_fit || "--"}
                  </div>
                  <div className="text-micro text-[#ECFEFF]/80">
                    Business-fit
                  </div>
                  <div className="w-full bg-[#ECFEFF]/10 rounded-full h-2 mt-2">
                    <div
                      className="bg-[#16A34A] h-2 rounded-full transition-all"
                      style={{
                        width: `${testResult?.scores.business_fit || 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-body text-[#ECFEFF]">
                  Verdict:{" "}
                  <span
                    className={`font-semibold ${
                      testResult?.verdict === "PASS"
                        ? "text-[#16A34A]"
                        : testResult?.verdict === "PARTIAL"
                          ? "text-[#F59E0B]"
                          : "text-[#DC2626]"
                    }`}
                  >
                    {testResult?.verdict || "Not tested"}
                  </span>
                </div>
                <button
                  onClick={handleRunTest}
                  disabled={isTesting || !canUseGptTest}
                  className="btn-primary"
                >
                  {isTesting ? "Testing..." : "Run Test"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Export Bar - Fixed Bottom */}
        {generatedPrompt && (
          <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A]/95 backdrop-blur-sm border-t border-[#ECFEFF]/15 p-4">
            <div className="container mx-auto max-w-[1240px] flex items-center justify-between">
              <div className="text-micro text-[#ECFEFF]/80">
                Export options based on your plan
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExport("txt")}
                  className="btn-secondary text-micro px-3 py-2"
                >
                  .txt (Free)
                </button>
                <button
                  onClick={() => handleExport("md")}
                  className="btn-secondary text-micro px-3 py-2"
                >
                  .md (Creator+)
                </button>
                <button
                  onClick={() => handleExport("json")}
                  className="btn-secondary text-micro px-3 py-2"
                >
                  .json/.pdf (Pro+)
                </button>
                <button
                  onClick={() => handleExport("zip")}
                  className="btn-secondary text-micro px-3 py-2"
                >
                  .zip (Ent)
                </button>
              </div>
            </div>
          </div>
        )}

        <PaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          trigger={paywallTrigger}
        />
      </main>
    </div>
  );
}
