import { Skeleton } from "@/components/ui/skeleton"

export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Skeleton */}
        <div className="text-center mb-16">
          <Skeleton className="h-16 w-96 mx-auto mb-6 bg-slate-800" />
          <Skeleton className="h-6 w-[600px] mx-auto bg-slate-800" />
        </div>

        {/* Stats Bar Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 text-center backdrop-blur-sm"
            >
              <Skeleton className="h-8 w-16 mx-auto mb-2 bg-slate-800" />
              <Skeleton className="h-4 w-24 mx-auto bg-slate-800" />
            </div>
          ))}
        </div>

        {/* Filters Skeleton */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 mb-12 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton className="h-10 flex-1 bg-slate-800" />
            <Skeleton className="h-10 w-48 bg-slate-800" />
            <Skeleton className="h-10 w-48 bg-slate-800" />
          </div>
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-6 w-20 bg-slate-800" />
                  <Skeleton className="h-6 w-12 bg-slate-800" />
                </div>
                <Skeleton className="h-8 w-48 bg-slate-800" />
                <Skeleton className="h-4 w-full bg-slate-800" />
                <Skeleton className="h-4 w-3/4 bg-slate-800" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-12 bg-slate-800" />
                  <Skeleton className="h-6 w-12 bg-slate-800" />
                  <Skeleton className="h-6 w-12 bg-slate-800" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-16 bg-slate-800" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20 bg-slate-800" />
                    <Skeleton className="h-8 w-20 bg-slate-800" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
