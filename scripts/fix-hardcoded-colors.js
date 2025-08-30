#!/usr/bin/env node

/**
 * Fix Hardcoded Colors Script
 * 
 * This script replaces hardcoded color values with design tokens
 * to ensure unified color system across the application.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Color mapping from hardcoded values to design tokens
const COLOR_MAPPINGS = {
  // Gold accent colors
  '#d1a954': 'hsl(var(--primary))',
  '#d1a954': 'hsl(var(--accent))',
  'rgb(209, 169, 84)': 'hsl(var(--primary))',
  'rgba(209, 169, 84, 0.1)': 'hsl(var(--primary) / 0.1)',
  'rgba(209, 169, 84, 0.2)': 'hsl(var(--primary) / 0.2)',
  'rgba(209, 169, 84, 0.3)': 'hsl(var(--primary) / 0.3)',
  'rgba(209, 169, 84, 0.5)': 'hsl(var(--primary) / 0.5)',
  'rgba(209, 169, 84, 0.8)': 'hsl(var(--primary) / 0.8)',
  
  // Background colors
  '#0a0a0a': 'hsl(var(--background))',
  '#000000': 'hsl(var(--background))',
  'rgb(10, 10, 10)': 'hsl(var(--background))',
  'rgba(0, 0, 0, 0.5)': 'hsl(var(--background) / 0.5)',
  'rgba(0, 0, 0, 0.8)': 'hsl(var(--background) / 0.8)',
  'rgba(0, 0, 0, 0.9)': 'hsl(var(--background) / 0.9)',
  
  // Foreground colors
  '#ecfeff': 'hsl(var(--foreground))',
  '#ffffff': 'hsl(var(--foreground))',
  'rgb(236, 254, 255)': 'hsl(var(--foreground))',
  'rgba(255, 255, 255, 0.1)': 'hsl(var(--foreground) / 0.1)',
  'rgba(255, 255, 255, 0.2)': 'hsl(var(--foreground) / 0.2)',
  'rgba(255, 255, 255, 0.3)': 'hsl(var(--foreground) / 0.3)',
  'rgba(255, 255, 255, 0.5)': 'hsl(var(--foreground) / 0.5)',
  'rgba(255, 255, 255, 0.6)': 'hsl(var(--foreground) / 0.6)',
  'rgba(255, 255, 255, 0.8)': 'hsl(var(--foreground) / 0.8)',
  'rgba(255, 255, 255, 0.9)': 'hsl(var(--foreground) / 0.9)',
  
  // Card colors
  'rgba(255, 255, 255, 0.06)': 'hsl(var(--card))',
  'rgba(255, 255, 255, 0.12)': 'hsl(var(--border))',
  
  // Success colors
  '#00ff7f': 'hsl(var(--success))',
  'rgb(0, 255, 127)': 'hsl(var(--success))',
  'rgba(0, 255, 127, 0.1)': 'hsl(var(--success) / 0.1)',
  'rgba(0, 255, 127, 0.2)': 'hsl(var(--success) / 0.2)',
  'rgba(0, 255, 127, 0.3)': 'hsl(var(--success) / 0.3)',
  'rgba(0, 255, 127, 0.5)': 'hsl(var(--success) / 0.5)',
  'rgba(0, 255, 127, 0.6)': 'hsl(var(--success) / 0.6)',
  'rgba(0, 255, 127, 0.7)': 'hsl(var(--success) / 0.7)',
  'rgba(0, 255, 127, 0.8)': 'hsl(var(--success) / 0.8)',
  
  // Error colors
  '#dc2626': 'hsl(var(--destructive))',
  '#ef4444': 'hsl(var(--destructive))',
  'rgb(220, 38, 38)': 'hsl(var(--destructive))',
  'rgba(220, 38, 38, 0.1)': 'hsl(var(--destructive) / 0.1)',
  'rgba(220, 38, 38, 0.2)': 'hsl(var(--destructive) / 0.2)',
  
  // Warning colors
  '#f59e0b': 'hsl(var(--warning))',
  '#eab308': 'hsl(var(--warning))',
  'rgb(245, 158, 11)': 'hsl(var(--warning))',
  'rgba(245, 158, 11, 0.1)': 'hsl(var(--warning) / 0.1)',
  'rgba(245, 158, 11, 0.2)': 'hsl(var(--warning) / 0.2)',
  
  // Info colors
  '#3b82f6': 'hsl(var(--info))',
  '#06b6d4': 'hsl(var(--info))',
  'rgb(59, 130, 246)': 'hsl(var(--info))',
  'rgba(59, 130, 246, 0.1)': 'hsl(var(--info) / 0.1)',
  'rgba(59, 130, 246, 0.2)': 'hsl(var(--info) / 0.2)',
  
  // Muted colors
  '#6b7280': 'hsl(var(--muted))',
  '#9ca3af': 'hsl(var(--muted-foreground))',
  'rgb(107, 114, 128)': 'hsl(var(--muted))',
  'rgb(156, 163, 175)': 'hsl(var(--muted-foreground))',
  'rgba(107, 114, 128, 0.1)': 'hsl(var(--muted) / 0.1)',
  'rgba(107, 114, 128, 0.2)': 'hsl(var(--muted) / 0.2)',
  'rgba(107, 114, 128, 0.3)': 'hsl(var(--muted) / 0.3)',
  'rgba(107, 114, 128, 0.5)': 'hsl(var(--muted) / 0.5)',
  'rgba(107, 114, 128, 0.6)': 'hsl(var(--muted) / 0.6)',
  'rgba(107, 114, 128, 0.8)': 'hsl(var(--muted) / 0.8)',
  
  // Slate colors (common in the codebase)
  '#0f172a': 'hsl(var(--background))',
  '#1e293b': 'hsl(var(--card))',
  '#334155': 'hsl(var(--muted))',
  '#475569': 'hsl(var(--muted))',
  '#64748b': 'hsl(var(--muted-foreground))',
  '#94a3b8': 'hsl(var(--muted-foreground))',
  '#cbd5e1': 'hsl(var(--muted-foreground))',
  '#e2e8f0': 'hsl(var(--muted-foreground))',
  '#f1f5f9': 'hsl(var(--muted-foreground))',
  '#f8fafc': 'hsl(var(--muted-foreground))',
  
  // Glass effect colors
  'rgba(15, 23, 42, 0.5)': 'hsl(var(--glass))',
  'rgba(15, 23, 42, 0.8)': 'hsl(var(--glass))',
  'rgba(30, 41, 59, 0.5)': 'hsl(var(--glass))',
  'rgba(30, 41, 59, 0.8)': 'hsl(var(--glass))',
  'rgba(51, 65, 85, 0.5)': 'hsl(var(--glass))',
  'rgba(51, 65, 85, 0.8)': 'hsl(var(--glass))',
};

function fixHardcodedColors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Replace hardcoded colors with design tokens
    for (const [hardcoded, token] of Object.entries(COLOR_MAPPINGS)) {
      const regex = new RegExp(hardcoded.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      if (content.includes(hardcoded)) {
        content = content.replace(regex, token);
        modified = true;
      }
    }
    
    // Also replace common Tailwind color patterns
    const tailwindPatterns = [
      { pattern: /bg-\[#([0-9a-fA-F]{6})\]/g, replacement: 'bg-primary' },
      { pattern: /text-\[#([0-9a-fA-F]{6})\]/g, replacement: 'text-foreground' },
      { pattern: /border-\[#([0-9a-fA-F]{6})\]/g, replacement: 'border-border' },
    ];
    
    for (const { pattern, replacement } of tailwindPatterns) {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed hardcoded colors in: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function findFilesWithHardcodedColors() {
  try {
    // Find files with hardcoded colors
    const result = execSync('grep -r "bg-\\[#\\|text-\\[#\\|border-\\[#" --include="*.tsx" --include="*.ts" --include="*.css" . | cut -d: -f1 | sort | uniq', { 
      encoding: 'utf8',
      cwd: process.cwd()
    });
    
    return result.trim().split('\n').filter(file => file && !file.includes('node_modules'));
  } catch (error) {
    console.log('No files with hardcoded colors found or grep failed');
    return [];
  }
}

function main() {
  console.log('🔧 Fixing hardcoded colors...\n');
  
  const files = findFilesWithHardcodedColors();
  
  if (files.length === 0) {
    console.log('✅ No files with hardcoded colors found!');
    return;
  }
  
  console.log(`Found ${files.length} files with hardcoded colors:`);
  files.forEach(file => console.log(`  - ${file}`));
  console.log('');
  
  let fixedCount = 0;
  
  for (const file of files) {
    if (fixHardcodedColors(file)) {
      fixedCount++;
    }
  }
  
  console.log(`\n🎉 Fixed hardcoded colors in ${fixedCount} files`);
  
  // Verify the fix
  try {
    const remaining = execSync('grep -r "bg-\\[#\\|text-\\[#\\|border-\\[#" --include="*.tsx" --include="*.ts" --include="*.css" . | wc -l', { 
      encoding: 'utf8',
      cwd: process.cwd()
    });
    
    const remainingCount = parseInt(remaining.trim());
    console.log(`\n📊 Remaining hardcoded colors: ${remainingCount}`);
    
    if (remainingCount === 0) {
      console.log('✅ All hardcoded colors have been replaced with design tokens!');
    } else {
      console.log('⚠️  Some hardcoded colors remain. Manual review may be needed.');
    }
  } catch (error) {
    console.log('Could not verify remaining hardcoded colors');
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  fixHardcodedColors,
  findFilesWithHardcodedColors,
  COLOR_MAPPINGS
};
