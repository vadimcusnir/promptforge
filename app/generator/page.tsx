import { Suspense } from 'react';
import { ModuleBrowser } from '@/components/modules/module-browser';
import { ModuleGridSkeleton } from '@/components/modules/module-grid-skeleton';

export const revalidate = 60; // ISR with 60s revalidation

export default async function GeneratorPage() {
  return (
    <main className="min-h-screen bg-pf-black py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header - Single H1 for SEO */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-pf-text mb-4">
            Generator
          </h1>
          <p className="text-pf-text-muted text-lg">
            Generate industrial-grade prompts using our 7-D framework
          </p>
        </div>

        {/* Module Browser with SSR */}
        <Suspense fallback={<ModuleGridSkeleton />}>
          <ModuleBrowser />
        </Suspense>
      </div>
    </main>
  );
}
