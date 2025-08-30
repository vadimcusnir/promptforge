'use client'

import { cn } from '@/lib/utils'

interface ForgeLogoFullProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'static' | 'animated'
  className?: string
  onClick?: () => void
}

const sizeClasses = {
  sm: 'h-8',
  md: 'h-12',
  lg: 'h-16',
  xl: 'h-20'
}

export function ForgeLogoFull({ 
  size = 'md', 
  variant = 'static',
  className,
  onClick 
}: ForgeLogoFullProps) {
  return (
    <div 
      className={cn(
        'cursor-pointer transition-all duration-200',
        sizeClasses[size],
        className
      )}
      onClick={onClick}
    >
      <img
        src="/brand/forge_logo_with_text.png"
        alt="PromptForge"
        className="h-full w-auto object-contain"
        onError={(e) => {
          // Fallback to SVG if image fails to load
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          const parent = target.parentElement
          if (parent) {
            parent.innerHTML = `
              <div class="flex items-center space-x-3 h-full">
                <svg viewBox="0 0 200 200" class="h-full w-auto" xmlns="http://www.w3.org/2000/svg">
                  <rect x="10" y="10" width="180" height="180" rx="30" ry="30" fill="var(--gold)"/>
                  <g fill="var(--bg)" stroke="none">
                    <rect x="95" y="60" width="10" height="80" />
                    <path d="M100 40 L120 60 L100 80 L80 60 Z" />
                    <rect x="95" y="55" width="10" height="20" />
                    <path d="M70 80 L50 100 L70 120 L60 130 L30 100 L60 70 Z" />
                    <path d="M130 80 L150 100 L130 120 L140 130 L170 100 L140 70 Z" />
                    <path d="M100 140 L130 170 L70 170 Z" />
                    <path d="M85 110 Q100 120 115 110" stroke="var(--bg)" stroke-width="3" fill="none" />
                    <rect x="95" y="125" width="10" height="10" />
                  </g>
                </svg>
                <span class="font-display font-semibold text-foreground text-xl">PromptForge™</span>
              </div>
            `
          }
        }}
      />
    </div>
  )
}
