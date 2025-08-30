import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { tokens } from "@/styles/tokens"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-ring disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden touch-optimized",
  {
    variants: {
      variant: {
        // Primary variant - Gold accent with dark contrast - WCAG 2.1 AA compliant
        primary: [
          "bg-accent-primary text-accent-contrast border-2 border-transparent",
          "hover:bg-accent-hover hover:shadow-lg hover:shadow-accent-primary/25 hover:border-accent-focus",
          "active:bg-accent-tertiary active:scale-[0.98] active:border-accent-primary",
          "focus-visible:bg-accent-focus focus-visible:border-accent-primary",
          "disabled:bg-muted-primary disabled:text-muted-accent disabled:border-muted-secondary",
        ],
        // Secondary variant - Ghost/outline style - WCAG 2.1 AA compliant
        secondary: [
          "bg-transparent border-2 border-border-primary text-fg-primary",
          "hover:bg-bg-glass hover:border-accent-primary hover:text-accent-primary hover:shadow-md",
          "active:bg-bg-glass-hover active:scale-[0.98] active:border-accent-hover",
          "focus-visible:bg-bg-glass focus-visible:border-accent-focus focus-visible:text-accent-primary",
          "disabled:border-muted-secondary disabled:text-muted-accent disabled:bg-transparent",
        ],
        // Ghost variant - Minimal styling - WCAG 2.1 AA compliant
        ghost: [
          "bg-transparent text-fg-primary border-2 border-transparent",
          "hover:bg-bg-glass hover:text-accent-primary hover:border-accent-primary/20",
          "active:bg-bg-glass-hover active:scale-[0.98] active:border-accent-primary/40",
          "focus-visible:bg-bg-glass focus-visible:text-accent-primary focus-visible:border-accent-primary",
          "disabled:text-muted-accent disabled:bg-transparent",
        ],
        // Destructive variant - Error state - WCAG 2.1 AA compliant
        destructive: [
          "bg-state-error text-white border-2 border-transparent",
          "hover:bg-state-error/90 hover:shadow-lg hover:shadow-state-error/25 hover:border-state-error/80",
          "active:bg-state-error/80 active:scale-[0.98] active:border-state-error",
          "focus-visible:bg-state-error/95 focus-visible:border-state-error",
          "disabled:bg-muted-primary disabled:text-muted-accent disabled:border-muted-secondary",
        ],
        // Link variant - Text only - WCAG 2.1 AA compliant
        link: [
          "bg-transparent text-accent-primary underline-offset-4 border-2 border-transparent",
          "hover:underline hover:text-accent-hover hover:border-accent-primary/20",
          "active:text-accent-tertiary active:border-accent-primary/40",
          "focus-visible:text-accent-focus focus-visible:border-accent-primary focus-visible:underline",
          "disabled:text-muted-accent disabled:no-underline",
        ],
        // Backward compatibility variants
        default: [
          "bg-primary text-primary-foreground",
          "hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25",
          "active:bg-primary/80 active:scale-[0.98]",
          "disabled:bg-muted disabled:text-muted-foreground",
        ],
        outline: [
          "bg-transparent border border-border text-foreground",
          "hover:bg-accent hover:text-accent-foreground",
          "active:bg-accent/80 active:scale-[0.98]",
          "disabled:border-muted disabled:text-muted-foreground",
        ],
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-6 text-base",
        icon: "h-10 w-10",
        default: "h-10 px-4 text-sm", // Backward compatibility
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  ariaLabel?: string
  ariaDescribedBy?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'link' | 'default' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'icon' | 'default'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false, 
    ariaLabel, 
    ariaDescribedBy,
    icon,
    iconPosition = 'left',
    children, 
    disabled, 
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Enhanced accessibility attributes - WCAG 2.1 AA compliant
    const accessibilityProps = {
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      "aria-busy": loading,
      "aria-disabled": disabled || loading,
      "role": "button",
      "tabIndex": disabled || loading ? -1 : 0,
      ...(loading && { "aria-live": "polite" as const }),
      ...(variant === 'destructive' && { "aria-describedby": "destructive-action-warning" }),
    }

    const renderIcon = () => {
      if (loading) {
        return (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" 
               role="status" 
               aria-label="Loading">
            <span className="sr-only">Loading...</span>
          </div>
        )
      }
      
      if (icon) {
        const iconElement = (
          <span className={cn(
            "h-4 w-4",
            iconPosition === 'left' && children && "mr-2",
            iconPosition === 'right' && children && "ml-2"
          )}>
            {icon}
          </span>
        )
        
        return iconElement
      }
      
      return null
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
        {...accessibilityProps}
      >
        {iconPosition === 'left' && renderIcon()}
        {children}
        {iconPosition === 'right' && renderIcon()}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
