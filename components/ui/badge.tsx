"use client";

import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "outline" | "destructive";
}

export function Badge({ children, className = "", variant = "default" }: BadgeProps) {
  const variantClasses = {
    default: "bg-gold-industrial text-pf-black",
    outline: "border border-pf-text-muted/30 text-pf-text-muted",
    destructive: "bg-red-500 text-white"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
