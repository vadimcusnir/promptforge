import type React from "react"

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  size?: "default" | "wide" | "full"
  padding?: "default" | "large" | "none"
}

export function PageContainer({ children, className = "", size = "default", padding = "default" }: PageContainerProps) {
  const sizeClasses = {
    default: "container-design-system",
    wide: "max-w-7xl mx-auto px-6",
    full: "w-full",
  }

  const paddingClasses = {
    default: "py-8",
    large: "py-12",
    none: "",
  }

  return <div className={`${sizeClasses[size]} ${paddingClasses[padding]} ${className}`}>{children}</div>
}
