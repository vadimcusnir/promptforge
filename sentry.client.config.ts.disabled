// This file configures the initialization of Sentry on the client side.
// The config you add here will be used whenever a users loads a page in their browser.
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

      replaysOnErrorSampleRate: 0.1,
      
      // This sets the sample rate to be 10%. You may want this to be 100% while
      // in development and sample at a lower rate in production
      replaysSessionSampleRate: 0.1,

      // You can remove this option if you're not planning to use the Reasons feature.
      integrations: [
        Sentry.replayIntegration({
          // Additional Replay configuration goes in here, for example:
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
    })
  }).catch((error) => {
    console.error('Failed to initialize Sentry:', error)
  })
} else if (process.env.NODE_ENV === 'development') {
  // Completely skip Sentry in development to prevent webpack issues
  console.log('Sentry disabled in development mode')
}
