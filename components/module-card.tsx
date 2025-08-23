'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VECTORS, type PromptModule } from '@/types/promptforge';
import { useState } from 'react';
import { Eye, Settings, Target, BarChart3 } from 'lucide-react';

interface ModuleCardProps {
  module: PromptModule;
  isSelected: boolean;
  onSelect: (moduleId: number) => void;
  onViewDetails: (moduleId: number) => void;
  vectorColor?: string;
}

export function ModuleCard({
  module,
  isSelected,
  onSelect,
  onViewDetails,
  vectorColor,
}: ModuleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const primaryVector = module.vectors[0];
  const defaultVectorColor = VECTORS[primaryVector as keyof typeof VECTORS]?.color || '#6b7280';
  const cardVectorColor = vectorColor || defaultVectorColor;

  return (
    <Card
      className={`glass-effect p-4 cursor-pointer transition-all duration-300 hover:glow-primary hover:shadow-lg border-l-4 ${
        isSelected ? 'ring-2 ring-primary glow-primary' : ''
      }`}
      style={{ borderLeftColor: cardVectorColor }}
      onClick={() => onSelect(module.id)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-bold">
            M{module.id.toString().padStart(2, '0')}
          </Badge>
          <div className="flex gap-1">
            {module.vectors.map(v => (
              <Badge
                key={v}
                variant="secondary"
                className="text-xs"
                style={{
                  color: VECTORS[v as keyof typeof VECTORS]?.color || '#6b7280',
                }}
              >
                V{v}
              </Badge>
            ))}
          </div>
        </div>
        {isSelected && (
          <Badge variant="default" className="text-xs animate-pulse-glow">
            Selected
          </Badge>
        )}
      </div>

      <h4 className="text-lg font-bold text-foreground mb-2 leading-tight break-words line-clamp-2">
        {module.name}
      </h4>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 break-words leading-relaxed">
        {module.description}
      </p>

      {isExpanded && (
        <div className="space-y-3 mb-4 p-3 glass-strong rounded-lg">
          <div className="break-words">
            <div className="flex items-center gap-2 mb-1">
              <Settings className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold text-foreground">⚙️ Specification</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-3 pl-6">{module.spec}</p>
          </div>

          <div className="break-words">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-green-400" />
              <span className="text-xs font-semibold text-foreground">📋 Expected Output</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 pl-6">{module.output}</p>
          </div>

          <div className="break-words">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-semibold text-foreground">🛡️ Guardrails</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 pl-6">{module.guardrails}</p>
          </div>
        </div>
      )}

      <div className="mb-4 p-2 glass-strong rounded">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-3 h-3 text-green-400" />
          <span className="text-xs font-semibold text-foreground">📊 KPI Target</span>
        </div>
        <p className="text-sm font-bold text-green-400 break-words line-clamp-1 pl-5">
          {module.kpi}
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="text-xs bg-transparent hover:bg-primary/10 flex-1"
          onClick={e => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          <Eye className="w-3 h-3 mr-1" />
          {isExpanded ? 'Minimize' : 'Details'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-xs bg-transparent hover:bg-accent/10 flex-1"
          onClick={e => {
            e.stopPropagation();
            onViewDetails(module.id);
          }}
        >
          <Settings className="w-3 h-3 mr-1" />
          Specs
        </Button>
      </div>
    </Card>
  );
}
