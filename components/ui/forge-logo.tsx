'use client'

import { cn } from '@/lib/utils'
import { ForgeGlyph } from './forge-glyph'

interface ForgeLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'static' | 'animated' | 'pulse' | 'glitch'
  showText?: boolean
  className?: string
  onClick?: () => void
}

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl'
}

export function ForgeLogo({ 
  size = 'md', 
  variant = 'static',
  showText = true,
  className,
  onClick 
}: ForgeLogoProps) {
  return (
    <div 
      className={cn(
        'flex items-center space-x-3 cursor-pointer transition-all duration-200',
        className
      )}
      onClick={onClick}
    >
      <ForgeGlyph variant={variant} size={size} />
      {showText && (
        <span className={cn(
          'font-display font-semibold text-foreground',
          sizeClasses[size]
        )}>
          PromptForge™
        </span>
      )}
    </div>
  )
}
