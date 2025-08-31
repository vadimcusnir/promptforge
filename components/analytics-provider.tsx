"use client";

import { createContext, useContext, ReactNode } from "react";

interface AnalyticsContextType {
  track: (event: string, properties?: Record<string, any>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType>({
  track: () => {},
});

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const track = (event: string, properties?: Record<string, any>) => {
    // Stub implementation
    console.log("Analytics event:", event, properties);
  };

  return (
    <AnalyticsContext.Provider value={{ track }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  return useContext(AnalyticsContext);
}
