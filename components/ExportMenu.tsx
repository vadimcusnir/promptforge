"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { Download, FileText, FileJson, Archive, Lock } from 'lucide-react';
import { 
  checkEntitlement, 
  canExportFormat, 
  getEntitlementReason,
  getAvailableExportFormats 
} from '@/lib/entitlements';
import { PlanType } from '@/lib/entitlements/types';
import { exportToPDF, exportToJSON, exportToMarkdown, exportToZip, downloadFile } from '@/lib/export';

interface ExportMenuProps {
  modules: any[];
  plan: PlanType;
  score?: number;
  metadata?: {
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="border-pf-text-muted/30 text-pf-text hover:bg-pf-text-muted/10"
          disabled={isExporting !== null}
        >
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? `Exporting ${isExporting.toUpperCase()}...` : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="bg-pf-surface border-pf-text-muted/30 text-pf-text"
        align="end"
      >
        {formats.map((format, index) => {
          const isAvailable = canExportFormat(plan, format.key, score);
          const reason = getEntitlementReason(plan, format.key, score);
          const Icon = format.icon;
          
          return (
            <div key={format.key}>
              <DropdownMenuItem
                className={`flex items-center space-x-2 ${
                  isAvailable 
                    ? 'hover:bg-pf-text-muted/10 cursor-pointer' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={() => isAvailable && handleExport(format.key)}
                disabled={!isAvailable || isExporting !== null}
                title={!isAvailable ? reason : ''}
              >
                <Icon className="w-4 h-4" />
                <span>{format.label}</span>
                {!isAvailable && <Lock className="w-3 h-3 ml-auto" />}
              </DropdownMenuItem>
              {index < formats.length - 1 && <DropdownMenuSeparator className="bg-pf-text-muted/20" />}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
