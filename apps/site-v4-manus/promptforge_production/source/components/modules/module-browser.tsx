'use client';

import { useState, useMemo, useCallback } from 'react';
import { FilterBar } from './filter-bar';
import { ModuleCard } from './module-card';
import { Module, VectorType, DifficultyType, PlanType } from '@/lib/modules';
import { useTelemetry } from '@/hooks/use-telemetry';

interface ModuleBrowserProps {
  initialModules: Module[];
}

interface Filters {
  query: string;
  vectors: VectorType[];
  difficulty: DifficultyType | '';
  plan: PlanType | '';
}

export function ModuleBrowser({ initialModules }: ModuleBrowserProps) {
  const [filters, setFilters] = useState<Filters>({
    query: '',
    vectors: [],
    difficulty: '',
    plan: ''
  });
  
  const { track } = useTelemetry();

  // Filter modules based on current filters
  const filteredModules = useMemo(() => {
    return initialModules.filter(module => {
      // Text search
      const matchesQuery = filters.query === '' || 
        module.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        module.summary.toLowerCase().includes(filters.query.toLowerCase()) ||
        module.tags.some(tag => tag.toLowerCase().includes(filters.query.toLowerCase()));
      
      // Vector filter
      const matchesVectors = filters.vectors.length === 0 ||
        filters.vectors.some(vector => module.vectors.includes(vector));
      
      // Difficulty filter
      const matchesDifficulty = filters.difficulty === '' || 
        module.difficulty === filters.difficulty;
      
      // Plan filter
      const matchesPlan = filters.plan === '' || 
        module.minPlan === filters.plan;
      
      return matchesQuery && matchesVectors && matchesDifficulty && matchesPlan;
    });
  }, [initialModules, filters]);

  // Handle filter changes with telemetry
  const handleFilterChange = useCallback((newFilters: Partial<Filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    // Track filter changes
    track('filter_change', {
      q: updatedFilters.query,
      vectors: updatedFilters.vectors,
      difficulty: updatedFilters.difficulty,
      plan: updatedFilters.plan,
      results_count: filteredModules.length
    });
  }, [filters, filteredModules.length, track]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      query: '',
      vectors: [],
      difficulty: '',
      plan: ''
    });
    
    track('filter_clear', {
      previous_filters: filters
    });
  }, [filters, track]);

  return (
    <div className="space-y-8">
      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={clearFilters}
        resultsCount={filteredModules.length}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-[var(--fg-muted)]">
          {filteredModules.length} of {initialModules.length} modules
        </p>
        {filters.query || filters.vectors.length > 0 || filters.difficulty || filters.plan ? (
          <button
            onClick={clearFilters}
            className="text-sm text-[var(--brand)] hover:opacity-80 transition-opacity"
          >
            Clear all filters
          </button>
        ) : null}
      </div>

      {/* Empty State */}
      {filteredModules.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-[var(--border)] rounded-full flex items-center justify-center">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-xl font-semibold text-[var(--fg-primary)] mb-2">
            No modules found
          </h3>
          <p className="text-[var(--fg-muted)] mb-4">
            Try adjusting your filters or search terms
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-[var(--brand)] text-[var(--bg)] rounded-lg hover:opacity-90 transition-opacity"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Modules Grid */}
      {filteredModules.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      )}
    </div>
  );
}
