export interface BlogPerformanceBudget {
  html: number; // KB
  js_execution: number; // ms
  js_total: number; // KB
  css: number; // KB
  lcp_image: number; // KB
  lcp: number; // ms
  inp: number; // ms
  cls: number; // score
}

export interface BlogPerformanceMetrics {
  lcp: number;
  inp: number;
  cls: number;
  html_size: number;
  js_size: number;
  css_size: number;
  image_size: number;
  load_time: number;
}

// Performance budgets for blog posts (mobile P75)
export const BLOG_PERFORMANCE_BUDGET: BlogPerformanceBudget = {
  html: 30, // KB
  js_execution: 120, // ms
  js_total: 140, // KB
  css: 45, // KB
  lcp_image: 160, // KB
  lcp: 2200, // ms
  inp: 200, // ms
  cls: 0.1, // score
};

export interface PerformanceCheckResult {
  passed: boolean;
  score: number;
  violations: Array<{
    metric: string;
    actual: number;
    budget: number;
    severity: 'warning' | 'error';
  }>;
  recommendations: string[];
}

export function checkBlogPerformance(
  metrics: BlogPerformanceMetrics
): PerformanceCheckResult {
  const violations: Array<{
    metric: string;
    actual: number;
    budget: number;
    severity: 'warning' | 'error';
  }> = [];
  const recommendations: string[] = [];

  // LCP check
  if (metrics.lcp > BLOG_PERFORMANCE_BUDGET.lcp) {
    violations.push({
      metric: 'LCP',
      actual: metrics.lcp,
      budget: BLOG_PERFORMANCE_BUDGET.lcp,
      severity: 'error',
    });
    recommendations.push('Optimize LCP by using next/image, preloading critical images, and reducing server response time');
  }

  // INP check
  if (metrics.inp > BLOG_PERFORMANCE_BUDGET.inp) {
    violations.push({
      metric: 'INP',
      actual: metrics.inp,
      budget: BLOG_PERFORMANCE_BUDGET.inp,
      severity: 'error',
    });
    recommendations.push('Improve INP by reducing JavaScript execution time and optimizing event handlers');
  }

  // CLS check
  if (metrics.cls > BLOG_PERFORMANCE_BUDGET.cls) {
    violations.push({
      metric: 'CLS',
      actual: metrics.cls,
      budget: BLOG_PERFORMANCE_BUDGET.cls,
      severity: 'error',
    });
    recommendations.push('Fix CLS by setting explicit dimensions for images and avoiding layout shifts');
  }

  // HTML size check
  if (metrics.html_size > BLOG_PERFORMANCE_BUDGET.html * 1024) {
    violations.push({
      metric: 'HTML Size',
      actual: metrics.html_size / 1024,
      budget: BLOG_PERFORMANCE_BUDGET.html,
      severity: 'warning',
    });
    recommendations.push('Reduce HTML size by removing unused markup and optimizing content structure');
  }

  // JS size check
  if (metrics.js_size > BLOG_PERFORMANCE_BUDGET.js_total * 1024) {
    violations.push({
      metric: 'JS Size',
      actual: metrics.js_size / 1024,
      budget: BLOG_PERFORMANCE_BUDGET.js_total,
      severity: 'warning',
    });
    recommendations.push('Reduce JavaScript bundle size through code splitting and tree shaking');
  }

  // CSS size check
  if (metrics.css_size > BLOG_PERFORMANCE_BUDGET.css * 1024) {
    violations.push({
      metric: 'CSS Size',
      actual: metrics.css_size / 1024,
      budget: BLOG_PERFORMANCE_BUDGET.css,
      severity: 'warning',
    });
    recommendations.push('Optimize CSS by removing unused styles and using CSS-in-JS efficiently');
  }

  // Image size check
  if (metrics.image_size > BLOG_PERFORMANCE_BUDGET.lcp_image * 1024) {
    violations.push({
      metric: 'LCP Image Size',
      actual: metrics.image_size / 1024,
      budget: BLOG_PERFORMANCE_BUDGET.lcp_image,
      severity: 'warning',
    });
    recommendations.push('Optimize LCP image by using WebP/AVIF format and proper sizing');
  }

  // Calculate performance score
  const errorCount = violations.filter(v => v.severity === 'error').length;
  const warningCount = violations.filter(v => v.severity === 'warning').length;
  const score = Math.max(0, 100 - (errorCount * 20) - (warningCount * 5));

  return {
    passed: errorCount === 0,
    score,
    violations,
    recommendations,
  };
}

export function generatePerformanceReport(
  metrics: BlogPerformanceMetrics,
  postSlug: string
): string {
  const result = checkBlogPerformance(metrics);
  
  let report = `# Performance Report for Blog Post: ${postSlug}\n\n`;
  report += `## Overall Score: ${result.score}/100\n\n`;
  report += `## Core Web Vitals\n`;
  report += `- **LCP**: ${metrics.lcp}ms (Budget: ${BLOG_PERFORMANCE_BUDGET.lcp}ms)\n`;
  report += `- **INP**: ${metrics.inp}ms (Budget: ${BLOG_PERFORMANCE_BUDGET.inp}ms)\n`;
  report += `- **CLS**: ${metrics.cls} (Budget: ${BLOG_PERFORMANCE_BUDGET.cls})\n\n`;
  
  report += `## Resource Sizes\n`;
  report += `- **HTML**: ${(metrics.html_size / 1024).toFixed(1)}KB (Budget: ${BLOG_PERFORMANCE_BUDGET.html}KB)\n`;
  report += `- **JS**: ${(metrics.js_size / 1024).toFixed(1)}KB (Budget: ${BLOG_PERFORMANCE_BUDGET.js_total}KB)\n`;
  report += `- **CSS**: ${(metrics.css_size / 1024).toFixed(1)}KB (Budget: ${BLOG_PERFORMANCE_BUDGET.css}KB)\n`;
  report += `- **Images**: ${(metrics.image_size / 1024).toFixed(1)}KB (Budget: ${BLOG_PERFORMANCE_BUDGET.lcp_image}KB)\n\n`;
  
  if (result.violations.length > 0) {
    report += `## Violations\n`;
    result.violations.forEach(violation => {
      const status = violation.severity === 'error' ? '❌' : '⚠️';
      report += `${status} **${violation.metric}**: ${violation.actual} (Budget: ${violation.budget})\n`;
    });
    report += `\n`;
  }
  
  if (result.recommendations.length > 0) {
    report += `## Recommendations\n`;
    result.recommendations.forEach(rec => {
      report += `- ${rec}\n`;
    });
  }
  
  return report;
}

export function getOptimizationTips(): string[] {
  return [
    'Use next/image for automatic image optimization',
    'Implement lazy loading for below-the-fold content',
    'Use dynamic imports for non-critical JavaScript',
    'Optimize fonts with font-display: swap',
    'Minimize third-party scripts and use async loading',
    'Implement proper caching headers',
    'Use CDN for static assets',
    'Optimize images to WebP/AVIF format',
    'Implement proper preloading for critical resources',
    'Use service workers for caching strategies',
  ];
}
