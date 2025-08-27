/**
 * Ruleset Versioning and Management System
 * Handles semver versioning, registration, and activation of rulesets
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// Version management interface
export interface RulesetVersion {
  version: string;
  schema_version: string;
  environment: string;
  created_at: string;
  activated_at?: string;
  is_active: boolean;
  checksum: string;
  description?: string;
  author?: string;
  changes?: string[];
}

// Ruleset metadata
export interface RulesetMetadata {
  current_version: string;
  available_versions: RulesetVersion[];
  last_updated: string;
  backup_enabled: boolean;
  auto_rollback: boolean;
}

// Version change types
export type VersionChangeType = 'major' | 'minor' | 'patch' | 'preview' | 'rc';

/**
 * Ruleset Version Manager
 */
export class RulesetVersionManager {
  private rulesetPath: string;
  private metadataPath: string;
  private backupDir: string;

  constructor(rulesetPath: string = './ruleset.yml', backupDir: string = './backups/rulesets') {
    this.rulesetPath = rulesetPath;
    this.metadataPath = join(backupDir, 'ruleset-metadata.json');
    this.backupDir = backupDir;
  }

  /**
   * Get current ruleset version
   */
  getCurrentVersion(): string {
    try {
      const content = readFileSync(this.rulesetPath, 'utf8');
      const versionMatch = content.match(/^version:\s*["']?([^"\s]+)["']?/m);
      return versionMatch ? versionMatch[1] : '1.0.0';
    } catch (error) {
      console.warn('Failed to read current ruleset version:', error);
      return '1.0.0';
    }
  }

  /**
   * Get current ruleset content
   */
  getCurrentRuleset(): string {
    try {
      return readFileSync(this.rulesetPath, 'utf8');
    } catch (error) {
      throw new Error(`Failed to read ruleset: ${error}`);
    }
  }

  /**
   * Create new version of ruleset
   */
  createVersion(
    changeType: VersionChangeType,
    description?: string,
    author?: string,
    changes?: string[]
  ): RulesetVersion {
    const currentVersion = this.getCurrentVersion();
    const newVersion = this.incrementVersion(currentVersion, changeType);
    
    const version: RulesetVersion = {
      version: newVersion,
      schema_version: new Date().toISOString().split('T')[0],
      environment: this.getEnvironment(),
      created_at: new Date().toISOString(),
      is_active: false,
      checksum: this.calculateChecksum(this.getCurrentRuleset()),
      description,
      author,
      changes
    };

    // Save version metadata
    this.saveVersionMetadata(version);
    
    // Create backup of current ruleset
    this.backupRuleset(version);
    
    return version;
  }

  /**
   * Register a new ruleset version
   */
  registerVersion(
    version: string,
    content: string,
    description?: string,
    author?: string,
    changes?: string[]
  ): RulesetVersion {
    // Validate version format
    if (!this.isValidSemver(version)) {
      throw new Error(`Invalid semver format: ${version}`);
    }

    // Check if version already exists
    const existingVersions = this.getAvailableVersions();
    if (existingVersions.find(v => v.version === version)) {
      throw new Error(`Version ${version} already exists`);
    }

    const rulesetVersion: RulesetVersion = {
      version,
      schema_version: new Date().toISOString().split('T')[0],
      environment: this.getEnvironment(),
      created_at: new Date().toISOString(),
      is_active: false,
      checksum: this.calculateChecksum(content),
      description,
      author,
      changes
    };

    // Save version metadata
    this.saveVersionMetadata(rulesetVersion);
    
    // Save ruleset content
    this.saveRulesetVersion(version, content);
    
    return rulesetVersion;
  }

  /**
   * Activate a specific ruleset version
   */
  activateVersion(version: string): boolean {
    try {
      const availableVersions = this.getAvailableVersions();
      const targetVersion = availableVersions.find(v => v.version === version);
      
      if (!targetVersion) {
        throw new Error(`Version ${version} not found`);
      }

      // Deactivate current version
      this.deactivateCurrentVersion();

      // Load target version content
      const versionContent = this.loadRulesetVersion(version);
      if (!versionContent) {
        throw new Error(`Failed to load version ${version} content`);
      }

      // Backup current ruleset before activation
      const currentVersion = this.getCurrentVersion();
      if (currentVersion !== version) {
        this.backupRuleset({
          version: currentVersion,
          schema_version: new Date().toISOString().split('T')[0],
          environment: this.getEnvironment(),
          created_at: new Date().toISOString(),
          is_active: true,
          checksum: this.calculateChecksum(this.getCurrentRuleset())
        });
      }

      // Activate new version
      writeFileSync(this.rulesetPath, versionContent, 'utf8');
      
      // Update metadata
      targetVersion.is_active = true;
      targetVersion.activated_at = new Date().toISOString();
      this.updateVersionMetadata(targetVersion);

      console.log(`✅ Ruleset version ${version} activated successfully`);
      return true;

    } catch (error) {
      console.error(`❌ Failed to activate version ${version}:`, error);
      return false;
    }
  }

  /**
   * Rollback to previous version
   */
  rollbackToVersion(version: string): boolean {
    try {
      const availableVersions = this.getAvailableVersions();
      const targetVersion = availableVersions.find(v => v.version === version);
      
      if (!targetVersion) {
        throw new Error(`Version ${version} not found`);
      }

      // Load target version content
      const versionContent = this.loadRulesetVersion(version);
      if (!versionContent) {
        throw new Error(`Failed to load version ${version} content`);
      }

      // Backup current ruleset
      const currentVersion = this.getCurrentVersion();
      this.backupRuleset({
        version: currentVersion,
        schema_version: new Date().toISOString().split('T')[0],
        environment: this.getEnvironment(),
        created_at: new Date().toISOString(),
        is_active: true,
        checksum: this.calculateChecksum(this.getCurrentRuleset())
      });

      // Rollback to target version
      writeFileSync(this.rulesetPath, versionContent, 'utf8');
      
      // Update metadata
      this.deactivateCurrentVersion();
      targetVersion.is_active = true;
      targetVersion.activated_at = new Date().toISOString();
      this.updateVersionMetadata(targetVersion);

      console.log(`✅ Rolled back to ruleset version ${version}`);
      return true;

    } catch (error) {
      console.error(`❌ Failed to rollback to version ${version}:`, error);
      return false;
    }
  }

  /**
   * List available versions
   */
  getAvailableVersions(): RulesetVersion[] {
    try {
      if (!existsSync(this.metadataPath)) {
        return [];
      }
      
      const metadata = JSON.parse(readFileSync(this.metadataPath, 'utf8'));
      return metadata.available_versions || [];
    } catch (error) {
      console.warn('Failed to load version metadata:', error);
      return [];
    }
  }

  /**
   * Get version metadata
   */
  getVersionMetadata(): RulesetMetadata {
    try {
      if (!existsSync(this.metadataPath)) {
        return this.createDefaultMetadata();
      }
      
      return JSON.parse(readFileSync(this.metadataPath, 'utf8'));
    } catch (error) {
      console.warn('Failed to load version metadata:', error);
      return this.createDefaultMetadata();
    }
  }

  /**
   * Compare two versions
   */
  compareVersions(version1: string, version2: string): number {
    const v1 = this.parseSemver(version1);
    const v2 = this.parseSemver(version2);
    
    if (v1.major !== v2.major) return v1.major - v2.major;
    if (v1.minor !== v2.minor) return v1.minor - v2.minor;
    if (v1.patch !== v2.patch) return v1.patch - v2.patch;
    
    // Handle pre-release versions
    if (v1.prerelease && !v2.prerelease) return -1;
    if (!v1.prerelease && v2.prerelease) return 1;
    if (v1.prerelease && v2.prerelease) {
      return v1.prerelease.localeCompare(v2.prerelease);
    }
    
    return 0;
  }

  /**
   * Validate semver format
   */
  isValidSemver(version: string): boolean {
    const semverRegex = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-z-]+)*))?$/;
    return semverRegex.test(version);
  }

  /**
   * Parse semver string
   */
  private parseSemver(version: string): {
    major: number;
    minor: number;
    patch: number;
    prerelease?: string;
    build?: string;
  } {
    const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-z-]+)*))?$/);
    
    if (!match) {
      throw new Error(`Invalid semver format: ${version}`);
    }

    return {
      major: parseInt(match[1], 10),
      minor: parseInt(match[2], 10),
      patch: parseInt(match[3], 10),
      prerelease: match[4],
      build: match[5]
    };
  }

  /**
   * Increment version based on change type
   */
  private incrementVersion(currentVersion: string, changeType: VersionChangeType): string {
    const version = this.parseSemver(currentVersion);
    
    switch (changeType) {
      case 'major':
        return `${version.major + 1}.0.0`;
      case 'minor':
        return `${version.major}.${version.minor + 1}.0`;
      case 'patch':
        return `${version.major}.${version.minor}.${version.patch + 1}`;
      case 'preview':
        return `${version.major}.${version.minor}.${version.patch}-preview.${Date.now()}`;
      case 'rc':
        return `${version.major}.${version.minor}.${version.patch}-rc.${Date.now()}`;
      default:
        return `${version.major}.${version.minor}.${version.patch + 1}`;
    }
  }

  /**
   * Calculate checksum for content
   */
  private calculateChecksum(content: string): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Get current environment
   */
  private getEnvironment(): string {
    return process.env.NODE_ENV || 'development';
  }

  /**
   * Save version metadata
   */
  private saveVersionMetadata(version: RulesetVersion): void {
    const metadata = this.getVersionMetadata();
    
    // Add new version
    const existingIndex = metadata.available_versions.findIndex(v => v.version === version.version);
    if (existingIndex >= 0) {
      metadata.available_versions[existingIndex] = version;
    } else {
      metadata.available_versions.push(version);
    }
    
    // Sort versions
    metadata.available_versions.sort((a, b) => this.compareVersions(b.version, a.version));
    
    // Update metadata
    metadata.last_updated = new Date().toISOString();
    if (version.is_active) {
      metadata.current_version = version.version;
    }
    
    // Ensure backup directory exists
    const backupDir = require('path').dirname(this.metadataPath);
    if (!require('fs').existsSync(backupDir)) {
      require('fs').mkdirSync(backupDir, { recursive: true });
    }
    
    writeFileSync(this.metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
  }

  /**
   * Update version metadata
   */
  private updateVersionMetadata(version: RulesetVersion): void {
    const metadata = this.getVersionMetadata();
    const versionIndex = metadata.available_versions.findIndex(v => v.version === version.version);
    
    if (versionIndex >= 0) {
      metadata.available_versions[versionIndex] = version;
      metadata.last_updated = new Date().toISOString();
      
      if (version.is_active) {
        metadata.current_version = version.version;
      }
      
      writeFileSync(this.metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
    }
  }

  /**
   * Create default metadata
   */
  private createDefaultMetadata(): RulesetMetadata {
    return {
      current_version: '1.0.0',
      available_versions: [],
      last_updated: new Date().toISOString(),
      backup_enabled: true,
      auto_rollback: false
    };
  }

  /**
   * Backup current ruleset
   */
  private backupRuleset(version: RulesetVersion): void {
    try {
      const backupPath = join(this.backupDir, `ruleset-${version.version}-${Date.now()}.yml`);
      
      // Ensure backup directory exists
      const backupDir = require('path').dirname(backupPath);
      if (!require('fs').existsSync(backupDir)) {
        require('fs').mkdirSync(backupDir, { recursive: true });
      }
      
      // Copy current ruleset
      const currentContent = this.getCurrentRuleset();
      require('fs').writeFileSync(backupPath, currentContent, 'utf8');
      
      console.log(`📁 Ruleset backed up to: ${backupPath}`);
    } catch (error) {
      console.warn('Failed to backup ruleset:', error);
    }
  }

  /**
   * Save ruleset version content
   */
  private saveRulesetVersion(version: string, content: string): void {
    const versionPath = join(this.backupDir, `ruleset-${version}.yml`);
    
    // Ensure backup directory exists
    const backupDir = require('path').dirname(versionPath);
    if (!require('fs').existsSync(backupDir)) {
      require('fs').mkdirSync(backupDir, { recursive: true });
    }
    
    require('fs').writeFileSync(versionPath, content, 'utf8');
  }

  /**
   * Load ruleset version content
   */
  private loadRulesetVersion(version: string): string | null {
    try {
      const versionPath = join(this.backupDir, `ruleset-${version}.yml`);
      return require('fs').readFileSync(versionPath, 'utf8');
    } catch (error) {
      console.warn(`Failed to load version ${version}:`, error);
      return null;
    }
  }

  /**
   * Deactivate current version
   */
  private deactivateCurrentVersion(): void {
    const metadata = this.getVersionMetadata();
    const currentVersion = metadata.available_versions.find(v => v.is_active);
    
    if (currentVersion) {
      currentVersion.is_active = false;
      this.updateVersionMetadata(currentVersion);
    }
  }
}

// Export singleton instance
export const rulesetVersionManager = new RulesetVersionManager();

// Export utility functions
export function createRulesetVersion(
  changeType: VersionChangeType,
  description?: string,
  author?: string,
  changes?: string[]
): RulesetVersion {
  return rulesetVersionManager.createVersion(changeType, description, author, changes);
}

export function activateRulesetVersion(version: string): boolean {
  return rulesetVersionManager.activateVersion(version);
}

export function rollbackRulesetVersion(version: string): boolean {
  return rulesetVersionManager.rollbackToVersion(version);
}

export function getRulesetVersions(): RulesetVersion[] {
  return rulesetVersionManager.getAvailableVersions();
}

export function getCurrentRulesetVersion(): string {
  return rulesetVersionManager.getCurrentVersion();
}
