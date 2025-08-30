import * as React from "react"
import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav 
      className={cn("flex items-center space-x-1 text-sm text-gray-400", className)}
      aria-label="Breadcrumb"
    >
      <Link 
        href="/" 
        className="flex items-center hover:text-yellow-400 transition-colors"
        aria-label="Go to homepage"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          {item.href && !item.current ? (
            <Link 
              href={item.href}
              className="hover:text-yellow-400 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span 
              className={cn(
                "font-medium",
                item.current ? "text-yellow-400" : "text-gray-300"
              )}
              aria-current={item.current ? "page" : undefined}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}