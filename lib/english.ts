/**
 * English-only validation utilities for API endpoints
 */

// Simple language detection - checks for non-ASCII characters and common non-English patterns
function detectLanguage(text: string): string {
  // Remove code blocks, HTML tags, and technical content
  const cleanText = text
    .replace(/```[\s\S]*?```/g, ' ') // code blocks
    .replace(/<[^>]+>/g, ' ') // HTML tags
    .replace(/[`~!@#$%^&*()_+={}|[\]\\:";'<>?,./0-9-]/g, ' ') // punctuation and numbers
    .replace(
      /\b(function|const|let|var|if|else|for|while|class|import|export|async|await|return|true|false|null|undefined)\b/gi,
      ' '
    ) // JS keywords
    .trim();

  // Check for non-ASCII characters, but exclude common technical symbols
  const nonAsciiText = text.replace(/[""''–—…]/g, ''); // Remove common smart quotes and dashes
  if (/[^\x00-\x7F]/.test(nonAsciiText)) {
    // Allow technical symbols and check if it's actual text content
    const textContent = nonAsciiText.replace(/[^a-zA-Z\s]/g, ' ').trim();
    if (textContent.length > 10 && /[^\x00-\x7F]/.test(textContent)) {
      return 'NON_ASCII';
    }
  }

  // Check for common Romanian words/patterns
  const romanianPatterns = [
    /\b(și|în|cu|de|la|pe|sau|dacă|pentru|este|sunt|avea|face|foarte|mult|mai|doar|după|prin|dintre|către|despre|asupra|astfel|astfel|până|când|unde|cum|care|ce|această|aceste|acestea|toate|toți|toate|fiecare|orice|oricare|nimeni|nimic)\b/gi,
    /\b(ă|â|î|ș|ț)\b/g,
  ];

  // Check for common Russian/Cyrillic patterns
  const cyrillicPatterns = [
    /[а-яё]/gi,
    /\b(что|как|где|когда|почему|который|которая|которое|которые|этот|эта|это|эти|тот|та|то|те|все|всё|всех|всем|всеми|каждый|каждая|каждое|каждые)\b/gi,
  ];

  // Check for common French patterns
  const frenchPatterns = [
    /\b(le|la|les|un|une|des|du|de|et|ou|avec|pour|dans|sur|par|sans|sous|entre|depuis|pendant|avant|après|chez|vers|contre|selon|malgré|parmi|durant)\b/gi,
    /\b(être|avoir|faire|aller|dire|voir|savoir|pouvoir|vouloir|venir|devoir|prendre|donner|mettre|partir|passer|porter|regarder|suivre|rester)\b/gi,
  ];

  // Check for common German patterns
  const germanPatterns = [
    /\b(der|die|das|ein|eine|und|oder|mit|für|in|auf|an|zu|von|bei|nach|über|unter|zwischen|während|vor|seit|gegen|ohne|durch|um|bis|als|wenn|dass|weil|ob)\b/gi,
    /\b(sein|haben|werden|können|müssen|sollen|wollen|dürfen|mögen|lassen|gehen|kommen|machen|sagen|sehen|wissen|denken|nehmen|geben|finden)\b/gi,
  ];

  // Check for common Spanish patterns
  const spanishPatterns = [
    /\b(el|la|los|las|un|una|y|o|con|para|en|de|por|sin|sobre|entre|desde|durante|antes|después|hacia|contra|según|mediante|excepto|salvo)\b/gi,
    /\b(ser|estar|tener|hacer|ir|decir|ver|saber|poder|querer|venir|deber|tomar|dar|poner|salir|pasar|llevar|seguir|quedar)\b/gi,
  ];

  // Check patterns
  for (const pattern of romanianPatterns) {
    if (pattern.test(cleanText)) return 'ROMANIAN';
  }
  for (const pattern of cyrillicPatterns) {
    if (pattern.test(text)) return 'CYRILLIC';
  }
  for (const pattern of frenchPatterns) {
    if (pattern.test(cleanText)) return 'FRENCH';
  }
  for (const pattern of germanPatterns) {
    if (pattern.test(cleanText)) return 'GERMAN';
  }
  for (const pattern of spanishPatterns) {
    if (pattern.test(cleanText)) return 'SPANISH';
  }

  return 'ENGLISH';
}

/**
 * Validates that the given text is in English only
 * @param text - The text to validate
 * @returns true if text is English, false otherwise
 */
export function assertEnglish(text: string): boolean {
  if (!text || text.trim().length === 0) return true; // Empty text is valid

  // Skip validation for very short texts (likely technical terms)
  if (text.trim().split(/\s+/).length < 3) return true;

  const detectedLang = detectLanguage(text);
  return detectedLang === 'ENGLISH';
}

/**
 * Creates a standardized error response for non-English content
 * @param detectedLanguage - Optional detected language for debugging
 */
export function createNonEnglishError(detectedLanguage?: string) {
  return {
    error: 'NON_ENGLISH_CONTENT',
    message: 'Content must be in English only. Non-English text detected.',
    code: 422,
    timestamp: new Date().toISOString(),
    ...(detectedLanguage && { detectedLanguage }),
  };
}

/**
 * Middleware-style validator for API routes
 * Validates request body text fields for English-only content
 */
export function validateEnglishContent(data: any): {
  isValid: boolean;
  error?: any;
} {
  const textFields = ['prompt', 'content', 'description', 'title', 'text', 'message'];

  for (const field of textFields) {
    if (data[field] && typeof data[field] === 'string') {
      if (!assertEnglish(data[field])) {
        return {
          isValid: false,
          error: createNonEnglishError(),
        };
      }
    }
  }

  return { isValid: true };
}
