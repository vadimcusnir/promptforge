"use client";

import { ReactNode } from "react";
import { useQuoteFocus } from "@/lib/quote-focus";

interface QuoteBlockProps {
  children: ReactNode;
  className?: string;
}

/**
 * QuoteBlock - DX-optimized component for quote focus interactions
 * Integrates with QuoteFocusProvider for centralized overlay control
 * 
 * Features:
 * - Automatic focus state management on hover
 * - Data attributes for styling hooks
 * - Semantic blockquote structure
 * - CSS class integration for custom styling
 */
export function QuoteBlock({ children, className = "" }: QuoteBlockProps) {
  const { active, set } = useQuoteFocus();

  const handleMouseEnter = () => {
    set(true);
  };

  const handleMouseLeave = () => {
    set(false);
  };

  // Combine base class with custom className
  const combinedClassName = `pf-quote ${className}`.trim();

  return (
    <blockquote
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-focus={active ? "on" : "off"}
      className={combinedClassName}
    >
      {children}
    </blockquote>
  );
}

/**
 * Alternative lightweight hook for custom quote implementations
 * 
 * Usage:
 * const quoteProps = useQuoteProps();
 * <div {...quoteProps}>Custom quote content</div>
 */
export function useQuoteProps() {
  const { active, set } = useQuoteFocus();

  return {
    onMouseEnter: () => set(true),
    onMouseLeave: () => set(false),
    "data-focus": active ? "on" : "off",
  };
}
