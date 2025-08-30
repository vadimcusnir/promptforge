"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface ForgeGlyphProps {
  status?: 'loading' | 'ready' | 'active'
  onGlitch?: () => void
  minimizeOnScroll?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function ForgeGlyphInteractive({ 
  status = 'loading', 
  onGlitch,
  minimizeOnScroll = true,
  className,
  size = 'md'
}: ForgeGlyphProps) {
  const [isRevealed, setIsRevealed] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isGlitching, setIsGlitching] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Time trigger: 1.2s delay after load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRevealed(true)
      console.log("Forge Glyph revealed through silence")
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  // Scroll behavior for minimization
  useEffect(() => {
    if (!minimizeOnScroll) return

    const handleScroll = () => {
      const scrollY = window.scrollY
      if (scrollY > 400 && !isMinimized) {
        setIsMinimized(true)
        console.log("Glyph minimized to badge form")
      } else if (scrollY <= 400 && isMinimized) {
        setIsMinimized(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMinimized, minimizeOnScroll])

  // Glitch effect handler
  const handleGlitch = () => {
    setIsGlitching(true)
    onGlitch?.()
    console.log("Glyph glitch triggered")
    
    setTimeout(() => setIsGlitching(false), 2000)
  }

  // Hover effect
  const handleMouseEnter = () => {
    setIsHovered(true)
    console.log("Glyph hover: glow intermittent activated")
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  }

  const minimizedSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative cursor-pointer transition-all duration-500 ease-out",
        isMinimized ? minimizedSizeClasses[size] : sizeClasses[size],
        className
      )}
      data-status={status}
      onClick={handleGlitch}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-label="Forge Glyph - Interactive rune"
    >
      {/* Background glow effect */}
      <div className={cn(
        "absolute inset-0 rounded-lg transition-all duration-1000",
        "bg-gradient-to-br from-yellow-400/20 to-amber-400/20",
        "blur-lg opacity-0",
        isHovered && "opacity-100 animate-pulse",
        isRevealed && status === 'ready' && "opacity-60"
      )} />

      {/* Main glyph container */}
      <div className={cn(
        "relative w-full h-full rounded-lg flex items-center justify-center",
        "bg-gradient-to-br from-yellow-400 to-amber-500",
        "shadow-lg transition-all duration-300",
        isHovered && "shadow-yellow-400/50 shadow-2xl scale-105",
        isGlitching && "animate-pulse bg-gradient-to-br from-red-400 to-pink-500",
        isMinimized && "rounded-full"
      )}>
        {/* Rune Digitală - ASCII Characters */}
        <div className="relative text-black font-mono font-bold select-none">
          {/* Main vertical line */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-black" />
          
          {/* Top arrow */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-lg">
            &gt;
          </div>
          
          {/* Left bracket */}
          <div className="absolute top-1/2 left-2 transform -translate-y-1/2 text-sm">
            &#123;
          </div>
          
          {/* Right bracket */}
          <div className="absolute top-1/2 right-2 transform -translate-y-1/2 text-sm">
            &#125;
          </div>
          
          {/* Bottom wave */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-sm animate-pulse">
            ~
          </div>
          
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-black rounded-full" />
        </div>

        {/* Glitch overlay */}
        {isGlitching && (
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 opacity-80 animate-ping" />
        )}

        {/* Status indicator */}
        {status === 'ready' && isRevealed && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
        )}
      </div>

      {/* Drip effect */}
      <div className={cn(
        "absolute bottom-0 left-1/2 transform -translate-x-1/2",
        "w-0.5 h-4 bg-gradient-to-b from-yellow-400 to-transparent",
        "opacity-0 transition-opacity duration-1000",
        isHovered && "opacity-100 animate-bounce"
      )} />

      {/* Matrix animations ready trigger */}
      <div className="matrix-animations-ready" />
    </div>
  )
}

// CSS-in-JS styles for the component
const styles = `
.glyph-container[data-status="loading"] {
  opacity: 0.3;
  transform: scale(0.8);
}

.glyph-container[data-status="ready"] {
  opacity: 1;
  transform: scale(1);
}

.glyph-container[data-status="active"] {
  opacity: 1;
  transform: scale(1.1);
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
}

.matrix-animations-ready {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0;
}

@keyframes glyphGlow {
  0%, 100% { 
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  }
  50% { 
    box-shadow: 0 0 40px rgba(255, 215, 0, 0.6);
  }
}

@keyframes glyphPulse {
  0%, 100% { 
    transform: scale(1);
  }
  50% { 
    transform: scale(1.05);
  }
}

@keyframes glyphDrift {
  0%, 100% { 
    transform: translateX(0) translateY(0);
  }
  25% { 
    transform: translateX(2px) translateY(-1px);
  }
  50% { 
    transform: translateX(-1px) translateY(1px);
  }
  75% { 
    transform: translateX(1px) translateY(-1px);
  }
}

.glyph-container:hover {
  animation: glyphGlow 2s ease-in-out infinite;
}

.glyph-container[data-status="ready"] {
  animation: glyphPulse 3s ease-in-out infinite;
}

.glyph-container.drift-latent {
  animation: glyphDrift 4s ease-in-out infinite;
}
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}
