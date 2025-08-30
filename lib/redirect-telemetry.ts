import fs from 'fs';
import path from 'path';

export interface RedirectEntry {
  id: string;
  legacySlug: string;
  currentSlug: string;
  type: 'module' | 'page' | 'api';
  status: 'active' | 'inactive' | 'deprecated';
  createdAt: string;
  redirectCount: number;
  lastRedirect: string | null;
}

export interface RedirectAnalytics {
  totalRedirects: number;
  redirectsByType: Record<string, number>;
  redirectsByDay: Record<string, number>;
  topLegacySlugs: Array<{ slug: string; count: number }>;
  lastAnalyticsUpdate: string | null;
}

export interface RedirectsData {
  version: string;
  lastUpdated: string;
  redirects: RedirectEntry[];
  analytics: RedirectAnalytics;
}

class RedirectTelemetry {
  private dataPath: string;
  private data: RedirectsData | null = null;

  constructor() {
    this.dataPath = path.join(process.cwd(), 'lib', 'redirects.json');
  }

  private async loadData(): Promise<RedirectsData> {
    if (this.data) {
      return this.data;
    }

    try {
      const fileContent = await fs.promises.readFile(this.dataPath, 'utf-8');
      this.data = JSON.parse(fileContent);
      return this.data!;
    } catch (error) {
      console.error('Failed to load redirects data:', error);
      throw new Error('Failed to load redirects telemetry data');
    }
  }

  private async saveData(): Promise<void> {
    if (!this.data) {
      throw new Error('No data to save');
    }

    this.data.lastUpdated = new Date().toISOString();
    
    try {
      await fs.promises.writeFile(
        this.dataPath,
        JSON.stringify(this.data, null, 2),
        'utf-8'
      );
    } catch (error) {
      console.error('Failed to save redirects data:', error);
      throw new Error('Failed to save redirects telemetry data');
    }
  }

  async trackRedirect(legacySlug: string, userAgent?: string, ip?: string): Promise<void> {
    try {
      const data = await this.loadData();
      const redirect = data.redirects.find(r => r.legacySlug === legacySlug);
      
      if (!redirect) {
        console.warn(`Redirect not found for legacy slug: ${legacySlug}`);
        return;
      }

      // Update redirect statistics
      redirect.redirectCount += 1;
      redirect.lastRedirect = new Date().toISOString();

      // Update analytics
      data.analytics.totalRedirects += 1;
      data.analytics.redirectsByType[redirect.type] = (data.analytics.redirectsByType[redirect.type] || 0) + 1;
      
      const today = new Date().toISOString().split('T')[0];
      data.analytics.redirectsByDay[today] = (data.analytics.redirectsByDay[today] || 0) + 1;
      
      // Update top legacy slugs
      const existingTopSlug = data.analytics.topLegacySlugs.find(item => item.slug === legacySlug);
      if (existingTopSlug) {
        existingTopSlug.count += 1;
      } else {
        data.analytics.topLegacySlugs.push({ slug: legacySlug, count: 1 });
      }
      
      // Sort and keep top 10
      data.analytics.topLegacySlugs.sort((a, b) => b.count - a.count);
      data.analytics.topLegacySlugs = data.analytics.topLegacySlugs.slice(0, 10);
      
      data.analytics.lastAnalyticsUpdate = new Date().toISOString();

      await this.saveData();

      // Log redirect for monitoring
      console.log(`Redirect tracked: ${legacySlug} -> ${redirect.currentSlug} (count: ${redirect.redirectCount})`);
      
    } catch (error) {
      console.error('Failed to track redirect:', error);
      // Don't throw - redirect should still work even if telemetry fails
    }
  }

  async getRedirectStats(): Promise<RedirectAnalytics> {
    const data = await this.loadData();
    return data.analytics;
  }

  async getRedirectEntry(legacySlug: string): Promise<RedirectEntry | null> {
    const data = await this.loadData();
    return data.redirects.find(r => r.legacySlug === legacySlug) || null;
  }

  async getAllRedirects(): Promise<RedirectEntry[]> {
    const data = await this.loadData();
    return data.redirects;
  }

  async getLegacyRedirectShare(): Promise<number> {
    const data = await this.loadData();
    const totalRedirects = data.analytics.totalRedirects;
    
    if (totalRedirects === 0) {
      return 0;
    }

    // Calculate legacy redirect share as percentage of total traffic
    // This is a simplified calculation - in production you'd want more sophisticated metrics
    const activeRedirects = data.redirects.filter(r => r.status === 'active' && r.redirectCount > 0);
    const totalLegacyTraffic = activeRedirects.reduce((sum, r) => sum + r.redirectCount, 0);
    
    return totalLegacyTraffic > 0 ? (totalLegacyTraffic / (totalLegacyTraffic + 1000)) * 100 : 0; // Assuming 1000 as baseline traffic
  }

  async generateReport(): Promise<{
    summary: {
      totalRedirects: number;
      activeRedirects: number;
      legacyRedirectShare: number;
      topLegacySlugs: Array<{ slug: string; count: number }>;
    };
    details: RedirectEntry[];
  }> {
    const data = await this.loadData();
    const legacyRedirectShare = await this.getLegacyRedirectShare();
    
    return {
      summary: {
        totalRedirects: data.analytics.totalRedirects,
        activeRedirects: data.redirects.filter(r => r.status === 'active').length,
        legacyRedirectShare,
        topLegacySlugs: data.analytics.topLegacySlugs
      },
      details: data.redirects
    };
  }
}

export const redirectTelemetry = new RedirectTelemetry();
