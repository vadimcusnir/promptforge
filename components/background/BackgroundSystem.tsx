"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { MatrixTokenLayer } from "./MatrixTokenLayer"
import { NarrativeLayer } from "./NarrativeLayer" 
import { GeometricLayer } from "./GeometricLayer"

interface BackgroundSystemProps {
  className?: string
}

export function BackgroundSystem({ className = "" }: BackgroundSystemProps) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const handleChange = () => setReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Detect mobile viewport
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    setIsMobile(mediaQuery.matches)
    
    const handleChange = () => setIsMobile(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Performance settings based on context and capabilities
  const getPerformanceSettings = () => {
    const baseSettings = {
      tokensEnabled: true,
      narrativeEnabled: !isDashboard, // Disable heavy animations on dashboard
      geometricEnabled: !isDashboard,
      tokenCount: isMobile ? 55 : 95, // 50-70 mobile, 90-110 desktop
      driftSpeed: reducedMotion ? 0 : (isDashboard ? 0.3 : 1.0),
      glitchEnabled: !reducedMotion && !isDashboard,
      narrativeInterval: reducedMotion ? 0 : 17500, // 15-20s average
      typingSpeed: 50, // 40-60ms per character
    }

    if (reducedMotion) {
      return {
        ...baseSettings,
        tokensEnabled: true, // Keep minimal tokens
        narrativeEnabled: false,
        geometricEnabled: false,
        driftSpeed: 0,
        glitchEnabled: false,
        narrativeInterval: 0,
      }
    }

    return baseSettings
  }

  const settings = getPerformanceSettings()

  return (
    <div 
      ref={containerRef}
      id="bg-root"
      className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ 
        zIndex: 0,
        transform: 'none', // Critical: no transforms on background root
        willChange: 'auto'
      }}
      aria-hidden="true"
    >
      {/* Z-Index Level 0: Grid + Geometric Figures */}
      {settings.geometricEnabled && (
        <GeometricLayer
          className="absolute inset-0"
          style={{ zIndex: 0 }}
          reducedMotion={reducedMotion}
          isDashboard={isDashboard}
        />
      )}

      {/* Z-Index Level 0: Matrix Tokens */}
      {settings.tokensEnabled && (
        <MatrixTokenLayer
          className="absolute inset-0"
          style={{ zIndex: 0 }}
          tokenCount={settings.tokenCount}
          driftSpeed={settings.driftSpeed}
          glitchEnabled={settings.glitchEnabled}
          reducedMotion={reducedMotion}
          isMobile={isMobile}
        />
      )}

      {/* Z-Index Level 0: Narrative Quotes */}
      {settings.narrativeEnabled && (
        <NarrativeLayer
          className="absolute inset-0"
          style={{ zIndex: 0 }}
          interval={settings.narrativeInterval}
          typingSpeed={settings.typingSpeed}
          reducedMotion={reducedMotion}
        />
      )}

      {/* Z-Index Level 1: Subtle overlay for darkening */}
      <div 
        id="bg-overlay"
        className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30"
        style={{ 
          zIndex: 1,
          transform: 'none',
          willChange: 'auto'
        }}
      />
    </div>
  )
}
