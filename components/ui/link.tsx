import * as React from "react"
import Link from "next/link"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { tokens } from "@/styles/tokens"

const linkVariants = cva(
  "inline-flex items-center transition-all duration-normal focus-ring",
  {
    variants: {
      variant: {
        // Default link - Gold accent
        default: [
          "text-accent-primary",
          "hover:text-accent-secondary hover:underline",
          "active:text-accent-tertiary",
          "focus-visible:text-accent-secondary",
        ],
        // Muted link for secondary actions
        muted: [
          "text-fg-secondary",
          "hover:text-accent-primary hover:underline",
          "active:text-accent-secondary",
          "focus-visible:text-accent-primary",
        ],
        // Ghost link - minimal styling
        ghost: [
          "text-fg-primary",
          "hover:text-accent-primary",
          "active:text-accent-secondary",
          "focus-visible:text-accent-primary",
        ],
        // Destructive link for dangerous actions
        destructive: [
          "text-state-error",
          "hover:text-state-error/80 hover:underline",
          "active:text-state-error/60",
          "focus-visible:text-state-error/80",
        ],
        // Button-like link
        button: [
          "bg-transparent border border-border-primary text-fg-primary px-4 py-2 rounded-lg",
          "hover:bg-bg-glass hover:border-accent-primary hover:text-accent-primary",
          "active:bg-bg-glass-hover active:scale-[0.98]",
          "focus-visible:border-accent-primary focus-visible:text-accent-primary",
        ],
        // Primary button-like link
        primary: [
          "bg-accent-primary text-accent-contrast px-4 py-2 rounded-lg",
          "hover:bg-accent-secondary hover:shadow-lg hover:shadow-accent-primary/25",
          "active:bg-accent-tertiary active:scale-[0.98]",
          "focus-visible:bg-accent-secondary focus-visible:shadow-lg focus-visible:shadow-accent-primary/25",
        ],
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface LinkProps
  extends React.ComponentProps<typeof Link>,
    VariantProps<typeof linkVariants> {
  external?: boolean
  underline?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const UiLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ 
    className, 
    variant, 
    size, 
    external = false, 
    underline = false,
    icon,
    iconPosition = 'right',
    children, 
    href,
    ...props 
  }, ref) => {
    const linkClasses = cn(
      linkVariants({ variant, size }),
      underline && "underline",
      className
    )

    const renderIcon = () => {
      if (!icon) return null
      
      return (
        <span className={cn(
          "h-4 w-4",
          iconPosition === 'left' && children && "mr-2",
          iconPosition === 'right' && children && "ml-2"
        )}>
          {icon}
        </span>
      )
    }

    // External links
    if (external || (typeof href === 'string' && (href.startsWith('http') || href.startsWith('mailto:')))) {
      return (
        <a
          ref={ref}
          href={href as string}
          className={linkClasses}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          {...props}
        >
          {iconPosition === 'left' && renderIcon()}
          {children}
          {iconPosition === 'right' && renderIcon()}
          {external && (
            <span className="ml-1 h-3 w-3" aria-hidden="true">
              <svg viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 1h5v5L9.5 5.5 6.5 8.5 3.5 5.5 2 7V1h4z" />
                <path d="M1 3v8h8V7L7.5 8.5 4.5 5.5 3 7V3H1z" />
              </svg>
            </span>
          )}
        </a>
      )
    }

    // Internal links
    return (
      <Link
        ref={ref}
        href={href}
        className={linkClasses}
        {...props}
      >
        {iconPosition === 'left' && renderIcon()}
        {children}
        {iconPosition === 'right' && renderIcon()}
      </Link>
    )
  }
)
UiLink.displayName = "Link"

export { UiLink as Link, linkVariants }
