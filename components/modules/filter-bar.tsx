"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, Command } from 'lucide-react';
import type { FilterState, PlanType } from '@/types/modules';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onClearFilters: () => void;
  availableVectors: string[];
  availableDifficulties: number[];
  availablePlans: PlanType[];
}

const DIFFICULTY_LABELS = {
  1: 'Beginner',
  2: 'Intermediate', 
  3: 'Advanced',
  4: 'Expert',
  5: 'Master'
};

const PLAN_LABELS = {
  FREE: 'Free',
  CREATOR: 'Creator',
  PRO: 'Pro',
  ENTERPRISE: 'Enterprise'
};

export function FilterBar({
  filters,
  onFilterChange,
  onClearFilters,
  availableVectors,
  availableDifficulties,
  availablePlans
}: FilterBarProps) {
  const [searchValue, setSearchValue] = useState(filters.search);
  const [showKeyboardShortcut, setShowKeyboardShortcut] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFilterChange({ search: searchValue });
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchValue, filters.search, onFilterChange]);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('module-search') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleVectorToggle = useCallback((vector: string) => {
    const newVectors = filters.vectors.includes(vector)
      ? filters.vectors.filter(v => v !== vector)
      : [...filters.vectors, vector];
    onFilterChange({ vectors: newVectors });
  }, [filters.vectors, onFilterChange]);

  const handleDifficultyChange = useCallback((difficulty: number) => {
    onFilterChange({ 
      difficulty: filters.difficulty === difficulty ? null : difficulty 
    });
  }, [filters.difficulty, onFilterChange]);

  const handlePlanChange = useCallback((plan: PlanType) => {
    onFilterChange({ 
      plan: filters.plan === plan ? 'all' : plan 
    });
  }, [filters.plan, onFilterChange]);

  const hasActiveFilters = filters.search || 
    filters.vectors.length > 0 || 
    filters.difficulty !== null || 
    filters.plan !== 'all';

  return (
    <Card className="bg-pf-surface border-pf-text-muted/30">
      <CardHeader>
        <CardTitle className="text-pf-text">Filters</CardTitle>
        <CardDescription className="text-pf-text-muted">
          Refine your search to find the perfect modules
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div>
          <label htmlFor="module-search" className="block text-sm font-medium text-pf-text mb-2">
            Search Modules
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pf-text-muted w-4 h-4" />
            <Input
              id="module-search"
              placeholder="Search modules..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 pr-20 bg-pf-surface border-pf-text-muted/30 text-pf-text focus:border-gold-industrial/50"
              onFocus={() => setShowKeyboardShortcut(true)}
              onBlur={() => setShowKeyboardShortcut(false)}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-xs text-pf-text-muted">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </div>
        </div>

        {/* 7 Vectors */}
        <div>
          <label className="block text-sm font-medium text-pf-text mb-2">
            7 Vectors
          </label>
          <div className="flex flex-wrap gap-2">
            {availableVectors.map((vector) => (
              <button
                key={vector}
                onClick={() => handleVectorToggle(vector)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filters.vectors.includes(vector)
                    ? 'bg-gold-industrial text-pf-black'
                    : 'border border-pf-text-muted/30 text-pf-text-muted hover:border-gold-industrial hover:text-pf-text'
                }`}
                aria-pressed={filters.vectors.includes(vector)}
              >
                {vector}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-pf-text mb-2">
            Difficulty Level
          </label>
          <div className="flex flex-wrap gap-2">
            {availableDifficulties.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => handleDifficultyChange(difficulty)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filters.difficulty === difficulty
                    ? 'bg-gold-industrial text-pf-black'
                    : 'border border-pf-text-muted/30 text-pf-text-muted hover:border-gold-industrial hover:text-pf-text'
                }`}
                aria-pressed={filters.difficulty === difficulty}
              >
                {DIFFICULTY_LABELS[difficulty as keyof typeof DIFFICULTY_LABELS]}
              </button>
            ))}
          </div>
        </div>

        {/* Plan */}
        <div>
          <label className="block text-sm font-medium text-pf-text mb-2">
            Plan Access
          </label>
          <div className="flex flex-wrap gap-2">
            {availablePlans.map((plan) => (
              <button
                key={plan}
                onClick={() => handlePlanChange(plan)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filters.plan === plan
                    ? 'bg-gold-industrial text-pf-black'
                    : 'border border-pf-text-muted/30 text-pf-text-muted hover:border-gold-industrial hover:text-pf-text'
                }`}
                aria-pressed={filters.plan === plan}
              >
                {PLAN_LABELS[plan]}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-4 border-t border-pf-text-muted/20">
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <Badge variant="secondary" className="bg-gold-industrial/20 text-gold-industrial">
                  Search: "{filters.search}"
                  <button
                    onClick={() => onFilterChange({ search: '' })}
                    className="ml-2 hover:text-pf-black"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.vectors.map(vector => (
                <Badge key={vector} variant="secondary" className="bg-gold-industrial/20 text-gold-industrial">
                  {vector}
                  <button
                    onClick={() => handleVectorToggle(vector)}
                    className="ml-2 hover:text-pf-black"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {filters.difficulty && (
                <Badge variant="secondary" className="bg-gold-industrial/20 text-gold-industrial">
                  {DIFFICULTY_LABELS[filters.difficulty as keyof typeof DIFFICULTY_LABELS]}
                  <button
                    onClick={() => onFilterChange({ difficulty: null })}
                    className="ml-2 hover:text-pf-black"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.plan !== 'all' && (
                <Badge variant="secondary" className="bg-gold-industrial/20 text-gold-industrial">
                  {PLAN_LABELS[filters.plan]}
                  <button
                    onClick={() => onFilterChange({ plan: 'all' })}
                    className="ml-2 hover:text-pf-black"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="border-pf-text-muted/30 text-pf-text-muted hover:border-gold-industrial hover:text-pf-text"
            >
              Clear All
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
