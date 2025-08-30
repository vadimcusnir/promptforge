// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

// Only initialize Sentry in production to prevent webpack HMR issues in development
if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
  // Dynamic import to prevent webpack HMR issues in development
  import("@sentry/nextjs").then((Sentry) => {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      
      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: 0.1,
      
      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: false,

      // Uncomment the line below to enable Spotlight (https://spotlightjs.com)
      // spotlight: process.env.NODE_ENV === 'development',
    })
  }).catch((error) => {
    console.error('Failed to initialize Sentry server:', error)
  })
} else if (process.env.NODE_ENV === 'development') {
  // Completely skip Sentry in development to prevent webpack issues
  console.log('Sentry server disabled in development mode')
}
