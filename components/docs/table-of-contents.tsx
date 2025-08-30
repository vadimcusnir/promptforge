"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface TOCItem {
  id: string
  title: string
  level: number
}

interface TableOfContentsProps {
  items: TOCItem[]
  className?: string
}

export function TableOfContents({ items, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-20% 0% -35% 0%",
      }
    )

    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      items.forEach((item) => {
        const element = document.getElementById(item.id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [items])

  const scrollToElement = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  return (
    <div className={cn("sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto", className)}>
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold text-fg-primary mb-4">Table of Contents</h3>
        <nav className="space-y-1">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToElement(item.id)}
              className={cn(
                "block w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                "hover:bg-accent/10 hover:text-accent",
                item.level === 1 && "font-medium",
                item.level === 2 && "ml-4 text-fg-secondary",
                item.level === 3 && "ml-8 text-fg-secondary text-xs",
                activeId === item.id && "bg-accent/20 text-accent border-l-2 border-accent"
              )}
            >
              {item.title}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}

// Hook to extract headings from content
export function useTableOfContents() {
  const [items, setItems] = useState<TOCItem[]>([])

  useEffect(() => {
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
    const tocItems: TOCItem[] = []

    headings.forEach((heading) => {
      const id = heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, "-") || ""
      const level = parseInt(heading.tagName.charAt(1))
      
      if (id) {
        tocItems.push({
          id,
          title: heading.textContent || "",
          level,
        })
      }
    })

    setItems(tocItems)
  }, [])

  return items
}
