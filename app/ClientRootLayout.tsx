"use client"

import type React from "react"
import { Montserrat } from "next/font/google"
import { Open_Sans } from "next/font/google"
import { Footer } from "@/components/ui/footer"
import { Header } from "@/components/Header"
import { useFontsReady } from "@/hooks/use-fonts-ready"
import { useRouteOverlay } from "@/hooks/use-route-overlay"
import { QuoteFocusProvider } from "@/lib/quote-focus"
import { OverlayController } from "@/components/OverlayController"
import { useEffect } from "react"
import BackgroundRoot from "@/components/background/BackgroundRoot"
import "./globals.css"
import "./styles/variables.css"
import "./styles/animations.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600"],
})

function ClientReady() {
  return (
    <>
      <ReadySetter />
      <RouteOverlayManager />
    </>
  )
}

function RouteOverlayManager() {
  const { currentRoute } = useRouteOverlay()
  
  useEffect(() => {
    console.log(`[ClientRootLayout] Route overlay manager active for: ${currentRoute}`)
  }, [currentRoute])

  return null
}

function ReadySetter() {
  const fontsReady = useFontsReady()

  useEffect(() => {
    const html = document.documentElement

    const markReady = () => {
      if (!html.classList.contains("matrix-animations-ready")) {
        html.classList.add("matrix-animations-ready")
        document.dispatchEvent(new CustomEvent("matrix:ready"))
        console.log("[v0] matrix-animations-ready class added via markReady")
      }
    }

    const readyNow = () => requestAnimationFrame(markReady)

    if (fontsReady) {
      console.log("[v0] Fonts ready, initiating matrix ready sequence")

      // Immediate attempt
      if (document.readyState === "complete" || document.readyState === "interactive") {
        readyNow()
      } else {
        window.addEventListener("DOMContentLoaded", readyNow, { once: true })
      }

      // Self-healing timeouts to handle race conditions
      setTimeout(markReady, 0)
      setTimeout(markReady, 100)
      setTimeout(markReady, 300)
    }
  }, [fontsReady])

  return null
}

export default function ClientRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark tracking-wide leading-[1.95rem] mx-0">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="shortcut icon" href="/favicon-32x32.png" />
        <style>{`
html {
  font-family: ${openSans.style.fontFamily};
  --font-sans: ${openSans.variable};
  --font-heading: ${montserrat.variable};
}
        `}</style>
      </head>
      <body className={`${montserrat.variable} ${openSans.variable} antialiased app-shell`}>
        <BackgroundRoot ambient />
        <div id="app" data-layer="ui">
          <QuoteFocusProvider>
            <OverlayController />
            <ClientReady />
            <Header />
            {children}
            <Footer />
          </QuoteFocusProvider>
        </div>
      </body>
    </html>
  )
}
