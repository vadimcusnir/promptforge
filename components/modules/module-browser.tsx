"use client";

import { useState, useEffect, useCallback } from 'react';
import { FilterBar } from './filter-bar';
import { ModuleGrid } from './module-grid';
import { ModuleOverlay } from './module-overlay';
import { useEntitlements } from '@/hooks/use-entitlements';
import { useAnalytics } from '@/hooks/use-analytics';
import type { Module, FilterState } from '@/types/modules';

export function ModuleBrowser() {
  const [modules, setModules] = useState<Module[]>([]);
  const [filteredModules, setFilteredModules] = useState<Module[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    vectors: [],
    difficulty: null,
    plan: 'all'
  });
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { plan, canUseGptTestReal, canExportFormat } = useEntitlements();
  const { track } = useAnalytics();

  // Fetch modules on mount
  useEffect(() => {
    fetchModules();
  }, []);

  // Apply filters when filters change
  useEffect(() => {
    applyFilters();
  }, [filters, modules]);

  const fetchModules = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/modules');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch modules');
      }
      
      setModules(data.data.modules);
      
      // Validate catalog size (must be exactly 50 modules)
      if (data.data.modules.length !== 50) {
        console.error(`Catalog validation failed: expected 50 modules, got ${data.data.modules.length}`);
        setError('Catalog validation failed. Please contact support.');
      }
      
    } catch (err) {
      console.error('Failed to fetch modules:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch modules');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...modules];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(module =>
        module.title.toLowerCase().includes(searchLower) ||
        module.summary.toLowerCase().includes(searchLower) ||
        module.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Vectors filter
    if (filters.vectors.length > 0) {
      filtered = filtered.filter(module =>
        filters.vectors.some(vector => module.vectors.includes(vector))
      );
    }

    // Difficulty filter
    if (filters.difficulty !== null) {
      filtered = filtered.filter(module => module.difficulty === filters.difficulty);
    }

    // Plan filter
    if (filters.plan !== 'all') {
      const planHierarchy = { free: 0, creator: 1, pro: 2, enterprise: 3 };
      const userPlanLevel = planHierarchy[filters.plan as keyof typeof planHierarchy] || 0;
      
      filtered = filtered.filter(module => {
        const modulePlanLevel = planHierarchy[module.minPlan as keyof typeof planHierarchy] || 0;
        return userPlanLevel >= modulePlanLevel;
      });
    }

    setFilteredModules(filtered);

    // Track filter change
    track('filter_change', {
      q: filters.search,
      vectors: filters.vectors,
      difficulty: filters.difficulty,
      plan: filters.plan,
      results_count: filtered.length
    });
  }, [filters, modules, track]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      vectors: [],
      difficulty: null,
      plan: 'all'
    });
  };

  const handleModuleSelect = (module: Module) => {
    setSelectedModule(module);
    setIsOverlayOpen(true);
    
    // Track module selection
    track('module_card_open', {
      module_id: module.id,
      module_title: module.title,
      user_plan: plan
    });
  };

  const handleOverlayClose = () => {
    setIsOverlayOpen(false);
    setSelectedModule(null);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-pf-text-muted mb-4">
          <p className="text-lg font-medium mb-2">Unable to load modules</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={fetchModules}
          className="px-4 py-2 bg-gold-industrial text-pf-black rounded hover:bg-gold-industrial-dark transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        availableVectors={['strategic', 'rhetoric', 'content', 'analytics', 'branding', 'crisis', 'cognitive']}
        availableDifficulties={[1, 2, 3, 4, 5]}
        availablePlans={['free', 'creator', 'pro', 'enterprise']}
      />

      {filteredModules.length === 0 && !isLoading ? (
        <div className="text-center py-12">
          <p className="text-pf-text-muted text-lg mb-4">
            No modules found for the current filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-gold-industrial text-pf-black rounded hover:bg-gold-industrial-dark transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <ModuleGrid
          modules={filteredModules}
          onModuleSelect={handleModuleSelect}
          userPlan={plan}
          canUseGptTestReal={canUseGptTestReal}
        />
      )}

      {selectedModule && (
        <ModuleOverlay
          module={selectedModule}
          isOpen={isOverlayOpen}
          onClose={handleOverlayClose}
          userPlan={plan}
          canUseGptTestReal={canUseGptTestReal}
          canExportFormat={canExportFormat}
        />
      )}
    </div>
  );
}
