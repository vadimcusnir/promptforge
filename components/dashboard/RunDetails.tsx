"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { TelemetrySummary } from "@/components/ui/TelemetrySummary";
import { Separator } from "@/components/ui/separator";
import { Settings, Clock, Download, RotateCcw, GitCompare } from "lucide-react";

interface RunRecord {
  id: string;
  hash: string;
  module: string;
  moduleCode: string;
  score: number;
  status: "PASS" | "PARTIAL" | "FAIL";
  date: Date;
  exportType: string[];
  config7D: any;
  telemetry: any;
  actions: string[];
}

interface RunDetailsProps {
  run: RunRecord;
  tier: string;
}

export function RunDetails({ run, tier }: RunDetailsProps) {
  const canExportBundle = tier === "Enterprise";
  const canRestore = run.score >= 80 || tier !== "Basic";

  return (
    <Card className="glass-strong p-6 sticky top-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">Run Details</h3>
            <ScoreBadge score={run.score} status={run.status} />
          </div>
          <code className="text-sm font-mono text-lead-gray">{run.hash}</code>
        </div>

        <Separator className="bg-lead-gray/20" />

        {/* Module Info */}
        <div>
          <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Module Configuration
          </h4>
          <div className="space-y-2">
            <p className="text-sm text-white">{run.module}</p>
            <Badge
              variant="outline"
              className="text-blue-400 border-blue-400/30"
            >
              {run.moduleCode}
            </Badge>
          </div>
        </div>

        <Separator className="bg-lead-gray/20" />

        {/* 7D Configuration */}
        <div>
          <h4 className="text-sm font-medium text-white mb-3">
            7D Configuration
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(run.config7D).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-lead-gray capitalize">{key}:</span>
                <span className="text-white">{value as string}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-lead-gray/20" />

        {/* Detailed Scores */}
        <div>
          <h4 className="text-sm font-medium text-white mb-3">
            Score Breakdown
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-lead-gray">Clarity:</span>
              <span className="text-green-400">92/100</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-lead-gray">Execution:</span>
              <span className="text-gold-industrial">85/100</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-lead-gray">Ambiguity:</span>
              <span className="text-red-400">78/100</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-lead-gray">Fit:</span>
              <span className="text-green-400">88/100</span>
            </div>
          </div>
        </div>

        <Separator className="bg-lead-gray/20" />

        {/* Telemetry */}
        <TelemetrySummary telemetry={run.telemetry} />

        <Separator className="bg-lead-gray/20" />

        {/* Action History */}
        <div>
          <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Action History
          </h4>
          <div className="space-y-1">
            {run.actions.map((action, index) => (
              <div key={index} className="text-xs text-lead-gray">
                • {action}
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-lead-gray/20" />

        {/* Quick Actions */}
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start bg-transparent"
            disabled={!canRestore}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Restore Config
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start bg-transparent"
            disabled={run.score < 80}
          >
            <GitCompare className="w-4 h-4 mr-2" />
            Diff vs Current
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start bg-transparent"
            disabled={!canExportBundle}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Bundle
            {!canExportBundle && (
              <Badge
                variant="outline"
                className="ml-2 text-xs text-gold-industrial"
              >
                Enterprise
              </Badge>
            )}
          </Button>
        </div>

        {/* Export Types */}
        <div>
          <h4 className="text-sm font-medium text-white mb-2">
            Available Exports
          </h4>
          <div className="flex flex-wrap gap-1">
            {run.exportType.map((type) => (
              <Badge key={type} variant="outline" className="text-xs">
                .{type}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
