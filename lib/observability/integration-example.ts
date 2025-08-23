/**
 * Integration Example - How to use the Observability System
 * This shows how to integrate AgentWatch, AuditLogger, and AlertSystem in your application
 */

import { agentWatch, auditLogger, alertSystem, initializeObservability } from '@/lib/observability';

// Initialize the observability system on app startup
export function setupObservability() {
  console.log('Setting up observability system...');

  // Initialize all components
  initializeObservability();

  // Set up custom alert handlers
  agentWatch.onAlert(alert => {
    console.log(`Custom alert handler: ${alert.type} - ${alert.message}`);

    // Custom business logic for specific alerts
    if (alert.type === 'budget_exceeded' && alert.actual > 2.0) {
      // Emergency action for very high costs
      console.error('EMERGENCY: Cost exceeded $2.00, triggering immediate review');
      // Could send emergency notifications, pause all operations, etc.
    }
  });

  console.log('Observability system setup complete');
}

// Example: Monitoring an agent run
export async function monitoredAgentRun(params: {
  runId: string;
  orgId: string;
  moduleId: string;
  signature7d: string;
  model: string;
  promptContent: string;
  inputContent: string;
}) {
  const startTime = Date.now();
  let tokens = 0;
  let cost = 0;
  let score: number | undefined;
  let errorCode: string | undefined;
  let outputContent = '';

  try {
    console.log(`[Monitor] Starting run ${params.runId}`);

    // Simulate agent execution
    // In real implementation, this would be your actual agent logic
    const result = await simulateAgentExecution(params);

    tokens = result.tokens;
    cost = result.cost;
    score = result.score;
    outputContent = result.output;

    // Record metrics in AgentWatch
    agentWatch.recordMetrics({
      runId: params.runId,
      orgId: params.orgId,
      moduleId: params.moduleId,
      tokens,
      cost,
      duration: Date.now() - startTime,
      score,
      errorRate: 0, // No errors in this run
      timeouts: 0,
      timestamp: new Date(),
    });

    console.log(`[Monitor] Run ${params.runId} completed successfully`);
  } catch (error) {
    errorCode = (error as Error).message;
    console.error(`[Monitor] Run ${params.runId} failed:`, error);

    // Record failed run metrics
    agentWatch.recordMetrics({
      runId: params.runId,
      orgId: params.orgId,
      moduleId: params.moduleId,
      tokens,
      cost,
      duration: Date.now() - startTime,
      score,
      errorRate: 1, // This run had an error
      timeouts: 0,
      timestamp: new Date(),
    });
  } finally {
    // Always log to audit system (PII-free)
    auditLogger.logRun({
      run_id: params.runId,
      org_id: params.orgId,
      module_id: params.moduleId,
      signature_7d: params.signature7d,
      model: params.model,
      tokens,
      cost,
      score,
      export_formats: ['txt', 'json'],
      prompt_content: params.promptContent,
      input_content: params.inputContent,
      output_content: outputContent,
      duration_ms: Date.now() - startTime,
      error_code: errorCode,
    });

    console.log(`[Monitor] Run ${params.runId} logged to audit system`);
  }

  return {
    runId: params.runId,
    success: !errorCode,
    tokens,
    cost,
    score,
    duration: Date.now() - startTime,
  };
}

// Simulate agent execution for example
async function simulateAgentExecution(params: {
  runId: string;
  moduleId: string;
  promptContent: string;
  inputContent: string;
}) {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));

  // Simulate different outcomes based on module
  const isHighCostModule = params.moduleId.includes('ENTERPRISE');
  const baseTokens = Math.floor(Math.random() * 8000) + 2000;
  const tokens = isHighCostModule ? baseTokens * 1.5 : baseTokens;

  const costPerToken = 0.00015; // Approximate GPT-4 cost
  const cost = tokens * costPerToken;

  // Simulate score (higher for certain modules)
  const baseScore = Math.random() * 40 + 60; // 60-100 range
  const score = params.moduleId.includes('PREMIUM') ? Math.min(baseScore + 10, 100) : baseScore;

  // Simulate occasional failures
  if (Math.random() < 0.05) {
    // 5% failure rate
    throw new Error(`Simulated failure in ${params.moduleId}`);
  }

  return {
    tokens: Math.floor(tokens),
    cost: Number(cost.toFixed(4)),
    score: Math.floor(score),
    output: `Generated output for ${params.moduleId} (${tokens} tokens)`,
  };
}

// Example: Manual kill-switch activation
export function emergencyKillSwitch(reason: string) {
  console.error(`[EMERGENCY] Activating kill-switch: ${reason}`);

  agentWatch.triggerKillSwitch(reason);

  // Additional emergency actions
  // - Notify all administrators
  // - Stop all queued operations
  // - Save current state
  // - etc.
}

// Example: Health check endpoint logic
export function getHealthStatus() {
  const agentSummary = agentWatch.getMetricsSummary();
  const auditStats = auditLogger.getStatistics({ limit: 100 });
  const alertStats = alertSystem.getAlertStatistics();

  const isHealthy =
    agentSummary.errorRate < 0.1 && // Less than 10% error rate
    auditStats.pass_rate > 80 && // At least 80% pass rate
    alertStats.active_incidents === 0; // No active incidents

  return {
    status: isHealthy ? 'healthy' : 'degraded',
    agents_enabled: AgentWatchWorker.areAgentsEnabled(),
    degradation_mode: agentSummary.degradationMode,
    metrics: {
      error_rate: agentSummary.errorRate,
      pass_rate: auditStats.pass_rate,
      active_incidents: alertStats.active_incidents,
      total_runs: agentSummary.totalRuns,
    },
    timestamp: new Date().toISOString(),
  };
}

// Example: Scheduled monitoring job
export function scheduleMonitoringJobs() {
  // Check system health every 5 minutes
  setInterval(
    () => {
      const health = getHealthStatus();
      console.log(`[Monitor] System health check: ${health.status}`);

      if (health.status === 'degraded') {
        console.warn('[Monitor] System degraded, investigating...');
        // Could trigger additional diagnostics
      }
    },
    5 * 60 * 1000
  );

  // Generate daily reports
  setInterval(
    () => {
      const stats = auditLogger.getStatistics();
      console.log(
        `[Monitor] Daily report: ${stats.total_runs} runs, ${stats.pass_rate.toFixed(1)}% pass rate`
      );
    },
    24 * 60 * 60 * 1000
  );

  console.log('[Monitor] Scheduled jobs started');
}

// Example: API middleware integration
export function createObservabilityMiddleware() {
  return async (req: any, res: any, next: any) => {
    const startTime = Date.now();
    const runId = req.headers['x-run-id'];
    const orgId = req.headers['x-org-id'];

    // Check kill-switch
    if (!AgentWatchWorker.areAgentsEnabled()) {
      return res.status(503).json({
        error: 'AGENTS_DISABLED',
        message: 'Agent execution disabled by kill-switch',
      });
    }

    // Check degradation mode for live testing
    if (req.path.includes('/gpt-test')) {
      const summary = agentWatch.getMetricsSummary();
      if (summary.degradationMode) {
        return res.status(503).json({
          error: 'DEGRADATION_MODE',
          message: 'Live testing disabled in degradation mode',
        });
      }
    }

    // Continue with request
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const hasError = res.statusCode >= 400;

      // Record basic metrics if we have run context
      if (runId && orgId) {
        agentWatch.recordMetrics({
          runId,
          orgId,
          moduleId: req.path,
          tokens: 0, // Would be filled by actual handler
          cost: 0, // Would be filled by actual handler
          duration,
          errorRate: hasError ? 1 : 0,
          timeouts: res.statusCode === 504 ? 1 : 0,
          timestamp: new Date(),
        });
      }
    });

    next();
  };
}

// Export all examples
export const ObservabilityExamples = {
  setupObservability,
  monitoredAgentRun,
  emergencyKillSwitch,
  getHealthStatus,
  scheduleMonitoringJobs,
  createObservabilityMiddleware,
};
