// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Mock environment variables for tests
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';

// Mock Next.js headers and cookies
jest.mock('next/headers', () => ({
  headers: jest.fn(() => ({
    get: jest.fn((header) => {
      const mockHeaders = {
        'x-org-id': 'test-org-id',
        'x-user-id': 'test-user-id', 
        'x-pf-key': 'test-api-key',
        'x-forwarded-for': '127.0.0.1',
      };
      return mockHeaders[header] || null;
    }),
  })),
  cookies: jest.fn(() => ({
    get: jest.fn((name) => {
      const mockCookies = {
        'pf_role': { value: 'admin' },
        'pf_uid': { value: 'test-user-id' },
        'pf_email': { value: 'test@example.com' },
      };
      return mockCookies[name] || null;
    }),
  })),
}));

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  })),
}));

// Mock OpenAI
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(() => Promise.resolve({
          choices: [{
            message: {
              content: JSON.stringify({
                editedPrompt: 'Optimized prompt',
                improvements: ['Improved clarity'],
                confidence: 85
              })
            }
          }],
          usage: {
            prompt_tokens: 100,
            completion_tokens: 50,
            total_tokens: 150
          }
        }))
      }
    }
  }));
});

// Increase test timeout for integration tests
jest.setTimeout(30000);
