/**
 * Export Bundle Component
 * UI for exporting validated runs as bundles
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { FileJson, FileImage, Archive, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

import {
  useExportBundle,
  downloadFile,
  getFileExtension,
  formatBytes,
} from '@/hooks/use-export-bundle';
import { useEntitlements } from '@/hooks/use-entitlements';

export interface ExportBundleProps {
  runId: string;
  orgId: string;
  userId: string;
  moduleId: string;
  score: number;
  className?: string;
  onExportComplete?: (bundleId: string) => void;
}

interface FormatOption {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredPlan: 'pilot' | 'pro' | 'enterprise';
  entitlementKey?: keyof import('@/app/api/entitlements/route').UserEntitlements;
}

const FORMAT_OPTIONS: FormatOption[] = [
  {
    id: 'md',
    name: 'Markdown',
    description: 'Human-readable format with documentation',
    requiredPlan: 'pilot',
  },
  {
    id: 'json',
    name: 'JSON',
    description: 'Structured data with 7D parameters and metadata',
    icon: FileJson,
    requiredPlan: 'pro',
    entitlementKey: 'canExportJSON',
  },
  {
    id: 'pdf',
    name: 'PDF',
    description: 'Professional document with branding',
    icon: FileImage,
    requiredPlan: 'pro',
    entitlementKey: 'canExportPDF',
  },
  {
    id: 'zip',
    name: 'ZIP Bundle',
    description: 'Complete package with all formats',
    icon: Archive,
    requiredPlan: 'enterprise',
    entitlementKey: 'canExportBundleZip',
  },
];

export function ExportBundle({
  runId,
  orgId,
  userId,
  moduleId,
  score,
  className,
  onExportComplete,
}: ExportBundleProps) {
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['md']);
  const { exportBundle, loading, error, lastExport } = useExportBundle();
  const { entitlements, subscription, isPlan } = useEntitlements(orgId);

  // Check if run meets DoD requirements
  const meetsDoD = score >= 80;

  const handleFormatChange = (formatId: string, checked: boolean) => {
    setSelectedFormats(prev => (checked ? [...prev, formatId] : prev.filter(f => f !== formatId)));
  };

  const handleExport = async () => {
    if (!meetsDoD) {
      return;
    }

    try {
      const result = await exportBundle({
        runId,
        formats: selectedFormats,
        orgId,
        userId,
      });

      onExportComplete?.(result.bundleId);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      await downloadFile(url, filename);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const canUseFormat = (format: FormatOption): boolean => {
    // Check plan requirement
    if (format.requiredPlan === 'pro' && !isPlan('pro') && !isPlan('enterprise')) {
      return false;
    }
    if (format.requiredPlan === 'enterprise' && !isPlan('enterprise')) {
      return false;
    }

    // Check specific entitlement
    if (format.entitlementKey && entitlements) {
      return entitlements[format.entitlementKey];
    }

    return true;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Archive className="h-5 w-5" />
          Export Bundle
        </CardTitle>
        <CardDescription>
          Generate auditable bundles from validated runs (Score ≥ 80)
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* DoD Status */}
        <div className="flex items-center gap-2">
          {meetsDoD ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <span className="text-sm">
            Score: <Badge variant={meetsDoD ? 'default' : 'destructive'}>{score}/100</Badge>
          </span>
          {meetsDoD && (
            <Badge variant="outline" className="text-green-600">
              DoD Met
            </Badge>
          )}
        </div>

        {!meetsDoD && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Run must score ≥ 80 to be eligible for export. Current score: {score}
            </AlertDescription>
          </Alert>
        )}

        {/* Format Selection */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Export Formats</h4>
          <div className="grid grid-cols-1 gap-3">
            {FORMAT_OPTIONS.map(format => {
              const canUse = canUseFormat(format);
              const isSelected = selectedFormats.includes(format.id);

              return (
                <div key={format.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={format.id}
                    checked={isSelected}
                    disabled={!canUse || !meetsDoD}
                    onCheckedChange={checked => handleFormatChange(format.id, checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none flex-1">
                    <label
                      htmlFor={format.id}
                      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 ${
                        !canUse ? 'text-muted-foreground' : ''
                      }`}
                    >
                      <format.icon className="h-4 w-4" />
                      {format.name}
                      {!canUse && (
                        <Badge variant="outline" className="text-xs">
                          {format.requiredPlan.toUpperCase()} Required
                        </Badge>
                      )}
                    </label>
                    <p className="text-xs text-muted-foreground">{format.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Export Button */}
        <Button
          onClick={handleExport}
          disabled={!meetsDoD || selectedFormats.length === 0 || loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Bundle...
            </>
          ) : (
            <>Export Bundle</>
          )}
        </Button>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Export Results */}
        {lastExport && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Export Complete</span>
              <Badge variant="outline">{lastExport.bundleId.slice(0, 8)}</Badge>
            </div>

            <div className="space-y-2">
              {Object.entries(lastExport.paths).map(([filename, url]) => (
                <Button key={filename} variant="outline" size="sm" className="w-full justify-start">
                  {filename}
                  <span className="ml-auto text-xs text-muted-foreground">
                    .{getFileExtension(filename.split('.')[0])}
                  </span>
                </Button>
              ))}
            </div>

            <div className="text-xs text-muted-foreground">
              <p>Checksum: {lastExport.checksum.slice(0, 16)}...</p>
              <p>{lastExport.license_notice}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
