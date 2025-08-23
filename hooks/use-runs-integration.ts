import { useRunsLocal } from '@/lib/contexts/runs-local-context';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useRunsIntegration() {
  const { runs, addRun, getRun } = useRunsLocal();
  const searchParams = useSearchParams();
  const [restoredRun, setRestoredRun] = useState<any>(null);

  // Check for restore parameter in URL
  useEffect(() => {
    const restoreId = searchParams.get('restore');
    if (restoreId) {
      const run = getRun(restoreId);
      if (run) {
        setRestoredRun(run);
        // Clean up URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('restore');
        window.history.replaceState({}, '', newUrl.toString());
      }
    }
  }, [searchParams, getRun]);

  // Function to save a run after generation
  const saveRun = (runData: {
    moduleId: string;
    moduleName: string;
    prompt: string;
    response?: string;
    score?: {
      clarity: number;
      execution: number;
      ambiguity: number;
      business_fit: number;
      composite: number;
    };
    config: any;
    tags: string[];
  }) => {
    addRun(runData);
  };

  // Function to clear restored run
  const clearRestoredRun = () => {
    setRestoredRun(null);
  };

  return {
    runs,
    restoredRun,
    saveRun,
    clearRestoredRun,
    hasRestoredRun: !!restoredRun,
  };
}
