"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface SkipLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function SkipLink({ href, children, className }: SkipLinkProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        setIsVisible(true)
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        setIsVisible(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  if (!isVisible) return null

  return (
    <a
      href={href}
      className={cn(
        "absolute left-4 top-4 z-50 -translate-y-full rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-black transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2",
        className
      )}
      onClick={() => setIsVisible(false)}
    >
      {children}
    </a>
  )
}
