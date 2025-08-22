/**
 * Export Bundle - Manifest Generation
 * Creates standardized bundle manifest with metadata
 */

import { licenseNoticeForPlan, type PlanCode } from './license';

export interface ManifestContext {
  bundleId: string;
  runId: string;
  moduleId: string;
  domain: string;
  signature7d: string;
  score: {
    total: number;
    clarity: number;
    execution: number;
    ambiguity: number;
    business_fit: number;
  };
  formats: string[];
  artifacts: Array<{
    file: string;
    checksum: string;
    bytes: number;
  }>;
  plan: PlanCode;
  version: string;
}

export interface BundleManifest {
  bundle_id: string;
  run_id: string;
  project: string;
  module_id: string;
  domain: string;
  signature_7d: string;
  score: number;
  kpi_axes: {
    clarity: number;
    execution: number;
    ambiguity: number;
    business_fit: number;
  };
  formats: string[];
  artifacts: Array<{
    file: string;
    checksum: string;
    bytes: number;
  }>;
  exported_at: string;
  license_notice: string;
  version: string;
}

/**
 * Build standardized bundle manifest
 */
export function buildManifest(context: ManifestContext): BundleManifest {
  const {
    bundleId,
    runId,
    moduleId,
    domain,
    signature7d,
    score,
    formats,
    artifacts,
    plan,
    version
  } = context;

  return {
    bundle_id: bundleId,
    run_id: runId,
    project: process.env.NEXT_PUBLIC_SITE_NAME || "PromptForge_v3",
    module_id: moduleId,
    domain: domain,
    signature_7d: signature7d,
    score: score.total,
    kpi_axes: {
      clarity: score.clarity,
      execution: score.execution,
      ambiguity: score.ambiguity,
      business_fit: score.business_fit,
    },
    formats: formats,
    artifacts: artifacts,
    exported_at: new Date().toISOString(),
    license_notice: licenseNoticeForPlan(plan),
    version: version,
  };
}

/**
 * Validate manifest structure
 */
export function validateManifest(manifest: BundleManifest): boolean {
  const required = [
    'bundle_id',
    'run_id', 
    'project',
    'module_id',
    'domain',
    'signature_7d',
    'score',
    'kpi_axes',
    'formats',
    'artifacts',
    'exported_at',
    'license_notice',
    'version'
  ];

  for (const field of required) {
    if (!(field in manifest)) {
      return false;
    }
  }

  // Validate score range
  if (manifest.score < 0 || manifest.score > 100) {
    return false;
  }

  // Validate formats array
  if (!Array.isArray(manifest.formats) || manifest.formats.length === 0) {
    return false;
  }

  // Validate artifacts array
  if (!Array.isArray(manifest.artifacts) || manifest.artifacts.length === 0) {
    return false;
  }

  return true;
}
