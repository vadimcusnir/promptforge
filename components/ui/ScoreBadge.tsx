'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ScoreBadgeProps {
  score: number;
  status: 'PASS' | 'PARTIAL' | 'FAIL';
  className?: string;
}

export function ScoreBadge({ score, status, className }: ScoreBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'PASS':
        return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'PARTIAL':
        return 'text-gold-industrial border-gold-industrial/30 bg-gold-industrial/10';
      case 'FAIL':
        return 'text-red-400 border-red-400/30 bg-red-400/10';
      default:
        return 'text-lead-gray border-lead-gray/30';
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Badge variant="outline" className={cn('text-xs font-mono', getStatusColor())}>
        {score}/100
      </Badge>
      <Badge variant="outline" className={cn('text-xs', getStatusColor())}>
        {status}
      </Badge>
    </div>
  );
}
