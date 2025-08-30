"use client";

import { Activity, Clock, Hash, Target } from "lucide-react";
import type { TestResult } from "@/types/promptforge";

interface TelemetryBadgeProps {
  runId: string;
  tta: number;
  tokens: number;
  score: TestResult;
}

export function TelemetryBadge({
  runId,
  tta,
  tokens,
  score,
}: TelemetryBadgeProps) {
  const averageScore =
    Object.values(score.scores).reduce((a, b) => a + b, 0) / 4;
  const getScoreColor = (verdict: string) => {
    switch (verdict) {
      case "PASS":
        return "text-gold-industrial";
      case "PARTIAL":
        return "text-lead-gray";
      case "FAIL":
        return "text-red-500";
      default:
        return "text-lead-gray";
    }
  };

  return (
    <div className="fixed bottom-20 right-6 bg-black/90 backdrop-blur-sm border border-lead-gray/30 rounded-lg p-4 shadow-xl z-40">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-4 h-4 text-gold-industrial" />
        <span className="text-sm font-medium">Telemetry</span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <Hash className="w-3 h-3 text-lead-gray" />
          <span className="text-lead-gray">run_id:</span>
          <span className="font-mono text-gold-industrial">{runId}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3 text-lead-gray" />
          <span className="text-lead-gray">TTA:</span>
          <span className="font-mono text-white">{tta.toFixed(2)}s</span>
        </div>

        <div className="flex items-center gap-2">
          <Target className="w-3 h-3 text-lead-gray" />
          <span className="text-lead-gray">tokens:</span>
          <span className="font-mono text-white">{tokens}</span>
        </div>

        <div className="flex items-center gap-2">
          <Target className="w-3 h-3 text-lead-gray" />
          <span className="text-lead-gray">score:</span>
          <span className={`font-mono ${getScoreColor(score.verdict)}`}>
            {Math.round(averageScore)}/100 ({score.verdict})
          </span>
        </div>
      </div>
    </div>
  );
}
