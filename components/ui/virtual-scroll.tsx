"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

interface VirtualScrollProps<T> {
  items: T[]
  height: number
  itemHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  overscan?: number
  className?: string
}

export function VirtualScroll<T>({
  items,
  height,
  itemHeight,
  renderItem,
  overscan = 5,
  className = ""
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight)
    const end = Math.min(
      start + Math.ceil(height / itemHeight) + overscan,
      items.length
    )
    const startIndex = Math.max(0, start - overscan)
    
    return { startIndex, endIndex: end }
  }, [scrollTop, itemHeight, height, overscan, items.length])

  // Calculate total height and transform
  const totalHeight = items.length * itemHeight
  const transform = `translateY(${visibleRange.startIndex * itemHeight}px)`

  // Handle scroll events
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  // Scroll to specific item
  const scrollToItem = useCallback((index: number) => {
    if (containerRef.current) {
      const scrollTop = index * itemHeight
      containerRef.current.scrollTop = scrollTop
    }
  }, [itemHeight])

  // Scroll to top
  const scrollToTop = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0
    }
  }, [])

  // Auto-scroll to top when items change
  useEffect(() => {
    scrollToTop()
  }, [items, scrollToTop])

  return (
    <div className={`virtual-scroll ${className}`}>
      <div
        ref={containerRef}
        className="virtual-scroll-container"
        style={{ height, overflow: 'auto' }}
        onScroll={handleScroll}
      >
        <div
          className="virtual-scroll-content"
          style={{ height: totalHeight, position: 'relative' }}
        >
          <div
            className="virtual-scroll-items"
            style={{ transform }}
          >
            {items
              .slice(visibleRange.startIndex, visibleRange.endIndex)
              .map((item, index) => (
                <div
                  key={visibleRange.startIndex + index}
                  className="virtual-scroll-item"
                  style={{ height: itemHeight }}
                >
                  {renderItem(item, visibleRange.startIndex + index)}
                </div>
              ))}
          </div>
        </div>
      </div>
      
      {/* Scroll position indicator */}
      <div className="virtual-scroll-info text-xs text-gray-500 mt-2">
        Showing {visibleRange.startIndex + 1}-{visibleRange.endIndex} of {items.length} items
        {scrollTop > 0 && (
          <button
            onClick={scrollToTop}
            className="ml-2 text-yellow-400 hover:text-yellow-300 underline"
          >
            Back to top
          </button>
        )}
      </div>
    </div>
  )
}

// Hook for virtual scrolling logic
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan = 5
) {
  const [scrollTop, setScrollTop] = useState(0)

  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight)
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length
    )
    const startIndex = Math.max(0, start - overscan)
    
    return { startIndex, endIndex: end }
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length])

  const totalHeight = items.length * itemHeight
  const transform = `translateY(${visibleRange.startIndex * itemHeight}px)`

  const handleScroll = useCallback((scrollTop: number) => {
    setScrollTop(scrollTop)
  }, [])

  const scrollToItem = useCallback((index: number) => {
    return index * itemHeight
  }, [itemHeight])

  return {
    visibleRange,
    totalHeight,
    transform,
    handleScroll,
    scrollToItem,
    scrollTop
  }
}

// Optimized list component for long content
export function OptimizedList<T>({
  items,
  renderItem,
  maxHeight = 400,
  itemHeight = 60,
  className = ""
}: {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  maxHeight?: number
  itemHeight?: number
  className?: string
}) {
  const [showAll, setShowAll] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  // Show first few items by default
  const initialItems = items.slice(0, 5)
  const remainingItems = items.slice(5)

  const toggleItem = useCallback((index: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }, [])

  const toggleShowAll = useCallback(() => {
    setShowAll(!showAll)
  }, [showAll])

  if (items.length <= 5) {
    return (
      <div className={`optimized-list ${className}`}>
        {items.map((item, index) => (
          <div key={index} className="optimized-list-item">
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`optimized-list ${className}`}>
      {/* Initial items */}
      {initialItems.map((item, index) => (
        <div key={index} className="optimized-list-item">
          {renderItem(item, index)}
        </div>
      ))}

      {/* Expandable remaining items */}
      {!showAll && remainingItems.length > 0 && (
        <div className="optimized-list-expandable">
          <button
            onClick={toggleShowAll}
            className="text-yellow-400 hover:text-yellow-300 text-sm underline"
          >
            Show {remainingItems.length} more items
          </button>
        </div>
      )}

      {/* All remaining items when expanded */}
      {showAll && remainingItems.map((item, index) => (
        <div key={index + 5} className="optimized-list-item">
          {renderItem(item, index + 5)}
        </div>
      ))}

      {/* Collapse button */}
      {showAll && (
        <div className="optimized-list-collapse">
          <button
            onClick={toggleShowAll}
            className="text-gray-400 hover:text-gray-300 text-sm underline"
          >
            Show less
          </button>
        </div>
      )}
    </div>
  )
}
