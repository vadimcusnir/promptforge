"use client"

import { useEffect, useState } from "react"

export function MobileOptimizations() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    // Add mobile-specific viewport meta tag
    const viewport = document.querySelector('meta[name="viewport"]')
    if (viewport) {
      viewport.setAttribute("content", "width=device-width, initial-scale=1, viewport-fit=cover")
    }

    // Add safe area CSS variables for iOS
    document.documentElement.style.setProperty("--safe-area-inset-top", "env(safe-area-inset-top)")
    document.documentElement.style.setProperty("--safe-area-inset-bottom", "env(safe-area-inset-bottom)")
    document.documentElement.style.setProperty("--safe-area-inset-left", "env(safe-area-inset-left)")
    document.documentElement.style.setProperty("--safe-area-inset-right", "env(safe-area-inset-right)")

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return null
}
