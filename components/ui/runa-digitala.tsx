'use client'

import { cn } from '@/lib/utils'

interface RunaDigitalaProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'static' | 'animated' | 'glitch'
  className?: string
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32', 
  xl: 'w-48 h-48'
}

export function RunaDigitala({ 
  size = 'md', 
  variant = 'static',
  className 
}: RunaDigitalaProps) {
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
        
        {/* Main rune */}
        <path 
          d="M256 136 L256 376 M216 176 L296 176 M216 336 L296 336" 
          fill="none" 
          stroke="var(--text)" 
          strokeWidth="4" 
          strokeLinecap="round"
        />
        
        {/* Secondary rune */}
        <path 
          d="M216 176 L296 336 M296 176 L216 336" 
          fill="none" 
          stroke="var(--text)" 
          strokeWidth="3" 
          strokeLinecap="round"
        />
        
        {/* Digital lines */}
        <line x1="156" y1="156" x2="216" y2="156" stroke="var(--gold)" strokeWidth="1" />
        <line x1="296" y1="156" x2="356" y2="156" stroke="var(--gold)" strokeWidth="1" />
        <line x1="156" y1="356" x2="216" y2="356" stroke="var(--gold)" strokeWidth="1" />
        <line x1="296" y1="356" x2="356" y2="356" stroke="var(--gold)" strokeWidth="1" />
        <line x1="156" y1="156" x2="156" y2="356" stroke="var(--gold)" strokeWidth="1" />
        <line x1="356" y1="156" x2="356" y2="356" stroke="var(--gold)" strokeWidth="1" />
        
        {/* Intersection points */}
        <circle cx="256" cy="256" r="6" fill="var(--gold)" />
        <circle cx="256" cy="136" r="4" fill="var(--text)" />
        <circle cx="256" cy="376" r="4" fill="var(--text)" />
        <circle cx="216" cy="176" r="4" fill="var(--text)" />
        <circle cx="296" cy="176" r="4" fill="var(--text)" />
        <circle cx="216" cy="336" r="4" fill="var(--text)" />
        <circle cx="296" cy="336" r="4" fill="var(--text)" />
        
        {/* Binary text */}
        <text 
          x="256" 
          y="116" 
          fontFamily="JetBrains Mono, monospace" 
          fontSize="10" 
          fill="var(--textMuted)" 
          textAnchor="middle"
        >
          01010010 01010101 01001110 01000001
        </text>
        <text 
          x="256" 
          y="396" 
          fontFamily="JetBrains Mono, monospace" 
          fontSize="10" 
          fill="var(--textMuted)" 
          textAnchor="middle"
        >
          01000100 01001001 01000111 01001001 01010100 01000001 01001100
        </text>
        
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
          RUNA DIGITALĂ
        </text>
      </svg>
    </div>
  )
}
