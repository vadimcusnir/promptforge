"use client"

import type React from "react"
import { UnifiedHeader } from "@/components/unified-header"
import { Footer } from "@/components/footer"

interface ComingSoonWrapperProps {
  children: React.ReactNode
}

export function ComingSoonWrapper({ children }: ComingSoonWrapperProps) {
  const isComingSoon = process.env.NEXT_PUBLIC_COMING_SOON === "true"

  if (isComingSoon) {
    return <>{children}</>
  }

  return (
    <>
      <UnifiedHeader variant="marketing" />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
