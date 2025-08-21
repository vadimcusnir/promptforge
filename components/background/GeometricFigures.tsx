"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface GeometricFiguresProps {
  reduceMotion?: boolean
}

interface Figure {
  id: string
  type: 'circle' | 'triangle' | 'square' | 'line'
  x: number
  y: number
  size: number
  opacity: number
  rotation: number
  speed: number
}

export function GeometricFigures({ reduceMotion = false }: GeometricFiguresProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const figuresRef = useRef<Figure[]>([])
  const animationRef = useRef<number>()
  const [, forceUpdate] = useState({})

  const createFigure = useCallback((index: number): Figure => {
    const types: Figure['type'][] = ['circle', 'triangle', 'square', 'line']
    
    return {
      id: `figure-${index}-${Date.now()}`,
      type: types[Math.floor(Math.random() * types.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 20 + Math.random() * 40,
      opacity: 0.1 + Math.random() * 0.2,
      rotation: Math.random() * 360,
      speed: 0.1 + Math.random() * 0.3
    }
  }, [])

  const initializeFigures = useCallback(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const count = isMobile ? 8 : 12
    
    figuresRef.current = Array.from({ length: count }, (_, i) => createFigure(i))
    forceUpdate({})
  }, [createFigure])

  const updateFigures = useCallback(() => {
    if (reduceMotion) return

    const now = performance.now()

    figuresRef.current = figuresRef.current.map(figure => {
      const newFigure = { ...figure }

      // Slow rotation and movement
      const timeFactor = now / 30000 // 30s cycle
      newFigure.rotation += figure.speed * 0.5
      newFigure.x += Math.sin(timeFactor + figure.x) * 0.005
      newFigure.y += Math.cos(timeFactor + figure.y) * 0.005

      // Keep in bounds
      if (newFigure.x < -10) newFigure.x = 110
      if (newFigure.x > 110) newFigure.x = -10
      if (newFigure.y < -10) newFigure.y = 110
      if (newFigure.y > 110) newFigure.y = -10

      return newFigure
    })

    forceUpdate({})
  }, [reduceMotion])

  const animate = useCallback(() => {
    updateFigures()
    animationRef.current = requestAnimationFrame(animate)
  }, [updateFigures])

  useEffect(() => {
    initializeFigures()
    
    if (!reduceMotion) {
      animationRef.current = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      initializeFigures()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [initializeFigures, animate, reduceMotion])

  const renderFigure = (figure: Figure) => {
    const commonProps = {
      style: {
        position: 'absolute' as const,
        left: `${figure.x}%`,
        top: `${figure.y}%`,
        width: `${figure.size}px`,
        height: `${figure.size}px`,
        opacity: figure.opacity,
        transform: `rotate(${figure.rotation}deg)`,
        pointerEvents: 'none' as const
      }
    }

    switch (figure.type) {
      case 'circle':
        return (
          <div
            key={figure.id}
            {...commonProps}
            className="border border-[#d1a954]/30 rounded-full"
          />
        )
      
      case 'square':
        return (
          <div
            key={figure.id}
            {...commonProps}
            className="border border-[#d1a954]/30"
          />
        )
      
      case 'triangle':
        return (
          <div
            key={figure.id}
            {...commonProps}
            className="border-l-[1px] border-r-[1px] border-b-[1px] border-[#d1a954]/30"
            style={{
              ...commonProps.style,
              width: 0,
              height: 0,
              borderLeftWidth: `${figure.size / 2}px`,
              borderRightWidth: `${figure.size / 2}px`,
              borderBottomWidth: `${figure.size}px`,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: 'rgba(209, 169, 84, 0.3)'
            }}
          />
        )
      
      case 'line':
        return (
          <div
            key={figure.id}
            {...commonProps}
            className="border-t border-[#d1a954]/30"
            style={{
              ...commonProps.style,
              height: '1px',
              transformOrigin: 'left center'
            }}
          />
        )
      
      default:
        return null
    }
  }

  if (reduceMotion) {
    return null // Hide geometric figures when motion is reduced
  }

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0"
      style={{ zIndex: 0 }}
    >
      {figuresRef.current.map(renderFigure)}
    </div>
  )
}
