import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Open_Sans } from "next/font/google"
import "./globals.css"
import { ComingSoonWrapper } from "@/components/coming-soon-wrapper"
import { Toaster } from "@/components/ui/toaster"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
})

export const metadata: Metadata = {
  title: "Forge - Industrial Prompt Engineering",
  description:
    "Your operational prompt generator. 50 modules, 7 vectors, export in <60s. Build auditable, reproducible prompt systems.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable} dark`}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <ComingSoonWrapper>{children}</ComingSoonWrapper>
        <Toaster />
      </body>
    </html>
  )
}
