"use client";

import type React from "react";
import { Montserrat } from "next/font/google";
import { Open_Sans } from "next/font/google";
import { ComingSoonWrapper } from "@/components/ComingSoonWrapper";
import { MotionProvider } from "@/lib/motion/provider";
import { useEffect } from "react";
import "./globals.css";
import "./styles/variables.css";
import "./styles/animations.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600", "700"],
});

interface ClientRootLayoutProps {
  children: React.ReactNode;
  motionMode?: "full" | "reduced" | "disabled";
}

export default function ClientRootLayout({
  children,
  motionMode = "full",
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

  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${openSans.variable}`}
      data-motion-mode={motionMode}
    >
      <body className="font-sans antialiased">
        <MotionProvider>
          <ComingSoonWrapper>{children}</ComingSoonWrapper>
        </MotionProvider>
      </body>
    </html>
  );
}