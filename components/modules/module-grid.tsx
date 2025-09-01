"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Lock } from 'lucide-react';
import type { Module, PlanType } from '@/types/modules';

interface ModuleGridProps {
  modules: Module[];
  onModuleSelect: (module: Module) => void;
  userPlan: PlanType;
  canUseGptTestReal: boolean;
}

const DIFFICULTY_COLORS = {
  1: 'bg-green-500/20 text-green-400 border-green-500/30',
  2: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  3: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  4: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  5: 'bg-red-500/20 text-red-400 border-red-500/30'
};

const PLAN_COLORS = {
  free: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  creator: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  pro: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  enterprise: 'bg-gold-industrial/20 text-gold-industrial border-gold-industrial/30'
};

export function ModuleGrid({ modules, onModuleSelect, userPlan, canUseGptTestReal }: ModuleGridProps) {
  const planHierarchy = { free: 0, creator: 1, pro: 2, enterprise: 3 };
  const userPlanLevel = planHierarchy[userPlan] || 0;

  const canAccessModule = (module: Module) => {
    const modulePlanLevel = planHierarchy[module.minPlan] || 0;
    return userPlanLevel >= modulePlanLevel;
  };

  const getDifficultyLabel = (difficulty: number) => {
    const labels = ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];
    return labels[difficulty - 1] || 'Unknown';
  };

  const getPlanLabel = (plan: PlanType) => {
    const labels = {
      free: 'Free',
      creator: 'Creator',
      pro: 'Pro',
      enterprise: 'Enterprise'
    };
    return labels[plan];
  };

  if (modules.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-pf-text-muted text-lg">
          No modules found for the current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.map((module) => {
        const isAccessible = canAccessModule(module);
        const isLocked = !isAccessible;
        
        return (
          <Card
            key={module.id}
            className={`bg-pf-surface border-pf-text-muted/30 transition-all duration-200 hover:border-gold-industrial/50 ${
              isLocked ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'
            }`}
            onClick={() => !isLocked && onModuleSelect(module)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-pf-text text-lg line-clamp-2">
                  {module.title}
                </CardTitle>
                <div className="flex flex-col items-end gap-2">
                  <Badge 
                    className={`${DIFFICULTY_COLORS[module.difficulty as keyof typeof DIFFICULTY_COLORS]} text-xs`}
                  >
                    {getDifficultyLabel(module.difficulty)}
                  </Badge>
                  <Badge 
                    className={`${PLAN_COLORS[module.minPlan]} text-xs`}
                  >
                    {getPlanLabel(module.minPlan)}
                  </Badge>
                </div>
              </div>
              <CardDescription className="text-pf-text-muted line-clamp-3">
                {module.summary}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Vectors */}
              <div>
                <span className="text-sm text-pf-text-muted">Vectors:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {module.vectors.slice(0, 3).map((vector) => (
                    <Badge 
                      key={vector} 
                      variant="outline" 
                      className="text-xs border-pf-text-muted/30 text-pf-text-muted"
                    >
                      {vector}
                    </Badge>
                  ))}
                  {module.vectors.length > 3 && (
                    <Badge variant="outline" className="text-xs border-pf-text-muted/30 text-pf-text-muted">
                      +{module.vectors.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Outputs */}
              <div>
                <span className="text-sm text-pf-text-muted">Outputs:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {module.outputs.map((output) => (
                    <Badge 
                      key={output} 
                      variant="outline" 
                      className="text-xs border-pf-text-muted/30 text-pf-text-muted"
                    >
                      {output}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {isLocked ? (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-pf-text-muted mb-2">
                      <Lock className="w-4 h-4" />
                      <span className="text-sm">Requires {getPlanLabel(module.minPlan)}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-pf-text-muted/30 text-pf-text-muted cursor-not-allowed"
                      disabled
                      title={`Requires ${getPlanLabel(module.minPlan)} plan. Try Simulate or upgrade.`}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Locked
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => onModuleSelect(module)}
                    className="w-full bg-gold-industrial text-pf-black hover:bg-gold-industrial-dark transition-colors"
                    size="sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Module
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
