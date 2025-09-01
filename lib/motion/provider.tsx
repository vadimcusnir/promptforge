"use client";
import React, { createContext, useContext, useState } from "react";

interface MotionContextType {
  reduced: boolean;
  enabled: boolean;
  flags: {
    motion_micro: boolean;
    motion_primary: boolean;
  };
}

const MotionContext = createContext<MotionContextType>({
  reduced: false,
  enabled: true,
  flags: {
    motion_micro: true,
    motion_primary: true,
  },
});

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [motionState] = useState<MotionContextType>({
    reduced: false,
    enabled: true,
    flags: {
      motion_micro: true,
      motion_primary: true,
    },
  });

  return (
    <MotionContext.Provider value={motionState}>
      {children}
    </MotionContext.Provider>
  );
}

export function useMotion(): MotionContextType {
  const context = useContext(MotionContext);
  if (!context) {
    throw new Error("useMotion must be used within a MotionProvider");
  }
  return context;
}

export default MotionProvider;