"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
type Plan = 'free' | 'creator' | 'pro' | 'enterprise';

interface ExportWithScoreGateProps {
  plan: Plan;
  promptScore: number;
  moduleId: string;
  onExport: (format: string) => void;
}

export function ExportWithScoreGate({ 
  plan, 
  promptScore, 
  moduleId, 
  onExport 
}: ExportWithScoreGateProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>('txt');

  // Check if the score is sufficient for export
  const canExportWithScore = promptScore >= 80;
  
  // Check what formats the plan can export (hardcoded for example)
  const exportFormats = [
    { key: 'txt', label: 'Text (.txt)', available: true },
    { key: 'md', label: 'Markdown (.md)', available: true },
    { key: 'json', label: 'JSON (.json)', available: plan === 'pro' || plan === 'enterprise' },
    { key: 'pdf', label: 'PDF (.pdf)', available: plan === 'pro' || plan === 'enterprise' },
    { key: 'bundle', label: 'Bundle (.zip)', available: plan === 'enterprise' }
  ];

  const handleExport = () => {
    if (canExportWithScore) {
      onExport(selectedFormat);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Export Module {moduleId}
          <Badge variant={canExportWithScore ? "default" : "destructive"}>
            Score: {promptScore}/100
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Score Gate Warning */}
        {!canExportWithScore && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800 font-medium">
              ⚠️ Export blocked: Score too low
            </p>
            <p className="text-xs text-red-600 mt-1">
              Your prompt score is {promptScore}/100. 
              You need at least 80/100 to export.
            </p>
          </div>
        )}

        {/* Format Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Export Format:</label>
          <div className="grid grid-cols-2 gap-2">
            {exportFormats.map((format) => (
              <Button
                key={format.key}
                variant={selectedFormat === format.key ? "default" : "outline"}
                size="sm"
                disabled={!format.available || !canExportWithScore}
                onClick={() => setSelectedFormat(format.key)}
                className="justify-start"
              >
                {format.label}
                {!format.available && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {plan === 'free' ? 'Creator+' : plan === 'creator' ? 'Pro+' : 'Enterprise'}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Export Button */}
        <Button
          onClick={handleExport}
          disabled={!canExportWithScore}
          className="w-full"
          size="lg"
        >
          {canExportWithScore ? 'Export Now' : 'Score Too Low'}
        </Button>

        {/* Plan Upgrade Hint */}
        {!canExportWithScore && (
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Upgrade to Pro+ to unlock all export formats
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
