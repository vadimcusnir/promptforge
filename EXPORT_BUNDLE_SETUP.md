# Export Bundle System - Setup Guide

## Overview

The Export Bundle system generates auditable bundles from validated runs (Score ≥ 80) with standardized artifacts, canonical checksums, manifests, and Storage persistence.

## Environment Variables

Add these to your `.env.local`:

```bash
# Required for export functionality
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional customization
EXPORT_WATERMARK_TRIAL="TRIAL — Not for Redistribution"
NEXT_PUBLIC_SITE_NAME="PROMPTFORGE™ v3"
```

## Database Setup

Run the migration to set up export tables:

```sql
-- Run this in your Supabase SQL editor
\i supabase/migrations/010_export_bundles.sql
```

## Storage Setup

Create the `bundles` bucket in Supabase Storage:

1. Go to Supabase Dashboard → Storage
2. Create new bucket: `bundles`
3. Set as Private (not public)
4. File size limit: 100MB
5. Allowed MIME types: `text/plain, text/markdown, application/json, application/pdf, application/zip`

Or via SQL:

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('bundles', 'bundles', false, 104857600,
  ARRAY['text/plain', 'text/markdown', 'application/json', 'application/pdf', 'application/zip'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Bundle uploads for service role" ON storage.objects
FOR INSERT TO service_role WITH CHECK (bucket_id = 'bundles');

CREATE POLICY "Bundle downloads for authenticated users" ON storage.objects
FOR SELECT TO authenticated USING (bucket_id = 'bundles');
```

## API Endpoints

### POST /api/export

Export a validated run as a bundle.

**Request:**

```json
{
  "runId": "uuid",
  "formats": ["md", "json", "pdf"],
  "orgId": "uuid",
  "userId": "uuid"
}
```

**Response:**

```json
{
  "bundleId": "uuid",
  "paths": {
    "prompt.md": "signed_url",
    "prompt.json": "signed_url",
    "prompt.pdf": "signed_url",
    "manifest.json": "signed_url",
    "checksum.txt": "signed_url"
  },
  "license_notice": "© PROMPTFORGE v3 — Pro License",
  "checksum": "sha256:...",
  "formats": ["md", "json", "pdf"]
}
```

**Errors:**

- `403 ENTITLEMENT_REQUIRED` - Format not allowed for plan
- `422 DOD_NOT_MET` - Score < 80 or incomplete run
- `500 EXPORT_FAILED` - Internal error

## Format Gating

| Format | Plan Required | Entitlement Key      |
| ------ | ------------- | -------------------- |
| MD     | Pilot+        | -                    |
| JSON   | Pro+          | `canExportJSON`      |
| PDF    | Pro+          | `canExportPDF`       |
| ZIP    | Enterprise    | `canExportBundleZip` |

## Bundle Structure

Generated files (canonical order):

1. `prompt.txt` - Industrial format prompt
2. `prompt.json` - 7D parameters + metadata
3. `prompt.md` - Human-readable documentation
4. `prompt.pdf` - Branded export (with watermark if trial)
5. `manifest.json` - Bundle metadata
6. `telemetry.json` - Technical metrics (no PII)
7. `checksum.txt` - Canonical hash verification

## Storage Layout

```
/bundles/{org_id}/{YYYY-MM-DD}/{domain}/{module_id}/{run_id}/
  prompt.txt
  prompt.md
  prompt.json
  prompt.pdf
  telemetry.json
  manifest.json
  checksum.txt
  bundle.zip (Enterprise only)
```

## Usage Examples

### React Hook

```tsx
import { useExportBundle } from '@/hooks/use-export-bundle';

function ExportButton({ runId, orgId, userId }) {
  const { exportBundle, loading, error } = useExportBundle();

  const handleExport = async () => {
    try {
      const result = await exportBundle({
        runId,
        formats: ['md', 'pdf'],
        orgId,
        userId,
      });
      console.log('Export complete:', result.bundleId);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <button onClick={handleExport} disabled={loading}>
      {loading ? 'Exporting...' : 'Export Bundle'}
    </button>
  );
}
```

### Export Component

```tsx
import { ExportBundle } from '@/components/export-bundle';

function RunDetails({ run }) {
  return (
    <div>
      <h1>Run Results</h1>
      <ExportBundle
        runId={run.id}
        orgId={run.org_id}
        userId={run.user_id}
        moduleId={run.module_id}
        score={run.score}
        onExportComplete={bundleId => {
          console.log('Bundle created:', bundleId);
        }}
      />
    </div>
  );
}
```

## Security Features

- **DoD Enforcement**: Score ≥ 80 required
- **Entitlement Checking**: Plan-based format gating
- **PII Protection**: No raw content in telemetry
- **Canonical Hashing**: Reproducible checksums
- **Trial Watermarking**: PDF watermarks for trial users
- **Signed URLs**: Secure file access

## Observability

Export events are tracked in `export_telemetry`:

- `export.started` - Export initiated
- `export.finished` - Export completed successfully
- `export.failed` - Export failed with error

Query export stats:

```sql
SELECT * FROM get_org_export_stats('org-uuid', 30);
```

## Troubleshooting

### Common Issues

1. **"ENTITLEMENT_REQUIRED"** - User lacks required plan/entitlement
2. **"DOD_NOT_MET"** - Run score < 80 or incomplete
3. **"Storage upload failed"** - Check Supabase Storage setup
4. **"Module not found"** - Run references invalid module

### Debugging

Check export telemetry:

```sql
SELECT * FROM export_telemetry
WHERE org_id = 'your-org-id'
ORDER BY created_at DESC
LIMIT 10;
```

Validate run eligibility:

```sql
SELECT * FROM validate_export_eligibility('run-uuid');
```

## Production Considerations

1. **PDF Generation**: Replace placeholder with puppeteer/playwright
2. **ZIP Creation**: Use proper library like jszip
3. **Rate Limiting**: Add export quotas per plan
4. **Cleanup**: Schedule old bundle cleanup
5. **Monitoring**: Set up export failure alerts
