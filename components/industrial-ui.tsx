import type React from "react"
import { cn } from "@/lib/utils"

interface IndustrialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost"
  size?: "sm" | "md" | "lg"
  loading?: boolean
}

export function IndustrialButton({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  ...props
}: IndustrialButtonProps) {
  const baseClasses =
    "relative font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white shadow-lg hover:shadow-xl focus:ring-blue-500",
    secondary:
      "bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 hover:border-slate-500 focus:ring-slate-500",
    danger:
      "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl focus:ring-red-500",
    ghost: "text-slate-300 hover:text-white hover:bg-slate-800 focus:ring-slate-500",
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg",
  }

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
      <span className={loading ? "opacity-0" : "opacity-100"}>{children}</span>
    </button>
  )
}

interface IndustrialCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined"
  glow?: boolean
}

export function IndustrialCard({
  variant = "default",
  glow = false,
  className,
  children,
  ...props
}: IndustrialCardProps) {
  const baseClasses = "rounded-xl transition-all duration-300"

  const variants = {
    default: "bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm",
    elevated:
      "bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-slate-700/50 backdrop-blur-sm shadow-2xl",
    outlined: "bg-transparent border-2 border-slate-600/50 hover:border-slate-500/50",
  }

  const glowEffect = glow ? "shadow-2xl shadow-cyan-500/10 hover:shadow-cyan-500/20" : ""

  return (
    <div className={cn(baseClasses, variants[variant], glowEffect, className)} {...props}>
      {children}
    </div>
  )
}

interface IndustrialBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info"
  size?: "sm" | "md"
}

export function IndustrialBadge({
  variant = "default",
  size = "sm",
  className,
  children,
  ...props
}: IndustrialBadgeProps) {
  const baseClasses = "inline-flex items-center font-medium rounded-full transition-all duration-200"

  const variants = {
    default: "bg-slate-700/50 text-slate-300 border border-slate-600/50",
    success: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    warning: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    danger: "bg-red-500/20 text-red-300 border border-red-500/30",
    info: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  }

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  }

  return (
    <span className={cn(baseClasses, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  )
}

interface IndustrialProgressProps {
  value: number
  max?: number
  variant?: "default" | "success" | "warning" | "danger"
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  label?: string
}

export function IndustrialProgress({
  value,
  max = 100,
  variant = "default",
  size = "md",
  showLabel = false,
  label,
}: IndustrialProgressProps) {
  const percentage = Math.min((value / max) * 100, 100)

  const variants = {
    default: "from-blue-500 to-cyan-400",
    success: "from-emerald-500 to-green-400",
    warning: "from-amber-500 to-yellow-400",
    danger: "from-red-500 to-pink-400",
  }

  const sizes = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  }

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="text-slate-300">{label}</span>
          <span className="text-white">
            {value} / {max}
          </span>
        </div>
      )}
      <div className={cn("w-full bg-slate-700 rounded-full overflow-hidden", sizes[size])}>
        <div
          className={cn(
            "bg-gradient-to-r transition-all duration-500 ease-out rounded-full",
            variants[variant],
            sizes[size],
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
