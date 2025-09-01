module.exports = {
  ci: {
    collect: {
      // URLs to test
      url: [
        'http://localhost:3000',
        'http://localhost:3000/pricing',
        'http://localhost:3000/generator',
        'http://localhost:3000/dashboard',
        'http://localhost:3000/modules'
      ],
      // Number of runs per URL
      numberOfRuns: 3,
      // Settings for data collection
      settings: {
        // Mobile testing profiles
        formFactor: 'mobile',
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 4
        },
        // Screen emulation
        emulatedFormFactor: 'mobile',
        screenEmulation: {
          mobile: true,
          width: 375,
          height: 667,
          deviceScaleFactor: 2
        }
      }
    },
    assert: {
      // Performance budgets
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        
        // Core Web Vitals thresholds
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'speed-index': ['error', { maxNumericValue: 3000 }],
        
        // Mobile-specific metrics
        'interactive': ['error', { maxNumericValue: 3500 }],
        'max-potential-fid': ['error', { maxNumericValue: 200 }],
        
        // Resource budgets
        'resource-summary:script:size': ['error', { maxNumericValue: 500000 }], // 500KB
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 100000 }], // 100KB
        'resource-summary:image:size': ['error', { maxNumericValue: 1000000 }], // 1MB
        'resource-summary:total:size': ['error', { maxNumericValue: 2000000 }], // 2MB
        
        // Network requests
        'resource-summary:script:count': ['error', { maxNumericValue: 20 }],
        'resource-summary:stylesheet:count': ['error', { maxNumericValue: 5 }],
        'resource-summary:image:count': ['error', { maxNumericValue: 15 }],
        'resource-summary:total:count': ['error', { maxNumericValue: 50 }]
      }
    },
    upload: {
      // Upload results to Lighthouse CI server
      target: 'temporary-public-storage',
      // GitHub integration
      githubAppToken: process.env.LHCI_GITHUB_APP_TOKEN,
      // Slack notifications
      slackWebhook: process.env.LHCI_SLACK_WEBHOOK
    }
  }
}