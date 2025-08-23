/**
 * Export Integration Component
 * Shows how export functionality integrates with the test engine
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TestTube, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

import { ExportBundle } from '@/components/export-bundle';

export interface TestResult {
  runId: string;
  moduleId: string;
  score: {
    clarity: number;
    execution: number;
    ambiguity: number;
    business_fit: number;
    overall_score: number;
  };
  status: 'success' | 'error' | 'partial';
  output: string;
  duration_ms: number;
  tokens_used: number;
  cost_usd: number;
}

export interface ExportIntegrationProps {
  testResult: TestResult;
  orgId: string;
  userId: string;
  className?: string;
}

export function ExportIntegration({
  testResult,
  orgId,
  userId,
  className,
}: ExportIntegrationProps) {
  const [showExport, setShowExport] = useState(false);

  const { runId, moduleId, score, status } = testResult;
  const meetsDoD = score.overall_score >= 80;
  const isSuccessful = status === 'success';
  const isExportEligible = meetsDoD && isSuccessful;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'partial':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'error':
        return <XCircle className="h-4 w-4" />;
      case 'partial':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <TestTube className="h-4 w-4" />;
    }
  };

  return (
    <div className={className}>
      {/* Test Results Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Test Results - {moduleId}
          </CardTitle>
          <CardDescription>Run ID: {runId.slice(0, 8)}...</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Status & Score */}
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 ${getStatusColor(status)}`}>
              {getStatusIcon(status)}
              <span className="font-medium capitalize">{status}</span>
            </div>
            <Badge variant={meetsDoD ? 'default' : 'destructive'}>
              Score: {score.overall_score}/100
            </Badge>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Clarity:</span>
              <span className="ml-2 font-medium">{score.clarity}/25</span>
            </div>
            <div>
              <span className="text-muted-foreground">Execution:</span>
              <span className="ml-2 font-medium">{score.execution}/25</span>
            </div>
            <div>
              <span className="text-muted-foreground">Ambiguity:</span>
              <span className="ml-2 font-medium">{score.ambiguity}/25</span>
            </div>
            <div>
              <span className="text-muted-foreground">Business Fit:</span>
              <span className="ml-2 font-medium">{score.business_fit}/25</span>
            </div>
          </div>

          {/* Performance Metrics */}
          <Separator />
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Duration:</span>
              <span className="ml-2 font-medium">{testResult.duration_ms}ms</span>
            </div>
            <div>
              <span className="text-muted-foreground">Tokens:</span>
              <span className="ml-2 font-medium">{testResult.tokens_used}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Cost:</span>
              <span className="ml-2 font-medium">${testResult.cost_usd.toFixed(4)}</span>
            </div>
          </div>

          {/* Export Eligibility */}
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isExportEligible ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm">
                {isExportEligible ? 'Export Eligible' : 'Export Not Available'}
              </span>
            </div>

            {isExportEligible && (
              <Button variant="outline" size="sm" onClick={() => setShowExport(!showExport)}>
                {showExport ? 'Hide Export' : 'Show Export'}
              </Button>
            )}
          </div>

          {/* Export Requirements */}
          {!isExportEligible && (
            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
              <p className="font-medium mb-1">Export Requirements:</p>
              <ul className="space-y-1">
                <li className={`flex items-center gap-2 ${isSuccessful ? 'text-green-600' : ''}`}>
                  {isSuccessful ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  Run must complete successfully
                </li>
                <li className={`flex items-center gap-2 ${meetsDoD ? 'text-green-600' : ''}`}>
                  {meetsDoD ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  Score must be ≥ 80 (DoD requirement)
                </li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Component */}
      {showExport && isExportEligible && (
        <div className="mt-4">
          <ExportBundle
            runId={runId}
            orgId={orgId}
            userId={userId}
            moduleId={moduleId}
            score={score.overall_score}
            onExportComplete={bundleId => {
              console.log('Export completed:', bundleId);
              // Could trigger analytics, show success toast, etc.
            }}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Example usage in test results page
 */
export function TestResultsWithExport() {
  // This would come from your test engine results
  const mockTestResult: TestResult = {
    runId: '123e4567-e89b-12d3-a456-426614174000',
    moduleId: 'M07',
    score: {
      clarity: 22,
      execution: 21,
      ambiguity: 21,
      business_fit: 22,
      overall_score: 86,
    },
    status: 'success',
    output: 'Generated prompt content...',
    duration_ms: 2340,
    tokens_used: 1250,
    cost_usd: 0.0045,
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Test Results</h1>

      <ExportIntegration testResult={mockTestResult} orgId="org-uuid" userId="user-uuid" />
    </div>
  );
}
