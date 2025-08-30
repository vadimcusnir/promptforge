export const auth = {};
export const authOptions = {};

// Mock AuthenticatedUser interface
export interface AuthenticatedUser {
  id: string;
  email: string;
  plan: 'pilot' | 'pro' | 'enterprise';
  creditsRemaining: number;
  trialEndsAt?: string;
}

export const requireAuth = (request?: any): AuthenticatedUser => ({
  id: "test-user-id",
  email: "test@example.com",
  plan: "pro",
  creditsRemaining: 1000,
  trialEndsAt: undefined
});

export const validateOrgMembership = () => ({ valid: true, orgId: "test-org" });

export const getUserFromCookies = (): AuthenticatedUser => ({
  id: "test-user-id", 
  email: "test@example.com",
  plan: "pro",
  creditsRemaining: 1000,
  trialEndsAt: undefined
});
