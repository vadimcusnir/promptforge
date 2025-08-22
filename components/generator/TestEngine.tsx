"use client";
import {
  Play,
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
} from "lucide-react";
import type { GeneratedPrompt, TestResult } from "@/types/promptforge";

interface TestEngineProps {
  prompt: GeneratedPrompt;
  testResult: TestResult | null;
  onRunTest: () => void;
  isTesting: boolean;
  canUseGptTest: boolean;
}

export function TestEngine({
  prompt,
  testResult,
  onRunTest,
  isTesting,
  canUseGptTest,
}: TestEngineProps) {
  const getScoreColor = (score: number, isInverted = false) => {
    const threshold = isInverted ? 20 : 80;
    if (isInverted) {
      return score <= threshold
        ? "text-gold-industrial"
        : score <= 40
          ? "text-lead-gray"
          : "text-red-500";
    }
    return score >= threshold
      ? "text-gold-industrial"
      : score >= 60
        ? "text-lead-gray"
        : "text-red-500";
  };

  const getVerdictColor = (verdict: string) => {
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
    <div className="glass-effect rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-gold-industrial" />
          <h2 className="text-xl font-semibold font-montserrat">Test Engine</h2>
        </div>
        <button
          onClick={onRunTest}
          disabled={isTesting || !canUseGptTest}
          className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${
            !canUseGptTest
              ? "bg-lead-gray/20 text-lead-gray cursor-not-allowed"
              : isTesting
                ? "bg-gold-industrial/20 text-gold-industrial cursor-not-allowed"
                : "bg-gold-industrial text-black hover:bg-gold-industrial/90 hover:shadow-lg hover:shadow-gold-industrial/20"
          }`}
          data-gate={!canUseGptTest ? "pro" : undefined}
          title={
            !canUseGptTest
              ? "Real test scoring available in Pro. See plans."
              : ""
          }
        >
          {isTesting ? (
            <>
              <div className="w-4 h-4 border-2 border-gold-industrial/30 border-t-gold-industrial rounded-full animate-spin"></div>
              Testing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              {canUseGptTest ? "Run Test (Real)" : "Run Test (Demo)"}
            </>
          )}
        </button>
      </div>

      {!canUseGptTest && (
        <div className="mb-6 p-4 bg-lead-gray/10 border border-lead-gray/20 rounded-lg">
          <div className="flex items-center gap-2 text-lead-gray">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">
              Real test scoring requires Pro plan. Try demo or upgrade for full
              features.
            </span>
          </div>
        </div>
      )}

      {testResult && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-black/30 rounded-lg">
              <div className="text-2xl font-bold mb-1">
                <span className={getScoreColor(testResult.scores.clarity)}>
                  {testResult.scores.clarity}
                </span>
              </div>
              <div className="text-sm text-lead-gray">Clarity</div>
              <div className="text-xs text-lead-gray mt-1">≥80 target</div>
            </div>

            <div className="text-center p-4 bg-black/30 rounded-lg">
              <div className="text-2xl font-bold mb-1">
                <span className={getScoreColor(testResult.scores.execution)}>
                  {testResult.scores.execution}
                </span>
              </div>
              <div className="text-sm text-lead-gray">Execution</div>
              <div className="text-xs text-lead-gray mt-1">≥80 target</div>
            </div>

            <div className="text-center p-4 bg-black/30 rounded-lg">
              <div className="text-2xl font-bold mb-1">
                <span
                  className={getScoreColor(testResult.scores.ambiguity, true)}
                >
                  {testResult.scores.ambiguity}
                </span>
              </div>
              <div className="text-sm text-lead-gray">Ambiguity</div>
              <div className="text-xs text-lead-gray mt-1">≤20 target</div>
            </div>

            <div className="text-center p-4 bg-black/30 rounded-lg">
              <div className="text-2xl font-bold mb-1">
                <span className={getScoreColor(testResult.scores.business_fit)}>
                  {testResult.scores.business_fit}
                </span>
              </div>
              <div className="text-sm text-lead-gray">Business Fit</div>
              <div className="text-xs text-lead-gray mt-1">≥75 target</div>
            </div>
          </div>

          <div
            id="test-verdict"
            className="text-center p-6 bg-black/50 rounded-lg border border-lead-gray/20"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              {testResult.verdict === "PASS" && (
                <CheckCircle className="w-8 h-8 text-gold-industrial" />
              )}
              {testResult.verdict === "PARTIAL" && (
                <AlertCircle className="w-8 h-8 text-lead-gray" />
              )}
              {testResult.verdict === "FAIL" && (
                <XCircle className="w-8 h-8 text-red-500" />
              )}
              <div
                className={`text-3xl font-bold ${getVerdictColor(testResult.verdict)}`}
              >
                {testResult.verdict}
              </div>
            </div>

            {testResult.verdict === "FAIL" && (
              <div className="mt-4">
                <button className="px-6 py-3 bg-gold-industrial text-black rounded-lg font-medium hover:bg-gold-industrial/90 transition-colors">
                  Optimize for Enterprise
                </button>
              </div>
            )}

            {testResult.recommendations.length > 0 && (
              <div className="mt-4 text-left">
                <h4 className="font-medium mb-2">Recommendations:</h4>
                <ul className="text-sm text-lead-gray space-y-1">
                  {testResult.recommendations.map((rec, i) => (
                    <li key={i}>• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {!testResult && !isTesting && (
        <div className="text-center py-12 text-lead-gray">
          <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Ready to test your prompt</p>
          <p className="text-sm">
            Click "Run Test" to evaluate on 4 scoring axes
          </p>
        </div>
      )}
    </div>
  );
}
