"use client";

import { ReactNode } from "react";

interface MotionProviderProps {
  children: ReactNode;
}

export default function MotionProvider({ children }: MotionProviderProps) {
  return <>{children}</>;
}
