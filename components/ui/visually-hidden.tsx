import * as React from "react"
import { cn } from "@/lib/utils"

export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  as?: 'span' | 'div' | 'p'
  showOnFocus?: boolean
}

const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ className, children, as: Component = 'span', showOnFocus = false, ...props }, ref) => {
    return (
      <Component
        ref={ref as any}
        className={cn(
          "absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0",
          showOnFocus && "focus:static focus:w-auto focus:h-auto focus:p-3 focus:m-0 focus:overflow-visible focus:whitespace-normal focus:border focus:border-accent-primary focus:bg-background-primary focus:text-fg-primary focus:z-50",
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
VisuallyHidden.displayName = "VisuallyHidden"

export { VisuallyHidden }
