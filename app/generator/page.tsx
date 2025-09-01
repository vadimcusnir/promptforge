import { Suspense } from 'react';

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
        {/* Generator Content - Coming Soon */}
        <div className="bg-pf-card rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-pf-text mb-4">
            Generator Coming Soon
          </h2>
          <p className="text-pf-text-muted mb-6">
            We're building an advanced 7-D prompt generator with 50+ specialized modules.
          </p>
          <div className="bg-pf-input rounded-lg p-4 text-left">
            <h3 className="font-medium text-pf-text mb-2">Features in Development:</h3>
            <ul className="text-pf-text-muted space-y-1">
              <li>• 7-Dimensional prompt framework</li>
              <li>• 50+ specialized modules</li>
              <li>• Real-time validation & scoring</li>
              <li>• Export in multiple formats</li>
              <li>• Plan-based access control</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
