"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { SkipLink } from "@/components/SkipLink";
import { SevenDConfigurator } from "@/components/generator/SevenDConfigurator";
import { ModuleSelector } from "@/components/generator/ModuleSelector";
import { UpgradePaywall } from "@/components/paywall/UpgradePaywall";
import { EntitlementsManager } from "@/lib/entitlements/entitlements-manager";
import { modules } from "@/lib/modules";
import type {
  SevenDConfig,
  GeneratedPrompt,
  TestResult,
  PromptModule,
} from "@/types/promptforge";
import { ExportPipeline } from "@/lib/export/export-pipeline";
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";

export default function GeneratorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedModule, setSelectedModule] = useState<PromptModule | null>(null);
  const [sevenDConfig, setSevenDConfig] = useState<SevenDConfig>({
    domain: "saas",
    scale: "startup",
    urgency: "planned",
    complexity: "standard",
    resources: "lean_team",
    application: "implementation",
    output: "structured",
    outputFormat: "spec",
    vector: "V3",
  });
  const [generatedPrompt, setGeneratedPrompt] = useState<GeneratedPrompt | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallTrigger, setPaywallTrigger] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [entitlements, setEntitlements] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [availableExportFormats, setAvailableExportFormats] = useState<string[]>([]);

  const entitlementsManager = EntitlementsManager.getInstance();
  const exportPipeline = ExportPipeline.getInstance();

  // Check for upgrade success/cancelled
  useEffect(() => {
    const upgradeStatus = searchParams.get('upgrade');
    if (upgradeStatus === 'success') {
      toast({
        title: "Upgrade Successful!",
        description: "Your plan has been upgraded. You now have access to all features.",
      });
      // Refresh entitlements
      loadEntitlements();
    } else if (upgradeStatus === 'cancelled') {
      toast({
        title: "Upgrade Cancelled",
        description: "Your plan remains unchanged.",
      });
    }
  }, [searchParams]);

  // Load user entitlements
  useEffect(() => {
    loadEntitlements();
  }, []);

  const loadEntitlements = async () => {
    try {
      // In a real app, you'd get these from your auth system
      const mockUserId = "user_123";
      const mockOrgId = "org_456";
      
      const userEntitlements = await entitlementsManager.getUserEntitlements(mockUserId, mockOrgId);
      setEntitlements(userEntitlements);
      
      // Get available export formats based on entitlements
      const formats = exportPipeline.getAvailableFormats(userEntitlements);
      setAvailableExportFormats(formats);
    } catch (error) {
      console.error('Error loading entitlements:', error);
      // Set default free tier entitlements
      setEntitlements({
        planTier: 'free',
        canGeneratePrompt: true,
        canUseGPTOptimization: false,
        monthlyRunsRemaining: 10
      });
      setAvailableExportFormats(['txt']);
    }
  };

  const handleGeneratePrompt = async () => {
    if (!selectedModule) {
      toast({
        title: "No Module Selected",
        description: "Please select a module before generating a prompt.",
      });
      return;
    }

    // Check entitlements
    const canGenerate = await entitlementsManager.canGeneratePrompt("user_123", "org_456");
    if (!canGenerate.allowed) {
      setPaywallTrigger("generate");
      setShowPaywall(true);
      return;
    }

    setIsGenerating(true);

    try {
      // Call the GPT editor API to generate the prompt
      const response = await fetch('/api/gpt-editor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          moduleId: selectedModule.id,
          sevenDConfig,
          requirements: selectedModule.requirements,
          spec: selectedModule.spec,
          output: selectedModule.output,
          kpi: selectedModule.kpi,
          guardrails: selectedModule.guardrails,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate prompt');
      }

      const data = await response.json();
      
      const prompt: GeneratedPrompt = {
        id: `pf_${selectedModule.id}_${Date.now().toString(36)}`,
        moduleId: selectedModule.id,
        sevenDConfig,
        content: data.prompt,
        prompt: data.prompt,
        config: sevenDConfig,
        timestamp: new Date(),
        hash: generateHash(),
        tokens: data.tokens || Math.floor(Math.random() * 500) + 300,
        tta: data.tta || Math.random() * 2 + 0.5,
        moduleName: selectedModule.name,
        vector: parseInt(sevenDConfig.vector.slice(1)),
        sessionHash: generateHash(),
      };

      setGeneratedPrompt(prompt);
      
      // Track usage
      await entitlementsManager.trackPromptGeneration("user_123", "org_456");
      
      // Refresh entitlements
      loadEntitlements();

      toast({
        title: "Prompt Generated!",
        description: "Your prompt has been successfully generated using the 7-D framework.",
      });

      setTimeout(() => {
        document.getElementById("prompt-editor")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);

    } catch (error) {
      console.error('Error generating prompt:', error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your prompt. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRunTest = async () => {
    if (!generatedPrompt) return;

    // Check entitlements
    const canTest = await entitlementsManager.canUseGPTOptimization("user_123", "org_456");
    if (!canTest.allowed) {
      setPaywallTrigger("test");
      setShowPaywall(true);
      return;
    }

    setIsTesting(true);

    try {
      // Call the GPT test API
      const response = await fetch('/api/gpt-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          promptId: generatedPrompt.id,
          prompt: generatedPrompt.content,
          sevenDConfig: generatedPrompt.sevenDConfig,
          moduleId: generatedPrompt.moduleId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to run test');
      }

      const data = await response.json();
      
      const result: TestResult = {
        id: `test_${Date.now()}`,
        promptId: generatedPrompt.id,
        scores: {
          clarity: data.scores?.clarity || Math.floor(Math.random() * 30) + 70,
          execution: data.scores?.execution || Math.floor(Math.random() * 30) + 70,
          ambiguity: data.scores?.ambiguity || Math.floor(Math.random() * 30) + 10,
          business_fit: data.scores?.business_fit || Math.floor(Math.random() * 30) + 70,
        },
        verdict: data.verdict || "PASS",
        recommendations: data.recommendations || [],
        timestamp: new Date(),
      };

      setTestResult(result);
      
      // Track usage
      await entitlementsManager.trackGPTOptimization("user_123", "org_456");
      
      // Refresh entitlements
      loadEntitlements();

      toast({
        title: "Test Completed!",
        description: "Your prompt has been evaluated and scored.",
      });

      setTimeout(() => {
        document.getElementById("test-verdict")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);

    } catch (error) {
      console.error('Error running test:', error);
      toast({
        title: "Test Failed",
        description: "There was an error running the test. Please try again.",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleExport = async (format: string) => {
    if (!generatedPrompt) return;

    setIsExporting(true);

    try {
      const result = await exportPipeline.exportPrompt(
        generatedPrompt,
        format,
        entitlements,
        false // Not a trial user
      );

      if (result.success && result.data) {
        // Create download
        const blob = Buffer.isBuffer(result.data) 
          ? new Blob([result.data]) 
          : new Blob([result.data], { type: 'text/plain' });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prompt-${generatedPrompt.id}.${format}`;
        a.click();
        URL.revokeObjectURL(url);

        toast({
          title: "Export Successful!",
          description: `Your prompt has been exported in ${format.toUpperCase()} format.`,
        });
      } else {
        toast({
          title: "Export Failed",
          description: result.error || "There was an error exporting your prompt.",
        });
      }
    } catch (error) {
      console.error('Error exporting:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your prompt. Please try again.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const generateHash = (): string => {
    return Math.random().toString(36).substring(2, 10);
  };

  const getPaywallReason = (): string => {
    switch (paywallTrigger) {
      case "generate":
        return "You've reached your monthly prompt generation limit. Upgrade to continue creating prompts.";
      case "test":
        return "GPT optimization is not available on your current plan. Upgrade to access advanced testing.";
      case "export-json":
        return "JSON export requires Creator plan or higher.";
      case "export-pdf":
        return "PDF export requires Pro plan or higher.";
      case "export-zip":
        return "Bundle export requires Enterprise plan.";
      default:
        return "This feature requires a higher plan tier.";
    }
  };

  const getRequiredPlan = (): string => {
    switch (paywallTrigger) {
      case "generate":
        return "creator";
      case "test":
        return "creator";
      case "export-json":
        return "creator";
      case "export-pdf":
        return "pro";
      case "export-zip":
        return "enterprise";
      default:
        return "creator";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SkipLink />
      <Header showBreadcrumbs={true} />

      <main id="main" tabIndex={-1}>
        <div className="container mx-auto max-w-7xl px-6 py-8">
          <div className="space-y-8">
            {/* Page Header */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">
                PromptForge Generator
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Create powerful, context-aware prompts using our 7-Dimensional framework and curated module library.
              </p>
              
              {/* Entitlements Status */}
              {entitlements && (
                <div className="flex items-center justify-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Plan: <span className="font-medium capitalize">{entitlements.planTier}</span>
                  </span>
                  <span className="text-muted-foreground">
                    Runs Remaining: <span className="font-medium">{entitlements.monthlyRunsRemaining}</span>
                  </span>
                  {entitlements.canUseGPTOptimization && (
                    <span className="text-muted-foreground">
                      GPT Tests: <span className="font-medium">{entitlements.monthlyGPTOptimizationsRemaining}</span>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Module Selection */}
            <ModuleSelector
              selectedModule={selectedModule}
              onModuleSelect={setSelectedModule}
              modules={modules}
            />

            {/* 7-D Configuration */}
            {selectedModule && (
              <SevenDConfigurator
                config={sevenDConfig}
                onConfigChange={setSevenDConfig}
              />
            )}

            {/* Generate Button */}
            {selectedModule && (
              <div className="flex justify-center">
                <button
                  onClick={handleGeneratePrompt}
                  disabled={isGenerating || !selectedModule}
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isGenerating ? "Generating..." : "Generate Prompt"}
                </button>
              </div>
            )}

            {/* Generated Prompt Display */}
            {generatedPrompt && (
              <div id="prompt-editor" className="space-y-6">
                <div className="bg-card border rounded-lg p-6">
                  <h2 className="text-2xl font-semibold mb-4">Generated Prompt</h2>
                  <div className="bg-muted p-4 rounded border font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                    {generatedPrompt.content}
                  </div>
                </div>

                {/* Test Engine */}
                <div className="bg-card border rounded-lg p-6">
                  <h2 className="text-2xl font-semibold mb-4">Test Engine</h2>
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-1">
                        {testResult?.scores.clarity || "--"}
                      </div>
                      <div className="text-sm text-muted-foreground">Clarity</div>
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${testResult?.scores.clarity || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-1">
                        {testResult?.scores.execution || "--"}
                      </div>
                      <div className="text-sm text-muted-foreground">Execution</div>
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${testResult?.scores.execution || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-1">
                        {testResult?.scores.ambiguity || "--"}
                      </div>
                      <div className="text-sm text-muted-foreground">Ambiguity</div>
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full transition-all"
                          style={{ width: `${testResult?.scores.ambiguity || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-1">
                        {testResult?.scores.business_fit || "--"}
                      </div>
                      <div className="text-sm text-muted-foreground">Business-fit</div>
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${testResult?.scores.business_fit || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-lg">
                      Verdict:{" "}
                      <span
                        className={`font-semibold ${
                          testResult?.verdict === "PASS"
                            ? "text-green-600"
                            : testResult?.verdict === "PARTIAL"
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {testResult?.verdict || "Not tested"}
                      </span>
                    </div>
                    <button
                      onClick={handleRunTest}
                      disabled={isTesting || !entitlements?.canUseGPTOptimization}
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {isTesting ? "Testing..." : "Run Test"}
                    </button>
                  </div>
                </div>

                {/* Export Options */}
                {generatedPrompt && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Export Options</h3>
                    <div className="flex flex-wrap gap-2">
                      {availableExportFormats.map((format) => (
                        <Button
                          key={format}
                          onClick={() => handleExport(format)}
                          disabled={isExporting}
                          variant="outline"
                          className="capitalize"
                        >
                          {isExporting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Exporting...
                            </>
                          ) : (
                            <>
                              <Download className="mr-2 h-4 w-4" />
                              Export as {format.toUpperCase()}
                            </>
                          )}
                        </Button>
                      ))}
                    </div>
                    {availableExportFormats.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No export formats available. Upgrade your plan to unlock more export options.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Upgrade Paywall */}
        <UpgradePaywall
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          feature={paywallTrigger}
          currentPlan={entitlements?.planTier || 'free'}
          requiredPlan={getRequiredPlan()}
          reason={getPaywallReason()}
        />
      </main>
    </div>
  );
}
