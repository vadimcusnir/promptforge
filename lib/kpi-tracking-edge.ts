/**
 * Edge Runtime Compatible KPI Tracking
 * 
 * This version uses in-memory storage and is compatible with Next.js Edge Runtime
 * For production, consider using a database or external service for persistence
 */

import { redirectTelemetry } from './redirect-telemetry-edge';

export interface KPIMetrics {
  legacyRedirectShare: number;
  totalRedirects: number;
  legacyRedirects: number;
  timestamp: Date;
}

class KPITrackerEdge {
  private metrics: KPIMetrics[] = [];

  updateMetrics(): void {
    const redirectSummary = redirectTelemetry.getRedirectSummary();
    const totalRedirects = redirectTelemetry.getTotalRedirects();
    const legacyRedirects = Object.keys(redirectSummary).length;

    const legacyRedirectShare = totalRedirects > 0 ? (legacyRedirects / totalRedirects) * 100 : 0;

    this.metrics.push({
      legacyRedirectShare,
      totalRedirects,
      legacyRedirects,
      timestamp: new Date(),
    });

    console.log(`KPI Metrics updated: Legacy Redirect Share = ${legacyRedirectShare.toFixed(2)}%`);
  }

  getLatestMetrics(): KPIMetrics | null {
    if (this.metrics.length === 0) {
      return null;
    }
    return this.metrics[this.metrics.length - 1];
  }

  getMetricsHistory(): KPIMetrics[] {
    return [...this.metrics];
  }

  clearMetrics(): void {
    this.metrics = [];
  }

  getLegacyRedirectShare(): number {
    const latest = this.getLatestMetrics();
    return latest ? latest.legacyRedirectShare : 0;
  }

  getTotalRedirects(): number {
    const latest = this.getLatestMetrics();
    return latest ? latest.totalRedirects : 0;
  }

  getLegacyRedirects(): number {
    const latest = this.getLatestMetrics();
    return latest ? latest.legacyRedirects : 0;
  }

  async getDashboard() {
    return {
      metrics: this.getLatestMetrics(),
      summary: {
        totalRedirects: this.getTotalRedirects(),
        legacyRedirects: this.getLegacyRedirects()
      }
    };
  }

  async generateReport() {
    const latest = this.getLatestMetrics();
    return {
      summary: {
        totalRedirects: this.getTotalRedirects(),
        legacyRedirects: this.getLegacyRedirects(),
        legacyRedirectShare: this.getLegacyRedirectShare()
      },
      metrics: latest,
      timestamp: new Date()
    };
  }

  async updateMetric(metricId: string, value: number, additionalData?: any) {
    // For the edge version, we just update the metrics
    this.updateMetrics();
  }

  async updatePerformanceMetrics(data?: any) {
    this.updateMetrics();
  }

  async updateLegacyRedirectShare(data?: any) {
    this.updateMetrics();
  }

  async resetMetrics() {
    this.clearMetrics();
  }
}

export const kpiTracker = new KPITrackerEdge();
