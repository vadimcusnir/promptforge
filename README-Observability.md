# PromptForge Observability & Kill-Switch System

Complete implementation of the observability and kill-switch requirements from the SACF (Security & Agent Control Framework).

## Overview

This system provides comprehensive monitoring, anomaly detection, and incident response for agent operations:

- **AgentWatch**: Real-time monitoring of tokens, costs, timeouts, error rates, and scores
- **AuditLogger**: PII-free logging with content hashing for compliance
- **AlertSystem**: Incident management with multi-channel notifications
- **Kill-Switch**: Emergency agent disabling via environment variables and SSOT rules

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   AgentWatch    │───▶│   AlertSystem    │───▶│  Notifications  │
│   (Monitor)     │    │   (Incidents)    │    │  (Slack/Email)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                       │
         ▼                        ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   AuditLogger   │    │   Kill-Switch    │    │   Dashboard     │
│   (PII-free)    │    │   (SSOT/ENV)     │    │   (Monitoring)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Components

### 1. AgentWatch Worker (`lib/observability/agent-watch.ts`)

Monitors agent performance and detects anomalies:

```typescript
import { agentWatch } from '@/lib/observability';

// Record metrics for a run
agentWatch.recordMetrics({
  runId: 'run_123',
  orgId: 'org_456',
  moduleId: 'PROMPTFORGE.SOPFORGE',
  tokens: 8500,
  cost: 1.25,
  duration: 45000,
  score: 85,
  errorRate: 0,
  timeouts: 0,
  timestamp: new Date(),
});

// Check system status
const summary = agentWatch.getMetricsSummary();
console.log(`Error rate: ${summary.errorRate}%`);
console.log(`Degradation mode: ${summary.degradationMode}`);
```

**Thresholds (from SSOT):**

- Max tokens: 12,000
- Max cost: $1.50 per run
- Min score: 80
- Max error rate: 5%
- Max timeouts: 3 per run

### 2. Audit Logger (`lib/observability/audit-logger.ts`)

PII-free logging with content hashing:

```typescript
import { auditLogger } from '@/lib/observability';

// Log a run (content is hashed, not stored)
auditLogger.logRun({
  run_id: 'run_123',
  org_id: 'org_456',
  module_id: 'PROMPTFORGE.SOPFORGE',
  signature_7d: 'fintech_enterprise_urgent_complex_full_saas_json',
  model: 'gpt-4o',
  tokens: 8500,
  cost: 1.25,
  score: 85,
  export_formats: ['txt', 'json', 'pdf'],
  prompt_content: '...', // Hashed, not stored
  duration_ms: 45000,
});

// Query logs
const recentLogs = auditLogger.queryLogs({
  org_id: 'org_456',
  limit: 10,
});

// Get statistics
const stats = auditLogger.getStatistics();
console.log(`Pass rate: ${stats.pass_rate}%`);
```

### 3. Alert System (`lib/observability/alert-system.ts`)

Incident management with notifications:

```typescript
import { alertSystem } from '@/lib/observability';

// Initialize with channels
alertSystem.initialize();

// Incidents are created automatically from AgentWatch alerts
const activeIncidents = alertSystem.getActiveIncidents();

// Acknowledge incident
alertSystem.acknowledgeIncident('incident_123', 'admin_user');

// Resolve incident
alertSystem.resolveIncident('incident_123', 'admin_user', 'Fixed configuration');
```

**Alert Channels:**

- Console logging (always enabled)
- Slack webhooks (if `SLACK_WEBHOOK_URL` set)
- Email notifications (if SMTP configured)
- Custom webhooks

### 4. Kill-Switch System

Multi-layer kill-switch via environment and SSOT:

```typescript
import { AgentWatchWorker } from '@/lib/observability';

// Check if agents are enabled
const enabled = AgentWatchWorker.areAgentsEnabled();

// Manual kill-switch activation
agentWatch.triggerKillSwitch('Emergency maintenance required');

// Environment variable kill-switch
process.env.AGENTS_ENABLED = 'false'; // Disables all agents
```

**Kill-switch triggers:**

- Environment: `AGENTS_ENABLED=false`
- SSOT: `security.agents_enabled: false` in `cursor/ruleset.yml`
- Automatic: High error rates, budget violations, timeout spikes
- Manual: Emergency situations

## API Endpoints

### System Status

```bash
GET /api/observability/status
Authorization: Bearer <token>

# Response
{
  "status": "ok",
  "agent_watch": {
    "monitoring": true,
    "metrics_summary": { ... }
  },
  "audit_logger": {
    "statistics": { ... },
    "recent_trend": [ ... ]
  },
  "alert_system": {
    "statistics": { ... },
    "active_incidents": [ ... ]
  },
  "kill_switch": {
    "agents_enabled": true,
    "degradation_mode": false
  }
}
```

### Audit Logs

```bash
GET /api/observability/audit?org_id=org_456&limit=50
POST /api/observability/audit
{
  "run_id": "run_123",
  "org_id": "org_456",
  "module_id": "PROMPTFORGE.SOPFORGE",
  "signature_7d": "...",
  "model": "gpt-4o",
  "tokens": 8500,
  "cost": 1.25,
  "export_formats": ["txt", "json"],
  "duration_ms": 45000
}
```

### Incident Management

```bash
GET /api/observability/incidents?status=active
POST /api/observability/incidents
{
  "action": "acknowledge",
  "incident_id": "incident_123",
  "user_id": "admin_user"
}
```

## Monitoring Dashboard

React component for real-time monitoring:

```typescript
import { MonitoringDashboard } from "@/components/observability/monitoring-dashboard"

function AdminPage() {
  return (
    <div>
      <h1>System Monitoring</h1>
      <MonitoringDashboard />
    </div>
  )
}
```

**Dashboard Features:**

- Real-time metrics and alerts
- Agent status and kill-switch controls
- Audit log browser with filtering
- Incident management interface
- Performance trends and statistics

## Integration Example

```typescript
import { initializeObservability, agentWatch, auditLogger } from '@/lib/observability';

// Initialize on app startup
initializeObservability();

// Monitor an agent run
async function runAgent(params) {
  const startTime = Date.now();
  let result;

  try {
    result = await executeAgent(params);

    // Record successful metrics
    agentWatch.recordMetrics({
      runId: params.runId,
      orgId: params.orgId,
      moduleId: params.moduleId,
      tokens: result.tokens,
      cost: result.cost,
      duration: Date.now() - startTime,
      score: result.score,
      errorRate: 0,
      timeouts: 0,
      timestamp: new Date(),
    });
  } catch (error) {
    // Record error metrics
    agentWatch.recordMetrics({
      runId: params.runId,
      orgId: params.orgId,
      moduleId: params.moduleId,
      tokens: 0,
      cost: 0,
      duration: Date.now() - startTime,
      errorRate: 1,
      timeouts: 0,
      timestamp: new Date(),
    });
  } finally {
    // Always audit log (PII-free)
    auditLogger.logRun({
      run_id: params.runId,
      org_id: params.orgId,
      module_id: params.moduleId,
      signature_7d: params.signature7d,
      model: params.model,
      tokens: result?.tokens || 0,
      cost: result?.cost || 0,
      score: result?.score,
      export_formats: ['txt', 'json'],
      prompt_content: params.prompt, // Hashed, not stored
      duration_ms: Date.now() - startTime,
      error_code: error?.message,
    });
  }

  return result;
}
```

## Environment Variables

```bash
# Kill-switch control
AGENTS_ENABLED=true

# Alert channels
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=alerts@promptforge.app
SMTP_PASSWORD=...

# Monitoring
MONITORING_INTERVAL_MS=30000
ALERT_COOLDOWN_MINUTES=15
```

## SSOT Configuration

The system reads thresholds from `cursor/ruleset.yml`:

```yaml
security:
  agents_enabled: true
  budgets:
    tokens_max: 12000
    requests_per_min: 60
    cost_usd_max_run: 1.5
  sandbox:
    timeout_ms: 20000
```

## Anomaly Detection Rules

1. **Budget Exceeded**: Cost > $1.50 OR tokens > 12,000
2. **Score Low**: Score < 80 (triggers degradation if persistent)
3. **Error Spike**: Error rate > 5% over 5-minute window
4. **Timeout Spike**: > 3 timeouts per run

## Response Actions

- **Warning**: Log alert, send notifications
- **Critical**: Enable degradation mode (simulation only)
- **Emergency**: Trigger kill-switch (disable all agents)

## Degradation Mode

When anomalies are detected:

- Live testing disabled (`/api/gpt-test` returns 503)
- Only simulation mode allowed
- Flag stored in SSOT: `degrade_to_simulation: true`
- Automatic recovery when metrics improve

## Compliance Features

- **PII-Free**: Raw prompts/inputs hashed, not stored
- **Audit Trail**: All runs logged with metadata
- **Content Integrity**: SHA-256 hashing for verification
- **Export Controls**: Deterministic bundle generation
- **Retention**: Configurable log retention periods

## Files Created

```
lib/observability/
├── agent-watch.ts          # Monitoring and anomaly detection
├── audit-logger.ts         # PII-free audit logging
├── alert-system.ts         # Incident management
├── index.ts                # Exports and initialization
└── integration-example.ts  # Usage examples

components/observability/
└── monitoring-dashboard.tsx # React monitoring UI

app/api/observability/
├── status/route.ts         # System status API
├── audit/route.ts          # Audit log API
└── incidents/route.ts      # Incident management API

middleware.ts               # Enhanced kill-switch middleware
```

This implementation provides enterprise-grade observability with automatic anomaly detection, PII-free audit logging, and robust kill-switch capabilities as specified in the SACF requirements.
