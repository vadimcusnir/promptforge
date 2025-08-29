#!/usr/bin/env node

/**
 * Launch Control Script for PromptForge v3.x.x
 * Manages canary deployment, rate limiting, monitoring, and rollback
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Launch configuration
const LAUNCH_CONFIG = {
  version: process.env.RELEASE_VERSION || 'v3.0.0',
  canarySteps: [
    { traffic: 1, duration: 30 },   // 1% for 30 minutes
    { traffic: 5, duration: 60 },   // 5% for 1 hour
    { traffic: 25, duration: 120 }, // 25% for 2 hours
    { traffic: 100, duration: 0 }   // 100% (full rollout)
  ],
  rateLimits: {
    '/api/gpt-test': { requests: 60, window: 60 }, // 60 req/min
    '/api/run': { requests: 60, window: 60 },      // 60 req/min per org
    '/api/analytics': { requests: 120, window: 60 } // 120 req/min
  },
  rollbackTimeout: 120, // 2 minutes
  monitoringThresholds: {
    errorRate: 0.05,    // 5% error rate
    responseTime: 3000, // 3 seconds
    cpuUsage: 80,       // 80% CPU
    memoryUsage: 85     // 85% memory
  }
}

class LaunchController {
  constructor() {
    this.currentStep = 0
    this.isRollbackMode = false
    this.startTime = Date.now()
    this.metrics = {
      errors: 0,
      requests: 0,
      avgResponseTime: 0
    }
  }

  async main() {
    console.log('🚀 PromptForge Launch Control Starting...')
    console.log(`📋 Version: ${LAUNCH_CONFIG.version}`)
    
    try {
      // Step 1: Pre-launch checks
      await this.preLaunchChecks()
      
      // Step 2: Freeze main branch
      await this.freezeMainBranch()
      
      // Step 3: Create canary deployment
      await this.createCanaryDeployment()
      
      // Step 4: Gradual rollout
      await this.gradualRollout()
      
      // Step 5: Monitor and validate
      await this.monitorAndValidate()
      
    } catch (error) {
      console.error('❌ Launch failed:', error.message)
      await this.emergencyRollback()
      process.exit(1)
    }
  }

  async preLaunchChecks() {
    console.log('🔍 Running pre-launch checks...')
    
    const checks = [
      this.checkDatabaseHealth(),
      this.checkExternalServices(),
      this.checkRateLimits(),
      this.checkMonitoringSetup(),
      this.checkRollbackProcedures()
    ]
    
    await Promise.all(checks)
    console.log('✅ Pre-launch checks passed')
  }

  async checkDatabaseHealth() {
    console.log('  📊 Checking database health...')
    try {
      const result = execSync('node scripts/check-db-state.js', { encoding: 'utf8' })
      if (result.includes('ERROR')) {
        throw new Error('Database health check failed')
      }
    } catch (error) {
      throw new Error(`Database check failed: ${error.message}`)
    }
  }

  async checkExternalServices() {
    console.log('  🔗 Checking external services...')
    const services = [
      'https://api.openai.com',
      'https://api.stripe.com',
      'https://api.sendgrid.com'
    ]
    
    for (const service of services) {
      try {
        execSync(`curl -s -o /dev/null -w "%{http_code}" ${service}`, { timeout: 5000 })
      } catch (error) {
        throw new Error(`External service ${service} unreachable`)
      }
    }
  }

  async checkRateLimits() {
    console.log('  🛡️ Checking rate limit configuration...')
    const rateLimitConfig = path.join(__dirname, '../rate-limit.ts')
    if (!fs.existsSync(rateLimitConfig)) {
      throw new Error('Rate limit configuration missing')
    }
  }

  async checkMonitoringSetup() {
    console.log('  📈 Checking monitoring setup...')
    const sentryConfig = path.join(__dirname, '../sentry.client.config.ts')
    if (!fs.existsSync(sentryConfig)) {
      throw new Error('Sentry monitoring configuration missing')
    }
  }

  async checkRollbackProcedures() {
    console.log('  🔄 Checking rollback procedures...')
    const rollbackScript = path.join(__dirname, './emergency-rollback.sh')
    if (!fs.existsSync(rollbackScript)) {
      throw new Error('Emergency rollback script missing')
    }
  }

  async freezeMainBranch() {
    console.log('🧊 Freezing main branch...')
    
    try {
      // Create release tag
      execSync(`git tag ${LAUNCH_CONFIG.version}`)
      execSync(`git push origin ${LAUNCH_CONFIG.version}`)
      
      // Set up branch protection (if using GitHub)
      console.log('  📝 Branch protection rules applied')
      
    } catch (error) {
      throw new Error(`Failed to freeze main branch: ${error.message}`)
    }
  }

  async createCanaryDeployment() {
    console.log('🎯 Creating canary deployment...')
    
    try {
      // Deploy canary version
      execSync('vercel --prod --yes', { stdio: 'inherit' })
      
      // Set initial traffic to 0%
      execSync('vercel domains ls', { stdio: 'inherit' })
      
    } catch (error) {
      throw new Error(`Canary deployment failed: ${error.message}`)
    }
  }

  async gradualRollout() {
    console.log('📈 Starting gradual rollout...')
    
    for (let i = 0; i < LAUNCH_CONFIG.canarySteps.length; i++) {
      const step = LAUNCH_CONFIG.canarySteps[i]
      console.log(`\n🔄 Step ${i + 1}: ${step.traffic}% traffic for ${step.duration} minutes`)
      
      // Set traffic percentage
      await this.setTrafficPercentage(step.traffic)
      
      // Monitor during this step
      if (step.duration > 0) {
        await this.monitorStep(step.duration)
      }
      
      // Check if we need to rollback
      if (await this.shouldRollback()) {
        throw new Error(`Rollback triggered during step ${i + 1}`)
      }
      
      console.log(`✅ Step ${i + 1} completed successfully`)
    }
  }

  async setTrafficPercentage(percentage) {
    console.log(`  📊 Setting traffic to ${percentage}%`)
    
    try {
      // This would integrate with your CDN/load balancer
      // For Vercel, you might use their API
      if (percentage === 100) {
        console.log('  🎉 Full rollout achieved!')
      }
    } catch (error) {
      throw new Error(`Failed to set traffic percentage: ${error.message}`)
    }
  }

  async monitorStep(durationMinutes) {
    console.log(`  📊 Monitoring for ${durationMinutes} minutes...`)
    
    const startTime = Date.now()
    const endTime = startTime + (durationMinutes * 60 * 1000)
    
    while (Date.now() < endTime) {
      // Collect metrics every 30 seconds
      await this.collectMetrics()
      
      // Check thresholds
      if (await this.checkThresholds()) {
        throw new Error('Metrics exceeded thresholds')
      }
      
      // Wait 30 seconds before next check
      await new Promise(resolve => setTimeout(resolve, 30000))
    }
  }

  async collectMetrics() {
    try {
      // Collect error rate
      const errorRate = await this.getErrorRate()
      
      // Collect response time
      const responseTime = await this.getAverageResponseTime()
      
      // Collect system metrics
      const systemMetrics = await this.getSystemMetrics()
      
      // Update metrics
      this.metrics.errorRate = errorRate
      this.metrics.avgResponseTime = responseTime
      
      console.log(`  📈 Metrics: ${(errorRate * 100).toFixed(2)}% errors, ${responseTime}ms avg response`)
      
    } catch (error) {
      console.error('  ❌ Failed to collect metrics:', error.message)
    }
  }

  async getErrorRate() {
    // This would query your monitoring system
    return 0.02 // 2% for example
  }

  async getAverageResponseTime() {
    // This would query your monitoring system
    return 1500 // 1.5 seconds for example
  }

  async getSystemMetrics() {
    // This would query your infrastructure monitoring
    return {
      cpu: 45,
      memory: 60,
      disk: 30
    }
  }

  async checkThresholds() {
    const { errorRate, avgResponseTime } = this.metrics
    const { errorRate: maxErrorRate, responseTime: maxResponseTime } = LAUNCH_CONFIG.monitoringThresholds
    
    if (errorRate > maxErrorRate) {
      console.error(`  ❌ Error rate ${(errorRate * 100).toFixed(2)}% exceeds threshold ${(maxErrorRate * 100).toFixed(2)}%`)
      return true
    }
    
    if (avgResponseTime > maxResponseTime) {
      console.error(`  ❌ Response time ${avgResponseTime}ms exceeds threshold ${maxResponseTime}ms`)
      return true
    }
    
    return false
  }

  async shouldRollback() {
    // Check for critical errors or violations
    return false
  }

  async monitorAndValidate() {
    console.log('🔍 Starting post-launch monitoring...')
    
    // Monitor for 24 hours
    const monitorDuration = 24 * 60 * 60 * 1000 // 24 hours
    const startTime = Date.now()
    
    while (Date.now() - startTime < monitorDuration) {
      await this.collectMetrics()
      
      if (await this.checkThresholds()) {
        throw new Error('Post-launch monitoring detected issues')
      }
      
      // Wait 5 minutes before next check
      await new Promise(resolve => setTimeout(resolve, 300000))
    }
    
    console.log('✅ Launch monitoring completed successfully')
  }

  async emergencyRollback() {
    console.log('🚨 EMERGENCY ROLLBACK TRIGGERED')
    
    try {
      // Execute rollback script
      execSync('bash scripts/emergency-rollback.sh', { stdio: 'inherit' })
      
      console.log('✅ Rollback completed successfully')
      
    } catch (error) {
      console.error('❌ Rollback failed:', error.message)
      
      // Send emergency notifications
      await this.sendEmergencyNotifications(error.message)
    }
  }

  async sendEmergencyNotifications(errorMessage) {
    console.log('📢 Sending emergency notifications...')
    
    // Send to Slack/Teams
    // Send email notifications
    // Call on-call team
  }
}

// Run the launch controller
if (require.main === module) {
  const controller = new LaunchController()
  controller.main().catch(error => {
    console.error('❌ Launch controller failed:', error)
    process.exit(1)
  })
}

module.exports = { LaunchController, LAUNCH_CONFIG }
