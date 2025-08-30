#!/usr/bin/env node

/**
 * Contract Schema Testing Script
 * Validates API contracts against JSON Schema definitions
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

// Initialize AJV with formats
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateSchema(schema, data, schemaName) {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  
  if (!valid) {
    log(`❌ Schema validation failed for ${schemaName}:`, 'red');
    validate.errors.forEach(error => {
      log(`  - ${error.instancePath || 'root'}: ${error.message}`, 'red');
    });
    return false;
  }
  
  log(`✅ Schema validation passed for ${schemaName}`, 'green');
  return true;
}

function testApiContract() {
  log('🧪 Starting API Contract Testing...', 'cyan');
  
  // Load the API contracts schema
  const contractsPath = path.join(__dirname, '..', 'schemas', 'api-contracts.json');
  
  if (!fs.existsSync(contractsPath)) {
    log('❌ API contracts schema not found', 'red');
    process.exit(1);
  }
  
  const contracts = JSON.parse(fs.readFileSync(contractsPath, 'utf8'));
  log(`📋 Loaded API contracts schema v${contracts.version}`, 'blue');
  
  let allTestsPassed = true;
  const testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    details: []
  };
  
  // Test each endpoint
  Object.entries(contracts.endpoints).forEach(([endpoint, config]) => {
    log(`\n🔍 Testing endpoint: ${endpoint}`, 'magenta');
    testResults.total++;
    
    const endpointResults = {
      endpoint,
      method: config.method,
      tests: []
    };
    
    // Test request schema
    if (config.request) {
      const testRequest = generateTestData(config.request);
      const requestValid = validateSchema(config.request, testRequest, `${endpoint} request`);
      
      endpointResults.tests.push({
        type: 'request',
        passed: requestValid
      });
      
      if (!requestValid) {
        allTestsPassed = false;
        testResults.failed++;
      } else {
        testResults.passed++;
      }
    }
    
    // Test response schema
    if (config.response) {
      const testResponse = generateTestData(config.response);
      const responseValid = validateSchema(config.response, testResponse, `${endpoint} response`);
      
      endpointResults.tests.push({
        type: 'response',
        passed: responseValid
      });
      
      if (!responseValid) {
        allTestsPassed = false;
        testResults.failed++;
      } else {
        testResults.passed++;
      }
    }
    
    // Test error response schemas
    if (config.errorResponses) {
      Object.entries(config.errorResponses).forEach(([statusCode, errorSchema]) => {
        const testError = generateTestData(errorSchema);
        const errorValid = validateSchema(errorSchema, testError, `${endpoint} error ${statusCode}`);
        
        endpointResults.tests.push({
          type: `error-${statusCode}`,
          passed: errorValid
        });
        
        if (!errorValid) {
          allTestsPassed = false;
          testResults.failed++;
        } else {
          testResults.passed++;
        }
      });
    }
    
    testResults.details.push(endpointResults);
  });
  
  // Test common schemas
  if (contracts.commonSchemas) {
    log(`\n🔍 Testing common schemas...`, 'magenta');
    
    Object.entries(contracts.commonSchemas).forEach(([schemaName, schema]) => {
      const testData = generateTestData(schema);
      const valid = validateSchema(schema, testData, `common schema ${schemaName}`);
      
      testResults.total++;
      if (valid) {
        testResults.passed++;
      } else {
        testResults.failed++;
        allTestsPassed = false;
      }
    });
  }
  
  // Print summary
  log('\n📊 Contract Testing Summary:', 'cyan');
  log(`Total tests: ${testResults.total}`, 'blue');
  log(`Passed: ${testResults.passed}`, 'green');
  log(`Failed: ${testResults.failed}`, 'red');
  
  if (testResults.failed > 0) {
    log('\n❌ Contract testing failed!', 'red');
    log('Failed tests:', 'red');
    testResults.details.forEach(endpoint => {
      const failedTests = endpoint.tests.filter(test => !test.passed);
      if (failedTests.length > 0) {
        log(`  ${endpoint.endpoint}:`, 'red');
        failedTests.forEach(test => {
          log(`    - ${test.type}`, 'red');
        });
      }
    });
  } else {
    log('\n✅ All contract tests passed!', 'green');
  }
  
  // Save test results
  const resultsPath = path.join(__dirname, '..', 'test-results', 'contract-test-results.json');
  fs.mkdirSync(path.dirname(resultsPath), { recursive: true });
  fs.writeFileSync(resultsPath, JSON.stringify(testResults, null, 2));
  
  return allTestsPassed;
}

function generateTestData(schema) {
  // Generate test data based on schema
  if (schema.type === 'object') {
    const data = {};
    if (schema.required) {
      schema.required.forEach(prop => {
        if (schema.properties && schema.properties[prop]) {
          data[prop] = generateTestData(schema.properties[prop]);
        }
      });
    }
    return data;
  } else if (schema.type === 'array') {
    return [generateTestData(schema.items)];
  } else if (schema.type === 'string') {
    if (schema.enum) {
      return schema.enum[0];
    }
    return 'test-string';
  } else if (schema.type === 'integer') {
    if (schema.minimum !== undefined) {
      return schema.minimum;
    }
    return 1;
  } else if (schema.type === 'number') {
    if (schema.minimum !== undefined) {
      return schema.minimum;
    }
    return 1.0;
  } else if (schema.type === 'boolean') {
    return true;
  }
  
  return null;
}

function testEntitlementsSchema() {
  log('\n🔐 Testing Entitlements Schema...', 'cyan');
  
  try {
    // Test that entitlements types can be imported
    const entitlementsPath = path.join(__dirname, '..', 'lib', 'entitlements', 'types.ts');
    
    if (!fs.existsSync(entitlementsPath)) {
      log('❌ Entitlements types file not found', 'red');
      return false;
    }
    
    // Read and validate the entitlements file structure
    const entitlementsContent = fs.readFileSync(entitlementsPath, 'utf8');
    
    // Check for required exports
    const requiredExports = [
      'FEATURE_PLAN_REQUIREMENTS',
      'PLAN_ENTITLEMENTS',
      'hasFeatureAccess',
      'getRequiredPlan'
    ];
    
    let allExportsFound = true;
    requiredExports.forEach(exportName => {
      if (!entitlementsContent.includes(exportName)) {
        log(`❌ Missing export: ${exportName}`, 'red');
        allExportsFound = false;
      }
    });
    
    if (allExportsFound) {
      log('✅ All required entitlements exports found', 'green');
    }
    
    return allExportsFound;
    
  } catch (error) {
    log(`❌ Error testing entitlements schema: ${error.message}`, 'red');
    return false;
  }
}

function main() {
  log('🚀 Starting Contract Schema Testing Suite', 'cyan');
  log('=' .repeat(50), 'cyan');
  
  const apiContractPassed = testApiContract();
  const entitlementsPassed = testEntitlementsSchema();
  
  log('\n' + '=' .repeat(50), 'cyan');
  
  if (apiContractPassed && entitlementsPassed) {
    log('🎉 All contract schema tests passed!', 'green');
    process.exit(0);
  } else {
    log('💥 Contract schema tests failed!', 'red');
    process.exit(1);
  }
}

// Run the tests
if (require.main === module) {
  main();
}

module.exports = {
  testApiContract,
  testEntitlementsSchema
};
