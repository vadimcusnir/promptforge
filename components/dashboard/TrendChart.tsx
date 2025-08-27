'use client';

import { useMemo } from 'react';

interface TrendChartProps {
  data: number[];
  labels: string[];
  title: string;
  color: 'green' | 'blue' | 'purple' | 'red' | 'yellow';
}

export function TrendChart({ data, labels, title, color }: TrendChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;
    
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;
    
    return data.map((value, index) => ({
      value,
      normalizedValue: range > 0 ? ((value - minValue) / range) * 100 : 50,
      label: labels[index] || `Day ${index + 1}`,
      date: labels[index] ? new Date(labels[index]).toLocaleDateString() : `Day ${index + 1}`
    }));
  }, [data, labels]);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'blue':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'purple':
        return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20';
      case 'red':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'yellow':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getLineColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'stroke-green-500';
      case 'blue':
        return 'stroke-blue-500';
      case 'purple':
        return 'stroke-purple-500';
      case 'red':
        return 'stroke-red-500';
      case 'yellow':
        return 'stroke-yellow-500';
      default:
        return 'stroke-gray-500';
    }
  };

  const getFillColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'fill-green-500/20';
      case 'blue':
        return 'fill-blue-500/20';
      case 'purple':
        return 'fill-purple-500/20';
      case 'red':
        return 'fill-red-500/20';
      case 'yellow':
        return 'fill-yellow-500/20';
      default:
        return 'fill-gray-500/20';
    }
  };

  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  if (chartData.length === 1) {
    return (
      <div className="h-32 flex items-center justify-center text-muted-foreground">
        Insufficient data for trend analysis
      </div>
    );
  }

  // Generate SVG path for the line chart
  const generatePath = () => {
    const width = 400;
    const height = 120;
    const padding = 20;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    const points = chartData.map((item, index) => {
      const x = padding + (index / (chartData.length - 1)) * chartWidth;
      const y = padding + chartHeight - (item.normalizedValue / 100) * chartHeight;
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  // Generate area fill path
  const generateAreaPath = () => {
    const width = 400;
    const height = 120;
    const padding = 20;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    const points = chartData.map((item, index) => {
      const x = padding + (index / (chartData.length - 1)) * chartWidth;
      const y = padding + chartHeight - (item.normalizedValue / 100) * chartHeight;
      return `${x},${y}`;
    });
    
    const bottomRight = `${padding + chartWidth},${padding + chartHeight}`;
    const bottomLeft = `${padding},${padding + chartHeight}`;
    
    return `M ${points.join(' L ')} L ${bottomRight} L ${bottomLeft} Z`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        <div className={`px-2 py-1 rounded text-xs ${getColorClasses(color)}`}>
          {chartData.length} data points
        </div>
      </div>
      
      <div className="relative">
        <svg
          width="100%"
          height="120"
          viewBox="0 0 400 120"
          className="w-full h-32"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-200 dark:text-gray-800" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Area fill */}
          <path
            d={generateAreaPath()}
            className={getFillColor(color)}
          />
          
          {/* Line */}
          <path
            d={generatePath()}
            fill="none"
            strokeWidth="2"
            className={getLineColor(color)}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {chartData.map((item, index) => {
            const width = 400;
            const height = 120;
            const padding = 20;
            const chartWidth = width - 2 * padding;
            const chartHeight = height - 2 * padding;
            
            const x = padding + (index / (chartData.length - 1)) * chartWidth;
            const y = padding + chartHeight - (item.normalizedValue / 100) * chartHeight;
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                className={`fill-white stroke-2 ${getLineColor(color)}`}
              />
            );
          })}
        </svg>
        
        {/* Tooltip on hover */}
        <div className="absolute inset-0 pointer-events-none">
          {chartData.map((item, index) => {
            const width = 400;
            const height = 120;
            const padding = 20;
            const chartWidth = width - 2 * padding;
            const chartHeight = height - 2 * padding;
            
            const x = padding + (index / (chartData.length - 1)) * chartWidth;
            const y = padding + chartHeight - (item.normalizedValue / 100) * chartHeight;
            
            return (
              <div
                key={index}
                className="absolute w-2 h-2 -ml-1 -mt-1"
                style={{
                  left: `${(x / 400) * 100}%`,
                  top: `${(y / 120) * 100}%`,
                }}
              >
                <div className="relative group">
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.date}: {item.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Summary stats */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Min: {Math.min(...data)}</span>
        <span>Avg: {(data.reduce((sum, val) => sum + val, 0) / data.length).toFixed(1)}</span>
        <span>Max: {Math.max(...data)}</span>
      </div>
    </div>
  );
}
