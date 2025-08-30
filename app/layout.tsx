import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Open_Sans } from "next/font/google"
import "./globals.css"
import "./critical.css"
import { ComingSoonWrapper } from "@/components/coming-soon-wrapper"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { SkipLink } from "@/components/ui/skip-link"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { CookieBanner } from "@/components/cookie-banner"
import { PerformanceMonitor } from "@/components/performance-monitor"
import { MobileOptimizer } from "@/components/mobile-optimizer"
import { SentryProvider } from "@/components/sentry-provider"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  preload: true,
  fallback: ['system-ui', 'arial'],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  preload: true,
  fallback: ['system-ui', 'arial'],
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://chatgpt-prompting.com'),
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || 'https://chatgpt-prompting.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://chatgpt-prompting.com',
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
        {/* Critical CSS for LCP optimization */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for LCP optimization */
            .hero-section {
              position: relative;
              padding: 6rem 1rem;
            }
            
            .hero-container {
              max-width: 80rem;
              margin: 0 auto;
              text-align: center;
            }
            
            .hero-badge {
              background-color: rgba(209, 169, 84, 0.2);
              color: #fbbf24;
              border: 1px solid rgba(209, 169, 84, 0.3);
              margin-bottom: 1rem;
              padding: 0.5rem 1rem;
              border-radius: 0.5rem;
              display: inline-block;
              font-size: 0.875rem;
              font-weight: 500;
            }
            
            .hero-title {
              font-size: 3rem;
              line-height: 1;
              font-weight: 700;
              font-family: var(--font-montserrat), serif;
              margin-bottom: 1.5rem;
              background: linear-gradient(to right, #ffffff, #a1a1aa);
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
            }
            
            .hero-title-accent {
              color: #fbbf24;
            }
            
            .hero-description {
              font-size: 1.25rem;
              color: #71717a;
              margin-bottom: 2rem;
              max-width: 48rem;
              margin-left: auto;
              margin-right: auto;
              line-height: 1.6;
            }
            
            .hero-buttons {
              display: flex;
              flex-direction: column;
              gap: 1rem;
              justify-content: center;
              margin-bottom: 3rem;
            }
            
            .hero-primary-button {
              background-color: #d97706;
              color: #000000;
              font-size: 1.125rem;
              padding: 1.5rem 2rem;
              border-radius: 0.5rem;
              font-weight: 700;
              border: none;
              cursor: pointer;
              transition: background-color 0.2s;
              display: inline-flex;
              align-items: center;
              justify-content: center;
            }
            
            .hero-primary-button:hover {
              background-color: #b45309;
            }
            
            .hero-secondary-button {
              background-color: transparent;
              color: #71717a;
              font-size: 1.125rem;
              padding: 1.5rem 2rem;
              border-radius: 0.5rem;
              font-weight: 700;
              border: 1px solid #52525b;
              cursor: pointer;
              transition: all 0.2s;
              display: inline-flex;
              align-items: center;
              justify-content: center;
            }
            
            .hero-secondary-button:hover {
              background-color: rgba(255, 255, 255, 0.05);
              border-color: #71717a;
            }
            
            .hero-proof-bar {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 2rem;
              font-size: 0.875rem;
              color: #71717a;
            }
            
            .hero-proof-item {
              display: flex;
              align-items: center;
              gap: 0.5rem;
            }
            
            .hero-proof-dot {
              width: 0.5rem;
              height: 0.5rem;
              background-color: #22c55e;
              border-radius: 50%;
            }
            
            /* Responsive optimizations */
            @media (min-width: 640px) {
              .hero-buttons {
                flex-direction: row;
              }
              
              .hero-title {
                font-size: 4.5rem;
              }
            }
            
            @media (min-width: 1024px) {
              .hero-section {
                padding: 6rem 2rem;
              }
              
              .hero-title {
                font-size: 6rem;
              }
            }
            
            /* Font loading optimizations */
            .font-montserrat {
              font-family: var(--font-montserrat), 'Montserrat', serif;
              font-display: swap;
            }
            
            .font-sans {
              font-family: var(--font-open-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-display: swap;
            }
            
            /* Prevent layout shift */
            .hero-section * {
              box-sizing: border-box;
            }
            
            /* Optimize for reduced motion */
            @media (prefers-reduced-motion: reduce) {
              .hero-primary-button,
              .hero-secondary-button {
                transition: none;
              }
            }
          `
        }} />
        
        {/* Critical resources preloading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.openai.com" />
        <link rel="dns-prefetch" href="https://*.supabase.co" />
        
        {/* Critical icons - preload for LCP */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0e0e0e" />
        <meta name="msapplication-TileColor" content="#d1a954" />
        
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-EGZR6E2GY4"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-EGZR6E2GY4');
            `,
          }}
        />
        
        {/* Sentry - Configuration files handle initialization */}
        {/* sentry.client.config.ts, sentry.server.config.ts, sentry.edge.config.ts */}
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        {/* Single background layer to prevent CLS */}
        <div className="fixed-bg pattern-bg" />
        
        <SkipLink href="#main-content">Skip to main content</SkipLink>
        <ErrorBoundary>
          <SentryProvider>
            <AnalyticsProvider>
              <Header />
              <ComingSoonWrapper>
                {children}
              </ComingSoonWrapper>
              <Footer />
            </AnalyticsProvider>
          </SentryProvider>
        </ErrorBoundary>
        <Toaster />
        <CookieBanner />
        <PerformanceMonitor />
        <MobileOptimizer />
      </body>
    </html>
  )
}
