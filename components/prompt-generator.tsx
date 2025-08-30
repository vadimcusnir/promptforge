"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import {
  generatePrompt,
  rerollPrompt,
  validatePromptStructure,
} from "@/lib/prompt-generator";
import { MODULES } from "@/lib/modules";
import type { SessionConfig, GeneratedPrompt } from "@/types/promptforge";
import {
  Copy,
  Download,
  RefreshCw,
  Wand2,
  CheckCircle,
  AlertCircle,
  Target,
  Settings,
  FileText,
  BarChart3,
  Activity,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PromptGeneratorProps {
  selectedModule: number | null;
  config: SessionConfig;
  onPromptGenerated?: (prompt: GeneratedPrompt) => void;
}

export function PromptGenerator({
  selectedModule,
  config,
  onPromptGenerated,
}: PromptGeneratorProps) {
  const [generatedPrompt, setGeneratedPrompt] =
    useState<GeneratedPrompt | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationResult, setValidationResult] = useState<ReturnType<
    typeof validatePromptStructure
  > | null>(null);
  const { toast } = useToast();

  const handleGeneratePrompt = async () => {
    if (!selectedModule) {
      toast({
        title: "Error",
        description: "Select a module before generating the prompt!",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate generation delay for better UX
    setTimeout(() => {
      try {
        const prompt = generatePrompt(selectedModule, config);
        setGeneratedPrompt(prompt);
        setValidationResult(validatePromptStructure(prompt.prompt));
        onPromptGenerated?.(prompt);

        toast({
          title: "Prompt generated successfully!",
          description: `Hash: ${prompt.hash}`,
        });
      } catch (error) {
        toast({
          title: "Error generating prompt",
          description: "Could not generate the prompt. Please try again.",
        });
      } finally {
        setIsGenerating(false);
      }
    }, 1000);
  };

  const handleRerollPrompt = () => {
    if (!generatedPrompt) return;

    setIsGenerating(true);
    setTimeout(() => {
      const newPrompt = rerollPrompt(generatedPrompt);
      setGeneratedPrompt(newPrompt);
      setValidationResult(validatePromptStructure(newPrompt.prompt));
      onPromptGenerated?.(newPrompt);
      setIsGenerating(false);

      toast({
        title: "Prompt regenerated!",
        description: `New hash: ${newPrompt.hash}`,
      });
    }, 800);
  };

  const handleCopyPrompt = async () => {
    if (!generatedPrompt) return;

    try {
      await navigator.clipboard.writeText(generatedPrompt.prompt);
      toast({
        title: "Copied to clipboard!",
        description: "The prompt was copied successfully.",
      });
    } catch (error) {
      toast({
        title: "Error copying prompt",
        description: "Could not copy the prompt.",
      });
    }
  };

  const handleDownloadPrompt = () => {
    if (!generatedPrompt) return;

    const blob = new Blob([generatedPrompt.prompt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prompt_${generatedPrompt.hash}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Prompt downloaded!",
      description: `File: prompt_${generatedPrompt.hash}.txt`,
    });
  };

  const selectedModuleData = selectedModule ? MODULES[selectedModule] : null;

  return (
    <Card className="glass-effect p-6 glow-accent">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-[var(--font-heading)] text-foreground">
          Prompt Generator
        </h2>
        {validationResult && (
          <Badge
            variant={validationResult.score >= 80 ? "default" : "secondary"}
            className="glass-effect"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Validation: {validationResult.score}%
          </Badge>
        )}
      </div>

      <div className="mb-8 p-4 glass-strong rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <div
            className={`flex items-center gap-2 ${selectedModule ? "text-green-400" : "text-muted-foreground"}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${selectedModule ? "bg-green-400 text-black" : "bg-muted text-muted-foreground"}`}
            >
              1
            </div>
            <span>Module Selected</span>
          </div>
          <div
            className={`flex items-center gap-2 ${generatedPrompt ? "text-green-400" : "text-muted-foreground"}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${generatedPrompt ? "bg-green-400 text-black" : "bg-muted text-muted-foreground"}`}
            >
              2
            </div>
            <span>Prompt Generated</span>
          </div>
          <div
            className={`flex items-center gap-2 ${validationResult && validationResult.score >= 80 ? "text-green-400" : "text-muted-foreground"}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${validationResult && validationResult.score >= 80 ? "bg-green-400 text-black" : "bg-muted text-muted-foreground"}`}
            >
              3
            </div>
            <span>Validated</span>
          </div>
        </div>
      </div>

      <Accordion
        type="multiple"
        defaultValue={["config", "prompt"]}
        className="space-y-4"
      >
        {/* Config Summary Section */}
        <AccordionItem value="config">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              📦 Configuration Summary
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="p-3 glass-strong rounded">
                <div className="text-xs text-muted-foreground mb-1">Domain</div>
                <div className="font-semibold text-foreground">
                  {config.domain}
                </div>
              </div>
              <div className="p-3 glass-strong rounded">
                <div className="text-xs text-muted-foreground mb-1">Scale</div>
                <div className="font-semibold text-foreground">
                  {config.scale}
                </div>
              </div>
              <div className="p-3 glass-strong rounded">
                <div className="text-xs text-muted-foreground mb-1">
                  Urgency
                </div>
                <div className="font-semibold text-foreground">
                  {config.urgency}
                </div>
              </div>
              <div className="p-3 glass-strong rounded">
                <div className="text-xs text-muted-foreground mb-1">
                  Complexity
                </div>
                <div className="font-semibold text-foreground">
                  {config.complexity}
                </div>
              </div>
            </div>
            {generatedPrompt && (
              <div className="mt-4 p-3 glass-strong rounded text-xs text-muted-foreground">
                <strong>Session Hash:</strong> {generatedPrompt.hash} |
                <strong> Generated:</strong>{" "}
                {generatedPrompt.timestamp.toLocaleString("en-US")}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Module Objective Section */}
        {selectedModuleData && (
          <AccordionItem value="objective">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                🎯 Module Objective
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">
                    M{selectedModuleData.id.toString().padStart(2, "0")}
                  </Badge>
                  <h3 className="text-xl font-bold text-foreground">
                    {selectedModuleData.name}
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  {selectedModuleData.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 glass-strong rounded">
                    <div className="text-xs text-muted-foreground mb-1">
                      📊 KPI Target
                    </div>
                    <div className="font-semibold text-green-400">
                      {selectedModuleData.kpi}
                    </div>
                  </div>
                  <div className="p-3 glass-strong rounded">
                    <div className="text-xs text-muted-foreground mb-1">
                      ⚙️ Specification
                    </div>
                    <div className="font-semibold text-foreground line-clamp-2">
                      {selectedModuleData.spec}
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Generated Prompt Section */}
        <AccordionItem value="prompt">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              ✍️ Generated Prompt
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleGeneratePrompt}
                  disabled={!selectedModule || isGenerating}
                  className="glow-primary"
                  data-generate-button
                >
                  {isGenerating ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4 mr-2" />
                  )}
                  {generatedPrompt ? "Regenerate" : "Generate"} Prompt
                </Button>

                {generatedPrompt && (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleRerollPrompt}
                      disabled={isGenerating}
                      className="glass-effect bg-transparent"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reroll
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCopyPrompt}
                      className="glass-effect bg-transparent"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleDownloadPrompt}
                      className="glass-effect bg-transparent"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </>
                )}
              </div>

              <Textarea
                value={generatedPrompt?.prompt || ""}
                placeholder={
                  selectedModule
                    ? "The generated prompt will appear here..."
                    : "Select a module to generate a prompt"
                }
                className="min-h-[400px] font-mono text-sm glass-effect"
                readOnly
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Validation & Metrics Section */}
        {validationResult && (
          <AccordionItem value="metrics">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-400" />
                📈 Validation & Metrics
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  {validationResult.score >= 80 ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                  )}
                  <span className="text-lg font-bold text-foreground">
                    Overall Score: {validationResult.score}%
                  </span>
                  <Badge
                    variant={
                      validationResult.score >= 80 ? "default" : "secondary"
                    }
                  >
                    {validationResult.score >= 80
                      ? "✅ Execution Ready"
                      : "⚠️ Needs Review"}
                  </Badge>
                </div>

                <div className="mb-4">
                  <Progress value={validationResult.score} className="h-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {[
                    {
                      key: "hasTitle",
                      label: "Title",
                      value: validationResult.hasTitle,
                    },
                    {
                      key: "hasContext",
                      label: "Context",
                      value: validationResult.hasContext,
                    },
                    {
                      key: "hasKPI",
                      label: "KPI",
                      value: validationResult.hasKPI,
                    },
                    {
                      key: "hasOutput",
                      label: "Output",
                      value: validationResult.hasOutput,
                    },
                    {
                      key: "hasGuardrails",
                      label: "Guardrails",
                      value: validationResult.hasGuardrails,
                    },
                  ].map(({ key, label, value }) => (
                    <div
                      key={key}
                      className="p-3 glass-strong rounded text-center"
                    >
                      <div
                        className={`text-2xl mb-1 ${value ? "text-green-400" : "text-red-400"}`}
                      >
                        {value ? "✅" : "❌"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Telemetry Section */}
        {generatedPrompt && (
          <AccordionItem value="telemetry">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-400" />
                📊 Session Telemetry
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="p-3 glass-strong rounded">
                  <div className="text-xs text-muted-foreground mb-1">
                    Validation Score
                  </div>
                  <div className="text-lg font-bold text-green-400">
                    {generatedPrompt.validationScore}%
                  </div>
                </div>
                <div className="p-3 glass-strong rounded">
                  <div className="text-xs text-muted-foreground mb-1">
                    KPI Compliance
                  </div>
                  <div className="text-lg font-bold text-blue-400">
                    {generatedPrompt.kpiCompliance}%
                  </div>
                </div>
                <div className="p-3 glass-strong rounded">
                  <div className="text-xs text-muted-foreground mb-1">
                    Structure Score
                  </div>
                  <div className="text-lg font-bold text-purple-400">
                    {generatedPrompt.structureScore}%
                  </div>
                </div>
                <div className="p-3 glass-strong rounded">
                  <div className="text-xs text-muted-foreground mb-1">
                    Clarity Score
                  </div>
                  <div className="text-lg font-bold text-orange-400">
                    {generatedPrompt.clarityScore}%
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </Card>
  );
}
