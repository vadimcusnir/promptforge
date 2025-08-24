/**
 * Alert System - Incident Response and Notification System
 * Handles alert routing, escalation, and external notifications
 */

import { agentWatch, type AnomalyAlert } from "./agent-watch";
import { auditLogger } from "./audit-logger";
import { telemetry } from "@/lib/telemetry";

export interface AlertChannel {
  id: string;
  type: "slack" | "email" | "webhook" | "console";
  config: Record<string, any>;
  enabled: boolean;
  severity_filter: ("warning" | "critical")[];
}

export interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  severity: "warning" | "critical";
  channels: string[];
  cooldown_minutes: number;
  enabled: boolean;
}

export interface IncidentReport {
  id: string;
  alert_type: string;
  severity: "warning" | "critical";
  title: string;
  description: string;
  started_at: Date;
  resolved_at?: Date;
  status: "active" | "acknowledged" | "resolved";
  affected_runs: string[];
  metrics: Record<string, number>;
  actions_taken: string[];
  resolution_notes?: string;
}

export class AlertSystem {
  private static instance: AlertSystem;
  private channels: AlertChannel[] = [];
  private rules: AlertRule[] = [];
  private incidents: IncidentReport[] = [];
  private alertCooldowns: Map<string, Date> = new Map();
  private isInitialized = false;

  private constructor() {
    this.initializeDefaultChannels();
    this.initializeDefaultRules();
  }

  static getInstance(): AlertSystem {
    if (!AlertSystem.instance) {
      AlertSystem.instance = new AlertSystem();
    }
    return AlertSystem.instance;
  }

  /**
   * Initialize the alert system
   */
  initialize(): void {
    if (this.isInitialized) return;

    // Register with AgentWatch for alerts
    agentWatch.onAlert((alert) => {
      this.processAlert(alert);
    });

    // Start background monitoring
    this.startBackgroundMonitoring();

    this.isInitialized = true;
    console.log(
      "[AlertSystem] Initialized with",
      this.channels.length,
      "channels and",
      this.rules.length,
      "rules",
    );
  }

  /**
   * Initialize default alert channels
   */
  private initializeDefaultChannels(): void {
    this.channels = [
      {
        id: "console",
        type: "console",
        config: {},
        enabled: true,
        severity_filter: ["warning", "critical"],
      },
      {
        id: "slack-ops",
        type: "slack",
        config: {
          webhook_url: process.env.SLACK_WEBHOOK_URL || "",
          channel: "#ops-alerts",
        },
        enabled: !!process.env.SLACK_WEBHOOK_URL,
        severity_filter: ["critical"],
      },
      {
        id: "email-admin",
        type: "email",
        config: {
          recipients: ["admin@promptforge.app"],
          smtp_config: {
            host: process.env.SMTP_HOST || "",
            port: process.env.SMTP_PORT || 587,
            user: process.env.SMTP_USER || "",
            password: process.env.SMTP_PASSWORD || "",
          },
        },
        enabled: !!process.env.SMTP_HOST,
        severity_filter: ["critical"],
      },
    ];
  }

  /**
   * Initialize default alert rules
   */
  private initializeDefaultRules(): void {
    this.rules = [
      {
        id: "high-error-rate",
        name: "High Error Rate",
        condition: "error_rate > threshold",
        threshold: 0.1, // 10%
        severity: "critical",
        channels: ["console", "slack-ops", "email-admin"],
        cooldown_minutes: 15,
        enabled: true,
      },
      {
        id: "budget-exceeded",
        name: "Budget Exceeded",
        condition: "cost > threshold OR tokens > threshold",
        threshold: 1.0, // $1 or token limit
        severity: "critical",
        channels: ["console", "slack-ops"],
        cooldown_minutes: 5,
        enabled: true,
      },
      {
        id: "low-score-trend",
        name: "Low Score Trend",
        condition: "avg_score < threshold",
        threshold: 75,
        severity: "warning",
        channels: ["console", "slack-ops"],
        cooldown_minutes: 30,
        enabled: true,
      },
      {
        id: "timeout-spike",
        name: "Timeout Spike",
        condition: "timeouts > threshold",
        threshold: 3,
        severity: "critical",
        channels: ["console", "slack-ops"],
        cooldown_minutes: 10,
        enabled: true,
      },
    ];
  }

  /**
   * Process incoming alert from AgentWatch
   */
  private async processAlert(alert: AnomalyAlert): Promise<void> {
    try {
      // Check cooldown
      const cooldownKey = `${alert.type}_${alert.metrics.orgId}`;
      const lastAlert = this.alertCooldowns.get(cooldownKey);
      const rule = this.rules.find(
        (r) => r.id === alert.type.replace("_", "-"),
      );

      if (rule && lastAlert) {
        const cooldownMs = rule.cooldown_minutes * 60 * 1000;
        if (Date.now() - lastAlert.getTime() < cooldownMs) {
          console.log(
            `[AlertSystem] Alert ${alert.type} in cooldown, skipping`,
          );
          return;
        }
      }

      // Update cooldown
      this.alertCooldowns.set(cooldownKey, new Date());

      // Create or update incident
      const incident = await this.createOrUpdateIncident(alert);

      // Send notifications
      await this.sendNotifications(alert, incident);

      // Track in telemetry
      telemetry.trackEvent({
        event: "alert_processed",
        orgId: "system",
        userId: "system",
        payload: {
          alert_type: alert.type,
          severity: alert.severity,
          incident_id: incident.id,
          channels_notified: this.getChannelsForAlert(alert).length,
        }
      });
    } catch (error) {
      console.error("[AlertSystem] Failed to process alert:", error);
      telemetry.trackEvent({
        event: "alert_processing_error",
        orgId: "system",
        userId: "system",
        payload: {
          error: error instanceof Error ? error.message : String(error),
          context: "alert_processing"
        }
      });
    }
  }

  /**
   * Create or update incident report
   */
  private async createOrUpdateIncident(
    alert: AnomalyAlert,
  ): Promise<IncidentReport> {
    // Check for existing active incident of same type
    let incident = this.incidents.find(
      (i) =>
        i.alert_type === alert.type &&
        i.status === "active" &&
        i.started_at.getTime() > Date.now() - 3600000, // Within last hour
    );

    if (incident) {
      // Update existing incident
      incident.affected_runs.push(alert.metrics.runId);
      incident.metrics[alert.type] = alert.actual;
      incident.actions_taken.push(
        `Alert triggered at ${alert.timestamp.toISOString()}`,
      );
    } else {
      // Create new incident
      incident = {
        id: `incident_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        alert_type: alert.type,
        severity: alert.severity,
        title: this.generateIncidentTitle(alert),
        description: this.generateIncidentDescription(alert),
        started_at: alert.timestamp,
        status: "active",
        affected_runs: [alert.metrics.runId],
        metrics: { [alert.type]: alert.actual },
        actions_taken: [`Incident created due to ${alert.type} alert`],
      };

      this.incidents.push(incident);
    }

    return incident;
  }

  /**
   * Generate incident title
   */
  private generateIncidentTitle(alert: AnomalyAlert): string {
    const titles = {
      budget_exceeded: "Budget Limit Exceeded",
      score_low: "Low Performance Scores Detected",
      error_spike: "High Error Rate Detected",
      timeout_spike: "Multiple Timeouts Detected",
    };

    return titles[alert.type] || `System Alert: ${alert.type}`;
  }

  /**
   * Generate incident description
   */
  private generateIncidentDescription(alert: AnomalyAlert): string {
    return `${alert.message}

**Details:**
- Run ID: ${alert.metrics.runId}
- Org ID: ${alert.metrics.orgId}
- Module: ${alert.metrics.moduleId}
- Threshold: ${alert.threshold}
- Actual Value: ${alert.actual}
- Timestamp: ${alert.timestamp.toISOString()}

**Metrics:**
- Tokens: ${alert.metrics.tokens}
- Cost: $${alert.metrics.cost.toFixed(4)}
- Duration: ${alert.metrics.duration}ms
${alert.metrics.score ? `- Score: ${alert.metrics.score}` : ""}
- Error Rate: ${(alert.metrics.errorRate * 100).toFixed(2)}%`;
  }

  /**
   * Send notifications through configured channels
   */
  private async sendNotifications(
    alert: AnomalyAlert,
    incident: IncidentReport,
  ): Promise<void> {
    const channels = this.getChannelsForAlert(alert);

    const notificationPromises = channels.map((channel) =>
      this.sendNotificationToChannel(channel, alert, incident),
    );

    await Promise.allSettled(notificationPromises);
  }

  /**
   * Get channels that should receive this alert
   */
  private getChannelsForAlert(alert: AnomalyAlert): AlertChannel[] {
    return this.channels.filter(
      (channel) =>
        channel.enabled && channel.severity_filter.includes(alert.severity),
    );
  }

  /**
   * Send notification to specific channel
   */
  private async sendNotificationToChannel(
    channel: AlertChannel,
    alert: AnomalyAlert,
    incident: IncidentReport,
  ): Promise<void> {
    try {
      switch (channel.type) {
        case "console":
          this.sendConsoleNotification(alert, incident);
          break;
        case "slack":
          await this.sendSlackNotification(channel, alert, incident);
          break;
        case "email":
          await this.sendEmailNotification(channel, alert, incident);
          break;
        case "webhook":
          await this.sendWebhookNotification(channel, alert, incident);
          break;
        default:
          console.warn(`[AlertSystem] Unknown channel type: ${channel.type}`);
      }
    } catch (error) {
      console.error(
        `[AlertSystem] Failed to send notification to ${channel.id}:`,
        error,
      );
    }
  }

  /**
   * Send console notification
   */
  private sendConsoleNotification(
    alert: AnomalyAlert,
    incident: IncidentReport,
  ): void {
    const emoji = alert.severity === "critical" ? "🚨" : "⚠️";
    console.log(`${emoji} [ALERT] ${incident.title}`);
    console.log(`   Type: ${alert.type}`);
    console.log(`   Severity: ${alert.severity}`);
    console.log(`   Message: ${alert.message}`);
    console.log(`   Run: ${alert.metrics.runId}`);
    console.log(`   Incident: ${incident.id}`);
  }

  /**
   * Send Slack notification
   */
  private async sendSlackNotification(
    channel: AlertChannel,
    alert: AnomalyAlert,
    incident: IncidentReport,
  ): Promise<void> {
    if (!channel.config.webhook_url) {
      console.warn("[AlertSystem] Slack webhook URL not configured");
      return;
    }

    const color = alert.severity === "critical" ? "#ff0000" : "#ffaa00";
    const emoji =
      alert.severity === "critical" ? ":rotating_light:" : ":warning:";

    const payload = {
      channel: channel.config.channel,
      username: "PromptForge Monitor",
      icon_emoji: ":robot_face:",
      attachments: [
        {
          color,
          title: `${emoji} ${incident.title}`,
          text: alert.message,
          fields: [
            {
              title: "Severity",
              value: alert.severity.toUpperCase(),
              short: true,
            },
            {
              title: "Type",
              value: alert.type,
              short: true,
            },
            {
              title: "Run ID",
              value: alert.metrics.runId.substring(0, 8) + "...",
              short: true,
            },
            {
              title: "Module",
              value: alert.metrics.moduleId,
              short: true,
            },
            {
              title: "Threshold",
              value: alert.threshold.toString(),
              short: true,
            },
            {
              title: "Actual",
              value: alert.actual.toString(),
              short: true,
            },
          ],
          footer: "PromptForge Monitoring",
          ts: Math.floor(alert.timestamp.getTime() / 1000),
        },
      ],
    };

    const response = await fetch(channel.config.webhook_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Slack notification failed: ${response.statusText}`);
    }
  }

  /**
   * Send email notification
   */
  private async sendEmailNotification(
    channel: AlertChannel,
    alert: AnomalyAlert,
    incident: IncidentReport,
  ): Promise<void> {
    // In production, this would use a proper email service
    console.log(
      `[AlertSystem] Email notification would be sent to:`,
      channel.config.recipients,
    );
    console.log(`Subject: [${alert.severity.toUpperCase()}] ${incident.title}`);
    console.log(`Body: ${incident.description}`);
  }

  /**
   * Send webhook notification
   */
  private async sendWebhookNotification(
    channel: AlertChannel,
    alert: AnomalyAlert,
    incident: IncidentReport,
  ): Promise<void> {
    const payload = {
      alert,
      incident,
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(channel.config.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...channel.config.headers,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook notification failed: ${response.statusText}`);
    }
  }

  /**
   * Start background monitoring for system-wide issues
   */
  private startBackgroundMonitoring(): void {
    setInterval(() => {
      this.checkSystemHealth();
    }, 300000); // Check every 5 minutes

    console.log("[AlertSystem] Background monitoring started");
  }

  /**
   * Check overall system health
   */
  private async checkSystemHealth(): Promise<void> {
    try {
      const auditStats = auditLogger.getStatistics({ limit: 100 });
      const agentSummary = agentWatch.getMetricsSummary();

      // Check for system-wide issues
      if (auditStats.error_rate > 20) {
        await this.processAlert({
          type: "error_spike",
          severity: "critical",
          message: `System-wide error rate: ${auditStats.error_rate.toFixed(1)}%`,
          metrics: {
            runId: "system_check",
            orgId: "system",
            moduleId: "system_health",
            tokens: 0,
            cost: 0,
            duration: 0,
            errorRate: auditStats.error_rate / 100,
            timeouts: 0,
            timestamp: new Date(),
          },
          threshold: 0.2,
          actual: auditStats.error_rate / 100,
          timestamp: new Date(),
        });
      }

      if (auditStats.pass_rate < 70) {
        await this.processAlert({
          type: "score_low",
          severity: "warning",
          message: `System-wide pass rate: ${auditStats.pass_rate.toFixed(1)}%`,
          metrics: {
            runId: "system_check",
            orgId: "system",
            moduleId: "system_health",
            tokens: 0,
            cost: 0,
            duration: 0,
            score: auditStats.pass_rate,
            errorRate: 0,
            timeouts: 0,
            timestamp: new Date(),
          },
          threshold: 70,
          actual: auditStats.pass_rate,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error("[AlertSystem] System health check failed:", error);
    }
  }

  /**
   * Acknowledge an incident
   */
  acknowledgeIncident(incidentId: string, acknowledgedBy: string): boolean {
    const incident = this.incidents.find((i) => i.id === incidentId);
    if (!incident || incident.status !== "active") return false;

    incident.status = "acknowledged";
    incident.actions_taken.push(
      `Acknowledged by ${acknowledgedBy} at ${new Date().toISOString()}`,
    );

    telemetry.trackEvent({
      event: "incident_acknowledged",
      orgId: "system",
      userId: "system",
      payload: {
        incident_id: incidentId,
        acknowledged_by: acknowledgedBy,
      }
    });

    return true;
  }

  /**
   * Resolve an incident
   */
  resolveIncident(
    incidentId: string,
    resolvedBy: string,
    notes?: string,
  ): boolean {
    const incident = this.incidents.find((i) => i.id === incidentId);
    if (!incident || incident.status === "resolved") return false;

    incident.status = "resolved";
    incident.resolved_at = new Date();
    incident.resolution_notes = notes;
    incident.actions_taken.push(
      `Resolved by ${resolvedBy} at ${new Date().toISOString()}`,
    );

    telemetry.trackEvent({
      event: "incident_resolved",
      orgId: "system",
      userId: "system",
      payload: {
        incident_id: incidentId,
        resolved_by: resolvedBy,
        duration_minutes:
          incident.resolved_at.getTime() - incident.started_at.getTime() / 60000,
      }
    });

    return true;
  }

  /**
   * Get active incidents
   */
  getActiveIncidents(): IncidentReport[] {
    return this.incidents.filter((i) => i.status === "active");
  }

  /**
   * Get incident by ID
   */
  getIncident(incidentId: string): IncidentReport | undefined {
    return this.incidents.find((i) => i.id === incidentId);
  }

  /**
   * Get alert statistics
   */
  getAlertStatistics(): {
    total_incidents: number;
    active_incidents: number;
    resolved_incidents: number;
    avg_resolution_time_minutes: number;
    incidents_by_type: Record<string, number>;
    incidents_by_severity: Record<string, number>;
  } {
    const resolved = this.incidents.filter(
      (i) => i.status === "resolved" && i.resolved_at,
    );
    const avgResolutionTime =
      resolved.length > 0
        ? resolved.reduce(
            (sum, i) =>
              sum + (i.resolved_at!.getTime() - i.started_at.getTime()),
            0,
          ) /
          resolved.length /
          60000
        : 0;

    const byType: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};

    this.incidents.forEach((incident) => {
      byType[incident.alert_type] = (byType[incident.alert_type] || 0) + 1;
      bySeverity[incident.severity] = (bySeverity[incident.severity] || 0) + 1;
    });

    return {
      total_incidents: this.incidents.length,
      active_incidents: this.incidents.filter((i) => i.status === "active")
        .length,
      resolved_incidents: this.incidents.filter((i) => i.status === "resolved")
        .length,
      avg_resolution_time_minutes: avgResolutionTime,
      incidents_by_type: byType,
      incidents_by_severity: bySeverity,
    };
  }
}

// Global instance
export const alertSystem = AlertSystem.getInstance();
