"use client"

import { useState, useEffect } from "react"

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-[#5a5a5a]">Ends in:</span>
      <div className="flex items-center gap-1">
        <div className="bg-[#d1a954] text-black px-2 py-1 rounded text-xs font-mono">
          {String(timeLeft.hours).padStart(2, "0")}
        </div>
        <span className="text-[#d1a954]">:</span>
        <div className="bg-[#d1a954] text-black px-2 py-1 rounded text-xs font-mono">
          {String(timeLeft.minutes).padStart(2, "0")}
        </div>
        <span className="text-[#d1a954]">:</span>
        <div className="bg-[#d1a954] text-black px-2 py-1 rounded text-xs font-mono">
          {String(timeLeft.seconds).padStart(2, "0")}
        </div>
      </div>
    </div>
  )
}
