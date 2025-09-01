import { createHash, randomBytes } from 'crypto';

interface PreviewToken {
  slug: string;
  expiresAt: number;
  createdAt: number;
}

const PREVIEW_TOKENS = new Map<string, PreviewToken>();

// Generate a secure preview token
export function generatePreviewToken(slug: string, ttlMinutes: number = 30): string {
  const token = randomBytes(32).toString('hex');
  const expiresAt = Date.now() + (ttlMinutes * 60 * 1000);
  
  PREVIEW_TOKENS.set(token, {
    slug,
    expiresAt,
    createdAt: Date.now(),
  });
  
  return token;
}

// Validate a preview token
export function validatePreviewToken(token: string): { valid: boolean; slug?: string } {
  const previewToken = PREVIEW_TOKENS.get(token);
  
  if (!previewToken) {
    return { valid: false };
  }
  
  if (Date.now() > previewToken.expiresAt) {
    PREVIEW_TOKENS.delete(token);
    return { valid: false };
  }
  
  return { valid: true, slug: previewToken.slug };
}

// Clean up expired tokens
export function cleanupExpiredTokens(): void {
  const now = Date.now();
  for (const [token, previewToken] of PREVIEW_TOKENS.entries()) {
    if (now > previewToken.expiresAt) {
      PREVIEW_TOKENS.delete(token);
    }
  }
}

// Get preview URL
export function getPreviewUrl(slug: string, ttlMinutes: number = 30): string {
  const token = generatePreviewToken(slug, ttlMinutes);
  return `/blog/${slug}?preview=${token}`;
}

// Check if request is a preview
export function isPreviewRequest(searchParams: URLSearchParams): boolean {
  return searchParams.has('preview');
}

// Get preview token from request
export function getPreviewToken(searchParams: URLSearchParams): string | null {
  return searchParams.get('preview');
}
