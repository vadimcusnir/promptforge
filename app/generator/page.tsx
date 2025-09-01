import { Suspense } from 'react';
import { GeneratorClient } from '@/components/generator/GeneratorClient';

export const revalidate = 60; // ISR with 60s revalidation

async function fetchModules() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://chatgpt-prompting.com';
    const response = await fetch(`${baseUrl}/api/modules`, {
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch modules: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching modules:', error);
    // Return empty data structure on error
    return {
      success: false,
      data: {
        modules: [],
        total: 0,
        catalogVersion: 'unknown',
        filters: {
          vectors: [],
          difficulties: [],
          plans: []
        }
      }
    };
  }
}

export default async function GeneratorPage() {
  const modulesData = await fetchModules();

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
        
        {/* Generator Content */}
        <Suspense fallback={
          <div className="space-y-8">
            <div className="bg-pf-card rounded-lg p-6 animate-pulse">
              <div className="h-12 bg-pf-input rounded-md"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-pf-card rounded-lg p-6 border border-pf-border animate-pulse">
                  <div className="h-4 bg-pf-input rounded mb-4"></div>
                  <div className="h-6 bg-pf-input rounded mb-2"></div>
                  <div className="h-16 bg-pf-input rounded mb-4"></div>
                  <div className="h-8 bg-pf-input rounded"></div>
                </div>
              ))}
            </div>
          </div>
        }>
          <GeneratorClient initialData={modulesData} />
        </Suspense>
      </div>
    </main>
  );
}
