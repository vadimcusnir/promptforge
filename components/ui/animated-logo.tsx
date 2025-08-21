"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface AnimatedLogoProps {
  variant?: "gold" | "black" | "white"
  size?: "sm" | "md" | "lg"
  animated?: boolean
  className?: string
}

export function AnimatedLogo({ variant = "white", size = "md", animated = false, className = "" }: AnimatedLogoProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  const staticLogos = {
    gold: "/assets/logo-gold-outline.png",
    black: "/assets/logo-black-1080.png",
    white: "/assets/logo-white-1080.png",
  }

  const animatedLogos = {
    gold: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_auriu_animat-7zCgND7OU3n9S7yNj0RgxjMPSxEoZ0.webm",
    black: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_animat_negru-johB9Z8bQprMKRVQfPvRogOv3SZVSS.mp4",
    white: "/assets/logo-white-1080.png", // fallback to static for white
  }

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return <div className={`${sizeClasses[size]} bg-gray-800 animate-pulse rounded ${className}`} />
  }

  if (animated && (variant === "gold" || variant === "black")) {
    return (
      <video className={`${sizeClasses[size]} object-contain ${className}`} autoPlay loop muted playsInline>
        <source src={animatedLogos[variant]} type={variant === "gold" ? "video/webm" : "video/mp4"} />
        <Image
          src={staticLogos[variant] || "/placeholder.svg"}
          alt="PROMPTFORGE™"
          width={64}
          height={64}
          className="object-contain"
        />
      </video>
    )
  }

  return (
    <Image
      src={staticLogos[variant] || "/placeholder.svg"}
      alt="PROMPTFORGE™"
      width={64}
      height={64}
      className={`${sizeClasses[size]} object-contain ${className}`}
      priority
    />
  )
}
