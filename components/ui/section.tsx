import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const sectionVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        card: "bg-background-secondary border border-border-primary rounded-lg p-6",
        glass: "glass-card p-6",
        elevated: "bg-background-secondary border border-border-primary rounded-lg p-6 shadow-lg",
      },
      spacing: {
        none: "py-0",
        sm: "py-4",
        md: "py-6",
        lg: "py-8",
        xl: "py-12",
        "2xl": "py-16",
      },
      maxWidth: {
        none: "max-w-none",
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
        "6xl": "max-w-6xl",
        "7xl": "max-w-7xl",
        full: "max-w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      spacing: "md",
      maxWidth: "7xl",
    },
  }
)

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: 'section' | 'div' | 'article' | 'aside' | 'main' | 'header' | 'footer'
  id?: string
  ariaLabel?: string
  ariaLabelledBy?: string
  children: React.ReactNode
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ 
    className, 
    variant, 
    spacing, 
    maxWidth, 
    as = 'section', 
    id, 
    ariaLabel, 
    ariaLabelledBy, 
    children, 
    ...props 
  }, ref) => {
    const Component = as as React.ElementType

    return (
      <Component
        ref={ref}
        id={id}
        className={cn(
          sectionVariants({ variant, spacing, maxWidth }),
          "mx-auto px-4 sm:px-6 lg:px-8",
          className
        )}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
Section.displayName = "Section"

// Convenience components for semantic sections
export const Main = React.forwardRef<HTMLElement, Omit<SectionProps, 'as'>>(
  (props, ref) => <Section ref={ref} as="main" {...props} />
)
Main.displayName = "Main"

export const Article = React.forwardRef<HTMLElement, Omit<SectionProps, 'as'>>(
  (props, ref) => <Section ref={ref} as="article" {...props} />
)
Article.displayName = "Article"

export const Aside = React.forwardRef<HTMLElement, Omit<SectionProps, 'as'>>(
  (props, ref) => <Section ref={ref} as="aside" {...props} />
)
Aside.displayName = "Aside"

export const Header = React.forwardRef<HTMLElement, Omit<SectionProps, 'as'>>(
  (props, ref) => <Section ref={ref} as="header" {...props} />
)
Header.displayName = "Header"

export const Footer = React.forwardRef<HTMLElement, Omit<SectionProps, 'as'>>(
  (props, ref) => <Section ref={ref} as="footer" {...props} />
)
Footer.displayName = "Footer"

export { Section, sectionVariants }
