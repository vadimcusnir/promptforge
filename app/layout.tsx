import { Header } from "@/components/Header"
import type React from "react"
import type { Metadata } from "next"
import ClientRootLayout from "./ClientRootLayout"
import "./globals.css"

export const metadata: Metadata = {
  title: "Prompt-Forge™ - Cyber-Poetic Terminal Aesthetic",
  description:
    "Advanced AI prompt generation system with immersive visual experience. Professional prompts in 10 seconds.",
  generator: "Prompt-Forge™",
  keywords:
    "AI prompts, prompt engineering, ChatGPT prompts, AI tools, prompt generator, cyber aesthetic, terminal interface",
  robots: "index, follow",
  authors: [{ name: "Prompt-Forge™" }],
  creator: "Prompt-Forge™",
  publisher: "Prompt-Forge™",
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
    title: "Prompt-Forge™ - Cyber-Poetic Terminal Aesthetic",
    description: "Advanced AI prompt generation system with immersive visual experience.",
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
    locale: "ro_RO",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prompt-Forge™ - Cyber-Poetic Terminal Aesthetic",
    description: "Advanced AI prompt generation system with immersive visual experience.",
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientRootLayout>{children}</ClientRootLayout>
}
