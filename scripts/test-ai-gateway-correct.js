#!/usr/bin/env node

/**
 * Correct AI Gateway Test Script
 * Tests AI Gateway integration using the correct Vercel AI SDK approach
 */

const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  apiKey: 'vck_057iAMGKcfT5lb2JmyjfMrXrJsgwxRvN6tQBiOJJBXz4Pqxxsv3ogVvE',
  testPrompts: [
    'Hello, this is a test prompt. Please respond with a brief greeting.',
    'What is artificial intelligence in simple terms?',
    'Write a haiku about technology.',
    'Explain the concept of prompt engineering.',
    'What are the benefits of using AI Gateway?'
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

// Test AI Gateway using the correct Vercel AI SDK approach
async function testAIGatewayCorrect(prompt, model = 'gpt-4o') {
  const startTime = Date.now();
  
  try {
    log(`Testing AI Gateway ${model} with prompt: "${prompt.substring(0, 50)}..."`);
    
    // Use the correct Vercel AI Gateway endpoint
    const response = await fetch('https://api.vercel.com/v1/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_CONFIG.apiKey}`
      },
      body: JSON.stringify({
        model: `openai/${model}`,
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const result = await response.json();
    const latency = Date.now() - startTime;

    if (response.ok && result.text) {
      const tokens = Math.ceil((prompt.length + result.text.length) / 4); // Rough estimate
      const cost = tokens * 0.00002; // Rough estimate
      
      const testResult = {
        prompt,
        model,
        success: true,
        latency,
        tokens,
        cost,
        response: result.text.substring(0, 100) + '...',
        provider: 'ai-gateway',
        usage: result.usage || { promptTokens: Math.ceil(prompt.length / 4), completionTokens: Math.ceil(result.text.length / 4), totalTokens: tokens }
      };

      log(`✅ AI Gateway ${model} test passed - ${formatCost(testResult.cost)} - ${formatTokens(testResult.tokens)} - ${latency}ms`, 'success');
      return testResult;
    } else {
      throw new Error(JSON.stringify(result));
    }
  } catch (error) {
    const latency = Date.now() - startTime;
    log(`❌ AI Gateway ${model} test failed: ${error.message}`, 'error');
    
    return {
      prompt,
      model,
      success: false,
      latency,
      error: error.message,
      tokens: 0,
      cost: 0,
      provider: 'ai-gateway'
    };
  }
}

// Test with different models
async function testMultipleModels(prompt) {
  const models = ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'];
  const results = [];
  
  for (const model of models) {
    const result = await testAIGatewayCorrect(prompt, model);
    results.push(result);
    
    // Update summary
    testResults.summary.totalTests++;
    if (result.success) {
      testResults.summary.passed++;
      testResults.summary.totalCost += result.cost;
      testResults.summary.totalTokens += result.tokens;
    } else {
      testResults.summary.failed++;
    }
    
    // Add delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return results;
}

// Run all tests
async function runTests() {
  log('🚀 Starting AI Gateway tests with correct implementation...');
  
  // Test with first 2 prompts and multiple models
  for (const prompt of TEST_CONFIG.testPrompts.slice(0, 2)) {
    log(`\n📝 Testing prompt: "${prompt.substring(0, 50)}..."`);
    const results = await testMultipleModels(prompt);
    testResults.tests.push(...results);
  }
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
  const reportPath = path.join(__dirname, '..', 'ai-gateway-correct-test-report.json');
  const report = {
    ...testResults,
    endTime,
    duration,
    modelStats
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`\n📄 Detailed report saved to: ${reportPath}`);
  
  // Provide next steps
  if (testResults.summary.passed > 0) {
    log('\n🎉 AI Gateway integration is working!');
    log('✅ Ready to use in your PromptForge application');
    log('📝 Next steps:');
    log('   1. Set up your .env.local file with the API keys');
    log('   2. Run database migrations for full functionality');
    log('   3. Test the full application integration');
  } else {
    log('\n⚠️  AI Gateway tests failed');
    log('🔧 Troubleshooting:');
    log('   1. Check your AI Gateway API key');
    log('   2. Verify network connectivity');
    log('   3. Check Vercel AI Gateway documentation');
  }
}

// Main execution
async function main() {
  try {
    log('🔧 AI Gateway Correct Test');
    log('This test uses the correct Vercel AI Gateway implementation');
    log('It tests multiple models and provides detailed feedback\n');
    
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
