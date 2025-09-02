import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Open_Sans } from "next/font/google"
import "./globals.css"
import { ComingSoonWrapper } from "@/components/coming-soon-wrapper"
import { Toaster } from "@/components/ui/toaster"
import { CookieBanner } from "@/components/gdpr/cookie-banner"
import { MobileOptimizations } from "@/components/mobile/mobile-optimizations"
import { SkipToContent } from "@/components/accessibility/skip-to-content"
import { AnalyticsProvider } from "@/components/analytics/analytics-provider"
import { WebVitalsReporter } from "@/components/analytics/web-vitals-reporter"
import { Suspense } from "react"

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
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  themeColor: "#0e0e0e",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable} dark`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                wait_for_update: 500,
              });
              gtag('js', new Date());
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <SkipToContent />
        <MobileOptimizations />
        <AnalyticsProvider>
          <Suspense fallback={null}>
            <ComingSoonWrapper>
              <main id="main-content" className="flex-1">
                {children}
              </main>
            </ComingSoonWrapper>
          </Suspense>
        </AnalyticsProvider>
        <Toaster />
        <CookieBanner />
        <WebVitalsReporter />
      </body>
    </html>
  )
}
