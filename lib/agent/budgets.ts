// PromptForge v3 - SACF Budget Guard
// Rate limiting, cost control și resource management

export interface Budget {
  tokensMax: number;
  requestsPerMin: number;
  costUsdMax: number;
  timeoutMs: number;
}

export interface BudgetUsage {
  tokens: number;
  requests: number;
  costUsd: number;
  timeElapsed: number;
}

const DEFAULT_BUDGET: Budget = {
  tokensMax: 12000,
  requestsPerMin: 60,
  costUsdMax: 1.5,
  timeoutMs: 20000
};

export class BudgetGuard {
  private usage: BudgetUsage;
  private startTime: number;
  private requestTimes: number[] = [];

  constructor(private budget: Budget = DEFAULT_BUDGET) {
    this.usage = {
      tokens: 0,
      requests: 0,
      costUsd: 0,
      timeElapsed: 0
    };
    this.startTime = Date.now();
  }

  // Verifică dacă operația poate fi executată
  can(tokens: number, costUsd: number): { allowed: boolean; reason?: string } {
    this.updateTimeElapsed();

    // Verifică token limit
    if (this.usage.tokens + tokens > this.budget.tokensMax) {
      return {
        allowed: false,
        reason: `Token limit exceeded: ${this.usage.tokens + tokens} > ${this.budget.tokensMax}`
      };
    }

    // Verifică cost limit
    if (this.usage.costUsd + costUsd > this.budget.costUsdMax) {
      return {
        allowed: false,
        reason: `Cost limit exceeded: $${(this.usage.costUsd + costUsd).toFixed(4)} > $${this.budget.costUsdMax}`
      };
    }

    // Verifică rate limit
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    // Curăță request-urile vechi
    this.requestTimes = this.requestTimes.filter(time => time > oneMinuteAgo);
    
    if (this.requestTimes.length >= this.budget.requestsPerMin) {
      return {
        allowed: false,
        reason: `Rate limit exceeded: ${this.requestTimes.length} requests in last minute (max: ${this.budget.requestsPerMin})`
      };
    }

    // Verifică timeout global
    if (this.usage.timeElapsed > this.budget.timeoutMs) {
      return {
        allowed: false,
        reason: `Global timeout exceeded: ${this.usage.timeElapsed}ms > ${this.budget.timeoutMs}ms`
      };
    }

    return { allowed: true };
  }

  // Adaugă usage după operație
  add(tokens: number, costUsd: number): void {
    this.usage.tokens += tokens;
    this.usage.costUsd += costUsd;
    this.usage.requests += 1;
    this.requestTimes.push(Date.now());
    this.updateTimeElapsed();
  }

  // Actualizează timpul scurs
  private updateTimeElapsed(): void {
    this.usage.timeElapsed = Date.now() - this.startTime;
  }

  // Obține usage-ul curent
  getUsage(): BudgetUsage {
    this.updateTimeElapsed();
    return { ...this.usage };
  }

  // Obține procentajul utilizat pentru fiecare resursă
  getUtilization(): {
    tokens: number;
    cost: number;
    time: number;
    requests: number;
  } {
    this.updateTimeElapsed();
    
    return {
      tokens: (this.usage.tokens / this.budget.tokensMax) * 100,
      cost: (this.usage.costUsd / this.budget.costUsdMax) * 100,
      time: (this.usage.timeElapsed / this.budget.timeoutMs) * 100,
      requests: (this.requestTimes.length / this.budget.requestsPerMin) * 100
    };
  }

  // Obține tiempo rămas pentru timeout
  getTimeRemaining(): number {
    this.updateTimeElapsed();
    return Math.max(0, this.budget.timeoutMs - this.usage.timeElapsed);
  }

  // Resetează usage (pentru testing)
  reset(): void {
    this.usage = {
      tokens: 0,
      requests: 0,
      costUsd: 0,
      timeElapsed: 0
    };
    this.startTime = Date.now();
    this.requestTimes = [];
  }

  // Creează o copie cu budget modificat
  withBudget(newBudget: Partial<Budget>): BudgetGuard {
    const updatedBudget = { ...this.budget, ...newBudget };
    const newGuard = new BudgetGuard(updatedBudget);
    
    // Copiază usage-ul curent
    newGuard.usage = { ...this.usage };
    newGuard.startTime = this.startTime;
    newGuard.requestTimes = [...this.requestTimes];
    
    return newGuard;
  }

  // Exportă raport pentru telemetrie
  getReport(): {
    budget: Budget;
    usage: BudgetUsage;
    utilization: ReturnType<BudgetGuard['getUtilization']>;
    efficiency: {
      tokensPerRequest: number;
      costPerToken: number;
      requestsPerSecond: number;
    };
  } {
    const utilization = this.getUtilization();
    const timeInSeconds = this.usage.timeElapsed / 1000;
    
    return {
      budget: this.budget,
      usage: this.getUsage(),
      utilization,
      efficiency: {
        tokensPerRequest: this.usage.requests > 0 ? this.usage.tokens / this.usage.requests : 0,
        costPerToken: this.usage.tokens > 0 ? this.usage.costUsd / this.usage.tokens : 0,
        requestsPerSecond: timeInSeconds > 0 ? this.usage.requests / timeInSeconds : 0
      }
    };
  }
}

// Factory pentru budget-uri predefinite pe planuri
export function createBudgetForPlan(planCode: string): Budget {
  switch (planCode) {
    case 'promptforge_pilot':
      return {
        tokensMax: 5000,
        requestsPerMin: 30,
        costUsdMax: 0.5,
        timeoutMs: 15000
      };
      
    case 'promptforge_pro':
      return {
        tokensMax: 12000,
        requestsPerMin: 60,
        costUsdMax: 1.5,
        timeoutMs: 20000
      };
      
    case 'promptforge_enterprise':
      return {
        tokensMax: 25000,
        requestsPerMin: 120,
        costUsdMax: 5.0,
        timeoutMs: 30000
      };
      
    default:
      return DEFAULT_BUDGET;
  }
}

// Rate limiter global pentru organizații
class OrgRateLimiter {
  private static instance: OrgRateLimiter;
  private orgRequestCounts: Map<string, number[]> = new Map();

  static getInstance(): OrgRateLimiter {
    if (!OrgRateLimiter.instance) {
      OrgRateLimiter.instance = new OrgRateLimiter();
    }
    return OrgRateLimiter.instance;
  }

  checkOrgRateLimit(orgId: string, limitPerMinute: number): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    // Obține istoricul pentru organizație
    let requestTimes = this.orgRequestCounts.get(orgId) || [];
    
    // Curăță request-urile vechi
    requestTimes = requestTimes.filter(time => time > oneMinuteAgo);
    
    // Actualizează istoricul
    this.orgRequestCounts.set(orgId, requestTimes);
    
    const remaining = Math.max(0, limitPerMinute - requestTimes.length);
    
    return {
      allowed: requestTimes.length < limitPerMinute,
      remaining
    };
  }

  recordOrgRequest(orgId: string): void {
    const now = Date.now();
    const requestTimes = this.orgRequestCounts.get(orgId) || [];
    requestTimes.push(now);
    this.orgRequestCounts.set(orgId, requestTimes);
  }

  // Cleanup periodic pentru performanță
  cleanup(): void {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    for (const [orgId, times] of this.orgRequestCounts.entries()) {
      const recentTimes = times.filter(time => time > oneMinuteAgo);
      
      if (recentTimes.length === 0) {
        this.orgRequestCounts.delete(orgId);
      } else {
        this.orgRequestCounts.set(orgId, recentTimes);
      }
    }
  }
}

export const orgRateLimiter = OrgRateLimiter.getInstance();

// Cleanup automat la fiecare 5 minute
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    orgRateLimiter.cleanup();
  }, 5 * 60 * 1000);
}