export function SkeletonLoader({ className = "", lines = 3 }: { className?: string; lines?: number }) {
  return (
    <div className={`animate-pulse ${className}`} role="status" aria-label="Loading content">
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className={`h-4 bg-gray-700 rounded ${i === lines - 1 ? "w-3/4" : "w-full"}`} />
        ))}
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div
      className="animate-pulse bg-gray-800/50 border border-gray-700 rounded-lg p-6"
      role="status"
      aria-label="Loading card"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-gray-700 rounded"></div>
        <div className="h-3 bg-gray-700 rounded w-5/6"></div>
        <div className="h-3 bg-gray-700 rounded w-4/6"></div>
      </div>
      <span className="sr-only">Loading card content...</span>
    </div>
  )
}
