"use client"

import { useEffect, useState } from "react"

export function useFontsReady() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        // fonts + 1 rAF + next microtask => stabil
        // @ts-ignore
        if (document?.fonts?.ready) await (document as any).fonts.ready
      } catch {}

      await new Promise((r) => requestAnimationFrame(() => r(null)))
      await Promise.resolve() // microtask

      if (!cancelled) setReady(true)
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return ready
}
