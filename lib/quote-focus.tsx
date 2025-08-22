"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface QuoteFocusContextType {
  active: boolean;
  set: (value: boolean) => void;
}

// Context with safe defaults
const QuoteFocusContext = createContext<QuoteFocusContextType>({
  active: false,
  set: () => {
    if (process.env.NODE_ENV === "development") {
      console.warn("[QuoteFocus] Context not properly initialized. Wrap with QuoteFocusProvider.");
    }
  },
});

interface QuoteFocusProviderProps {
  children: ReactNode;
}

/**
 * QuoteFocusProvider - Global state management for quote focus interactions
 * Enforces UI Overlay Policy state_class_map from ruleset.yml
 * 
 * State classes applied:
 * - quote-active: When any quote is active
 * - quote-focus: When quote is in focus state
 * 
 * Controls matrix tokens opacity via --tokens-opacity CSS variable
 */
export function QuoteFocusProvider({ children }: QuoteFocusProviderProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const overlayElement = document.querySelector<HTMLElement>("#bg-overlay");
    const matrixTokens = document.querySelectorAll<HTMLElement>(".matrix-tokens");
    
    if (!overlayElement) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[QuoteFocusProvider] #bg-overlay element not found");
      }
      return;
    }

    // Apply/remove state classes based on active state
    overlayElement.classList.toggle("quote-active", active);
    overlayElement.classList.toggle("quote-focus", active);
    
    // Control matrix tokens opacity (acceptance criteria: quote_focus_controls_tokens_opacity)
    matrixTokens.forEach(token => {
      if (active) {
        token.style.setProperty("--tokens-opacity", "0.28");
      } else {
        token.style.removeProperty("--tokens-opacity");
      }
    });

    // Cleanup function - enforce state cleanup on unmount
    return () => {
      if (overlayElement) {
        overlayElement.classList.remove("quote-active", "quote-focus");
      }
      matrixTokens.forEach(token => {
        token.style.removeProperty("--tokens-opacity");
      });
    };
  }, [active]);

  // Wrapper for setActive with validation
  const setActiveWrapper = (value: boolean) => {
    if (typeof value !== "boolean") {
      if (process.env.NODE_ENV === "development") {
        console.warn("[QuoteFocusProvider] setActive expects boolean value");
      }
      return;
    }
    setActive(value);
  };

  return (
    <QuoteFocusContext.Provider value={{ active, set: setActiveWrapper }}>
      {children}
    </QuoteFocusContext.Provider>
  );
}

/**
 * useQuoteFocus - Hook for accessing quote focus state
 * 
 * Returns:
 * - active: boolean - Current focus state
 * - set: (boolean) => void - Function to update focus state
 * 
 * Usage:
 * const { active, set } = useQuoteFocus();
 * set(true); // Activate quote focus
 */
export function useQuoteFocus(): QuoteFocusContextType {
  const context = useContext(QuoteFocusContext);
  
  if (!context) {
    throw new Error("useQuoteFocus must be used within a QuoteFocusProvider");
  }
  
  return context;
}
