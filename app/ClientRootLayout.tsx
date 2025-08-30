"use client";

import type React from "react";
import { ComingSoonWrapper } from "@/components/ComingSoonWrapper";
import { useEffect } from "react";

interface ClientRootLayoutProps {
  children: React.ReactNode;
}

export default function ClientRootLayout({
  children,
}: ClientRootLayoutProps) {
  useEffect(() => {
    // Set --vh custom property for mobile viewport fix
    const setVH = () => {
      document.documentElement.style.setProperty(
        "--vh",
        window.innerHeight * 0.01 + "px",
      );
    };

    setVH();
    window.addEventListener("resize", setVH, { passive: true });

    return () => {
      window.removeEventListener("resize", setVH);
    };
  }, []);

  return <ComingSoonWrapper>{children}</ComingSoonWrapper>;
}