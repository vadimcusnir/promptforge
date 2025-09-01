import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function ModuleGridSkeleton() {
  return (
    <div className="space-y-8">
      {/* Filter Bar Skeleton */}
      <Card className="bg-pf-surface border-pf-text-muted/30">
        <CardHeader>
          <div className="h-6 bg-pf-text-muted/20 rounded animate-pulse w-32"></div>
          <div className="h-4 bg-pf-text-muted/20 rounded animate-pulse w-64"></div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Skeleton */}
          <div className="h-10 bg-pf-text-muted/20 rounded animate-pulse"></div>
          
          {/* Vectors Skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-pf-text-muted/20 rounded animate-pulse w-24"></div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-8 w-20 bg-pf-text-muted/20 rounded-full animate-pulse"></div>
              ))}
            </div>
          </div>
          
          {/* Difficulty Skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-pf-text-muted/20 rounded animate-pulse w-20"></div>
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 w-16 bg-pf-text-muted/20 rounded-full animate-pulse"></div>
              ))}
            </div>
          </div>
          
          {/* Plan Skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-pf-text-muted/20 rounded animate-pulse w-16"></div>
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-8 w-20 bg-pf-text-muted/20 rounded-full animate-pulse"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Grid Skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="bg-pf-surface border-pf-text-muted/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="h-6 bg-pf-text-muted/20 rounded animate-pulse w-40"></div>
                <div className="h-6 w-12 bg-gold-industrial/20 rounded animate-pulse"></div>
              </div>
              <div className="h-4 bg-pf-text-muted/20 rounded animate-pulse w-full"></div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="h-3 bg-pf-text-muted/20 rounded animate-pulse w-16"></div>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="h-5 w-16 bg-pf-text-muted/20 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="h-3 bg-pf-text-muted/20 rounded animate-pulse w-20"></div>
                <div className="h-3 bg-pf-text-muted/20 rounded animate-pulse w-16"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
