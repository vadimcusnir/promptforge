"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface RitualAnimationProps {
  type: 'glyph-reveal' | 'golden-pulse' | 'magnetic-sigil' | 'click-ignition' | 'neon-trail' | 'dust-bloom' | 'outline-fill' | 'ink-spread' | 'hover-breathing' | 'triumph-lines' | 'scroll-reveal' | 'time-pulse'
  isActive?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function RitualAnimation({ type, isActive = false, className, size = 'md' }: RitualAnimationProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  }

  const renderAnimation = () => {
    switch (type) {
      case 'glyph-reveal':
        return (
          <div className="relative w-full h-full">
            {/* Vertical line cutting through */}
            <div className={cn(
              "absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-400 to-transparent transform -translate-x-1/2",
              "transition-all duration-1000",
              isActive && "h-full opacity-100",
              !isActive && "h-0 opacity-0"
            )} />
            {/* Glyph appears */}
            <div className={cn(
              "absolute inset-0 flex items-center justify-center text-black font-mono font-bold text-2xl",
              "transition-all duration-1000 delay-500",
              isActive && "opacity-100 scale-100",
              !isActive && "opacity-0 scale-50"
            )}>
              ∇
            </div>
          </div>
        )

      case 'golden-pulse':
        return (
          <div className="relative w-full h-full">
            <div className={cn(
              "absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500",
              "animate-pulse transition-all duration-1000",
              isActive && "scale-110 shadow-lg shadow-yellow-400/50"
            )} />
            <div className="absolute inset-0 flex items-center justify-center text-black font-mono font-bold text-xl">
              ~
            </div>
          </div>
        )

      case 'magnetic-sigil':
        return (
          <div 
            className="relative w-full h-full cursor-pointer"
            onMouseMove={(e) => {
              if (!isActive) return
              const rect = e.currentTarget.getBoundingClientRect()
              const x = e.clientX - rect.left - rect.width / 2
              const y = e.clientY - rect.top - rect.height / 2
              const distance = Math.sqrt(x * x + y * y)
              const maxDistance = rect.width / 2
              
              if (distance < maxDistance) {
                const force = (maxDistance - distance) / maxDistance
                e.currentTarget.style.transform = `translate(${x * force * 0.1}px, ${y * force * 0.1}px)`
              }
            }}
            onMouseLeave={() => {
              if (isActive) {
                const target = document.querySelector('.magnetic-sigil')
                if (target) {
                  (target as HTMLElement).style.transform = 'translate(0, 0)'
                }
              }
            }}
          >
            <div className={cn(
              "absolute inset-0 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500",
              "transition-all duration-300",
              isActive && "shadow-lg shadow-yellow-400/50"
            )} />
            <div className="absolute inset-0 flex items-center justify-center text-black font-mono font-bold text-xl">
              { }
            </div>
          </div>
        )

      case 'click-ignition':
        return (
          <div 
            className="relative w-full h-full cursor-pointer"
            onClick={() => setIsClicked(!isClicked)}
          >
            <div className={cn(
              "absolute inset-0 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500",
              "transition-all duration-500",
              isClicked && "rotate-180 scale-110"
            )} />
            <div className="absolute inset-0 flex items-center justify-center text-black font-mono font-bold text-xl">
              ∇
            </div>
          </div>
        )

      case 'neon-trail':
        return (
          <div className="relative w-full h-full">
            <div className={cn(
              "absolute inset-0 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500",
              "transition-all duration-1000"
            )} />
            <div className={cn(
              "absolute inset-0 rounded-lg border-2 border-cyan-400",
              "animate-pulse transition-all duration-1000",
              isActive && "shadow-lg shadow-cyan-400/50"
            )} />
            <div className="absolute inset-0 flex items-center justify-center text-black font-mono font-bold text-xl">
              ∇
            </div>
          </div>
        )

      case 'dust-bloom':
        return (
          <div className="relative w-full h-full">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500" />
            {/* Dust particles */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "absolute w-1 h-1 bg-yellow-200 rounded-full",
                  "transition-all duration-2000",
                  isActive && "opacity-100",
                  !isActive && "opacity-0"
                )}
                style={{
                  left: `${20 + (i * 10)}%`,
                  top: `${20 + (i * 8)}%`,
                  animationDelay: `${i * 0.2}s`,
                  animation: isActive ? `dustBloom 2s ease-out ${i * 0.2}s infinite` : 'none'
                }}
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center text-black font-mono font-bold text-xl">
              ∇
            </div>
          </div>
        )

      case 'outline-fill':
        return (
          <div className="relative w-full h-full">
            <div className={cn(
              "absolute inset-0 rounded-lg border-2 border-yellow-400",
              "transition-all duration-1000",
              isActive && "bg-gradient-to-br from-yellow-400 to-amber-500"
            )} />
            <div className="absolute inset-0 flex items-center justify-center text-black font-mono font-bold text-xl">
              ∇
            </div>
          </div>
        )

      case 'ink-spread':
        return (
          <div className="relative w-full h-full">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500" />
            <div className={cn(
              "absolute inset-0 rounded-lg bg-black",
              "transition-all duration-1000",
              isActive && "opacity-0",
              !isActive && "opacity-100"
            )} />
            <div className="absolute inset-0 flex items-center justify-center text-white font-mono font-bold text-xl">
              ∇
            </div>
          </div>
        )

      case 'hover-breathing':
        return (
          <div 
            className="relative w-full h-full cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className={cn(
              "absolute inset-0 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500",
              "transition-all duration-300",
              isHovered && "scale-105"
            )} />
            <div className="absolute inset-0 flex items-center justify-center text-black font-mono font-bold text-xl">
              ∇
            </div>
          </div>
        )

      case 'triumph-lines':
        return (
          <div className="relative w-full h-full">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500" />
            {/* Three vertical lines */}
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "absolute w-0.5 h-full bg-black",
                  "transition-all duration-1000",
                  isActive && "opacity-100",
                  !isActive && "opacity-0"
                )}
                style={{
                  left: `${30 + (i * 20)}%`,
                  animationDelay: `${i * 0.3}s`,
                  animation: isActive ? `triumphLines 1s ease-out ${i * 0.3}s` : 'none'
                }}
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center text-black font-mono font-bold text-xl">
              ∇
            </div>
          </div>
        )

      case 'scroll-reveal':
        return (
          <div className="relative w-full h-full">
            <div className={cn(
              "absolute inset-0 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500",
              "transition-all duration-1000",
              isActive && "opacity-100 scale-100",
              !isActive && "opacity-0 scale-50"
            )} />
            <div className="absolute inset-0 flex items-center justify-center text-black font-mono font-bold text-xl">
              ∇
            </div>
          </div>
        )

      case 'time-pulse':
        return (
          <div className="relative w-full h-full">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500" />
            <div className={cn(
              "absolute inset-0 rounded-lg border-2 border-black",
              "animate-pulse transition-all duration-1000",
              isActive && "border-yellow-200"
            )} />
            <div className="absolute inset-0 flex items-center justify-center text-black font-mono font-bold text-xl">
              ∇
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={cn(sizeClasses[size], className)}>
      {renderAnimation()}
    </div>
  )
}

// CSS animations
const styles = `
@keyframes dustBloom {
  0% {
    opacity: 0;
    transform: scale(0) translateY(0);
  }
  50% {
    opacity: 1;
    transform: scale(1) translateY(-10px);
  }
  100% {
    opacity: 0;
    transform: scale(0) translateY(-20px);
  }
}

@keyframes triumphLines {
  0% {
    height: 0;
    opacity: 0;
  }
  100% {
    height: 100%;
    opacity: 1;
  }
}

.magnetic-sigil {
  transition: transform 0.1s ease-out;
}
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}
