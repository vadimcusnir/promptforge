"use client";
import React from "react";

export type MotionProviderProps = { children: React.ReactNode };

export function MotionProvider({ children }: MotionProviderProps) { 
  return <>{children}</>; 
}

export function useMotion() {
  return {
    reduced: false,
    enabled: true,
    flags: {}
  };
}

export default MotionProvider;