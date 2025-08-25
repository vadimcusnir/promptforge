import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/entitlements/route';

// Mock dependencies
vi.mock('next-auth');
vi.mock('@supabase/supabase-js');

const mockSession = {
  user: {
    id: 'user-123',
    email: 'test@example.com',
  },
  accessToken: 'mock-token',
};

const mockSupabaseClient = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(),
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
    })),
  })),
};

// Mock environment variables
const originalEnv = process.env;
beforeEach(() => {
  process.env = {
    ...originalEnv,
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_ANON_KEY: 'anon_key',
  };

  vi.doMock('next-auth', () => ({
    getServerSession: vi.fn(() => Promise.resolve(mockSession)),
  }));

  vi.doMock('@supabase/supabase-js', () => ({
    createClient: vi.fn(() => mockSupabaseClient),
  }));
});

afterEach(() => {
  process.env = originalEnv;
  vi.clearAllMocks();
});

describe('Entitlements API', () => {
  const createMockRequest = (orgId?: string) => {
    const url = orgId 
      ? `http://localhost:3000/api/entitlements?org_id=${orgId}`
      : 'http://localhost:3000/api/entitlements';
    
    return new NextRequest(url, {
      method: 'GET',
    });
  };

  describe('GET /api/entitlements', () => {
    it('should return entitlements for valid org member', async () => {
      // Mock membership check
      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: { role: 'member' },
              error: null,
            })),
          })),
        })),
      });

      // Mock entitlements query
      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(),
            eq: vi.fn(() => ({
              single: vi.fn(),
              data: [
                { flag: 'canUseGptTestReal', value: true, sources: ['plan'], earliest_expiry: null },
                { flag: 'canExportPDF', value: true, sources: ['plan'], earliest_expiry: null },
                { flag: 'hasAPI', value: false, sources: ['plan'], earliest_expiry: null },
              ],
              error: null,
            })),
          })),
        })),
      });

      // Mock subscription query
      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: {
                plan_code: 'pro',
                status: 'active',
                seats: 1,
                trial_end: null,
                current_period_end: '2024-02-01T00:00:00Z',
              },
              error: null,
            })),
          })),
        })),
      });

      const request = createMockRequest('org-123');
      const response = await GET(request);

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toMatchObject({
        org_id: 'org-123',
        user_id: 'user-123',
        entitlements: {
          canUseGptTestReal: true,
          canExportPDF: true,
          hasAPI: false,
          canExportMD: false, // Default value
        },
        subscription: {
          plan_code: 'pro',
          status: 'active',
          seats: 1,
        },
        membership: {
          role: 'member',
        },
      });
    });

    it('should return 401 for unauthenticated requests', async () => {
      vi.doMock('next-auth', () => ({
        getServerSession: vi.fn(() => Promise.resolve(null)),
      }));

      const request = createMockRequest('org-123');
      const response = await GET(request);

      expect(response.status).toBe(401);
    });

    it('should return 400 for missing org_id', async () => {
      const request = createMockRequest();
      const response = await GET(request);

      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.error).toBe('org_id required');
    });

    it('should return 403 for non-members', async () => {
      // Mock membership check - user not found
      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: null,
              error: { code: 'PGRST116' }, // Not found
            })),
          })),
        })),
      });

      const request = createMockRequest('org-123');
      const response = await GET(request);

      expect(response.status).toBe(403);
      
      const data = await response.json();
      expect(data.error).toBe('Not a member of this organization');
    });

    it('should fallback to org entitlements when user entitlements fail', async () => {
      // Mock membership check
      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: { role: 'member' },
              error: null,
            })),
          })),
        })),
      });

      // Mock user entitlements query failure
      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(),
            eq: vi.fn(() => ({
              single: vi.fn(),
              data: null,
              error: new Error('User entitlements error'),
            })),
          })),
        })),
      });

      // Mock org entitlements query success
      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(),
            eq: vi.fn(() => ({
              single: vi.fn(),
              data: [
                { flag: 'canUseAllModules', value: false, sources: ['plan'], earliest_expiry: null },
                { flag: 'canExportMD', value: true, sources: ['plan'], earliest_expiry: null },
              ],
              error: null,
            })),
          })),
        })),
      });

      const request = createMockRequest('org-123');
      const response = await GET(request);

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.fallback).toBe('org');
      expect(data.entitlements.canUseAllModules).toBe(false);
      expect(data.entitlements.canExportMD).toBe(true);
    });

    it('should handle database errors gracefully', async () => {
      // Mock membership check failure
      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: null,
              error: new Error('Database connection error'),
            })),
          })),
        })),
      });

      const request = createMockRequest('org-123');
      const response = await GET(request);

      expect(response.status).toBe(403);
    });

    it('should convert entitlements correctly', async () => {
      // Mock membership check
      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: { role: 'admin' },
              error: null,
            })),
          })),
        })),
      });

      // Mock entitlements with various data types
      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(),
            eq: vi.fn(() => ({
              single: vi.fn(),
              data: [
                { flag: 'canUseGptTestReal', value: true },
                { flag: 'canExportPDF', value: false },
                { flag: 'maxRunsPerDay', value: '100' }, // String number
                { flag: 'hasAPI', value: true },
              ],
              error: null,
            })),
          })),
        })),
      });

      // Mock subscription query
      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: null, // No subscription
              error: { code: 'PGRST116' },
            })),
          })),
        })),
      });

      const request = createMockRequest('org-123');
      const response = await GET(request);

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.entitlements.canUseGptTestReal).toBe(true);
      expect(data.entitlements.canExportPDF).toBe(false);
      expect(data.entitlements.maxRunsPerDay).toBe(100); // Converted to number
      expect(data.entitlements.hasAPI).toBe(true);
      expect(data.subscription).toBe(null);
    });
  });

  describe('entitlements conversion', () => {
    it('should provide default values for missing flags', async () => {
      // Mock membership check
      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: { role: 'member' },
              error: null,
            })),
          })),
        })),
      });

      // Mock empty entitlements
      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(),
            eq: vi.fn(() => ({
              single: vi.fn(),
              data: [], // No entitlements
              error: null,
            })),
          })),
        })),
      });

      // Mock subscription query
      mockSupabaseClient.from.mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: null,
              error: { code: 'PGRST116' },
            })),
          })),
        })),
      });

      const request = createMockRequest('org-123');
      const response = await GET(request);

      expect(response.status).toBe(200);
      
      const data = await response.json();
      
      // All boolean flags should default to false
      expect(data.entitlements.canUseGptTestReal).toBe(false);
      expect(data.entitlements.canExportPDF).toBe(false);
      expect(data.entitlements.hasAPI).toBe(false);
      
      // Numeric limits should have defaults
      expect(data.entitlements.maxRunsPerDay).toBe(10);
      expect(data.entitlements.maxSeats).toBe(1);
    });
  });
});
