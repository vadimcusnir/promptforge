"use client";

import type { GeneratedPrompt, TestResult } from "@/types/promptforge";

export interface HistoryEntry {
  id: string;
  runId: string;
  moduleId: number;
  sevenDConfig: any;
  timestamp: Date;
  prompt: string;
  testResults?: TestResult;
  score?: number;
  verdict?: string;
}

export interface PromptHistoryEntry extends GeneratedPrompt {
  runId: string;
  testResults?: TestResult;
  score?: number;
  verdict?: string;
}

export class PromptHistoryManager {
  private static instance: PromptHistoryManager;
  private readonly STORAGE_KEY = 'promptforge_history';
  private readonly MAX_LOCAL_ENTRIES = 50;

  private constructor() {}

  static getInstance(): PromptHistoryManager {
    if (!PromptHistoryManager.instance) {
      PromptHistoryManager.instance = new PromptHistoryManager();
    }
    return PromptHistoryManager.instance;
  }

  /**
   * Save a generated prompt to local history
   */
  async saveToHistory(prompt: GeneratedPrompt, runId: string): Promise<void> {
    try {
      const history = await this.getLocalHistory();
      
      const entry: HistoryEntry = {
        id: prompt.id,
        runId,
        moduleId: prompt.moduleId,
        sevenDConfig: prompt.sevenDConfig,
        timestamp: prompt.timestamp,
        prompt: prompt.content,
      };

      // Add to beginning of history
      history.unshift(entry);

      // Limit local storage entries
      if (history.length > this.MAX_LOCAL_ENTRIES) {
        history.splice(this.MAX_LOCAL_ENTRIES);
      }

      // Save to localStorage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));

      // Try to sync with Supabase if available
      await this.syncToCloud(entry);
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  }

  /**
   * Get local history from localStorage
   */
  async getLocalHistory(): Promise<HistoryEntry[]> {
    try {
      if (typeof window === 'undefined') return [];
      
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];

      const history = JSON.parse(stored);
      
      // Convert timestamp strings back to Date objects
      return history.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
        testResults: entry.testResults ? {
          ...entry.testResults,
          timestamp: new Date(entry.testResults.timestamp)
        } : undefined
      }));
    } catch (error) {
      console.error('Error loading local history:', error);
      return [];
    }
  }

  /**
   * Get a specific run by ID
   */
  async getRunById(runId: string): Promise<GeneratedPrompt | null> {
    try {
      const history = await this.getLocalHistory();
      const entry = history.find(h => h.id === runId);
      
      if (!entry) return null;

      return {
        id: entry.id,
        moduleId: entry.moduleId,
        sevenDConfig: entry.sevenDConfig,
        content: entry.prompt,
        prompt: entry.prompt,
        config: entry.sevenDConfig,
        timestamp: entry.timestamp,
        hash: this.generateHash(),
        tokens: Math.floor(Math.random() * 500) + 300,
        tta: Math.random() * 2 + 0.5,
        moduleName: `Module ${entry.moduleId}`,
        vector: parseInt(entry.sevenDConfig.vector?.slice(1) || "1"),
        sessionHash: this.generateHash(),
      };
    } catch (error) {
      console.error('Error getting run by ID:', error);
      return null;
    }
  }

  /**
   * Update test results for a prompt
   */
  async updateTestResults(promptId: string, testResults: TestResult): Promise<void> {
    try {
      const history = await this.getLocalHistory();
      const entryIndex = history.findIndex(h => h.id === promptId);
      
      if (entryIndex !== -1) {
        history[entryIndex].testResults = testResults;
        history[entryIndex].score = this.calculateScore(testResults);
        history[entryIndex].verdict = testResults.verdict;
        
        // Save updated history
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
        
        // Try to sync with cloud
        await this.syncToCloud(history[entryIndex]);
      }
    } catch (error) {
      console.error('Error updating test results:', error);
    }
  }

  /**
   * Get test results for a prompt
   */
  async getTestResults(promptId: string): Promise<TestResult | null> {
    try {
      const history = await this.getLocalHistory();
      const entry = history.find(h => h.id === promptId);
      return entry?.testResults || null;
    } catch (error) {
      console.error('Error getting test results:', error);
      return null;
    }
  }

  /**
   * Clear local history
   */
  async clearHistory(): Promise<void> {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }

  /**
   * Export history as JSON
   */
  async exportHistory(): Promise<string> {
    try {
      const history = await this.getLocalHistory();
      return JSON.stringify(history, null, 2);
    } catch (error) {
      console.error('Error exporting history:', error);
      return '[]';
    }
  }

  /**
   * Import history from JSON
   */
  async importHistory(jsonData: string): Promise<void> {
    try {
      const history = JSON.parse(jsonData);
      
      // Validate structure
      if (!Array.isArray(history)) {
        throw new Error('Invalid history format');
      }
      
      // Save imported history
      localStorage.setItem(this.STORAGE_KEY, jsonData);
    } catch (error) {
      console.error('Error importing history:', error);
      throw error;
    }
  }

  /**
   * Sync a history entry to cloud storage (Supabase)
   */
  private async syncToCloud(entry: HistoryEntry): Promise<void> {
    try {
      // Check if Supabase is available
      if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return;
      }

      // In a real implementation, this would sync to Supabase
      // For now, we'll just log the attempt
      console.log('Would sync to cloud:', entry.id);
      
      // Example Supabase sync:
      // const { data, error } = await supabase
      //   .from('prompt_history')
      //   .upsert({
      //     id: entry.id,
      //     run_id: entry.runId,
      //     module_id: entry.moduleId,
      //     seven_d_config: entry.sevenDConfig,
      //     prompt: entry.prompt,
      //     test_results: entry.testResults,
      //     score: entry.score,
      //     verdict: entry.verdict,
      //     created_at: entry.timestamp.toISOString(),
      //     updated_at: new Date().toISOString()
      //   });
      
    } catch (error) {
      console.error('Error syncing to cloud:', error);
    }
  }

  /**
   * Calculate overall score from test results
   */
  private calculateScore(testResults: TestResult): number {
    const scores = testResults.scores;
    const total = scores.clarity + scores.execution + (100 - scores.ambiguity) + scores.business_fit;
    return Math.round(total / 4);
  }

  /**
   * Generate a hash for prompts
   */
  private generateHash(): string {
    return Math.random().toString(36).substring(2, 10);
  }

  /**
   * Get history statistics
   */
  async getHistoryStats(): Promise<{
    totalRuns: number;
    averageScore: number;
    topModules: Array<{ moduleId: number; count: number }>;
    recentActivity: Date[];
  }> {
    try {
      const history = await this.getLocalHistory();
      
      const totalRuns = history.length;
      const scores = history.filter(h => h.score).map(h => h.score!);
      const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      
      // Count modules
      const moduleCounts = history.reduce((acc, entry) => {
        acc[entry.moduleId] = (acc[entry.moduleId] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);
      
      const topModules = Object.entries(moduleCounts)
        .map(([moduleId, count]) => ({ moduleId: parseInt(moduleId), count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      
      const recentActivity = history
        .slice(0, 7)
        .map(h => h.timestamp);
      
      return {
        totalRuns,
        averageScore: Math.round(averageScore),
        topModules,
        recentActivity,
      };
    } catch (error) {
      console.error('Error getting history stats:', error);
      return {
        totalRuns: 0,
        averageScore: 0,
        topModules: [],
        recentActivity: [],
      };
    }
  }
}
