'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { VectorType, DifficultyType, PlanType, VECTOR_ENUM } from '@/lib/modules';

interface FilterBarProps {
  filters: {
    query: string;
    vectors: VectorType[];
    difficulty: DifficultyType | '';
    plan: PlanType | '';
  };
  onFilterChange: (filters: Partial<FilterBarProps['filters']>) => void;
  onClear: () => void;
  resultsCount: number;
}

const VECTOR_LABELS: Record<VectorType, string> = {
  clarity: 'Clarity',
  context: 'Context',
  constraints: 'Constraints',
  creativity: 'Creativity',
  consistency: 'Consistency',
  compliance: 'Compliance',
  conversion: 'Conversion'
};

const PLAN_LABELS: Record<PlanType, string> = {
  FREE: 'Free',
  CREATOR: 'Creator',
  PRO: 'Pro',
  ENTERPRISE: 'Enterprise'
};

export function FilterBar({ filters, onFilterChange, onClear, resultsCount }: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState(filters.query);
  const [isExpanded, setIsExpanded] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== filters.query) {
        onFilterChange({ query: searchQuery });
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, filters.query, onFilterChange]);

  // Handle vector selection
  const toggleVector = useCallback((vector: VectorType) => {
    const newVectors = filters.vectors.includes(vector)
      ? filters.vectors.filter(v => v !== vector)
      : [...filters.vectors, vector];
    
    onFilterChange({ vectors: newVectors });
  }, [filters.vectors, onFilterChange]);

  // Handle difficulty change
  const handleDifficultyChange = useCallback((difficulty: DifficultyType | '') => {
    onFilterChange({ difficulty });
  }, [onFilterChange]);

  // Handle plan change
  const handlePlanChange = useCallback((plan: PlanType | '') => {
    onFilterChange({ plan });
  }, [onFilterChange]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('module-search');
        searchInput?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const hasActiveFilters = filters.query || filters.vectors.length > 0 || filters.difficulty || filters.plan;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[var(--fg-muted)]" />
        </div>
        <input
          id="module-search"
          type="text"
          placeholder="Search modules... (⌘K)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-[var(--border)] border border-[var(--border)] rounded-lg text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] transition-colors" />
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] transition-colors"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="px-2 py-1 text-xs bg-[var(--brand)] text-[var(--bg)] rounded-full">
              {filters.vectors.length + (filters.difficulty ? 1 : 0) + (filters.plan ? 1 : 0)}
            </span>
          )}
        </button>
        
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-sm text-[var(--brand)] hover:opacity-80 transition-opacity"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="space-y-6 p-4 bg-[var(--border)] rounded-lg border border-[var(--border)]">
          {/* Vectors */}
          <div>
            <h3 className="text-sm font-medium text-[var(--fg-primary)] mb-3">7D Vectors</h3>
            <div className="flex flex-wrap gap-2">
              {VECTOR_ENUM.options.map((vector) => (
                <button
                  key={vector}
                  onClick={() => toggleVector(vector)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                    filters.vectors.includes(vector)
                      ? 'bg-[var(--brand)] text-[var(--bg)] border-[var(--brand)]'
                      : 'bg-transparent text-[var(--fg-muted)] border-[var(--border)] hover:border-[var(--brand)] hover:text-[var(--brand)]'
                  }`}
                >
                  {VECTOR_LABELS[vector]}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <h3 className="text-sm font-medium text-[var(--fg-primary)] mb-3">Difficulty Level</h3>
            <div className="flex items-center space-x-4">
              <select
                value={filters.difficulty}
                onChange={(e) => handleDifficultyChange(e.target.value as DifficultyType | '')}
                className="px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--fg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
              >
                <option value="">All difficulties</option>
                <option value="1">1 - Beginner</option>
                <option value="2">2 - Easy</option>
                <option value="3">3 - Intermediate</option>
                <option value="4">4 - Advanced</option>
                <option value="5">5 - Expert</option>
              </select>
            </div>
          </div>

          {/* Plan */}
          <div>
            <h3 className="text-sm font-medium text-[var(--fg-primary)] mb-3">Required Plan</h3>
            <div className="flex items-center space-x-4">
              <select
                value={filters.plan}
                onChange={(e) => handlePlanChange(e.target.value as PlanType | '')}
                className="px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--fg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
              >
                <option value="">All plans</option>
                {Object.entries(PLAN_LABELS).map(([plan, label]) => (
                  <option key={plan} value={plan}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="text-sm text-[var(--fg-muted)]">
        {resultsCount} module{resultsCount !== 1 ? 's' : ''} found
      </div>
    </div>
  );
}
