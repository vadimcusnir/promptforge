#!/bin/bash

# PromptForge v3 - Backup Cron Setup Script
# Sets up automated daily database backups

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_SCRIPT="$SCRIPT_DIR/supabase-backup.js"

echo "🔧 Setting up automated backup cron job for PromptForge v3..."

# Check if backup script exists
if [ ! -f "$BACKUP_SCRIPT" ]; then
    echo "❌ Backup script not found: $BACKUP_SCRIPT"
    exit 1
fi

# Make backup script executable
chmod +x "$BACKUP_SCRIPT"

# Create backup directory if it doesn't exist
BACKUP_DIR="$PROJECT_DIR/backups"
mkdir -p "$BACKUP_DIR"

# Create log file
touch "$BACKUP_DIR/backup.log"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "supabase-backup.js"; then
    echo "⚠️  Backup cron job already exists"
    crontab -l | grep "supabase-backup.js"
else
    # Add cron job for daily backup at 2 AM
    echo "📅 Adding daily backup cron job (2 AM daily)..."
    
    # Create temporary crontab file
    TEMP_CRON=$(mktemp)
    
    # Export current crontab
    crontab -l 2>/dev/null > "$TEMP_CRON" || true
    
    # Add backup job
    echo "# PromptForge v3 - Daily database backup" >> "$TEMP_CRON"
    echo "0 2 * * * cd $PROJECT_DIR && node scripts/supabase-backup.js backup >> $BACKUP_DIR/backup.log 2>&1" >> "$TEMP_CRON"
    
    # Install new crontab
    crontab "$TEMP_CRON"
    
    # Clean up
    rm "$TEMP_CRON"
    
    echo "✅ Daily backup cron job added successfully"
fi

# Add cleanup job (weekly on Sundays at 3 AM)
if crontab -l 2>/dev/null | grep -q "cleanup"; then
    echo "⚠️  Cleanup cron job already exists"
else
    echo "📅 Adding weekly cleanup cron job (3 AM Sundays)..."
    
    TEMP_CRON=$(mktemp)
    crontab -l 2>/dev/null > "$TEMP_CRON" || true
    
    echo "# PromptForge v3 - Weekly backup cleanup" >> "$TEMP_CRON"
    echo "0 3 * * 0 cd $PROJECT_DIR && node scripts/supabase-backup.js cleanup >> $BACKUP_DIR/backup.log 2>&1" >> "$TEMP_CRON"
    
    crontab "$TEMP_CRON"
    rm "$TEMP_CRON"
    
    echo "✅ Weekly cleanup cron job added successfully"
fi

echo ""
echo "📋 Current cron jobs:"
crontab -l | grep -E "(supabase-backup|cleanup)" || echo "No backup jobs found"

echo ""
echo "🔍 To test the backup system:"
echo "   node scripts/supabase-backup.js backup"
echo "   node scripts/supabase-backup.js list"
echo "   node scripts/supabase-backup.js verify <backup-file>"

echo ""
echo "📁 Backup directory: $BACKUP_DIR"
echo "📝 Log file: $BACKUP_DIR/backup.log"

echo ""
echo "✅ Backup cron setup completed successfully!"
