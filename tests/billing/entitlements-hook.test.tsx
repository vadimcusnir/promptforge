import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useEntitlements } from '@/hooks/use-entitlements';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('useEntitlements Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockEntitlementsResponse = {
    org_id: 'org-123',
    user_id: 'user-123',
    entitlements: {
      canUseGptTestReal: true,
      canExportPDF: true,
      canExportJSON: false,
      canExportBundleZip: false,
      hasAPI: false,
      canUseAllModules: true,
      canExportMD: true,
      hasCloudHistory: true,
      hasEvaluatorAI: true,
      hasWhiteLabel: false,
      hasSeatsGT1: false,
      hasExportDesigner: false,
      hasFinTechPack: false,
      hasEduPack: false,
      hasIndustryTemplates: false,
      maxRunsPerDay: 100,
      maxSeats: 1,
    },
    subscription: {
      plan_code: 'pro' as const,
      status: 'active',
      seats: 1,
      trial_end: null,
      current_period_end: '2024-02-01T00:00:00Z',
    },
    membership: {
      role: 'member',
    },
  };

  describe('successful data fetching', () => {
    it('should fetch and return entitlements data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockEntitlementsResponse),
      });

      const { result } = renderHook(() => useEntitlements('org-123'));

      expect(result.current.loading).toBe(true);
      expect(result.current.entitlements).toBe(null);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.entitlements).toEqual(mockEntitlementsResponse.entitlements);
      expect(result.current.subscription).toEqual(mockEntitlementsResponse.subscription);
      expect(result.current.membership).toEqual(mockEntitlementsResponse.membership);
      expect(result.current.error).toBe(null);
    });

    it('should cache data in localStorage', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockEntitlementsResponse),
      });

      renderHook(() => useEntitlements('org-123'));

      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          'promptforge_entitlements_org-123',
          expect.stringContaining('"data":')
        );
      });
    });
  });

  describe('error handling', () => {
    it('should handle HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: () => Promise.resolve({ error: 'Forbidden' }),
      });

      const { result } = renderHook(() => useEntitlements('org-123'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Forbidden');
      expect(result.current.entitlements).toBe(null);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useEntitlements('org-123'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Network error');
    });

    it('should fallback to cache on error', async () => {
      const cachedData = {
        data: mockEntitlementsResponse,
        timestamp: Date.now() - 60000, // 1 minute ago
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(cachedData));
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useEntitlements('org-123'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.entitlements).toEqual(mockEntitlementsResponse.entitlements);
      expect(result.current.error).toBe('Using cached data (offline)');
    });

    it('should not use stale cache', async () => {
      const staleData = {
        data: mockEntitlementsResponse,
        timestamp: Date.now() - 10 * 60 * 1000, // 10 minutes ago
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(staleData));
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useEntitlements('org-123'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.entitlements).toBe(null);
      expect(result.current.error).toBe('Network error');
    });

    it('should handle missing org_id', async () => {
      const { result } = renderHook(() => useEntitlements(''));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Organization ID is required');
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('convenience methods', () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockEntitlementsResponse),
      });
    });

    it('should check feature access correctly', async () => {
      const { result } = renderHook(() => useEntitlements('org-123'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.canUseFeature('canUseGptTestReal')).toBe(true);
      expect(result.current.canUseFeature('canExportJSON')).toBe(false);
      expect(result.current.canUseFeature('hasAPI')).toBe(false);
    });

    it('should check plan correctly', async () => {
      const { result } = renderHook(() => useEntitlements('org-123'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isPlan('pro')).toBe(true);
      expect(result.current.isPlan('enterprise')).toBe(false);
      expect(result.current.isPlan('pilot')).toBe(false);
    });

    it('should check trial status', async () => {
      const trialResponse = {
        ...mockEntitlementsResponse,
        subscription: {
          ...mockEntitlementsResponse.subscription!,
          trial_end: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(trialResponse),
      });

      const { result } = renderHook(() => useEntitlements('org-123'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isTrialing()).toBe(true);
    });

    it('should calculate days until expiry', async () => {
      const futureDate = new Date(Date.now() + 7 * 86400000); // 7 days from now
      const expiryResponse = {
        ...mockEntitlementsResponse,
        subscription: {
          ...mockEntitlementsResponse.subscription!,
          current_period_end: futureDate.toISOString(),
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(expiryResponse),
      });

      const { result } = renderHook(() => useEntitlements('org-123'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const daysLeft = result.current.daysUntilExpiry();
      expect(daysLeft).toBeGreaterThan(6);
      expect(daysLeft).toBeLessThanOrEqual(7);
    });

    it('should handle missing subscription data', async () => {
      const noSubResponse = {
        ...mockEntitlementsResponse,
        subscription: null,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(noSubResponse),
      });

      const { result } = renderHook(() => useEntitlements('org-123'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isPlan('pro')).toBe(false);
      expect(result.current.isTrialing()).toBe(false);
      expect(result.current.daysUntilExpiry()).toBe(null);
    });
  });

  describe('refetch functionality', () => {
    it('should refetch data when called', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockEntitlementsResponse),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            ...mockEntitlementsResponse,
            entitlements: {
              ...mockEntitlementsResponse.entitlements,
              canUseGptTestReal: false, // Changed
            },
          }),
        });

      const { result } = renderHook(() => useEntitlements('org-123'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.canUseFeature('canUseGptTestReal')).toBe(true);

      // Refetch
      await result.current.refetch();

      expect(result.current.canUseFeature('canUseGptTestReal')).toBe(false);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('org_id changes', () => {
    it('should refetch when org_id changes', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockEntitlementsResponse),
      });

      const { result, rerender } = renderHook(
        ({ orgId }) => useEntitlements(orgId),
        { initialProps: { orgId: 'org-123' } }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);

      // Change org_id
      rerender({ orgId: 'org-456' });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenLastCalledWith(
        '/api/entitlements?org_id=org-456',
        expect.any(Object)
      );
    });
  });
});
