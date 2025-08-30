import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const skeletonVariants = cva(
  "animate-pulse rounded-md bg-muted",
  {
    variants: {
      variant: {
        default: "bg-muted",
        glass: "bg-bg-glass",
        card: "bg-bg-secondary",
      },
      size: {
        sm: "h-4",
        md: "h-6",
        lg: "h-8",
        xl: "h-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(skeletonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

// Pre-built skeleton components for common patterns
export const CardSkeleton = React.forwardRef<HTMLDivElement, { className?: string }>(
  ({ className }, ref) => (
    <div
      ref={ref}
      className={cn("glass-card p-6 space-y-4", className)}
    >
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  )
)
CardSkeleton.displayName = "CardSkeleton"

export const ListSkeleton = React.forwardRef<HTMLDivElement, { 
  className?: string
  count?: number
}>(
  ({ className, count = 5 }, ref) => (
    <div ref={ref} className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 glass-card rounded-lg">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  )
)
ListSkeleton.displayName = "ListSkeleton"

export const TableSkeleton = React.forwardRef<HTMLDivElement, {
  className?: string
  rows?: number
  columns?: number
}>(
  ({ className, rows = 5, columns = 4 }, ref) => (
    <div ref={ref} className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex space-x-4 p-4 glass-card rounded-lg">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 p-4 glass-card rounded-lg">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
)
TableSkeleton.displayName = "TableSkeleton"

export const HeroSkeleton = React.forwardRef<HTMLDivElement, { className?: string }>(
  ({ className }, ref) => (
    <div
      ref={ref}
      className={cn("text-center space-y-6 py-24", className)}
    >
      <Skeleton className="h-4 w-32 mx-auto" />
      <Skeleton className="h-16 w-3/4 mx-auto" />
      <Skeleton className="h-6 w-1/2 mx-auto" />
      <div className="flex justify-center space-x-4">
        <Skeleton className="h-12 w-32" />
        <Skeleton className="h-12 w-28" />
      </div>
    </div>
  )
)
HeroSkeleton.displayName = "HeroSkeleton"

export const ModuleGridSkeleton = React.forwardRef<HTMLDivElement, {
  className?: string
  count?: number
}>(
  ({ className, count = 12 }, ref) => (
    <div
      ref={ref}
      className={cn("grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4", className)}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card p-4 space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex space-x-1">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-5 w-10" />
          </div>
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </div>
  )
)
ModuleGridSkeleton.displayName = "ModuleGridSkeleton"

// Additional skeleton components for specific use cases
export const SkeletonInput = React.forwardRef<HTMLDivElement, { className?: string }>(
  ({ className }, ref) => (
    <Skeleton
      ref={ref}
      className={cn("h-10 w-full rounded-md", className)}
    />
  )
)
SkeletonInput.displayName = "SkeletonInput"

export const SkeletonCard = React.forwardRef<HTMLDivElement, { className?: string }>(
  ({ className }, ref) => (
    <div
      ref={ref}
      className={cn("glass-card p-4 space-y-3", className)}
    >
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
)
SkeletonCard.displayName = "SkeletonCard"

// Additional skeleton components for specific use cases
export const SkeletonButton = React.forwardRef<HTMLDivElement, { className?: string }>(
  ({ className }, ref) => (
    <Skeleton
      ref={ref}
      className={cn("h-10 w-24 rounded-md", className)}
    />
  )
)
SkeletonButton.displayName = "SkeletonButton"

export const SkeletonText = React.forwardRef<HTMLDivElement, { 
  className?: string
  lines?: number
}>(
  ({ className, lines = 3 }, ref) => (
    <div ref={ref} className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn(
            "h-4",
            i === lines - 1 ? "w-3/4" : "w-full"
          )} 
        />
      ))}
    </div>
  )
)
SkeletonText.displayName = "SkeletonText"

export { Skeleton, skeletonVariants }