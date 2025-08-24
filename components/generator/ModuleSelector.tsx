"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, Zap, Target, Users, Brain, Shield, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PromptModule } from "@/types/promptforge";
import { VECTORS } from "@/types/promptforge";

const VECTOR_ICONS = {
  1: <Brain className="w-4 h-4" />,
  2: <Target className="w-4 h-4" />,
  3: <Zap className="w-4 h-4" />,
  4: <Shield className="w-4 h-4" />,
  5: <TrendingUp className="w-4 h-4" />,
};

interface ModuleSelectorProps {
  selectedModule: PromptModule | null;
  onModuleSelect: (module: PromptModule) => void;
  modules: PromptModule[];
}

export function ModuleSelector({ selectedModule, onModuleSelect, modules }: ModuleSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVector, setSelectedVector] = useState<string>("all");
  const [selectedComplexity, setSelectedComplexity] = useState<string>("all");

  const filteredModules = useMemo(() => {
    return modules.filter((module) => {
      const matchesSearch = module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           module.id.toString().toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesVector = selectedVector === "all" || 
                           (module.vector && module.vector.toString() === selectedVector);
      
      const complexity = getModuleComplexity(module);
      const matchesComplexity = selectedComplexity === "all" || complexity === selectedComplexity;
      
      return matchesSearch && matchesVector && matchesComplexity;
    });
  }, [modules, searchQuery, selectedVector, selectedComplexity]);

  const getModuleComplexity = (module: PromptModule): string => {
    // Use a default complexity if not available
    const complexity = 3; // Default to intermediate
    if (complexity <= 2) return "beginner";
    if (complexity <= 4) return "intermediate";
    return "advanced";
  };

  const getVectorNames = (vectorIds: number[]): string[] => {
    return vectorIds.map(id => {
      const vector = VECTORS[id as keyof typeof VECTORS];
      return vector?.name || `V${id}`;
    }).slice(0, 2);
  };

  const getComplexityColor = (complexity: string): string => {
    switch (complexity) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Module Library</span>
          <Badge variant="secondary">{modules.length} Modules</Badge>
        </CardTitle>
        <CardDescription>
          Search and select from our curated collection of prompt modules. Each module is designed for specific use cases and industries.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search modules by name, description, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedVector} onValueChange={setSelectedVector}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by vector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vectors</SelectItem>
              <SelectItem value="1">V1: Systems & Agents</SelectItem>
              <SelectItem value="2">V2: Marketing & Sales</SelectItem>
              <SelectItem value="3">V3: Content & Creative</SelectItem>
              <SelectItem value="4">V4: Operations & Process</SelectItem>
              <SelectItem value="5">V5: Research & Analysis</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
            <SelectTrigger className="w-full sm:w-48">
              <Zap className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by complexity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Complexities</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {filteredModules.map((module) => (
            <Card
              key={module.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedModule?.id === module.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => onModuleSelect(module)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{module.name}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {module.description}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {module.id}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      General
                    </span>
                  </div>
                  
                  {module.vector && (
                    <div className="flex items-center gap-2">
                      {VECTOR_ICONS[module.vector as keyof typeof VECTOR_ICONS] || <Brain className="w-4 h-4" />}
                      <span className="text-sm text-muted-foreground">
                        {VECTORS[module.vector as keyof typeof VECTORS]?.name || `V${module.vector}`}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className={getComplexityColor(getModuleComplexity(module))}
                    >
                      {getModuleComplexity(module)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Score: 3/5
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      General
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredModules.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No modules found</p>
            <p className="text-sm">Try adjusting your search criteria or filters</p>
          </div>
        )}

        {selectedModule && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Selected Module: {selectedModule.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-2">Requirements</h4>
                  <p className="text-sm text-muted-foreground">{selectedModule.requirements}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Specification</h4>
                  <p className="text-sm text-muted-foreground">{selectedModule.spec}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Expected Output</h4>
                  <p className="text-sm text-muted-foreground">{selectedModule.output}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">KPI</h4>
                  <p className="text-sm text-muted-foreground">{selectedModule.kpi}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Guardrails</h4>
                  <p className="text-sm text-muted-foreground">{selectedModule.guardrails}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
