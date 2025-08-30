import { notFound } from "next/navigation";
import catalogData from "@/lib/modules.catalog.json";

interface ModulePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { slug } = await params;
  
  // Find module by slug
  const module = Object.values(catalogData.modules).find(
    (m: any) => m.slug === slug
  );

  if (!module) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">{module.title}</h1>
          <p className="text-lead-gray mb-8 text-lg">{module.summary}</p>
          
          <div className="glass-card p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Module Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-lead-gray">Difficulty:</span>
                <span className="ml-2 text-white">{module.difficulty}/5</span>
              </div>
              <div>
                <span className="text-lead-gray">Plan:</span>
                <span className="ml-2 text-white capitalize">{module.minPlan}</span>
              </div>
              <div>
                <span className="text-lead-gray">ID:</span>
                <span className="ml-2 text-white">{module.id}</span>
              </div>
              <div>
                <span className="text-lead-gray">Version:</span>
                <span className="ml-2 text-white">{module.version || '1.0'}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-2xl font-semibold mb-4">Vectors</h2>
            <div className="flex flex-wrap gap-2">
              {module.vectors.map((vector: string) => (
                <span
                  key={vector}
                  className="px-3 py-1 rounded-full text-sm font-medium border border-primary/30 bg-primary/10 text-primary"
                >
                  {vector}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return Object.values(catalogData.modules).map((module: any) => ({
    slug: module.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const module = Object.values(catalogData.modules).find(
    (m: any) => m.slug === slug
  );

  if (!module) {
    return {
      title: "Module Not Found",
    };
  }

  return {
    title: `${module.title} - PromptForge`,
    description: module.summary,
  };
}
