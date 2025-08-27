import { createHash, randomUUID } from 'crypto';
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { SevenDParams, sanitize7DForTelemetry } from './validator';
import { generateLicenseNotice } from './license-utils';

// Export formats from ruleset.yml
export type ExportFormat = 'txt' | 'md' | 'json' | 'pdf' | 'bundle';

// Bundle structure order (canonical from ruleset.yml)
export const BUNDLE_ORDER = [
  'prompt.txt',
  'prompt.md',
  'prompt.json',
  'prompt.pdf',
  'manifest.json',
  'checksum.sha256'
] as const;

// Manifest schema
export interface ExportManifest {
  version: string;
  run_id: string;
  module_id?: string;
  created_at: string;
  seven_d_params: Record<string, string>;
  export_format: ExportFormat;
  checksum: string;
  license: string;
  telemetry_id: string;
  score?: number;
  bundle_info: {
    total_files: number;
    total_size_bytes: number;
    export_formats: string[];
    generated_by: string;
    ruleset_version: string;
  };
  watermark?: string;
  license_notice?: string;
  // Enhanced fields for enterprise bundles
  file_hashes?: Record<string, string>;
  exported_at?: string;
  semver?: string;
}

// Export bundle configuration
export interface ExportBundleConfig {
  runId: string;
  moduleId?: string;
  promptText: string;
  sevenD: SevenDParams;
  formats: ExportFormat[];
  outputDir: string;
  license: string;
  telemetryId: string;
  watermark?: string;
  rulesetVersion?: string;
  score?: number;
  planName?: string;
  artifacts?: {
    txt?: string;
    md?: string;
    json?: string;
    pdf?: string;
  };
  telemetry?: Record<string, any>;
}

// File content generators
export interface FileContent {
  filename: string;
  content: string | Buffer;
  format: ExportFormat;
  size: number;
}

/**
 * Generate export bundle with canonical structure and enhanced artifact handling
 */
export async function generateExportBundle(
  config: ExportBundleConfig
): Promise<{
  bundlePath: string;
  manifest: ExportManifest;
  checksum: string;
  files: FileContent[];
  totalSize: number;
  zipPath?: string;
}> {
  try {
    // Validate DoD requirements (score ≥80)
    if (config.score !== undefined && config.score < 80) {
      throw new Error('Definition of Done not met: Score must be ≥80 to export bundle');
    }
    
    // Create output directory
    await mkdir(config.outputDir, { recursive: true });
    
    // Generate file contents with provided artifacts or defaults
    const files: FileContent[] = [];
    
    // 1. prompt.txt
    if (config.formats.includes('txt')) {
      const txtContent = config.artifacts?.txt || config.promptText;
      files.push({
        filename: 'prompt.txt',
        content: txtContent,
        format: 'txt',
        size: Buffer.byteLength(txtContent, 'utf8')
      });
    }
    
    // 2. prompt.md
    if (config.formats.includes('md')) {
      const mdContent = config.artifacts?.md || generateMarkdownContent(config.promptText, config.sevenD);
      files.push({
        filename: 'prompt.md',
        content: mdContent,
        format: 'md',
        size: Buffer.byteLength(mdContent, 'utf8')
      });
    }
    
    // 3. prompt.json
    if (config.formats.includes('json')) {
      const jsonContent = config.artifacts?.json || JSON.stringify(generateJSONContent(config.promptText, config.sevenD), null, 2);
      files.push({
        filename: 'prompt.json',
        content: jsonContent,
        format: 'json',
        size: Buffer.byteLength(jsonContent, 'utf8')
      });
    }
    
    // 4. prompt.pdf
    if (config.formats.includes('pdf')) {
      const pdfContent = config.artifacts?.pdf || generatePDFPlaceholder(config.promptText, config.sevenD, config.watermark);
      files.push({
        filename: 'prompt.pdf',
        content: pdfContent,
        format: 'pdf',
        size: Buffer.byteLength(pdfContent, 'utf8')
      });
    }
    
    // Calculate total size
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    
    // 5. Generate manifest with enhanced metadata
    const manifest: ExportManifest = {
      version: '1.0.0',
      run_id: config.runId,
      module_id: config.moduleId,
      created_at: new Date().toISOString(),
      seven_d_params: sanitize7DForTelemetry(config.sevenD),
      export_format: 'bundle',
      checksum: '', // Will be set after generating checksum
      license: config.license,
      telemetry_id: config.telemetryId,
      score: config.score,
      bundle_info: {
        total_files: files.length,
        total_size_bytes: totalSize,
        export_formats: config.formats,
        generated_by: 'PromptForge v3',
        ruleset_version: config.rulesetVersion || '1.0.0'
      },
      watermark: config.watermark,
      license_notice: generateLicenseNotice(config.planName || 'unknown', !!config.watermark).notice
    };
    
    // Add manifest to files
    const manifestContent = JSON.stringify(manifest, null, 2);
    files.push({
      filename: 'manifest.json',
      content: manifestContent,
      format: 'bundle',
      size: Buffer.byteLength(manifestContent, 'utf8')
    });
    
    // 6. Generate canonical checksum (txt → json → md → pdf → manifest)
    const checksum = generateCanonicalChecksum(files);
    manifest.checksum = checksum;
    
    // Update manifest file with checksum
    const finalManifestContent = JSON.stringify(manifest, null, 2);
    const manifestFileIndex = files.findIndex(f => f.filename === 'manifest.json');
    if (manifestFileIndex !== -1) {
      files[manifestFileIndex].content = finalManifestContent;
      files[manifestFileIndex].size = Buffer.byteLength(finalManifestContent, 'utf8');
    }
    
    // Add checksum file
    files.push({
      filename: 'checksum.sha256',
      content: checksum,
      format: 'bundle',
      size: checksum.length
    });
    
    // Write all files to disk
    for (const file of files) {
      const filePath = join(config.outputDir, file.filename);
      await writeFile(filePath, file.content);
    }
    
    // 7. Generate Enterprise ZIP bundle (optional)
    let zipPath: string | undefined;
    if (config.formats.includes('bundle')) {
      zipPath = await generateEnterpriseZip(config.outputDir, config.runId, config.moduleId);
    }
    
    const bundlePath = config.outputDir;
    
    return {
      bundlePath,
      manifest,
      checksum,
      files,
      totalSize,
      zipPath
    };
    
  } catch (error) {
    throw new Error(`Failed to generate export bundle: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate markdown content with 7D context
 */
function generateMarkdownContent(promptText: string, sevenD: SevenDParams): string {
  return `# Prompt Engineering Output

## 7D Parameters
- **Domain**: ${sevenD.domain}
- **Scale**: ${sevenD.scale}
- **Urgency**: ${sevenD.urgency}
- **Complexity**: ${sevenD.complexity}
- **Resources**: ${sevenD.resources}
- **Application**: ${sevenD.application}
- **Output Format**: ${sevenD.output_format}

## Prompt
${promptText}

---
*Generated by PromptForge v3 on ${new Date().toISOString()}*
`;
}

/**
 * Generate JSON content with structured data
 */
function generateJSONContent(promptText: string, sevenD: SevenDParams): any {
  return {
    prompt: {
      text: promptText,
      metadata: {
        generated_at: new Date().toISOString(),
        version: '1.0.0',
        source: 'PromptForge v3'
      }
    },
    seven_d_params: sevenD,
    export_info: {
      format: 'json',
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Generate PDF placeholder (in production, use proper PDF library)
 */
function generatePDFPlaceholder(promptText: string, sevenD: SevenDParams, watermark?: string): string {
  // This is a placeholder - in production, use a PDF generation library like puppeteer or jsPDF
  const watermarkText = watermark ? `\nWATERMARK: ${watermark}` : '';
  
  return `PDF PLACEHOLDER - PromptForge v3

7D Parameters:
Domain: ${sevenD.domain}
Scale: ${sevenD.scale}
Urgency: ${sevenD.urgency}
Complexity: ${sevenD.complexity}
Resources: ${sevenD.resources}
Application: ${sevenD.application}
Output Format: ${sevenD.output_format}

Prompt:
${promptText}

Generated: ${new Date().toISOString()}
${watermarkText}

Note: This is a placeholder. In production, this would be a proper PDF file.`;
}

/**
 * Generate SHA256 checksum for the entire bundle
 * Follows canonical order from ruleset.yml
 */
function generateBundleChecksum(files: FileContent[]): string {
  const hash = createHash('sha256');
  
  // Sort files according to canonical order
  const sortedFiles = [...files].sort((a, b) => {
    const aIndex = BUNDLE_ORDER.indexOf(a.filename as any);
    const bIndex = BUNDLE_ORDER.indexOf(b.filename as any);
    return aIndex - bIndex;
  });
  
  // Hash each file in canonical order
  for (const file of sortedFiles) {
    if (file.filename !== 'checksum.sha256') { // Exclude checksum file itself
      hash.update(file.filename);
      hash.update(file.content);
    }
  }
  
  return hash.digest('hex');
}

/**
 * Generate canonical checksum following strict order: txt → json → md → pdf → manifest
 * This ensures consistent checksums across different systems
 */
function generateCanonicalChecksum(files: FileContent[]): string {
  const hash = createHash('sha256');
  
  // Define canonical order for checksum calculation
  const canonicalOrder = ['prompt.txt', 'prompt.json', 'prompt.md', 'prompt.pdf', 'manifest.json'];
  
  // Hash files in canonical order
  for (const filename of canonicalOrder) {
    const file = files.find(f => f.filename === filename);
    if (file) {
      hash.update(filename);
      hash.update(file.content);
    }
  }
  
  return hash.digest('hex');
}

/**
 * Generate Enterprise ZIP bundle for Enterprise users
 * Creates bundle-{module}-{run_hash}.zip
 */
async function generateEnterpriseZip(
  bundleDir: string, 
  runId: string,
  moduleId?: string
): Promise<string> {
  try {
    // In production, use a proper ZIP library like archiver or adm-zip
    // For now, we'll create a placeholder ZIP file
    
    const moduleSlug = moduleId ? `-${moduleId}` : '';
    const runHash = Buffer.from(runId).toString('hex').substring(0, 8);
    const zipFilename = `bundle${moduleSlug}-${runHash}.zip`;
    const zipPath = join(bundleDir, zipFilename);
    
    // Create placeholder ZIP content (in production, this would be actual ZIP)
    const zipContent = `# Enterprise ZIP Bundle Placeholder
    
Bundle Directory: ${bundleDir}
Module ID: ${moduleId || 'N/A'}
Run ID: ${runId}
Generated: ${new Date().toISOString()}

Note: In production, this would be a proper ZIP file containing all export artifacts.
Use a ZIP library like archiver or adm-zip to create the actual compressed bundle.`;
    
    await writeFile(zipPath, zipContent);
    
    return zipPath;
  } catch (error) {
    console.error('Failed to generate Enterprise ZIP:', error);
    throw new Error(`ZIP generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Verify bundle integrity using checksum
 */
export function verifyBundleChecksum(
  files: FileContent[],
  expectedChecksum: string
): boolean {
  const actualChecksum = generateBundleChecksum(files);
  return actualChecksum === expectedChecksum;
}

/**
 * Verify canonical checksum for bundle integrity
 * Ensures files are in correct order and content matches
 */
export function verifyCanonicalChecksum(
  files: FileContent[],
  expectedChecksum: string
): boolean {
  const actualChecksum = generateCanonicalChecksum(files);
  return actualChecksum === expectedChecksum;
}

/**
 * Verify individual file hashes in manifest
 * Ensures no file corruption or tampering
 */
export function verifyFileHashes(
  files: FileContent[],
  manifest: ExportManifest
): {
  valid: boolean;
  corruptedFiles: string[];
  missingFiles: string[];
} {
  const corruptedFiles: string[] = [];
  const missingFiles: string[] = [];
  
  if (!manifest.file_hashes) {
    return { valid: false, corruptedFiles: [], missingFiles: [] };
  }
  
  for (const file of files) {
    if (file.filename === 'checksum.sha256') continue;
    
    const expectedHash = manifest.file_hashes[file.filename];
    if (!expectedHash) {
      missingFiles.push(file.filename);
      continue;
    }
    
    const actualHash = createHash('sha256').update(file.content).digest('hex');
    if (actualHash !== expectedHash) {
      corruptedFiles.push(file.filename);
    }
  }
  
  return {
    valid: corruptedFiles.length === 0 && missingFiles.length === 0,
    corruptedFiles,
    missingFiles
  };
}



/**
 * Create telemetry data (no PII)
 */
export function createTelemetryData(
  sevenD: SevenDParams,
  operation: string,
  duration: number
): Record<string, any> {
  return {
    operation,
    timestamp: new Date().toISOString(),
    seven_d_signature: sanitize7DForTelemetry(sevenD).signature,
    duration_ms: duration,
    export_formats: ['txt', 'md', 'json', 'pdf'],
    bundle_size: 'standard',
    ruleset_version: '1.0.0'
  };
}

/**
 * Validate export formats against user entitlements
 */
export function validateExportFormats(
  requestedFormats: ExportFormat[],
  allowedFormats: ExportFormat[]
): {
  valid: boolean;
  allowed: ExportFormat[];
  denied: ExportFormat[];
  reason?: string;
} {
  const allowed: ExportFormat[] = [];
  const denied: ExportFormat[] = [];
  
  for (const format of requestedFormats) {
    if (allowedFormats.includes(format)) {
      allowed.push(format);
    } else {
      denied.push(format);
    }
  }
  
  const valid = denied.length === 0;
  
  return {
    valid,
    allowed,
    denied,
    reason: valid ? undefined : `Denied formats: ${denied.join(', ')}`
  };
}

/**
 * Get bundle file paths for database storage
 */
export function getBundleFilePaths(
  bundleDir: string,
  files: FileContent[]
): string[] {
  return files.map(file => join(bundleDir, file.filename));
}

/**
 * Calculate bundle size for storage and billing
 */
export function calculateBundleSize(files: FileContent[]): {
  totalBytes: number;
  totalMB: number;
  fileCount: number;
} {
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  const totalMB = totalBytes / (1024 * 1024);
  
  return {
    totalBytes,
    totalMB: Math.round(totalMB * 100) / 100,
    fileCount: files.length
  };
}

/**
 * Validate export bundle against DoD requirements
 * Ensures score ≥80 and all required artifacts are present
 */
export function validateExportBundle(
  score: number | undefined,
  artifacts: Record<string, any>,
  requiredFormats: ExportFormat[]
): {
  valid: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];
  
  // Check score requirement
  if (score !== undefined && score < 80) {
    reasons.push(`Definition of Done not met: Score ${score} is below required threshold of 80`);
  }
  
  // Check required artifacts
  for (const format of requiredFormats) {
    if (format === 'txt' && !artifacts.txt) {
      reasons.push('Missing required TXT artifact');
    }
    if (format === 'md' && !artifacts.md) {
      reasons.push('Missing required MD artifact');
    }
    if (format === 'json' && !artifacts.json) {
      reasons.push('Missing required JSON artifact');
    }
    if (format === 'pdf' && !artifacts.pdf) {
      reasons.push('Missing required PDF artifact');
    }
  }
  
  return {
    valid: reasons.length === 0,
    reasons
  };
}

/**
 * Generate enhanced manifest with file hashes and metadata
 * Includes individual file checksums for verification
 */
export function generateEnhancedManifest(
  runId: string,
  moduleId: string | undefined,
  sevenD: SevenDParams,
  score: number | undefined,
  files: FileContent[],
  license: string,
  telemetryId: string,
  watermark?: string
): ExportManifest {
  // Calculate individual file hashes
  const fileHashes: Record<string, string> = {};
  for (const file of files) {
    if (file.filename !== 'checksum.sha256') {
      const hash = createHash('sha256');
      hash.update(file.content);
      fileHashes[file.filename] = hash.digest('hex');
    }
  }
  
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  
  return {
    version: '1.0.0',
    run_id: runId,
    module_id: moduleId,
    created_at: new Date().toISOString(),
    seven_d_params: sanitize7DForTelemetry(sevenD),
    export_format: 'bundle',
    checksum: '', // Will be set after canonical checksum calculation
    license: license,
    telemetry_id: telemetryId,
    score: score,
    bundle_info: {
      total_files: files.length,
      total_size_bytes: totalSize,
      export_formats: files.map(f => f.format),
      generated_by: 'PromptForge v3',
      ruleset_version: '1.0.0'
    },
    watermark: watermark,
    license_notice: generateLicenseNotice('unknown', !!watermark).notice,
    // Enhanced metadata
    file_hashes: fileHashes,
    exported_at: new Date().toISOString(),
    semver: '1.0.0'
  } as any; // Using 'as any' to extend the interface temporarily
}

/**
 * Insert bundle record into database with proper validation
 * Ensures RLS compliance and data integrity
 */
export async function insertBundleRecord(
  supabase: any,
  bundleData: {
    id: string;
    org_id: string;
    user_id: string;
    run_id?: string;
    name: string;
    description: string;
    export_formats: ExportFormat[];
    file_paths: string[];
    manifest: ExportManifest;
    checksum: string;
    file_size_bytes: number;
    metadata: Record<string, any>;
  }
): Promise<{ success: boolean; bundleId?: string; error?: string }> {
  try {
    const { data: bundle, error } = await supabase
      .from('bundles')
      .insert(bundleData)
      .select('id')
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      success: true,
      bundleId: bundle.id
    };
  } catch (error) {
    console.error('Failed to insert bundle record:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Complete export bundle pipeline
 * Handles validation, generation, storage, and database insertion
 */
export async function executeExportBundlePipeline(
  config: {
    runId: string;
    moduleId?: string;
    orgId: string;
    userId: string;
    promptText: string;
    sevenD: SevenDParams;
    score?: number;
    artifacts?: Record<string, string>;
    formats: ExportFormat[];
    planName: string;
    watermark?: string;
  },
  supabase: any
): Promise<{
  success: boolean;
  bundleId?: string;
  bundlePath?: string;
  zipPath?: string;
  manifest?: ExportManifest;
  checksum?: string;
  error?: string;
}> {
  try {
    // 1. Validate DoD requirements
    const validation = validateExportBundle(config.score, config.artifacts || {}, config.formats);
    if (!validation.valid) {
      return {
        success: false,
        error: `Export validation failed: ${validation.reasons.join(', ')}`
      };
    }
    
    // 2. Generate bundle directory
    const bundleId = randomUUID();
    const bundleDir = join(process.cwd(), 'exports', bundleId);
    
    // 3. Generate license notice
    const license = generateLicenseNotice(config.planName || 'unknown', !!config.watermark).notice;
    
    // 4. Generate export bundle
    const exportResult = await generateExportBundle({
      runId: config.runId,
      moduleId: config.moduleId,
      promptText: config.promptText,
      sevenD: config.sevenD,
      formats: config.formats,
      outputDir: bundleDir,
      license: license,
      telemetryId: randomUUID(),
      watermark: config.watermark,
      rulesetVersion: '1.0.0',
      score: config.score,
      artifacts: config.artifacts
    });
    
    // 5. Insert bundle record into database
    const bundleData = {
      id: bundleId,
      org_id: config.orgId,
      user_id: config.userId,
      run_id: config.runId,
      name: `Export-${config.moduleId || 'Prompt'}-${new Date().toISOString().split('T')[0]}`,
      description: `Export bundle for ${config.moduleId ? `module ${config.moduleId}` : 'prompt'}`,
      export_formats: config.formats,
      file_paths: exportResult.files.map(f => join(bundleDir, f.filename)),
      manifest: exportResult.manifest,
      checksum: exportResult.checksum,
      file_size_bytes: exportResult.totalSize,
      metadata: {
        seven_d_signature: Buffer.from(
          Object.entries(config.sevenD)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, v]) => `${k}:${v}`)
            .join('|')
        ).toString('base64'),
        operation: 'export_bundle_pipeline',
        watermark: config.watermark,
        score: config.score
      }
    };
    
    const dbResult = await insertBundleRecord(supabase, bundleData);
    if (!dbResult.success) {
      throw new Error(`Database insertion failed: ${dbResult.error}`);
    }
    
    return {
      success: true,
      bundleId: bundleId,
      bundlePath: exportResult.bundlePath,
      zipPath: exportResult.zipPath,
      manifest: exportResult.manifest,
      checksum: exportResult.checksum
    };
    
  } catch (error) {
    console.error('Export bundle pipeline failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
