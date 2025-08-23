/**
 * Export Bundle Hook
 * Client-side hook for triggering bundle exports
 */

import { useState } from 'react';

export interface ExportRequest {
  runId: string;
  formats: string[];
  orgId: string;
  userId: string;
}

export interface ExportResponse {
  bundleId: string;
  paths: Record<string, string>;
  license_notice: string;
  checksum: string;
  formats: string[];
}

export interface ExportError {
  error: string;
  message?: string;
}

interface UseExportBundleReturn {
  exportBundle: (request: ExportRequest) => Promise<ExportResponse>;
  loading: boolean;
  error: string | null;
  lastExport: ExportResponse | null;
}

/**
 * Hook for exporting bundles with loading states and error handling
 */
export function useExportBundle(): UseExportBundleReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastExport, setLastExport] = useState<ExportResponse | null>(null);

  const exportBundle = async (request: ExportRequest): Promise<ExportResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData: ExportError = await response.json();
        throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
      }

      const result: ExportResponse = await response.json();
      setLastExport(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Export failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    exportBundle,
    loading,
    error,
    lastExport,
  };
}

/**
 * Helper function to download a file from URL
 */
export async function downloadFile(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download: ${response.status}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
}

/**
 * Get file extension for format
 */
export function getFileExtension(format: string): string {
  const extensions: Record<string, string> = {
    md: 'md',
    txt: 'txt',
    json: 'json',
    pdf: 'pdf',
    zip: 'zip',
    xml: 'xml',
  };

  return extensions[format] || format;
}

/**
 * Format bytes for display
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
