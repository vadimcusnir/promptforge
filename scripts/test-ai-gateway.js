#!/usr/bin/env node

/**
 * AI Gateway Test Script
 * Tests the AI Gateway integration with real API calls
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  apiKey: 'vck_057iAMGKcfT5lb2JmyjfMrXrJsgwxRvN6tQBiOJJBXz4Pqxxsv3ogVvE',
  testPrompts: [
    'Explain quantum computing in simple terms',
    'Write a haiku about artificial intelligence',
    'What are the benefits of using AI Gateway?',
    'Create a recipe for chocolate chip cookies',
    'Explain the concept of prompt engineering'
  ],
  models: [
    'openai/gpt-4o',
    'openai/gpt-4o-mini',
    'anthropic/claude-3-5-sonnet'
  ]
};

// Test results storage
const testResults = {
  startTime: new Date(),
  tests: [],
  summary: {
    totalTests: 0,
    passed: 0,
    failed: 0,
    totalCost: 0,
    totalTokens: 0,
    averageLatency: 0
  }
};

// Utility functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function formatCost(cost) {
  if (cost < 0.001) {
    return `$${(cost * 1000).toFixed(2)}m`;
  } else if (cost < 1) {
    return `$${cost.toFixed(3)}`;
  } else {
    return `$${cost.toFixed(2)}`;
  }
}

function formatTokens(tokens) {
  if (tokens < 1000) {
    return `${tokens} tokens`;
  } else if (tokens < 1000000) {
    return `${(tokens / 1000).toFixed(1)}K tokens`;
  } else {
    return `${(tokens / 1000000).toFixed(1)}M tokens`;
  }
}

// Test AI Gateway API call
async function testAIGateway(prompt, model) {
  const startTime = Date.now();
  
  try {
    log(`Testing ${model} with prompt: "${prompt.substring(0, 50)}..."`);
    
    // Make API call to our GPT test endpoint
    const response = await fetch('http://localhost:3000/api/gpt-test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token' // This would be a real auth token in production
      },
      body: JSON.stringify({
        prompt,
        testType: 'real',
        orgId: '00000000-0000-0000-0000-000000000000', // Test org ID
        options: {
          model,
          temperature: 0.7,
          maxTokens: 500
        }
      })
    });

    const result = await response.json();
    const latency = Date.now() - startTime;

    if (result.success) {
      const testResult = {
        prompt,
        model,
        success: true,
        latency,
        tokens: result.result.usage.totalTokens,
        cost: result.result.usage.totalTokens * 0.00002, // Rough estimate
        response: result.result.response.substring(0, 100) + '...',
        scores: result.result.scores
      };

      log(`✅ ${model} test passed - ${formatCost(testResult.cost)} - ${formatTokens(testResult.tokens)} - ${latency}ms`, 'success');
      return testResult;
    } else {
      throw new Error(result.error || 'Unknown error');
    }
  } catch (error) {
    const latency = Date.now() - startTime;
    log(`❌ ${model} test failed: ${error.message}`, 'error');
    
    return {
      prompt,
      model,
      success: false,
      latency,
      error: error.message,
      tokens: 0,
      cost: 0
    };
  }
}

// Run all tests
async function runTests() {
  log('🚀 Starting AI Gateway tests...');
  
  for (const prompt of TEST_CONFIG.testPrompts) {
    for (const model of TEST_CONFIG.models) {
      const result = await testAIGateway(prompt, model);
      testResults.tests.push(result);
      
      // Update summary
      testResults.summary.totalTests++;
      if (result.success) {
        testResults.summary.passed++;
        testResults.summary.totalCost += result.cost;
        testResults.summary.totalTokens += result.tokens;
      } else {
        testResults.summary.failed++;
      }
      
      // Add delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Calculate average latency
  const successfulTests = testResults.tests.filter(t => t.success);
  testResults.summary.averageLatency = successfulTests.length > 0 
    ? successfulTests.reduce((sum, t) => sum + t.latency, 0) / successfulTests.length 
    : 0;
}

// Generate test report
function generateReport() {
  const endTime = new Date();
  const duration = endTime - testResults.startTime;
  
  log('\n📊 Test Results Summary:');
  log(`Total Tests: ${testResults.summary.totalTests}`);
  log(`Passed: ${testResults.summary.passed}`);
  log(`Failed: ${testResults.summary.failed}`);
  log(`Success Rate: ${((testResults.summary.passed / testResults.summary.totalTests) * 100).toFixed(1)}%`);
  log(`Total Cost: ${formatCost(testResults.summary.totalCost)}`);
  log(`Total Tokens: ${formatTokens(testResults.summary.totalTokens)}`);
  log(`Average Latency: ${testResults.summary.averageLatency.toFixed(0)}ms`);
  log(`Test Duration: ${(duration / 1000).toFixed(1)}s`);
  
  // Model performance breakdown
  log('\n🤖 Model Performance:');
  const modelStats = {};
  testResults.tests.forEach(test => {
    if (!modelStats[test.model]) {
      modelStats[test.model] = { tests: 0, passed: 0, totalCost: 0, totalTokens: 0, totalLatency: 0 };
    }
    modelStats[test.model].tests++;
    if (test.success) {
      modelStats[test.model].passed++;
      modelStats[test.model].totalCost += test.cost;
      modelStats[test.model].totalTokens += test.tokens;
      modelStats[test.model].totalLatency += test.latency;
    }
  });
  
  Object.entries(modelStats).forEach(([model, stats]) => {
    const successRate = (stats.passed / stats.tests) * 100;
    const avgLatency = stats.passed > 0 ? stats.totalLatency / stats.passed : 0;
    log(`  ${model}: ${successRate.toFixed(1)}% success, ${formatCost(stats.totalCost)}, ${formatTokens(stats.totalTokens)}, ${avgLatency.toFixed(0)}ms avg`);
  });
  
  // Save detailed report
  const reportPath = path.join(__dirname, '..', 'ai-gateway-test-report.json');
  const report = {
    ...testResults,
    endTime,
    duration,
    modelStats
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`\n📄 Detailed report saved to: ${reportPath}`);
}

// Main execution
async function main() {
  try {
    // Check if server is running
    try {
      await fetch('http://localhost:3000/api/health');
      log('✅ Server is running');
    } catch (error) {
      log('❌ Server is not running. Please start the development server first:', 'error');
      log('   Run: pnpm dev', 'error');
      process.exit(1);
    }
    
    await runTests();
    generateReport();
    
    // Exit with appropriate code
    process.exit(testResults.summary.failed > 0 ? 1 : 0);
  } catch (error) {
    log(`❌ Test execution failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { runTests, generateReport, testResults };
