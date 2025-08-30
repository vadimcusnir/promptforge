import fs from 'fs';
import path from 'path';

export interface KPIMetric {
  id: string;
  name: string;
  description: string;
  value: number;
  unit: string;
  target?: number;
  status: 'good' | 'warning' | 'critical';
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
  changePercent?: number;
}

export interface KPIDashboard {
  version: string;
  lastUpdated: string;
  metrics: KPIMetric[];
  summary: {
    totalMetrics: number;
    goodMetrics: number;
    warningMetrics: number;
    criticalMetrics: number;
    overallHealth: 'healthy' | 'degraded' | 'critical';
  };
}

class KPITracker {
  private dataPath: string;
  private data: KPIDashboard | null = null;

  constructor() {
    this.dataPath = path.join(process.cwd(), 'lib', 'kpi-dashboard.json');
  }

  private async loadData(): Promise<KPIDashboard> {
    if (this.data) {
      return this.data;
    }

    try {
      const fileContent = await fs.promises.readFile(this.dataPath, 'utf-8');
      this.data = JSON.parse(fileContent);
      return this.data!;
    } catch (error) {
      console.error('Failed to load KPI data:', error);
      // Return default dashboard if file doesn't exist
      return this.getDefaultDashboard();
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
      console.error('Failed to save KPI data:', error);
      throw new Error('Failed to save KPI data');
    }
  }

  private getDefaultDashboard(): KPIDashboard {
    return {
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      metrics: [
        {
          id: 'legacy-redirect-share',
          name: 'Legacy Redirect Share',
          description: 'Percentage of traffic using legacy URLs',
          value: 0,
          unit: '%',
          target: 5, // Target: less than 5% of traffic should use legacy URLs
          status: 'good',
          lastUpdated: new Date().toISOString(),
          trend: 'stable'
        },
        {
          id: 'redirect-success-rate',
          name: 'Redirect Success Rate',
          description: 'Percentage of successful 308 redirects',
          value: 100,
          unit: '%',
          target: 99,
          status: 'good',
          lastUpdated: new Date().toISOString(),
          trend: 'stable'
        },
        {
          id: 'page-load-time',
          name: 'Average Page Load Time',
          description: 'Average time to load pages',
          value: 0,
          unit: 'ms',
          target: 2000,
          status: 'good',
          lastUpdated: new Date().toISOString(),
          trend: 'stable'
        },
        {
          id: 'lighthouse-performance',
          name: 'Lighthouse Performance Score',
          description: 'Average Lighthouse performance score',
          value: 0,
          unit: '/100',
          target: 80,
          status: 'good',
          lastUpdated: new Date().toISOString(),
          trend: 'stable'
        },
        {
          id: 'accessibility-score',
          name: 'Accessibility Score',
          description: 'Average accessibility score',
          value: 0,
          unit: '/100',
          target: 90,
          status: 'good',
          lastUpdated: new Date().toISOString(),
          trend: 'stable'
        },
        {
          id: 'security-score',
          name: 'Security Score',
          description: 'Security audit score',
          value: 0,
          unit: '/100',
          target: 95,
          status: 'good',
          lastUpdated: new Date().toISOString(),
          trend: 'stable'
        }
      ],
      summary: {
        totalMetrics: 6,
        goodMetrics: 6,
        warningMetrics: 0,
        criticalMetrics: 0,
        overallHealth: 'healthy'
      }
    };
  }

  private calculateStatus(value: number, target?: number): 'good' | 'warning' | 'critical' {
    if (!target) return 'good';
    
    const deviation = Math.abs(value - target) / target;
    
    if (deviation <= 0.1) return 'good'; // Within 10% of target
    if (deviation <= 0.2) return 'warning'; // Within 20% of target
    return 'critical'; // More than 20% deviation
  }

  private calculateTrend(currentValue: number, previousValue: number): 'up' | 'down' | 'stable' {
    const change = currentValue - previousValue;
    const changePercent = Math.abs(change) / previousValue;
    
    if (changePercent < 0.05) return 'stable'; // Less than 5% change
    return change > 0 ? 'up' : 'down';
  }

  async updateMetric(metricId: string, value: number, additionalData?: any): Promise<void> {
    try {
      const data = await this.loadData();
      const metric = data.metrics.find(m => m.id === metricId);
      
      if (!metric) {
        console.warn(`Metric not found: ${metricId}`);
        return;
      }

      const previousValue = metric.value;
      const previousStatus = metric.status;
      
      // Update metric
      metric.value = value;
      metric.status = this.calculateStatus(value, metric.target);
      metric.trend = this.calculateTrend(value, previousValue);
      metric.changePercent = previousValue > 0 ? ((value - previousValue) / previousValue) * 100 : 0;
      metric.lastUpdated = new Date().toISOString();

      // Update summary
      this.updateSummary(data);

      await this.saveData();

      // Log significant changes
      if (metric.status !== previousStatus) {
        console.log(`KPI Alert: ${metric.name} status changed to ${metric.status} (value: ${value})`);
      }

    } catch (error) {
      console.error('Failed to update metric:', error);
    }
  }

  private updateSummary(data: KPIDashboard): void {
    const goodMetrics = data.metrics.filter(m => m.status === 'good').length;
    const warningMetrics = data.metrics.filter(m => m.status === 'warning').length;
    const criticalMetrics = data.metrics.filter(m => m.status === 'critical').length;

    data.summary = {
      totalMetrics: data.metrics.length,
      goodMetrics,
      warningMetrics,
      criticalMetrics,
      overallHealth: criticalMetrics > 0 ? 'critical' : warningMetrics > 2 ? 'degraded' : 'healthy'
    };
  }

  async getMetric(metricId: string): Promise<KPIMetric | null> {
    const data = await this.loadData();
    return data.metrics.find(m => m.id === metricId) || null;
  }

  async getAllMetrics(): Promise<KPIMetric[]> {
    const data = await this.loadData();
    return data.metrics;
  }

  async getDashboard(): Promise<KPIDashboard> {
    return await this.loadData();
  }

  async getLegacyRedirectShare(): Promise<number> {
    const metric = await this.getMetric('legacy-redirect-share');
    return metric?.value || 0;
  }

  async updateLegacyRedirectShare(share: number): Promise<void> {
    await this.updateMetric('legacy-redirect-share', share);
  }

  async updatePerformanceMetrics(metrics: {
    pageLoadTime?: number;
    lighthouseScore?: number;
    accessibilityScore?: number;
    securityScore?: number;
  }): Promise<void> {
    if (metrics.pageLoadTime !== undefined) {
      await this.updateMetric('page-load-time', metrics.pageLoadTime);
    }
    if (metrics.lighthouseScore !== undefined) {
      await this.updateMetric('lighthouse-performance', metrics.lighthouseScore);
    }
    if (metrics.accessibilityScore !== undefined) {
      await this.updateMetric('accessibility-score', metrics.accessibilityScore);
    }
    if (metrics.securityScore !== undefined) {
      await this.updateMetric('security-score', metrics.securityScore);
    }
  }

  async generateReport(): Promise<{
    summary: KPIDashboard['summary'];
    metrics: KPIMetric[];
    alerts: Array<{
      metric: string;
      message: string;
      severity: 'warning' | 'critical';
    }>;
  }> {
    const data = await this.loadData();
    
    const alerts = data.metrics
      .filter(m => m.status !== 'good')
      .map(m => ({
        metric: m.name,
        message: `${m.name} is ${m.status} (${m.value}${m.unit}, target: ${m.target}${m.unit})`,
        severity: m.status as 'warning' | 'critical'
      }));

    return {
      summary: data.summary,
      metrics: data.metrics,
      alerts
    };
  }

  async resetMetrics(): Promise<void> {
    this.data = this.getDefaultDashboard();
    await this.saveData();
  }
}

export const kpiTracker = new KPITracker();
