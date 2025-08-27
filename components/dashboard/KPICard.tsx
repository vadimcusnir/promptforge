'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  description: string;
  status: 'success' | 'warning' | 'error';
  trend?: number[];
}

export function KPICard({ title, value, description, status, trend }: KPICardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'error':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case 'warning':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
      case 'error':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
    }
  };

  const getTrendIcon = (trend: number[]) => {
    if (trend.length < 2) return <Minus className="w-4 h-4 text-gray-400" />;
    
    const recent = trend.slice(-3);
    const avg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const previous = trend.slice(-6, -3);
    const prevAvg = previous.length > 0 ? previous.reduce((sum, val) => sum + val, 0) / previous.length : avg;
    
    if (avg > prevAvg) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (avg < prevAvg) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    } else {
      return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendText = (trend: number[]) => {
    if (trend.length < 2) return 'No trend data';
    
    const recent = trend.slice(-3);
    const avg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const previous = trend.slice(-6, -3);
    const prevAvg = previous.length > 0 ? previous.reduce((sum, val) => sum + val, 0) / previous.length : avg;
    
    if (avg > prevAvg) {
      return 'Trending up';
    } else if (avg < prevAvg) {
      return 'Trending down';
    } else {
      return 'Stable';
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {getStatusIcon(status)}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        
        {trend && trend.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            {getTrendIcon(trend)}
            <span className="text-xs text-muted-foreground">
              {getTrendText(trend)}
            </span>
          </div>
        )}
        
        <div className="absolute top-2 right-2">
          <Badge 
            variant="outline" 
            className={`text-xs ${getStatusColor(status)}`}
          >
            {status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
