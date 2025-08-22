#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Simple language detection - checks for non-ASCII characters and common non-English patterns
function detectLanguage(text) {
  // Remove code blocks, HTML tags, and technical content
  const cleanText = text
    .replace(/```[\s\S]*?```/g, ' ') // code blocks
    .replace(/<[^>]+>/g, ' ') // HTML tags
    .replace(/[`~!@#$%^&*()_+={}|[\]\\:";'<>?,./0-9-]/g, ' ') // punctuation and numbers
    .replace(/\b(function|const|let|var|if|else|for|while|class|import|export|async|await|return|true|false|null|undefined)\b/gi, ' ') // JS keywords
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

async function scanFiles() {
  const patterns = process.argv.slice(2);
  if (patterns.length === 0) {
    patterns.push('content/**/*.{md,mdx}'); // Focus on content files only for now
  }

  const allFiles = [];
  for (const pattern of patterns) {
    try {
      const files = await glob(pattern, { ignore: ['node_modules/**', '.next/**', 'dist/**', 'build/**'] });
      allFiles.push(...files);
    } catch (error) {
      console.warn(`Warning: Could not process pattern ${pattern}:`, error.message);
    }
  }

  const uniqueFiles = [...new Set(allFiles)];
  const violations = [];

  for (const file of uniqueFiles) {
    try {
      if (!fs.existsSync(file)) continue;
      
      const text = fs.readFileSync(file, 'utf8');
      
      // Skip validation for code files - focus on content files
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
        // Only check string literals and comments in code files
        const stringLiterals = text.match(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g) || [];
        const comments = text.match(/\/\*[\s\S]*?\*\/|\/\/.*$/gm) || [];
        
        for (const literal of [...stringLiterals, ...comments]) {
          const detectedLang = detectLanguage(literal);
          if (detectedLang !== 'ENGLISH') {
            violations.push([file, `${detectedLang} in string/comment`]);
            break;
          }
        }
      } else {
        // Full validation for content files
        const detectedLang = detectLanguage(text);
        if (detectedLang !== 'ENGLISH') {
          violations.push([file, detectedLang]);
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not read file ${file}:`, error.message);
    }
  }

  if (violations.length > 0) {
    console.error('❌ English-only check failed:');
    for (const [file, reason] of violations) {
      console.error(`  - ${file} (${reason})`);
    }
    process.exit(1);
  }

  console.log('✅ English-only check passed.');
}

scanFiles().catch(error => {
  console.error('Error during English scan:', error);
  process.exit(1);
});
