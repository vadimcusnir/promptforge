#!/bin/bash

# Setup Backup Cron Job for PromptForge
# This script configures automated daily backups

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKUP_SCRIPT="$(pwd)/scripts/supabase-backup.js"
CRON_USER=$(whoami)
CRON_LOG="/var/log/promptforge-backup.log"
BACKUP_DIR="$(pwd)/backups"

echo -e "${BLUE}🔧 PromptForge Backup Cron Setup${NC}"
echo "=================================="

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}❌ This script should not be run as root${NC}"
   echo "Please run as a regular user with sudo privileges"
   exit 1
fi

# Check if backup script exists
if [[ ! -f "$BACKUP_SCRIPT" ]]; then
    echo -e "${RED}❌ Backup script not found: $BACKUP_SCRIPT${NC}"
    exit 1
fi

# Make backup script executable
chmod +x "$BACKUP_SCRIPT"

# Create backup directory
mkdir -p "$BACKUP_DIR"
echo -e "${GREEN}✅ Backup directory created: $BACKUP_DIR${NC}"

# Create log file
sudo touch "$CRON_LOG"
sudo chown "$CRON_USER:$CRON_USER" "$CRON_LOG"
echo -e "${GREEN}✅ Log file created: $CRON_LOG${NC}"

# Test backup script
echo -e "${YELLOW}🧪 Testing backup script...${NC}"
if node "$BACKUP_SCRIPT" --help > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backup script test passed${NC}"
else
    echo -e "${RED}❌ Backup script test failed${NC}"
    exit 1
fi

# Create cron job entry
CRON_JOB="0 2 * * * cd $(pwd) && node $BACKUP_SCRIPT backup >> $CRON_LOG 2>&1"

echo -e "${YELLOW}📅 Creating cron job for daily backup at 2:00 AM...${NC}"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "supabase-backup.js backup"; then
    echo -e "${YELLOW}⚠️  Cron job already exists, updating...${NC}"
    # Remove existing job
    crontab -l 2>/dev/null | grep -v "supabase-backup.js backup" | crontab -
fi

# Add new cron job
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo -e "${GREEN}✅ Cron job created successfully${NC}"

# Verify cron job was added
if crontab -l 2>/dev/null | grep -q "supabase-backup.js backup"; then
    echo -e "${GREEN}✅ Cron job verified in crontab${NC}"
else
    echo -e "${RED}❌ Failed to add cron job${NC}"
    exit 1
fi

# Create backup monitoring script
MONITOR_SCRIPT="$(pwd)/scripts/monitor-backups.js"
cat > "$MONITOR_SCRIPT" << 'EOF'
#!/usr/bin/env node

/**
 * Backup Monitoring Script
 * Monitors backup health and sends alerts if needed
 */

const fs = require('fs');
const path = require('path');

const BACKUP_DIR = './backups';
const ALERT_THRESHOLD_HOURS = 26; // Alert if no backup in 26+ hours

function checkBackupHealth() {
    if (!fs.existsSync(BACKUP_DIR)) {
        console.error('❌ Backup directory not found');
        return false;
    }

    const files = fs.readdirSync(BACKUP_DIR)
        .filter(file => file.endsWith('.sql'))
        .map(file => {
            const filePath = path.join(BACKUP_DIR, file);
            const stats = fs.statSync(filePath);
            return { name: file, stats };
        })
        .sort((a, b) => b.stats.mtime - a.stats.mtime);

    if (files.length === 0) {
        console.error('❌ No backups found');
        return false;
    }

    const latestBackup = files[0];
    const hoursSinceBackup = (Date.now() - latestBackup.stats.mtime.getTime()) / (1000 * 60 * 60);

    console.log(`📊 Latest backup: ${latestBackup.name}`);
    console.log(`⏰ Age: ${hoursSinceBackup.toFixed(1)} hours`);

    if (hoursSinceBackup > ALERT_THRESHOLD_HOURS) {
        console.error(`🚨 ALERT: Backup is ${hoursSinceBackup.toFixed(1)} hours old!`);
        return false;
    }

    console.log('✅ Backup health check passed');
    return true;
}

if (require.main === module) {
    const isHealthy = checkBackupHealth();
    process.exit(isHealthy ? 0 : 1);
}

module.exports = { checkBackupHealth };
EOF

chmod +x "$MONITOR_SCRIPT"
echo -e "${GREEN}✅ Backup monitoring script created: $MONITOR_SCRIPT${NC}"

# Create weekly backup health check cron job
HEALTH_CHECK_CRON="0 9 * * 1 cd $(pwd) && node $MONITOR_SCRIPT >> $CRON_LOG 2>&1"

# Add health check cron job
(crontab -l 2>/dev/null; echo "$HEALTH_CHECK_CRON") | crontab -

echo -e "${GREEN}✅ Weekly health check cron job added (Mondays at 9:00 AM)${NC}"

# Create backup cleanup cron job (weekly)
CLEANUP_CRON="0 3 * * 0 cd $(pwd) && node $BACKUP_SCRIPT cleanup >> $CRON_LOG 2>&1"

# Add cleanup cron job
(crontab -l 2>/dev/null; echo "$CLEANUP_CRON") | crontab -

echo -e "${GREEN}✅ Weekly cleanup cron job added (Sundays at 3:00 AM)${NC}"

# Display current cron jobs
echo -e "${BLUE}📋 Current cron jobs:${NC}"
crontab -l 2>/dev/null | grep -E "(supabase-backup|monitor-backups)" || echo "No backup cron jobs found"

# Create backup status script
STATUS_SCRIPT="$(pwd)/scripts/backup-status.js"
cat > "$STATUS_SCRIPT" << 'EOF'
#!/usr/bin/env node

/**
 * Backup Status Script
 * Shows current backup status and health
 */

const { listBackups } = require('./supabase-backup.js');
const { checkBackupHealth } = require('./monitor-backups.js');

async function showBackupStatus() {
    console.log('📊 PromptForge Backup Status');
    console.log('============================\n');

    // Check backup health
    console.log('🔍 Health Check:');
    const isHealthy = checkBackupHealth();
    console.log('');

    // List backups
    console.log('📁 Available Backups:');
    const backups = listBackups();
    
    if (backups.length === 0) {
        console.log('   No backups found');
    }

    // Show cron status
    console.log('\n⏰ Cron Jobs:');
    try {
        const { execSync } = require('child_process');
        const cronJobs = execSync('crontab -l 2>/dev/null | grep -E "(supabase-backup|monitor-backups)" || echo "No backup cron jobs found"', { encoding: 'utf8' });
        cronJobs.split('\n').forEach(job => {
            if (job.trim()) {
                console.log(`   ✅ ${job.trim()}`);
            }
        });
    } catch (error) {
        console.log('   ❌ Failed to check cron jobs');
    }

    // Show log file status
    console.log('\n📝 Log Files:');
    const logFile = './backups/backup.log';
    if (fs.existsSync(logFile)) {
        const stats = fs.statSync(logFile);
        const size = (stats.size / 1024).toFixed(2);
        console.log(`   📄 backup.log: ${size} KB (last modified: ${stats.mtime.toLocaleString()})`);
    } else {
        console.log('   📄 backup.log: Not found');
    }
}

if (require.main === module) {
    showBackupStatus();
}
EOF

chmod +x "$STATUS_SCRIPT"
echo -e "${GREEN}✅ Backup status script created: $STATUS_SCRIPT${NC}"

# Create manual backup script
MANUAL_BACKUP_SCRIPT="$(pwd)/scripts/manual-backup.sh"
cat > "$MANUAL_BACKUP_SCRIPT" << 'EOF'
#!/bin/bash

# Manual Backup Script for PromptForge
# Run this script to perform a manual backup

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_SCRIPT="$SCRIPT_DIR/supabase-backup.js"

echo "🔄 Starting manual backup..."
cd "$SCRIPT_DIR/.."

if [[ -f "$BACKUP_SCRIPT" ]]; then
    node "$BACKUP_SCRIPT" backup
else
    echo "❌ Backup script not found: $BACKUP_SCRIPT"
    exit 1
fi
EOF

chmod +x "$MANUAL_BACKUP_SCRIPT"
echo -e "${GREEN}✅ Manual backup script created: $MANUAL_BACKUP_SCRIPT${NC}"

# Create recovery runbook
RUNBOOK_FILE="$(pwd)/BACKUP_RECOVERY_RUNBOOK.md"
cat > "$RUNBOOK_FILE" << 'EOF'
# PromptForge Backup & Recovery Runbook

## Overview
This document provides step-by-step procedures for backup and recovery operations.

## Daily Operations

### Automated Backups
- **Schedule**: Daily at 2:00 AM
- **Script**: `scripts/supabase-backup.js`
- **Location**: `./backups/`
- **Retention**: 30 days, max 100 backups

### Health Monitoring
- **Schedule**: Mondays at 9:00 AM
- **Script**: `scripts/monitor-backups.js`
- **Alert Threshold**: 26+ hours without backup

### Cleanup Operations
- **Schedule**: Sundays at 3:00 AM
- **Script**: `scripts/supabase-backup.js cleanup`
- **Purpose**: Remove old backups beyond retention period

## Manual Operations

### Perform Manual Backup
```bash
# Option 1: Direct script execution
node scripts/supabase-backup.js backup

# Option 2: Using convenience script
./scripts/manual-backup.sh
```

### Check Backup Status
```bash
node scripts/backup-status.js
```

### List Available Backups
```bash
node scripts/supabase-backup.js list
```

### Verify Backup Integrity
```bash
node scripts/supabase-backup.js verify <backup-file>
```

## Recovery Procedures

### Emergency Database Restore
```bash
# 1. Stop the application
pm2 stop promptforge

# 2. Verify backup integrity
node scripts/supabase-backup.js verify <backup-file>

# 3. Perform restore
node scripts/supabase-backup.js restore <backup-file>

# 4. Verify restore
node scripts/supabase-backup.js verify <backup-file>

# 5. Restart application
pm2 start promptforge
```

### Configuration File Recovery
```bash
# Restore specific configuration files
cp backups/config/ruleset-<date>.yml ./ruleset.yml
cp backups/config/modules-<date>.ts ./lib/modules.ts
cp backups/config/version-<date>.txt ./VERSION
```

### Test Restore (Non-Production)
```bash
# Test restore on dummy project
node scripts/supabase-backup.js test-restore
```

## Troubleshooting

### Backup Failures
1. Check log file: `./backups/backup.log`
2. Verify Supabase CLI installation: `supabase --version`
3. Check database connectivity
4. Verify file permissions

### Restore Failures
1. Verify backup file integrity
2. Check database permissions
3. Ensure application is stopped
4. Verify backup file format

### Cron Job Issues
1. Check cron logs: `grep CRON /var/log/syslog`
2. Verify user permissions: `crontab -l`
3. Test manual execution
4. Check file paths in cron jobs

## Monitoring & Alerts

### Backup Health Metrics
- **Frequency**: Daily backups
- **Age Threshold**: 26 hours
- **Size Monitoring**: Track backup file sizes
- **Integrity Checks**: SHA-256 checksums

### Alert Conditions
- No backup in 26+ hours
- Backup file corruption
- Insufficient disk space
- Backup script failures

### Log Analysis
```bash
# View recent backup logs
tail -f ./backups/backup.log

# Search for errors
grep ERROR ./backups/backup.log

# Check backup sizes
ls -lh ./backups/*.sql
```

## Security Considerations

### Access Control
- Backup scripts require appropriate permissions
- Database credentials stored securely
- Backup files protected from unauthorized access

### Encryption
- Database backups may contain sensitive data
- Consider encrypting backup files
- Secure transmission of backup data

### Compliance
- Backup retention aligned with data retention policies
- Audit logging of backup operations
- Regular testing of recovery procedures

## Maintenance

### Regular Tasks
- Weekly health checks
- Monthly restore testing
- Quarterly backup strategy review
- Annual disaster recovery testing

### Performance Optimization
- Monitor backup duration
- Optimize backup schedules
- Compress old backups if needed
- Archive backups to external storage

---

**Last Updated**: $(date)
**Version**: 1.0.0
**Maintainer**: DevOps Team
EOF

echo -e "${GREEN}✅ Recovery runbook created: $RUNBOOK_FILE${NC}"

# Final status
echo ""
echo -e "${GREEN}🎉 Backup cron setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 What was configured:${NC}"
echo "   ✅ Daily backup at 2:00 AM"
echo "   ✅ Weekly health check on Mondays at 9:00 AM"
echo "   ✅ Weekly cleanup on Sundays at 3:00 AM"
echo "   ✅ Backup monitoring script"
echo "   ✅ Backup status script"
echo "   ✅ Manual backup script"
echo "   ✅ Recovery runbook"
echo ""
echo -e "${BLUE}🚀 Next steps:${NC}"
echo "   1. Test manual backup: ./scripts/manual-backup.sh"
echo "   2. Check status: node scripts/backup-status.js"
echo "   3. Review runbook: $RUNBOOK_FILE"
echo "   4. Monitor first automated backup tomorrow at 2:00 AM"
echo ""
echo -e "${YELLOW}⚠️  Important:${NC}"
echo "   - Backups are stored in: $BACKUP_DIR"
echo "   - Logs are written to: $CRON_LOG"
echo "   - Retention: 30 days, max 100 backups"
echo "   - Health alerts if no backup in 26+ hours"
echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
