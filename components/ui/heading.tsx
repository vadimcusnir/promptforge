import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const headingVariants = cva(
  "font-semibold text-fg-primary leading-tight",
  {
    variants: {
      level: {
        1: "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight",
        2: "text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight",
        3: "text-2xl md:text-3xl lg:text-4xl font-bold",
        4: "text-xl md:text-2xl lg:text-3xl font-semibold",
        5: "text-lg md:text-xl lg:text-2xl font-semibold",
        6: "text-base md:text-lg lg:text-xl font-semibold",
      },
      variant: {
        default: "text-fg-primary",
        accent: "text-accent-primary",
        muted: "text-fg-secondary",
        success: "text-state-success",
        warning: "text-state-warning",
        error: "text-state-error",
      },
      spacing: {
        none: "mb-0",
        sm: "mb-2",
        md: "mb-4",
        lg: "mb-6",
        xl: "mb-8",
      },
    },
    defaultVariants: {
      level: 1,
      variant: "default",
      spacing: "md",
    },
  }
)

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  id?: string
  children: React.ReactNode
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level, variant, spacing, as, id, children, ...props }, ref) => {
    // Determine the HTML element based on level or as prop
    const Component = as || (`h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6')
    
    // Generate ID if not provided for anchor linking
    const headingId = id || (typeof children === 'string' 
      ? children.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      : undefined
    )

    const HeadingComponent = Component as React.ElementType

    return (
      <HeadingComponent
        ref={ref}
        id={headingId}
        className={cn(headingVariants({ level, variant, spacing, className }))}
        {...props}
      >
        {children}
        {headingId && (
          <a
            href={`#${headingId}`}
            className="ml-2 text-fg-tertiary hover:text-accent-primary opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={`Link to ${children}`}
            tabIndex={-1}
          >
            #
          </a>
        )}
      </HeadingComponent>
    )
  }
)
Heading.displayName = "Heading"

// Convenience components for each heading level
export const H1 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={1} {...props} />
)
H1.displayName = "H1"

export const H2 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={2} {...props} />
)
H2.displayName = "H2"

export const H3 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={3} {...props} />
)
H3.displayName = "H3"

export const H4 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={4} {...props} />
)
H4.displayName = "H4"

export const H5 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={5} {...props} />
)
H5.displayName = "H5"

export const H6 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={6} {...props} />
)
H6.displayName = "H6"

export { Heading, headingVariants }
