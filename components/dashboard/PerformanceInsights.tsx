'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface PerformanceInsight {
  type: 'performance' | 'quality' | 'efficiency';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  recommendation: string;
}

interface PerformanceInsightsProps {
  insights: PerformanceInsight[];
}

export function PerformanceInsights({ insights }: PerformanceInsightsProps) {
  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Performance Insights
          </CardTitle>
          <CardDescription>
            AI-powered recommendations to optimize your prompt engineering performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 text-yellow-200" />
            <p className="text-lg font-medium">No Insights Available</p>
            <p className="text-sm">All metrics are performing well within thresholds.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'performance':
        return <Activity className="h-4 w-4" />;
      case 'quality':
        return <TrendingUp className="h-4 w-4" />;
      case 'efficiency':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'performance':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'quality':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'efficiency':
        return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'low':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'performance':
        return 'Performance';
      case 'quality':
        return 'Quality';
      case 'efficiency':
        return 'Efficiency';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Group insights by type
  const groupedInsights = insights.reduce((acc, insight) => {
    if (!acc[insight.type]) {
      acc[insight.type] = [];
    }
    acc[insight.type].push(insight);
    return acc;
  }, {} as Record<string, PerformanceInsight[]>);

  // Sort insights by impact (high first)
  const sortedInsights = Object.entries(groupedInsights).map(([type, typeInsights]) => ({
    type,
    insights: typeInsights.sort((a, b) => {
      const impactOrder = { high: 3, medium: 2, low: 1 };
      return impactOrder[b.impact] - impactOrder[a.impact];
    })
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-6 w-6 text-yellow-500" />
        <h2 className="text-2xl font-bold">Performance Insights</h2>
        <Badge variant="outline" className="ml-auto">
          {insights.length} recommendations
        </Badge>
      </div>

      {sortedInsights.map(({ type, insights: typeInsights }) => (
        <Card key={type}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getTypeIcon(type)}
              {getTypeName(type)} Insights
              <Badge variant="outline" className={getTypeColor(type)}>
                {typeInsights.length}
              </Badge>
            </CardTitle>
            <CardDescription>
              Recommendations to improve {type.toLowerCase()} metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {typeInsights.map((insight, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-lg">{insight.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{getImpactIcon(insight.impact)}</span>
                      <Badge variant="outline" className={getImpactColor(insight.impact)}>
                        {insight.impact} impact
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-3">
                    {insight.description}
                  </p>
                  
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-blue-900 dark:text-blue-100">
                          Recommendation:
                        </p>
                        <p className="text-blue-800 dark:text-blue-200 text-sm">
                          {insight.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Ready to Optimize?</h3>
            <p className="text-muted-foreground mb-4">
              These insights are based on your actual performance data and can help you:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 justify-center">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span>Improve response times</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Activity className="h-4 w-4 text-blue-600" />
                <span>Enhance quality scores</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Lightbulb className="h-4 w-4 text-yellow-600" />
                <span>Optimize efficiency</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
