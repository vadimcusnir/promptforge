import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Open_Sans } from "next/font/google"
import "./globals.css"
import { ComingSoonWrapper } from "@/components/coming-soon-wrapper"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { SkipLink } from "@/components/ui/skip-link"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { CookieBanner } from "@/components/cookie-banner"

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
  title: {
    default: "PromptForge - Industrial Prompt Engineering Platform",
    template: "%s | PromptForge"
  },
  description: "Your operational prompt generator. 50 modules, 7 vectors, export in <60s. Build auditable, reproducible prompt systems for professional workflows.",
  keywords: ["prompt engineering", "AI prompts", "industrial automation", "prompt generation", "AI workflow", "enterprise AI"],
  authors: [{ name: "PromptForge Team" }],
  creator: "PromptForge",
  publisher: "PromptForge",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://promptforge.ai'),
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || 'https://promptforge.ai',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://promptforge.ai',
    title: 'PromptForge - Industrial Prompt Engineering Platform',
    description: 'Your operational prompt generator. 50 modules, 7 vectors, export in <60s. Build auditable, reproducible prompt systems.',
    siteName: 'PromptForge',
    images: [
      {
        url: '/og/default.webp',
        width: 1200,
        height: 630,
        alt: 'PromptForge - Industrial Prompt Engineering Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PromptForge - Industrial Prompt Engineering Platform',
    description: 'Your operational prompt generator. 50 modules, 7 vectors, export in <60s.',
    images: ['/og/default.webp'],
    creator: '@promptforge',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
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
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0e0e0e" />
        <meta name="msapplication-TileColor" content="#d1a954" />
        
        {/* Google Analytics 4 */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}', {
                page_title: document.title,
                page_location: window.location.href,
                send_page_view: true
              });
            `,
          }}
        />
        
        {/* Sentry */}
        <script
          src="https://browser.sentry-cdn.com/7.100.1/bundle.min.js"
          integrity="sha384-7Qz0XHNbJZVu3HoYl+d8gKgBAO64h9/7Rq9DX5XqX3AdZ7TzPZgXw8M8l3X5yqb"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        {/* Single background layer to prevent CLS */}
        <div className="fixed-bg pattern-bg" />
        
        <SkipLink href="#main-content">Skip to main content</SkipLink>
        <ErrorBoundary>
          <AnalyticsProvider>
            <Header />
            <ComingSoonWrapper>
              {children}
            </ComingSoonWrapper>
            <Footer />
          </AnalyticsProvider>
        </ErrorBoundary>
        <Toaster />
        <CookieBanner />
      </body>
    </html>
  )
}
