#!/usr/bin/env node

/**
 * Enhanced PII Report Generator for PromptForge v3
 * 
 * This script provides comprehensive PII analysis with:
 * - Classification of findings (real vs dummy vs placeholder)
 * - Actionable recommendations for each issue
 * - CSV and JSON export options
 * - Risk assessment and prioritization
 * - Integration with CI/CD pipelines
 * 
 * Usage: 
 *   node scripts/enhanced-pii-report.js [--format=csv|json|detailed]
 *   node scripts/enhanced-pii-report.js --ci (for CI/CD integration)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Enhanced PII patterns with risk assessment
const PII_PATTERNS = {
  // CRITICAL: Real secrets and credentials
  realSecrets: {
    name: 'Real API Keys & Secrets',
    patterns: [
      /(?<!YOUR_|test_your_|your_)sk_(live|test)_[a-zA-Z0-9]{24,}/g,
      /(?<!YOUR_|test_your_|your_)pk_(live|test)_[a-zA-Z0-9]{24,}/g,
      /(?<!YOUR_|test_your_|your_)whsec_[a-zA-Z0-9]{24,}/g,
      /(?<!your_|YOUR_|test_your_)eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/g,

    ],
    severity: 'CRITICAL',
    risk: 'HIGH',
    action: 'IMMEDIATE_REMOVAL',
    description: 'Real production secrets that must be removed immediately'
  },
  
  // HIGH: Potential real PII
  realPII: {
    name: 'Potential Real PII',
    patterns: [
      /(?<!example|test|demo|placeholder|your|company|domain|noreply|admin|info|support|contact|hello)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      /(?<!000000-0000|000-0000000|123-456-7890|555-555-5555)[+]?[1-9][\d\s\-\(\)]{9,}/g,
      /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
      /(?<!00000000-0000-0000|0000-000000000000)\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g
    ],
    severity: 'HIGH',
    risk: 'MEDIUM',
    action: 'REVIEW_AND_SANITIZE',
    description: 'Potential real PII that needs review and sanitization'
  },
  
  // MEDIUM: Demo/placeholder data
  demoData: {
    name: 'Demo/Placeholder Data',
    patterns: [
      /[a-z]+@demo\.com/g,
      /[a-z]+@example\.com/g,
      /user@example\.com/g,
      /test@[a-z]+\.com/g,
      /\b000000-0000\b/g,
      /\b000-000-0000\b/g,
      /\b00000000-0000-0000\b/g,
      /\b0000-000000000000\b/g,
      /\b00000000-0000-0000-0000-000000000000\b/g
    ],
    severity: 'MEDIUM',
    risk: 'LOW',
    action: 'VERIFY_SAFETY',
    description: 'Demo data that should be verified as safe'
  },
  
  // LOW: Placeholder patterns
  placeholders: {
    name: 'Placeholder Patterns',
    patterns: [
      /(sk_|pk_|whsec_)YOUR_[A-Z_]+_HERE/g,
      /(sk_|pk_|whsec_)test_your_[a-z_]+_here/g,
      /postgresql:\/\/username:password@localhost/g,
      /postgresql:\/\/test:test@localhost/g,
      /SG\.your_sendgrid_api_key_here/g,
      /SG\.YOUR_SENDGRID_API_KEY_HERE/g,
      /SG\.[a-zA-Z0-9_-]{20,}_here/g,
      /eyJ[a-zA-Z0-9_-]{20,}\.your_[a-zA-Z_]+_here\.[a-zA-Z0-9_-]{20,}/g,
      /https:\/\/your-project-id\.supabase\.co/g,
      /your_[a-zA-Z_]+_here/g
    ],
    severity: 'LOW',
    risk: 'NONE',
    action: 'NO_ACTION_NEEDED',
    description: 'Safe placeholder patterns that don\'t need action'
  }
};

// File exclusions for scanning
const EXCLUDED_DIRS = [
  'node_modules',
  '.git',
  '.next',
  'backups',
  'dist',
  'build',
  'coverage',
  '__tests__',
  'tests'
];

const EXCLUDED_FILES = [
  '.env.local',
  '.env.production',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'pii-analysis-report.txt',
  'pii-analysis-report.csv',
  'pii-analysis-report.json'
];

/**
 * Get all files to scan
 */
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!EXCLUDED_DIRS.includes(file)) {
        getAllFiles(filePath, fileList);
      }
    } else {
      if (!EXCLUDED_FILES.includes(file) && 
          !file.endsWith('.log') && 
          !file.endsWith('.tmp') &&
          !file.endsWith('.backup')) {
        fileList.push(filePath);
      }
    }
  });
  
  return fileList;
}

/**
 * Scan a single file for PII patterns
 */
function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const findings = [];
    
    Object.entries(PII_PATTERNS).forEach(([key, patternGroup]) => {
      patternGroup.patterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          // Get line numbers for matches
          const lines = content.split('\n');
          const lineNumbers = [];
          
          lines.forEach((line, index) => {
            if (pattern.test(line)) {
              lineNumbers.push(index + 1);
            }
          });
          
          findings.push({
            category: key,
            name: patternGroup.name,
            severity: patternGroup.severity,
            risk: patternGroup.risk,
            action: patternGroup.action,
            description: patternGroup.description,
            filePath: filePath,
            lineNumbers: lineNumbers,
            matches: matches,
            totalMatches: matches.length,
            sampleMatches: matches.slice(0, 3)
          });
        }
      });
    });
    
    return findings;
  } catch (error) {
    console.warn(`⚠️  Could not read file: ${filePath} - ${error.message}`);
    return [];
  }
}

/**
 * Classify findings by type and risk
 */
function classifyFindings(findings) {
  const classification = {
    critical: {
      realSecrets: [],
      count: 0,
      risk: 'IMMEDIATE_ACTION_REQUIRED'
    },
    high: {
      realPII: [],
      count: 0,
      risk: 'REVIEW_AND_SANITIZE'
    },
    medium: {
      demoData: [],
      count: 0,
      risk: 'VERIFY_SAFETY'
    },
    low: {
      placeholders: [],
      count: 0,
      risk: 'NO_ACTION_NEEDED'
    }
  };
  
  findings.forEach(finding => {
    switch (finding.severity) {
      case 'CRITICAL':
        classification.critical.realSecrets.push(finding);
        classification.critical.count++;
        break;
      case 'HIGH':
        classification.high.realPII.push(finding);
        classification.high.count++;
        break;
      case 'MEDIUM':
        classification.medium.demoData.push(finding);
        classification.medium.count++;
        break;
      case 'LOW':
        classification.low.placeholders.push(finding);
        classification.low.count++;
        break;
    }
  });
  
  return classification;
}

/**
 * Generate detailed report
 */
function generateDetailedReport(classification) {
  let report = '🔍 ENHANCED PII ANALYSIS REPORT\n';
  report += '='.repeat(60) + '\n\n';
  
  // Summary
  const totalFindings = classification.critical.count + classification.high.count + 
                       classification.medium.count + classification.low.count;
  
  report += `📊 SUMMARY\n`;
  report += `   Total Findings: ${totalFindings}\n`;
  report += `   Critical: ${classification.critical.count}\n`;
  report += `   High: ${classification.high.count}\n`;
  report += `   Medium: ${classification.medium.count}\n`;
  report += `   Low: ${classification.low.count}\n\n`;
  
  // Critical findings
  if (classification.critical.count > 0) {
    report += `🚨 CRITICAL FINDINGS (${classification.critical.count})\n`;
    report += `   Risk: ${classification.critical.risk}\n`;
    report += `   Action: IMMEDIATE REMOVAL REQUIRED\n\n`;
    
    classification.critical.realSecrets.forEach(finding => {
      report += `   📁 File: ${finding.filePath}\n`;
      report += `   🔍 Type: ${finding.name}\n`;
      report += `   📍 Lines: ${finding.lineNumbers.join(', ')}\n`;
      report += `   📊 Matches: ${finding.totalMatches}\n`;
      report += `   🔑 Samples: ${finding.sampleMatches.join(', ')}\n`;
      report += `   ⚠️  Action: ${finding.action}\n`;
      report += `   📝 Description: ${finding.description}\n\n`;
    });
  }
  
  // High findings
  if (classification.high.count > 0) {
    report += `⚠️  HIGH FINDINGS (${classification.high.count})\n`;
    report += `   Risk: ${classification.high.risk}\n`;
    report += `   Action: REVIEW AND SANITIZE\n\n`;
    
    classification.high.realPII.forEach(finding => {
      report += `   📁 File: ${finding.filePath}\n`;
      report += `   🔍 Type: ${finding.name}\n`;
      report += `   📍 Lines: ${finding.lineNumbers.join(', ')}\n`;
      report += `   📊 Matches: ${finding.totalMatches}\n`;
      report += `   🔑 Samples: ${finding.sampleMatches.join(', ')}\n`;
      report += `   ⚠️  Action: ${finding.action}\n`;
      report += `   📝 Description: ${finding.description}\n\n`;
    });
  }
  
  // Medium findings
  if (classification.medium.count > 0) {
    report += `ℹ️  MEDIUM FINDINGS (${classification.medium.count})\n`;
    report += `   Risk: ${classification.medium.risk}\n`;
    report += `   Action: VERIFY SAFETY\n\n`;
    
    classification.medium.demoData.forEach(finding => {
      report += `   📁 File: ${finding.filePath}\n`;
      report += `   🔍 Type: ${finding.name}\n`;
      report += `   📍 Lines: ${finding.lineNumbers.join(', ')}\n`;
      report += `   📊 Matches: ${finding.totalMatches}\n`;
      report += `   🔑 Samples: ${finding.sampleMatches.join(', ')}\n`;
      report += `   ⚠️  Action: ${finding.action}\n`;
      report += `   📝 Description: ${finding.description}\n\n`;
    });
  }
  
  // Low findings
  if (classification.low.count > 0) {
    report += `✅ LOW FINDINGS (${classification.low.count})\n`;
    report += `   Risk: ${classification.low.risk}\n`;
    report += `   Action: NO ACTION NEEDED\n\n`;
    
    classification.low.placeholders.forEach(finding => {
      report += `   📁 File: ${finding.filePath}\n`;
      report += `   🔍 Type: ${finding.name}\n`;
      report += `   📍 Lines: ${finding.lineNumbers.join(', ')}\n`;
      report += `   📊 Matches: ${finding.totalMatches}\n`;
      report += `   🔑 Samples: ${finding.sampleMatches.join(', ')}\n`;
      report += `   ⚠️  Action: ${finding.action}\n`;
      report += `   📝 Description: ${finding.description}\n\n`;
    });
  }
  
  // Recommendations
  report += `💡 RECOMMENDATIONS\n`;
  report += `   ${'='.repeat(50)}\n\n`;
  
  if (classification.critical.count > 0) {
    report += `🚨 IMMEDIATE ACTIONS:\n`;
    report += `   1. Remove all real secrets immediately\n`;
    report += `   2. Rotate any exposed API keys\n`;
    report += `   3. Review git history for secrets\n`;
    report += `   4. Implement secret scanning in CI/CD\n\n`;
  }
  
  if (classification.high.count > 0) {
    report += `⚠️  HIGH PRIORITY:\n`;
    report += `   1. Review all potential real PII\n`;
    report += `   2. Sanitize or remove real data\n`;
    report += `   3. Replace with safe placeholders\n`;
    report += `   4. Document data handling policies\n\n`;
  }
  
  if (classification.medium.count > 0) {
    report += `ℹ️  MEDIUM PRIORITY:\n`;
    report += `   1. Verify demo data is safe\n`;
    report += `   2. Document demo data sources\n`;
    report += `   3. Consider using more obvious placeholders\n\n`;
  }
  
  report += `🔧 PREVENTION:\n`;
  report += `   1. Add PII scanning to pre-commit hooks\n`;
  report += `   2. Integrate with CI/CD pipeline\n`;
  report += `   3. Regular security audits\n`;
  report += `   4. Developer training on PII handling\n\n`;
  
  return report;
}

/**
 * Generate CSV report
 */
function generateCSVReport(classification) {
  let csv = 'File,Type,Severity,Risk,Action,Line Numbers,Total Matches,Sample Matches,Description\n';
  
  Object.values(classification).forEach(severityGroup => {
    Object.values(severityGroup).forEach(findings => {
      if (Array.isArray(findings)) {
        findings.forEach(finding => {
          csv += `"${finding.filePath}","${finding.name}","${finding.severity}","${finding.risk}","${finding.action}","${finding.lineNumbers.join(';')}","${finding.totalMatches}","${finding.sampleMatches.join(';')}","${finding.description}"\n`;
        });
      }
    });
  });
  
  return csv;
}

/**
 * Generate JSON report
 */
function generateJSONReport(classification) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFindings: classification.critical.count + classification.high.count + 
                    classification.medium.count + classification.low.count,
      critical: classification.critical.count,
      high: classification.high.count,
      medium: classification.medium.count,
      low: classification.low.count
    },
    findings: classification,
    recommendations: {
      immediate: classification.critical.count > 0 ? [
        'Remove all real secrets immediately',
        'Rotate any exposed API keys',
        'Review git history for secrets'
      ] : [],
      high: classification.high.count > 0 ? [
        'Review all potential real PII',
        'Sanitize or remove real data',
        'Replace with safe placeholders'
      ] : [],
      medium: classification.medium.count > 0 ? [
        'Verify demo data is safe',
        'Document demo data sources'
      ] : []
    }
  };
  
  return JSON.stringify(report, null, 2);
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const format = args.find(arg => arg.startsWith('--format='))?.split('=')[1] || 'detailed';
  const isCI = args.includes('--ci');
  
  console.log('🔍 Starting Enhanced PII Analysis...\n');
  
  try {
    // Get all files to scan
    const allFiles = getAllFiles('.');
    console.log(`📁 Found ${allFiles.length} files to scan\n`);
    
    const allFindings = [];
    
    // Scan each file
    allFiles.forEach(filePath => {
      const findings = scanFile(filePath);
      if (findings.length > 0) {
        findings.forEach(finding => {
          allFindings.push(finding);
        });
      }
    });
    
    // Classify findings
    const classification = classifyFindings(allFindings);
    
    // Generate report based on format
    let report;
    let outputFile;
    
    switch (format) {
      case 'csv':
        report = generateCSVReport(classification);
        outputFile = 'pii-analysis-report.csv';
        break;
      case 'json':
        report = generateJSONReport(classification);
        outputFile = 'pii-analysis-report.json';
        break;
      default:
        report = generateDetailedReport(classification);
        outputFile = 'pii-analysis-report.txt';
    }
    
    // Save report to file
    fs.writeFileSync(outputFile, report);
    console.log(`📄 Report saved to: ${outputFile}\n`);
    
    // Display summary
    const totalFindings = classification.critical.count + classification.high.count + 
                         classification.medium.count + classification.low.count;
    
    console.log(`📊 SCAN COMPLETED\n`);
    console.log(`   Total Findings: ${totalFindings}`);
    console.log(`   Critical: ${classification.critical.count}`);
    console.log(`   High: ${classification.high.count}`);
    console.log(`   Medium: ${classification.medium.count}`);
    console.log(`   Low: ${classification.low.count}\n`);
    
    // CI/CD integration
    if (isCI) {
      if (classification.critical.count > 0) {
        console.log('❌ CI/CD CHECK FAILED: Critical PII issues found');
        console.log('   Build blocked until issues are resolved');
        process.exit(1);
      } else if (classification.high.count > 0) {
        console.log('⚠️  CI/CD CHECK WARNING: High priority PII issues found');
        console.log('   Build will proceed but review is recommended');
        process.exit(0);
      } else {
        console.log('✅ CI/CD CHECK PASSED: No critical PII issues found');
        process.exit(0);
      }
    } else {
      // Interactive mode
      if (classification.critical.count > 0) {
        console.log('🚨 CRITICAL ISSUES FOUND');
        console.log('   Please address these immediately before committing');
        process.exit(1);
      } else {
        console.log('✅ Scan completed successfully');
        console.log('   Review findings and take recommended actions');
      }
    }
    
  } catch (error) {
    console.error('❌ Error during scan:', error.message);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
}

module.exports = {
  scanFile,
  getAllFiles,
  classifyFindings,
  generateDetailedReport,
  generateCSVReport,
  generateJSONReport,
  PII_PATTERNS
};
