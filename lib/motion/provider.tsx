"use client";
import React from "react";
export type MotionProviderProps = { children: React.ReactNode };
export function MotionProvider({ children }: MotionProviderProps) { return <>{children}</>; }
export default MotionProvider;