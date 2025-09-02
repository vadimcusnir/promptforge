import type React from "react"

interface HeroBlockProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
  className?: string
}

export function HeroBlock({ title, subtitle, children, className = "" }: HeroBlockProps) {
  return (
    <div className={`border-b border-border bg-background ${className}`}>
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="py-12 md:py-16">
          <h1 className="font-cinzel text-[36px] md:text-[48px] leading-[1.35] font-bold text-foreground mb-4 max-w-[75ch]">
            {title}
          </h1>

          {subtitle && (
            /* Subheading with Space Grotesk, 18px mobile/20px desktop, opacity-80 */
            <p className="font-space-grotesk text-[18px] md:text-[20px] text-foreground/80 max-w-[75ch] mb-8">
              {subtitle}
            </p>
          )}

          {children && <div className="max-w-[75ch]">{children}</div>}
        </div>
      </div>
    </div>
  )
}
