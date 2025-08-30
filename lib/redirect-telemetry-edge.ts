/**
 * Edge Runtime Compatible Redirect Telemetry
 * 
 * This version uses in-memory storage and is compatible with Next.js Edge Runtime
 * For production, consider using a database or external service for persistence
 */

export interface RedirectEvent {
  timestamp: Date;
  legacySlug: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface RedirectSummary {
  [legacySlug: string]: number;
}

class RedirectTelemetryEdge {
  private redirects: RedirectEvent[] = [];
  private summary: RedirectSummary = {};

  constructor() {
    // Initialize with empty data for Edge Runtime compatibility
    this.redirects = [];
    this.summary = {};
  }

  trackRedirect(legacySlug: string, userAgent?: string, ipAddress?: string): void {
    const event: RedirectEvent = {
      timestamp: new Date(),
      legacySlug,
      userAgent,
      ipAddress,
    };

    this.redirects.push(event);
    this.summary[legacySlug] = (this.summary[legacySlug] || 0) + 1;

    // Log redirect for monitoring (Edge Runtime compatible)
    console.log(`Redirect tracked: ${legacySlug} from ${ipAddress} (${userAgent})`);
  }

  getRedirects(): RedirectEvent[] {
    return [...this.redirects];
  }

  getRedirectSummary(): RedirectSummary {
    return { ...this.summary };
  }

  getLegacyRedirectShare(): number {
    const totalRedirects = this.redirects.length;
    const legacyRedirects = Object.keys(this.summary).length;
    
    if (totalRedirects === 0) {
      return 0;
    }

    // Calculate legacy redirect share as percentage
    return (legacyRedirects / totalRedirects) * 100;
  }

  clearRedirects(): void {
    this.redirects = [];
    this.summary = {};
  }

  getTotalRedirects(): number {
    return this.redirects.length;
  }

  getTopLegacySlugs(limit: number = 10): Array<{ slug: string; count: number }> {
    return Object.entries(this.summary)
      .map(([slug, count]) => ({ slug, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  async getRedirectStats() {
    return {
      total: this.redirects.length,
      summary: this.summary,
      topSlugs: this.getTopLegacySlugs()
    };
  }

  async generateReport() {
    return {
      summary: {
        totalRedirects: this.getTotalRedirects(),
        legacyRedirectShare: this.getLegacyRedirectShare(),
        topLegacySlugs: this.getTopLegacySlugs()
      },
      redirects: this.getRedirects(),
      timestamp: new Date()
    };
  }
}

export const redirectTelemetry = new RedirectTelemetryEdge();
