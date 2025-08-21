"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScoreBadge } from "@/components/ui/ScoreBadge"
import { RunActions } from "./RunActions"
import { formatDistanceToNow } from "date-fns"
import { Hash, Calendar } from "lucide-react"

interface RunRecord {
  id: string
  hash: string
  module: string
  moduleCode: string
  score: number
  status: "PASS" | "PARTIAL" | "FAIL"
  date: Date
  exportType: string[]
  config7D: any
  telemetry: any
  actions: string[]
}

interface RunTableProps {
  runs: RunRecord[]
  selectedRun: RunRecord | null
  onSelectRun: (run: RunRecord) => void
  tier: string
}

export function RunTable({ runs, selectedRun, onSelectRun, tier }: RunTableProps) {
  return (
    <Card className="glass-effect overflow-hidden">
      <div className="p-6 border-b border-lead-gray/20">
        <h3 className="text-xl font-semibold text-white">Run History</h3>
        <p className="text-sm text-lead-gray mt-1">{runs.length} total runs</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-black/30">
            <tr className="border-b border-lead-gray/20">
              <th className="text-left p-4 text-sm font-medium text-lead-gray">Run ID</th>
              <th className="text-left p-4 text-sm font-medium text-lead-gray">Module</th>
              <th className="text-left p-4 text-sm font-medium text-lead-gray">Score</th>
              <th className="text-left p-4 text-sm font-medium text-lead-gray">Date</th>
              <th className="text-left p-4 text-sm font-medium text-lead-gray">Export</th>
              <th className="text-left p-4 text-sm font-medium text-lead-gray">Actions</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <tr
                key={run.id}
                className={`border-b border-lead-gray/10 hover:bg-white/5 cursor-pointer transition-colors ${
                  selectedRun?.id === run.id ? "bg-gold-industrial/10" : ""
                }`}
                onClick={() => onSelectRun(run)}
              >
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-lead-gray" />
                    <code className="text-sm font-mono text-white">{run.hash}</code>
                  </div>
                </td>

                <td className="p-4">
                  <div>
                    <p className="text-sm font-medium text-white line-clamp-1">{run.module}</p>
                    <Badge variant="outline" className="text-xs mt-1 text-blue-400 border-blue-400/30">
                      {run.moduleCode}
                    </Badge>
                  </div>
                </td>

                <td className="p-4">
                  <ScoreBadge score={run.score} status={run.status} />
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-2 text-sm text-lead-gray">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDistanceToNow(run.date, { addSuffix: true })}</span>
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex gap-1">
                    {run.exportType.map((type) => (
                      <Badge key={type} variant="outline" className="text-xs">
                        .{type}
                      </Badge>
                    ))}
                  </div>
                </td>

                <td className="p-4">
                  <RunActions run={run} tier={tier} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
