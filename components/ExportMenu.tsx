"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, FileJson, Archive, Lock } from 'lucide-react';
import { 
  canExportFormat, 
  getEntitlementReason
} from '@/lib/entitlements';
import { PlanType } from '@/lib/entitlements/types';
import { exportToPDF, exportToJSON, exportToMarkdown, exportToZip, downloadFile } from '@/lib/export';

interface ExportMenuProps {
  modules: any[];
  plan: PlanType;
  score?: number;
  metadata: {
    title: string;
    description: string;
    author: string;
  };
}

export function ExportMenu({ modules, plan, score = 0, metadata }: ExportMenuProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleExport = async (format: string) => {
    if (!canExportFormat(plan, format, score)) {
      return;
    }

    setIsExporting(format);
    
    try {
      const exportOptions = {
        format: format as any,
        modules,
        metadata: {
          ...metadata,
          date: new Date().toISOString(),
        },
      };

      let blob: Blob;
      let filename: string;

      switch (format) {
        case 'pdf':
          blob = await exportToPDF(exportOptions);
          filename = 'promptforge-export.pdf';
          break;
        case 'json':
          blob = await exportToJSON(exportOptions);
          filename = 'promptforge-export.json';
          break;
        case 'md':
          blob = await exportToMarkdown(exportOptions);
          filename = 'promptforge-export.md';
          break;
        case 'zip':
          blob = await exportToZip(exportOptions);
          filename = 'promptforge-export.zip';
          break;
        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      downloadFile(blob, filename);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(null);
    }
  };

  const formats = [
    { key: 'md', label: 'Markdown', icon: FileText, alwaysAvailable: true },
    { key: 'pdf', label: 'PDF', icon: FileText, requiresScore: true },
    { key: 'json', label: 'JSON', icon: FileJson, requiresScore: true },
    { key: 'zip', label: 'ZIP Bundle', icon: Archive, requiresPlan: 'PRO' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {formats.map((format) => {
        const isAvailable = canExportFormat(plan, format.key, score);
        const reason = getEntitlementReason(plan, format.key, score);
        const Icon = format.icon;
        
        return (
          <Button
            key={format.key}
            variant="outline"
            size="sm"
            className={`border-pf-text-muted/30 text-pf-text hover:bg-pf-text-muted/10 ${
              !isAvailable ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => isAvailable && handleExport(format.key)}
            disabled={!isAvailable || isExporting !== null}
            title={!isAvailable ? reason : ''}
          >
            <Icon className="w-4 h-4 mr-2" />
            {format.label}
            {!isAvailable && <Lock className="w-3 h-3 ml-2" />}
          </Button>
        );
      })}
    </div>
  );
}