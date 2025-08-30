import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StratifiedBackground } from "@/components/background/StratifiedBackground";
import { SkipLink } from "@/components/SkipLink";
import type React from "react";
import type { Metadata } from "next";
import ClientRootLayout from "./ClientRootLayout";
import { getMotionMode } from "@/lib/motion";
import { Cinzel } from "next/font/google";
import { Space_Grotesk } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./styles/variables.css";
import "./styles/animations.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const cinzel = Cinzel({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
});

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
      { url: "/f_v3_brand_images/forge_v3_logo_transparent.png", sizes: "32x32", type: "image/png" },
      { url: "/f_v3_brand_images/forge_v3_logo_transparent.png", sizes: "48x48", type: "image/png" },
    ],
    shortcut: "/f_v3_brand_images/forge_v3_logo_transparent.png",
    apple: "/f_v3_brand_images/forge_v3_logo_transparent.png",
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
        url: "/f_v3_brand_images/forge_logo_final_white_text.png",
        width: 1200,
        height: 630,
        alt: "Prompt-Forge™ - Cognitive OS for Prompts",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptForge v3 — Cognitive OS for Prompts",
    description:
      "50 modules + 7D Engine. Score ≥80. Start free, upgrade for PDF/JSON/ZIP.",
    images: ["/f_v3_brand_images/forge_logo_final_white_text.png"],
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
    <html 
      lang="en" 
      className={`${spaceGrotesk.variable} ${cinzel.variable} ${jetbrainsMono.variable}`}
      data-motion={mode}
    >
      <head>
        <meta httpEquiv="Content-Language" content="en" />
      </head>
      <body className="font-sans antialiased">
        <div className="pf-pitch" aria-hidden="true" />
        <StratifiedBackground />
        <Header />
        <SkipLink />
        <ClientRootLayout>{children}</ClientRootLayout>
        <Footer />
      </body>
    </html>
  );
}
