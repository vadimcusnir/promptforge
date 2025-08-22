// PromptForge v3 - Self-Host Licensing System
// Sistem de licențe pentru deployment-uri self-hosted

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// SACF - Development mode fallback
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://dev-placeholder.supabase.co';
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dev-placeholder';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

export interface LicenseKey {
  id: string;
  license_key: string; // Encrypted license key
  license_hash: string; // SHA-256 hash pentru validare
  
  // License details
  license_type: 'trial' | 'development' | 'production' | 'enterprise' | 'custom';
  edition: 'community' | 'professional' | 'enterprise' | 'unlimited';
  
  // Usage limits
  max_users: number;
  max_modules: number;
  max_runs_per_month: number;
  max_storage_gb: number;
  max_api_calls_per_month: number;
  
  // Features
  features: {
    hasCloudHistory: boolean;
    hasModuleVersioning: boolean;
    hasWhiteLabel: boolean;
    hasPublicAPI: boolean;
    hasIndustryPacks: boolean;
    hasAdvancedAnalytics: boolean;
    hasCustomIntegrations: boolean;
    hasPrioritySupport: boolean;
    hasSLA: boolean;
  };
  
  // Deployment
  deployment_type: 'single_instance' | 'multi_instance' | 'kubernetes' | 'docker_swarm';
  max_instances: number;
  allowed_domains: string[];
  allowed_ips: string[];
  
  // Time constraints
  issued_at: string;
  valid_from: string;
  valid_until: string;
  grace_period_days: number;
  
  // Organization
  org_name: string;
  org_id?: string;
  contact_email: string;
  contact_phone?: string;
  
  // Technical
  hardware_fingerprint?: string; // Pentru binding la hardware
  environment_variables: Record<string, string>; // Configurații specifice
  
  // Status
  is_active: boolean;
  is_revoked: boolean;
  revocation_reason?: string;
  last_validation: string;
  validation_count: number;
  
  // Audit
  created_by: string;
  created_at: string;
  updated_at: string;
  revoked_at?: string;
  revoked_by?: string;
}

export interface LicenseValidation {
  is_valid: boolean;
  license_info?: LicenseKey;
  validation_errors: string[];
  warnings: string[];
  next_validation: string;
  usage_stats: {
    current_users: number;
    current_modules: number;
    runs_this_month: number;
    storage_used_gb: number;
    api_calls_this_month: number;
  };
  compliance_status: {
    within_limits: boolean;
    approaching_limits: boolean;
    exceeded_limits: boolean;
    limit_warnings: string[];
  };
}

export interface LicenseActivation {
  activation_code: string;
  hardware_fingerprint: string;
  environment_info: {
    node_version: string;
    platform: string;
    architecture: string;
    memory_gb: number;
    cpu_cores: number;
    disk_space_gb: number;
  };
  network_info: {
    hostname: string;
    ip_addresses: string[];
    external_ip?: string;
  };
  timestamp: string;
}

export interface LicenseUsage {
  license_id: string;
  timestamp: string;
  
  // Resource usage
  active_users: number;
  total_modules: number;
  runs_count: number;
  storage_used_mb: number;
  api_calls_count: number;
  
  // Performance metrics
  response_time_avg_ms: number;
  error_rate_percent: number;
  uptime_percent: number;
  
  // Feature usage
  features_used: string[];
  modules_accessed: string[];
  
  // Compliance
  within_limits: boolean;
  warnings: string[];
}

class SelfHostLicensingManager {
  private static instance: SelfHostLicensingManager;
  private cache: Map<string, { license: LicenseKey; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutes
  private readonly VALIDATION_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

  private constructor() {}

  public static getInstance(): SelfHostLicensingManager {
    if (!SelfHostLicensingManager.instance) {
      SelfHostLicensingManager.instance = new SelfHostLicensingManager();
    }
    return SelfHostLicensingManager.instance;
  }

  // Generează o licență nouă
  async generateLicense(params: {
    licenseType: LicenseKey['license_type'];
    edition: LicenseKey['edition'];
    maxUsers: number;
    maxModules: number;
    maxRunsPerMonth: number;
    maxStorageGb: number;
    maxApiCallsPerMonth: number;
    features: LicenseKey['features'];
    deploymentType: LicenseKey['deployment_type'];
    maxInstances: number;
    allowedDomains: string[];
    allowedIps: string[];
    validFrom: string;
    validUntil: string;
    gracePeriodDays: number;
    orgName: string;
    orgId?: string;
    contactEmail: string;
    contactPhone?: string;
    createdBy: string;
  }): Promise<{ licenseKey: string; licenseData: LicenseKey }> {
    if (SUPABASE_URL.includes('dev-placeholder')) {
      // Development mode - generate mock license
      const mockLicenseKey = this.generateMockLicenseKey();
      const mockLicense: LicenseKey = {
        id: 'dev-license-' + Date.now(),
        license_key: mockLicenseKey,
        license_hash: this.hashLicenseKey(mockLicenseKey),
        license_type: params.licenseType,
        edition: params.edition,
        max_users: params.maxUsers,
        max_modules: params.maxModules,
        max_runs_per_month: params.maxRunsPerMonth,
        max_storage_gb: params.maxStorageGb,
        max_api_calls_per_month: params.maxApiCallsPerMonth,
        features: params.features,
        deployment_type: params.deploymentType,
        max_instances: params.maxInstances,
        allowed_domains: params.allowedDomains,
        allowed_ips: params.allowedIps,
        issued_at: new Date().toISOString(),
        valid_from: params.validFrom,
        valid_until: params.validUntil,
        grace_period_days: params.gracePeriodDays,
        org_name: params.orgName,
        org_id: params.orgId,
        contact_email: params.contactEmail,
        contact_phone: params.contactPhone,
        environment_variables: {},
        is_active: true,
        is_revoked: false,
        last_validation: new Date().toISOString(),
        validation_count: 0,
        created_by: params.createdBy,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return { licenseKey: mockLicenseKey, licenseData: mockLicense };
    }

    // Generate real license key
    const licenseKey = this.generateLicenseKey();
    const licenseHash = this.hashLicenseKey(licenseKey);

    const license: Omit<LicenseKey, 'id' | 'created_at' | 'updated_at'> = {
      license_key: licenseKey,
      license_hash: licenseHash,
      license_type: params.licenseType,
      edition: params.edition,
      max_users: params.maxUsers,
      max_modules: params.maxModules,
      max_runs_per_month: params.maxRunsPerMonth,
      max_storage_gb: params.maxStorageGb,
      max_api_calls_per_month: params.maxApiCallsPerMonth,
      features: params.features,
      deployment_type: params.deploymentType,
      max_instances: params.maxInstances,
      allowed_domains: params.allowedDomains,
      allowed_ips: params.allowedIps,
      issued_at: new Date().toISOString(),
      valid_from: params.validFrom,
      valid_until: params.validUntil,
      grace_period_days: params.gracePeriodDays,
      org_name: params.orgName,
      org_id: params.orgId,
      contact_email: params.contactEmail,
      contact_phone: params.contactPhone,
      environment_variables: {},
      is_active: true,
      is_revoked: false,
      last_validation: new Date().toISOString(),
      validation_count: 0,
      created_by: params.createdBy
    };

    const { data, error } = await supabase
      .from('licenses')
      .insert([license])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create license: ${error.message}`);
    }

    return { licenseKey, licenseData: data };
  }

  // Validează o licență
  async validateLicense(licenseKey: string, activation?: LicenseActivation): Promise<LicenseValidation> {
    const validationErrors: string[] = [];
    const warnings: string[] = [];

    // Check cache first
    const cached = this.cache.get(licenseKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      const license = cached.license;
      return this.performValidation(license, activation, validationErrors, warnings);
    }

    if (SUPABASE_URL.includes('dev-placeholder')) {
      // Development mode - validate mock license
      if (licenseKey.startsWith('PF_DEV_')) {
        const mockLicense: LicenseKey = {
          id: 'dev-license',
          license_key: licenseKey,
          license_hash: this.hashLicenseKey(licenseKey),
          license_type: 'development',
          edition: 'professional',
          max_users: 100,
          max_modules: 50,
          max_runs_per_month: 10000,
          max_storage_gb: 100,
          max_api_calls_per_month: 50000,
          features: {
            hasCloudHistory: true,
            hasModuleVersioning: true,
            hasWhiteLabel: true,
            hasPublicAPI: true,
            hasIndustryPacks: true,
            hasAdvancedAnalytics: true,
            hasCustomIntegrations: true,
            hasPrioritySupport: false,
            hasSLA: false
          },
          deployment_type: 'single_instance',
          max_instances: 1,
          allowed_domains: ['localhost', '127.0.0.1'],
          allowed_ips: ['127.0.0.1', '::1'],
          issued_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          valid_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          grace_period_days: 7,
          org_name: 'Development Organization',
          contact_email: 'dev@example.com',
          environment_variables: {},
          is_active: true,
          is_revoked: false,
          last_validation: new Date().toISOString(),
          validation_count: 1,
          created_by: 'dev-system',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        this.cache.set(licenseKey, { license: mockLicense, timestamp: Date.now() });
        return this.performValidation(mockLicense, activation, validationErrors, warnings);
      }

      validationErrors.push('Invalid development license key format');
      return {
        is_valid: false,
        validation_errors: validationErrors,
        warnings,
        next_validation: new Date(Date.now() + this.VALIDATION_INTERVAL).toISOString(),
        usage_stats: {
          current_users: 0,
          current_modules: 0,
          runs_this_month: 0,
          storage_used_gb: 0,
          api_calls_this_month: 0
        },
        compliance_status: {
          within_limits: false,
          approaching_limits: false,
          exceeded_limits: true,
          limit_warnings: ['License validation failed']
        }
      };
    }

    try {
      // Find license in database
      const { data: license, error } = await supabase
        .from('licenses')
        .select('*')
        .eq('license_key', licenseKey)
        .eq('is_active', true)
        .eq('is_revoked', false)
        .maybeSingle();

      if (error) throw error;

      if (!license) {
        validationErrors.push('License not found or inactive');
        return {
          is_valid: false,
          validation_errors: validationErrors,
          warnings,
          next_validation: new Date(Date.now() + this.VALIDATION_INTERVAL).toISOString(),
          usage_stats: {
            current_users: 0,
            current_modules: 0,
            runs_this_month: 0,
            storage_used_gb: 0,
            api_calls_this_month: 0
          },
          compliance_status: {
            within_limits: false,
            approaching_limits: false,
            exceeded_limits: true,
            limit_warnings: ['License not found']
          }
        };
      }

      // Cache the license
      this.cache.set(licenseKey, { license, timestamp: Date.now() });

      // Update validation count and timestamp
      await supabase
        .from('licenses')
        .update({
          last_validation: new Date().toISOString(),
          validation_count: license.validation_count + 1
        })
        .eq('id', license.id);

      return this.performValidation(license, activation, validationErrors, warnings);

    } catch (error) {
      validationErrors.push(`License validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        is_valid: false,
        validation_errors: validationErrors,
        warnings,
        next_validation: new Date(Date.now() + this.VALIDATION_INTERVAL).toISOString(),
        usage_stats: {
          current_users: 0,
          current_modules: 0,
          runs_this_month: 0,
          storage_used_gb: 0,
          api_calls_this_month: 0
        },
        compliance_status: {
          within_limits: false,
          approaching_limits: false,
          exceeded_limits: true,
          limit_warnings: ['Validation error']
        }
      };
    }
  }

  // Activează o licență pe un sistem
  async activateLicense(licenseKey: string, activation: LicenseActivation): Promise<{
    success: boolean;
    activation_id?: string;
    error?: string;
  }> {
    if (SUPABASE_URL.includes('dev-placeholder')) {
      // Development mode - mock activation
      console.log('Dev mode: License activated', { licenseKey, activation });
      return { success: true, activation_id: 'dev-activation-' + Date.now() };
    }

    try {
      // Validate license first
      const validation = await this.validateLicense(licenseKey, activation);
      if (!validation.is_valid) {
        return { success: false, error: 'License validation failed' };
      }

      const license = validation.license_info!;

      // Check if activation is allowed
      if (!this.isActivationAllowed(license, activation)) {
        return { success: false, error: 'Activation not allowed for this license' };
      }

      // Store activation
      const { data, error } = await supabase
        .from('license_activations')
        .insert([{
          license_id: license.id,
          activation_code: activation.activation_code,
          hardware_fingerprint: activation.hardware_fingerprint,
          environment_info: activation.environment_info,
          network_info: activation.network_info,
          timestamp: activation.timestamp
        }])
        .select('id')
        .single();

      if (error) {
        throw new Error(`Failed to store activation: ${error.message}`);
      }

      // Update license with hardware fingerprint if not set
      if (!license.hardware_fingerprint) {
        await supabase
          .from('licenses')
          .update({ hardware_fingerprint: activation.hardware_fingerprint })
          .eq('id', license.id);
      }

      return { success: true, activation_id: data.id };

    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Activation failed' 
      };
    }
  }

  // Verifică dacă activarea este permisă
  private isActivationAllowed(license: LicenseKey, activation: LicenseActivation): boolean {
    // Check domain restrictions
    if (license.allowed_domains.length > 0) {
      const domainAllowed = license.allowed_domains.some(domain => 
        activation.network_info.hostname.includes(domain) ||
        activation.network_info.ip_addresses.some(ip => ip.includes(domain))
      );
      if (!domainAllowed) return false;
    }

    // Check IP restrictions
    if (license.allowed_ips.length > 0) {
      const ipAllowed = license.allowed_ips.some(allowedIp =>
        activation.network_info.ip_addresses.some(ip => ip === allowedIp)
      );
      if (!ipAllowed) return false;
    }

    // Check instance limits
    // TODO: Implement instance counting logic

    return true;
  }

  // Generează cheia de licență
  private generateLicenseKey(): string {
    const segments = [
      'PF', // Prefix
      this.generateRandomString(4, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
      this.generateRandomString(4, '0123456789'),
      this.generateRandomString(4, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
      this.generateRandomString(4, '0123456789'),
      this.generateRandomString(4, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')
    ];
    
    return segments.join('-');
  }

  // Generează cheie mock pentru development
  private generateMockLicenseKey(): string {
    return 'PF_DEV_' + this.generateRandomString(8, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
  }

  // Generează string random
  private generateRandomString(length: number, charset: string): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  }

  // Hash pentru cheia de licență
  private hashLicenseKey(licenseKey: string): string {
    return crypto.createHash('sha256').update(licenseKey).digest('hex');
  }

  // Performează validarea licenței
  private async performValidation(
    license: LicenseKey,
    activation: LicenseActivation | undefined,
    validationErrors: string[],
    warnings: string[]
  ): Promise<LicenseValidation> {
    const now = new Date();
    const validFrom = new Date(license.valid_from);
    const validUntil = new Date(license.valid_until);

    // Check expiration
    if (now < validFrom) {
      validationErrors.push(`License not yet valid. Valid from: ${validFrom.toISOString()}`);
    }

    if (now > validUntil) {
      const gracePeriodEnd = new Date(validUntil.getTime() + license.grace_period_days * 24 * 60 * 60 * 1000);
      if (now > gracePeriodEnd) {
        validationErrors.push(`License expired and grace period ended. Expired: ${validUntil.toISOString()}`);
      } else {
        warnings.push(`License expired on ${validUntil.toISOString()}. Grace period ends: ${gracePeriodEnd.toISOString()}`);
      }
    }

    // Check hardware binding if activation provided
    if (activation && license.hardware_fingerprint) {
      if (activation.hardware_fingerprint !== license.hardware_fingerprint) {
        validationErrors.push('License is bound to different hardware');
      }
    }

    // Mock usage stats for development
    const usageStats = {
      current_users: 25,
      current_modules: 15,
      runs_this_month: 2500,
      storage_used_gb: 45,
      api_calls_this_month: 12500
    };

    // Check limits
    const complianceStatus = this.checkCompliance(license, usageStats);

    return {
      is_valid: validationErrors.length === 0,
      license_info: license,
      validation_errors: validationErrors,
      warnings,
      next_validation: new Date(Date.now() + this.VALIDATION_INTERVAL).toISOString(),
      usage_stats: usageStats,
      compliance_status: complianceStatus
    };
  }

  // Verifică compliance cu limitele
  private checkCompliance(license: LicenseKey, usage: any): LicenseValidation['compliance_status'] {
    const warnings: string[] = [];
    let approachingLimits = false;
    let exceededLimits = false;

    // Check user limits
    if (usage.current_users >= license.max_users * 0.9) {
      approachingLimits = true;
      warnings.push(`Approaching user limit: ${usage.current_users}/${license.max_users}`);
    }
    if (usage.current_users > license.max_users) {
      exceededLimits = true;
      warnings.push(`Exceeded user limit: ${usage.current_users}/${license.max_users}`);
    }

    // Check module limits
    if (usage.current_modules >= license.max_modules * 0.9) {
      approachingLimits = true;
      warnings.push(`Approaching module limit: ${usage.current_modules}/${license.max_modules}`);
    }
    if (usage.current_modules > license.max_modules) {
      exceededLimits = true;
      warnings.push(`Exceeded module limit: ${usage.current_modules}/${license.max_modules}`);
    }

    // Check storage limits
    if (usage.storage_used_gb >= license.max_storage_gb * 0.9) {
      approachingLimits = true;
      warnings.push(`Approaching storage limit: ${usage.storage_used_gb}/${license.max_storage_gb} GB`);
    }
    if (usage.storage_used_gb > license.max_storage_gb) {
      exceededLimits = true;
      warnings.push(`Exceeded storage limit: ${usage.storage_used_gb}/${license.max_storage_gb} GB`);
    }

    // Check API call limits
    if (usage.api_calls_this_month >= license.max_api_calls_per_month * 0.9) {
      approachingLimits = true;
      warnings.push(`Approaching API call limit: ${usage.api_calls_this_month}/${license.max_api_calls_per_month}`);
    }
    if (usage.api_calls_this_month > license.max_api_calls_per_month) {
      exceededLimits = true;
      warnings.push(`Exceeded API call limit: ${usage.api_calls_this_month}/${license.max_api_calls_per_month}`);
    }

    return {
      within_limits: !exceededLimits && !approachingLimits,
      approaching_limits: approachingLimits,
      exceeded_limits: exceededLimits,
      limit_warnings: warnings
    };
  }

  // Clear cache pentru o licență
  clearCache(licenseKey: string): void {
    this.cache.delete(licenseKey);
  }

  // Clear all cache
  clearAllCache(): void {
    this.cache.clear();
  }
}

// Export singleton
export const selfHostLicensing = SelfHostLicensingManager.getInstance();
