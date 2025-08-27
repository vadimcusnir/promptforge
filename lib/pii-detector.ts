/**
 * PII Detection and Redaction Utility
 * Scans content for Personally Identifiable Information and provides redaction
 */

// PII patterns for detection
export const PII_PATTERNS = {
  // Email addresses
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  
  // Phone numbers (various formats)
  phone: /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g,
  
  // Social Security Numbers (US)
  ssn: /\b\d{3}-\d{2}-\d{4}\b|\b\d{9}\b/g,
  
  // Credit Card Numbers
  creditCard: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
  
  // IP Addresses
  ipAddress: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
  
  // MAC Addresses
  macAddress: /\b([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})\b/g,
  
  // URLs with potential PII
  urlWithPII: /https?:\/\/[^\s]+[?&](?:email|phone|user|id|token|key|password|secret)=[^\s&]+/gi,
  
  // API Keys (common patterns)
  apiKey: /\b(?:sk-|pk_|AIza|ghp_|gho_)[A-Za-z0-9_-]{20,}\b/g,
  
  // Database Connection Strings
  dbConnection: /(?:postgresql?|mysql|mongodb):\/\/[^:\s]+:[^@\s]+@[^:\s]+/gi,
  
  // AWS/Cloud Credentials
  awsCredentials: /\bAKIA[0-9A-Z]{16}\b|\baws_access_key_id\s*=\s*[^\s]+/gi,
  
  // Private Keys
  privateKey: /-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----[\s\S]*?-----END\s+(?:RSA\s+)?PRIVATE\s+KEY-----/gi,
  
  // JWT Tokens
  jwtToken: /\beyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*\b/g,
  
  // Names (basic pattern - may have false positives)
  names: /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g,
  
  // Addresses (basic pattern)
  addresses: /\b\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Way|Place|Pl)\b/gi,
  
  // Dates of Birth
  dob: /\b(?:birth|born|DOB|date of birth)[:\s]+(?:0?[1-9]|1[0-2])[\/\-](?:0?[1-9]|[12]\d|3[01])[\/\-]\d{4}\b/gi,
  
  // Passport Numbers
  passport: /\b[A-Z]{1,2}\d{6,9}\b/g,
  
  // Driver License Numbers
  driverLicense: /\b[A-Z]\d{7}\b|\b\d{7}[A-Z]\b/g
};

// PII severity levels
export enum PII_SEVERITY {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// PII detection result
export interface PIIDetectionResult {
  found: boolean;
  count: number;
  items: PIIItem[];
  severity: PII_SEVERITY;
  riskScore: number;
  recommendations: string[];
}

// Individual PII item
export interface PIIItem {
  type: string;
  pattern: RegExp;
  value: string;
  severity: PII_SEVERITY;
  startIndex: number;
  endIndex: number;
  context: string;
}

// PII type metadata
export const PII_TYPES = {
  email: { severity: PII_SEVERITY.HIGH, description: 'Email address' },
  phone: { severity: PII_SEVERITY.MEDIUM, description: 'Phone number' },
  ssn: { severity: PII_SEVERITY.CRITICAL, description: 'Social Security Number' },
  creditCard: { severity: PII_SEVERITY.CRITICAL, description: 'Credit card number' },
  ipAddress: { severity: PII_SEVERITY.LOW, description: 'IP address' },
  macAddress: { severity: PII_SEVERITY.LOW, description: 'MAC address' },
  urlWithPII: { severity: PII_SEVERITY.HIGH, description: 'URL containing PII parameters' },
  apiKey: { severity: PII_SEVERITY.CRITICAL, description: 'API key or access token' },
  dbConnection: { severity: PII_SEVERITY.CRITICAL, description: 'Database connection string' },
  awsCredentials: { severity: PII_SEVERITY.CRITICAL, description: 'AWS or cloud credentials' },
  privateKey: { severity: PII_SEVERITY.CRITICAL, description: 'Private key' },
  jwtToken: { severity: PII_SEVERITY.HIGH, description: 'JWT token' },
  names: { severity: PII_SEVERITY.MEDIUM, description: 'Full name' },
  addresses: { severity: PII_SEVERITY.MEDIUM, description: 'Physical address' },
  dob: { severity: PII_SEVERITY.HIGH, description: 'Date of birth' },
  passport: { severity: PII_SEVERITY.CRITICAL, description: 'Passport number' },
  driverLicense: { severity: PII_SEVERITY.HIGH, description: 'Driver license number' }
};

/**
 * Scan content for PII
 */
export function detectPII(content: string): PIIDetectionResult {
  const items: PIIItem[] = [];
  let totalRiskScore = 0;

  // Scan for each PII type
  Object.entries(PII_PATTERNS).forEach(([type, pattern]) => {
    const matches = content.matchAll(pattern);
    
    for (const match of matches) {
      if (match.index !== undefined) {
        const value = match[0];
        const startIndex = match.index;
        const endIndex = startIndex + value.length;
        
        // Get context (50 characters before and after)
        const contextStart = Math.max(0, startIndex - 50);
        const contextEnd = Math.min(content.length, endIndex + 50);
        const context = content.substring(contextStart, contextEnd);
        
        const severity = PII_TYPES[type as keyof typeof PII_TYPES]?.severity || PII_SEVERITY.MEDIUM;
        
        items.push({
          type,
          pattern,
          value,
          severity,
          startIndex,
          endIndex,
          context
        });
        
        // Calculate risk score
        const severityScore = {
          [PII_SEVERITY.LOW]: 1,
          [PII_SEVERITY.MEDIUM]: 3,
          [PII_SEVERITY.HIGH]: 7,
          [PII_SEVERITY.CRITICAL]: 10
        }[severity];
        
        totalRiskScore += severityScore;
      }
    }
  });

  // Determine overall severity
  const severity = determineOverallSeverity(totalRiskScore);
  
  // Generate recommendations
  const recommendations = generateRecommendations(items, severity);
  
  return {
    found: items.length > 0,
    count: items.length,
    items,
    severity,
    riskScore: totalRiskScore,
    recommendations
  };
}

/**
 * Determine overall severity based on risk score
 */
function determineOverallSeverity(riskScore: number): PII_SEVERITY {
  if (riskScore >= 20) return PII_SEVERITY.CRITICAL;
  if (riskScore >= 10) return PII_SEVERITY.HIGH;
  if (riskScore >= 5) return PII_SEVERITY.MEDIUM;
  return PII_SEVERITY.LOW;
}

/**
 * Generate recommendations based on detected PII
 */
function generateRecommendations(items: PIIItem[], severity: PII_SEVERITY): string[] {
  const recommendations: string[] = [];
  
  if (severity === PII_SEVERITY.CRITICAL) {
    recommendations.push('🚨 CRITICAL: Content contains highly sensitive information. Export blocked for security.');
    recommendations.push('Immediate action required: Remove or redact all PII before export.');
  } else if (severity === PII_SEVERITY.HIGH) {
    recommendations.push('⚠️ HIGH RISK: Content contains sensitive information. Review before export.');
    recommendations.push('Consider redacting PII or upgrading to Enterprise plan for advanced data handling.');
  } else if (severity === PII_SEVERITY.MEDIUM) {
    recommendations.push('⚠️ MEDIUM RISK: Content may contain personal information. Review recommended.');
  }
  
  // Specific recommendations based on PII types found
  const types = [...new Set(items.map(item => item.type))];
  
  if (types.includes('email')) {
    recommendations.push('Remove or redact email addresses before export.');
  }
  
  if (types.includes('phone')) {
    recommendations.push('Remove or redact phone numbers before export.');
  }
  
  if (types.includes('creditCard') || types.includes('ssn')) {
    recommendations.push('🚨 CRITICAL: Remove financial/identity information immediately.');
  }
  
  if (types.includes('apiKey') || types.includes('privateKey')) {
    recommendations.push('🚨 CRITICAL: Remove API keys and private keys immediately.');
  }
  
  return recommendations;
}

/**
 * Redact PII from content
 */
export function redactPII(content: string, items: PIIItem[]): string {
  let redactedContent = content;
  
  // Sort items by start index in descending order to avoid index shifting
  const sortedItems = [...items].sort((a, b) => b.startIndex - a.startIndex);
  
  sortedItems.forEach(item => {
    const redaction = getRedactionText(item.type, item.severity);
    redactedContent = 
      redactedContent.substring(0, item.startIndex) + 
      redaction + 
      redactedContent.substring(item.endIndex);
  });
  
  return redactedContent;
}

/**
 * Get appropriate redaction text for PII type
 */
function getRedactionText(type: string, severity: PII_SEVERITY): string {
  const baseRedaction = '[REDACTED]';
  
  switch (severity) {
    case PII_SEVERITY.CRITICAL:
      return `[${type.toUpperCase()}_REDACTED]`;
    case PII_SEVERITY.HIGH:
      return `[${type.toUpperCase()}_REMOVED]`;
    case PII_SEVERITY.MEDIUM:
      return `[${type.toUpperCase()}_MASKED]`;
    default:
      return baseRedaction;
  }
}

/**
 * Check if content is safe for export
 */
export function isContentSafeForExport(content: string): {
  safe: boolean;
  result: PIIDetectionResult;
  canProceed: boolean;
} {
  const result = detectPII(content);
  
  // Block export if critical PII is found
  if (result.severity === PII_SEVERITY.CRITICAL) {
    return {
      safe: false,
      result,
      canProceed: false
    };
  }
  
  // Allow export with warning for high/medium risk
  const canProceed = result.severity !== 'critical' as PII_SEVERITY;
  
  return {
    safe: result.severity === PII_SEVERITY.LOW,
    result,
    canProceed
  };
}

/**
 * Generate PII report for compliance
 */
export function generatePIIReport(result: PIIDetectionResult): string {
  const report = [
    '=== PII DETECTION REPORT ===',
    `Scan Date: ${new Date().toISOString()}`,
    `Overall Severity: ${result.severity.toUpperCase()}`,
    `Risk Score: ${result.riskScore}`,
    `Items Found: ${result.count}`,
    '',
    '=== DETECTED ITEMS ==='
  ];
  
  result.items.forEach((item, index) => {
    report.push(
      `${index + 1}. ${item.type.toUpperCase()} (${item.severity})`,
      `   Value: ${item.value}`,
      `   Context: ${item.context}`,
      `   Position: ${item.startIndex}-${item.endIndex}`,
      ''
    );
  });
  
  report.push('=== RECOMMENDATIONS ===');
  result.recommendations.forEach(rec => {
    report.push(`• ${rec}`);
  });
  
  return report.join('\n');
}
