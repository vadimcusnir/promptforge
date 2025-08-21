"use client"

import { useEffect, useRef } from "react"
import { MatrixTokens } from "./MatrixTokens"
import { GeometricFigures } from "./GeometricFigures" 
import { NarrativeQuotes } from "./NarrativeQuotes"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface BackgroundRootProps {
  isDashboard?: boolean
}

export function BackgroundRoot({ isDashboard = false }: BackgroundRootProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    // Ensure no transforms on this container or its ancestors
    const container = containerRef.current
    if (!container) return

    // Set explicit positioning without transforms
    container.style.transform = 'none'
    container.style.willChange = 'auto'
    
    // Check ancestors for transforms (dev warning)
    let parent = container.parentElement
    while (parent && parent !== document.body) {
      const computedStyle = window.getComputedStyle(parent)
      if (computedStyle.transform !== 'none') {
        console.warn('Background ancestor has transform, may cause layer issues:', parent)
      }
      parent = parent.parentElement
    }
  }, [])

  return (
    <div 
      id="bg-root"
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ 
        zIndex: 0,
        transform: 'none',
        willChange: 'auto'
      }}
    >
      {/* Layer 1: Matrix Tokens (always present, reduced on dashboard) */}
      <MatrixTokens 
        density={isDashboard ? "minimal" : "normal"}
        reduceMotion={prefersReducedMotion}
      />

      {/* Layer 2: Geometric Figures (disabled on dashboard) */}
      {!isDashboard && (
        <GeometricFigures 
          reduceMotion={prefersReducedMotion}
        />
      )}

      {/* Layer 3: Narrative Quotes (disabled on dashboard) */}
      {!isDashboard && (
        <NarrativeQuotes 
          reduceMotion={prefersReducedMotion}
        />
      )}

      {/* Overlay for subtle darkening */}
      <div 
        id="bg-overlay"
        className="absolute inset-0 bg-black/20"
        style={{ zIndex: 1 }}
      />
    </div>
  )
}
