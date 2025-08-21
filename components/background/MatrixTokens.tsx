"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { MATRIX_TOKENS } from "@/lib/data/matrix-tokens"

interface MatrixTokensProps {
  density?: "minimal" | "normal" | "high"
  reduceMotion?: boolean
}

interface Token {
  id: string
  text: string
  x: number
  y: number
  opacity: number
  drift: {
    x: number
    y: number
    speed: number
  }
  glitch: {
    active: boolean
    duration: number
    startTime: number
  }
}

export function MatrixTokens({ density = "normal", reduceMotion = false }: MatrixTokensProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tokensRef = useRef<Token[]>([])
  const animationRef = useRef<number>()
  const [, forceUpdate] = useState({})

  const getDensityConfig = useCallback(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    
    switch (density) {
      case "minimal":
        return { count: isMobile ? 20 : 30, driftSpeed: 0.1 }
      case "high":
        return { count: isMobile ? 80 : 130, driftSpeed: 0.8 }
      default:
        return { count: isMobile ? 60 : 100, driftSpeed: 0.5 }
    }
  }, [density])

  const createToken = useCallback((index: number): Token => {
    const config = getDensityConfig()
    const token = MATRIX_TOKENS[Math.floor(Math.random() * MATRIX_TOKENS.length)]
    
    return {
      id: `token-${index}-${Date.now()}`,
      text: token,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: 0.3 + Math.random() * 0.4,
      drift: {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
        speed: config.driftSpeed * (0.5 + Math.random())
      },
      glitch: {
        active: false,
        duration: 0,
        startTime: 0
      }
    }
  }, [getDensityConfig])

  const initializeTokens = useCallback(() => {
    const config = getDensityConfig()
    tokensRef.current = Array.from({ length: config.count }, (_, i) => createToken(i))
    forceUpdate({})
  }, [createToken, getDensityConfig])

  const updateTokens = useCallback(() => {
    if (reduceMotion) return

    const now = performance.now()
    let needsUpdate = false

    tokensRef.current = tokensRef.current.map(token => {
      const newToken = { ...token }

      // Drift movement (12-18s cycle)
      const driftCycle = (now / 15000) % 1 // 15s average
      newToken.x += Math.sin(driftCycle * Math.PI * 2 + token.drift.x) * token.drift.speed * 0.01
      newToken.y += Math.cos(driftCycle * Math.PI * 2 + token.drift.y) * token.drift.speed * 0.01

      // Keep tokens in bounds
      if (newToken.x < -5) newToken.x = 105
      if (newToken.x > 105) newToken.x = -5
      if (newToken.y < -5) newToken.y = 105
      if (newToken.y > 105) newToken.y = -5

      // Random glitch effect (50-100ms duration)
      if (!newToken.glitch.active && Math.random() < 0.0001) {
        newToken.glitch.active = true
        newToken.glitch.duration = 50 + Math.random() * 50
        newToken.glitch.startTime = now
        needsUpdate = true
      }

      if (newToken.glitch.active && now - newToken.glitch.startTime > newToken.glitch.duration) {
        newToken.glitch.active = false
        needsUpdate = true
      }

      return newToken
    })

    if (needsUpdate) {
      forceUpdate({})
    }
  }, [reduceMotion])

  const animate = useCallback(() => {
    updateTokens()
    animationRef.current = requestAnimationFrame(animate)
  }, [updateTokens])

  useEffect(() => {
    initializeTokens()
    
    if (!reduceMotion) {
      animationRef.current = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      initializeTokens()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [initializeTokens, animate, reduceMotion])

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0"
      style={{ zIndex: 0 }}
    >
      {tokensRef.current.map(token => (
        <div
          key={token.id}
          className={`absolute text-xs font-mono text-[#d1a954] select-none pointer-events-none ${
            token.glitch.active ? 'animate-pulse' : ''
          }`}
          style={{
            left: `${token.x}%`,
            top: `${token.y}%`,
            opacity: token.opacity,
            transform: token.glitch.active 
              ? `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`
              : 'none',
            filter: token.glitch.active ? 'hue-rotate(180deg)' : 'none',
            transition: reduceMotion ? 'none' : 'transform 50ms ease-out'
          }}
        >
          {token.text}
        </div>
      ))}
    </div>
  )
}
