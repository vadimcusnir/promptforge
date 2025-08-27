import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

// Initialize DOMPurify with JSDOM for server-side use
const window = new JSDOM('').window
const purify = DOMPurify(window as any)

// Prompt injection patterns
const PROMPT_INJECTION_PATTERNS = [
  // Direct injection attempts
  /ignore\s+previous\s+instructions/i,
  /forget\s+everything\s+before/i,
  /disregard\s+all\s+previous\s+commands/i,
  /stop\s+following\s+instructions/i,
  /new\s+instructions:/i,
  /system\s+prompt:/i,
  /assistant\s+prompt:/i,
  
  // Role manipulation
  /act\s+as\s+if\s+you\s+are/i,
  /pretend\s+to\s+be/i,
  /roleplay\s+as/i,
  /you\s+are\s+now/i,
  
  // Output manipulation
  /output\s+only/i,
  /respond\s+with/i,
  /answer\s+in\s+this\s+format/i,
  /format\s+your\s+response\s+as/i,
  
  // System bypass
  /bypass\s+security/i,
  /ignore\s+safety\s+measures/i,
  /disable\s+content\s+filtering/i,
  /override\s+system\s+prompt/i,
  
  // Malicious patterns
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /data:text\/html/gi,
  
  // SQL injection patterns
  /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/gi,
  /(\b(or|and)\b\s+\d+\s*=\s*\d+)/gi,
  /(\b(or|and)\b\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?)/gi,
  
  // XSS patterns
  /<iframe\b[^>]*>/gi,
  /<object\b[^>]*>/gi,
  /<embed\b[^>]*>/gi,
  /<form\b[^>]*>/gi,
  /<input\b[^>]*>/gi,
  /<textarea\b[^>]*>/gi,
  /<button\b[^>]*>/gi,
  /<select\b[^>]*>/gi,
  /<option\b[^>]*>/gi,
  /<optgroup\b[^>]*>/gi,
  /<fieldset\b[^>]*>/gi,
  /<legend\b[^>]*>/gi,
  /<label\b[^>]*>/gi,
  /<datalist\b[^>]*>/gi,
  /<output\b[^>]*>/gi,
  /<progress\b[^>]*>/gi,
  /<meter\b[^>]*>/gi,
  /<details\b[^>]*>/gi,
  /<summary\b[^>]*>/gi,
  /<dialog\b[^>]*>/gi,
  /<menu\b[^>]*>/gi,
  /<menuitem\b[^>]*>/gi,
  /<command\b[^>]*>/gi,
  /<keygen\b[^>]*>/gi,
  /<isindex\b[^>]*>/gi,
  /<listing\b[^>]*>/gi,
  /<plaintext\b[^>]*>/gi,
  /<xmp\b[^>]*>/gi,
  /<noembed\b[^>]*>/gi,
  /<noframes\b[^>]*>/gi,
  /<noscript\b[^>]*>/gi,
  /<nobr\b[^>]*>/gi,
  /<noindex\b[^>]*>/gi,
  /<nocol\b[^>]*>/gi,
  /<noframe\b[^>]*>/gi,
  /<nofont\b[^>]*>/gi,
  /<nolayer\b[^>]*>/gi,
  /<nomarquee\b[^>]*>/gi,
  /<nospacer\b[^>]*>/gi,
  /<notable\b[^>]*>/gi,
  /<nobr\b[^>]*>/gi,
  /<noindex\b[^>]*>/gi,
  /<nocol\b[^>]*>/gi,
  /<noframe\b[^>]*>/gi,
  /<nofont\b[^>]*>/gi,
  /<nolayer\b[^>]*>/gi,
  /<nomarquee\b[^>]*>/gi,
  /<nospacer\b[^>]*>/gi,
  /<notable\b[^>]*>/gi,
]

// HTML entity patterns
const HTML_ENTITY_PATTERNS = [
  /&[a-zA-Z0-9#]+;/g,
  /&#[0-9]+;/g,
  /&#x[a-fA-F0-9]+;/g,
]

// Dangerous URL patterns
const DANGEROUS_URL_PATTERNS = [
  /javascript:/gi,
  /data:/gi,
  /vbscript:/gi,
  /file:/gi,
  /ftp:/gi,
  /gopher:/gi,
  /mailto:/gi,
  /news:/gi,
  /nntp:/gi,
  /telnet:/gi,
  /wais:/gi,
  /prospero:/gi,
  /shttp:/gi,
  /snews:/gi,
  /nntps:/gi,
  /ftps:/gi,
  /gophers:/gi,
  /wais:/gi,
  /prospero:/gi,
  /shttp:/gi,
  /snews:/gi,
  /nntps:/gi,
  /ftps:/gi,
  /gophers:/gi,
]

export class InputSanitizer {
  // Sanitize HTML content
  sanitizeHTML(input: string, options: DOMPurify.Config = {}): string {
    const defaultOptions: DOMPurify.Config = {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'span', 'div'],
      ALLOWED_ATTR: ['href', 'title', 'class', 'id'],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
      KEEP_CONTENT: true,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      RETURN_TRUSTED_TYPE: false,
      FORCE_BODY: false,
      SANITIZE_DOM: true,
      IN_PLACE: false,
      ...options
    }

    return purify.sanitize(input, defaultOptions)
  }

  // Sanitize plain text (remove HTML and dangerous patterns)
  sanitizeText(input: string): string {
    if (!input || typeof input !== 'string') {
      return ''
    }

    let sanitized = input

    // Remove HTML tags
    sanitized = sanitized.replace(/<[^>]*>/g, '')
    
    // Remove HTML entities
    sanitized = sanitized.replace(/&[a-zA-Z0-9#]+;/g, '')
    sanitized = sanitized.replace(/&#[0-9]+;/g, '')
    sanitized = sanitized.replace(/&#x[a-fA-F0-9]+;/g, '')
    
    // Remove dangerous URL patterns
    DANGEROUS_URL_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '')
    })

    // Normalize whitespace
    sanitized = sanitized.replace(/\s+/g, ' ').trim()

    return sanitized
  }

  // Check for prompt injection attempts
  detectPromptInjection(input: string): { detected: boolean; patterns: string[]; risk: 'low' | 'medium' | 'high' } {
    if (!input || typeof input !== 'string') {
      return { detected: false, patterns: [], risk: 'low' }
    }

    const detectedPatterns: string[] = []
    let riskScore = 0

    PROMPT_INJECTION_PATTERNS.forEach(pattern => {
      if (pattern.test(input)) {
        detectedPatterns.push(pattern.source)
        riskScore += 1
      }
    })

    // Additional risk factors
    if (input.includes('system') && input.includes('prompt')) riskScore += 2
    if (input.includes('ignore') && input.includes('previous')) riskScore += 3
    if (input.includes('bypass') && input.includes('security')) riskScore += 4
    if (input.includes('<script') || input.includes('javascript:')) riskScore += 5

    let risk: 'low' | 'medium' | 'high' = 'low'
    if (riskScore >= 5) risk = 'high'
    else if (riskScore >= 2) risk = 'medium'

    return {
      detected: detectedPatterns.length > 0,
      patterns: detectedPatterns,
      risk
    }
  }

  // Sanitize prompt input specifically
  sanitizePrompt(input: string): { sanitized: string; warnings: string[] } {
    const warnings: string[] = []
    
    // Check for injection attempts
    const injectionCheck = this.detectPromptInjection(input)
    if (injectionCheck.detected) {
      warnings.push(`Prompt injection detected (${injectionCheck.risk} risk): ${injectionCheck.patterns.join(', ')}`)
    }

    // Sanitize the input
    let sanitized = this.sanitizeText(input)

    // Remove or escape suspicious patterns
    if (injectionCheck.risk === 'high') {
      // For high risk, remove suspicious content entirely
      PROMPT_INJECTION_PATTERNS.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '[REMOVED]')
      })
      warnings.push('High-risk content removed for security')
    } else if (injectionCheck.risk === 'medium') {
      // For medium risk, escape suspicious content
      sanitized = sanitized.replace(/</g, '&lt;').replace(/>/g, '&gt;')
      warnings.push('Suspicious content escaped for security')
    }

    return { sanitized, warnings }
  }

  // Validate and sanitize URLs
  sanitizeURL(input: string): { valid: boolean; sanitized: string; warnings: string[] } {
    const warnings: string[] = []
    
    if (!input || typeof input !== 'string') {
      return { valid: false, sanitized: '', warnings: ['Invalid input'] }
    }

    let sanitized = input.trim()

    // Check for dangerous protocols
    DANGEROUS_URL_PATTERNS.forEach(pattern => {
      if (pattern.test(sanitized)) {
        warnings.push(`Dangerous protocol detected: ${pattern.source}`)
        sanitized = sanitized.replace(pattern, 'https://')
      }
    })

    // Ensure proper URL format
    if (!sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
      sanitized = 'https://' + sanitized
      warnings.push('Added https:// protocol for security')
    }

    // Validate URL structure
    try {
      new URL(sanitized)
    } catch {
      warnings.push('Invalid URL format')
      return { valid: false, sanitized: '', warnings }
    }

    return { valid: true, sanitized, warnings }
  }

  // Sanitize JSON input
  sanitizeJSON(input: string): { valid: boolean; sanitized: any; warnings: string[] } {
    const warnings: string[] = []
    
    if (!input || typeof input !== 'string') {
      return { valid: false, sanitized: null, warnings: ['Invalid input'] }
    }

    try {
      const parsed = JSON.parse(input)
      const sanitized = this.sanitizeObject(parsed, warnings)
      return { valid: true, sanitized, warnings }
    } catch (error) {
      return { valid: false, sanitized: null, warnings: ['Invalid JSON format'] }
    }
  }

  // Recursively sanitize object properties
  private sanitizeObject(obj: any, warnings: string[]): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item, warnings))
    }
    
    if (obj !== null && typeof obj === 'object') {
      const sanitized: any = {}
      for (const [key, value] of Object.entries(obj)) {
        const sanitizedKey = this.sanitizeText(key)
        if (sanitizedKey !== key) {
          warnings.push(`Sanitized object key: ${key} -> ${sanitizedKey}`)
        }
        sanitized[sanitizedKey] = this.sanitizeObject(value, warnings)
      }
      return sanitized
    }
    
    if (typeof obj === 'string') {
      return this.sanitizeText(obj)
    }
    
    return obj
  }

  // Get sanitization statistics
  getSanitizationStats(): Record<string, any> {
    return {
      patterns: {
        promptInjection: PROMPT_INJECTION_PATTERNS.length,
        htmlEntities: HTML_ENTITY_PATTERNS.length,
        dangerousUrls: DANGEROUS_URL_PATTERNS.length
      },
      config: {
        allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'span', 'div'],
        allowedAttributes: ['href', 'title', 'class', 'id'],
        maxRiskScore: 10
      }
    }
  }
}

// Export singleton instance
export const inputSanitizer = new InputSanitizer()
