"use client"

import { useAnalytics } from "@/hooks/use-analytics"
import { Suspense } from "react"
import dynamic from "next/dynamic"

// Lazy load non-critical components for better LCP
const LiveGenerationDemo = dynamic(() => import("@/components/home/LiveGenerationDemo"), {
  loading: () => <DemoSkeleton />,
  ssr: false
})

// Skeleton loader for better perceived performance
function DemoSkeleton() {
  return (
    <section className="mt-24 border-t border-gray-700 pt-16 px-4 sm:px-8 lg:px-16">
      <div className="bg-background border border-border rounded-xl p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
          <div className="h-32 bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    </section>
  )
}

export default function HomePageClient() {
  const { trackEvent } = useAnalytics()

  return (
    <Suspense fallback={<DemoSkeleton />}>
      <LiveGenerationDemo />
    </Suspense>
  )
}
