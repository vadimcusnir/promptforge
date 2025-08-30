// Entitlements manager for feature access control
export interface Entitlement {
  feature: string;
  enabled: boolean;
  limit?: number;
  usage?: number;
}

export interface EntitlementsConfig {
  [key: string]: Entitlement;
}

export class EntitlementsManager {
  private entitlements: EntitlementsConfig = {};
  
  constructor(initialEntitlements?: EntitlementsConfig) {
    if (initialEntitlements) {
      this.entitlements = initialEntitlements;
    }
  }
  
  setEntitlement(feature: string, entitlement: Entitlement): void {
    this.entitlements[feature] = entitlement;
  }
  
  getEntitlement(feature: string): Entitlement | undefined {
    return this.entitlements[feature];
  }
  
  hasAccess(feature: string): boolean {
    const entitlement = this.entitlements[feature];
    return entitlement?.enabled || false;
  }
  
  canUseFeature(feature: string): boolean {
    const entitlement = this.entitlements[feature];
    if (!entitlement?.enabled) return false;
    
    if (entitlement.limit && entitlement.usage) {
      return entitlement.usage < entitlement.limit;
    }
    
    return true;
  }
  
  incrementUsage(feature: string): void {
    const entitlement = this.entitlements[feature];
    if (entitlement && entitlement.usage !== undefined) {
      entitlement.usage++;
    }
  }
  
  getAllEntitlements(): EntitlementsConfig {
    return { ...this.entitlements };
  }
}

export const entitlementsManager = new EntitlementsManager();
