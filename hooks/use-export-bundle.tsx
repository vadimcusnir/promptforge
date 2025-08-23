// PROMPTFORGE™ v3 - Export Bundle Hook cu SACF Security
// Hook pentru export bundle cu gating pe plan și validare completă

import { useState, useCallback } from 'react';
import { useEntitlementsContext } from './use-entitlements';

export type ExportFormat = 'txt' | 'md' | 'json' | 'pdf' | 'zip';

interface ExportCapabilities {
  baseFormats: ExportFormat[];
  availableFormats: ExportFormat[];
  restrictions: string[];
}

interface ExportBundleResponse {
  success: boolean;
  bundle: {
    id: string;
    runId: string;
    moduleId: string;
    version: string;
    formats: ExportFormat[];
    checksum: string;
    artifacts: number;
    exportedAt: string;
  };
  paths: Record<string, string>;
  manifest: any;
  zipInfo?: {
    zipName: string;
    content: Buffer;
  };
  metadata: {
    score: number;
    domain: string;
    totalFiles: number;
    hasWatermark: boolean;
  };
}

interface UseExportBundleReturn {
  // Export function
  exportBundle: (params: {
    runId: string;
    moduleId: string;
    parameterSet7D: any;
    promptText: string;
    mdReport: string;
    jsonPayload: any;
    requestedFormats?: ExportFormat[];
    licenseNotice?: string;
    version?: string;
  }) => Promise<ExportBundleResponse>;

  // Capabilities check
  checkCapabilities: () => Promise<ExportCapabilities>;

  // State
  exporting: boolean;
  exportError: string | null;
  lastExport: ExportBundleResponse | null;
  capabilities: ExportCapabilities | null;

  // Gating info
  canExportTxt: boolean;
  canExportMd: boolean;
  canExportJson: boolean;
  canExportPdf: boolean;
  canExportZip: boolean;
  upgradeMessage: string | null;
}

export function useExportBundle(orgId: string): UseExportBundleReturn {
  const { entitlements, loading: entitlementsLoading } = useEntitlementsContext();

  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [lastExport, setLastExport] = useState<ExportBundleResponse | null>(null);
  const [capabilities, setCapabilities] = useState<ExportCapabilities | null>(null);

  // Verifică capabilities din entitlements
  const canExportTxt = true; // Base format pentru toți
  const canExportMd = true; // Base format pentru toți
  const canExportJson = entitlements?.canExportJSON || false;
  const canExportPdf = entitlements?.canExportPDF || false;
  const canExportZip = entitlements?.canExportBundleZip || false;

  // Mesaj de upgrade bazat pe restricții
  const upgradeMessage = (() => {
    if (!canExportJson || !canExportPdf) {
      return 'PDF and JSON export require Pro plan. Upgrade to unlock advanced formats.';
    }
    if (!canExportZip) {
      return 'ZIP bundles require Enterprise plan. Upgrade for complete bundle exports.';
    }
    return null;
  })();

  // Verifică capabilities de la server
  const checkCapabilities = useCallback(async (): Promise<ExportCapabilities> => {
    if (!orgId) {
      throw new Error('Organization ID is required');
    }

    try {
      const response = await fetch(`/api/export/bundle?orgId=${orgId}`, {
        headers: {
          'x-org-id': orgId, // SACF required header
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check export capabilities');
      }

      const data = await response.json();
      const caps: ExportCapabilities = data.capabilities;
      setCapabilities(caps);
      return caps;
    } catch (error) {
      console.error('Failed to check capabilities:', error);
      throw error;
    }
  }, [orgId]);

  // Export bundle function
  const exportBundle = useCallback(
    async (params: {
      runId: string;
      moduleId: string;
      parameterSet7D: any;
      promptText: string;
      mdReport: string;
      jsonPayload: any;
      requestedFormats?: ExportFormat[];
      licenseNotice?: string;
      version?: string;
    }): Promise<ExportBundleResponse> => {
      if (!orgId) {
        throw new Error('Organization ID is required');
      }

      const {
        runId,
        moduleId,
        parameterSet7D,
        promptText,
        mdReport,
        jsonPayload,
        requestedFormats = ['txt', 'md'],
        licenseNotice,
        version = '1.0.0',
      } = params;

      // Validări de bază
      if (!runId || !moduleId || !promptText || !mdReport || !jsonPayload) {
        throw new Error('Missing required export parameters');
      }

      // Verifică dacă formatele cerute sunt permise
      const unauthorizedFormats = requestedFormats.filter(format => {
        switch (format) {
          case 'txt':
          case 'md':
            return false; // Întotdeauna permise
          case 'json':
            return !canExportJson;
          case 'pdf':
            return !canExportPdf;
          case 'zip':
            return !canExportZip;
          default:
            return true; // Format necunoscut
        }
      });

      if (unauthorizedFormats.length > 0) {
        const needsPro = unauthorizedFormats.some(f => f === 'json' || f === 'pdf');
        const needsEnterprise = unauthorizedFormats.includes('zip');

        const upgradeType = needsEnterprise ? 'Enterprise' : needsPro ? 'Pro' : 'higher';
        throw new Error(`Formats ${unauthorizedFormats.join(', ')} require ${upgradeType} plan`);
      }

      setExporting(true);
      setExportError(null);

      try {
        const response = await fetch('/api/export/bundle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-org-id': orgId, // SACF required header
            'x-run-id': runId, // SACF required header
          },
          body: JSON.stringify({
            orgId,
            runId,
            moduleId,
            parameterSet7D,
            promptText,
            mdReport,
            jsonPayload,
            requestedFormats,
            licenseNotice,
            version,
          }),
        });

        if (!response.ok) {
          const error = await response.json();

          if (error.error === 'ENTITLEMENT_REQUIRED') {
            const { unauthorizedFormats, upsell } = error;
            const upgradeType = upsell === 'enterprise_needed' ? 'Enterprise' : 'Pro';
            throw new Error(
              `Formats ${unauthorizedFormats?.join(', ') || 'requested'} require ${upgradeType} plan`
            );
          }

          if (error.error === 'SCORE_TOO_LOW') {
            throw new Error(`Export requires score ≥80. Current score: ${error.score}`);
          }

          if (error.error === 'RUN_NOT_FOUND') {
            throw new Error('Run not found or access denied');
          }

          throw new Error(error.message || error.error || 'Export failed');
        }

        const result: ExportBundleResponse = await response.json();
        setLastExport(result);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown export error';
        setExportError(errorMessage);
        throw error;
      } finally {
        setExporting(false);
      }
    },
    [orgId, canExportJson, canExportPdf, canExportZip]
  );

  return {
    // Export function
    exportBundle,
    checkCapabilities,

    // State
    exporting,
    exportError,
    lastExport,
    capabilities,

    // Gating info
    canExportTxt,
    canExportMd,
    canExportJson,
    canExportPdf,
    canExportZip,
    upgradeMessage,
  };
}
