import * as React from "react"
import { cn } from "@/lib/utils"

export interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
  className?: string
}

const SkipLink = React.forwardRef<HTMLAnchorElement, SkipLinkProps>(
  ({ className, href, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        href={href}
        className={cn(
          "skip-link",
          className
        )}
        {...props}
      >
        {children}
      </a>
    )
  }
)
SkipLink.displayName = "SkipLink"

export { SkipLink }