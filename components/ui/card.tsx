import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { tokens } from "@/styles/tokens"

const cardVariants = cva(
  "flex flex-col transition-all duration-normal focus-ring",
  {
    variants: {
      variant: {
        // Default glass card
        default: [
          "glass-card",
          "hover:glass-card-hover",
        ],
        // Elevated card with more prominent shadow
        elevated: [
          "bg-bg-secondary border-border-primary shadow-lg",
          "hover:shadow-xl hover:shadow-accent-primary/10 hover:-translate-y-1",
        ],
        // Minimal card with subtle styling
        minimal: [
          "bg-transparent border border-border-secondary",
          "hover:border-accent-primary hover:bg-bg-glass",
        ],
        // Interactive card for clickable content
        interactive: [
          "glass-card cursor-pointer",
          "hover:glass-card-hover hover:scale-[1.02]",
          "active:scale-[0.98]",
        ],
      },
      size: {
        sm: "p-4 gap-4",
        md: "p-6 gap-6",
        lg: "p-8 gap-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {
  asChild?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? "div" : "div"
    
    return (
      <Comp
        className={cn(cardVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold leading-none tracking-tight text-fg-primary",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-sm text-fg-secondary",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex-1 text-fg-primary",
        className
      )}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center pt-6 border-t border-border-primary",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
}
