'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

interface SLAAlert {
  type: 'warning' | 'critical';
  message: string;
  metric: string;
  current: number;
  threshold: number;
}

interface SLAAlertsProps {
  alerts: SLAAlert[];
}

export function SLAAlerts({ alerts }: SLAAlertsProps) {
  if (alerts.length === 0) {
    return (
      <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle>All Systems Operational</AlertTitle>
        <AlertDescription>
          All performance metrics are within SLA thresholds. Great job maintaining quality!
        </AlertDescription>
      </Alert>
    );
  }

  const criticalAlerts = alerts.filter(alert => alert.type === 'critical');
  const warningAlerts = alerts.filter(alert => alert.type === 'warning');

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'pass_rate':
        return '🎯';
      case 'p95_tta':
        return '⏱️';
      case 'p95_score':
        return '📊';
      default:
        return '📈';
    }
  };

  const getMetricName = (metric: string) => {
    switch (metric) {
      case 'pass_rate':
        return 'Pass Rate';
      case 'p95_tta':
        return 'P95 Response Time';
      case 'p95_score':
        return 'P95 Quality Score';
      default:
        return metric.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-4">
      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Critical SLA Violations ({criticalAlerts.length})
          </h3>
          {criticalAlerts.map((alert, index) => (
            <Alert key={index} variant="destructive" className="border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="text-red-800 dark:text-red-200">
                {getMetricName(alert.metric)} - Critical
              </AlertTitle>
              <AlertDescription className="text-red-700 dark:text-red-300">
                <div className="space-y-2">
                  <p>{alert.message}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Current:</span>
                      <Badge variant="outline" className={getStatusColor(alert.type)}>
                        {alert.current}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Threshold:</span>
                      <Badge variant="outline">
                        {alert.threshold}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Metric:</span>
                      <span className="text-lg">{getMetricIcon(alert.metric)}</span>
                    </div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Warning Alerts */}
      {warningAlerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Warning Alerts ({warningAlerts.length})
          </h3>
          {warningAlerts.map((alert, index) => (
            <Alert key={index} className="border-yellow-300 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800 dark:text-yellow-200">
                {getMetricName(alert.metric)} - Warning
              </AlertTitle>
              <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                <div className="space-y-2">
                  <p>{alert.message}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Current:</span>
                      <Badge variant="outline" className={getStatusColor(alert.type)}>
                        {alert.current}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Threshold:</span>
                      <Badge variant="outline">
                        {alert.threshold}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Metric:</span>
                      <span className="text-lg">{getMetricIcon(alert.metric)}</span>
                    </div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Summary */}
      {alerts.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Total Alerts:</span> {alerts.length}
              {criticalAlerts.length > 0 && (
                <span className="ml-4 text-red-600 dark:text-red-400">
                  <span className="font-medium">Critical:</span> {criticalAlerts.length}
                </span>
              )}
              {warningAlerts.length > 0 && (
                <span className="ml-4 text-yellow-600 dark:text-yellow-400">
                  <span className="font-medium">Warnings:</span> {warningAlerts.length}
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
