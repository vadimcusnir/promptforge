"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ArrowRight } from "lucide-react"
import Link from "next/link"

export function EmptyState() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="glass-effect p-12 text-center max-w-md">
          <div className="mb-6">
            <FileText className="w-16 h-16 mx-auto text-lead-gray/50 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No runs saved yet</h3>
            <p className="text-lead-gray">Start your first prompt generation to see your run history here.</p>
          </div>

          <div className="space-y-3">
            <Link href="/generator">
              <Button className="w-full glow-primary">
                Open Generator
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <Link href="/modules">
              <Button variant="outline" className="w-full bg-transparent">
                Browse Modules
              </Button>
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-lead-gray/20">
            <p className="text-xs text-lead-gray">Pro and Enterprise users get cloud history and advanced analytics.</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
