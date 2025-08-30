export const publicAPIManager = {
  createAPIKey: (params: any) => ({ 
    apiKey: "mock-api-key-12345",
    keyData: {
      id: "mock-key-id",
      name: params.name || "Mock API Key",
      scopes: params.scopes || [],
      rateLimitRpm: params.rateLimitRpm || 60,
      monthlyLimit: params.monthlyLimit || 10000,
      expiresAt: params.expiresAt,
      createdBy: params.createdBy,
      createdAt: new Date().toISOString(),
      // Add expected properties
      key_prefix: "pf_",
      rate_limit_rpm: params.rateLimitRpm || 60,
      monthly_request_limit: params.monthlyLimit || 10000,
      expires_at: params.expiresAt,
      created_at: new Date().toISOString()
    }
  }),
  revokeAPIKey: (keyId: string, orgId?: string) => ({ success: true, keyId }),
};
export type APIScope = 
  | "read" 
  | "write"
  | "prompts:generate"
  | "prompts:test"
  | "prompts:score"
  | "exports:bundle"
  | "history:read"
  | "history:write"
  | "analytics:read"
  | "presets:read"
  | "admin:manage";
export interface PublicAPIResponse { data: any; }
