"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  IndustrialCard,
  IndustrialButton,
  IndustrialBadge,
  IndustrialProgress,
} from "@/components/industrial-ui";
import { ExportBundleEngine, type ExportFormat } from "@/lib/export-bundle";
import { PremiumGate } from "@/lib/premium-features";
import type { GeneratedPrompt } from "@/types/promptforge";
import type { GPTEditResult } from "@/lib/gpt-editor";
import type { TestResult } from "@/lib/test-engine";
import {
  Package,
  Download,
  Settings,
  FileText,
  Database,
  BarChart3,
  Crown,
  Lock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportBundleManagerProps {
  currentPrompt?: GeneratedPrompt | null;
  editResults?: GPTEditResult[];
  testResults?: TestResult[];
}

export function ExportBundleManager({
  currentPrompt,
  editResults = [],
  testResults = [],
}: ExportBundleManagerProps) {
  const [bundleName, setBundleName] = useState(
    `PROMPTFORGE Export ${new Date().toLocaleDateString()}`,
  );
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("bundle");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [includeOptions, setIncludeOptions] = useState({
    prompts: true,
    edits: true,
    tests: true,
    history: true,
    analytics: true,
  });
  const [customization, setCustomization] = useState({
    companyName: "",
    customHeader: "",
    customFooter: "",
  });

  const { toast } = useToast();
  const bundleEngine = ExportBundleEngine.getInstance();
  const premiumGate = PremiumGate.getInstance();
  const currentTier = premiumGate.getCurrentTier();

  const formatOptions: Array<{
    value: ExportFormat;
    label: string;
    tier: string;
    description: string;
  }> = [
    {
      value: "txt",
      label: "TXT Report",
      tier: "free",
      description: "Simple text report with basic statistics",
    },
    {
      value: "json",
      label: "JSON Data",
      tier: "free",
      description: "Structured data export for developers",
    },
    {
      value: "csv",
      label: "CSV Spreadsheet",
      tier: "pro",
      description: "Tabular data for analysis tools",
    },
    {
      value: "markdown",
      label: "Markdown",
      tier: "pro",
      description: "Documentation-ready format",
    },
    {
      value: "xml",
      label: "XML Data",
      tier: "pro",
      description: "Structured markup for integrations",
    },
    {
      value: "pdf",
      label: "PDF Report",
      tier: "pro",
      description: "Professional presentation format",
    },
    {
      value: "docx",
      label: "Word Document",
      tier: "enterprise",
      description: "Editable document format",
    },
    {
      value: "bundle",
      label: "Complete Bundle",
      tier: "enterprise",
      description: "All formats in one package",
    },
  ];

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setExportProgress(0);

      // Check if format is allowed
      if (!premiumGate.canExportFormat(selectedFormat)) {
        const requiredTier =
          formatOptions.find((f) => f.value === selectedFormat)?.tier || "pro";
        toast({
          title: "Premium Feature Required",
          description: `${selectedFormat.toUpperCase()} export requires ${requiredTier} plan`,
        });
        return;
      }

      setExportProgress(20);

      // Create bundle
      const bundle = await bundleEngine.createBundle(
        bundleName,
        selectedFormat,
        {
          includePrompts: includeOptions.prompts,
          includeEdits: includeOptions.edits,
          includeTests: includeOptions.tests,
          includeHistory: includeOptions.history,
          includeAnalytics: includeOptions.analytics,
          customization,
        },
      );

      setExportProgress(60);

      // Export bundle
      const blob = await bundleEngine.exportBundle(bundle);

      setExportProgress(90);

      // Download file
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${bundleName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.${selectedFormat === "bundle" ? "json" : selectedFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportProgress(100);

      toast({
        title: "Export Complete!",
        description: `Bundle exported as ${selectedFormat.toUpperCase()} (${(blob.size / 1024).toFixed(2)} KB)`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportProgress(0), 2000);
    }
  };

  const getFormatIcon = (format: ExportFormat) => {
    switch (format) {
      case "bundle":
        return <Package className="w-4 h-4" />;
      case "pdf":
      case "docx":
        return <FileText className="w-4 h-4" />;
      case "csv":
      case "json":
      case "xml":
        return <Database className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const isFormatLocked = (tier: string) => {
    if (tier === "free") return false;
    if (
      tier === "pro" &&
      (currentTier.id === "pro" || currentTier.id === "enterprise")
    )
      return false;
    if (tier === "enterprise" && currentTier.id === "enterprise") return false;
    return true;
  };

  return (
    <div className="space-y-6">
      <IndustrialCard variant="elevated" glow className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-400 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text">
            Export Bundle Engine
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <IndustrialCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">
                  Bundle Configuration
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">
                    Bundle Name
                  </label>
                  <Input
                    value={bundleName}
                    onChange={(e) => setBundleName(e.target.value)}
                    className="industrial-input"
                    placeholder="Enter bundle name..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">
                    Export Format
                  </label>
                  <Select
                    value={selectedFormat}
                    onValueChange={(value: ExportFormat) =>
                      setSelectedFormat(value)
                    }
                  >
                    <SelectTrigger className="industrial-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {formatOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          disabled={isFormatLocked(option.tier)}
                        >
                          <div className="flex items-center gap-2">
                            {getFormatIcon(option.value)}
                            <span>{option.label}</span>
                            {isFormatLocked(option.tier) && (
                              <Lock className="w-3 h-3 text-amber-400" />
                            )}
                            <IndustrialBadge
                              variant={
                                option.tier === "free"
                                  ? "default"
                                  : option.tier === "pro"
                                    ? "info"
                                    : "success"
                              }
                              size="sm"
                            >
                              {option.tier}
                            </IndustrialBadge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-400 mt-1">
                    {
                      formatOptions.find((f) => f.value === selectedFormat)
                        ?.description
                    }
                  </p>
                </div>
              </div>
            </IndustrialCard>

            <IndustrialCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-white">
                  Include Content
                </h3>
              </div>

              <div className="space-y-3">
                {[
                  { key: "prompts", label: "Generated Prompts", count: 1 },
                  {
                    key: "edits",
                    label: "GPT Optimizations",
                    count: editResults.length,
                  },
                  {
                    key: "tests",
                    label: "Test Results",
                    count: testResults.length,
                  },
                  { key: "history", label: "Session History", count: 25 },
                  {
                    key: "analytics",
                    label: "Performance Analytics",
                    count: 1,
                  },
                ].map(({ key, label, count }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={
                          includeOptions[key as keyof typeof includeOptions]
                        }
                        onCheckedChange={(checked) =>
                          setIncludeOptions((prev) => ({
                            ...prev,
                            [key]: checked,
                          }))
                        }
                      />
                      <label
                        htmlFor={key}
                        className="text-sm text-white cursor-pointer"
                      >
                        {label}
                      </label>
                    </div>
                    <IndustrialBadge variant="default" size="sm">
                      {count} items
                    </IndustrialBadge>
                  </div>
                ))}
              </div>
            </IndustrialCard>

            {(currentTier.id === "pro" || currentTier.id === "enterprise") && (
              <IndustrialCard className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Customization
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-cyan-300 mb-2">
                      Company Name
                    </label>
                    <Input
                      value={customization.companyName}
                      onChange={(e) =>
                        setCustomization((prev) => ({
                          ...prev,
                          companyName: e.target.value,
                        }))
                      }
                      className="industrial-input"
                      placeholder="Your company name..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cyan-300 mb-2">
                      Custom Header
                    </label>
                    <Textarea
                      value={customization.customHeader}
                      onChange={(e) =>
                        setCustomization((prev) => ({
                          ...prev,
                          customHeader: e.target.value,
                        }))
                      }
                      className="industrial-input"
                      placeholder="Custom header text..."
                      rows={2}
                    />
                  </div>
                </div>
              </IndustrialCard>
            )}
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <IndustrialCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">
                  Bundle Preview
                </h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-cyan-400">
                      {Object.values(includeOptions).filter(Boolean).length}
                    </div>
                    <div className="text-xs text-slate-400">Content Types</div>
                  </div>
                  <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">
                      {selectedFormat.toUpperCase()}
                    </div>
                    <div className="text-xs text-slate-400">Export Format</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-600/30">
                  <div className="text-sm text-slate-300 font-mono">
                    {bundleName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.
                    {selectedFormat === "bundle" ? "json" : selectedFormat}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Estimated size: ~
                    {Math.max(
                      50,
                      Object.values(includeOptions).filter(Boolean).length * 25,
                    )}{" "}
                    KB
                  </div>
                </div>

                {isExporting && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Exporting...</span>
                      <span className="text-white">{exportProgress}%</span>
                    </div>
                    <IndustrialProgress value={exportProgress} />
                  </div>
                )}
              </div>
            </IndustrialCard>

            <IndustrialCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-semibold text-white">
                  Current Plan: {currentTier.name}
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Available Formats</span>
                  <span className="text-white">
                    {currentTier.limits.exportFormats.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {currentTier.limits.exportFormats.map((format) => (
                    <IndustrialBadge key={format} variant="success" size="sm">
                      {format.toUpperCase()}
                    </IndustrialBadge>
                  ))}
                </div>
              </div>
            </IndustrialCard>

            <IndustrialButton
              variant="primary"
              size="lg"
              onClick={handleExport}
              disabled={isExporting || !bundleName.trim()}
              loading={isExporting}
              className="w-full"
            >
              <Download className="w-5 h-5 mr-2" />
              {isExporting ? "Exporting Bundle..." : "Export Bundle"}
            </IndustrialButton>
          </div>
        </div>
      </IndustrialCard>
    </div>
  );
}
