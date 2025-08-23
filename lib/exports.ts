import { z } from 'zod';

// Types for export bundles
export interface BundleRequest {
  runId: string;
  moduleId: string;
  content: string;
  parameters: Record<string, any>;
  evaluation?: any;
  outputFormat: string;
  orgId: string;
}

export interface ExportBundle {
  id: string;
  runId: string;
  content: string;
  format: string;
  metadata: Record<string, any>;
  checksum: string;
  createdAt: Date;
}

/**
 * Create export bundle for a run
 */
export async function createBundle(request: BundleRequest): Promise<ExportBundle> {
  const { runId, moduleId, content, parameters, evaluation, outputFormat, orgId } = request;

  // Generate bundle ID
  const bundleId = crypto.randomUUID();

  // Create metadata
  const metadata = {
    moduleId,
    parameters,
    evaluation: evaluation
      ? {
          scores: evaluation.scores,
          feedback: evaluation.feedback,
        }
      : null,
    orgId,
    createdAt: new Date().toISOString(),
  };

  // Generate checksum
  const checksum = await generateChecksum(content + JSON.stringify(metadata));

  // TODO: Store in database
  // For now, return the bundle object
  return {
    id: bundleId,
    runId,
    content,
    format: outputFormat,
    metadata,
    checksum,
    createdAt: new Date(),
  };
}

/**
 * Generate SHA-256 checksum for content
 */
async function generateChecksum(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Export bundle in different formats
 */
export async function exportBundle(bundle: ExportBundle, format: string): Promise<string> {
  switch (format) {
    case 'txt':
      return bundle.content;
    case 'md':
      return `# Module Output\n\n${bundle.content}\n\n---\nGenerated: ${bundle.createdAt.toISOString()}`;
    case 'json':
      return JSON.stringify(
        {
          content: bundle.content,
          metadata: bundle.metadata,
          checksum: bundle.checksum,
        },
        null,
        2
      );
    case 'yaml':
      // TODO: Implement YAML export
      return `content: ${bundle.content}\nmetadata: ${JSON.stringify(bundle.metadata)}`;
    default:
      return bundle.content;
  }
}
