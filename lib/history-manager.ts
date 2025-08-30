// History manager for prompt history
import type { HistoryEntry, GeneratedPrompt, TestResult } from '@/types/promptforge';

export class HistoryManager {
  private history: HistoryEntry[] = [];
  
  addEntry(prompt: GeneratedPrompt, testResult?: TestResult): void {
    const entry: HistoryEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      prompt,
      testResult,
      timestamp: new Date(),
      tags: [],
    };
    
    this.history.unshift(entry);
    
    // Keep only last 100 entries
    if (this.history.length > 100) {
      this.history = this.history.slice(0, 100);
    }
  }
  
  getHistory(): HistoryEntry[] {
    return [...this.history];
  }
  
  getEntry(id: string): HistoryEntry | undefined {
    return this.history.find(entry => entry.id === id);
  }
  
  updateEntry(id: string, updates: Partial<HistoryEntry>): boolean {
    const index = this.history.findIndex(entry => entry.id === id);
    if (index === -1) return false;
    
    this.history[index] = { ...this.history[index], ...updates };
    return true;
  }
  
  deleteEntry(id: string): boolean {
    const index = this.history.findIndex(entry => entry.id === id);
    if (index === -1) return false;
    
    this.history.splice(index, 1);
    return true;
  }
  
  clearHistory(): void {
    this.history = [];
  }
  
  searchHistory(query: string): HistoryEntry[] {
    const lowercaseQuery = query.toLowerCase();
    return this.history.filter(entry => 
      entry.prompt.content.toLowerCase().includes(lowercaseQuery) ||
      entry.prompt.module.name.toLowerCase().includes(lowercaseQuery) ||
      entry.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }
}

export const historyManager = new HistoryManager();
