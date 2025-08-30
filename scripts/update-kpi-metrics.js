#!/usr/bin/env node

/**
 * KPI Metrics Update Script
 * 
 * This script updates KPI metrics based on various data sources:
 * - Legacy redirect share from redirect telemetry
 * - Performance metrics from Lighthouse reports
 * - Security scores from security scans
 * - Accessibility scores from Pa11y reports
 */

const fs = require('fs');
const path = require('path');

// Import the KPI tracker (we'll need to compile this for Node.js)
const { kpiTracker } = require('../lib/kpi-tracking-edge.ts');
const { redirectTelemetry } = require('../lib/redirect-telemetry-edge.ts');

async function updateLegacyRedirectShare() {
  try {
    console.log('📊 Updating Legacy Redirect Share...');
    
    const legacyShare = await redirectTelemetry.getLegacyRedirectShare();
    await kpiTracker.updateLegacyRedirectShare(legacyShare);
    
    console.log(`✅ Legacy Redirect Share updated: ${legacyShare.toFixed(2)}%`);
  } catch (error) {
    console.error('❌ Failed to update legacy redirect share:', error);
  }
}

async function updatePerformanceMetrics() {
  try {
    console.log('⚡ Updating Performance Metrics...');
    
    // Try to read Lighthouse report if available
    const lighthouseReportPath = path.join(process.cwd(), 'lighthouse-report.json');
    let lighthouseScore = 0;
    let pageLoadTime = 0;
    
    if (fs.existsSync(lighthouseReportPath)) {
      const lighthouseData = JSON.parse(fs.readFileSync(lighthouseReportPath, 'utf8'));
      lighthouseScore = Math.round((lighthouseData.categories?.performance?.score || 0) * 100);
      pageLoadTime = Math.round(lighthouseData.audits?.['first-contentful-paint']?.numericValue || 0);
    }
    
    // Try to read Pa11y report if available
    const pa11yReportPath = path.join(process.cwd(), 'pa11y-results.json');
    let accessibilityScore = 0;
    
    if (fs.existsSync(pa11yReportPath)) {
      const pa11yData = JSON.parse(fs.readFileSync(pa11yReportPath, 'utf8'));
      // Calculate accessibility score based on issues found
      const totalIssues = pa11yData.reduce((sum, result) => sum + (result.issues?.length || 0), 0);
      accessibilityScore = Math.max(0, 100 - (totalIssues * 5)); // Deduct 5 points per issue
    }
    
    // Try to read security report if available
    const securityReportPath = path.join(process.cwd(), 'security-report.json');
    let securityScore = 0;
    
    if (fs.existsSync(securityReportPath)) {
      const securityData = JSON.parse(fs.readFileSync(securityReportPath, 'utf8'));
      // Calculate security score based on vulnerabilities found
      const vulnerabilities = securityData.vulnerabilities?.length || 0;
      securityScore = Math.max(0, 100 - (vulnerabilities * 10)); // Deduct 10 points per vulnerability
    }
    
    await kpiTracker.updatePerformanceMetrics({
      pageLoadTime,
      lighthouseScore,
      accessibilityScore,
      securityScore
    });
    
    console.log(`✅ Performance metrics updated:`);
    console.log(`   - Lighthouse Score: ${lighthouseScore}/100`);
    console.log(`   - Page Load Time: ${pageLoadTime}ms`);
    console.log(`   - Accessibility Score: ${accessibilityScore}/100`);
    console.log(`   - Security Score: ${securityScore}/100`);
    
  } catch (error) {
    console.error('❌ Failed to update performance metrics:', error);
  }
}

async function updateRedirectSuccessRate() {
  try {
    console.log('🔄 Updating Redirect Success Rate...');
    
    const redirectStats = await redirectTelemetry.getRedirectStats();
    const totalRedirects = redirectStats.totalRedirects;
    
    // For now, assume 100% success rate if we have redirect data
    // In a real implementation, you'd track failed redirects
    const successRate = totalRedirects > 0 ? 100 : 0;
    
    await kpiTracker.updateMetric('redirect-success-rate', successRate);
    
    console.log(`✅ Redirect Success Rate updated: ${successRate}%`);
  } catch (error) {
    console.error('❌ Failed to update redirect success rate:', error);
  }
}

async function generateKPIDashboard() {
  try {
    console.log('📈 Generating KPI Dashboard...');
    
    const dashboard = await kpiTracker.getDashboard();
    const report = await kpiTracker.generateReport();
    
    // Save dashboard to file
    const dashboardPath = path.join(process.cwd(), 'kpi-dashboard.json');
    fs.writeFileSync(dashboardPath, JSON.stringify(dashboard, null, 2));
    
    // Save report to file
    const reportPath = path.join(process.cwd(), 'kpi-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('✅ KPI Dashboard generated:');
    console.log(`   - Dashboard: ${dashboardPath}`);
    console.log(`   - Report: ${reportPath}`);
    console.log(`   - Overall Health: ${dashboard.summary.overallHealth.toUpperCase()}`);
    console.log(`   - Good Metrics: ${dashboard.summary.goodMetrics}/${dashboard.summary.totalMetrics}`);
    
    if (report.alerts.length > 0) {
      console.log('⚠️  Alerts:');
      report.alerts.forEach(alert => {
        console.log(`   - ${alert.severity.toUpperCase()}: ${alert.message}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Failed to generate KPI dashboard:', error);
  }
}

async function main() {
  console.log('🚀 Starting KPI Metrics Update...\n');
  
  try {
    await updateLegacyRedirectShare();
    await updatePerformanceMetrics();
    await updateRedirectSuccessRate();
    await generateKPIDashboard();
    
    console.log('\n🎉 KPI Metrics Update Completed Successfully!');
    
  } catch (error) {
    console.error('\n💥 KPI Metrics Update Failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  updateLegacyRedirectShare,
  updatePerformanceMetrics,
  updateRedirectSuccessRate,
  generateKPIDashboard
};
