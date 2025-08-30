# PromptForge Launch On-Call Runbook

## Overview
This runbook provides procedures for handling incidents during the PromptForge v3.x.x launch and maintaining operational stability.

## Severity Levels

### SEV-1 (Critical)
- **Definition**: Service completely unavailable, data loss, security breach
- **Response Time**: Immediate (< 5 minutes)
- **On-Call**: Primary + Secondary + Engineering Lead
- **Actions**: Immediate rollback, emergency notifications

### SEV-2 (High)
- **Definition**: Major functionality broken, high error rates (>10%), performance degradation
- **Response Time**: 15 minutes
- **On-Call**: Primary + Secondary
- **Actions**: Investigate, consider rollback, escalate if needed

### SEV-3 (Medium)
- **Definition**: Minor functionality issues, increased latency, non-critical features affected
- **Response Time**: 1 hour
- **On-Call**: Primary
- **Actions**: Monitor, investigate, implement fixes

## Incident Response Procedures

### 1. Initial Response (All SEVs)

```bash
# 1. Acknowledge the incident
echo "$(date) - SEV-$LEVEL incident acknowledged by $(whoami)" >> logs/incidents.log

# 2. Check current deployment status
node scripts/check-db-state.js
vercel ls --prod

# 3. Check monitoring dashboards
# - Sentry: https://sentry.io/promptforge
# - Vercel Analytics: https://vercel.com/analytics
# - Database: Supabase Dashboard

# 4. Assess traffic and error patterns
curl -s https://api.chatgpt-prompting.com/health | jq .
```

### 2. SEV-1 Response (Critical)

```bash
# IMMEDIATE ACTIONS (0-5 minutes)

# 1. Trigger emergency rollback
bash scripts/emergency-rollback.sh "SEV-1: Service unavailable"

# 2. Send emergency notifications
curl -X POST $SLACK_WEBHOOK -H "Content-Type: application/json" -d '{
  "text": "🚨 SEV-1 INCIDENT: PromptForge service unavailable",
  "channel": "#launch-war-room",
  "attachments": [{
    "color": "danger",
    "fields": [
      {"title": "Severity", "value": "SEV-1", "short": true},
      {"title": "Status", "value": "Emergency rollback initiated", "short": true}
    ]
  }]
}'

# 3. Check rollback success
sleep 30
curl -s https://api.chatgpt-prompting.com/health | jq .

# 4. Verify external services
curl -s https://api.openai.com/v1/models
curl -s https://api.stripe.com/v1/account
```

### 3. SEV-2 Response (High)

```bash
# INVESTIGATION PHASE (15-45 minutes)

# 1. Check error rates and patterns
node scripts/api-smoke-tests.js --detailed

# 2. Check system resources
# - CPU, Memory, Disk usage
# - Database connection pools
# - Rate limiting status

# 3. Check recent deployments
vercel ls --prod | head -10

# 4. Analyze logs
tail -100 logs/application.log | grep ERROR

# 5. Check if rollback is needed
if [ $(curl -s https://api.chatgpt-prompting.com/health | jq -r '.error_rate') -gt 0.1 ]; then
  echo "Error rate > 10%, considering rollback"
  bash scripts/emergency-rollback.sh "SEV-2: High error rate"
fi
```

### 4. SEV-3 Response (Medium)

```bash
# MONITORING PHASE (1-4 hours)

# 1. Monitor metrics for 1 hour
for i in {1..60}; do
  echo "$(date) - Check $i/60"
  curl -s https://api.chatgpt-prompting.com/health | jq .
  sleep 60
done

# 2. Check for patterns
# - Time-based issues
# - User-specific problems
# - Feature-specific failures

# 3. Implement gradual fixes
# - Adjust rate limits if needed
# - Restart specific services
# - Clear caches
```

## Rollback Procedures

### Emergency Rollback (TTR ≤ 2 minutes)

```bash
# 1. Execute rollback script
bash scripts/emergency-rollback.sh "Emergency rollback triggered"

# 2. Verify rollback success
sleep 10
curl -s https://api.chatgpt-prompting.com/health | jq .

# 3. Check traffic routing
# Verify traffic is routed to stable version

# 4. Monitor post-rollback
# Watch metrics for 15 minutes to ensure stability
```

### Gradual Rollback

```bash
# 1. Reduce canary traffic
node scripts/launch-control.js --traffic 25

# 2. Monitor for 30 minutes
# 3. If stable, reduce further
node scripts/launch-control.js --traffic 5

# 4. If issues persist, full rollback
bash scripts/emergency-rollback.sh "Gradual rollback failed"
```

## Communication Procedures

### Internal Communication

```bash
# 1. Update incident status
echo "$(date) - Status: $STATUS - $DESCRIPTION" >> logs/incidents.log

# 2. Notify team
curl -X POST $SLACK_WEBHOOK -H "Content-Type: application/json" -d '{
  "text": "📢 Incident Update: $STATUS",
  "channel": "#launch-war-room"
}'

# 3. Update status page (if available)
curl -X PATCH https://api.statuspage.io/v1/pages/$PAGE_ID/incidents/$INCIDENT_ID \
  -H "Authorization: OAuth $STATUSPAGE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"incident": {"status": "$STATUS", "body": "$DESCRIPTION"}}'
```

### External Communication

```bash
# 1. Update status page
# 2. Send email to enterprise customers (if SEV-1/2)
# 3. Post on social media (if major outage)
```

## Post-Incident Procedures

### Post-Mortem Template

```markdown
# Incident Post-Mortem: [DATE]

## Incident Summary
- **Date**: [DATE]
- **Duration**: [DURATION]
- **Severity**: SEV-[LEVEL]
- **Impact**: [DESCRIPTION]

## Timeline
- [TIME] - Incident detected
- [TIME] - Response initiated
- [TIME] - Resolution implemented
- [TIME] - Service restored

## Root Cause
[DESCRIPTION]

## Actions Taken
1. [ACTION 1]
2. [ACTION 2]
3. [ACTION 3]

## Lessons Learned
- [LESSON 1]
- [LESSON 2]
- [LESSON 3]

## Action Items
- [ ] [ITEM 1] - [ASSIGNEE] - [DUE DATE]
- [ ] [ITEM 2] - [ASSIGNEE] - [DUE DATE]
- [ ] [ITEM 3] - [ASSIGNEE] - [DUE DATE]
```

## Monitoring and Alerting

### Key Metrics to Monitor

```bash
# 1. Error Rate
curl -s https://api.chatgpt-prompting.com/health | jq -r '.error_rate'

# 2. Response Time
curl -s https://api.chatgpt-prompting.com/health | jq -r '.avg_response_time'

# 3. Throughput
curl -s https://api.chatgpt-prompting.com/health | jq -r '.requests_per_minute'

# 4. Database Health
node scripts/check-db-state.js

# 5. External Services
curl -s https://api.openai.com/v1/models | jq -r '.data[0].id'
```

### Alert Thresholds

```yaml
# SEV-1 Triggers
error_rate > 0.20  # 20% error rate
response_time > 10000  # 10 seconds
service_unavailable: true

# SEV-2 Triggers
error_rate > 0.10  # 10% error rate
response_time > 5000   # 5 seconds
database_connections > 80%

# SEV-3 Triggers
error_rate > 0.05  # 5% error rate
response_time > 3000   # 3 seconds
cpu_usage > 80%
```

## Escalation Matrix

### Primary On-Call (24/7)
- **Name**: [NAME]
- **Phone**: [PHONE]
- **Slack**: @[SLACK_HANDLE]
- **Escalation Time**: 15 minutes

### Secondary On-Call (Backup)
- **Name**: [NAME]
- **Phone**: [PHONE]
- **Slack**: @[SLACK_HANDLE]
- **Escalation Time**: 30 minutes

### Engineering Lead
- **Name**: [NAME]
- **Phone**: [PHONE]
- **Slack**: @[SLACK_HANDLE]
- **Escalation Time**: 1 hour

### CTO/CTO
- **Name**: [NAME]
- **Phone**: [PHONE]
- **Slack**: @[SLACK_HANDLE]
- **Escalation Time**: 2 hours

## Useful Commands

```bash
# Check service health
curl -s https://api.chatgpt-prompting.com/health | jq .

# Run smoke tests
node scripts/api-smoke-tests.js

# Check database state
node scripts/check-db-state.js

# Monitor logs
tail -f logs/application.log | grep ERROR

# Check deployment status
vercel ls --prod

# Execute rollback
bash scripts/emergency-rollback.sh "Manual rollback"

# Send notifications
curl -X POST $SLACK_WEBHOOK -H "Content-Type: application/json" -d '{"text": "Test message"}'
```

## Emergency Contacts

### Slack Channels
- **#launch-war-room** - Primary incident channel
- **#engineering** - General engineering discussion
- **#alerts** - Automated alerts

### External Services
- **Vercel Support**: [URL]
- **Supabase Support**: [URL]
- **OpenAI Support**: [URL]
- **Stripe Support**: [URL]

### Phone Numbers
- **Vercel Emergency**: [NUMBER]
- **Supabase Emergency**: [NUMBER]
- **Engineering Lead**: [NUMBER]
- **CTO**: [NUMBER]
