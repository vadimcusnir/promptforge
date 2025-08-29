/**
 * Unit tests for check-config.js script
 * Tests configuration validation and error reporting
 */

const fs = require('fs');
const path = require('path');

// Mock fs module
jest.mock('fs');

// Mock console methods to capture output
const mockConsoleLog = jest.fn();
const mockConsoleError = jest.fn();

// Store original console methods
const originalConsole = {
  log: console.log,
  error: console.error
};

describe('check-config.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset process.exit mock
    process.exit = jest.fn();
    
    // Setup console mocks
    console.log = mockConsoleLog;
    console.error = mockConsoleError;
  });

  afterEach(() => {
    // Restore original console methods
    console.log = originalConsole.log;
    console.error = originalConsole.error;
  });

  describe('Environment file validation', () => {
    test('should detect missing .env.local file', async () => {
      // Mock fs.existsSync to return false for .env.local
      fs.existsSync.mockImplementation((path) => {
        if (path.includes('.env.local')) return false;
        return true;
      });

      // Import and run the function
      const { runConfigCheck } = require('../scripts/check-config');
      await runConfigCheck();

      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('❌ .env.local file not found')
      );
    });

    test('should validate correct environment variables', async () => {
      // Mock fs.existsSync to return true for all files
      fs.existsSync.mockReturnValue(true);

      // Mock fs.readFileSync to return valid .env.local content
      const validEnvContent = `
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_FAKE_STRIPE_KEY_FOR_TESTING_ONLY_123456789
STRIPE_WEBHOOK_SECRET=whsec_FAKE_WEBHOOK_SECRET_FOR_TESTING_ONLY_123456789
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_FAKE_STRIPE_PUBLISHABLE_KEY_FOR_TESTING_ONLY_123456789

# Supabase Configuration
SUPABASE_URL=https://fake-test-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QtcHJvamVjdCIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxOTUwMTQzODkwfQ.test_signature
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QtcHJvamVjdCIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxOTUwMTQzODkwfQ.test_signature

# Application Configuration
NEXT_PUBLIC_BASE_URL=https://localhost:3000
NODE_ENV=development
      `.trim();

      fs.readFileSync.mockReturnValue(validEnvContent);

      // Import and run the function
      const { runConfigCheck } = require('../scripts/check-config');
      await runConfigCheck();

      // Should show all required variables as valid
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('✅ STRIPE_SECRET_KEY: VALID')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('✅ SUPABASE_URL: VALID')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('✅ NODE_ENV: VALID')
      );
    });

    test('should detect invalid Stripe secret key format', async () => {
      // Mock fs.existsSync to return true for all files
      fs.existsSync.mockReturnValue(true);

      // Mock fs.readFileSync to return invalid .env.local content
      const invalidEnvContent = `
# Stripe Configuration
STRIPE_SECRET_KEY=invalid_key_format
STRIPE_WEBHOOK_SECRET=whsec_FAKE_WEBHOOK_SECRET_FOR_TESTING_ONLY_123456789
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_FAKE_STRIPE_PUBLISHABLE_KEY_FOR_TESTING_ONLY_123456789

# Supabase Configuration
SUPABASE_URL=https://fake-test-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QtcHJvamVjdCIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxOTUwMTQzODkwfQ.test_signature
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QtcHJvamVjdCIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxOTUwMTQzODkwfQ.test_signature

# Application Configuration
NEXT_PUBLIC_BASE_URL=https://localhost:3000
NODE_ENV=development
      `.trim();

      fs.readFileSync.mockReturnValue(invalidEnvContent);

      // Import and run the function
      const { runConfigCheck } = require('../scripts/check-config');
      await runConfigCheck();

      // Should show STRIPE_SECRET_KEY as invalid
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('❌ STRIPE_SECRET_KEY: INVALID FORMAT')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('Expected: Stripe Secret Key (starts with sk_test_ or sk_live_)')
      );
    });

    test('should detect invalid Supabase URL format', async () => {
      // Mock fs.existsSync to return true for all files
      fs.existsSync.mockReturnValue(true);

      // Mock fs.readFileSync to return invalid .env.local content
      const invalidEnvContent = `
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_FAKE_STRIPE_KEY_FOR_TESTING_ONLY_123456789
STRIPE_WEBHOOK_SECRET=whsec_FAKE_WEBHOOK_SECRET_FOR_TESTING_ONLY_123456789
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_FAKE_STRIPE_PUBLISHABLE_KEY_FOR_TESTING_ONLY_123456789

# Supabase Configuration
SUPABASE_URL=invalid_url_format
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QtcHJvamVjdCIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxOTUwMTQzODkwfQ.test_signature
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QtcHJvamVjdCIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxOTUwMTQzODkwfQ.test_signature

# Application Configuration
NEXT_PUBLIC_BASE_URL=https://localhost:3000
NODE_ENV=development
      `.trim();

      fs.readFileSync.mockReturnValue(invalidEnvContent);

      // Import and run the function
      const { runConfigCheck } = require('../scripts/check-config');
      await runConfigCheck();

      // Should show SUPABASE_URL as invalid
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('❌ SUPABASE_URL: INVALID FORMAT')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('Expected: Supabase Project URL (https://project-id.supabase.co)')
      );
    });

    test('should detect invalid NODE_ENV value', async () => {
      // Mock fs.existsSync to return true for all files
      fs.existsSync.mockReturnValue(true);

      // Mock fs.readFileSync to return invalid .env.local content
      const invalidEnvContent = `
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_FAKE_STRIPE_KEY_FOR_TESTING_ONLY_123456789
STRIPE_WEBHOOK_SECRET=whsec_FAKE_WEBHOOK_SECRET_FOR_TESTING_ONLY_123456789
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_FAKE_STRIPE_PUBLISHABLE_KEY_FOR_TESTING_ONLY_123456789

# Supabase Configuration
SUPABASE_URL=https://fake-test-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QtcHJvamVjdCIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxOTUwMTQzODkwfQ.test_signature
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QtcHJvamVjdCIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxOTUwMTQzODkwfQ.test_signature

# Application Configuration
NEXT_PUBLIC_BASE_URL=https://localhost:3000
NODE_ENV=invalid_environment
      `.trim();

      fs.readFileSync.mockReturnValue(invalidEnvContent);

      // Import and run the function
      const { runConfigCheck } = require('../scripts/check-config');
      await runConfigCheck();

      // Should show NODE_ENV as invalid
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('❌ NODE_ENV: INVALID FORMAT')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('Expected: Node Environment')
      );
    });

    test('should handle missing required environment variables', async () => {
      // Mock fs.existsSync to return true for all files
      fs.existsSync.mockReturnValue(true);

      // Mock fs.readFileSync to return incomplete .env.local content
      const incompleteEnvContent = `
# Stripe Configuration
# STRIPE_SECRET_KEY=sk_test_FAKE_STRIPE_KEY_FOR_TESTING_ONLY_123456789
STRIPE_WEBHOOK_SECRET=whsec_FAKE_WEBHOOK_SECRET_FOR_TESTING_ONLY_123456789
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_FAKE_STRIPE_PUBLISHABLE_KEY_FOR_TESTING_ONLY_123456789

# Supabase Configuration
SUPABASE_URL=https://fake-test-project.supabase.co
# SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QtcHJvamVjdCIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxOTUwMTQzODkwfQ.test_signature
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QtcHJvamVjdCIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxOTUwMTQzODkwfQ.test_signature

# Application Configuration
NEXT_PUBLIC_BASE_URL=https://localhost:3000
NODE_ENV=development
      `.trim();

      fs.readFileSync.mockReturnValue(incompleteEnvContent);

      // Import and run the function
      const { runConfigCheck } = require('../scripts/check-config');
      await runConfigCheck();

      // Should show missing variables
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('❌ STRIPE_SECRET_KEY: MISSING')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('❌ SUPABASE_SERVICE_ROLE_KEY: MISSING')
      );
    });
  });

  describe('File structure validation', () => {
    test('should detect missing required files', async () => {
      // Mock fs.existsSync to return false for some required files
      fs.existsSync.mockImplementation((path) => {
        if (path.includes('.env.local')) return true;
        if (path.includes('lib/billing/stripe.ts')) return false;
        if (path.includes('app/api/webhooks/stripe/route.ts')) return false;
        return true;
      });

      // Mock valid .env.local content
      const validEnvContent = `
STRIPE_SECRET_KEY=sk_test_FAKE_STRIPE_KEY_FOR_TESTING_ONLY_123456789
STRIPE_WEBHOOK_SECRET=whsec_FAKE_WEBHOOK_SECRET_FOR_TESTING_ONLY_123456789
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_FAKE_STRIPE_PUBLISHABLE_KEY_FOR_TESTING_ONLY_123456789
SUPABASE_URL=https://fake-test-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QtcHJvamVjdCIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxOTUwMTQzODkwfQ.test_signature
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QtcHJvamVjdCIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxOTUwMTQzODkwfQ.test_signature
NEXT_PUBLIC_BASE_URL=https://localhost:3000
NODE_ENV=development
      `.trim();

      fs.readFileSync.mockReturnValue(validEnvContent);

      // Import and run the function
      const { runConfigCheck } = require('../scripts/check-config');
      await runConfigCheck();

      // Should show missing files
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('❌ lib/billing/stripe.ts')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('❌ app/api/webhooks/stripe/route.ts')
      );
    });
  });

  describe('Database migration validation', () => {
    test('should validate migration file content', async () => {
      // Mock fs.existsSync to return true for all files
      fs.existsSync.mockReturnValue(true);

      // Mock valid .env.local content
      const validEnvContent = `
STRIPE_SECRET_KEY=sk_test_FAKE_STRIPE_KEY_FOR_TESTING_ONLY_123456789
STRIPE_WEBHOOK_SECRET=whsec_FAKE_WEBHOOK_SECRET_FOR_TESTING_ONLY_123456789
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_FAKE_STRIPE_PUBLISHABLE_KEY_FOR_TESTING_ONLY_123456789
SUPABASE_URL=https://fake-test-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QtcHJvamVjdCIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxOTUwMTQzODkwfQ.test_signature
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QtcHJvamVjdCIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxOTUwMTQzODkwfQ.test_signature
NEXT_PUBLIC_BASE_URL=https://localhost:3000
NODE_ENV=development
      `.trim();

      // Mock migration file content with all required components
      const migrationContent = `
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL
);

CREATE TABLE entitlements (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  feature TEXT NOT NULL,
  enabled BOOLEAN DEFAULT false
);

CREATE TABLE webhook_events (
  id UUID PRIMARY KEY,
  event_type TEXT NOT NULL,
  payload JSONB
);

CREATE OR REPLACE FUNCTION pf_apply_plan_entitlements()
RETURNS TRIGGER AS $$
BEGIN
  -- Function implementation
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
      `.trim();

      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('.env.local')) return validEnvContent;
        if (path.includes('migration')) return migrationContent;
        return '';
      });

      // Import and run the function
      const { runConfigCheck } = require('../scripts/check-config');
      await runConfigCheck();

      // Should show all migration checks as valid
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('✅ Subscriptions table')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('✅ Entitlements table')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('✅ Webhook events table')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('✅ pf_apply_plan_entitlements function')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('✅ RLS policies')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('✅ Indexes')
      );
    });

    test('should detect missing migration components', async () => {
      // Mock fs.existsSync to return true for all files
      fs.existsSync.mockReturnValue(true);

      // Mock valid .env.local content
      const validEnvContent = `
STRIPE_SECRET_KEY=sk_test_FAKE_STRIPE_KEY_FOR_TESTING_ONLY_123456789
STRIPE_WEBHOOK_SECRET=whsec_FAKE_WEBHOOK_SECRET_FOR_TESTING_ONLY_123456789
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_FAKE_STRIPE_PUBLISHABLE_KEY_FOR_TESTING_ONLY_123456789
SUPABASE_URL=https://fake-test-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QtcHJvamVjdCIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxOTUwMTQzODkwfQ.test_signature
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QtcHJvamVjdCIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxOTUwMTQzODkwfQ.test_signature
NEXT_PUBLIC_BASE_URL=https://localhost:3000
NODE_ENV=development
      `.trim();

      // Mock migration file content missing some components
      const incompleteMigrationContent = `
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL
);

-- Missing entitlements table
-- Missing webhook_events table
-- Missing function
-- Missing policies
-- Missing indexes
      `.trim();

      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('.env.local')) return validEnvContent;
        if (path.includes('migration')) return incompleteMigrationContent;
        return '';
      });

      // Import and run the function
      const { runConfigCheck } = require('../scripts/check-config');
      await runConfigCheck();

      // Should show missing components as invalid
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('❌ Entitlements table')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('❌ Webhook events table')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('❌ pf_apply_plan_entitlements function')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('❌ RLS policies')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('❌ Indexes')
      );
    });
  });

  describe('Summary reporting', () => {
    test('should show success message when all checks pass', async () => {
      // Mock fs.existsSync to return true for all files
      fs.existsSync.mockReturnValue(true);

      // Mock valid .env.local content
      const validEnvContent = `
STRIPE_SECRET_KEY=sk_test_FAKE_STRIPE_KEY_FOR_TESTING_ONLY_123456789
STRIPE_WEBHOOK_SECRET=whsec_FAKE_WEBHOOK_SECRET_FOR_TESTING_ONLY_123456789
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_FAKE_STRIPE_PUBLISHABLE_KEY_FOR_TESTING_ONLY_123456789
SUPABASE_URL=https://fake-test-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QtcHJvamVjdCIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxOTUwMTQzODkwfQ.test_signature
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QtcHJvamVjdCIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxOTUwMTQzODkwfQ.test_signature
NEXT_PUBLIC_BASE_URL=https://localhost:3000
NODE_ENV=development
      `.trim();

      // Mock complete migration file content
      const migrationContent = `
CREATE TABLE subscriptions (id UUID PRIMARY KEY);
CREATE TABLE entitlements (id UUID PRIMARY KEY);
CREATE TABLE webhook_events (id UUID PRIMARY KEY);
CREATE OR REPLACE FUNCTION pf_apply_plan_entitlements() RETURNS TRIGGER AS $$ BEGIN RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE POLICY "test" ON subscriptions FOR SELECT USING (true);
CREATE INDEX idx_test ON subscriptions(id);
      `.trim();

      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('.env.local')) return validEnvContent;
        if (path.includes('migration')) return migrationContent;
        return '';
      });

      // Import and run the function
      const { runConfigCheck } = require('../scripts/check-config');
      await runConfigCheck();

      // Should show success message
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('🏆 CONFIGURATION CHECK PASSED!')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('🚀 PromptForge v3 billing system is properly configured!')
      );
    });

    test('should show failure message when checks fail', async () => {
      // Mock fs.existsSync to return false for some files
      fs.existsSync.mockImplementation((path) => {
        if (path.includes('.env.local')) return true;
        if (path.includes('lib/billing/stripe.ts')) return false;
        return true;
      });

      // Mock valid .env.local content
      const validEnvContent = `
STRIPE_SECRET_KEY=sk_test_FAKE_STRIPE_KEY_FOR_TESTING_ONLY_123456789
STRIPE_WEBHOOK_SECRET=whsec_FAKE_WEBHOOK_SECRET_FOR_TESTING_ONLY_123456789
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_FAKE_STRIPE_PUBLISHABLE_KEY_FOR_TESTING_ONLY_123456789
SUPABASE_URL=https://fake-test-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QtcHJvamVjdCIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxOTUwMTQzODkwfQ.test_signature
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QtcHJvamVjdCIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxOTUwMTQzODkwfQ.test_signature
NEXT_PUBLIC_BASE_URL=https://localhost:3000
NODE_ENV=development
      `.trim();

      fs.readFileSync.mockReturnValue(validEnvContent);

      // Import and run the function
      const { runConfigCheck } = require('../scripts/check-config');
      await runConfigCheck();

      // Should show failure message
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('⚠️  CONFIGURATION CHECK FAILED')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('🔧 Please fix the issues above before proceeding')
      );
    });
  });
});
