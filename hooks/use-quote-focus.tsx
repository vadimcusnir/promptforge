"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface QuoteFocusContextType {
  isQuoteFocusActive: boolean;
  activateQuoteFocus: () => void;
  deactivateQuoteFocus: () => void;
  toggleQuoteFocus: () => void;
}

const QuoteFocusContext = createContext<QuoteFocusContextType | undefined>(
  undefined,
);

interface QuoteFocusProviderProps {
  children: ReactNode;
}

export function QuoteFocusProvider({ children }: QuoteFocusProviderProps) {
  const [isQuoteFocusActive, setIsQuoteFocusActive] = useState(false);

  const applyQuoteFocusStyles = useCallback((isActive: boolean) => {
    const overlayElement = document.getElementById("bg-overlay");
    const matrixTokens = document.querySelector(".matrix-tokens");

    if (overlayElement) {
      if (isActive) {
        overlayElement.classList.add("quote-active");
      } else {
        overlayElement.classList.remove("quote-active");
      }
    }

    if (matrixTokens) {
      if (isActive) {
        matrixTokens.classList.add("quote-focus");
      } else {
        matrixTokens.classList.remove("quote-focus");
      }
    }

    console.log(
      `[QuoteFocus] ${isActive ? "Activated" : "Deactivated"} quote focus mode`,
    );
  }, []);

  const activateQuoteFocus = useCallback(() => {
    setIsQuoteFocusActive(true);
    applyQuoteFocusStyles(true);
  }, [applyQuoteFocusStyles]);

  const deactivateQuoteFocus = useCallback(() => {
    setIsQuoteFocusActive(false);
    applyQuoteFocusStyles(false);
  }, [applyQuoteFocusStyles]);

  const toggleQuoteFocus = useCallback(() => {
    const newState = !isQuoteFocusActive;
    setIsQuoteFocusActive(newState);
    applyQuoteFocusStyles(newState);
  }, [isQuoteFocusActive, applyQuoteFocusStyles]);

  const value: QuoteFocusContextType = {
    isQuoteFocusActive,
    activateQuoteFocus,
    deactivateQuoteFocus,
    toggleQuoteFocus,
  };

  return (
    <QuoteFocusContext.Provider value={value}>
      {children}
    </QuoteFocusContext.Provider>
  );
}

export function useQuoteFocus(): QuoteFocusContextType {
  const context = useContext(QuoteFocusContext);
  if (context === undefined) {
    throw new Error("useQuoteFocus must be used within a QuoteFocusProvider");
  }
  return context;
}

// Hook for components that display quotes to automatically manage focus
export function useQuoteDisplay(isVisible: boolean) {
  const { activateQuoteFocus, deactivateQuoteFocus } = useQuoteFocus();

  React.useEffect(() => {
    if (isVisible) {
      activateQuoteFocus();
    } else {
      deactivateQuoteFocus();
    }

    // Cleanup on unmount
    return () => {
      deactivateQuoteFocus();
    };
  }, [isVisible, activateQuoteFocus, deactivateQuoteFocus]);
}
