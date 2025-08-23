'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface LocalRun {
  id: string;
  timestamp: Date;
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
}

interface RunsLocalContextType {
  runs: LocalRun[];
  addRun: (run: Omit<LocalRun, 'id' | 'timestamp'>) => void;
  removeRun: (id: string) => void;
  clearRuns: () => void;
  getRun: (id: string) => LocalRun | undefined;
  restoreRun: (id: string) => LocalRun | undefined;
}

const RunsLocalContext = createContext<RunsLocalContextType | undefined>(undefined);

const STORAGE_KEY = 'promptforge_local_runs';
const MAX_RUNS = 100; // Keep only last 100 runs for MVP

export function RunsLocalProvider({ children }: { children: ReactNode }) {
  const [runs, setRuns] = useState<LocalRun[]>([]);

  // Load runs from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const runsWithDates = parsed.map((run: any) => ({
          ...run,
          timestamp: new Date(run.timestamp),
        }));
        setRuns(runsWithDates);
      }
    } catch (error) {
      console.error('Failed to load local runs:', error);
    }
  }, []);

  // Save runs to localStorage whenever runs change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(runs));
    } catch (error) {
      console.error('Failed to save local runs:', error);
    }
  }, [runs]);

  const addRun = (run: Omit<LocalRun, 'id' | 'timestamp'>) => {
    const newRun: LocalRun = {
      ...run,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };

    setRuns(prev => {
      const updated = [newRun, ...prev];
      // Keep only the most recent MAX_RUNS
      return updated.slice(0, MAX_RUNS);
    });
  };

  const removeRun = (id: string) => {
    setRuns(prev => prev.filter(run => run.id !== id));
  };

  const clearRuns = () => {
    setRuns([]);
  };

  const getRun = (id: string) => {
    return runs.find(run => run.id === id);
  };

  const restoreRun = (id: string) => {
    return getRun(id);
  };

  const value = {
    runs,
    addRun,
    removeRun,
    clearRuns,
    getRun,
    restoreRun,
  };

  return (
    <RunsLocalContext.Provider value={value}>
      {children}
    </RunsLocalContext.Provider>
  );
}

export function useRunsLocal() {
  const context = useContext(RunsLocalContext);
  if (context === undefined) {
    throw new Error('useRunsLocal must be used within a RunsLocalProvider');
  }
  return context;
}
