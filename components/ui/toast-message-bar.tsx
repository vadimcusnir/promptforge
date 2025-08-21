"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ToastMessage {
  id: string
  type: "case-study" | "announcement" | "update"
  title: string
  description: string
  url?: string
  badge?: string
}

interface ToastMessageBarProps {
  messages: ToastMessage[]
  autoPlay?: boolean
  duration?: number
  className?: string
}

export function ToastMessageBar({ messages, autoPlay = true, duration = 4000, className = "" }: ToastMessageBarProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)

  useEffect(() => {
    if (!isPlaying || messages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length)
    }, duration)

    return () => clearInterval(interval)
  }, [isPlaying, messages.length, duration])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + messages.length) % messages.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % messages.length)
  }

  if (messages.length === 0) return null

  const currentMessage = messages[currentIndex]

  return (
    <div className={`toast-msg-bar-slider ${className}`}>
      <div className="toast-msg-wrap">
        <div className="toast-slider">
          <div className="mask">
            <div
              className="slide-container"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                transition: "transform 500ms ease-in-out",
              }}
            >
              {messages.map((message, index) => (
                <div key={message.id} className="slide">
                  <a href={message.url} target="_blank" rel="noopener noreferrer" className="toast-msg">
                    {message.badge && <Badge className="bg-gold-industrial text-black mr-3">{message.badge}</Badge>}
                    <div className="label center">{message.description}</div>
                    <div className="toast-msg-divider"></div>
                    <div className="label">LEARN MORE →</div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {messages.length > 1 && (
            <>
              <button className="toast-slider-left" onClick={goToPrevious} aria-label="Previous message">
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button className="toast-slider-right" onClick={goToNext} aria-label="Next message">
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="slide-nav">
                {messages.map((_, index) => (
                  <button
                    key={index}
                    className={`slide-dot ${index === currentIndex ? "active" : ""}`}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Go to message ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
