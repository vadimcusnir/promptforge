/**
 * Export Bundle - Hash & Checksum
 * Canonical hashing for reproducible bundle verification
 */

import { createHash } from 'crypto';

/**
 * Calculate SHA256 hash of content
 */
export function sha256(content: string | Buffer): string {
  const hash = createHash('sha256');
  hash.update(content);
  return hash.digest('hex');
}

/**
 * Calculate canonical checksum from ordered hashes
 * Uses the specified canonical order for reproducibility
 */
export function canonicalChecksum(hashes: string[]): string {
  // Canonical order as specified in requirements
  const canonicalOrder = [
    "prompt.txt",
    "prompt.json", 
    "prompt.md",
    "prompt.pdf",
    "manifest.json",
    "telemetry.json"
  ];
  
  // Sort hashes according to canonical order
  const orderedHashes: string[] = [];
  
  for (const filename of canonicalOrder) {
    const hashEntry = hashes.find(h => h.startsWith(`${filename}:`));
    if (hashEntry) {
      orderedHashes.push(hashEntry.split(':')[1]); // Extract just the hash part
    }
  }
  
  // Concatenate hashes line by line and hash the result
  const concatenated = orderedHashes.join('\n');
  return `sha256:${sha256(concatenated)}`;
}

/**
 * Generate file hash with prefix
 */
export function fileHash(filename: string, content: string | Buffer): string {
  return `${filename}:sha256:${sha256(content)}`;
}

/**
 * Validate hash format
 */
export function validateHashFormat(hash: string): boolean {
  return /^sha256:[0-9a-f]{64}$/.test(hash);
}

/**
 * Generate checksum.txt content
 */
export function generateChecksumFile(fileHashes: Record<string, string>): string {
  const canonicalOrder = [
    "prompt.txt",
    "prompt.json", 
    "prompt.md",
    "prompt.pdf",
    "manifest.json",
    "telemetry.json"
  ];
  
  const lines: string[] = [];
  
  for (const filename of canonicalOrder) {
    if (fileHashes[filename]) {
      lines.push(`sha256:${fileHashes[filename]}`);
    }
  }
  
  return lines.join('\n') + '\n'; // Ensure final newline
}
