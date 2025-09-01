"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { FilterBar } from '@/components/modules/filter-bar';
import { ModuleCard } from '@/components/modules/module-card';
import { ModuleOverlay } from '@/components/modules/ModuleOverlay';
import { Module, PlanType } from '@/lib/modules';
import { useDebounce } from '@/hooks/use-debounce';

interface ModulesCatalogClientProps {
  initialData: any;
}

export function ModulesCatalogClient({ initialData }: ModulesCatalogClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVectors, setSelectedVectors] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<number[]>([]);
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  
  const userPlan: PlanType = 'FREE';
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  
  const filteredModules = useMemo(() => {
    let filtered = initialData.data.modules;
    
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter((module: Module) =>
        module.title.toLowerCase().includes(searchLower) ||
        module.summary.toLowerCase().includes(searchLower) ||
        module.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    if (selectedVectors.length > 0) {
      filtered = filtered.filter((module: Module) =>
        selectedVectors.some(vector => module.vectors.includes(vector))
      );
    }
    
    if (selectedDifficulties.length > 0) {
      filtered = filtered.filter((module: Module) =>
        selectedDifficulties.includes(module.difficulty)
      );
    }
    
    if (selectedPlans.length > 0) {
      const planHierarchy = { FREE: 0, CREATOR: 1, PRO: 2, ENTERPRISE: 3 };
      filtered = filtered.filter((module: Module) => {
        const modulePlanLevel = planHierarchy[module.minPlan as keyof typeof planHierarchy] || 0;
        return selectedPlans.some(plan => {
          const userPlanLevel = planHierarchy[plan as keyof typeof planHierarchy] || 0;
          return userPlanLevel >= modulePlanLevel;
        });
      });
    }
    
    return filtered;
  }, [initialData.data.modules, debouncedSearchTerm, selectedVectors, selectedDifficulties, selectedPlans]);
  
  const logFilterChange = useCallback(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'filter_change', {
        search_term: debouncedSearchTerm,
        vectors: selectedVectors,
        difficulty: selectedDifficulties,
        plan: selectedPlans,
        results_count: filteredModules.length
      });
    }
  }, [debouncedSearchTerm, selectedVectors, selectedDifficulties, selectedPlans, filteredModules.length]);
  
  React.useEffect(() => {
    logFilterChange();
  }, [logFilterChange]);
  
  const handleVectorToggle = useCallback((vector: string) => {
    setSelectedVectors(prev => 
      prev.includes(vector) 
        ? prev.filter(v => v !== vector)
        : [...prev, vector]
    );
  }, []);
  
  const handleDifficultyToggle = useCallback((difficulty: number) => {
    setSelectedDifficulties(prev => 
      prev.includes(difficulty) 
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  }, []);
  
  const handlePlanToggle = useCallback((plan: string) => {
    setSelectedPlans(prev => 
      prev.includes(plan) 
        ? prev.filter(p => p !== plan)
        : [...prev, plan]
    );
  }, []);
  
  const handleViewModule = useCallback((module: Module) => {
    setSelectedModule(module);
    setIsOverlayOpen(true);
  }, []);
  
  const handleSimulateModule = useCallback((module: Module) => {
    console.log('Simulating module:', module.id);
  }, []);
  
  const handleCloseOverlay = useCallback(() => {
    setIsOverlayOpen(false);
    setSelectedModule(null);
  }, []);
  
  if (!initialData.success) {
    return (
      <div className="text-center py-12">
        <div className="text-pf-text-muted mb-4">
          Failed to load modules. Please try again later.
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-pf-gold text-black px-6 py-3 rounded-md hover:bg-pf-gold-dark transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedVectors={selectedVectors}
        onVectorToggle={handleVectorToggle}
        selectedDifficulties={selectedDifficulties}
        onDifficultyToggle={handleDifficultyToggle}
        selectedPlans={selectedPlans}
        onPlanToggle={handlePlanToggle}
        userPlan={userPlan}
      />
      
      <div className="flex items-center justify-between">
        <div className="text-pf-text-muted">
          Showing {filteredModules.length} of {initialData.data.total} modules
        </div>
        <div className="text-xs text-pf-text-muted">
          Catalog v{initialData.data.catalogVersion}
        </div>
      </div>
      
      {filteredModules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module: Module) => (
            <ModuleCard
              key={module.id}
              module={module}
              userPlan={userPlan}
              onView={handleViewModule}
              onSimulate={handleSimulateModule}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-pf-text-muted mb-4">
            No modules found matching your criteria.
          </div>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedVectors([]);
              setSelectedDifficulties([]);
              setSelectedPlans([]);
            }}
            className="bg-pf-card border border-pf-border text-pf-text px-6 py-3 rounded-md hover:bg-pf-input transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
      
      {selectedModule && (
        <ModuleOverlay
          module={selectedModule}
          isOpen={isOverlayOpen}
          onClose={handleCloseOverlay}
          userPlan={userPlan}
        />
      )}
    </div>
  );
}
