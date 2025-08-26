import type React from "react";
import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "About — PromptForge™",
  description: "Transformăm Limbajul în Cod Ritualic. Echipa din spatele Protocolului Cușnir™.",
  keywords: "PromptForge, echipa, protocol, cușnirian, AI, prompts",
};

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
