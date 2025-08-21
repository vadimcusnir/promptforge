"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Users, Zap, Clock } from "lucide-react"

interface SocialProofBarProps {
  className?: string
}

export function SocialProofBar({ className = "" }: SocialProofBarProps) {
  const [liveStats, setLiveStats] = useState({
    activeUsers: 1247,
    promptsGenerated: 12847,
    avgScore: 84.2,
    avgTTA: 42,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats((prev) => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3),
        promptsGenerated: prev.promptsGenerated + Math.floor(Math.random() * 5),
        avgScore: Math.min(100, prev.avgScore + (Math.random() - 0.5) * 0.2),
        avgTTA: Math.max(30, prev.avgTTA + (Math.random() - 0.5) * 2),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`glass-effect p-4 rounded-lg ${className}`}>
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <Users className="w-4 h-4 text-lead-gray" />
          <span className="text-white font-medium">{liveStats.activeUsers.toLocaleString()}</span>
          <span className="text-lead-gray">online now</span>
        </div>

        <div className="w-px h-4 bg-lead-gray/30" />

        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-gold-industrial" />
          <span className="text-white font-medium">{liveStats.promptsGenerated.toLocaleString()}</span>
          <span className="text-lead-gray">prompts today</span>
        </div>

        <div className="w-px h-4 bg-lead-gray/30" />

        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-white font-medium">{liveStats.avgScore.toFixed(1)}</span>
          <span className="text-lead-gray">avg score</span>
        </div>

        <div className="w-px h-4 bg-lead-gray/30" />

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <span className="text-white font-medium">{Math.round(liveStats.avgTTA)}s</span>
          <span className="text-lead-gray">avg TTA</span>
        </div>
      </div>
    </div>
  )
}
