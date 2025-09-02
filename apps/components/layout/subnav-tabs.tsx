"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SubnavTab {
  id: string
  label: string
  href?: string
  onClick?: () => void
  disabled?: boolean
}

interface SubnavTabsProps {
  tabs: SubnavTab[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
  variant?: "default" | "pills" | "underline"
}

export function SubnavTabs({ tabs, activeTab, onTabChange, variant = "underline" }: SubnavTabsProps) {
  const pathname = usePathname()
  const [internalActiveTab, setInternalActiveTab] = useState(activeTab || tabs[0]?.id)

  const currentActiveTab = activeTab || internalActiveTab

  const handleTabClick = (tab: SubnavTab) => {
    if (tab.disabled) return

    if (tab.onClick) {
      tab.onClick()
    }

    if (onTabChange) {
      onTabChange(tab.id)
    } else {
      setInternalActiveTab(tab.id)
    }
  }

  const getTabStyles = (tab: SubnavTab, isActive: boolean) => {
    const baseStyles =
      "px-4 py-3 text-sm font-medium font-space-grotesk transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF7F] focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded min-h-[44px] flex items-center"

    if (tab.disabled) {
      return `${baseStyles} text-muted-foreground cursor-not-allowed opacity-50`
    }

    switch (variant) {
      case "pills":
        return `${baseStyles} rounded-full ${
          isActive
            ? "bg-[#CDA434] text-background shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`

      case "underline":
        return `${baseStyles} border-b-2 ${
          isActive
            ? "border-[#CDA434] text-foreground"
            : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
        }`

      default:
        return `${baseStyles} ${
          isActive ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        }`
    }
  }

  return (
    <div className="flex items-center space-x-1 h-14">
      {tabs.map((tab) => {
        const isActive = tab.href ? pathname === tab.href : currentActiveTab === tab.id

        if (tab.href) {
          return (
            <Link key={tab.id} href={tab.href} className={getTabStyles(tab, isActive)}>
              {tab.label}
            </Link>
          )
        }

        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab)}
            className={getTabStyles(tab, isActive)}
            disabled={tab.disabled}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
