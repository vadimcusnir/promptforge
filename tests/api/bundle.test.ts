import { describe, it, expect, beforeEach } from '@jest/globals';
import { generateBundle, type BundleContent } from '../../lib/server/bundle';

describe('Bundle Generation', () => {
  let mockBundleContent: BundleContent;

  beforeEach(() => {
    mockBundleContent = {
      prompt: 'Test prompt for bundle generation',
      sevenD: {
        domain: 'fintech',
        scale: 'enterprise',
        urgency: 'planned',
        complexity: 'expert',
        resources: 'full_stack_org',
        application: 'audit',
        output_format: 'spec',
        signature_7d: 'abc123def456789',
      },
      scores: {
        clarity: 85,
        execution: 90,
        ambiguity: 80,
        business_fit: 88,
        composite: 86,
      },
      metadata: {
        runId: '123e4567-e89b-12d3-a456-426614174000',
        moduleId: 'M07',
        orgId: 'org-123',
        userId: 'user-456',
        createdAt: '2024-01-01T00:00:00Z',
        version: '1.0.0',
      },
      telemetry: {
        tokens_used: 1500,
        duration_ms: 5000,
        cost_usd: 0.05,
      },
    };
  });

  describe('generateBundle', () => {
    it('should generate TXT format correctly', async () => {
      const result = await generateBundle(mockBundleContent, ['txt']);

      expect(result.files.has('prompt.txt')).toBe(true);
      expect(result.files.has('manifest.json')).toBe(true);
      expect(result.files.has('checksum.txt')).toBe(true);
      expect(result.files.has('telemetry.json')).toBe(true);

      const txtContent = result.files.get('prompt.txt')?.toString('utf-8');
      expect(txtContent).toContain('# PROMPT');
      expect(txtContent).toContain(mockBundleContent.prompt);
      expect(txtContent).toContain('Domain: fintech');
      expect(txtContent).toContain('Clarity: 85/100');
    });

    it('should generate MD format correctly', async () => {
      const result = await generateBundle(mockBundleContent, ['md']);

      expect(result.files.has('prompt.md')).toBe(true);

      const mdContent = result.files.get('prompt.md')?.toString('utf-8');
      expect(mdContent).toContain('# Prompt Configuration');
      expect(mdContent).toContain('```');
      expect(mdContent).toContain('| Domain | fintech |');
      expect(mdContent).toContain('| Clarity | 85/100 |');
    });

    it('should generate JSON format correctly', async () => {
      const result = await generateBundle(mockBundleContent, ['json']);

      expect(result.files.has('prompt.json')).toBe(true);

      const jsonContent = result.files.get('prompt.json')?.toString('utf-8');
      const jsonData = JSON.parse(jsonContent!);

      expect(jsonData.prompt).toBe(mockBundleContent.prompt);
      expect(jsonData.seven_d).toEqual(mockBundleContent.sevenD);
      expect(jsonData.scores).toEqual(mockBundleContent.scores);
      expect(jsonData.metadata.license_notice).toBeDefined();
    });

    it('should generate multiple formats', async () => {
      const result = await generateBundle(mockBundleContent, ['txt', 'md', 'json']);

      expect(result.files.has('prompt.txt')).toBe(true);
      expect(result.files.has('prompt.md')).toBe(true);
      expect(result.files.has('prompt.json')).toBe(true);
      expect(result.files.has('manifest.json')).toBe(true);
      expect(result.files.has('checksum.txt')).toBe(true);
    });

    it('should generate ZIP format when requested', async () => {
      const result = await generateBundle(mockBundleContent, ['zip']);

      expect(result.files.size).toBe(1);
      const zipFileName = Array.from(result.files.keys())[0];
      expect(zipFileName).toMatch(/^bundle_[a-f0-9]{12}\.zip$/);

      const zipBuffer = result.files.get(zipFileName);
      expect(zipBuffer).toBeDefined();
      expect(zipBuffer!.length).toBeGreaterThan(0);
    });

    it('should include telemetry file', async () => {
      const result = await generateBundle(mockBundleContent, ['txt']);

      expect(result.files.has('telemetry.json')).toBe(true);

      const telemetryContent = result.files.get('telemetry.json')?.toString('utf-8');
      const telemetryData = JSON.parse(telemetryContent!);

      expect(telemetryData.run_id).toBe(mockBundleContent.metadata.runId);
      expect(telemetryData.module_id).toBe(mockBundleContent.metadata.moduleId);
      expect(telemetryData.performance).toEqual(mockBundleContent.telemetry);
      expect(telemetryData.scores).toEqual(mockBundleContent.scores);
    });

    it('should generate valid manifest', async () => {
      const result = await generateBundle(mockBundleContent, ['txt', 'md']);

      expect(result.manifest.version).toBe('1.0.0');
      expect(result.manifest.bundle_id).toBeDefined();
      expect(result.manifest.run_id).toBe(mockBundleContent.metadata.runId);
      expect(result.manifest.formats).toEqual(['txt', 'md', 'json', 'txt']);
      expect(result.manifest.files).toHaveLength(4); // txt, md, manifest, telemetry, checksum
      expect(result.manifest.metadata.module_id).toBe(mockBundleContent.metadata.moduleId);
      expect(result.manifest.metadata.seven_d_signature).toBe(mockBundleContent.sevenD.signature_7d);
      expect(result.manifest.metadata.score_total).toBe(mockBundleContent.scores?.composite);
      expect(result.manifest.metadata.license_notice).toBeDefined();
    });

    it('should generate consistent checksums', async () => {
      const result1 = await generateBundle(mockBundleContent, ['txt']);
      const result2 = await generateBundle(mockBundleContent, ['txt']);

      // Same content should produce same checksums
      expect(result1.bundleChecksum).toBe(result2.bundleChecksum);
      expect(result1.manifest.checksums.individual).toEqual(result2.manifest.checksums.individual);
    });

    it('should generate different checksums for different content', async () => {
      const modifiedContent = {
        ...mockBundleContent,
        prompt: 'Modified prompt content',
      };

      const result1 = await generateBundle(mockBundleContent, ['txt']);
      const result2 = await generateBundle(modifiedContent, ['txt']);

      expect(result1.bundleChecksum).not.toBe(result2.bundleChecksum);
    });

    it('should handle white label option', async () => {
      const result = await generateBundle(mockBundleContent, ['txt'], true);

      const txtContent = result.files.get('prompt.txt')?.toString('utf-8');
      expect(txtContent).toContain('Generated by AI Prompt Engineering Platform');
      expect(txtContent).not.toContain('PromptForge');
      expect(txtContent).not.toContain('ChatGPT Prompting');
    });

    it('should throw error for unsupported format', async () => {
      await expect(
        generateBundle(mockBundleContent, ['unsupported' as any])
      ).rejects.toThrow('Unsupported format: unsupported');
    });

    it('should handle content without scores', async () => {
      const contentWithoutScores = {
        ...mockBundleContent,
        scores: undefined,
      };

      const result = await generateBundle(contentWithoutScores, ['txt']);

      expect(result.files.has('prompt.txt')).toBe(true);

      const txtContent = result.files.get('prompt.txt')?.toString('utf-8');
      expect(txtContent).toContain('# PROMPT');
      expect(txtContent).toContain('# CONFIGURATION');
      expect(txtContent).not.toContain('# SCORES');
    });

    it('should handle content without telemetry', async () => {
      const contentWithoutTelemetry = {
        ...mockBundleContent,
        telemetry: undefined,
      };

      const result = await generateBundle(contentWithoutTelemetry, ['txt']);

      expect(result.files.has('prompt.txt')).toBe(true);
      expect(result.files.has('telemetry.json')).toBe(false);
    });
  });

  describe('Bundle Validation', () => {
    it('should create valid manifest structure', async () => {
      const result = await generateBundle(mockBundleContent, ['txt', 'json']);

      const manifest = result.manifest;

      // Check required fields
      expect(manifest.version).toBe('1.0.0');
      expect(manifest.bundle_id).toMatch(/^[a-f0-9]{12}$/);
      expect(manifest.run_id).toBe(mockBundleContent.metadata.runId);
      expect(manifest.created_at).toBeDefined();
      expect(new Date(manifest.created_at)).toBeInstanceOf(Date);

      // Check files array
      expect(Array.isArray(manifest.files)).toBe(true);
      manifest.files.forEach(file => {
        expect(file.name).toBeDefined();
        expect(typeof file.size).toBe('number');
        expect(file.checksum).toMatch(/^[a-f0-9]{64}$/); // SHA256
      });

      // Check checksums
      expect(manifest.checksums.individual).toBeDefined();
      expect(typeof manifest.checksums.individual).toBe('object');
      expect(manifest.checksums.bundle).toBeDefined();
    });

    it('should generate valid checksum file', async () => {
      const result = await generateBundle(mockBundleContent, ['txt']);

      expect(result.files.has('checksum.txt')).toBe(true);

      const checksumContent = result.files.get('checksum.txt')?.toString('utf-8');
      expect(checksumContent).toContain('SHA256 Checksums');
      expect(checksumContent).toContain('Individual Files:');
      expect(checksumContent).toContain('Bundle Checksum:');
      expect(checksumContent).toMatch(/[a-f0-9]{64}/); // Contains SHA256 hashes
    });
  });
});
