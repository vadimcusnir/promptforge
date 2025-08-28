"use client"

import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface ComingSoonWrapperProps {
  children: React.ReactNode
}

"use client"

import { usePathname } from "next/navigation"

export function ComingSoonWrapper({ children }: ComingSoonWrapperProps) {
  const pathname = usePathname()
  const isComingSoon = process.env.NEXT_PUBLIC_COMING_SOON === "true"
  const isComingSoonPage = pathname === "/coming-soon"

  if (isComingSoon || isComingSoonPage) {
    // In coming soon mode or on coming soon page, show only the content
    // No header/footer for these cases
    return <>{children}</>
  }

  // For all other pages, just wrap children
  // Header and Footer are handled by the root layout
  return <main className="flex-1">{children}</main>
}
