import * as React from "react"
import { cn } from "@/lib/utils"

export interface ScreenReaderOnlyProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  as?: 'span' | 'div' | 'p'
}

const ScreenReaderOnly = React.forwardRef<HTMLSpanElement, ScreenReaderOnlyProps>(
  ({ className, children, as: Component = 'span', ...props }, ref) => {
    return (
      <Component
        ref={ref as any}
        className={cn(
          "sr-only",
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
ScreenReaderOnly.displayName = "ScreenReaderOnly"

export { ScreenReaderOnly }
