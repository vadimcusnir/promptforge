// PromptForge v3 - Module Versioning System
// Management versiuni active în UI cu rollback și A/B testing

import { createClient } from '@supabase/supabase-js';
import { type Domain, type SevenD } from './ruleset';

// SACF - Development mode fallback
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://dev-placeholder.supabase.co';
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dev-placeholder';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

export interface ModuleVersion {
  id: string;
  module_id: string;
  version: string; // Semantic versioning: 1.0.0, 1.1.0, 2.0.0
  version_type: 'major' | 'minor' | 'patch' | 'preview' | 'beta' | 'alpha';
  status: 'draft' | 'review' | 'active' | 'deprecated' | 'archived';
  
  // Content
  name: string;
  description: string;
  content: string;
  parameters: Record<string, any>;
  examples: Array<{
    title: string;
    input: string;
    output: string;
    notes?: string;
  }>;
  
  // Metadata
  changelog: string;
  breaking_changes: string[];
  new_features: string[];
  bug_fixes: string[];
  performance_improvements: string[];
  
  // Configuration
  seven_d_defaults: Partial<SevenD>;
  domain_specific: Record<Domain, Partial<SevenD>>;
  guardrails: string[];
  evaluation_criteria: Array<{
    metric: string;
    weight: number;
    description: string;
  }>;
  
  // Testing
  test_results: {
    automated_tests_passed: boolean;
    manual_review_passed: boolean;
    performance_score: number;
    quality_score: number;
    security_score: number;
  };
  
  // Deployment
  deployment_strategy: 'immediate' | 'gradual' | 'canary' | 'blue_green';
  rollout_percentage: number; // Pentru gradual/canary
  target_audience?: string; // Pentru A/B testing
  
  // Tracking
  created_by: string;
  reviewed_by?: string;
  approved_by?: string;
  created_at: string;
  updated_at: string;
  activated_at?: string;
  deprecated_at?: string;
  
  // Usage metrics
  usage_stats: {
    total_runs: number;
    successful_runs: number;
    failed_runs: number;
    average_score: number;
    user_satisfaction: number;
    performance_metrics: Record<string, number>;
  };
}

export interface VersionComparison {
  current_version: string;
  new_version: string;
  changes: {
    breaking: string[];
    new_features: string[];
    improvements: string[];
    bug_fixes: string[];
  };
  risk_assessment: {
    risk_level: 'low' | 'medium' | 'high' | 'critical';
    risk_factors: string[];
    mitigation_strategies: string[];
  };
  migration_guide: string;
  rollback_plan: string;
}

export interface VersioningPolicy {
  org_id: string;
  
  // Versioning rules
  auto_versioning: boolean;
  require_review: boolean;
  require_approval: boolean;
  allow_preview_versions: boolean;
  
  // Deployment rules
  deployment_approval_required: boolean;
  canary_deployment_enabled: boolean;
  rollback_threshold: number; // % failed runs pentru auto-rollback
  
  // Quality gates
  minimum_quality_score: number;
  minimum_performance_score: number;
  minimum_security_score: number;
  
  // Rollout strategy
  default_rollout_strategy: 'immediate' | 'gradual' | 'canary';
  gradual_rollout_steps: number[];
  canary_duration_hours: number;
  
  // Monitoring
  monitoring_enabled: boolean;
  alert_thresholds: {
    error_rate: number;
    performance_degradation: number;
    user_satisfaction_drop: number;
  };
  
  created_at: string;
  updated_at: string;
}

class ModuleVersioningManager {
  private static instance: ModuleVersioningManager;
  private cache: Map<string, { versions: ModuleVersion[]; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 2 * 60 * 1000; // 2 minutes

  private constructor() {}

  public static getInstance(): ModuleVersioningManager {
    if (!ModuleVersioningManager.instance) {
      ModuleVersioningManager.instance = new ModuleVersioningManager();
    }
    return ModuleVersioningManager.instance;
  }

  // Obține toate versiunile unui module
  async getModuleVersions(moduleId: string, orgId?: string): Promise<ModuleVersion[]> {
    const cacheKey = `${moduleId}-${orgId || 'global'}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.versions;
    }

    if (SUPABASE_URL.includes('dev-placeholder')) {
      // Development mode - return mock versions
      const mockVersions: ModuleVersion[] = [
        {
          id: 'v1-0-0',
          module_id: moduleId,
          version: '1.0.0',
          version_type: 'major',
          status: 'active',
          name: 'Initial Release',
          description: 'First stable version of the module',
          content: 'Mock module content for version 1.0.0',
          parameters: { param1: 'default', param2: 100 },
          examples: [
            {
              title: 'Basic Usage',
              input: 'Sample input for v1.0.0',
              output: 'Expected output for v1.0.0'
            }
          ],
          changelog: 'Initial release with core functionality',
          breaking_changes: [],
          new_features: ['Core functionality', 'Basic parameters'],
          bug_fixes: [],
          performance_improvements: [],
          seven_d_defaults: { domain: 'general', complexity: 'standard' },
          domain_specific: {},
          guardrails: ['Content safety', 'Input validation'],
          evaluation_criteria: [
            { metric: 'Clarity', weight: 0.4, description: 'How clear is the output' },
            { metric: 'Relevance', weight: 0.6, description: 'How relevant is the response' }
          ],
          test_results: {
            automated_tests_passed: true,
            manual_review_passed: true,
            performance_score: 85,
            quality_score: 90,
            security_score: 95
          },
          deployment_strategy: 'immediate',
          rollout_percentage: 100,
          created_by: 'dev-user',
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          activated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          usage_stats: {
            total_runs: 1250,
            successful_runs: 1200,
            failed_runs: 50,
            average_score: 87.5,
            user_satisfaction: 4.2,
            performance_metrics: { response_time: 2.1, accuracy: 0.89 }
          }
        },
        {
          id: 'v1-1-0',
          module_id: moduleId,
          version: '1.1.0',
          version_type: 'minor',
          status: 'review',
          name: 'Enhanced Features',
          description: 'Added new features and improvements',
          content: 'Enhanced module content for version 1.1.0',
          parameters: { param1: 'default', param2: 100, param3: 'new' },
          examples: [
            {
              title: 'Basic Usage',
              input: 'Sample input for v1.1.0',
              output: 'Expected output for v1.1.0'
            },
            {
              title: 'New Feature Usage',
              input: 'Input using new param3',
              output: 'Output with enhanced features'
            }
          ],
          changelog: 'Added new parameter and improved examples',
          breaking_changes: [],
          new_features: ['New parameter support', 'Enhanced examples'],
          bug_fixes: ['Fixed parameter validation'],
          performance_improvements: ['Optimized content generation'],
          seven_d_defaults: { domain: 'general', complexity: 'standard' },
          domain_specific: {},
          guardrails: ['Content safety', 'Input validation', 'Enhanced security'],
          evaluation_criteria: [
            { metric: 'Clarity', weight: 0.4, description: 'How clear is the output' },
            { metric: 'Relevance', weight: 0.5, description: 'How relevant is the response' },
            { metric: 'Innovation', weight: 0.1, description: 'How innovative is the approach' }
          ],
          test_results: {
            automated_tests_passed: true,
            manual_review_passed: false,
            performance_score: 88,
            quality_score: 92,
            security_score: 96
          },
          deployment_strategy: 'canary',
          rollout_percentage: 25,
          created_by: 'dev-user',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          usage_stats: {
            total_runs: 0,
            successful_runs: 0,
            failed_runs: 0,
            average_score: 0,
            user_satisfaction: 0,
            performance_metrics: {}
          }
        }
      ];

      this.cache.set(cacheKey, { versions: mockVersions, timestamp: Date.now() });
      return mockVersions;
    }

    try {
      const { data, error } = await supabase
        .from('module_versions')
        .select('*')
        .eq('module_id', moduleId)
        .order('version', { ascending: false });

      if (error) throw error;

      const versions = data || [];
      this.cache.set(cacheKey, { versions, timestamp: Date.now() });
      return versions;

    } catch (error) {
      console.error('Failed to fetch module versions:', error);
      return [];
    }
  }

  // Obține versiunea activă a unui module
  async getActiveVersion(moduleId: string, orgId?: string): Promise<ModuleVersion | null> {
    const versions = await this.getModuleVersions(moduleId, orgId);
    return versions.find(v => v.status === 'active') || null;
  }

  // Creează o nouă versiune
  async createVersion(params: {
    moduleId: string;
    version: string;
    versionType: ModuleVersion['version_type'];
    name: string;
    description: string;
    content: string;
    parameters: Record<string, any>;
    examples: ModuleVersion['examples'];
    changelog: string;
    breakingChanges: string[];
    newFeatures: string[];
    bugFixes: string[];
    performanceImprovements: string[];
    sevenDDefaults: Partial<SevenD>;
    domainSpecific: Record<Domain, Partial<SevenD>>;
    guardrails: string[];
    evaluationCriteria: ModuleVersion['evaluation_criteria'];
    createdBy: string;
    deploymentStrategy?: ModuleVersion['deployment_strategy'];
    rolloutPercentage?: number;
  }): Promise<string> {
    if (SUPABASE_URL.includes('dev-placeholder')) {
      // Development mode - return mock ID
      console.log('Dev mode: Module version created', params);
      return 'dev-version-' + Date.now();
    }

    const version: Omit<ModuleVersion, 'id' | 'created_at' | 'updated_at' | 'usage_stats'> = {
      module_id: params.moduleId,
      version: params.version,
      version_type: params.versionType,
      status: 'draft',
      name: params.name,
      description: params.description,
      content: params.content,
      parameters: params.parameters,
      examples: params.examples,
      changelog: params.changelog,
      breaking_changes: params.breakingChanges,
      new_features: params.newFeatures,
      bug_fixes: params.bugFixes,
      performance_improvements: params.performanceImprovements,
      seven_d_defaults: params.sevenDDefaults,
      domain_specific: params.domainSpecific,
      guardrails: params.guardrails,
      evaluation_criteria: params.evaluationCriteria,
      test_results: {
        automated_tests_passed: false,
        manual_review_passed: false,
        performance_score: 0,
        quality_score: 0,
        security_score: 0
      },
      deployment_strategy: params.deploymentStrategy || 'immediate',
      rollout_percentage: params.rolloutPercentage || 100,
      created_by: params.createdBy
    };

    const { data, error } = await supabase
      .from('module_versions')
      .insert([version])
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to create module version: ${error.message}`);
    }

    // Clear cache
    this.clearCache(params.moduleId);

    return data.id;
  }

  // Activează o versiune
  async activateVersion(versionId: string, moduleId: string, orgId: string): Promise<void> {
    if (SUPABASE_URL.includes('dev-placeholder')) {
      console.log('Dev mode: Version activated', versionId);
      return;
    }

    // Verifică dacă utilizatorul are permisiuni
    const hasPermission = await this.checkVersioningPermission(orgId);
    if (!hasPermission) {
      throw new Error('FORBIDDEN: Versioning permission required');
    }

    // Deactivează versiunea curentă activă
    await supabase
      .from('module_versions')
      .update({ 
        status: 'deprecated',
        deprecated_at: new Date().toISOString()
      })
      .eq('module_id', moduleId)
      .eq('status', 'active');

    // Activează noua versiune
    const { error } = await supabase
      .from('module_versions')
      .update({ 
        status: 'active',
        activated_at: new Date().toISOString()
      })
      .eq('id', versionId);

    if (error) {
      throw new Error(`Failed to activate version: ${error.message}`);
    }

    // Clear cache
    this.clearCache(moduleId);
  }

  // Compară două versiuni
  async compareVersions(moduleId: string, version1: string, version2: string): Promise<VersionComparison> {
    const versions = await this.getModuleVersions(moduleId);
    const v1 = versions.find(v => v.version === version1);
    const v2 = versions.find(v => v.version === version2);

    if (!v1 || !v2) {
      throw new Error('One or both versions not found');
    }

    // Analizează diferențele
    const breaking = v2.breaking_changes;
    const newFeatures = v2.new_features.filter(f => !v1.new_features.includes(f));
    const improvements = v2.performance_improvements.filter(i => !v1.performance_improvements.includes(i));
    const bugFixes = v2.bug_fixes.filter(b => !v1.bug_fixes.includes(b));

    // Calculează riscul
    const riskLevel = this.calculateRiskLevel(breaking, newFeatures, v2.test_results);
    const riskFactors = this.identifyRiskFactors(breaking, newFeatures, v2.test_results);
    const mitigationStrategies = this.generateMitigationStrategies(riskLevel, riskFactors);

    return {
      current_version: v1.version,
      new_version: v2.version,
      changes: {
        breaking,
        new_features: newFeatures,
        improvements,
        bug_fixes: bugFixes
      },
      risk_assessment: {
        risk_level: riskLevel,
        risk_factors: riskFactors,
        mitigation_strategies: mitigationStrategies
      },
      migration_guide: this.generateMigrationGuide(breaking, newFeatures),
      rollback_plan: this.generateRollbackPlan(v1, v2)
    };
  }

  // Generează plan de rollback
  private generateRollbackPlan(fromVersion: ModuleVersion, toVersion: ModuleVersion): string {
    return `
# Rollback Plan: ${toVersion.version} → ${fromVersion.version}

## Immediate Actions
1. Deactivate ${toVersion.version}
2. Reactivate ${fromVersion.version}
3. Notify users of temporary service interruption

## Data Migration
- No data migration required (prompt versions are stateless)
- User sessions will continue with ${fromVersion.version}

## Communication
- Send rollback notification to all users
- Update status page
- Post-mortem analysis required

## Prevention
- Review deployment strategy
- Implement better testing procedures
- Consider gradual rollout for future versions
    `.trim();
  }

  // Generează ghid de migrare
  private generateMigrationGuide(breakingChanges: string[], newFeatures: string[]): string {
    if (breakingChanges.length === 0 && newFeatures.length === 0) {
      return 'No migration required - this is a drop-in replacement.';
    }

    let guide = '# Migration Guide\n\n';

    if (breakingChanges.length > 0) {
      guide += '## Breaking Changes\n\n';
      breakingChanges.forEach(change => {
        guide += `- ${change}\n`;
      });
      guide += '\n## Required Actions\n\n';
      guide += 'Review and update any custom implementations that depend on changed functionality.\n\n';
    }

    if (newFeatures.length > 0) {
      guide += '## New Features\n\n';
      newFeatures.forEach(feature => {
        guide += `- ${feature}\n`;
      });
      guide += '\n## Optional Enhancements\n\n';
      guide += 'Consider leveraging new features to improve your prompts.\n\n';
    }

    return guide;
  }

  // Calculează nivelul de risc
  private calculateRiskLevel(
    breakingChanges: string[],
    newFeatures: string[],
    testResults: ModuleVersion['test_results']
  ): VersionComparison['risk_assessment']['risk_level'] {
    let riskScore = 0;

    // Breaking changes
    riskScore += breakingChanges.length * 10;

    // New features
    riskScore += newFeatures.length * 2;

    // Test results
    if (!testResults.automated_tests_passed) riskScore += 20;
    if (!testResults.manual_review_passed) riskScore += 15;
    if (testResults.performance_score < 80) riskScore += 10;
    if (testResults.quality_score < 80) riskScore += 10;
    if (testResults.security_score < 90) riskScore += 25;

    if (riskScore >= 50) return 'critical';
    if (riskScore >= 30) return 'high';
    if (riskScore >= 15) return 'medium';
    return 'low';
  }

  // Identifică factorii de risc
  private identifyRiskFactors(
    breakingChanges: string[],
    newFeatures: string[],
    testResults: ModuleVersion['test_results']
  ): string[] {
    const factors: string[] = [];

    if (breakingChanges.length > 0) {
      factors.push(`${breakingChanges.length} breaking changes detected`);
    }

    if (newFeatures.length > 0) {
      factors.push(`${newFeatures.length} new features may introduce bugs`);
    }

    if (!testResults.automated_tests_passed) {
      factors.push('Automated tests failed');
    }

    if (!testResults.manual_review_passed) {
      factors.push('Manual review not completed');
    }

    if (testResults.performance_score < 80) {
      factors.push('Performance below acceptable threshold');
    }

    if (testResults.security_score < 90) {
      factors.push('Security score below threshold');
    }

    return factors;
  }

  // Generează strategii de mitigare
  private generateMitigationStrategies(
    riskLevel: VersionComparison['risk_assessment']['risk_level'],
    riskFactors: string[]
  ): string[] {
    const strategies: string[] = [];

    if (riskLevel === 'critical' || riskLevel === 'high') {
      strategies.push('Implement gradual rollout strategy');
      strategies.push('Set up comprehensive monitoring and alerting');
      strategies.push('Prepare immediate rollback plan');
      strategies.push('Schedule emergency response team');
    }

    if (riskLevel === 'medium') {
      strategies.push('Use canary deployment');
      strategies.push('Monitor key metrics closely');
      strategies.push('Have rollback plan ready');
    }

    if (riskLevel === 'low') {
      strategies.push('Standard deployment with monitoring');
      strategies.push('Regular health checks');
    }

    // Specific strategies based on risk factors
    if (riskFactors.some(f => f.includes('breaking changes'))) {
      strategies.push('Provide detailed migration documentation');
      strategies.push('Offer migration support to users');
    }

    if (riskFactors.some(f => f.includes('security'))) {
      strategies.push('Conduct security review before deployment');
      strategies.push('Implement additional security monitoring');
    }

    return strategies;
  }

  // Verifică permisiunile de versioning
  private async checkVersioningPermission(orgId: string): Promise<boolean> {
    if (SUPABASE_URL.includes('dev-placeholder')) {
      return true;
    }

    // Verifică entitlements pentru versioning
    const { data } = await supabase
      .from('entitlements')
      .select('value')
      .eq('org_id', orgId)
      .eq('flag', 'hasModuleVersioning')
      .eq('value', true)
      .maybeSingle();

    return !!data;
  }

  // Clear cache pentru un module
  private clearCache(moduleId: string): void {
    for (const [key] of this.cache) {
      if (key.startsWith(moduleId)) {
        this.cache.delete(key);
      }
    }
  }

  // Clear all cache
  clearAllCache(): void {
    this.cache.clear();
  }
}

// Export singleton
export const moduleVersioning = ModuleVersioningManager.getInstance();
