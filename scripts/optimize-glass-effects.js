#!/usr/bin/env node

/**
 * Automated Glass Effects Optimizer
 * 
 * This script automatically optimizes glass/glow effects across the codebase:
 * - Replaces glass-card with bg-zinc-900/80 border border-zinc-700
 * - Removes unnecessary animate-pulse
 * - Reduces backdrop-blur effects
 * - Optimizes shadow effects
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Optimization rules
const OPTIMIZATION_RULES = [
  {
    name: 'glass-card → simple background',
    pattern: /glass-card/g,
    replacement: 'bg-zinc-900/80 border border-zinc-700'
  },
  {
    name: 'remove animate-pulse',
    pattern: /animate-pulse/g,
    replacement: ''
  },
  {
    name: 'reduce backdrop-blur',
    pattern: /backdrop-blur-\w+/g,
    replacement: 'backdrop-blur-sm'
  },
  {
    name: 'simplify shadows',
    pattern: /shadow-\w+/g,
    replacement: 'shadow-md'
  },
  {
    name: 'remove glow effects',
    pattern: /glow-\w+/g,
    replacement: ''
  }
];

class GlassEffectsOptimizer {
  constructor() {
    this.optimizedFiles = [];
    this.backupFiles = [];
    this.stats = {
      totalFiles: 0,
      optimizedFiles: 0,
      tokensReplaced: 0,
      glassTokensReduced: 0
    };
  }

  async optimizeFile(filePath) {
    try {
      // Create backup
      const backupPath = `${filePath}.backup`;
      fs.copyFileSync(filePath, backupPath);
      this.backupFiles.push(backupPath);

      // Read file content
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      let tokensReplaced = 0;

      // Apply optimization rules
      OPTIMIZATION_RULES.forEach(rule => {
        const matches = content.match(rule.pattern);
        if (matches) {
          content = content.replace(rule.pattern, rule.replacement);
          tokensReplaced += matches.length;
          console.log(`  🔧 ${rule.name}: ${matches.length} tokens`);
        }
      });

      // Count glass tokens before and after
      const glassTokensBefore = (content.match(/glass|backdrop-blur|animate-pulse|shadow-\w+|glow/g) || []).length;
      const glassTokensAfter = (content.match(/glass|backdrop-blur|animate-pulse|shadow-\w+|glow/g) || []).length;

      // Write optimized content
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        this.optimizedFiles.push(filePath);
        this.stats.tokensReplaced += tokensReplaced;
        this.stats.glassTokensReduced += (glassTokensBefore - glassTokensAfter);

        console.log(`  ✅ Optimized: ${tokensReplaced} tokens replaced, ${glassTokensBefore} → ${glassTokensAfter} glass tokens`);
        return true;
      }

      return false;
    } catch (error) {
      console.error(`  ❌ Error optimizing ${filePath}:`, error.message);
      return false;
    }
  }

  async optimizeCodebase() {
    console.log('🚀 Glass Effects Optimization Started\n');

    // Find all React/TypeScript files
    const files = glob.sync('app/**/*.{tsx,ts}', { 
      ignore: [
        '**/node_modules/**',
        '**/*.test.*',
        '**/*.spec.*',
        '**/__tests__/**'
      ] 
    });

    this.stats.totalFiles = files.length;
    console.log(`📁 Found ${files.length} files to optimize\n`);

    // Optimize each file
    for (const file of files) {
      console.log(`📝 Optimizing: ${file}`);
      const wasOptimized = await this.optimizeFile(file);
      if (wasOptimized) {
        this.stats.optimizedFiles++;
      }
      console.log('');
    }

    // Generate optimization report
    this.generateReport();
  }

  generateReport() {
    console.log('📊 Optimization Report\n');
    console.log(`Total files processed: ${this.stats.totalFiles}`);
    console.log(`Files optimized: ${this.stats.optimizedFiles}`);
    console.log(`Total tokens replaced: ${this.stats.tokensReplaced}`);
    console.log(`Glass tokens reduced: ${this.stats.glassTokensReduced}`);

    const report = {
      timestamp: new Date().toISOString(),
      stats: this.stats,
      optimizedFiles: this.optimizedFiles,
      backupFiles: this.backupFiles,
      optimizationRules: OPTIMIZATION_RULES.map(rule => ({
        name: rule.name,
        pattern: rule.pattern.toString()
      }))
    };

    const reportPath = 'glass-effects-optimization-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Optimization report saved to: ${reportPath}`);

    // Show next steps
    console.log('\n🔄 Next Steps:');
    console.log('1. Run Voice & Branding check: npm run check:voice-branding');
    console.log('2. Test performance: npm run test:performance:glass');
    console.log('3. Review optimized files');
    console.log('4. Commit changes if satisfied');
    console.log('5. Restore backups if needed: npm run restore:glass-backups');
  }

  async restoreBackups() {
    console.log('🔄 Restoring backups...');
    
    for (const backupFile of this.backupFiles) {
      if (fs.existsSync(backupFile)) {
        const originalFile = backupFile.replace('.backup', '');
        fs.copyFileSync(backupFile, originalFile);
        fs.unlinkSync(backupFile);
        console.log(`  ✅ Restored: ${originalFile}`);
      }
    }

    console.log('\n✅ All backups restored');
  }
}

async function main() {
  const optimizer = new GlassEffectsOptimizer();
  
  try {
    await optimizer.optimizeCodebase();
  } catch (error) {
    console.error('❌ Optimization failed:', error);
  }
}

// CLI commands
if (require.main === module) {
  const command = process.argv[2];
  const optimizer = new GlassEffectsOptimizer();

  switch (command) {
    case 'restore':
      optimizer.restoreBackups();
      break;
    case 'optimize':
    default:
      main();
      break;
  }
}

module.exports = { GlassEffectsOptimizer, OPTIMIZATION_RULES };
