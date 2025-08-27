import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

// Enhanced skeleton variants
function SkeletonText({ className, lines = 3, ...props }: React.ComponentProps<"div"> & { lines?: number }) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
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
}

function SkeletonCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("rounded-lg border bg-card p-6", className)} {...props}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <SkeletonText lines={3} />
      </div>
    </div>
  )
}

function SkeletonButton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Skeleton className={cn("h-10 w-24", className)} {...props} />
  )
}

function SkeletonInput({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Skeleton className={cn("h-10 w-full", className)} {...props} />
  )
}

function SkeletonBadge({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Skeleton className={cn("h-6 w-16", className)} {...props} />
  )
}

export { Skeleton, SkeletonText, SkeletonCard, SkeletonButton, SkeletonInput, SkeletonBadge }
