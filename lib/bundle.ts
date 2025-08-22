// PromptForge v3 - Bundle Export System
// Generează bundle complete cu toate formatele (.txt/.md/.json/.pdf/.zip)

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import JSZip from 'jszip';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { getExportConfig } from '@/lib/ruleset';

export interface Artifact {
  file: string;
  bytes: number;
  checksum: string; // sha256:<hex>
}

export interface ParameterSet7D {
  domain: string;
  scale: string;
  urgency: string;
  complexity: string;
  resources: string;
  application: string;
  output_format: string;
}

export interface BundleManifest {
  bundle_id: string;
  run_id: string;
  module_id: string;
  version: string;
  exported_at: string;
  formats: string[];
  artifacts: Artifact[];
  parameter_set_7d: ParameterSet7D;
  telemetry: Record<string, any>;
  license_notice: string;
  bundle_checksum?: string; // sha256 over canonical order
}

// Calculează SHA-256 hash
export function sha256(buffer: Buffer): string {
  return 'sha256:' + crypto.createHash('sha256').update(buffer).digest('hex');
}

// Scrie fișier cu directoare create automat
export function writeFileSyncEnsure(dir: string, name: string, content: Buffer | string): string {
  fs.mkdirSync(dir, { recursive: true });
  const fullPath = path.join(dir, name);
  fs.writeFileSync(fullPath, content);
  return fullPath;
}

// Generează PDF din Markdown cu branding PromptForge
export async function makePdfFromMarkdown(
  md: string, 
  title: string = 'PromptForge v3',
  watermark?: string
): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  
  let page = doc.addPage();
  const fontSize = 11;
  const titleFontSize = 16;
  const margin = 40;
  const maxWidth = page.getWidth() - margin * 2;
  let y = page.getHeight() - margin;

  // Header cu titlu
  page.drawText(title, {
    x: margin,
    y,
    size: titleFontSize,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.8)
  });
  y -= titleFontSize + 20;

  // Watermark pentru trial
  if (watermark) {
    const watermarkFontSize = 12;
    page.drawText(watermark, {
      x: margin,
      y: page.getHeight() - margin - titleFontSize - 10,
      size: watermarkFontSize,
      font: boldFont,
      color: rgb(0.8, 0.2, 0.2)
    });
    y -= watermarkFontSize + 10;
  }

  // Content din Markdown
  const lines = md.split('\n');
  
  for (const line of lines) {
    // Handle headers
    if (line.startsWith('# ')) {
      y -= 10;
      const headerText = line.substring(2);
      const textWidth = boldFont.widthOfTextAtSize(headerText, 14);
      if (textWidth > maxWidth) {
        const chunks = splitTextByWidth(headerText, boldFont, 14, maxWidth);
        for (const chunk of chunks) {
          page.drawText(chunk, { x: margin, y, size: 14, font: boldFont });
          y -= 18;
          if (y < margin) {
            page = doc.addPage();
            y = page.getHeight() - margin;
          }
        }
      } else {
        page.drawText(headerText, { x: margin, y, size: 14, font: boldFont });
        y -= 18;
      }
      y -= 5;
    }
    // Handle regular text
    else if (line.trim()) {
      const chunks = splitTextByWidth(line, font, fontSize, maxWidth);
      for (const chunk of chunks) {
        page.drawText(chunk, { x: margin, y, size: fontSize, font });
        y -= fontSize + 4;
        if (y < margin) {
          page = doc.addPage();
          y = page.getHeight() - margin;
        }
      }
    }
    // Empty line
    else {
      y -= fontSize + 4;
    }
    
    // Check page break
    if (y < margin) {
      page = doc.addPage();
      y = page.getHeight() - margin;
    }
  }

  // Footer on all pages
  const pages = doc.getPages();
  pages.forEach((page, index) => {
    page.drawText(`Page ${index + 1}`, {
      x: page.getWidth() - margin - 50,
      y: margin - 20,
      size: 9,
      font,
      color: rgb(0.5, 0.5, 0.5)
    });
  });

  return Buffer.from(await doc.save());
}

// Split text pentru a încăpea în lățimea specificată
function splitTextByWidth(text: string, font: any, size: number, width: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? currentLine + ' ' + word : word;
    const testWidth = font.widthOfTextAtSize(testLine, size);
    
    if (testWidth <= width) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines.length > 0 ? lines : [''];
}

// Scrie artefactele de bază (.txt, .md, .json)
export function writeTxtMdJson(
  outDir: string,
  promptText: string,
  mdReport: string,
  jsonPayload: any
): void {
  writeFileSyncEnsure(outDir, 'prompt.txt', promptText);
  writeFileSyncEnsure(outDir, 'prompt.md', mdReport);
  writeFileSyncEnsure(outDir, 'prompt.json', JSON.stringify(jsonPayload, null, 2));
}

// Generează manifest cu checksum canonic
export function makeManifest(opts: {
  outDir: string;
  run_id: string;
  bundle_id: string;
  module_id: string;
  version: string;
  formats: string[];
  parameter_set_7d: ParameterSet7D;
  telemetry: Record<string, any>;
  license_notice: string;
}): BundleManifest {
  const config = getExportConfig();
  const existingFiles = fs.readdirSync(opts.outDir);
  const artifacts: Artifact[] = [];

  // Calculează artifacts pentru fișierele existente
  for (const fileName of existingFiles) {
    if (!config.artifacts.includes(fileName)) continue;
    
    const filePath = path.join(opts.outDir, fileName);
    const buffer = fs.readFileSync(filePath);
    artifacts.push({
      file: fileName,
      bytes: buffer.length,
      checksum: sha256(buffer)
    });
  }

  // Calculează checksum canonic de bundle
  const canonicalOrder = config.checksum.canonical_order;
  const checksumParts: string[] = [];
  
  for (const fileName of canonicalOrder) {
    const filePath = path.join(opts.outDir, fileName);
    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath);
      checksumParts.push(sha256(buffer).replace('sha256:', ''));
    }
  }
  
  const bundleChecksum = 'sha256:' + crypto.createHash('sha256')
    .update(checksumParts.join(''))
    .digest('hex');

  const manifest: BundleManifest = {
    bundle_id: opts.bundle_id,
    run_id: opts.run_id,
    module_id: opts.module_id,
    version: opts.version,
    exported_at: new Date().toISOString(),
    formats: opts.formats,
    artifacts,
    parameter_set_7d: opts.parameter_set_7d,
    telemetry: opts.telemetry,
    license_notice: opts.license_notice,
    bundle_checksum: bundleChecksum
  };

  // Scrie manifest.json
  fs.writeFileSync(
    path.join(opts.outDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  return manifest;
}

// Scrie checksum.txt cu hash-uri per fișier
export function writeChecksums(outDir: string): void {
  const config = getExportConfig();
  const lines: string[] = [];

  for (const fileName of config.artifacts) {
    const filePath = path.join(outDir, fileName);
    if (!fs.existsSync(filePath)) continue;
    
    const buffer = fs.readFileSync(filePath);
    const hash = sha256(buffer).replace('sha256:', '');
    lines.push(`${hash}  ${fileName}`);
  }

  fs.writeFileSync(
    path.join(outDir, 'checksum.txt'),
    lines.join('\n'),
    'utf-8'
  );
}

// Creează ZIP bundle pentru Enterprise
export async function zipBundle(
  outDir: string,
  bundleName: string
): Promise<{ zipName: string; content: Buffer }> {
  const zip = new JSZip();
  const files = fs.readdirSync(outDir);

  for (const fileName of files) {
    const filePath = path.join(outDir, fileName);
    const content = fs.readFileSync(filePath);
    zip.file(fileName, content);
  }

  const content = await zip.generateAsync({ type: 'nodebuffer' });
  const zipName = `${bundleName}.zip`;
  
  // Salvează ZIP în directorul de output
  fs.writeFileSync(path.join(outDir, zipName), content);

  return { zipName, content };
}

// Funcție principală pentru generarea bundle-ului complet
export async function generateBundle(params: {
  runId: string;
  moduleId: string;
  orgId: string;
  parameterSet7D: ParameterSet7D;
  promptText: string;
  mdReport: string;
  jsonPayload: any;
  telemetry: Record<string, any>;
  licenseNotice: string;
  formats: string[];
  version?: string;
  watermark?: string;
}): Promise<{
  manifest: BundleManifest;
  outputDir: string;
  zipInfo?: { zipName: string; content: Buffer };
}> {
  const { 
    runId, moduleId, orgId, parameterSet7D, promptText, mdReport, 
    jsonPayload, telemetry, licenseNotice, formats, version = '1.0.0', watermark 
  } = params;

  // Creează director temporar pentru bundle
  const outputDir = path.join('/tmp', `bundle-${runId}`);
  
  // Curăță directorul dacă există
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }

  // Scrie artefactele de bază
  writeTxtMdJson(outputDir, promptText, mdReport, jsonPayload);

  // Generează PDF dacă este în formats
  if (formats.includes('pdf')) {
    const pdfBuffer = await makePdfFromMarkdown(mdReport, 'PromptForge v3', watermark);
    writeFileSyncEnsure(outputDir, 'prompt.pdf', pdfBuffer);
  }

  // Scrie telemetry.json (fără PII)
  const safeTelemetry = {
    ...telemetry,
    // Elimină orice conținut brut
    raw_content: undefined,
    prompt_content: undefined
  };
  writeFileSyncEnsure(outputDir, 'telemetry.json', JSON.stringify(safeTelemetry, null, 2));

  // Generează manifest cu checksum canonic
  const bundleId = crypto.randomUUID();
  const manifest = makeManifest({
    outDir: outputDir,
    run_id: runId,
    bundle_id: bundleId,
    module_id: moduleId,
    version,
    formats,
    parameter_set_7d: parameterSet7D,
    telemetry: safeTelemetry,
    license_notice: licenseNotice
  });

  // Scrie checksum.txt
  writeChecksums(outputDir);

  // Creează ZIP pentru Enterprise
  let zipInfo;
  if (formats.includes('zip')) {
    const bundleName = `bundle-${moduleId}-${runId.slice(-8)}`;
    zipInfo = await zipBundle(outputDir, bundleName);
  }

  return {
    manifest,
    outputDir,
    zipInfo
  };
}

// Detectează MIME type pentru fișiere
export function detectMimeType(fileName: string): string {
  if (fileName.endsWith('.pdf')) return 'application/pdf';
  if (fileName.endsWith('.md')) return 'text/markdown';
  if (fileName.endsWith('.json')) return 'application/json';
  if (fileName.endsWith('.txt')) return 'text/plain';
  if (fileName.endsWith('.zip')) return 'application/zip';
  return 'application/octet-stream';
}

// Validează că bundle-ul este complet și valid
export function validateBundle(outputDir: string, expectedFormats: string[]): {
  isValid: boolean;
  errors: string[];
  files: string[];
} {
  const errors: string[] = [];
  const files = fs.readdirSync(outputDir);

  // Verifică fișierele obligatorii
  const requiredFiles = ['prompt.txt', 'prompt.md', 'manifest.json', 'telemetry.json', 'checksum.txt'];
  
  for (const required of requiredFiles) {
    if (!files.includes(required)) {
      errors.push(`Missing required file: ${required}`);
    }
  }

  // Verifică formatele specificate
  if (expectedFormats.includes('pdf') && !files.includes('prompt.pdf')) {
    errors.push('PDF format requested but prompt.pdf not found');
  }

  if (expectedFormats.includes('json') && !files.includes('prompt.json')) {
    errors.push('JSON format requested but prompt.json not found');
  }

  // Verifică că manifest.json este valid JSON
  try {
    const manifestPath = path.join(outputDir, 'manifest.json');
    if (fs.existsSync(manifestPath)) {
      JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    }
  } catch (error) {
    errors.push('Invalid manifest.json format');
  }

  return {
    isValid: errors.length === 0,
    errors,
    files
  };
}
