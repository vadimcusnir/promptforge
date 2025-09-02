"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "./button"

interface AnimatedButtonProps extends ButtonProps {
  variant?: "forge" | "ghost" | "outline"
  glowEffect?: boolean
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant = "forge", glowEffect = false, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "relative overflow-hidden transition-all duration-200 ease-in-out",
          "hover:scale-105 active:scale-98",
          variant === "forge" && [
            "bg-primary text-primary-foreground",
            "hover:shadow-lg hover:shadow-primary/30",
            glowEffect && "animate-forge-glow",
          ],
          variant === "ghost" && [
            "hover:bg-accent/10 hover:text-accent",
            "border border-transparent hover:border-accent/30",
          ],
          variant === "outline" && [
            "border-2 border-accent/30 hover:border-accent",
            "hover:bg-accent/10 hover:shadow-md",
          ],
          className,
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-500" />
      </Button>
    )
  },
)

AnimatedButton.displayName = "AnimatedButton"
