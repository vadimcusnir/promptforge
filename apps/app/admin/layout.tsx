"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Users,
  Settings,
  FileText,
  CreditCard,
  Key,
  Download,
  AlertTriangle,
  Shield,
  ToggleLeft,
  X,
  TrendingUp,
  Activity,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { UnifiedHeader } from "@/components/unified-header"

const navigation = [
  {
    name: "Operare",
    items: [
      { name: "Overview", href: "/admin", icon: BarChart3 },
      { name: "Statistici", href: "/admin/statistici", icon: BarChart3 },
      { name: "Usage", href: "/admin/usage", icon: TrendingUp },
      { name: "API Usage", href: "/admin/api-usage", icon: Activity },
      { name: "SLO & Compliance", href: "/admin/slo-compliance", icon: Shield },
      { name: "Cohorts & Packs", href: "/admin/cohorts-packs", icon: Package },
      { name: "Exporturi", href: "/admin/exporturi", icon: Download },
      { name: "Incidente", href: "/admin/incidente", icon: AlertTriangle },
    ],
  },
  {
    name: "Business",
    items: [
      { name: "Abonamente", href: "/admin/abonamente", icon: CreditCard },
      { name: "Entitlements", href: "/admin/entitlements", icon: Shield },
      { name: "Membri", href: "/admin/membri", icon: Users },
      { name: "API Keys", href: "/admin/api-keys", icon: Key },
    ],
  },
  {
    name: "Control",
    items: [
      { name: "Ruleset", href: "/admin/ruleset", icon: Settings },
      { name: "Gate", href: "/admin/gate", icon: ToggleLeft },
    ],
  },
  {
    name: "Conținut",
    items: [{ name: "Editor", href: "/admin/editor", icon: FileText }],
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#05010A] text-white">
      <UnifiedHeader variant="admin" userPlan="enterprise" orgName="PromptForge Org" />

      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-[#05010A] border-r border-gray-800">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h2 className="text-lg font-bold text-[#CDA434]">Admin Panel</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="p-4 space-y-6">
            {navigation.map((group) => (
              <div key={group.name}>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{group.name}</h3>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                            isActive
                              ? "bg-[#CDA434]/20 text-[#CDA434] border border-[#CDA434]/30"
                              : "text-gray-300 hover:text-white hover:bg-gray-800"
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <Icon className="h-4 w-4 mr-3" />
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:top-20">
        <div className="flex flex-col flex-grow bg-[#05010A] border-r border-gray-800">
          <div className="flex items-center h-16 px-4 border-b border-gray-800">
            <h2 className="text-lg font-bold text-[#CDA434]">Admin Panel</h2>
          </div>
          <nav className="flex-1 p-4 space-y-6">
            {navigation.map((group) => (
              <div key={group.name}>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{group.name}</h3>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                            isActive
                              ? "bg-[#CDA434]/20 text-[#CDA434] border border-[#CDA434]/30"
                              : "text-gray-300 hover:text-white hover:bg-gray-800"
                          }`}
                        >
                          <Icon className="h-4 w-4 mr-3" />
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 pt-16 md:pt-20">
        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
