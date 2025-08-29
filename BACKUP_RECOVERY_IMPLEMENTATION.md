# Backup & Recovery Implementation Guide

This guide explains how to use the PromptForge backup and recovery system for Supabase databases.

## 🏗️ Architecture Overview

The backup system consists of:
- **Backup Storage**: `db/backups/` directory (git-ignored)
- **Backup Script**: `scripts/supabase-backup.js`
- **Metadata Files**: JSON files with backup information
- **Configuration Backups**: Ruleset, modules, and version files

## 📁 Directory Structure

```
db/
├── backups/                    # Backup storage (git-ignored)
│   ├── 20250115_1430-promptforge-v100.sql    # Database backup
│   ├── 20250115_1430-promptforge-v100.json   # Metadata
│   ├── config/                 # Configuration backups
│   │   ├── ruleset-2025-01-15.yml
│   │   ├── modules-2025-01-15.ts
│   │   └── version-2025-01-15.txt
│   └── backup.log             # Backup operation logs
└── seeds.sql                  # Database seeds
```

## 🔧 Configuration

### Environment Variables

Ensure these are set in your `.env.local`:

```bash
# Database connection
DATABASE_URL=postgresql://username:password@host:port/database
SUPABASE_DB_URL=postgresql://username:password@host:port/database

# Supabase project
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### Backup Settings

The script uses these default settings (configurable in `scripts/supabase-backup.js`):

```javascript
const CONFIG = {
  backupDir: './db/backups',        # Backup storage location
  retentionDays: 30,                # Keep backups for 30 days
  maxBackups: 100,                  # Maximum number of backups
  backupPrefix: 'promptforge',      # Backup file prefix
  // ... other settings
};
```

## 🚀 Manual Backup Operations

### 1. Create a Backup

```bash
# Create a new backup
node scripts/supabase-backup.js backup
```

**What happens:**
1. Creates database dump using Supabase CLI or pg_dump
2. Backs up configuration files (ruleset.yml, modules.ts, VERSION)
3. Generates metadata with checksums
4. Cleans up old backups based on retention policy

**Output:**
```
🔄 Starting daily backup...
📊 Creating database backup...
   Using Supabase CLI...
📁 Backing up configuration files...
🔍 Generating backup metadata...
✅ Verifying backup integrity...
✅ Backup completed successfully in 15.23s
📁 Backup saved: ./db/backups/20250115_1430-promptforge-v100.sql
📊 Size: 45.67 MB
```

### 2. List Available Backups

```bash
# List all backups with metadata
node scripts/supabase-backup.js list
```

**Output:**
```
📁 Available Backups:
────────────────────────────────────────────────────────────────────────────────
1. 20250115_1430-promptforge-v100.sql
   Size: 45.67 MB | Date: 1/15/2025, 2:30:00 PM | Age: 0 days
   Version: 1.0.0 | Ruleset: 1.0.0

2. 20250114_1430-promptforge-v100.sql
   Size: 44.89 MB | Date: 1/14/2025, 2:30:00 PM | Age: 1 days
   Version: 1.0.0 | Ruleset: 1.0.0
```

### 3. Verify Backup Integrity

```bash
# Verify a specific backup
node scripts/supabase-backup.js verify 20250115_1430-promptforge-v100.sql
```

**Output:**
```
🔍 Verifying backup: 20250115_1430-promptforge-v100.sql
✅ Backup integrity verified
   Version: 1.0.0
   Ruleset: 1.0.0
   Size: 45.67 MB
   Created: 2025-01-15T14:30:00.000Z
```

## 🧪 Testing Backup Verification

### Manual Verification Steps

1. **Check File Integrity:**
   ```bash
   # Verify checksum
   sha256sum db/backups/20250115_1430-promptforge-v100.sql
   ```

2. **Validate SQL Syntax:**
   ```bash
   # Check if SQL is valid (PostgreSQL)
   head -n 100 db/backups/20250115_1430-promptforge-v100.sql
   ```

3. **Test Metadata:**
   ```bash
   # View backup metadata
   cat db/backups/20250115_1430-promptforge-v100.json
   ```

### Automated Verification

The `verifyBackup` function performs:
- File existence check
- Checksum validation
- Metadata parsing
- Size verification
- Version compatibility

## 🔄 Database Restoration

### ⚠️ Production Restore Warning

**NEVER restore to production without explicit confirmation!**

```bash
# Production restore is blocked by default
NODE_ENV=production node scripts/supabase-backup.js restore backup-file.sql
# ❌ Production restore requires manual confirmation
```

### 1. Development/Test Restore

```bash
# Restore to development environment
NODE_ENV=development node scripts/supabase-backup.js restore 20250115_1430-promptforge-v100.sql
```

**What happens:**
1. Verifies backup integrity
2. Confirms restore operation
3. Restores database using Supabase CLI or psql
4. Restores configuration files
5. Logs the operation

### 2. Test Environment Restore

Create a test database and restore to it:

```bash
# Test restore with specific database
node scripts/supabase-backup.js test-restore-env 20250115_1430-promptforge-v100.sql postgresql://test:test@localhost:5432/test_db
```

**What happens:**
1. Creates test database if it doesn't exist
2. Uses `pg_restore -C` for database creation
3. Restores backup to test environment
4. Doesn't affect production database

### 3. Complete Database Restoration

For a full database restore:

```bash
# 1. Stop the application
pm2 stop promptforge

# 2. Verify backup integrity
node scripts/supabase-backup.js verify 20250115_1430-promptforge-v100.sql

# 3. Restore database
NODE_ENV=development node scripts/supabase-backup.js restore 20250115_1430-promptforge-v100.sql

# 4. Verify restoration
node scripts/check-config.js

# 5. Restart application
pm2 start promptforge
```

## 🧹 Maintenance Operations

### Cleanup Old Backups

```bash
# Remove backups older than retention period
node scripts/supabase-backup.js cleanup
```

**Output:**
```
🗑️  Removed old backup: promptforge-backup-2024-12-15.sql
🗑️  Removed old backup: promptforge-backup-2024-12-16.sql
🗑️  Cleaned up 2 old backups
```

### Backup Retention Policy

- **Default**: 30 days retention
- **Maximum**: 100 backups
- **Automatic**: Cleanup runs after each backup
- **Manual**: Run `cleanup` command anytime

## 🔍 Troubleshooting

### Common Issues

1. **Backup Fails:**
   ```bash
   # Check logs
   tail -f db/backups/backup.log
   
   # Verify database connection
   node scripts/check-config.js
   ```

2. **Restore Fails:**
   ```bash
   # Check backup integrity
   node scripts/supabase-backup.js verify backup-file.sql
   
   # Verify database permissions
   psql -h host -U username -d database -c "SELECT 1;"
   ```

3. **Test Restore Issues:**
   ```bash
   # Ensure test database exists
   createdb -h localhost -U test promptforge_test
   
   # Check pg_restore availability
   which pg_restore
   ```

### Log Files

- **Backup Log**: `db/backups/backup.log`
- **Application Logs**: Check your application logging
- **Database Logs**: Check Supabase dashboard or PostgreSQL logs

## 📊 Monitoring and Alerts

### Backup Health Checks

```bash
# Daily backup verification
0 2 * * * cd /path/to/promptforge && node scripts/supabase-backup.js verify $(ls -t db/backups/*.sql | head -1)

# Weekly cleanup
0 3 * * 0 cd /path/to/promptforge && node scripts/supabase-backup.js cleanup
```

### Success Indicators

- ✅ Backup file created with timestamp
- ✅ Metadata file generated
- ✅ Checksum verification passed
- ✅ Configuration files backed up
- ✅ Old backups cleaned up

### Failure Indicators

- ❌ Backup file missing or corrupted
- ❌ Checksum mismatch
- ❌ Configuration backup failed
- ❌ Database connection error
- ❌ Insufficient disk space

## 🚨 Emergency Procedures

### Complete System Recovery

1. **Stop all services**
2. **Identify latest good backup**
3. **Restore database**
4. **Restore configuration**
5. **Verify system health**
6. **Restart services**

### Partial Recovery

- **Database only**: Use `restore` command
- **Configuration only**: Copy from backup config directory
- **Specific tables**: Extract from backup SQL file

## 📚 Additional Resources

- **Supabase Documentation**: https://supabase.com/docs
- **PostgreSQL Backup**: https://www.postgresql.org/docs/current/backup.html
- **pg_restore Manual**: https://www.postgresql.org/docs/current/app-pgrestore.html

---

**Remember**: Always test your backup and restore procedures in a safe environment before using them in production!
