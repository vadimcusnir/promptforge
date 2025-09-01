"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModuleCard } from "./module-card";
import { allModules, searchModules, Module } from "@/lib/modules";
import { Search, Filter, Grid, List } from "lucide-react";

// Define vectors mapping for the new module system
const VECTORS = {
  'strategic': { id: 'strategic', name: 'Strategic', description: 'Strategic planning and positioning', color: '#3B82F6' },
  'rhetoric': { id: 'rhetoric', name: 'Rhetoric', description: 'Persuasive communication and argumentation', color: '#10B981' },
  'content': { id: 'content', name: 'Content', description: 'Content creation and management', color: '#F59E0B' },
  'analytics': { id: 'analytics', name: 'Analytics', description: 'Data analysis and insights', color: '#EF4444' },
  'branding': { id: 'branding', name: 'Branding', description: 'Brand development and management', color: '#8B5CF6' },
  'crisis': { id: 'crisis', name: 'Crisis', description: 'Crisis management and response', color: '#EC4899' },
  'cognitive': { id: 'cognitive', name: 'Cognitive', description: 'Cognitive enhancement and learning', color: '#06B6D4' },
};

interface ModuleGridProps {
  selectedModule?: string | null;
  onSelectModule?: (moduleId: string) => void;
  vectorFilter?: string;
  onVectorFilterChange?: (vector: string) => void;
  selectedVector?: string;
  searchQuery?: string;
}

export function ModuleGrid({
  selectedModule,
  onSelectModule,
  vectorFilter,
  onVectorFilterChange,
  selectedVector,
  searchQuery: externalSearchQuery,
}: ModuleGridProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showDetails, setShowDetails] = useState<string | null>(null);
  
  // Use external props if provided, otherwise use internal state
  const searchQuery = externalSearchQuery ?? internalSearchQuery;
  const effectiveVectorFilter = selectedVector ?? vectorFilter;

  const filteredModules = useMemo(() => {
    let modules = allModules;

    // Apply search filter
    if (searchQuery.trim()) {
      modules = modules.filter(module => 
        module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply vector filter
    if (effectiveVectorFilter && effectiveVectorFilter !== 'all') {
      modules = modules.filter(module => 
        module.vectors.includes(effectiveVectorFilter)
      );
    }

    return modules.sort((a, b) => a.id.localeCompare(b.id));
  }, [searchQuery, effectiveVectorFilter]);

  const modulesByVector = useMemo(() => {
    const grouped: Record<string, Module[]> = {};

    Object.entries(VECTORS).forEach(([key, vector]) => {
      grouped[key] = filteredModules.filter((module) =>
        module.vectors.includes(key)
      );
    });

    return grouped;
  }, [filteredModules]);

  const handleViewDetails = (moduleId: string) => {
    setShowDetails(showDetails === moduleId ? null : moduleId);
  };

  return (
    <div className="space-y-6">
      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search modules..."
            value={searchQuery}
            onChange={(e) => {
              if (externalSearchQuery !== undefined) {
                // External search is controlled by parent
                return;
              }
              setInternalSearchQuery(e.target.value);
            }}
            className="pl-10 glass-effect"
          />
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="glass-effect">
            {filteredModules.length} modules
          </Badge>

          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant={viewMode === "grid" ? "default" : "outline"}
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="glass-effect grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="all" className="text-xs">
            All ({filteredModules.length})
          </TabsTrigger>
          {Object.entries(VECTORS).map(([key, vector]) => {
            const count = modulesByVector[key]?.length || 0;
            return (
              <TabsTrigger key={key} value={key} className="text-xs">
                {vector.name} ({count})
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* All Modules Tab */}
        <TabsContent value="all" className="mt-6">
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-3"
            }
          >
            {filteredModules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                isSelected={selectedModule === module.id}
                onSelect={onSelectModule || (() => {})}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </TabsContent>

        {/* Vector-specific Tabs */}
        {Object.entries(VECTORS).map(([key, vector]) => (
          <TabsContent key={key} value={key} className="mt-6">
            <div
              className="mb-4 p-4 glass-strong rounded-lg border-l-4"
              style={{ borderLeftColor: vector.color }}
            >
              <h3 className="text-lg font-bold text-foreground mb-2">
                {vector.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {vector.description}
              </p>
            </div>

            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-3"
              }
            >
              {modulesByVector[key]?.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  isSelected={selectedModule === module.id}
                  onSelect={onSelectModule || (() => {})}
                  onViewDetails={handleViewDetails}
                  vectorColor={vector.color}
                />
              )) || (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No modules found in this vector.</p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {filteredModules.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No modules found for the selected criteria.</p>
          <Button
            variant="outline"
            onClick={() => {
              if (externalSearchQuery === undefined) {
                setInternalSearchQuery("");
              }
              if (onVectorFilterChange) {
                onVectorFilterChange("all");
              }
            }}
            className="mt-4"
          >
            Reset filters
          </Button>
        </div>
      )}
    </div>
  );
}
