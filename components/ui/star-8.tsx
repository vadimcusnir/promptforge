'use client'

import { cn } from '@/lib/utils'

interface Star8Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'static' | 'animated' | 'pulse'
  className?: string
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32'
}

export function Star8({ 
  size = 'md', 
  variant = 'static',
  className 
}: Star8Props) {
  return (
    <div className={cn('inline-block', sizeClasses[size], className)}>
      <svg
        viewBox="0 0 512 512"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <rect width="512" height="512" fill="var(--bg)"/>
        
        {/* Container */}
        <rect 
          x="106" 
          y="106" 
          width="300" 
          height="300" 
          fill="none" 
          stroke="var(--border)" 
          strokeWidth="1" 
          strokeDasharray="4,4"
        />
        
        {/* Outer circle */}
        <circle 
          cx="256" 
          cy="256" 
          r="140" 
          fill="none" 
          stroke="var(--border)" 
          strokeWidth="1"
        />
        
        {/* Inner circle */}
        <circle 
          cx="256" 
          cy="256" 
          r="70" 
          fill="none" 
          stroke="var(--border)" 
          strokeWidth="1"
        />
        
        {/* 8-point star lines */}
        <line x1="116" y1="256" x2="396" y2="256" stroke="var(--text)" strokeWidth="2" />
        <line x1="256" y1="116" x2="256" y2="396" stroke="var(--text)" strokeWidth="2" />
        <line x1="159" y1="159" x2="353" y2="353" stroke="var(--text)" strokeWidth="2" />
        <line x1="353" y1="159" x2="159" y2="353" stroke="var(--text)" strokeWidth="2" />
        
        {/* Intersection points */}
        <circle cx="396" cy="256" r="6" fill="var(--border)" />
        <circle cx="256" cy="116" r="6" fill="var(--border)" />
        <circle cx="116" cy="256" r="6" fill="var(--border)" />
        <circle cx="256" cy="396" r="6" fill="var(--border)" />
        <circle cx="353" cy="159" r="6" fill="var(--border)" />
        <circle cx="353" cy="353" r="6" fill="var(--border)" />
        <circle cx="159" cy="353" r="6" fill="var(--border)" />
        <circle cx="159" cy="159" r="6" fill="var(--border)" />
        
        {/* Center */}
        <circle cx="256" cy="256" r="10" fill="var(--gold)" />
        
        {/* Title */}
        <text 
          x="256" 
          y="436" 
          fontFamily="Space Grotesk, sans-serif" 
          fontSize="20" 
          fontWeight="700" 
          fill="var(--text)" 
          textAnchor="middle"
        >
          STEAUA CU 8 COLȚURI
        </text>
      </svg>
    </div>
  )
}
