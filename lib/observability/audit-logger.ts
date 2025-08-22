/**
 * Audit Logger - PII-Free Logging System
 * Logs run summaries without storing raw prompts/inputs
 */

import { createHash } from "crypto";
import { telemetry } from "@/lib/telemetry";

export interface AuditLogEntry {
  run_id: string;
  org_id: string;
  module_id: string;
  signature_7d: string;
  model: string;
  tokens: number;
  cost: number;
  verdict: "pass" | "partial_pass" | "fail";
  export_formats: string[];
  content_hash: string;
  timestamp: Date;
  duration_ms: number;
  error_code?: string;
  metadata?: Record<string, any>;
}

export interface AuditLogFilter {
  org_id?: string;
  module_id?: string;
  date_from?: Date;
  date_to?: Date;
  verdict?: "pass" | "partial_pass" | "fail";
  limit?: number;
}

export class AuditLogger {
  private static instance: AuditLogger;
  private logs: AuditLogEntry[] = [];
  private maxLogsInMemory = 10000;

  private constructor() {
    // Initialize with cleanup interval
    setInterval(() => {
      this.cleanupOldLogs();
    }, 3600000); // Clean up every hour
  }

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  /**
   * Log a run without storing PII
   */
  logRun(params: {
    run_id: string;
    org_id: string;
    module_id: string;
    signature_7d: string;
    model: string;
    tokens: number;
    cost: number;
    score?: number;
    export_formats: string[];
    prompt_content?: string;
    input_content?: string;
    output_content?: string;
    duration_ms: number;
    error_code?: string;
    metadata?: Record<string, any>;
  }): void {
    // Determine verdict based on score
    let verdict: "pass" | "partial_pass" | "fail" = "fail";
    if (params.score !== undefined) {
      if (params.score >= 80) verdict = "pass";
      else if (params.score >= 60) verdict = "partial_pass";
    }

    // Hash content without storing raw data
    const content_hash = this.hashContent({
      prompt: params.prompt_content,
      input: params.input_content,
      output: params.output_content,
    });

    const logEntry: AuditLogEntry = {
      run_id: params.run_id,
      org_id: params.org_id,
      module_id: params.module_id,
      signature_7d: params.signature_7d,
      model: params.model,
      tokens: params.tokens,
      cost: params.cost,
      verdict,
      export_formats: params.export_formats,
      content_hash,
      timestamp: new Date(),
      duration_ms: params.duration_ms,
      error_code: params.error_code,
      metadata: this.sanitizeMetadata(params.metadata),
    };

    // Store in memory
    this.logs.push(logEntry);

    // Keep only recent logs in memory
    if (this.logs.length > this.maxLogsInMemory) {
      this.logs = this.logs.slice(-this.maxLogsInMemory);
    }

    // In production, this would be sent to persistent storage
    this.persistLog(logEntry);

    // Track in telemetry
    telemetry.trackEvent("audit_log_created", "system", {
      run_id: params.run_id,
      org_id: params.org_id,
      module_id: params.module_id,
      verdict,
      tokens: params.tokens,
      cost: params.cost,
      duration_ms: params.duration_ms,
    });

    console.log(
      `[AuditLogger] Logged run ${params.run_id}: ${verdict} (${params.tokens} tokens, $${params.cost.toFixed(4)})`,
    );
  }

  /**
   * Hash content without storing raw data
   */
  private hashContent(content: {
    prompt?: string;
    input?: string;
    output?: string;
  }): string {
    const combined = [
      content.prompt || "",
      content.input || "",
      content.output || "",
    ].join("|");

    return createHash("sha256").update(combined, "utf8").digest("hex");
  }

  /**
   * Sanitize metadata to remove PII
   */
  private sanitizeMetadata(
    metadata?: Record<string, any>,
  ): Record<string, any> | undefined {
    if (!metadata) return undefined;

    const sanitized: Record<string, any> = {};

    // Allow only safe metadata fields
    const allowedFields = [
      "version",
      "tier",
      "feature_flags",
      "experiment_id",
      "ab_test_variant",
      "browser",
      "os",
      "device_type",
      "screen_resolution",
      "timezone",
      "request_id",
      "trace_id",
      "parent_span_id",
      "sampling_rate",
    ];

    for (const [key, value] of Object.entries(metadata)) {
      if (allowedFields.includes(key)) {
        // Still sanitize the value to ensure no PII
        if (typeof value === "string" && value.length > 200) {
          sanitized[key] = `${value.substring(0, 200)}...`; // Truncate long strings
        } else if (typeof value === "object") {
          sanitized[key] = "[object]"; // Don't store complex objects
        } else {
          sanitized[key] = value;
        }
      }
    }

    return Object.keys(sanitized).length > 0 ? sanitized : undefined;
  }

  /**
   * Persist log entry (in production, this would go to database)
   */
  private async persistLog(entry: AuditLogEntry): Promise<void> {
    try {
      // In production, this would be:
      // await supabase.from('audit_logs').insert(entry)

      // For now, we'll just simulate persistence
      console.log(`[AuditLogger] Persisting log entry: ${entry.run_id}`);

      // Could also send to external logging service
      // await this.sendToExternalLogger(entry)
    } catch (error) {
      console.error("[AuditLogger] Failed to persist log entry:", error);

      // Track the failure
      telemetry.trackError(error as Error, "audit_log_persistence");
    }
  }

  /**
   * Query audit logs with filters
   */
  queryLogs(filter: AuditLogFilter = {}): AuditLogEntry[] {
    let filtered = [...this.logs];

    if (filter.org_id) {
      filtered = filtered.filter((log) => log.org_id === filter.org_id);
    }

    if (filter.module_id) {
      filtered = filtered.filter((log) => log.module_id === filter.module_id);
    }

    if (filter.verdict) {
      filtered = filtered.filter((log) => log.verdict === filter.verdict);
    }

    if (filter.date_from) {
      filtered = filtered.filter((log) => log.timestamp >= filter.date_from!);
    }

    if (filter.date_to) {
      filtered = filtered.filter((log) => log.timestamp <= filter.date_to!);
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Apply limit
    if (filter.limit && filter.limit > 0) {
      filtered = filtered.slice(0, filter.limit);
    }

    return filtered;
  }

  /**
   * Get audit statistics
   */
  getStatistics(filter: AuditLogFilter = {}): {
    total_runs: number;
    pass_rate: number;
    avg_tokens: number;
    avg_cost: number;
    avg_duration_ms: number;
    error_rate: number;
    top_modules: Array<{ module_id: string; count: number }>;
    verdict_distribution: Record<string, number>;
    cost_distribution: {
      p50: number;
      p95: number;
      p99: number;
    };
  } {
    const logs = this.queryLogs(filter);

    if (logs.length === 0) {
      return {
        total_runs: 0,
        pass_rate: 0,
        avg_tokens: 0,
        avg_cost: 0,
        avg_duration_ms: 0,
        error_rate: 0,
        top_modules: [],
        verdict_distribution: {},
        cost_distribution: { p50: 0, p95: 0, p99: 0 },
      };
    }

    // Calculate basic stats
    const total_runs = logs.length;
    const pass_count = logs.filter((log) => log.verdict === "pass").length;
    const pass_rate = (pass_count / total_runs) * 100;

    const avg_tokens =
      logs.reduce((sum, log) => sum + log.tokens, 0) / total_runs;
    const avg_cost = logs.reduce((sum, log) => sum + log.cost, 0) / total_runs;
    const avg_duration_ms =
      logs.reduce((sum, log) => sum + log.duration_ms, 0) / total_runs;

    const error_count = logs.filter((log) => log.error_code).length;
    const error_rate = (error_count / total_runs) * 100;

    // Top modules
    const moduleCount = new Map<string, number>();
    logs.forEach((log) => {
      moduleCount.set(log.module_id, (moduleCount.get(log.module_id) || 0) + 1);
    });
    const top_modules = Array.from(moduleCount.entries())
      .map(([module_id, count]) => ({ module_id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Verdict distribution
    const verdict_distribution: Record<string, number> = {};
    logs.forEach((log) => {
      verdict_distribution[log.verdict] =
        (verdict_distribution[log.verdict] || 0) + 1;
    });

    // Cost distribution percentiles
    const costs = logs.map((log) => log.cost).sort((a, b) => a - b);
    const cost_distribution = {
      p50: this.calculatePercentile(costs, 50),
      p95: this.calculatePercentile(costs, 95),
      p99: this.calculatePercentile(costs, 99),
    };

    return {
      total_runs,
      pass_rate,
      avg_tokens,
      avg_cost,
      avg_duration_ms,
      error_rate,
      top_modules,
      verdict_distribution,
      cost_distribution,
    };
  }

  /**
   * Calculate percentile from sorted array
   */
  private calculatePercentile(
    sortedArray: number[],
    percentile: number,
  ): number {
    if (sortedArray.length === 0) return 0;

    const index = (percentile / 100) * (sortedArray.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);

    if (lower === upper) {
      return sortedArray[lower];
    }

    const weight = index - lower;
    return sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight;
  }

  /**
   * Clean up old logs from memory (keep recent ones)
   */
  private cleanupOldLogs(): void {
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    const beforeCount = this.logs.length;

    this.logs = this.logs.filter((log) => log.timestamp >= cutoffTime);

    const removedCount = beforeCount - this.logs.length;
    if (removedCount > 0) {
      console.log(`[AuditLogger] Cleaned up ${removedCount} old log entries`);
    }
  }

  /**
   * Export logs for analysis (without PII)
   */
  exportLogs(filter: AuditLogFilter = {}): {
    metadata: {
      exported_at: Date;
      total_entries: number;
      filter_applied: AuditLogFilter;
    };
    entries: Array<Omit<AuditLogEntry, "metadata">>;
  } {
    const logs = this.queryLogs(filter);

    return {
      metadata: {
        exported_at: new Date(),
        total_entries: logs.length,
        filter_applied: filter,
      },
      entries: logs.map((log) => {
        // Remove metadata to ensure no PII leakage
        const { metadata, ...sanitizedLog } = log;
        return sanitizedLog;
      }),
    };
  }

  /**
   * Verify content integrity using hash
   */
  verifyContentIntegrity(
    run_id: string,
    prompt_content?: string,
    input_content?: string,
    output_content?: string,
  ): boolean {
    const log = this.logs.find((l) => l.run_id === run_id);
    if (!log) return false;

    const expectedHash = this.hashContent({
      prompt: prompt_content,
      input: input_content,
      output: output_content,
    });

    return log.content_hash === expectedHash;
  }

  /**
   * Get logs count by time period
   */
  getLogsTrend(
    hours = 24,
  ): Array<{ hour: string; count: number; pass_rate: number }> {
    const now = new Date();
    const trend: Array<{ hour: string; count: number; pass_rate: number }> = [];

    for (let i = hours - 1; i >= 0; i--) {
      const hourStart = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000);

      const hourLogs = this.logs.filter(
        (log) => log.timestamp >= hourStart && log.timestamp < hourEnd,
      );

      const passCount = hourLogs.filter((log) => log.verdict === "pass").length;
      const pass_rate =
        hourLogs.length > 0 ? (passCount / hourLogs.length) * 100 : 0;

      trend.push({
        hour: hourStart.toISOString().substring(0, 13) + ":00",
        count: hourLogs.length,
        pass_rate,
      });
    }

    return trend;
  }
}

// Global instance
export const auditLogger = AuditLogger.getInstance();
