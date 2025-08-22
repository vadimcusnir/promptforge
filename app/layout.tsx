import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StratifiedBackground } from "@/components/background/StratifiedBackground";
import type React from "react";
import type { Metadata } from "next";
import ClientRootLayout from "./ClientRootLayout";
import { getMotionMode } from "@/lib/motion";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://chatgpt-prompting.com"),
  title: "PromptForge v3 — Cognitive OS for Prompts",
  description:
    "50 modules + 7D Engine. Score ≥80. Start free, upgrade for PDF/JSON/ZIP.",
  generator: "Prompt-Forge™",
  keywords:
    "AI prompts, prompt engineering, ChatGPT prompts, AI tools, prompt generator, cyber aesthetic, terminal interface",
  robots: "index, follow",
  authors: [{ name: "Prompt-Forge™" }],
  creator: "Prompt-Forge™",
  publisher: "Prompt-Forge™",
  alternates: { canonical: "/", languages: { en: "/" } },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    shortcut: "/favicon-32x32.png",
    apple: "/favicon-48x48.png",
  },
  openGraph: {
    title: "PromptForge v3 — Cognitive OS for Prompts",
    description:
      "50 modules + 7D Engine. Score ≥80. Start free, upgrade for PDF/JSON/ZIP.",
    type: "website",
    url: "https://chatgpt-prompting.com",
    siteName: "Prompt-Forge™",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Prompt-Forge™ - Cyber-Poetic Terminal Interface",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptForge v3 — Cognitive OS for Prompts",
    description:
      "50 modules + 7D Engine. Score ≥80. Start free, upgrade for PDF/JSON/ZIP.",
    images: ["/og-image.png"],
    creator: "@ai_idei",
  },
  other: {
    "X-UA-Compatible": "IE=edge",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const mode = await getMotionMode(); // "off" | "on"
  return (
    <html lang="en" data-motion={mode}>
      <head>
        <meta httpEquiv="Content-Language" content="en" />
      </head>
      <body>
        <div className="pf-pitch" aria-hidden="true" />
        <StratifiedBackground />
        <Header />
        <ClientRootLayout>{children}</ClientRootLayout>
        <Footer />
      </body>
    </html>
  );
}
