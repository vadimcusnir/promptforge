"use client"

import { useState, useEffect } from "react"

interface MysticalBackgroundProps {
  symbol?: "flame" | "torus" | "labyrinth" | "key" | "sphere"
  opacity?: number
  className?: string
}

export function MysticalBackground({ symbol = "flame", opacity = 0.1, className = "" }: MysticalBackgroundProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const symbolPaths = {
    flame: "/symbols/flame-of-alchemy.svg",
    torus: "/symbols/energetic-torus.svg",
    labyrinth: "/symbols/initiatic-labyrinth.svg",
    key: "/symbols/hermetic-key.svg",
    sphere: "/symbols/sphere-of-potential.svg",
  }

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${className}`}
      style={{ opacity: isVisible ? opacity : 0 }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={symbolPaths[symbol] || "/placeholder.svg"}
          alt={`Mystical ${symbol} symbol`}
          className="w-full h-full max-w-4xl max-h-4xl object-contain animate-pulse-slow"
          style={{
            filter: "blur(1px) brightness(0.8)",
            mixBlendMode: "screen",
          }}
        />
      </div>

      {/* Subtle particle overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-amber-500/5 to-transparent animate-pulse-slow" />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent animate-pulse-slow" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/10 to-transparent animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-500/10 to-transparent animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-amber-500/10 to-transparent animate-pulse-slow" />
    </div>
  )
}
