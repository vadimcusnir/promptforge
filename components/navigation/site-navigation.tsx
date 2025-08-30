"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { getNavigationItems, type SiteNode } from "@/lib/site-structure"
import { ChevronDown, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavigationProps {
  className?: string
  showCategories?: boolean
  maxDepth?: number
}

export function SiteNavigation({ 
  className, 
  showCategories = true,
  maxDepth = 2 
}: NavigationProps) {
  const pathname = usePathname()
  const [openDropdowns, setOpenDropdowns] = React.useState<Set<string>>(new Set())

  const mainNavItems = getNavigationItems('main')
  const learningNavItems = getNavigationItems('learning')
  const businessNavItems = getNavigationItems('business')

  const toggleDropdown = (id: string) => {
    setOpenDropdowns(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const isActivePath = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  const renderNavItem = (item: SiteNode, depth = 0) => {
    if (depth >= maxDepth) return null

    const hasChildren = item.children && item.children.length > 0
    const isActive = isActivePath(item.path)
    const isDropdownOpen = openDropdowns.has(item.id)

    if (hasChildren) {
      return (
        <DropdownMenu key={item.id}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors",
                isActive 
                  ? "text-yellow-400 bg-yellow-400/10" 
                  : "text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/5"
              )}
            >
              {item.title}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="start" 
            className="w-56 bg-gray-900 border-gray-700"
          >
            {item.children?.map((child) => (
              <DropdownMenuItem key={child.id} asChild>
                <Link
                  href={child.path}
                  className={cn(
                    "flex items-center gap-2 w-full text-sm",
                    isActivePath(child.path)
                      ? "text-yellow-400 bg-yellow-400/10"
                      : "text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/5"
                  )}
                >
                  {child.title}
                  {child.isExternal && (
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  )}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return (
      <Button
        key={item.id}
        variant="ghost"
        asChild
        className={cn(
          "text-sm font-medium transition-colors",
          isActive 
            ? "text-yellow-400 bg-yellow-400/10" 
            : "text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/5"
        )}
      >
        <Link href={item.path}>
          {item.title}
          {item.isExternal && (
            <ExternalLink className="w-3 h-3 ml-1" />
          )}
        </Link>
      </Button>
    )
  }

  if (!showCategories) {
    return (
      <nav className={cn("flex items-center space-x-1", className)}>
        {mainNavItems.map(item => renderNavItem(item))}
      </nav>
    )
  }

  return (
    <nav className={cn("space-y-4", className)}>
      {/* Main Navigation */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Main
        </h3>
        <div className="flex flex-wrap items-center gap-1">
          {mainNavItems.map(item => renderNavItem(item))}
        </div>
      </div>

      {/* Learning Navigation */}
      {learningNavItems.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Learning
          </h3>
          <div className="flex flex-wrap items-center gap-1">
            {learningNavItems.map(item => renderNavItem(item))}
          </div>
        </div>
      )}

      {/* Business Navigation */}
      {businessNavItems.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Business
          </h3>
          <div className="flex flex-wrap items-center gap-1">
            {businessNavItems.map(item => renderNavItem(item))}
          </div>
        </div>
      )}
    </nav>
  )
}

// Mobile-friendly navigation component
export function MobileSiteNavigation({ className }: { className?: string }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  const allNavItems = [
    ...getNavigationItems('main'),
    ...getNavigationItems('learning'),
    ...getNavigationItems('business')
  ]

  const isActivePath = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium"
      >
        Menu
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4 space-y-2">
            {allNavItems.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-2 text-sm rounded-md transition-colors",
                  isActivePath(item.path)
                    ? "text-yellow-400 bg-yellow-400/10"
                    : "text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/5"
                )}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
