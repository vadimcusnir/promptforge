/**
 * AgentWatch - Observability & Kill-Switch System
 * Monitors agent performance, detects anomalies, and triggers degradation/kill-switches
 */

import { telemetry } from '@/lib/telemetry';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load SSOT configuration
function loadRuleset() {
  try {
    const rulesetPath = join(process.cwd(), 'cursor', 'ruleset.yml');
    const content = readFileSync(rulesetPath, 'utf8');
    // Simple YAML parser for our specific format
    const lines = content.split('\n');
    const config: any = {};
    let currentSection: any = config;
    let currentKey = '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      if (trimmed.includes(':') && !trimmed.startsWith(' ')) {
        const [key, value] = trimmed.split(':', 2);
        if (value && value.trim()) {
          config[key.trim()] =
            value.trim() === 'true' ? true : value.trim() === 'false' ? false : value.trim();
        } else {
          currentKey = key.trim();
          config[currentKey] = {};
          currentSection = config[currentKey];
        }
      } else if (trimmed.startsWith('-')) {
        if (!Array.isArray(currentSection)) {
          currentSection = [];
          config[currentKey] = currentSection;
        }
        currentSection.push(trimmed.substring(1).trim());
      } else if (trimmed.includes(':')) {
        const [key, value] = trimmed.split(':', 2);
        currentSection[key.trim()] =
          value.trim() === 'true' ? true : value.trim() === 'false' ? false : value.trim();
      }
    }

    return config;
  } catch (error) {
    console.warn('Failed to load ruleset.yml, using defaults:', error);
    return {
      security: {
        agents_enabled: true,
        budgets: {
          tokens_max: 12000,
          requests_per_min: 60,
          cost_usd_max_run: 1.5,
        },
      },
    };
  }
}

export interface AgentMetrics {
  runId: string;
  orgId: string;
  moduleId: string;
  tokens: number;
  cost: number;
  duration: number;
  score?: number;
  errorRate: number;
  timeouts: number;
  timestamp: Date;
}

export interface AnomalyThresholds {
  maxTokens: number;
  maxCost: number;
  maxDuration: number;
  minScore: number;
  maxErrorRate: number;
  maxTimeouts: number;
}

export interface AnomalyAlert {
  type: 'budget_exceeded' | 'score_low' | 'error_spike' | 'timeout_spike';
  severity: 'warning' | 'critical';
  message: string;
  metrics: AgentMetrics;
  threshold: number;
  actual: number;
  timestamp: Date;
}

export class AgentWatchWorker {
  private static instance: AgentWatchWorker;
  private metrics: AgentMetrics[] = [];
  private thresholds: AnomalyThresholds;
  private alertCallbacks: ((alert: AnomalyAlert) => void)[] = [];
  private isMonitoring = false;
  private monitoringInterval?: NodeJS.Timeout;
  private degradationMode = false;

  private constructor() {
    const ruleset = loadRuleset();
    const budgets = ruleset.security?.budgets || {};

    this.thresholds = {
      maxTokens: Number(budgets.tokens_max) || 12000,
      maxCost: Number(budgets.cost_usd_max_run) || 1.5,
      maxDuration: Number(budgets.timeout_ms) || 20000,
      minScore: 80, // From SSOT rules
      maxErrorRate: 0.05, // 5% error rate threshold
      maxTimeouts: 3, // Max timeouts per run
    };
  }

  static getInstance(): AgentWatchWorker {
    if (!AgentWatchWorker.instance) {
      AgentWatchWorker.instance = new AgentWatchWorker();
    }
    return AgentWatchWorker.instance;
  }

  /**
   * Start monitoring agent metrics
   */
  startMonitoring(intervalMs = 5000): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.analyzeMetrics();
    }, intervalMs);

    console.log(`[AgentWatch] Monitoring started with ${intervalMs}ms interval`);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
    this.isMonitoring = false;
    console.log('[AgentWatch] Monitoring stopped');
  }

  /**
   * Record agent run metrics
   */
  recordMetrics(metrics: AgentMetrics): void {
    this.metrics.push(metrics);

    // Keep only last 1000 metrics in memory
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    // Immediate anomaly check for critical metrics
    this.checkImmediateAnomalies(metrics);

    // Track in telemetry system
    telemetry.trackEvent('agent_metrics_recorded', 'system', {
      runId: metrics.runId,
      orgId: metrics.orgId,
      moduleId: metrics.moduleId,
      tokens: metrics.tokens,
      cost: metrics.cost,
      duration: metrics.duration,
      score: metrics.score,
      errorRate: metrics.errorRate,
    });
  }

  /**
   * Check for immediate anomalies that require instant action
   */
  private checkImmediateAnomalies(metrics: AgentMetrics): void {
    const alerts: AnomalyAlert[] = [];

    // Budget violations
    if (metrics.tokens > this.thresholds.maxTokens) {
      alerts.push({
        type: 'budget_exceeded',
        severity: 'critical',
        message: `Token budget exceeded: ${metrics.tokens} > ${this.thresholds.maxTokens}`,
        metrics,
        threshold: this.thresholds.maxTokens,
        actual: metrics.tokens,
        timestamp: new Date(),
      });
    }

    if (metrics.cost > this.thresholds.maxCost) {
      alerts.push({
        type: 'budget_exceeded',
        severity: 'critical',
        message: `Cost budget exceeded: $${metrics.cost} > $${this.thresholds.maxCost}`,
        metrics,
        threshold: this.thresholds.maxCost,
        actual: metrics.cost,
        timestamp: new Date(),
      });
    }

    // Score violations
    if (metrics.score !== undefined && metrics.score < this.thresholds.minScore) {
      alerts.push({
        type: 'score_low',
        severity: 'warning',
        message: `Score below threshold: ${metrics.score} < ${this.thresholds.minScore}`,
        metrics,
        threshold: this.thresholds.minScore,
        actual: metrics.score,
        timestamp: new Date(),
      });
    }

    // Timeout violations
    if (metrics.timeouts > this.thresholds.maxTimeouts) {
      alerts.push({
        type: 'timeout_spike',
        severity: 'critical',
        message: `Timeout count exceeded: ${metrics.timeouts} > ${this.thresholds.maxTimeouts}`,
        metrics,
        threshold: this.thresholds.maxTimeouts,
        actual: metrics.timeouts,
        timestamp: new Date(),
      });
    }

    // Trigger alerts
    alerts.forEach(alert => this.triggerAlert(alert));
  }

  /**
   * Analyze metrics for patterns and anomalies
   */
  private analyzeMetrics(): void {
    if (this.metrics.length === 0) return;

    const recentMetrics = this.getRecentMetrics(300000); // Last 5 minutes
    if (recentMetrics.length === 0) return;

    // Calculate aggregated metrics
    const avgErrorRate =
      recentMetrics.reduce((sum, m) => sum + m.errorRate, 0) / recentMetrics.length;
    const avgScore =
      recentMetrics.filter(m => m.score !== undefined).reduce((sum, m) => sum + (m.score || 0), 0) /
      recentMetrics.filter(m => m.score !== undefined).length;

    // Check for error rate spikes
    if (avgErrorRate > this.thresholds.maxErrorRate) {
      this.triggerAlert({
        type: 'error_spike',
        severity: 'critical',
        message: `Error rate spike detected: ${(avgErrorRate * 100).toFixed(2)}% > ${(this.thresholds.maxErrorRate * 100).toFixed(2)}%`,
        metrics: recentMetrics[recentMetrics.length - 1], // Latest metrics
        threshold: this.thresholds.maxErrorRate,
        actual: avgErrorRate,
        timestamp: new Date(),
      });
    }

    // Check for consistent low scores
    const lowScoreMetrics = recentMetrics.filter(
      m => m.score !== undefined && m.score < this.thresholds.minScore
    );
    if (lowScoreMetrics.length > recentMetrics.length * 0.3) {
      // More than 30% of runs have low scores
      this.triggerAlert({
        type: 'score_low',
        severity: 'warning',
        message: `Consistent low scores detected: ${lowScoreMetrics.length}/${recentMetrics.length} runs below ${this.thresholds.minScore}`,
        metrics: recentMetrics[recentMetrics.length - 1],
        threshold: this.thresholds.minScore,
        actual: avgScore,
        timestamp: new Date(),
      });
    }
  }

  /**
   * Get recent metrics within specified time window
   */
  private getRecentMetrics(windowMs: number): AgentMetrics[] {
    const cutoff = new Date(Date.now() - windowMs);
    return this.metrics.filter(m => m.timestamp >= cutoff);
  }

  /**
   * Trigger alert and execute response actions
   */
  private triggerAlert(alert: AnomalyAlert): void {
    console.warn(`[AgentWatch] ALERT: ${alert.type} - ${alert.message}`);

    // Execute response actions based on alert type and severity
    if (alert.severity === 'critical') {
      this.handleCriticalAlert(alert);
    }

    // Notify all registered callbacks
    this.alertCallbacks.forEach(callback => {
      try {
        callback(alert);
      } catch (error) {
        console.error('[AgentWatch] Alert callback failed:', error);
      }
    });

    // Track alert in telemetry
    telemetry.trackEvent('agent_alert', 'system', {
      type: alert.type,
      severity: alert.severity,
      message: alert.message,
      runId: alert.metrics.runId,
      orgId: alert.metrics.orgId,
      threshold: alert.threshold,
      actual: alert.actual,
    });
  }

  /**
   * Handle critical alerts with immediate response
   */
  private handleCriticalAlert(alert: AnomalyAlert): void {
    switch (alert.type) {
      case 'budget_exceeded':
      case 'timeout_spike':
        // Trigger degradation mode
        this.enableDegradationMode();
        break;

      case 'error_spike':
        // Consider kill-switch if error rate is extremely high
        if (alert.actual > 0.2) {
          // 20% error rate
          this.triggerKillSwitch('High error rate detected');
        } else {
          this.enableDegradationMode();
        }
        break;
    }
  }

  /**
   * Enable degradation mode (simulation only)
   */
  enableDegradationMode(): void {
    if (this.degradationMode) return;

    this.degradationMode = true;
    console.warn('[AgentWatch] DEGRADATION MODE ENABLED - Switching to simulation only');

    // Update SSOT flag
    this.updateSSotFlag('degrade_to_simulation', true);

    telemetry.trackEvent('degradation_mode_enabled', 'system', {
      timestamp: new Date().toISOString(),
      reason: 'Anomaly detection triggered degradation',
    });
  }

  /**
   * Disable degradation mode
   */
  disableDegradationMode(): void {
    if (!this.degradationMode) return;

    this.degradationMode = false;
    console.log('[AgentWatch] Degradation mode disabled');

    this.updateSSotFlag('degrade_to_simulation', false);

    telemetry.trackEvent('degradation_mode_disabled', 'system', {
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Trigger kill-switch to disable all agents
   */
  triggerKillSwitch(reason: string): void {
    console.error(`[AgentWatch] KILL-SWITCH ACTIVATED: ${reason}`);

    // Set environment variable (would need process restart in production)
    process.env.AGENTS_ENABLED = 'false';

    // Update SSOT configuration
    this.updateSSotFlag('agents_enabled', false);

    telemetry.trackEvent('kill_switch_activated', 'system', {
      reason,
      timestamp: new Date().toISOString(),
    });

    // Notify all systems
    this.alertCallbacks.forEach(callback => {
      try {
        callback({
          type: 'budget_exceeded', // Using existing type for kill-switch
          severity: 'critical',
          message: `KILL-SWITCH ACTIVATED: ${reason}`,
          metrics: this.metrics[this.metrics.length - 1] || ({} as AgentMetrics),
          threshold: 0,
          actual: 1,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error('[AgentWatch] Kill-switch notification failed:', error);
      }
    });
  }

  /**
   * Update SSOT flag (in production, this would update the actual ruleset.yml)
   */
  private updateSSotFlag(flag: string, value: boolean): void {
    // In production, this would write to the actual ruleset.yml file
    // For now, we'll just track the change
    console.log(`[AgentWatch] SSOT Flag updated: ${flag} = ${value}`);

    telemetry.trackEvent('ssot_flag_updated', 'system', {
      flag,
      value,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Register alert callback
   */
  onAlert(callback: (alert: AnomalyAlert) => void): void {
    this.alertCallbacks.push(callback);
  }

  /**
   * Get current metrics summary
   */
  getMetricsSummary(): {
    totalRuns: number;
    avgTokens: number;
    avgCost: number;
    avgScore: number;
    errorRate: number;
    degradationMode: boolean;
    recentAlerts: number;
  } {
    const recentMetrics = this.getRecentMetrics(3600000); // Last hour

    return {
      totalRuns: this.metrics.length,
      avgTokens:
        recentMetrics.reduce((sum, m) => sum + m.tokens, 0) / Math.max(recentMetrics.length, 1),
      avgCost:
        recentMetrics.reduce((sum, m) => sum + m.cost, 0) / Math.max(recentMetrics.length, 1),
      avgScore:
        recentMetrics
          .filter(m => m.score !== undefined)
          .reduce((sum, m) => sum + (m.score || 0), 0) /
        Math.max(recentMetrics.filter(m => m.score !== undefined).length, 1),
      errorRate:
        recentMetrics.reduce((sum, m) => sum + m.errorRate, 0) / Math.max(recentMetrics.length, 1),
      degradationMode: this.degradationMode,
      recentAlerts: recentMetrics.filter(
        m =>
          m.tokens > this.thresholds.maxTokens ||
          m.cost > this.thresholds.maxCost ||
          (m.score !== undefined && m.score < this.thresholds.minScore)
      ).length,
    };
  }

  /**
   * Check if agents are enabled (kill-switch status)
   */
  static areAgentsEnabled(): boolean {
    // Check environment variable first
    if (process.env.AGENTS_ENABLED === 'false') {
      return false;
    }

    // Check SSOT configuration
    try {
      const ruleset = loadRuleset();
      return ruleset.security?.agents_enabled !== false;
    } catch (error) {
      console.warn('Failed to check SSOT configuration:', error);
      return true; // Default to enabled if config is unavailable
    }
  }
}

// Global instance
export const agentWatch = AgentWatchWorker.getInstance();
