"use client";

import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Zap, Shield } from "lucide-react";
import type { BrandLinterResult } from "@/lib/brand-linter";

interface BrandLinterAlertProps {
  result: BrandLinterResult;
  onApplyFixes?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function BrandLinterAlert({
  result,
  onApplyFixes,
  onDismiss,
  className = "",
}: BrandLinterAlertProps) {
  const [isApplyingFixes, setIsApplyingFixes] = useState(false);

  const handleApplyFixes = async () => {
    if (!onApplyFixes) return;

    setIsApplyingFixes(true);
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate processing
    onApplyFixes();
    setIsApplyingFixes(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  const isBlocked = result.score < 80;

  return (
    <Alert
      variant={isBlocked ? "destructive" : "default"}
      className={`glass-effect border-2 ${isBlocked ? "border-red-500/50" : "border-green-500/50"} ${className}`}
    >
      <div className="flex items-start gap-3">
        {isBlocked ? (
          <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
        ) : (
          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
        )}

        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <AlertTitle className="text-lg font-semibold">
              {isBlocked
                ? "Prompt Blocked – Score Below Threshold"
                : "Prompt Approved – Ready for Export"}
            </AlertTitle>

            <div className="flex items-center gap-2">
              <Badge
                variant={getScoreBadgeVariant(result.score)}
                className={`${getScoreColor(result.score)} font-bold`}
              >
                <Shield className="w-3 h-3 mr-1" />
                Score: {result.score}/100
              </Badge>
            </div>
          </div>

          <Progress
            value={result.score}
            className="h-2"
            // @ts-ignore
            style={{
              "--progress-background":
                result.score >= 80
                  ? "#22c55e"
                  : result.score >= 60
                    ? "#eab308"
                    : "#ef4444",
            }}
          />

          <AlertDescription className="space-y-3">
            {isBlocked && (
              <p className="text-sm text-muted-foreground">
                Your prompt doesn't meet PROMPTFORGE™ brand standards. Issues
                detected: {result.breaches.join(", ").replace(/_/g, " ")}.
              </p>
            )}

            {result.fixes.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gold-industrial">
                  Suggested Improvements:
                </h4>
                <ul className="space-y-1">
                  {result.fixes.map((fix, index) => (
                    <li
                      key={index}
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-gold-industrial">•</span>
                      {fix}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              {isBlocked && onApplyFixes && (
                <Button
                  onClick={handleApplyFixes}
                  disabled={isApplyingFixes}
                  className="btn-primary"
                  size="sm"
                >
                  {isApplyingFixes ? (
                    <>
                      <div className="animate-spin w-3 h-3 border border-black border-t-transparent rounded-full mr-2" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-3 h-3 mr-2" />
                      Auto-Optimize Prompt
                    </>
                  )}
                </Button>
              )}

              {onDismiss && (
                <Button
                  onClick={onDismiss}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  Dismiss
                </Button>
              )}
            </div>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
}
