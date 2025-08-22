"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Download, RotateCcw, GitCompare } from "lucide-react";

interface RunRecord {
  id: string;
  hash: string;
  module: string;
  score: number;
  status: "PASS" | "PARTIAL" | "FAIL";
  exportType: string[];
}

interface RunActionsProps {
  run: RunRecord;
  tier: string;
}

export function RunActions({ run, tier }: RunActionsProps) {
  const canRestore = run.score >= 80 || tier !== "Basic";
  const canExportBundle = tier === "Enterprise";

  const handleRestore = () => {
    // Implement restore functionality
    console.log("Restoring run:", run.hash);
  };

  const handleDiff = () => {
    // Implement diff functionality
    console.log("Comparing run:", run.hash);
  };

  const handleDownload = (format: string) => {
    // Implement download functionality
    console.log("Downloading:", run.hash, format);
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
          onClick={handleDiff}
          disabled={run.score < 80}
          className="text-white hover:bg-white/10"
        >
          <GitCompare className="mr-2 h-4 w-4" />
          Diff vs Current
        </DropdownMenuItem>

        {run.exportType.map((format) => (
          <DropdownMenuItem
            key={format}
            onClick={() => handleDownload(format)}
            className="text-white hover:bg-white/10"
          >
            <Download className="mr-2 h-4 w-4" />
            Download .{format}
          </DropdownMenuItem>
        ))}

        {canExportBundle && (
          <DropdownMenuItem
            onClick={() => handleDownload("bundle")}
            className="text-white hover:bg-white/10"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Bundle
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
