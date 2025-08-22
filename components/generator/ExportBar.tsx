"use client";

import { useState } from "react";
import { Download, FileText, Code, Package, Lock } from "lucide-react";
import { EntitlementGate, useFeatureAccess } from "@/components/billing/EntitlementGate";
import type { GeneratedPrompt, TestResult } from "@/types/promptforge";

interface ExportBarProps {
  prompt: GeneratedPrompt;
  testResult: TestResult | null;
  onExport: (format: string) => void;
  orgId: string; // Added for entitlements
}

export function ExportBar({ prompt, testResult, onExport, orgId }: ExportBarProps) {
  const [showManifest, setShowManifest] = useState(false);

  const exportFormats = [
    {
      format: "txt",
      label: ".txt",
      icon: FileText,
      free: true,
      description: "Plain text format",
    },
    {
      format: "md",
      label: ".md",
      icon: FileText,
      entitlement: "canExportMD" as const,
      description: "Markdown format",
    },
    {
      format: "json",
      label: ".json",
      icon: Code,
      entitlement: "canExportJSON" as const,
      description: "Structured JSON with metadata",
    },
    {
      format: "pdf",
      label: ".pdf",
      icon: FileText,
      entitlement: "canExportPDF" as const,
      description: "Professional PDF report",
    },
    {
      format: "zip",
      label: ".zip",
      icon: Package,
      entitlement: "canExportBundleZip" as const,
      description: "Complete bundle with assets",
    },
  ];

  const generateChecksum = () => {
    return `SHA256: ${prompt.hash}${Date.now().toString(36)}`;
  };

  const generateManifest = () => {
    return {
      prompt_id: prompt.id,
      module_id: prompt.moduleId,
      timestamp: prompt.timestamp.toISOString(),
      checksum: generateChecksum(),
      test_score: testResult
        ? Object.values(testResult.scores).reduce((a, b) => a + b, 0) / 4
        : null,
      verdict: testResult?.verdict || "UNTESTED",
      license: "PROMPTFORGE™ Enterprise License",
      signature_7d: JSON.stringify(prompt.sevenDConfig),
    };
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-lead-gray/20 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-gold-industrial" />
              <span className="font-medium">Export</span>
            </div>

            <div className="flex gap-2">
              {exportFormats.map(
                ({ format, label, icon: Icon, free, entitlement, description }) => {
                  if (free) {
                    // Free formats don't need entitlement checks
                    return (
                      <button
                        key={format}
                        onClick={() => onExport(format)}
                        className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all bg-gold-industrial text-black hover:bg-gold-industrial/90"
                        title={description}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </button>
                    );
                  }

                  // Premium formats use EntitlementGate
                  return (
                    <EntitlementGate
                      key={format}
                      orgId={orgId}
                      feature={entitlement!}
                      mode="modal"
                      trigger={`export_${format}`}
                    >
                      <button
                        onClick={() => onExport(format)}
                        className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all bg-gold-industrial text-black hover:bg-gold-industrial/90"
                        title={description}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </button>
                    </EntitlementGate>
                  );
                },
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={() => setShowManifest(!showManifest)}
              className="text-lead-gray hover:text-white transition-colors"
            >
              {showManifest ? "Hide" : "Show"} Manifest
            </button>
            <div className="text-lead-gray">
              Checksum:{" "}
              <span className="font-mono text-gold-industrial">
                {generateChecksum().slice(-8)}
              </span>
            </div>
          </div>
        </div>

        {showManifest && (
          <div className="mt-4 p-4 bg-black/50 rounded-lg border border-lead-gray/20">
            <pre className="text-xs text-lead-gray overflow-x-auto">
              {JSON.stringify(generateManifest(), null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
