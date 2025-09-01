'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Play, Download, BarChart3, TrendingUp, History } from 'lucide-react'

interface TabBarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: 'runs', label: 'Recent Runs', icon: Play },
  { id: 'artifacts', label: 'Artifacts', icon: Download },
  { id: 'modules', label: 'Module Usage', icon: BarChart3 },
  { id: 'scores', label: 'Scores & Quality', icon: TrendingUp },
  { id: 'history', label: 'History', icon: History }
]

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId)
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', tabId)
    router.push(`/dashboard?${params.toString()}`)
  }

  return (
    <div className="flex space-x-8">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
              isActive
                ? 'border-[var(--brand)] text-[var(--brand)]'
                : 'border-transparent text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:border-[var(--border)]'
            }`}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}