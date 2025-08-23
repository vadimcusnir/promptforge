'use client';
import { Badge } from '@/components/ui/badge';
import { Clock, Zap, Target } from 'lucide-react';

interface TelemetryData {
  tta: number; // Time to Action in seconds
  iterations: number;
  [key: string]: any;
}

interface TelemetrySummaryProps {
  telemetry: TelemetryData;
}

export function TelemetrySummary({ telemetry }: TelemetrySummaryProps) {
  const formatTTA = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div>
      <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
        <Zap className="w-4 h-4" />
        Telemetry Summary
      </h4>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-lead-gray">
            <Clock className="w-3 h-3" />
            <span>TTA:</span>
          </div>
          <Badge
            variant="outline"
            className="text-xs text-gold-industrial border-gold-industrial/30"
          >
            {formatTTA(telemetry.tta)}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-lead-gray">
            <Target className="w-3 h-3" />
            <span>Iterations:</span>
          </div>
          <Badge variant="outline" className="text-xs text-blue-400 border-blue-400/30">
            {telemetry.iterations}
          </Badge>
        </div>

        <div className="pt-2 border-t border-lead-gray/20">
          <div className="text-xs text-lead-gray">
            Checksum:{' '}
            <code className="text-white font-mono">
              {Math.random().toString(36).substring(2, 10)}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
