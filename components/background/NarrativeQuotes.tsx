"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { NARRATIVE_QUOTES } from "@/lib/data/narrative-quotes"

interface NarrativeQuotesProps {
  reduceMotion?: boolean
}

interface Quote {
  id: string
  text: string
  x: number
  y: number
  phase: 'typing' | 'holding' | 'fading'
  displayText: string
  startTime: number
  duration: number
}

export function NarrativeQuotes({ reduceMotion = false }: NarrativeQuotesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const quotesRef = useRef<Quote[]>([])
  const animationRef = useRef<number>()
  const lastQuoteTime = useRef<number>(0)
  const [, forceUpdate] = useState({})

  const createQuote = useCallback((): Quote => {
    const quote = NARRATIVE_QUOTES[Math.floor(Math.random() * NARRATIVE_QUOTES.length)]
    
    return {
      id: `quote-${Date.now()}-${Math.random()}`,
      text: quote,
      x: 10 + Math.random() * 80, // Keep away from edges
      y: 20 + Math.random() * 60,
      phase: 'typing',
      displayText: '',
      startTime: performance.now(),
      duration: 0
    }
  }, [])

  const updateQuotes = useCallback(() => {
    if (reduceMotion) return

    const now = performance.now()
    let needsUpdate = false

    // Add new quote every 15-20 seconds
    if (now - lastQuoteTime.current > (15000 + Math.random() * 5000)) {
      if (quotesRef.current.length < 2) { // Max 2 quotes at once
        quotesRef.current.push(createQuote())
        lastQuoteTime.current = now
        needsUpdate = true
      }
    }

    // Update existing quotes
    quotesRef.current = quotesRef.current.map(quote => {
      const elapsed = now - quote.startTime
      const newQuote = { ...quote }

      switch (quote.phase) {
        case 'typing':
          // Typing phase: 40-60ms per character
          const typingSpeed = 50 + Math.random() * 10 // 50±10ms per char
          const charsToShow = Math.floor(elapsed / typingSpeed)
          newQuote.displayText = quote.text.substring(0, charsToShow)
          
          if (charsToShow >= quote.text.length) {
            newQuote.phase = 'holding'
            newQuote.startTime = now
            newQuote.duration = 4000 + Math.random() * 2000 // 4-6s hold
            needsUpdate = true
          }
          break

        case 'holding':
          // Hold phase: keep text visible
          if (elapsed > newQuote.duration) {
            newQuote.phase = 'fading'
            newQuote.startTime = now
            newQuote.duration = 800 + Math.random() * 400 // 0.8-1.2s fade
            needsUpdate = true
          }
          break

        case 'fading':
          // Fading phase: gradually reduce opacity
          if (elapsed > newQuote.duration) {
            return null // Remove quote
          }
          break
      }

      return newQuote
    }).filter(Boolean) as Quote[]

    if (needsUpdate) {
      forceUpdate({})
    }
  }, [reduceMotion, createQuote])

  const animate = useCallback(() => {
    updateQuotes()
    animationRef.current = requestAnimationFrame(animate)
  }, [updateQuotes])

  useEffect(() => {
    if (!reduceMotion) {
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate, reduceMotion])

  const getQuoteOpacity = (quote: Quote): number => {
    if (quote.phase === 'fading') {
      const elapsed = performance.now() - quote.startTime
      const progress = elapsed / quote.duration
      return Math.max(0, 1 - progress)
    }
    return quote.phase === 'typing' ? 0.8 : 0.6
  }

  if (reduceMotion) {
    return null // Hide quotes when motion is reduced
  }

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0"
      style={{ zIndex: 0 }}
    >
      {quotesRef.current.map(quote => (
        <div
          key={quote.id}
          className="absolute max-w-xs text-sm font-mono text-[#d1a954] select-none pointer-events-none leading-relaxed"
          style={{
            left: `${quote.x}%`,
            top: `${quote.y}%`,
            opacity: getQuoteOpacity(quote),
            transform: 'translateX(-50%)',
            textShadow: '0 0 10px rgba(209, 169, 84, 0.3)',
            transition: quote.phase === 'fading' ? 'opacity 0.8s ease-out' : 'none'
          }}
        >
          {quote.displayText}
          {quote.phase === 'typing' && (
            <span className="animate-pulse">|</span>
          )}
        </div>
      ))}
    </div>
  )
}
