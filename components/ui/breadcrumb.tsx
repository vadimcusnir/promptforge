import * as React from "react"
import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { getBreadcrumbTrail, type SiteNode } from "@/lib/site-structure"

export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

export interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  path?: string
  className?: string
  showHome?: boolean
  maxItems?: number
}

export function Breadcrumb({ 
  items, 
  path, 
  className, 
  showHome = true,
  maxItems = 5 
}: BreadcrumbProps) {
  // Use provided items or generate from path
  const breadcrumbItems = React.useMemo(() => {
    if (items) {
      return items
    }
    
    if (path) {
      const trail = getBreadcrumbTrail(path)
      return trail.map((node, index) => ({
        label: node.title,
        href: node.path === '/' ? undefined : node.path,
        current: index === trail.length - 1
      }))
    }
    
    return []
  }, [items, path])

  // Limit items if maxItems is specified
  const displayItems = React.useMemo(() => {
    if (breadcrumbItems.length <= maxItems) {
      return breadcrumbItems
    }
    
    // Show first item, ellipsis, and last few items
    const firstItem = breadcrumbItems[0]
    const lastItems = breadcrumbItems.slice(-(maxItems - 2))
    
    return [
      firstItem,
      { label: '...', href: undefined, current: false },
      ...lastItems
    ]
  }, [breadcrumbItems, maxItems])

  if (displayItems.length === 0) {
    return null
  }

  return (
    <nav 
      className={cn("flex items-center space-x-1 text-sm text-gray-400", className)}
      aria-label="Breadcrumb"
    >
      {showHome && (
        <>
          <Link 
            href="/" 
            className="flex items-center hover:text-yellow-400 transition-colors"
            aria-label="Go to homepage"
          >
            <Home className="w-4 h-4" />
          </Link>
          {displayItems.length > 0 && (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          )}
        </>
      )}
      
      {displayItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="w-4 h-4 text-gray-600" />}
          
          {item.href && !item.current ? (
            <Link 
              href={item.href}
              className="hover:text-yellow-400 transition-colors truncate max-w-[200px]"
              title={item.label}
            >
              {item.label}
            </Link>
          ) : (
            <span 
              className={cn(
                "font-medium truncate max-w-[200px]",
                item.current ? "text-yellow-400" : "text-gray-300"
              )}
              aria-current={item.current ? "page" : undefined}
              title={item.label}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

// Convenience component for automatic breadcrumb generation
export function AutoBreadcrumb({ 
  path, 
  className, 
  showHome = true,
  maxItems = 5 
}: Omit<BreadcrumbProps, 'items'>) {
  return (
    <Breadcrumb 
      path={path} 
      className={className} 
      showHome={showHome}
      maxItems={maxItems}
    />
  )
}