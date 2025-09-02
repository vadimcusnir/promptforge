"use client"

import { useState, useEffect } from "react"

interface SymbolLoaderProps {
  symbol?: "flame" | "torus" | "labyrinth" | "key" | "sphere"
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function SymbolLoader({
  symbol = "flame",
  size = "md",
  text = "Forging...",
  className = "",
}: SymbolLoaderProps) {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }

  const symbolPaths = {
    flame: "/symbols/flame-of-alchemy.svg",
    torus: "/symbols/energetic-torus.svg",
    labyrinth: "/symbols/initiatic-labyrinth.svg",
    key: "/symbols/hermetic-key.svg",
    sphere: "/symbols/sphere-of-potential.svg",
  }

  const symbolNames = {
    flame: "Flame of Alchemy",
    torus: "Energetic Torus",
    labyrinth: "Initiatic Labyrinth",
    key: "Hermetic Key",
    sphere: "Sphere of Potential",
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="relative">
        <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-[#CDA434]/20 animate-ping`} />

        {/* Symbol container */}
        <div
          className={`relative ${sizeClasses[size]} rounded-full bg-black/50 border border-[#CDA434]/30 flex items-center justify-center overflow-hidden`}
        >
          <img
            src={symbolPaths[symbol] || "/placeholder.svg"}
            alt={symbolNames[symbol]}
            className="w-full h-full object-contain animate-spin-slow"
            style={{
              filter: "brightness(1.2) contrast(1.1)",
              animationDuration: "8s",
            }}
          />

          {/* Inner glow overlay */}
          <div className="absolute inset-0 bg-gradient-radial from-[#CDA434]/10 via-transparent to-transparent" />
        </div>

        {/* Rotating outer ring */}
        <div
          className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-2 border-transparent border-t-[#CDA434]/50 border-r-[#CDA434]/30 animate-spin`}
        />
      </div>

      {/* Loading text */}
      <div className="text-center">
        <p className="text-[#CDA434] font-mono text-sm font-medium">
          {text}
          {dots}
        </p>
        <p className="text-gray-400 text-xs mt-1 font-mono">{symbolNames[symbol]}</p>
      </div>

      {/* Progress indicator */}
      <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#CDA434] to-[#CDA434] animate-pulse-slow"
          style={{ width: "100%", animation: "loading-progress 3s ease-in-out infinite" }}
        />
      </div>
    </div>
  )
}
