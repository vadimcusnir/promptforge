export interface BlogTelemetryEvent {
  event_type: 'content.view' | 'content.read_complete' | 'content.cta_click' | 'content.share' | 'content.search';
  post_slug: string;
  user_id?: string;
  session_id: string;
  timestamp: number;
  metadata: {
    read_time?: number;
    scroll_depth?: number;
    cta_type?: string;
    share_platform?: string;
    search_query?: string;
    referrer?: string;
    user_agent?: string;
    viewport?: {
      width: number;
      height: number;
    };
  };
}

export interface BlogKPIMetrics {
  post_slug: string;
  date: string;
  views: number;
  read_complete: number;
  cta_clicks: number;
  shares: number;
  search_queries: number;
  avg_read_time: number;
  avg_scroll_depth: number;
  conversion_rate: number;
  organic_traffic: number;
  direct_traffic: number;
  referral_traffic: number;
}

export interface BlogAnalytics {
  top_posts: Array<{
    slug: string;
    title: string;
    views: number;
    read_complete_rate: number;
    conversion_rate: number;
  }>;
  conversion_funnel: {
    blog_views: number;
    pricing_views: number;
    signups: number;
    conversion_rate: number;
  };
  performance_metrics: {
    avg_lcp: number;
    avg_inp: number;
    avg_cls: number;
    slow_pages: Array<{
      slug: string;
      lcp: number;
      inp: number;
      cls: number;
    }>;
  };
  content_quality: {
    alt_text_coverage: number;
    internal_links_avg: number;
    seo_score_avg: number;
    draft_to_publish_time: number;
  };
}

// Mock telemetry storage - in production this would use a proper database
const telemetryEvents: BlogTelemetryEvent[] = [];

export function trackBlogEvent(event: BlogTelemetryEvent): void {
  telemetryEvents.push(event);
  
  // In production, this would send to analytics service
  console.log('Blog telemetry event:', event);
}

export function trackContentView(
  postSlug: string,
  sessionId: string,
  metadata: Partial<BlogTelemetryEvent['metadata']> = {}
): void {
  trackBlogEvent({
    event_type: 'content.view',
    post_slug: postSlug,
    session_id: sessionId,
    timestamp: Date.now(),
    metadata: {
      referrer: metadata.referrer,
      user_agent: metadata.user_agent,
      viewport: metadata.viewport,
    },
  });
}

export function trackReadComplete(
  postSlug: string,
  sessionId: string,
  readTime: number,
  scrollDepth: number
): void {
  trackBlogEvent({
    event_type: 'content.read_complete',
    post_slug: postSlug,
    session_id: sessionId,
    timestamp: Date.now(),
    metadata: {
      read_time: readTime,
      scroll_depth: scrollDepth,
    },
  });
}

export function trackCTAClick(
  postSlug: string,
  sessionId: string,
  ctaType: string
): void {
  trackBlogEvent({
    event_type: 'content.cta_click',
    post_slug: postSlug,
    session_id: sessionId,
    timestamp: Date.now(),
    metadata: {
      cta_type: ctaType,
    },
  });
}

export function trackShare(
  postSlug: string,
  sessionId: string,
  platform: string
): void {
  trackBlogEvent({
    event_type: 'content.share',
    post_slug: postSlug,
    session_id: sessionId,
    timestamp: Date.now(),
    metadata: {
      share_platform: platform,
    },
  });
}

export function trackSearch(
  postSlug: string,
  sessionId: string,
  query: string
): void {
  trackBlogEvent({
    event_type: 'content.search',
    post_slug: postSlug,
    session_id: sessionId,
    timestamp: Date.now(),
    metadata: {
      search_query: query,
    },
  });
}

export function getBlogAnalytics(dateRange: { start: Date; end: Date }): BlogAnalytics {
  const events = telemetryEvents.filter(
    event => event.timestamp >= dateRange.start.getTime() && 
             event.timestamp <= dateRange.end.getTime()
  );

  // Calculate top posts
  const postViews = new Map<string, { views: number; readComplete: number; ctaClicks: number }>();
  
  events.forEach(event => {
    if (!postViews.has(event.post_slug)) {
      postViews.set(event.post_slug, { views: 0, readComplete: 0, ctaClicks: 0 });
    }
    
    const post = postViews.get(event.post_slug)!;
    
    switch (event.event_type) {
      case 'content.view':
        post.views++;
        break;
      case 'content.read_complete':
        post.readComplete++;
        break;
      case 'content.cta_click':
        post.ctaClicks++;
        break;
    }
  });

  const topPosts = Array.from(postViews.entries())
    .map(([slug, metrics]) => ({
      slug,
      title: `Blog Post: ${slug}`, // In production, this would fetch actual titles
      views: metrics.views,
      read_complete_rate: metrics.views > 0 ? (metrics.readComplete / metrics.views) * 100 : 0,
      conversion_rate: metrics.views > 0 ? (metrics.ctaClicks / metrics.views) * 100 : 0,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // Calculate conversion funnel
  const blogViews = events.filter(e => e.event_type === 'content.view').length;
  const ctaClicks = events.filter(e => e.event_type === 'content.cta_click').length;
  
  // Mock data for pricing views and signups - in production this would come from actual analytics
  const pricingViews = Math.floor(blogViews * 0.15); // 15% of blog viewers go to pricing
  const signups = Math.floor(pricingViews * 0.08); // 8% conversion rate

  return {
    top_posts: topPosts,
    conversion_funnel: {
      blog_views: blogViews,
      pricing_views: pricingViews,
      signups: signups,
      conversion_rate: blogViews > 0 ? (signups / blogViews) * 100 : 0,
    },
    performance_metrics: {
      avg_lcp: 1800, // Mock data
      avg_inp: 150,
      avg_cls: 0.05,
      slow_pages: [], // Would be populated from actual performance data
    },
    content_quality: {
      alt_text_coverage: 95, // Mock data
      internal_links_avg: 4.2,
      seo_score_avg: 87,
      draft_to_publish_time: 18, // hours
    },
  };
}

export function generateWeeklyReport(): string {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const analytics = getBlogAnalytics({ start: startDate, end: endDate });
  
  let report = `# Weekly Blog Analytics Report\n\n`;
  report += `**Period**: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}\n\n`;
  
  report += `## Top Performing Posts\n`;
  analytics.top_posts.slice(0, 5).forEach((post, index) => {
    report += `${index + 1}. **${post.title}**\n`;
    report += `   - Views: ${post.views}\n`;
    report += `   - Read Complete Rate: ${post.read_complete_rate.toFixed(1)}%\n`;
    report += `   - Conversion Rate: ${post.conversion_rate.toFixed(1)}%\n\n`;
  });
  
  report += `## Conversion Funnel\n`;
  report += `- Blog Views: ${analytics.conversion_funnel.blog_views}\n`;
  report += `- Pricing Views: ${analytics.conversion_funnel.pricing_views}\n`;
  report += `- Signups: ${analytics.conversion_funnel.signups}\n`;
  report += `- Overall Conversion Rate: ${analytics.conversion_funnel.conversion_rate.toFixed(2)}%\n\n`;
  
  report += `## Performance Metrics\n`;
  report += `- Average LCP: ${analytics.performance_metrics.avg_lcp}ms\n`;
  report += `- Average INP: ${analytics.performance_metrics.avg_inp}ms\n`;
  report += `- Average CLS: ${analytics.performance_metrics.avg_cls}\n\n`;
  
  report += `## Content Quality\n`;
  report += `- Alt Text Coverage: ${analytics.content_quality.alt_text_coverage}%\n`;
  report += `- Average Internal Links: ${analytics.content_quality.internal_links_avg}\n`;
  report += `- Average SEO Score: ${analytics.content_quality.seo_score_avg}/100\n`;
  report += `- Draft to Publish Time: ${analytics.content_quality.draft_to_publish_time}h\n`;
  
  return report;
}
