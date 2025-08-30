"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Lock, Crown, Zap, AlertCircle, CheckCircle } from "lucide-react";
import { useEntitlements } from "@/hooks/use-entitlements";
import { PlanGate } from "./BadgePlan";
import { useToast } from "@/hooks/use-toast";

interface RunRealTestProps {
  onRunTest: () => void;
  isRunning?: boolean;
  disabled?: boolean;
  className?: string;
}

export function RunRealTest({ 
  onRunTest, 
  isRunning = false, 
  disabled = false, 
  className = "" 
}: RunRealTestProps) {
  const { hasEntitlement, getRequiredPlan } = useEntitlements();
  const { toast } = useToast();
  const [showDetails, setShowDetails] = useState(false);

  const hasAccess = hasEntitlement('canUseGptTestReal');
  const currentPlan = getRequiredPlan('canUseGptTestReal') || 'pilot';

  const handleRunTest = () => {
    if (!hasAccess) {
      toast({
        title: "Pro Plan Required",
        description: "Real GPT testing requires a Pro or Enterprise plan",
        variant: "destructive"
      });
      return;
    }

    onRunTest();
  };

  const testFeatures = [
    {
      name: "Real GPT-4 Testing",
      description: "Test prompts against actual GPT-4 API",
      available: hasAccess
    },
    {
      name: "Performance Metrics",
      description: "Get detailed performance scores and analysis",
      available: hasAccess
    },
    {
      name: "Response Quality Analysis",
      description: "AI-powered quality assessment of responses",
      available: hasAccess
    },
    {
      name: "Cost Estimation",
      description: "Track API usage and costs",
      available: hasAccess
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-400 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-white">
                  Real GPT Testing
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Test your prompts against actual AI models
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge 
                className={`${
                  hasAccess 
                    ? 'bg-green-600 text-white' 
                    : 'bg-amber-600 text-white'
                }`}
                variant="secondary"
              >
                {hasAccess ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Available
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 mr-1" />
                    Pro Required
                  </>
                )}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {testFeatures.map((feature, index) => (
              <div 
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  feature.available 
                    ? 'bg-green-500/10 border border-green-500/20' 
                    : 'bg-slate-800/50 border border-slate-700/50'
                }`}
              >
                {feature.available ? (
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                ) : (
                  <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium text-white">
                    {feature.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Current Plan:</span>
              <Badge 
                className={`${
                  currentPlan === 'pilot' ? 'bg-slate-600' :
                  currentPlan === 'pro' ? 'bg-amber-600' : 'bg-purple-600'
                } text-white`}
                variant="secondary"
              >
                {currentPlan === 'pilot' ? (
                  <>
                    <Zap className="w-3 h-3 mr-1" />
                    Free
                  </>
                ) : currentPlan === 'pro' ? (
                  <>
                    <Crown className="w-3 h-3 mr-1" />
                    Pro
                  </>
                ) : (
                  <>
                    <Crown className="w-3 h-3 mr-1" />
                    Enterprise
                  </>
                )}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="text-slate-400 hover:text-white"
              >
                {showDetails ? 'Hide' : 'Show'} Details
              </Button>
              
              <PlanGate 
                requiredPlan="pro" 
                fallback={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = '/pricing'}
                    className="border-amber-500 text-amber-400 hover:bg-amber-500/10"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                }
              >
                <Button
                  onClick={handleRunTest}
                  disabled={disabled || isRunning}
                  className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isRunning ? 'Running Test...' : 'Run Real Test'}
                </Button>
              </PlanGate>
            </div>
          </div>

          {showDetails && (
            <div className="mt-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium text-white">How Real Testing Works</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Your prompt is sent to the actual GPT-4 API</li>
                    <li>• Response quality is analyzed using AI evaluation</li>
                    <li>• Performance metrics include speed, cost, and quality scores</li>
                    <li>• Results are saved to your dashboard for future reference</li>
                  </ul>
                  {!hasAccess && (
                    <p className="text-sm text-amber-300 font-medium">
                      Upgrade to Pro to unlock real GPT testing capabilities
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface TestGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function TestGate({ children, fallback }: TestGateProps) {
  const { hasEntitlement } = useEntitlements();
  
  if (hasEntitlement('canUseGptTestReal')) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg">
        <div className="text-center p-4">
          <Lock className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <p className="text-sm text-white font-medium">
            Pro Plan Required
          </p>
        </div>
      </div>
    </div>
  );
}
