import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ModuleOverlay } from '@/components/modules/module-overlay'
import { getModule, getModules } from '@/lib/modules'
import { generateModuleJsonLd } from '@/lib/seo'

interface ModulePageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: ModulePageProps): Promise<Metadata> {
  const module = await getModule(params.id)
  
  if (!module) {
    return {
      title: 'Module Not Found',
      description: 'The requested module could not be found.',
    }
  }

  return {
    title: `${module.title} — PromptForge v3.1`,
    description: module.summary,
    keywords: [...module.vectors, 'prompt engineering', 'AI module', '7D parameters'],
    openGraph: {
      title: `${module.title} — PromptForge v3.1`,
      description: module.summary,
      url: `https://chatgpt-prompting.com/modules/${module.id}`,
      images: [
        {
          url: module.image || '/og-module-default.png',
          width: 1200,
          height: 630,
          alt: module.title,
        },
      ],
    },
    twitter: {
      title: `${module.title} — PromptForge v3.1`,
      description: module.summary,
      images: [module.image || '/og-module-default.png'],
    },
    alternates: {
      canonical: `https://chatgpt-prompting.com/modules/${module.id}`,
    },
  }
}

export async function generateStaticParams() {
  const modules = await getModules()
  return modules.map((module) => ({
    id: module.id,
  }))
}

export default async function ModulePage({ params }: ModulePageProps) {
  const module = await getModule(params.id)
  
  if (!module) {
    notFound()
  }

  const jsonLd = generateModuleJsonLd(module)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-[var(--bg)]">
        <div className="container-pro mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-[var(--fg-muted)]">
              <li>
                <a href="/modules" className="hover:text-[var(--brand)] transition-colors">
                  Modules
                </a>
              </li>
              <li className="text-[var(--fg-muted)]">/</li>
              <li className="text-[var(--fg-primary)] font-medium">{module.title}</li>
            </ol>
          </nav>

          {/* Module Overlay */}
          <ModuleOverlay module={module} />
        </div>
      </div>
    </>
  )
}
