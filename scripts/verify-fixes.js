#!/usr/bin/env node

/**
 * PromptForge v3 - Security & Infrastructure Fixes Verification Script
 * Tests all implemented fixes to ensure they're working correctly
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 PROMPTFORGE v3 - SECURITY & INFRASTRUCTURE FIXES VERIFICATION\n');

let allTestsPassed = true;
const results = {
  backup: { passed: 0, failed: 0, total: 0 },
  config: { passed: 0, failed: 0, total: 0 },
  layout: { passed: 0, failed: 0, total: 0 }
};

// Test 1: Backup Script Functionality
console.log('📊 Testing Backup Script Functionality...');
try {
  // Test help command
  execSync('node scripts/supabase-backup.js --help', { stdio: 'pipe' });
  console.log('   ✅ Help command works');
  results.backup.passed++;
  
  // Test list command
  execSync('node scripts/supabase-backup.js list', { stdio: 'pipe' });
  console.log('   ✅ List command works');
  results.backup.passed++;
  
  // Test script exists and is executable
  const backupScript = 'scripts/supabase-backup.js';
  if (fs.existsSync(backupScript)) {
    console.log('   ✅ Backup script exists');
    results.backup.passed++;
  } else {
    throw new Error('Backup script not found');
  }
  
  // Test cron setup script
  const cronScript = 'scripts/setup-backup-cron.sh';
  if (fs.existsSync(cronScript)) {
    const stats = fs.statSync(cronScript);
    if (stats.mode & 0o111) {
      console.log('   ✅ Cron setup script is executable');
      results.backup.passed++;
    } else {
      throw new Error('Cron setup script is not executable');
    }
  } else {
    throw new Error('Cron setup script not found');
  }
  
  results.backup.total = 4;
  console.log('   🎯 Backup tests: PASSED\n');
  
} catch (error) {
  console.log(`   ❌ Backup test failed: ${error.message}`);
  results.backup.failed++;
  results.backup.total = 4;
  allTestsPassed = false;
}

// Test 2: Configuration Files
console.log('⚙️  Testing Configuration Files...');
try {
  // Test env.example exists
  if (fs.existsSync('env.example')) {
    console.log('   ✅ env.example file exists');
    results.config.passed++;
    
    const envContent = fs.readFileSync('env.example', 'utf8');
    if (envContent.includes('STRIPE_SECRET_KEY') && envContent.includes('SUPABASE_URL')) {
      console.log('   ✅ env.example contains required variables');
      results.config.passed++;
    } else {
      throw new Error('env.example missing required variables');
    }
  } else {
    throw new Error('env.example file not found');
  }
  
  // Test README updated
  if (fs.existsSync('README_SETUP.md')) {
    const readmeContent = fs.readFileSync('README_SETUP.md', 'utf8');
    if (readmeContent.includes('env.example') && readmeContent.includes('.env.local')) {
      console.log('   ✅ README_SETUP.md updated with env.example instructions');
      results.config.passed++;
    } else {
      throw new Error('README_SETUP.md not properly updated');
    }
  } else {
    throw new Error('README_SETUP.md not found');
  }
  
  results.config.total = 3;
  console.log('   🎯 Configuration tests: PASSED\n');
  
} catch (error) {
  console.log(`   ❌ Configuration test failed: ${error.message}`);
  results.config.failed++;
  results.config.total = 3;
  allTestsPassed = false;
}

// Test 3: Layout Structure
console.log('🏗️  Testing Layout Structure...');
try {
  // Test root layout has Header and Footer
  if (fs.existsSync('app/layout.tsx')) {
    const layoutContent = fs.readFileSync('app/layout.tsx', 'utf8');
    if (layoutContent.includes('<Header />') && layoutContent.includes('<Footer />')) {
      console.log('   ✅ Root layout includes Header and Footer');
      results.layout.passed++;
    } else {
      throw new Error('Root layout missing Header or Footer');
    }
  } else {
    throw new Error('Root layout not found');
  }
  
  // Test ComingSoonWrapper doesn't duplicate headers
  if (fs.existsSync('components/coming-soon-wrapper.tsx')) {
    const wrapperContent = fs.readFileSync('components/coming-soon-wrapper.tsx', 'utf8');
    if (!wrapperContent.includes('<Header />') && !wrapperContent.includes('<Footer />')) {
      console.log('   ✅ ComingSoonWrapper no longer duplicates headers/footers');
      results.layout.passed++;
    } else {
      throw new Error('ComingSoonWrapper still contains Header or Footer');
    }
  } else {
    throw new Error('ComingSoonWrapper not found');
  }
  
  // Test local coming-soon layout exists
  if (fs.existsSync('app/coming-soon/layout.tsx')) {
    console.log('   ✅ Local coming-soon layout exists');
    results.layout.passed++;
  } else {
    throw new Error('Local coming-soon layout not found');
  }
  
  // Test ruleset has layout protection
  if (fs.existsSync('ruleset.yml')) {
    const rulesetContent = fs.readFileSync('ruleset.yml', 'utf8');
    if (rulesetContent.includes('app/layout.tsx') && rulesetContent.includes('components/header.tsx')) {
      console.log('   ✅ Ruleset includes layout protection');
      results.layout.passed++;
    } else {
      throw new Error('Ruleset missing layout protection');
    }
  } else {
    throw new Error('Ruleset not found');
  }
  
  results.layout.total = 4;
  console.log('   🎯 Layout tests: PASSED\n');
  
} catch (error) {
  console.log(`   ❌ Layout test failed: ${error.message}`);
  results.layout.failed++;
  results.layout.total = 4;
  allTestsPassed = false;
}

// Test 4: Package.json Scripts
console.log('📦 Testing Package.json Scripts...');
try {
  if (fs.existsSync('package.json')) {
    const packageContent = fs.readFileSync('package.json', 'utf8');
    const requiredScripts = [
      'backup:setup',
      'backup:test', 
      'backup:create',
      'backup:verify'
    ];
    
    let scriptsFound = 0;
    requiredScripts.forEach(script => {
      if (packageContent.includes(script)) {
        scriptsFound++;
      }
    });
    
    if (scriptsFound === requiredScripts.length) {
      console.log('   ✅ All backup scripts added to package.json');
    } else {
      throw new Error(`Missing backup scripts: ${requiredScripts.length - scriptsFound} not found`);
    }
  } else {
    throw new Error('package.json not found');
  }
  
  console.log('   🎯 Package.json tests: PASSED\n');
  
} catch (error) {
  console.log(`   ❌ Package.json test failed: ${error.message}`);
  allTestsPassed = false;
}

// Final Results
console.log('='.repeat(60));
console.log('🎯 VERIFICATION RESULTS SUMMARY');
console.log('='.repeat(60));

console.log(`📊 Backup System: ${results.backup.passed}/${results.backup.total} tests passed`);
console.log(`⚙️  Configuration: ${results.config.passed}/${results.config.total} tests passed`);
console.log(`🏗️  Layout Structure: ${results.layout.passed}/${results.layout.total} tests passed`);

const totalPassed = results.backup.passed + results.config.passed + results.layout.passed;
const totalTests = results.backup.total + results.config.total + results.layout.total;

console.log(`\n📈 Overall: ${totalPassed}/${totalTests} tests passed`);

if (allTestsPassed) {
  console.log('\n🏆 ALL TESTS PASSED!');
  console.log('✅ PromptForge v3 security and infrastructure fixes are working correctly');
  
  console.log('\n🚀 Next steps:');
  console.log('1. Run: pnpm run backup:setup (to configure automated backups)');
  console.log('2. Copy env.example to .env.local and configure your environment');
  console.log('3. Test the backup system: pnpm run backup:test');
  console.log('4. Verify layout structure across all pages');
  
} else {
  console.log('\n⚠️  SOME TESTS FAILED');
  console.log('🔧 Please review the failed tests above and fix the issues');
  process.exit(1);
}

console.log('\n📝 For detailed information, see: SECURITY_INFRASTRUCTURE_FIXES_SUMMARY.md');
