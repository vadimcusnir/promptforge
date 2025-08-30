module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/modules',
        'http://localhost:3000/pricing',
        'http://localhost:3000/generator',
        'http://localhost:3000/docs'
      ],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage --disable-gpu --headless'
      }
    },
    assert: {
      assertions: {
        // Performance: ≥85
        'categories:performance': ['error', {minScore: 0.85}],
        'first-contentful-paint': ['error', {'maxNumericValue': 2000}],
        'largest-contentful-paint': ['error', {'maxNumericValue': 2500}],
        'cumulative-layout-shift': ['error', {'maxNumericValue': 0.1}],
        'total-blocking-time': ['error', {'maxNumericValue': 300}],
        'speed-index': ['error', {'maxNumericValue': 3000}],
        
        // Accessibility: ≥95
        'categories:accessibility': ['error', {minScore: 0.95}],
        
        // SEO: ≥90
        'categories:seo': ['error', {minScore: 0.90}],
        
        // Best Practices: ≥80
        'categories:best-practices': ['error', {minScore: 0.80}],
        
        // Additional performance metrics
        'interactive': ['error', {'maxNumericValue': 4000}],
        'first-meaningful-paint': ['error', {'maxNumericValue': 2000}],
        'render-blocking-resources': ['error', {'maxLength': 0}],
        'unused-css-rules': ['error', {'maxLength': 0}],
        'unused-javascript': ['error', {'maxLength': 0}],
        
        // Security and best practices
        'is-on-https': ['error', {}],
        'uses-http2': ['warn', {}],
        'no-vulnerable-libraries': ['error', {}],
        'csp-xss': ['error', {}]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
