"use client";

import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Basic Card component for grouping content with a border and padding.
 */
export function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div 
      className={`rounded-lg p-6 bg-pf-surface ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className = "" }: CardTitleProps) {
  return (
    <h3 className={`text-xl font-bold text-pf-text ${className}`}>{children}</h3>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className = "" }: CardDescriptionProps) {
  return (
    <p className={`text-pf-text-muted ${className}`}>{children}</p>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={`${className}`}>{children}</div>;
}
