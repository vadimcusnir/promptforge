/**
 * Observability System Index
 * Centralized exports and initialization for the observability infrastructure
 */

import { agentWatch, AgentWatchWorker } from "./agent-watch";
import { auditLogger, AuditLogger } from "./audit-logger";
import { alertSystem, AlertSystem } from "./alert-system";

export { agentWatch, AgentWatchWorker } from "./agent-watch";
export { auditLogger, AuditLogger } from "./audit-logger";
export { alertSystem, AlertSystem } from "./alert-system";

export type {
  AgentMetrics,
  AnomalyThresholds,
  AnomalyAlert,
} from "./agent-watch";

export type { AuditLogEntry, AuditLogFilter } from "./audit-logger";

export type { AlertChannel, AlertRule, IncidentReport } from "./alert-system";

/**
 * Initialize the complete observability system
 */
export function initializeObservability(): void {
  console.log("[Observability] Initializing system...");

  // Start AgentWatch monitoring
  agentWatch.startMonitoring(30000); // 30 second intervals

  // Initialize alert system
  alertSystem.initialize();

  console.log("[Observability] System initialized successfully");
}

/**
 * Shutdown the observability system
 */
export function shutdownObservability(): void {
  console.log("[Observability] Shutting down system...");

  // Stop monitoring
  agentWatch.stopMonitoring();

  console.log("[Observability] System shutdown complete");
}

/**
 * Get comprehensive system status
 */
export function getSystemStatus(): {
  agent_watch: {
    monitoring: boolean;
    metrics_summary: ReturnType<typeof agentWatch.getMetricsSummary>;
  };
  audit_logger: {
    statistics: ReturnType<typeof auditLogger.getStatistics>;
    recent_trend: ReturnType<typeof auditLogger.getLogsTrend>;
  };
  alert_system: {
    statistics: ReturnType<typeof alertSystem.getAlertStatistics>;
    active_incidents: ReturnType<typeof alertSystem.getActiveIncidents>;
  };
  kill_switch: {
    agents_enabled: boolean;
    degradation_mode: boolean;
  };
} {
  return {
    agent_watch: {
      monitoring: true, // Would track actual monitoring state
      metrics_summary: agentWatch.getMetricsSummary(),
    },
    audit_logger: {
      statistics: auditLogger.getStatistics(),
      recent_trend: auditLogger.getLogsTrend(24),
    },
    alert_system: {
      statistics: alertSystem.getAlertStatistics(),
      active_incidents: alertSystem.getActiveIncidents(),
    },
    kill_switch: {
      agents_enabled: AgentWatchWorker.areAgentsEnabled(),
      degradation_mode: agentWatch.getMetricsSummary().degradationMode,
    },
  };
}
