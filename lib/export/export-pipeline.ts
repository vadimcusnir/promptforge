import { GeneratedPrompt, SevenDConfig, PromptModule } from "@/types/promptforge";
import { createHash } from "crypto";

export interface ExportManifest {
  version: string;
  timestamp: string;
  promptId: string;
  moduleId: string;
  sevenDConfig: SevenDConfig;
  metadata: {
    generatedAt: string;
    tokens: number;
    tta: number;
    exportFormat: string;
    watermark?: string;
  };
  files: Array<{
    name: string;
    type: string;
    size: number;
    checksum: string;
  }>;
}

export interface ExportResult {
  success: boolean;
  data?: Buffer | string;
  downloadUrl?: string;
  manifest?: ExportManifest;
  error?: string;
}

export class ExportPipeline {
  private static instance: ExportPipeline;
  private readonly VERSION = "1.0.0";

  private constructor() {}

  static getInstance(): ExportPipeline {
    if (!ExportPipeline.instance) {
      ExportPipeline.instance = new ExportPipeline();
    }
    return ExportPipeline.instance;
  }

  async exportPrompt(
    prompt: GeneratedPrompt,
    format: string,
    userEntitlements: any,
    isTrialUser: boolean = false
  ): Promise<ExportResult> {
    try {
      // Check entitlements for the requested format
      const canExport = this.checkExportEntitlements(format, userEntitlements);
      if (!canExport.allowed) {
        return {
          success: false,
          error: canExport.reason || "Export not allowed for your plan"
        };
      }

      let exportData: Buffer | string;
      let manifest: ExportManifest;

      switch (format.toLowerCase()) {
        case "txt":
          exportData = await this.exportAsText(prompt);
          manifest = this.createManifest(prompt, format, exportData, isTrialUser);
          break;
        
        case "md":
          exportData = await this.exportAsMarkdown(prompt);
          manifest = this.createManifest(prompt, format, exportData, isTrialUser);
          break;
        
        case "json":
          exportData = await this.exportAsJSON(prompt, isTrialUser);
          manifest = this.createManifest(prompt, format, exportData, isTrialUser);
          break;
        
        case "pdf":
          exportData = await this.exportAsPDF(prompt, isTrialUser);
          manifest = this.createManifest(prompt, format, exportData, isTrialUser);
          break;
        
        case "zip":
          exportData = await this.exportAsBundle(prompt, userEntitlements, isTrialUser);
          manifest = this.createManifest(prompt, format, exportData, isTrialUser);
          break;
        
        default:
          return {
            success: false,
            error: `Unsupported export format: ${format}`
          };
      }

      return {
        success: true,
        data: exportData,
        manifest
      };

    } catch (error) {
      console.error('Export error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Export failed'
      };
    }
  }

  private checkExportEntitlements(format: string, entitlements: any): { allowed: boolean; reason?: string } {
    switch (format.toLowerCase()) {
      case "txt":
        return { allowed: true }; // Free users can export as text
      
      case "md":
        return { 
          allowed: entitlements.canExportJSON || entitlements.planTier !== 'free',
          reason: "Markdown export requires Creator plan or higher"
        };
      
      case "json":
        return { 
          allowed: entitlements.canExportJSON || entitlements.planTier !== 'free',
          reason: "JSON export requires Creator plan or higher"
        };
      
      case "pdf":
        return { 
          allowed: entitlements.canExportPDF || ['pro', 'enterprise'].includes(entitlements.planTier),
          reason: "PDF export requires Pro plan or higher"
        };
      
      case "zip":
        return { 
          allowed: entitlements.canExportBundleZip || entitlements.planTier === 'enterprise',
          reason: "Bundle export requires Enterprise plan"
        };
      
      default:
        return { allowed: false, reason: "Unsupported format" };
    }
  }

  private async exportAsText(prompt: GeneratedPrompt): Promise<string> {
    return `# ${prompt.moduleName || 'Generated Prompt'}

## 7-Dimensional Configuration
- Domain: ${prompt.sevenDConfig.domain}
- Scale: ${prompt.sevenDConfig.scale}
- Urgency: ${prompt.sevenDConfig.urgency}
- Complexity: ${prompt.sevenDConfig.complexity}
- Resources: ${prompt.sevenDConfig.resources}
- Application: ${prompt.sevenDConfig.application}
- Output Format: ${prompt.sevenDConfig.outputFormat}
- Vector: ${prompt.sevenDConfig.vector}

## Generated Prompt
${prompt.content}

## Metadata
- Generated: ${prompt.timestamp.toISOString()}
- Tokens: ${prompt.tokens}
- Time to Answer: ${prompt.tta}s
- Module ID: ${prompt.moduleId}
- Session Hash: ${prompt.sessionHash}`;
  }

  private async exportAsMarkdown(prompt: GeneratedPrompt): Promise<string> {
    return `# ${prompt.moduleName || 'Generated Prompt'}

## Configuration Summary
| Parameter | Value |
|-----------|-------|
| Domain | ${prompt.sevenDConfig.domain} |
| Scale | ${prompt.sevenDConfig.scale} |
| Urgency | ${prompt.sevenDConfig.urgency} |
| Complexity | ${prompt.sevenDConfig.complexity} |
| Resources | ${prompt.sevenDConfig.resources} |
| Application | ${prompt.sevenDConfig.application} |
| Output Format | ${prompt.sevenDConfig.outputFormat} |
| Vector | ${prompt.sevenDConfig.vector} |

## Prompt Content
\`\`\`
${prompt.content}
\`\`\`

## Technical Details
- **Generated**: ${prompt.timestamp.toISOString()}
- **Tokens**: ${prompt.tokens}
- **TTA**: ${prompt.tta}s
- **Module**: ${prompt.moduleId}
- **Session**: ${prompt.sessionHash}
- **Hash**: ${prompt.hash}`;
  }

  private async exportAsJSON(prompt: GeneratedPrompt, isTrialUser: boolean): Promise<string> {
    const exportData = {
      prompt: prompt.content,
      sevenDConfig: prompt.sevenDConfig,
      metadata: {
        moduleId: prompt.moduleId,
        moduleName: prompt.moduleName,
        generatedAt: prompt.timestamp.toISOString(),
        tokens: prompt.tokens,
        tta: prompt.tta,
        hash: prompt.hash,
        sessionHash: prompt.sessionHash,
        watermark: isTrialUser ? "TRIAL_USER_EXPORT" : undefined
      }
    };

    if (isTrialUser) {
      exportData.metadata.watermark = "TRIAL_USER_EXPORT";
    }

    return JSON.stringify(exportData, null, 2);
  }

  private async exportAsPDF(prompt: GeneratedPrompt, isTrialUser: boolean): Promise<Buffer> {
    // Mock PDF generation - in a real app, you'd use a library like puppeteer or jsPDF
    const pdfContent = `PDF Export - ${prompt.moduleName || 'Prompt'}

Generated: ${new Date().toISOString()}
Module: ${prompt.moduleId}
Vector: ${prompt.vector}

${isTrialUser ? 'TRIAL VERSION - WATERMARKED' : ''}

${prompt.content}

Configuration:
- Domain: ${prompt.sevenDConfig.domain}
- Scale: ${prompt.sevenDConfig.scale}
- Urgency: ${prompt.sevenDConfig.urgency}
- Complexity: ${prompt.sevenDConfig.complexity}
- Resources: ${prompt.sevenDConfig.resources}
- Application: ${prompt.sevenDConfig.application}
- Output: ${prompt.sevenDConfig.output}

${isTrialUser ? 'Upgrade to Pro or Enterprise for full PDF features' : ''}`;

    return Buffer.from(pdfContent, 'utf-8');
  }

  private async exportAsBundle(
    prompt: GeneratedPrompt, 
    entitlements: any, 
    isTrialUser: boolean
  ): Promise<Buffer> {
    // Create all export formats first
    const txt = await this.exportAsText(prompt);
    const md = await this.exportAsMarkdown(prompt);
    const json = await this.exportAsJSON(prompt, isTrialUser);
    const pdf = await this.exportAsPDF(prompt, isTrialUser);
    
    // Create a comprehensive bundle with all formats
    const bundle: any = {
      formats: {
        txt,
        md,
        json,
        pdf
      }
    };

    // Create manifest after all data is available
    const manifest = this.createManifest(prompt, "bundle", Buffer.from(JSON.stringify(bundle)), isTrialUser);
    bundle.manifest = manifest;

    // In production, you'd use a library like JSZip to create actual ZIP files
    // For now, we'll return a JSON representation
    return Buffer.from(JSON.stringify(bundle, null, 2));
  }

  private createManifest(
    prompt: GeneratedPrompt, 
    format: string, 
    exportData: Buffer | string, 
    isTrialUser: boolean
  ): ExportManifest {
    const dataSize = Buffer.isBuffer(exportData) ? exportData.length : Buffer.byteLength(exportData, 'utf-8');
    const checksum = this.calculateChecksum(exportData);

    return {
      version: this.VERSION,
      timestamp: new Date().toISOString(),
      promptId: prompt.id,
      moduleId: prompt.moduleId.toString(),
      sevenDConfig: prompt.sevenDConfig,
      metadata: {
        generatedAt: prompt.timestamp.toISOString(),
        tokens: prompt.tokens,
        tta: prompt.tta,
        exportFormat: format,
        watermark: isTrialUser ? "TRIAL_USER_EXPORT" : undefined
      },
      files: [{
        name: `prompt-${prompt.id}.${format}`,
        type: this.getMimeType(format),
        size: dataSize,
        checksum: checksum
      }]
    };
  }

  private calculateChecksum(data: Buffer | string): string {
    const hash = createHash('sha256');
    if (Buffer.isBuffer(data)) {
      hash.update(data);
    } else {
      hash.update(data, 'utf-8');
    }
    return hash.digest('hex');
  }

  private getMimeType(format: string): string {
    switch (format.toLowerCase()) {
      case "txt": return "text/plain";
      case "md": return "text/markdown";
      case "json": return "application/json";
      case "pdf": return "application/pdf";
      case "zip": return "application/zip";
      default: return "application/octet-stream";
    }
  }

  // Utility method to get available export formats for a user
  getAvailableFormats(entitlements: any): string[] {
    const formats = ["txt"]; // Free users always get text
    
    if (entitlements.canExportJSON || entitlements.planTier !== 'free') {
      formats.push("md", "json");
    }
    
    if (entitlements.canExportPDF || ['pro', 'enterprise'].includes(entitlements.planTier)) {
      formats.push("pdf");
    }
    
    if (entitlements.canExportBundleZip || entitlements.planTier === 'enterprise') {
      formats.push("zip");
    }
    
    return formats;
  }
}
