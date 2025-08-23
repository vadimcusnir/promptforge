// PROMPTFORGE™ v3 - SACF Agent Tools
// Controlul capabilităților și uneltelor agentului cu sandbox

import { getExportConfig } from '@/lib/ruleset';

export type Capability =
  | 'HTTP_FETCH'
  | 'STORAGE_WRITE'
  | 'RUN_TEST'
  | 'EXPORT_BUNDLE'
  | 'GENERATE_PROMPT'
  | 'SCORE_PROMPT';

export interface ToolContext {
  orgId: string;
  runId: string;
  caps: Capability[]; // Runtime capabilities din entitlements + ruleset
  allowHttp: string[]; // Allowlist domenii pentru HTTP
  sandboxPath: string; // FS scope pentru sandbox
  budget: {
    tokensMax: number;
    requestsPerMin: number;
    costUsdMax: number;
    timeoutMs: number;
  };
}

// HTTP Fetch cu allowlist strict
export async function httpFetch(
  ctx: ToolContext,
  url: string,
  init?: RequestInit
): Promise<Response> {
  if (!ctx.caps.includes('HTTP_FETCH')) {
    throw new Error('CAPABILITY_DENIED:HTTP_FETCH');
  }

  // Verifică allowlist domenii
  const allowed = ctx.allowHttp.some(domain => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`);
    } catch {
      return false;
    }
  });

  if (!allowed) {
    throw new Error(`DOMAIN_DENIED: ${url} not in allowlist`);
  }

  // Verifică că este HTTPS
  if (!url.startsWith('https://')) {
    throw new Error('PROTOCOL_DENIED: Only HTTPS allowed');
  }

  try {
    const response = await fetch(url, {
      ...init,
      redirect: 'error', // Blochează redirects funky
      signal: AbortSignal.timeout(ctx.budget.timeoutMs),
    });

    return response;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TimeoutError') {
        throw new Error(`HTTP_TIMEOUT: Request exceeded ${ctx.budget.timeoutMs}ms`);
      }
      throw new Error(`HTTP_ERROR: ${error.message}`);
    }
    throw error;
  }
}

// Storage Write cu validare nume fișier
export async function storageWrite(
  ctx: ToolContext,
  fileName: string,
  content: Buffer | string,
  contentType?: string
): Promise<string> {
  if (!ctx.caps.includes('STORAGE_WRITE')) {
    throw new Error('CAPABILITY_DENIED:STORAGE_WRITE');
  }

  // Validează nume fișier conform SACF
  if (!/^[a-z0-9._-]+$/.test(fileName)) {
    throw new Error(`INVALID_FILENAME: ${fileName} contains invalid characters`);
  }

  // Verifică extensiile permise
  const allowedExtensions = ['.txt', '.md', '.json', '.pdf', '.zip'];
  const hasAllowedExt = allowedExtensions.some(ext => fileName.endsWith(ext));

  if (!hasAllowedExt) {
    throw new Error(`INVALID_EXTENSION: ${fileName} extension not allowed`);
  }

  // Verifică mărimea fișierului
  const maxSize = 50 * 1024 * 1024; // 50MB
  const size = Buffer.isBuffer(content) ? content.length : Buffer.byteLength(content);

  if (size > maxSize) {
    throw new Error(`FILE_TOO_LARGE: ${size} bytes exceeds ${maxSize} limit`);
  }

  // TODO: Implementează upload în Supabase Storage
  // Pentru acum returnează path simulat
  const storagePath = `${ctx.sandboxPath}/${fileName}`;

  return storagePath;
}

// Export Bundle cu validare completă
export async function exportBundle(
  ctx: ToolContext,
  runId: string,
  formats: string[]
): Promise<{ bundleId: string; checksum: string; paths: Record<string, string> }> {
  if (!ctx.caps.includes('EXPORT_BUNDLE')) {
    throw new Error('CAPABILITY_DENIED:EXPORT_BUNDLE');
  }

  // Verifică formatele conform ruleset
  const config = getExportConfig();
  const invalidFormats = formats.filter(f => !config.artifacts.includes(`prompt.${f}`));

  if (invalidFormats.length > 0) {
    throw new Error(`INVALID_FORMATS: ${invalidFormats.join(', ')} not supported`);
  }

  // Verifică că run-ul aparține org-ului
  if (!runId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)) {
    throw new Error('INVALID_RUN_ID: Must be valid UUID');
  }

  // TODO: Implementează export real
  // Pentru acum returnează rezultat simulat
  const bundleId = crypto.randomUUID();
  const checksum = `sha256:${Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('')}`;

  const paths: Record<string, string> = {};
  formats.forEach(format => {
    paths[`prompt.${format}`] = `${ctx.sandboxPath}/prompt.${format}`;
  });

  return { bundleId, checksum, paths };
}

// Validare capabilități la runtime
export function validateCapabilities(
  requested: Capability[],
  available: Capability[]
): { valid: boolean; missing: Capability[] } {
  const missing = requested.filter(cap => !available.includes(cap));
  return {
    valid: missing.length === 0,
    missing,
  };
}

// Creează context sigur pentru tools
export function createToolContext(
  orgId: string,
  runId: string,
  entitlements: Record<string, boolean>
): ToolContext {
  // Mapează entitlements la capabilities
  const caps: Capability[] = [];

  if (entitlements.hasAPI) caps.push('HTTP_FETCH');
  if (entitlements.canExportBundleZip || entitlements.canExportPDF) caps.push('STORAGE_WRITE');
  if (entitlements.canUseGptTestReal) caps.push('RUN_TEST');
  if (entitlements.canExportMD || entitlements.canExportPDF) caps.push('EXPORT_BUNDLE');

  // Întotdeauna permite generate și score pentru membri
  caps.push('GENERATE_PROMPT', 'SCORE_PROMPT');

  return {
    orgId,
    runId,
    caps,
    allowHttp: ['api.openai.com', 'api.anthropic.com', 'api.groq.com'],
    sandboxPath: `/tmp/agents/${runId}`,
    budget: {
      tokensMax: 12000,
      requestsPerMin: 60,
      costUsdMax: 1.5,
      timeoutMs: 20000,
    },
  };
}

// Cleanup sandbox după utilizare
export async function cleanupSandbox(sandboxPath: string): Promise<void> {
  // TODO: Implementează cleanup real al directorului sandbox
  // Pentru acum doar log
  console.log(`Cleaning up sandbox: ${sandboxPath}`);
}

// Verifică dacă operația este în budget
export function checkBudget(
  ctx: ToolContext,
  tokens: number,
  costUsd: number
): { allowed: boolean; reason?: string } {
  if (tokens > ctx.budget.tokensMax) {
    return {
      allowed: false,
      reason: `Token limit exceeded: ${tokens} > ${ctx.budget.tokensMax}`,
    };
  }

  if (costUsd > ctx.budget.costUsdMax) {
    return {
      allowed: false,
      reason: `Cost limit exceeded: $${costUsd} > $${ctx.budget.costUsdMax}`,
    };
  }

  return { allowed: true };
}
