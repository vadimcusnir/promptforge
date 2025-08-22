"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { ENHANCED_NARRATIVE_QUOTES, type EnhancedNarrativeQuote } from "@/lib/data/background-data"

interface NarrativeLayerProps {
  className?: string
  style?: React.CSSProperties
  interval: number // ms between quotes (0 = disabled)
  typingSpeed: number // ms per character (40-60ms)
  reducedMotion: boolean
}

interface ActiveQuote extends EnhancedNarrativeQuote {
  id: string
  x: number
  y: number
  opacity: number
  scale: number
  currentChar: number
  isActive: boolean
  animationDelay: number
  phase: 'pre' | 'typing' | 'hold' | 'fadeout' | 'cooldown'
  phaseStartTime: number
  lastCharTime: number
}

export function NarrativeLayer({
  className = "",
  style,
  interval,
  typingSpeed,
  reducedMotion
}: NarrativeLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeQuote, setActiveQuote] = useState<ActiveQuote | null>(null)
  const [cooldownQuotes, setCooldownQuotes] = useState<Set<string>>(new Set())
  const animationRef = useRef<number>()
  const nextQuoteTimeout = useRef<NodeJS.Timeout>()

  // Get position for corner placement
  const getCornerPosition = useCallback((corner: ActiveQuote['corner'], container: HTMLElement) => {
    const rect = container.getBoundingClientRect()
    const margin = 40 // Distance from edges
    
    switch (corner) {
      case 'top-left':
        return { x: margin, y: margin }
      case 'top-right':
        return { x: rect.width - 300 - margin, y: margin }
      case 'bottom-left':
        return { x: margin, y: rect.height - 100 - margin }
      case 'bottom-right':
        return { x: rect.width - 300 - margin, y: rect.height - 100 - margin }
      case 'center':
        return { x: rect.width / 2 - 150, y: rect.height / 2 - 50 }
      default:
        return { x: margin, y: margin }
    }
  }, [])

  // Select next quote based on priority and cooldown
  const selectNextQuote = useCallback(() => {
    if (!containerRef.current || interval === 0) return null

    const availableQuotes = ENHANCED_NARRATIVE_QUOTES.filter(
      quote => !cooldownQuotes.has(quote.text)
    )

    if (availableQuotes.length === 0) {
      // Reset cooldowns if all quotes are on cooldown
      setCooldownQuotes(new Set())
      return ENHANCED_NARRATIVE_QUOTES[0]
    }

    // Sort by priority (higher is better)
    const sortedQuotes = [...availableQuotes].sort((a, b) => b.priority - a.priority)
    
    // Select from top 3 priorities with some randomness
    const topQuotes = sortedQuotes.slice(0, Math.min(3, sortedQuotes.length))
    return topQuotes[Math.floor(Math.random() * topQuotes.length)]
  }, [cooldownQuotes, interval])

  // Start new quote animation
  const startQuote = useCallback(() => {
    if (!containerRef.current || reducedMotion) return

    const template = selectNextQuote()
    if (!template) return

    const position = getCornerPosition(template.corner, containerRef.current)
    
    const newQuote: ActiveQuote = {
      id: `quote-${Date.now()}`,
      ...template,
      ...position,
      opacity: 0,
      scale: 1,
      currentChar: 0,
      isActive: true,
      animationDelay: 0,
      phase: 'pre',
      phaseStartTime: Date.now(),
      lastCharTime: Date.now(),
    }

    setActiveQuote(newQuote)
  }, [selectNextQuote, getCornerPosition, reducedMotion])

  // Animation loop for quote phases
  const animateQuote = useCallback((currentTime: number) => {
    if (!activeQuote || reducedMotion) {
      animationRef.current = requestAnimationFrame(animateQuote)
      return
    }

    const timeSincePhaseStart = currentTime - activeQuote.phaseStartTime
    const timeSinceLastChar = currentTime - activeQuote.lastCharTime

    const updatedQuote = { ...activeQuote }

    switch (activeQuote.phase) {
      case 'pre':
        // Pre-delay phase
        if (timeSincePhaseStart >= activeQuote.preDelay) {
          updatedQuote.phase = 'typing'
          updatedQuote.phaseStartTime = currentTime
          updatedQuote.opacity = 1
        }
        break

      case 'typing':
        // Character-by-character typing
        if (timeSinceLastChar >= typingSpeed && updatedQuote.currentChar < activeQuote.text.length) {
          updatedQuote.currentChar++
          updatedQuote.lastCharTime = currentTime
          
          // Add glitch effects for certain styles
          if (activeQuote.style === 'glitch' && Math.random() < 0.1) {
            updatedQuote.opacity = 0.3 + Math.random() * 0.7
          }
        }
        
        // Move to hold phase when typing complete
        if (updatedQuote.currentChar >= activeQuote.text.length) {
          updatedQuote.phase = 'hold'
          updatedQuote.phaseStartTime = currentTime
          updatedQuote.opacity = 1
        }
        break

      case 'hold':
        // Hold at full visibility
        if (timeSincePhaseStart >= activeQuote.hold) {
          updatedQuote.phase = 'fadeout'
          updatedQuote.phaseStartTime = currentTime
        }
        break

      case 'fadeout':
        // Fade out animation
        const fadeProgress = timeSincePhaseStart / activeQuote.out
        updatedQuote.opacity = Math.max(0, 1 - fadeProgress)
        
        if (fadeProgress >= 1) {
          updatedQuote.phase = 'cooldown'
          updatedQuote.phaseStartTime = currentTime
          updatedQuote.isActive = false
          
          // Add to cooldown list
          setCooldownQuotes(prev => new Set([...prev, activeQuote.text]))
          
          // Schedule cooldown removal
          setTimeout(() => {
            setCooldownQuotes(prev => {
              const newSet = new Set(prev)
              newSet.delete(activeQuote.text)
              return newSet
            })
          }, activeQuote.cooldown)
          
          // Clear active quote
          setActiveQuote(null)
          
          // Schedule next quote
          if (interval > 0) {
            nextQuoteTimeout.current = setTimeout(startQuote, interval)
          }
        }
        break
    }

    if (updatedQuote !== activeQuote) {
      setActiveQuote(updatedQuote)
    }

    animationRef.current = requestAnimationFrame(animateQuote)
  }, [activeQuote, typingSpeed, reducedMotion, interval, startQuote])

  // Start animation loop
  useEffect(() => {
    if (!reducedMotion && interval > 0) {
      animationRef.current = requestAnimationFrame(animateQuote)
      
      // Start first quote after initial delay
      nextQuoteTimeout.current = setTimeout(startQuote, 3000)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (nextQuoteTimeout.current) {
        clearTimeout(nextQuoteTimeout.current)
      }
    }
  }, [animateQuote, startQuote, reducedMotion, interval])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (nextQuoteTimeout.current) {
        clearTimeout(nextQuoteTimeout.current)
      }
    }
  }, [])

  if (reducedMotion || interval === 0 || !activeQuote) {
    return null
  }

  const getStyleClass = () => {
    switch (activeQuote.style) {
      case 'matrix':
        return 'font-mono text-green-400'
      case 'glitch':
        return 'font-mono text-red-400'
      case 'typing':
      default:
        return 'font-sans text-white'
    }
  }

  const getTextShadow = () => {
    switch (activeQuote.style) {
      case 'matrix':
        return '0 0 10px rgba(0, 255, 127, 0.5)'
      case 'glitch':
        return '0 0 10px rgba(255, 90, 36, 0.5), 2px 2px 0px rgba(255, 0, 0, 0.3)'
      case 'typing':
      default:
        return '0 0 5px rgba(255, 255, 255, 0.3)'
    }
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        ...style,
        transform: 'none', // Critical: no transforms
        willChange: 'auto'
      }}
    >
      {activeQuote && (
        <div
          className={`absolute max-w-xs select-none pointer-events-none ${getStyleClass()}`}
          style={{
            left: `${activeQuote.x}px`,
            top: `${activeQuote.y}px`,
            opacity: activeQuote.opacity,
            transform: `scale(${activeQuote.scale})`,
            fontSize: '14px',
            lineHeight: '1.4',
            textShadow: getTextShadow(),
            willChange: 'opacity',
          }}
        >
          {activeQuote.text.substring(0, activeQuote.currentChar)}
          {activeQuote.phase === 'typing' && (
            <span className="animate-pulse">|</span>
          )}
        </div>
      )}
    </div>
  )
}
