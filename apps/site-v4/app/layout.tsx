import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AuthProvider } from "@/lib/auth"
import "./globals.css"

export const metadata: Metadata = {
  title: "PromptForge — The Operational Prompt Engine | chatgpt-prompting.com",
  description: "Build prompt systems, not one-offs. 50 modules, 7-D engine, and exports in under 60s.",
  generator: "PromptForge v4.0",
  keywords: "AI prompts, prompt engineering, ChatGPT prompts, AI automation, prompt templates, operational AI",
  authors: [{ name: "PromptForge Team" }],
  creator: "PromptForge",
  publisher: "PromptForge",
  robots: "index, follow",
  openGraph: {
    title: "PromptForge — The Operational Prompt Engine",
    description: "Build prompt systems, not one-offs. 50 modules, 7-D engine, and exports in under 60s.",
    url: "https://chatgpt-prompting.com",
    siteName: "PromptForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptForge — The Operational Prompt Engine",
    description: "Build prompt systems, not one-offs. 50 modules, 7-D engine, and exports in under 60s.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Header />
          </Suspense>

          <main className="min-h-screen">{children}</main>

          <Suspense fallback={<div>Loading...</div>}>
            <Footer />
          </Suspense>

          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
