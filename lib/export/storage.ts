/**
 * Export Bundle - Storage Management
 * Handles file uploads to Supabase Storage with deterministic paths
 */

import { createClient } from '@supabase/supabase-js';

export interface UploadResult {
  path: string;
  url: string;
  bytes: number;
}

export interface ArtifactUpload {
  filename: string;
  content: string | Uint8Array;
  contentType: string;
}

/**
 * Generate deterministic storage path
 */
export function generateStoragePath(context: {
  orgId: string;
  domain: string;
  moduleId: string;
  runId: string;
  filename: string;
}): string {
  const { orgId, domain, moduleId, runId, filename } = context;
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  return `bundles/${orgId}/${date}/${domain}/${moduleId}/${runId}/${filename}`;
}

/**
 * Upload single file to storage
 */
export async function uploadFile(
  path: string,
  content: string | Uint8Array,
  contentType: string
): Promise<UploadResult> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const bytes = typeof content === 'string' ? 
    new TextEncoder().encode(content).length : 
    content.length;

  const { data, error } = await supabase.storage
    .from('bundles')
    .upload(path, content, {
      contentType,
      upsert: true, // Overwrite if exists
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  // Generate signed URL (valid for 1 hour)
  const { data: urlData } = await supabase.storage
    .from('bundles')
    .createSignedUrl(path, 3600);

  return {
    path: data.path,
    url: urlData?.signedUrl || '',
    bytes
  };
}

/**
 * Upload multiple artifacts in batch
 */
export async function uploadArtifacts(
  basePath: string,
  artifacts: ArtifactUpload[]
): Promise<Record<string, UploadResult>> {
  const results: Record<string, UploadResult> = {};
  
  // Upload files sequentially to avoid rate limits
  for (const artifact of artifacts) {
    const fullPath = `${basePath}/${artifact.filename}`;
    
    try {
      const result = await uploadFile(
        fullPath,
        artifact.content,
        artifact.contentType
      );
      
      results[artifact.filename] = result;
    } catch (error) {
      console.error(`Failed to upload ${artifact.filename}:`, error);
      throw error;
    }
  }
  
  return results;
}

/**
 * Create ZIP archive for Enterprise users
 */
export async function createZipArchive(artifacts: Record<string, string | Uint8Array>): Promise<Uint8Array> {
  // This is a placeholder implementation
  // In production, you would use a library like 'jszip' or 'node-stream-zip'
  
  // For now, create a simple archive structure
  let zipContent = 'PK\x03\x04'; // ZIP file signature
  
  for (const [filename, content] of Object.entries(artifacts)) {
    const fileData = typeof content === 'string' ? 
      new TextEncoder().encode(content) : 
      content;
    
    // Add basic ZIP entry structure (simplified)
    zipContent += filename + '\n';
    zipContent += new TextDecoder().decode(fileData.slice(0, 100)) + '...\n';
  }
  
  zipContent += 'PK\x05\x06' + '\x00'.repeat(18); // End of central directory
  
  return new TextEncoder().encode(zipContent);
}

/**
 * Get content type for file extension
 */
export function getContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  const contentTypes: Record<string, string> = {
    'txt': 'text/plain',
    'md': 'text/markdown',
    'json': 'application/json',
    'pdf': 'application/pdf',
    'zip': 'application/zip',
    'xml': 'application/xml'
  };
  
  return contentTypes[ext || ''] || 'application/octet-stream';
}

/**
 * Validate storage configuration
 */
export function validateStorageConfig(): void {
  if (!process.env.SUPABASE_URL) {
    throw new Error('SUPABASE_URL environment variable is required');
  }
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  }
}
