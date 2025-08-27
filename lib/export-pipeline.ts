import { createHash, randomUUID } from 'crypto';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { SevenDParams, sanitize7DForTelemetry } from './validator';
import { generateLicenseNotice } from './license-utils';

// Export pipeline types
export interface ExportPipelineConfig {
  runId: string;
  moduleId?: string;
  orgId: string;
  userId: string;
  promptText: string;
  sevenD: SevenDParams;
  score?: number;
  formats: ExportFormat[];
  planName: string;
  watermark?: string;
  outputDir: string;
}

export type ExportFormat = 'txt' | 'md' | 'json' | 'pdf' | 'zip' | 'bundle';

// Enhanced manifest with compliance features
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
  // Enhanced compliance fields
  file_hashes: Record<string, string>;
  exported_at: string;
  semver: string;
  compliance: {
    score_threshold_met: boolean;
    watermark_applied: boolean;
    license_valid: boolean;
    checksum_verified: boolean;
  };
}

// File content with metadata
export interface FileContent {
  filename: string;
  content: string | Buffer;
  format: ExportFormat;
  size: number;
  hash: string;
}

/**
 * Main export pipeline executor
 * Handles validation, generation, and compliance checks
 */
export async function executeExportPipeline(
  config: ExportPipelineConfig
): Promise<{
  success: boolean;
  bundlePath?: string;
  manifest?: ExportManifest;
  checksum?: string;
  files?: FileContent[];
  error?: string;
}> {
  try {
    // 1. Validate DoD requirements (score ≥80)
    if (config.score !== undefined && config.score < 80) {
      return {
        success: false,
        error: 'Definition of Done not met: Score must be ≥80 to export bundle'
      };
    }

    // 2. Create output directory
    await mkdir(config.outputDir, { recursive: true });

    // 3. Generate all required artifacts
    const files = await generateArtifacts(config);

    // 4. Generate enhanced manifest
    const manifest = generateEnhancedManifest(config, files);

    // 5. Generate canonical checksum
    const checksum = generateCanonicalChecksum(files, manifest);
    manifest.checksum = checksum;

    // 6. Write all files to disk
    await writeFilesToDisk(files, config.outputDir);

    // 7. Write final manifest with checksum
    const finalManifestPath = join(config.outputDir, 'manifest.json');
    await writeFile(finalManifestPath, JSON.stringify(manifest, null, 2));

    // 8. Write checksum file
    const checksumPath = join(config.outputDir, 'checksum.sha256');
    await writeFile(checksumPath, checksum);

    // 9. Generate Enterprise ZIP if requested
    let zipPath: string | undefined;
    if (config.formats.includes('zip')) {
      zipPath = await generateEnterpriseZip(config.outputDir, config.runId, config.moduleId);
    }

    return {
      success: true,
      bundlePath: config.outputDir,
      manifest,
      checksum,
      files
    };

  } catch (error) {
    console.error('Export pipeline failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Generate all required artifacts based on export formats
 */
async function generateArtifacts(config: ExportPipelineConfig): Promise<FileContent[]> {
  const files: FileContent[] = [];

  // 1. Generate TXT artifact
  if (config.formats.includes('txt')) {
    const txtContent = generateTxtContent(config.promptText, config.sevenD);
    const txtHash = createHash('sha256').update(txtContent).digest('hex');
    
    files.push({
      filename: 'prompt.txt',
      content: txtContent,
      format: 'txt',
      size: Buffer.byteLength(txtContent, 'utf8'),
      hash: txtHash
    });
  }

  // 2. Generate MD artifact
  if (config.formats.includes('md')) {
    const mdContent = generateMarkdownContent(config.promptText, config.sevenD);
    const mdHash = createHash('sha256').update(mdContent).digest('hex');
    
    files.push({
      filename: 'prompt.md',
      content: mdContent,
      format: 'md',
      size: Buffer.byteLength(mdContent, 'utf8'),
      hash: mdHash
    });
  }

  // 3. Generate JSON artifact
  if (config.formats.includes('json')) {
    const jsonContent = generateJSONContent(config.promptText, config.sevenD);
    const jsonHash = createHash('sha256').update(jsonContent).digest('hex');
    
    files.push({
      filename: 'prompt.json',
      content: jsonContent,
      format: 'json',
      size: Buffer.byteLength(jsonContent, 'utf8'),
      hash: jsonHash
    });
  }

  // 4. Generate PDF artifact
  if (config.formats.includes('pdf')) {
    const pdfContent = await generatePDFContent(config.promptText, config.sevenD, config.watermark);
    const pdfHash = createHash('sha256').update(pdfContent).digest('hex');
    
    files.push({
      filename: 'prompt.pdf',
      content: pdfContent,
      format: 'pdf',
      size: Buffer.byteLength(pdfContent, 'utf8'),
      hash: pdfHash
    });
  }

  return files;
}

/**
 * Generate TXT content with 7D context
 */
function generateTxtContent(promptText: string, sevenD: SevenDParams): string {
  return `PROMPTFORGE v3 EXPORT

7D PARAMETERS:
Domain: ${sevenD.domain}
Scale: ${sevenD.scale}
Urgency: ${sevenD.urgency}
Complexity: ${sevenD.complexity}
Resources: ${sevenD.resources}
Application: ${sevenD.application}
Output Format: ${sevenD.output_format}

PROMPT:
${promptText}

Generated: ${new Date().toISOString()}
Exported by PromptForge v3`;
}

/**
 * Generate Markdown content with 7D context
 */
function generateMarkdownContent(promptText: string, sevenD: SevenDParams): string {
  return `# PromptForge v3 Export

## 7D Parameters

| Parameter | Value |
|-----------|-------|
| Domain | ${sevenD.domain} |
| Scale | ${sevenD.scale} |
| Urgency | ${sevenD.urgency} |
| Complexity | ${sevenD.complexity} |
| Resources | ${sevenD.resources} |
| Application | ${sevenD.application} |
| Output Format | ${sevenD.output_format} |

## Generated Prompt

${promptText}

---

*Generated by PromptForge v3 on ${new Date().toISOString()}*
*Export ID: ${randomUUID()}*
`;
}

/**
 * Generate JSON content with structured data
 */
function generateJSONContent(promptText: string, sevenD: SevenDParams): string {
  const jsonData = {
    metadata: {
      version: '1.0.0',
      generated_at: new Date().toISOString(),
      source: 'PromptForge v3',
      export_id: randomUUID()
    },
    seven_d_params: sevenD,
    prompt: {
      text: promptText,
      length: promptText.length,
      word_count: promptText.split(/\s+/).length
    },
    export_info: {
      format: 'json',
      timestamp: new Date().toISOString(),
      compliance: {
        score_threshold: 80,
        watermark_applied: false,
        license_valid: true
      }
    }
  };

  return JSON.stringify(jsonData, null, 2);
}

/**
 * Generate PDF content using HTML template
 * In production, use a proper PDF library like puppeteer
 */
async function generatePDFContent(
  promptText: string, 
  sevenD: SevenDParams, 
  watermark?: string
): Promise<string> {
  // Generate HTML content that can be converted to PDF
  const htmlContent = generatePDFHTML(promptText, sevenD, watermark);
  
  // For now, return HTML content (in production, convert to PDF)
  // TODO: Integrate with puppeteer or similar PDF generation library
  return htmlContent;
}

/**
 * Generate HTML template for PDF conversion
 */
function generatePDFHTML(promptText: string, sevenD: SevenDParams, watermark?: string): string {
  const watermarkHtml = watermark ? `
    <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); 
                font-size: 48px; color: rgba(255,0,0,0.3); pointer-events: none; z-index: 1000;">
      ${watermark}
    </div>
  ` : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>PromptForge v3 Export</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
    .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #d1a954; padding-bottom: 20px; }
    .params-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .params-table th, .params-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    .params-table th { background-color: #f8f9fa; font-weight: bold; }
    .prompt-section { margin: 30px 0; }
    .prompt-text { background-color: #f8f9fa; padding: 20px; border-radius: 8px; white-space: pre-wrap; }
    .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
    .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); 
                 font-size: 48px; color: rgba(255,0,0,0.3); pointer-events: none; z-index: 1000; }
  </style>
</head>
<body>
  ${watermarkHtml}
  
  <div class="header">
    <h1>PromptForge v3 Export</h1>
    <p>Professional Prompt Engineering Platform</p>
    <p>Generated: ${new Date().toISOString()}</p>
  </div>

  <h2>7D Parameters</h2>
  <table class="params-table">
    <tr><th>Parameter</th><th>Value</th></tr>
    <tr><td>Domain</td><td>${sevenD.domain}</td></tr>
    <tr><td>Scale</td><td>${sevenD.scale}</td></tr>
    <tr><td>Urgency</td><td>${sevenD.urgency}</td></tr>
    <tr><td>Complexity</td><td>${sevenD.complexity}</td></tr>
    <tr><td>Resources</td><td>${sevenD.resources}</td></tr>
    <tr><td>Application</td><td>${sevenD.application}</td></tr>
    <tr><td>Output Format</td><td>${sevenD.output_format}</td></tr>
  </table>

  <div class="prompt-section">
    <h2>Generated Prompt</h2>
    <div class="prompt-text">${promptText.replace(/\n/g, '<br>')}</div>
  </div>

  <div class="footer">
    <p>Exported by PromptForge v3 | ${new Date().toISOString()}</p>
    <p>Export ID: ${randomUUID()}</p>
    ${watermark ? `<p>Watermark: ${watermark}</p>` : ''}
  </div>
</body>
</html>`;
}

/**
 * Generate enhanced manifest with compliance features
 */
function generateEnhancedManifest(config: ExportPipelineConfig, files: FileContent[]): ExportManifest {
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const fileHashes: Record<string, string> = {};
  
  // Calculate file hashes
  for (const file of files) {
    fileHashes[file.filename] = file.hash;
  }

  // Generate license notice
  const licenseNotice = generateLicenseNotice(config.planName, !!config.watermark);

  return {
    version: '1.0.0',
    run_id: config.runId,
    module_id: config.moduleId,
    created_at: new Date().toISOString(),
    seven_d_params: sanitize7DForTelemetry(config.sevenD),
    export_format: 'bundle',
    checksum: '', // Will be set after checksum calculation
    license: licenseNotice.notice,
    telemetry_id: randomUUID(),
    score: config.score,
    bundle_info: {
      total_files: files.length + 2, // +2 for manifest and checksum
      total_size_bytes: totalSize,
      export_formats: config.formats,
      generated_by: 'PromptForge v3',
      ruleset_version: '1.0.0'
    },
    watermark: config.watermark,
    license_notice: licenseNotice.notice,
    file_hashes: fileHashes,
    exported_at: new Date().toISOString(),
    semver: '1.0.0',
    compliance: {
      score_threshold_met: (config.score || 0) >= 80,
      watermark_applied: !!config.watermark,
      license_valid: true,
      checksum_verified: false // Will be set after verification
    }
  };
}

/**
 * Generate canonical checksum following strict order
 * txt → json → md → pdf → manifest
 */
function generateCanonicalChecksum(files: FileContent[], manifest: ExportManifest): string {
  const hash = createHash('sha256');
  
  // Define canonical order for checksum calculation
  const canonicalOrder = ['prompt.txt', 'prompt.json', 'prompt.md', 'prompt.pdf'];
  
  // Hash files in canonical order
  for (const filename of canonicalOrder) {
    const file = files.find(f => f.filename === filename);
    if (file) {
      hash.update(filename);
      hash.update(file.content);
    }
  }
  
  // Hash manifest content (excluding checksum field)
  const manifestForChecksum = { ...manifest, checksum: '' };
  hash.update(JSON.stringify(manifestForChecksum));
  
  return hash.digest('hex');
}

/**
 * Write all files to disk
 */
async function writeFilesToDisk(files: FileContent[], outputDir: string): Promise<void> {
  for (const file of files) {
    const filePath = join(outputDir, file.filename);
    await writeFile(filePath, file.content);
  }
}

/**
 * Generate Enterprise ZIP bundle
 */
async function generateEnterpriseZip(
  bundleDir: string, 
  runId: string,
  moduleId?: string
): Promise<string> {
  try {
    const moduleSlug = moduleId ? `-${moduleId}` : '';
    const runHash = Buffer.from(runId).toString('hex').substring(0, 8);
    const zipFilename = `bundle${moduleSlug}-${runHash}.zip`;
    const zipPath = join(bundleDir, zipFilename);
    
    // TODO: Implement actual ZIP creation using archiver or similar
    // For now, create a placeholder
    const zipContent = `# Enterprise ZIP Bundle
    
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
export function verifyBundleIntegrity(
  files: FileContent[],
  manifest: ExportManifest,
  expectedChecksum: string
): {
  valid: boolean;
  checksumMatch: boolean;
  fileHashesValid: boolean;
  corruptedFiles: string[];
  missingFiles: string[];
} {
  // Verify canonical checksum
  const actualChecksum = generateCanonicalChecksum(files, manifest);
  const checksumMatch = actualChecksum === expectedChecksum;
  
  // Verify individual file hashes
  const corruptedFiles: string[] = [];
  const missingFiles: string[] = [];
  
  for (const file of files) {
    const expectedHash = manifest.file_hashes[file.filename];
    if (!expectedHash) {
      missingFiles.push(file.filename);
      continue;
    }
    
    if (file.hash !== expectedHash) {
      corruptedFiles.push(file.filename);
    }
  }
  
  const fileHashesValid = corruptedFiles.length === 0 && missingFiles.length === 0;
  const valid = checksumMatch && fileHashesValid;
  
  return {
    valid,
    checksumMatch,
    fileHashesValid,
    corruptedFiles,
    missingFiles
  };
}

/**
 * Validate export request against user entitlements
 */
export function validateExportRequest(
  requestedFormats: ExportFormat[],
  userEntitlements: Record<string, boolean>
): {
  valid: boolean;
  allowed: ExportFormat[];
  denied: ExportFormat[];
  reason?: string;
} {
  const allowed: ExportFormat[] = [];
  const denied: ExportFormat[] = [];
  
  for (const format of requestedFormats) {
    switch (format) {
      case 'txt':
      case 'md':
        allowed.push(format);
        break;
      case 'pdf':
      case 'json':
        if (userEntitlements.canExportPDF) {
          allowed.push(format);
        } else {
          denied.push(format);
        }
        break;
      case 'zip':
        if (userEntitlements.canExportBundleZip) {
          allowed.push(format);
        } else {
          denied.push(format);
        }
        break;
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
