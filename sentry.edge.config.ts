// This file configures the initialization of Sentry for edge runtime (middleware, edge functions, and so on).
// The config you add here will be used whenever one of the edge runtime features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

// Only initialize Sentry in production or when DSN is explicitly provided
if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_SENTRY_DSN) {
  // Dynamic import to prevent webpack HMR issues in development
  import("@sentry/nextjs").then((Sentry) => {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      
      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: false,
    })
  }).catch((error) => {
    // Silently fail in development to prevent HMR issues
    if (process.env.NODE_ENV === 'development') {
      console.warn('Sentry edge initialization skipped in development:', error.message)
    } else {
      console.error('Failed to initialize Sentry edge:', error)
    }
  })
}
