#!/usr/bin/env node

/**
 * Voice & Branding Consistency Checker
 * 
 * Verifies:
 * - Single H1 per page
 * - Operational tone (no forbidden words: easy, magic, etc.)
 * - Limited vector badges (max 2 per screen)
 * - Font consistency (Montserrat/Open Sans)
 * - Glass/glow tokens minimized
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Forbidden words that violate operational tone
const FORBIDDEN_WORDS = [
  'easy', 'simple', 'magic', 'instant', 'quick', 'fast',
  'ușor', 'magic', 'instant', 'rapid', 'simplu',
  'effortless', 'one-click', 'automagic', 'wizard'
];

// Font tokens that should be used
const ALLOWED_FONTS = [
  'font-montserrat', 'font-open-sans', 'font-serif'
];

// Glass/glow tokens to minimize
const GLASS_GLOW_TOKENS = [
  'glass-card', 'glass-panel', 'backdrop-blur', 'blur-',
  'glow', 'shadow-', 'animate-pulse', 'animate-bounce'
];

// Vector badge patterns
const VECTOR_BADGE_PATTERNS = [
  /Badge.*vector/i,
  /vector.*Badge/i,
  /V[1-7].*Badge/i,
  /Badge.*V[1-7]/i
];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const issues = [];
  
  // Check for multiple H1 tags
  const h1Count = (content.match(/<h1/g) || []).length;
  if (h1Count > 1) {
    issues.push(`❌ Multiple H1 tags found: ${h1Count}`);
  } else if (h1Count === 1) {
    issues.push(`✅ Single H1 tag found`);
  } else {
    issues.push(`⚠️  No H1 tag found`);
  }
  
  // Check for forbidden words
  const forbiddenFound = [];
  FORBIDDEN_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = content.match(regex);
    if (matches) {
      forbiddenFound.push(`${word} (${matches.length}x)`);
    }
  });
  
  if (forbiddenFound.length > 0) {
    issues.push(`❌ Forbidden words found: ${forbiddenFound.join(', ')}`);
  } else {
    issues.push(`✅ No forbidden words found`);
  }
  
  // Check for vector badges
  const vectorBadgeCount = VECTOR_BADGE_PATTERNS.reduce((count, pattern) => {
    const matches = content.match(pattern);
    return count + (matches ? matches.length : 0);
  }, 0);
  
  if (vectorBadgeCount > 2) {
    issues.push(`❌ Too many vector badges: ${vectorBadgeCount} (max 2)`);
  } else if (vectorBadgeCount > 0) {
    issues.push(`✅ Vector badges within limit: ${vectorBadgeCount}`);
  } else {
    issues.push(`✅ No vector badges found`);
  }
  
  // Check font consistency
  const fontTokens = [];
  ALLOWED_FONTS.forEach(font => {
    const matches = content.match(new RegExp(font, 'g'));
    if (matches) {
      fontTokens.push(`${font} (${matches.length}x)`);
    }
  });
  
  if (fontTokens.length > 0) {
    issues.push(`✅ Font tokens used: ${fontTokens.join(', ')}`);
  } else {
    issues.push(`⚠️  No font tokens found`);
  }
  
  // Check glass/glow tokens
  const glassGlowCount = GLASS_GLOW_TOKENS.reduce((count, token) => {
    const matches = content.match(new RegExp(token, 'g'));
    return count + (matches ? matches.length : 0);
  }, 0);
  
  if (glassGlowCount > 5) {
    issues.push(`❌ Too many glass/glow tokens: ${glassGlowCount} (max 5)`);
  } else if (glassGlowCount > 0) {
    issues.push(`✅ Glass/glow tokens within limit: ${glassGlowCount}`);
  } else {
    issues.push(`✅ No glass/glow tokens found`);
  }
  
  return {
    file: path.relative(process.cwd(), filePath),
    issues,
    h1Count,
    forbiddenCount: forbiddenFound.length,
    vectorBadgeCount,
    glassGlowCount
  };
}

function main() {
  console.log('🔍 Voice & Branding Consistency Check\n');
  
  // Find all React/TypeScript files
  const files = glob.sync('app/**/*.{tsx,ts}', { ignore: ['**/node_modules/**'] });
  
  const results = [];
  let totalIssues = 0;
  
  files.forEach(file => {
    const result = checkFile(file);
    results.push(result);
    totalIssues += result.issues.filter(issue => issue.startsWith('❌')).length;
  });
  
  // Display results
  results.forEach(result => {
    if (result.issues.some(issue => issue.startsWith('❌'))) {
      console.log(`\n📁 ${result.file}`);
      result.issues.forEach(issue => {
        console.log(`  ${issue}`);
      });
    }
  });
  
  // Summary
  console.log('\n📊 Summary:');
  console.log(`Files checked: ${files.length}`);
  console.log(`Total issues: ${totalIssues}`);
  
  const filesWithIssues = results.filter(r => r.issues.some(i => i.startsWith('❌'))).length;
  console.log(`Files with issues: ${filesWithIssues}`);
  
  if (totalIssues === 0) {
    console.log('\n🎉 All files pass Voice & Branding checks!');
  } else {
    console.log('\n⚠️  Some files need attention for Voice & Branding consistency.');
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkFile, FORBIDDEN_WORDS, ALLOWED_FONTS, GLASS_GLOW_TOKENS };
