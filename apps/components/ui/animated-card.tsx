"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Card, type CardProps } from "./card"

interface AnimatedCardProps extends CardProps {
  hoverEffect?: "lift" | "glow" | "shimmer"
  delay?: number
}

export const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, hoverEffect = "lift", delay = 0, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "transition-all duration-300 ease-in-out animate-slide-up",
          hoverEffect === "lift" && [
            "hover:shadow-xl hover:-translate-y-1",
            "hover:shadow-primary/20 hover:border-primary/30",
          ],
          hoverEffect === "glow" && ["hover:shadow-lg hover:shadow-primary/40", "hover:border-primary/50"],
          hoverEffect === "shimmer" && ["relative overflow-hidden", "hover:shadow-lg hover:border-primary/30"],
          className,
        )}
        style={{ animationDelay: `${delay}ms` }}
        {...props}
      >
        {hoverEffect === "shimmer" && (
          <div className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
        )}
        <div className="relative z-10">{children}</div>
      </Card>
    )
  },
)

AnimatedCard.displayName = "AnimatedCard"
