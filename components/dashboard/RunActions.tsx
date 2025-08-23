'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, RotateCcw, GitCompare, Download } from 'lucide-react';

interface RunRecord {
  id: string;
  hash: string;
  module: string;
  score: number;
  status: 'PASS' | 'PARTIAL' | 'FAIL';
  exportType: string[];
}

interface RunActionsProps {
  run: RunRecord;
  tier: string;
}

export function RunActions({ run, tier }: RunActionsProps) {
  const canRestore = run.score >= 80 || tier !== 'Basic';
  const canExportBundle = tier === 'Enterprise';

  const handleRestore = () => {
    // Implement restore functionality
    // Analytics tracking would go here in production
  };

  const handleCompare = () => {
    // Implement compare functionality
    // Analytics tracking would go here in production
  };

  const handleExport = () => {
    // Implement export functionality
    // Analytics tracking would go here in production
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-black border-lead-gray/30">
        <DropdownMenuItem
          onClick={handleRestore}
          disabled={!canRestore}
          className="text-white hover:bg-white/10"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Restore Config
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleCompare}
          disabled={run.score < 80}
          className="text-white hover:bg-white/10"
        >
          <GitCompare className="mr-2 h-4 w-4" />
          Diff vs Current
        </DropdownMenuItem>

        {run.exportType.map(format => (
          <DropdownMenuItem
            key={format}
            onClick={handleExport}
            className="text-white hover:bg-white/10"
          >
            Export as {format.toUpperCase()}
          </DropdownMenuItem>
        ))}

        {canExportBundle && (
          <DropdownMenuItem
            onClick={handleExport}
            className="text-white hover:bg-white/10"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Bundle
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
