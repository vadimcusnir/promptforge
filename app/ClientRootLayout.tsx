"use client"

import type React from "react"
import { Montserrat } from "next/font/google"
import { Open_Sans } from "next/font/google"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { SkipLink } from "@/components/SkipLink"
import { BackgroundRoot } from "@/components/background/BackgroundRoot"
import { useFontsReady } from "@/hooks/use-fonts-ready"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import "./globals.css"
import "./styles/variables.css"
import "./styles/animations.css"
import "../styles/header-footer.css"
import "../styles/background.css"

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
  return <ReadySetter />
}

function ReadySetter() {
  const fontsReady = useFontsReady()
  const pathname = usePathname()

  // Route detection for overlay opacity control
  const getRouteClass = (path: string) => {
    if (path === "/" || path.startsWith("/pricing")) return "route-marketing"
    if (path.startsWith("/generator")) return "route-generator"
    if (path.startsWith("/dashboard")) return "route-dashboard"
    return "route-marketing" // default
  }

  useEffect(() => {
    const html = document.documentElement
    const body = document.body

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

  // Route-based overlay management
  useEffect(() => {
    const body = document.body
    const routeClass = getRouteClass(pathname)
    
    // Remove all existing route classes
    body.classList.remove("route-marketing", "route-generator", "route-dashboard")
    
    // Add current route class
    body.classList.add(routeClass)
    
    console.log(`[Overlay] Route changed to: ${pathname} -> ${routeClass}`)
  }, [pathname])

  // Quote focus mode management
  useEffect(() => {
    const body = document.body

    // Listen for quote visibility events
    const handleQuoteShow = () => {
      body.classList.add("quote-active")
      console.log("[Overlay] Quote active - reducing token opacity")
    }

    const handleQuoteHide = () => {
      body.classList.remove("quote-active")
      console.log("[Overlay] Quote inactive - restoring token opacity")
    }

    // Listen for custom events from quote components
    document.addEventListener("quote:show", handleQuoteShow)
    document.addEventListener("quote:hide", handleQuoteHide)

    // Cleanup
    return () => {
      document.removeEventListener("quote:show", handleQuoteShow)
      document.removeEventListener("quote:hide", handleQuoteHide)
    }
  }, [])

  return null
}

export default function ClientRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith('/dashboard')
  
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
      <body className={`${montserrat.variable} ${openSans.variable} antialiased app-shell ${isDashboard ? 'dashboard-layout' : ''}`}>
        <SkipLink />
        <BackgroundRoot isDashboard={isDashboard} />
        
        <div className="app-content min-h-screen flex flex-col">
          <ClientReady />
          <Header />
          
          <main id="main" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          
          <Footer />
        </div>
      </body>
    </html>
  )
}
