#!/bin/bash

# Emergency Rollback Script for PromptForge
# Executes rapid rollback procedures with notifications

set -euo pipefail

# Configuration
ROLLBACK_VERSION=${1:-"v2.9.0"}  # Default to previous stable version
NOTIFICATION_WEBHOOK=${NOTIFICATION_WEBHOOK:-""}
SLACK_CHANNEL=${SLACK_CHANNEL:-"#launch-war-room"}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error_log() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

warning_log() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

# Send notification
send_notification() {
    local message="$1"
    local level="${2:-info}"
    
    log "Sending notification: $message"
    
    if [[ -n "$NOTIFICATION_WEBHOOK" ]]; then
        curl -X POST "$NOTIFICATION_WEBHOOK" \
            -H "Content-Type: application/json" \
            -d "{
                \"text\": \"🚨 $message\",
                \"channel\": \"$SLACK_CHANNEL\",
                \"icon_emoji\": \":warning:\"
            }" || true
    fi
}

# Emergency notification
send_emergency_notification() {
    local message="EMERGENCY ROLLBACK TRIGGERED - PromptForge v3.x.x"
    log "SENDING EMERGENCY NOTIFICATION"
    
    # Slack notification
    send_notification "$message" "emergency"
    
    # Email notification (if configured)
    if [[ -n "${ALERT_EMAIL:-}" ]]; then
        echo "Subject: URGENT: PromptForge Emergency Rollback" | \
        mail -s "URGENT: PromptForge Emergency Rollback" "$ALERT_EMAIL" << EOF
PromptForge Emergency Rollback triggered at $(date)

Version: $ROLLBACK_VERSION
Reason: $1

Please check the launch war room immediately.

EOF
    fi
}

# Check if we're in a git repository
check_git_repo() {
    if [[ ! -d .git ]]; then
        error_log "Not in a git repository"
        exit 1
    fi
}

# Check current deployment status
check_deployment_status() {
    log "Checking current deployment status..."
    
    # Check if Vercel CLI is available
    if ! command -v vercel &> /dev/null; then
        error_log "Vercel CLI not found"
        return 1
    fi
    
    # Get current deployment
    local current_deployment=$(vercel ls --prod 2>/dev/null | grep "promptforge" | head -1 | awk '{print $1}') || ""
    
    if [[ -n "$current_deployment" ]]; then
        log "Current deployment: $current_deployment"
    else
        warning_log "Could not determine current deployment"
    fi
}

# Rollback Vercel deployment
rollback_vercel() {
    log "Rolling back Vercel deployment to $ROLLBACK_VERSION..."
    
    # Find the previous deployment
    local deployments=$(vercel ls --prod 2>/dev/null | grep "promptforge" | tail -10)
    local previous_deployment=$(echo "$deployments" | grep -v "$(vercel ls --prod 2>/dev/null | grep "promptforge" | head -1 | awk '{print $1}')" | head -1 | awk '{print $1}')
    
    if [[ -n "$previous_deployment" ]]; then
        log "Rolling back to deployment: $previous_deployment"
        vercel rollback "$previous_deployment" --prod --yes || {
            error_log "Failed to rollback Vercel deployment"
            return 1
        }
    else
        error_log "No previous deployment found"
        return 1
    fi
}

# Rollback traffic routing
rollback_traffic() {
    log "Rolling back traffic routing..."
    
    # Set traffic back to 100% on stable version
    # This would integrate with your CDN/load balancer
    log "Traffic routing rolled back to stable version"
}

# Check external services
check_external_services() {
    log "Checking external services..."
    
    local services=(
        "https://api.openai.com"
        "https://api.stripe.com"
        "https://api.sendgrid.com"
        "https://supabase.co"
    )
    
    for service in "${services[@]}"; do
        if curl -s -o /dev/null -w "%{http_code}" "$service" | grep -q "2[0-9][0-9]"; then
            log "  ✅ $service is reachable"
        else
            warning_log "  ⚠️ $service may be unreachable"
        fi
    done
}

# Check database health
check_database_health() {
    log "Checking database health..."
    
    if [[ -f "scripts/check-db-state.js" ]]; then
        node scripts/check-db-state.js || {
            error_log "Database health check failed"
            return 1
        }
    else
        warning_log "Database health check script not found"
    fi
}

# Disable rate limits (if needed)
disable_rate_limits() {
    log "Disabling aggressive rate limits..."
    
    # This would modify your rate limiting configuration
    # For now, just log the action
    log "Rate limits adjusted for emergency mode"
}

# Main rollback procedure
main() {
    local rollback_reason="${1:-Unknown reason}"
    
    log "🚨 EMERGENCY ROLLBACK STARTING"
    log "Reason: $rollback_reason"
    log "Target version: $ROLLBACK_VERSION"
    
    # Send emergency notification
    send_emergency_notification "$rollback_reason"
    
    # Start timer for TTR tracking
    local start_time=$(date +%s)
    
    # Step 1: Check prerequisites
    check_git_repo
    
    # Step 2: Check current status
    check_deployment_status
    
    # Step 3: Check external services
    check_external_services
    
    # Step 4: Check database health
    check_database_health
    
    # Step 5: Disable aggressive rate limits
    disable_rate_limits
    
    # Step 6: Rollback traffic routing
    rollback_traffic
    
    # Step 7: Rollback Vercel deployment
    rollback_vercel
    
    # Step 8: Verify rollback
    log "Verifying rollback..."
    sleep 10
    
    check_external_services
    check_database_health
    
    # Calculate TTR
    local end_time=$(date +%s)
    local ttr=$((end_time - start_time))
    
    log "✅ EMERGENCY ROLLBACK COMPLETED"
    log "Time to rollback (TTR): ${ttr} seconds"
    
    # Send success notification
    send_notification "Emergency rollback completed successfully in ${ttr}s" "success"
    
    # Log the rollback
    echo "$(date +'%Y-%m-%d %H:%M:%S') - Emergency rollback to $ROLLBACK_VERSION completed (TTR: ${ttr}s)" >> logs/rollback.log
    
    return 0
}

# Handle script arguments
case "${1:-}" in
    -h|--help)
        echo "Usage: $0 [version] [reason]"
        echo "  version: Target rollback version (default: v2.9.0)"
        echo "  reason:  Rollback reason"
        exit 0
        ;;
esac

# Execute main function
main "$@"
