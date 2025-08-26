import { useState } from 'react';
type Plan = 'pilot' | 'pro' | 'enterprise';

interface Params7D {
  domain: string;
  scale: string;
  urgency: string;
  complexity: string;
  resources: string;
  application: string;
  output: string;
}

interface UseAgentOptions {
  plan: Plan;
  moduleId: string;
  params7d: Params7D;
}

export function useAgent({ plan, moduleId, params7d }: UseAgentOptions) {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Verifică dacă planul poate accesa modulul (hardcoded pentru exemplu)
  const canAccess = plan === 'pilot' ? ['M01', 'M02', 'M11', 'M12', 'M21', 'M22'].includes(moduleId) : true;
  
  // Verifică export capabilities (hardcoded pentru exemplu)
  const exportCapabilities = {
    txt: true,
    md: true,
    json: plan === 'pro' || plan === 'enterprise',
    pdf: plan === 'pro' || plan === 'enterprise',
    bundle: plan === 'enterprise'
  };

  const runSimulation = async () => {
    if (!canAccess) {
      setError("Module not available for your plan");
      return;
    }

    setIsRunning(true);
    setError(null);

    try {
      const prompt = `Generate industrial prompt for module ${moduleId}`;
      
      // Simulează execuția (în loc de runAgent)
      const result = {
        run_id: `sim_${Date.now()}`,
        status: "success" as const,
        output: `[Simulated] Generated prompt for module ${moduleId}`,
        tokens: 250,
        duration_ms: 500,
        cost_cents: 0,
        meta: {
          module_id: moduleId,
          params7d,
          plan,
          provider: "simulated" as const
        }
      };

      setResult(result);
    } catch (err: any) {
      setError(err.message || "Failed to run simulation");
    } finally {
      setIsRunning(false);
    }
  };

  const runLive = async () => {
    if (!canAccess) {
      setError("Module not available for your plan");
      return;
    }

    setIsRunning(true);
    setError(null);

    try {
      const prompt = `Generate industrial prompt for module ${moduleId}`;
      
      // Simulează execuția live (în loc de runAgent)
      const result = {
        run_id: `live_${Date.now()}`,
        status: "success" as const,
        output: `[Live] Generated prompt for module ${moduleId}`,
        tokens: 350,
        duration_ms: 1200,
        cost_cents: 2,
        meta: {
          module_id: moduleId,
          params7d,
          plan,
          provider: "openai" as const
        }
      };

      setResult(result);
    } catch (err: any) {
      setError(err.message || "Failed to run live test");
    } finally {
      setIsRunning(false);
    }
  };

  return {
    canAccess,
    exportCapabilities,
    isRunning,
    result,
    error,
    runSimulation,
    runLive
  };
}
