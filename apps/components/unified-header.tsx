"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface UnifiedHeaderProps {
  variant?: "marketing" | "app" | "admin"
  userPlan?: "free" | "creator" | "pro" | "enterprise"
  userName?: string
  orgName?: string
}

export function UnifiedHeader({
  variant = "marketing",
  userPlan = "free",
  userName,
  orgName = "PromptForge Org",
}: UnifiedHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false)
  const pathname = usePathname()

  const isComingSoon = process.env.NEXT_PUBLIC_COMING_SOON === "true"

  const getNavigation = () => {
    if (variant === "admin") {
      return [
        { name: "Overview", href: "/admin" },
        { name: "Statistics", href: "/admin/statistici" },
        { name: "Members", href: "/admin/membri" },
        { name: "Settings", href: "/admin/settings" },
      ]
    }

    if (variant === "app") {
      return [
        { name: "Generator", href: "/generator" },
        { name: "Dashboard", href: "/dashboard" },
        { name: "Modules", href: "/modules" },
        { name: "History", href: "/history" },
      ]
    }

    // Marketing navigation
    const baseNavigation = [
      { name: "Generator", href: "/generator" },
      { name: "Modules", href: "/modules" },
      { name: "Pricing", href: "/pricing" },
      { name: "Docs", href: "/docs" },
      { name: "Blog", href: "/blog" },
    ]

    return isComingSoon
      ? baseNavigation.map((item) =>
          item.name === "Generator" ? { name: "Launching Soon", href: "#", disabled: true } : item,
        )
      : baseNavigation
  }

  const navigation = getNavigation()
  const isActive = (href: string) => pathname === href

  const PlanBadge = () => {
    if (variant === "marketing") return null

    const planColors = {
      free: "bg-gray-700 text-gray-300",
      creator: "bg-blue-600 text-blue-100",
      pro: "bg-[#CDA434] text-black",
      enterprise: "bg-purple-600 text-purple-100",
    }

    return <Badge className={`${planColors[userPlan]} font-medium text-xs`}>{userPlan.toUpperCase()}</Badge>
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-[#05010A]/95 backdrop-blur supports-[backdrop-filter]:bg-[#05010A]/60">
      <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link href={variant === "admin" ? "/admin" : "/"} className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#CDA434]/20 to-amber-400/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-8 h-8 bg-gradient-to-br from-[#CDA434] to-amber-500 rounded-lg flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-black font-bold" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                  <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
            </div>
            <span className="font-bold text-xl text-white">{variant === "admin" ? "Forge Admin" : "Forge"}</span>
          </Link>

          {variant === "admin" && (
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                className="text-white hover:text-[#CDA434] flex items-center text-sm"
              >
                <span className="mr-2">{orgName}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              {orgDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-10">
                  <div className="p-2">
                    <div className="px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded cursor-pointer">
                      {orgName}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) =>
            item.disabled ? (
              <span key={item.name} className="text-sm font-medium text-gray-500 cursor-not-allowed">
                {item.name}
              </span>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-200 relative ${
                  isActive(item.href) ? "text-[#CDA434]" : "text-gray-300 hover:text-[#CDA434]"
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#CDA434] to-amber-500 rounded-full shadow-sm shadow-[#CDA434]/50" />
                )}
              </Link>
            ),
          )}
          <PlanBadge />
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {variant === "marketing" && (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-gray-300 hover:text-[#CDA434] hover:bg-[#CDA434]/10">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-[#CDA434] to-amber-500 text-black hover:from-amber-500 hover:to-amber-600 font-medium shadow-lg shadow-[#CDA434]/25">
                  Sign up
                </Button>
              </Link>
            </>
          )}

          {variant === "app" && (
            <>
              <span className="text-sm text-gray-300">Welcome, {userName}</span>
              <Link href="/settings">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-[#CDA434]">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </>
          )}

          {variant === "admin" && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="border-[#CDA434] text-[#CDA434] hover:bg-[#CDA434] hover:text-black bg-transparent"
              >
                Quick Actions
              </Button>
              <span className="px-2 py-1 text-xs bg-green-900 text-green-300 rounded">Production</span>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 text-gray-300 hover:text-[#CDA434] transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-16 md:top-20 left-0 right-0 bg-[#05010A]/95 backdrop-blur border-b border-gray-800">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navigation.map((item) =>
              item.disabled ? (
                <span key={item.name} className="block text-sm font-medium text-gray-500 cursor-not-allowed">
                  {item.name}
                </span>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href) ? "text-[#CDA434]" : "text-gray-300 hover:text-[#CDA434]"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ),
            )}

            {variant !== "admin" && <PlanBadge />}

            {variant === "marketing" && (
              <div className="pt-4 border-t border-gray-800 space-y-2">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full text-gray-300 hover:text-[#CDA434] hover:bg-[#CDA434]/10">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-[#CDA434] to-amber-500 text-black hover:from-amber-500 hover:to-amber-600 font-medium">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
