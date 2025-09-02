import type React from "react"
import { BlogPerformanceOptimizations } from "@/components/blog/performance-optimizations"

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <BlogPerformanceOptimizations />
      {children}
    </>
  )
}
