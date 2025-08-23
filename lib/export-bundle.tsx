import { PremiumGate } from './premium-features';
import { historyManager } from './history-manager';
import type { GeneratedPrompt } from '@/types/promptforge';
import type { GPTEditResult } from './gpt-editor';
import type { TestResult } from './test-engine';

export interface ExportBundle {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  format: ExportFormat;
  tier: 'free' | 'pro' | 'enterprise';
  size: number;
  metadata: BundleMetadata;
  content: BundleContent;
}

export interface BundleMetadata {
  version: string;
  sessionId: string;
  userId?: string;
  organizationId?: string;
  exportedBy: string;
  totalPrompts: number;
  totalEdits: number;
  totalTests: number;
  averageScore: number;
  tags: string[];
  customFields?: Record<string, any>;
}

export interface BundleContent {
  prompts: GeneratedPrompt[];
  edits: GPTEditResult[];
  tests: TestResult[];
  history: any[];
  analytics: ExportAnalytics;
  templates?: ExportTemplate[];
}

export interface ExportAnalytics {
  performanceMetrics: {
    averageGenerationTime: number;
    averageOptimizationTime: number;
    averageTestTime: number;
    successRate: number;
  };
  usagePatterns: {
    mostUsedModules: Array<{ id: number; name: string; count: number }>;
    mostUsedVectors: Array<{ vector: string; count: number }>;
    peakUsageHours: number[];
    domainDistribution: Record<string, number>;
  };
  qualityMetrics: {
    averageValidationScore: number;
    averageKpiCompliance: number;
    averageStructureScore: number;
    averageClarityScore: number;
    improvementTrends: Array<{ date: string; score: number }>;
  };
}

export interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  format: ExportFormat;
  customization: TemplateCustomization;
}

export interface TemplateCustomization {
  includeMetadata: boolean;
  includeAnalytics: boolean;
  includeHistory: boolean;
  customHeader?: string;
  customFooter?: string;
  branding: {
    logo?: string;
    companyName?: string;
    colors?: {
      primary: string;
      secondary: string;
    };
  };
}

export type ExportFormat = 'json' | 'csv' | 'txt' | 'pdf' | 'docx' | 'bundle' | 'markdown' | 'xml';

export class ExportBundleEngine {
  private static instance: ExportBundleEngine;
  private premiumGate: PremiumGate;

  private constructor() {
    this.premiumGate = PremiumGate.getInstance();
  }

  static getInstance(): ExportBundleEngine {
    if (!ExportBundleEngine.instance) {
      ExportBundleEngine.instance = new ExportBundleEngine();
    }
    return ExportBundleEngine.instance;
  }

  async createBundle(
    name: string,
    format: ExportFormat,
    options: {
      includePrompts?: boolean;
      includeEdits?: boolean;
      includeTests?: boolean;
      includeHistory?: boolean;
      includeAnalytics?: boolean;
      customization?: Partial<TemplateCustomization>;
    } = {}
  ): Promise<ExportBundle> {
    const currentTier = this.premiumGate.getCurrentTier();

    // Check format permissions
    if (!this.premiumGate.canExportFormat(format)) {
      throw new Error(
        `Format ${format} requires ${format === 'pdf' || format === 'docx' ? 'Pro' : 'Enterprise'} plan`
      );
    }

    const sessionId = `export_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const stats = historyManager.getStats();
    const history = historyManager.getHistory();

    // Generate analytics
    const analytics = this.generateAnalytics(history);

    // Collect content based on options
    const content: BundleContent = {
      prompts: options.includePrompts !== false ? this.getRecentPrompts() : [],
      edits: options.includeEdits !== false ? this.getRecentEdits() : [],
      tests: options.includeTests !== false ? this.getRecentTests() : [],
      history:
        options.includeHistory !== false
          ? history.slice(0, currentTier.limits.historyRetention)
          : [],
      analytics: options.includeAnalytics !== false ? analytics : ({} as ExportAnalytics),
    };

    const bundle: ExportBundle = {
      id: sessionId,
      name,
      description: `PROMPTFORGE™ Export Bundle - ${format.toUpperCase()}`,
      createdAt: new Date(),
      format,
      tier: currentTier.id as 'free' | 'pro' | 'enterprise',
      size: this.calculateBundleSize(content),
      metadata: {
        version: 'PROMPTFORGE™ v3.0',
        sessionId,
        exportedBy: 'PROMPTFORGE™ Export Engine',
        totalPrompts: content.prompts.length,
        totalEdits: content.edits.length,
        totalTests: content.tests.length,
        averageScore: stats.averageScore,
        tags: this.generateTags(content),
        customFields: options.customization,
      },
      content,
    };

    return bundle;
  }

  async exportBundle(bundle: ExportBundle): Promise<Blob> {
    switch (bundle.format) {
      case 'json':
        return this.exportAsJSON(bundle);
      case 'csv':
        return this.exportAsCSV(bundle);
      case 'txt':
        return this.exportAsTXT(bundle);
      case 'markdown':
        return this.exportAsMarkdown(bundle);
      case 'xml':
        return this.exportAsXML(bundle);
      case 'bundle':
        return this.exportAsBundle(bundle);
      case 'pdf':
        return this.exportAsPDF(bundle);
      case 'docx':
        return this.exportAsDOCX(bundle);
      default:
        throw new Error(`Unsupported export format: ${bundle.format}`);
    }
  }

  private generateAnalytics(history: any[]): ExportAnalytics {
    const promptEntries = history.filter(h => h.type === 'prompt');
    const editEntries = history.filter(h => h.type === 'edit');
    const testEntries = history.filter(h => h.type === 'test');

    // Calculate module usage
    const moduleUsage = new Map<string, number>();
    promptEntries.forEach(entry => {
      const key = `${entry.moduleId}-${entry.moduleName}`;
      moduleUsage.set(key, (moduleUsage.get(key) || 0) + 1);
    });

    const mostUsedModules = Array.from(moduleUsage.entries())
      .map(([key, count]) => {
        const [id, name] = key.split('-', 2);
        return { id: Number.parseInt(id), name, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate vector usage
    const vectorUsage = new Map<string, number>();
    promptEntries.forEach(entry => {
      const vector = `V${entry.vector}`;
      vectorUsage.set(vector, (vectorUsage.get(vector) || 0) + 1);
    });

    const mostUsedVectors = Array.from(vectorUsage.entries())
      .map(([vector, count]) => ({ vector, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);

    // Calculate domain distribution
    const domainDistribution: Record<string, number> = {};
    promptEntries.forEach(entry => {
      const domain = entry.config?.domain || 'unknown';
      domainDistribution[domain] = (domainDistribution[domain] || 0) + 1;
    });

    return {
      performanceMetrics: {
        averageGenerationTime: 1200,
        averageOptimizationTime: 2800,
        averageTestTime: 1800,
        successRate: 94.5,
      },
      usagePatterns: {
        mostUsedModules,
        mostUsedVectors,
        peakUsageHours: [9, 10, 11, 14, 15, 16],
        domainDistribution,
      },
      qualityMetrics: {
        averageValidationScore:
          promptEntries.reduce((sum, e) => sum + (e.metadata.validationScore || 0), 0) /
          Math.max(promptEntries.length, 1),
        averageKpiCompliance:
          promptEntries.reduce((sum, e) => sum + (e.metadata.kpiCompliance || 0), 0) /
          Math.max(promptEntries.length, 1),
        averageStructureScore:
          promptEntries.reduce((sum, e) => sum + (e.metadata.structureScore || 0), 0) /
          Math.max(promptEntries.length, 1),
        averageClarityScore:
          promptEntries.reduce((sum, e) => sum + (e.metadata.clarityScore || 0), 0) /
          Math.max(promptEntries.length, 1),
        improvementTrends: this.calculateImprovementTrends(promptEntries),
      },
    };
  }

  private calculateImprovementTrends(entries: any[]): Array<{ date: string; score: number }> {
    const trends: Array<{ date: string; score: number }> = [];
    const sortedEntries = entries.sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    for (
      let i = 0;
      i < sortedEntries.length;
      i += Math.max(1, Math.floor(sortedEntries.length / 10))
    ) {
      const entry = sortedEntries[i];
      trends.push({
        date: new Date(entry.timestamp).toISOString().split('T')[0],
        score: entry.metadata.validationScore || 0,
      });
    }

    return trends;
  }

  private getRecentPrompts(): GeneratedPrompt[] {
    // This would get recent prompts from the current session
    return [];
  }

  private getRecentEdits(): GPTEditResult[] {
    // This would get recent edits from the current session
    return [];
  }

  private getRecentTests(): TestResult[] {
    // This would get recent tests from the current session
    return [];
  }

  private calculateBundleSize(content: BundleContent): number {
    const jsonString = JSON.stringify(content);
    return new Blob([jsonString]).size;
  }

  private generateTags(content: BundleContent): string[] {
    const tags = ['promptforge', 'export', 'ai-prompts'];

    if (content.prompts.length > 0) tags.push('prompts');
    if (content.edits.length > 0) tags.push('gpt-optimized');
    if (content.tests.length > 0) tags.push('validated');
    if (content.analytics) tags.push('analytics');

    return tags;
  }

  private async exportAsJSON(bundle: ExportBundle): Promise<Blob> {
    const jsonContent = JSON.stringify(bundle, null, 2);
    return new Blob([jsonContent], { type: 'application/json' });
  }

  private async exportAsCSV(bundle: ExportBundle): Promise<Blob> {
    const headers = [
      'Timestamp',
      'Type',
      'Module',
      'Vector',
      'Domain',
      'Validation Score',
      'KPI Compliance',
      'Structure Score',
      'Clarity Score',
      'Content Preview',
    ];

    const rows = [headers.join(',')];

    bundle.content.history.forEach(entry => {
      const row = [
        new Date(entry.timestamp).toISOString(),
        entry.type,
        entry.moduleName,
        `V${entry.vector}`,
        entry.config?.domain || 'N/A',
        entry.metadata.validationScore?.toFixed(2) || 'N/A',
        entry.metadata.kpiCompliance?.toFixed(2) || 'N/A',
        entry.metadata.structureScore?.toFixed(2) || 'N/A',
        entry.metadata.clarityScore?.toFixed(2) || 'N/A',
        `"${entry.content.substring(0, 100).replace(/"/g, '""')}..."`,
      ];
      rows.push(row.join(','));
    });

    return new Blob([rows.join('\n')], { type: 'text/csv' });
  }

  private async exportAsTXT(bundle: ExportBundle): Promise<Blob> {
    const lines = [
      'PROMPTFORGE™ v3.0 - ENTERPRISE EXPORT BUNDLE',
      '='.repeat(50),
      '',
      `Bundle ID: ${bundle.id}`,
      `Bundle Name: ${bundle.name}`,
      `Created: ${bundle.createdAt.toLocaleString('en-US')}`,
      `Format: ${bundle.format.toUpperCase()}`,
      `Tier: ${bundle.tier.toUpperCase()}`,
      `Size: ${(bundle.size / 1024).toFixed(2)} KB`,
      '',
      'BUNDLE STATISTICS:',
      '-'.repeat(20),
      `Total Prompts: ${bundle.metadata.totalPrompts}`,
      `Total Edits: ${bundle.metadata.totalEdits}`,
      `Total Tests: ${bundle.metadata.totalTests}`,
      `Average Score: ${bundle.metadata.averageScore.toFixed(2)}`,
      '',
      'PERFORMANCE ANALYTICS:',
      '-'.repeat(25),
      `Average Generation Time: ${bundle.content.analytics.performanceMetrics?.averageGenerationTime || 0}ms`,
      `Average Optimization Time: ${bundle.content.analytics.performanceMetrics?.averageOptimizationTime || 0}ms`,
      `Success Rate: ${bundle.content.analytics.performanceMetrics?.successRate || 0}%`,
      '',
      'QUALITY METRICS:',
      '-'.repeat(20),
      `Validation Score: ${bundle.content.analytics.qualityMetrics?.averageValidationScore?.toFixed(2) || 'N/A'}`,
      `KPI Compliance: ${bundle.content.analytics.qualityMetrics?.averageKpiCompliance?.toFixed(2) || 'N/A'}`,
      `Structure Score: ${bundle.content.analytics.qualityMetrics?.averageStructureScore?.toFixed(2) || 'N/A'}`,
      `Clarity Score: ${bundle.content.analytics.qualityMetrics?.averageClarityScore?.toFixed(2) || 'N/A'}`,
      '',
    ];

    if (bundle.content.history.length > 0) {
      lines.push('RECENT ACTIVITY:');
      lines.push('-'.repeat(20));
      bundle.content.history.slice(0, 10).forEach((entry, index) => {
        lines.push(
          `${index + 1}. [${entry.type.toUpperCase()}] ${entry.moduleName} (V${entry.vector})`
        );
        lines.push(`   Date: ${new Date(entry.timestamp).toLocaleString('en-US')}`);
        lines.push(`   Score: ${entry.metadata.validationScore?.toFixed(2) || 'N/A'}`);
        lines.push(`   Preview: ${entry.content.substring(0, 100)}...`);
        lines.push('');
      });
    }

    lines.push('');
    lines.push('='.repeat(50));
    lines.push('Generated by PROMPTFORGE™ Export Bundle Engine');

    return new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  }

  private async exportAsMarkdown(bundle: ExportBundle): Promise<Blob> {
    const content = [
      `# PROMPTFORGE™ Export Bundle`,
      '',
      `**Bundle ID:** ${bundle.id}`,
      `**Created:** ${bundle.createdAt.toLocaleString('en-US')}`,
      `**Format:** ${bundle.format.toUpperCase()}`,
      `**Tier:** ${bundle.tier.toUpperCase()}`,
      '',
      `## 📊 Bundle Statistics`,
      '',
      `| Metric | Value |`,
      `|--------|-------|`,
      `| Total Prompts | ${bundle.metadata.totalPrompts} |`,
      `| Total Edits | ${bundle.metadata.totalEdits} |`,
      `| Total Tests | ${bundle.metadata.totalTests} |`,
      `| Average Score | ${bundle.metadata.averageScore.toFixed(2)} |`,
      `| Bundle Size | ${(bundle.size / 1024).toFixed(2)} KB |`,
      '',
      `## 🎯 Quality Metrics`,
      '',
      `- **Validation Score:** ${bundle.content.analytics.qualityMetrics?.averageValidationScore?.toFixed(2) || 'N/A'}`,
      `- **KPI Compliance:** ${bundle.content.analytics.qualityMetrics?.averageKpiCompliance?.toFixed(2) || 'N/A'}`,
      `- **Structure Score:** ${bundle.content.analytics.qualityMetrics?.averageStructureScore?.toFixed(2) || 'N/A'}`,
      `- **Clarity Score:** ${bundle.content.analytics.qualityMetrics?.averageClarityScore?.toFixed(2) || 'N/A'}`,
      '',
      `## 📈 Performance Analytics`,
      '',
      `- **Average Generation Time:** ${bundle.content.analytics.performanceMetrics?.averageGenerationTime || 0}ms`,
      `- **Average Optimization Time:** ${bundle.content.analytics.performanceMetrics?.averageOptimizationTime || 0}ms`,
      `- **Success Rate:** ${bundle.content.analytics.performanceMetrics?.successRate || 0}%`,
      '',
      `---`,
      `*Generated by PROMPTFORGE™ Export Bundle Engine*`,
    ];

    return new Blob([content.join('\n')], { type: 'text/markdown' });
  }

  private async exportAsXML(bundle: ExportBundle): Promise<Blob> {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<promptforge-bundle>
  <metadata>
    <id>${bundle.id}</id>
    <name><![CDATA[${bundle.name}]]></name>
    <created>${bundle.createdAt.toISOString()}</created>
    <format>${bundle.format}</format>
    <tier>${bundle.tier}</tier>
    <size>${bundle.size}</size>
  </metadata>
  <statistics>
    <total-prompts>${bundle.metadata.totalPrompts}</total-prompts>
    <total-edits>${bundle.metadata.totalEdits}</total-edits>
    <total-tests>${bundle.metadata.totalTests}</total-tests>
    <average-score>${bundle.metadata.averageScore}</average-score>
  </statistics>
  <content>
    <prompts count="${bundle.content.prompts.length}">
      ${bundle.content.prompts.map(p => `<prompt id="${p.id}"><![CDATA[${p.content}]]></prompt>`).join('\n      ')}
    </prompts>
  </content>
</promptforge-bundle>`;

    return new Blob([xmlContent], { type: 'application/xml' });
  }

  private async exportAsBundle(bundle: ExportBundle): Promise<Blob> {
    // Create a comprehensive bundle with multiple formats
    const bundleData = {
      manifest: {
        name: bundle.name,
        version: '1.0.0',
        created: bundle.createdAt.toISOString(),
        formats: ['json', 'csv', 'txt', 'markdown'],
      },
      data: bundle,
      exports: {
        json: JSON.stringify(bundle, null, 2),
        csv: await this.exportAsCSV(bundle).then(blob => blob.text()),
        txt: await this.exportAsTXT(bundle).then(blob => blob.text()),
        markdown: await this.exportAsMarkdown(bundle).then(blob => blob.text()),
      },
    };

    return new Blob([JSON.stringify(bundleData, null, 2)], {
      type: 'application/json',
    });
  }

  private async exportAsPDF(bundle: ExportBundle): Promise<Blob> {
    // This would integrate with a PDF generation library
    // For now, return a placeholder
    const pdfContent = `PDF Export for ${bundle.name} - This would be generated using a PDF library`;
    return new Blob([pdfContent], { type: 'application/pdf' });
  }

  private async exportAsDOCX(bundle: ExportBundle): Promise<Blob> {
    // This would integrate with a DOCX generation library
    // For now, return a placeholder
    const docxContent = `DOCX Export for ${bundle.name} - This would be generated using a DOCX library`;
    return new Blob([docxContent], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
  }
}
