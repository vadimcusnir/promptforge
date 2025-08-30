'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ForgeGlyphProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'static' | 'animated' | 'pulse' | 'glitch'
  className?: string
  onClick?: () => void
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12', 
  lg: 'w-16 h-16',
  xl: 'w-20 h-20'
}

export function ForgeGlyph({ 
  size = 'md', 
  variant = 'static', 
  className,
  onClick 
}: ForgeGlyphProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getVariantClasses = () => {
    switch (variant) {
      case 'animated':
        return 'animate-pulse'
      case 'pulse':
        return 'rune-pulse'
      case 'glitch':
        return isHovered ? 'rune-glitch' : ''
      default:
        return ''
    }
  }

  return (
    <div
      className={cn(
        'rune-executable cursor-pointer transition-all duration-200',
        sizeClasses[size],
        getVariantClasses(),
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background rounded square */}
        <rect 
          x="10" 
          y="10" 
          width="180" 
          height="180" 
          rx="30" 
          ry="30" 
          fill="var(--gold)"
          className="transition-all duration-200"
        />
        
        {/* Forge Glyph */}
        <g fill="var(--bg)" stroke="none">
          {/* Central vertical line */}
          <rect x="95" y="60" width="10" height="80" />
          
          {/* Top diamond */}
          <path d="M100 40 L120 60 L100 80 L80 60 Z" />
          <rect x="95" y="55" width="10" height="20" />
          
          {/* Left zigzag */}
          <path d="M70 80 L50 100 L70 120 L60 130 L30 100 L60 70 Z" />
          
          {/* Right zigzag */}
          <path d="M130 80 L150 100 L130 120 L140 130 L170 100 L140 70 Z" />
          
          {/* Bottom triangle */}
          <path d="M100 140 L130 170 L70 170 Z" />
          
          {/* Face elements */}
          <path 
            d="M85 110 Q100 120 115 110" 
            stroke="var(--bg)" 
            strokeWidth="3" 
            fill="none" 
          />
          <rect x="95" y="125" width="10" height="10" />
        </g>
      </svg>
    </div>
  )
}
