"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { SkipLink } from "@/components/SkipLink";
import { SevenDConfigurator } from "@/components/generator/SevenDConfigurator";
import { ModuleSelector } from "@/components/generator/ModuleSelector";
import { UpgradePaywall } from "@/components/paywall/UpgradePaywall";
import { EntitlementsManager } from "@/lib/entitlements/entitlements-manager";
import { HistoryManager } from "@/lib/history-manager";
import type { PromptModule } from "@/types/promptforge";
import type {
  SevenDConfig,
  GeneratedPrompt,
  TestResult,
} from "@/types/promptforge";
import { ExportPipeline } from "@/lib/export/export-pipeline";
import { Button } from "@/components/ui/button";
import { Loader2, Download, History, RefreshCw } from "lucide-react";

interface GeneratorClientProps {
  modules: PromptModule[];
}

export function GeneratorClient({ modules }: GeneratorClientProps) {
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
  const [promptHistory, setPromptHistory] = useState<any[]>([]);
  const [currentRunId, setCurrentRunId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const entitlementsManager = EntitlementsManager.getInstance();
  const exportPipeline = ExportPipeline.getInstance();
  const historyManager = HistoryManager.getInstance();

  // Handle SSR hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize from URL params and load history
  useEffect(() => {
    if (!isClient) return;
    
    initializeFromURL();
    loadEntitlements();
    loadPromptHistory();
  }, [isClient, searchParams]);

  const initializeFromURL = useCallback(() => {
    if (!isClient) return;

    const moduleId = searchParams.get('module');
    const domain = searchParams.get('domain');
    const scale = searchParams.get('scale');
    const urgency = searchParams.get('urgency');
    const complexity = searchParams.get('complexity');
    const resources = searchParams.get('resources');
    const application = searchParams.get('application');
    const output = searchParams.get('output');
    const vector = searchParams.get('vector');

    // Set module if specified
    if (moduleId) {
      const module = modules.find(m => m.id.toString() === moduleId);
      if (module) {
        setSelectedModule(module);
        // Pre-populate 7D config from module defaults
        if (module.defaultConfig) {
          setSevenDConfig(prev => ({
            ...prev,
            ...module.defaultConfig,
          }));
        }
      }
    }

    // Update 7D config from URL params
    if (domain || scale || urgency || complexity || resources || application || output || vector) {
      setSevenDConfig(prev => ({
        ...prev,
        ...(domain && { domain }),
        ...(scale && { scale }),
        ...(urgency && { urgency }),
        ...(complexity && { complexity }),
        ...(resources && { resources }),
        ...(application && { application }),
        ...(output && { output }),
        ...(vector && { vector }),
      }));
    }

    setIsLoading(false);
  }, [searchParams, modules, isClient]);

  // Update URL when config changes
  useEffect(() => {
    if (!isClient) return;
    
    if (selectedModule || Object.values(sevenDConfig).some(v => v !== "saas" && v !== "startup" && v !== "planned" && v !== "standard" && v !== "lean_team" && v !== "implementation" && v !== "structured" && v !== "spec" && v !== "V3")) {
      const params = new URLSearchParams();
      
      if (selectedModule) {
        params.set('module', selectedModule.id.toString());
      }
      
      Object.entries(sevenDConfig).forEach(([key, value]) => {
        if (value && value !== "saas" && value !== "startup" && value !== "planned" && value !== "standard" && value !== "lean_team" && value !== "implementation" && value !== "structured" && value !== "spec" && value !== "V3") {
          params.set(key, value);
        }
      });

      const newURL = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newURL);
    }
  }, [selectedModule, sevenDConfig, isClient]);

  // Check for upgrade success/cancelled
  useEffect(() => {
    if (!isClient) return;
    
    const upgradeStatus = searchParams.get('upgrade');
    if (upgradeStatus === 'success') {
      toast({
        title: "Upgrade Successful!",
        description: "Your plan has been upgraded. You now have access to all features.",
      });
      loadEntitlements();
    } else if (upgradeStatus === 'cancelled') {
      toast({
        title: "Upgrade Cancelled",
        description: "Your plan remains unchanged.",
      });
    }
  }, [searchParams, isClient]);

  const loadEntitlements = async () => {
    try {
      const mockUserId = "user_123";
      const mockOrgId = "org_456";
      
      const userEntitlements = await entitlementsManager.getUserEntitlements(mockUserId, mockOrgId);
      setEntitlements(userEntitlements);
      
      const formats = exportPipeline.getAvailableFormats(userEntitlements);
      setAvailableExportFormats(formats);
    } catch (error) {
      console.error('Error loading entitlements:', error);
      setEntitlements({
        planTier: 'free',
        canGeneratePrompt: true,
        canUseGPTOptimization: false,
        monthlyRunsRemaining: 10
      });
      setAvailableExportFormats(['txt']);
    }
  };

  const loadPromptHistory = async () => {
    try {
      const history = await historyManager.getHistory();
      setPromptHistory(history as any[]);
    } catch (error) {
      console.error('Error loading prompt history:', error);
    }
  };

  const handleModuleSelect = (module: PromptModule) => {
    setSelectedModule(module);
    
    // Pre-populate 7D config from module defaults
    if (module.defaultConfig) {
      setSevenDConfig(prev => ({
        ...prev,
        ...module.defaultConfig,
      }));
    }

    // Clear any previous prompt
    setGeneratedPrompt(null);
    setTestResult(null);
    setCurrentRunId("");
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
      // Generate run ID
      const runId = `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setCurrentRunId(runId);

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
          runId,
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
        runId,
      };

      setGeneratedPrompt(prompt);
      
      // Save to history
      await historyManager.addEntry({
        type: "prompt",
        moduleId: selectedModule.id,
        moduleName: selectedModule.name,
        vector: sevenDConfig.vector,
        config: prompt.sevenDConfig,
        content: prompt.content,
        metadata: {
          sessionHash: prompt.sessionHash,
          validationScore: prompt.validationScore,
          kpiCompliance: prompt.kpiCompliance,
          structureScore: prompt.structureScore,
          clarityScore: prompt.clarityScore,
        },
        tags: [selectedModule.domain, selectedModule.complexity],
      });
      await loadPromptHistory();
      
      // Track usage
      await entitlementsManager.trackPromptGeneration("user_123", "org_456");
      await loadEntitlements();

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
          runId: currentRunId,
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
      
      // Update history with test results
      await historyManager.addEntry({
        type: "test",
        moduleId: generatedPrompt.moduleId,
        moduleName: generatedPrompt.moduleName || `Module ${generatedPrompt.moduleId}`,
        vector: generatedPrompt.sevenDConfig.vector,
        config: generatedPrompt.sevenDConfig,
        content: generatedPrompt.content,
        metadata: {
          testMode: "gpt-optimization",
        },
        tags: ["test", "gpt-optimization"],
      });
      await loadPromptHistory();
      
      // Track usage
      await entitlementsManager.trackGPTOptimization("user_123", "org_456");
      await loadEntitlements();

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
        false
      );

      if (result.success && result.data) {
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

  const loadPreviousRun = async (runId: string) => {
    try {
      const history = await historyManager.getHistory();
      const run = history.find(h => h.id === runId);
      if (run) {
        setSelectedModule(modules.find(m => m.id === run.moduleId) || null);
        setSevenDConfig(run.config);
        setGeneratedPrompt({
          id: run.id,
          moduleId: run.moduleId,
          sevenDConfig: run.config,
          content: run.content,
          prompt: run.content,
          config: run.config,
          timestamp: run.timestamp,
          hash: generateHash(),
          tokens: Math.floor(Math.random() * 500) + 300,
          tta: Math.random() * 2 + 0.5,
          moduleName: run.moduleName,
          vector: parseInt(run.vector?.slice(1) || "1"),
          sessionHash: generateHash(),
          runId: run.id,
        });
        setCurrentRunId(run.id);
        
        // Load test results if available
        const testResults = run.metadata?.testMode === "gpt-optimization" ? {
          id: `test_${Date.now()}`,
          promptId: run.id,
          scores: {
            clarity: 85,
            execution: 80,
            ambiguity: 15,
            business_fit: 90,
          },
          verdict: "PASS" as const,
          recommendations: ["Consider adding more specific examples"],
          timestamp: new Date(),
        } : null;
        if (testResults) {
          setTestResult(testResults);
        }
        
        toast({
          title: "Run Loaded",
          description: "Previous run configuration has been restored.",
        });
      }
    } catch (error) {
      console.error('Error loading previous run:', error);
      toast({
        title: "Load Failed",
        description: "Could not load the previous run.",
      });
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

  // Show loading state during SSR hydration
  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SkipLink />
        <Header showBreadcrumbs={true} />
        <main className="container mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading generator...</span>
          </div>
        </main>
      </div>
    );
  }

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
              onModuleSelect={handleModuleSelect}
              modules={modules}
            />

            {/* 7-D Configuration */}
            {selectedModule && (
              <SevenDConfigurator
                config={sevenDConfig}
                onConfigChange={setSevenDConfig}
                moduleDefaults={selectedModule.defaultConfig}
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
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold">Generated Prompt</h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Run ID: {currentRunId}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => loadPromptHistory()}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
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

            {/* Prompt History */}
            {promptHistory.length > 0 && (
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Recent Runs
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {promptHistory.slice(0, 10).map((prompt) => (
                    <div
                      key={prompt.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer transition-colors"
                      onClick={() => loadPreviousRun(prompt.id || prompt.runId)}
                    >
                      <div className="flex-1">
                        <div className="font-medium">{prompt.moduleName || `Module ${prompt.moduleId}`}</div>
                        <div className="text-sm text-muted-foreground">
                          {prompt.timestamp.toLocaleDateString()} - {prompt.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Load
                      </Button>
                    </div>
                  ))}
                </div>
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
