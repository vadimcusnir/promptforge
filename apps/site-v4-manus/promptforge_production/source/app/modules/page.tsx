import type { Metadata } from 'next'
import { ModuleBrowser } from '@/components/modules/module-browser'
import { getModules } from '@/lib/modules'

export const metadata: Metadata = {
  title: 'Prompt Engineering Modules Library',
  description: '50 operational modules with 7D parameter optimization. From basic prompts to enterprise automation.',
  keywords: ['prompt engineering', 'AI modules', '7D parameters', 'enterprise automation', 'GPT optimization'],
  openGraph: {
    title: 'PromptForge v3.1 — Module Library',
    description: '50 operational modules with 7D parameter optimization',
    url: 'https://chatgpt-prompting.com/modules',
    images: [
      {
        url: '/og-modules.png',
        width: 1200,
        height: 630,
        alt: 'PromptForge v3.1 Module Library',
      },
    ],
  },
  twitter: {
    title: 'PromptForge v3.1 — Module Library',
    description: '50 operational modules with 7D parameter optimization',
    images: ['/og-modules.png'],
  },
  alternates: {
    canonical: 'https://chatgpt-prompting.com/modules',
  },
}

// ISR with 60 second revalidation
export const revalidate = 60

export default async function ModulesPage() {
  const modules = await getModules()
  
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="container-pro mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--fg-primary)] mb-4">
            Module Library
          </h1>
          <p className="text-xl text-[var(--fg-muted)] max-w-3xl mx-auto">
            Fifty operational modules with 7D parameter optimization. 
            From basic prompts to enterprise automation.
          </p>
        </div>

        {/* Module Browser */}
        <ModuleBrowser initialModules={modules} />
      </div>
    </div>
  )
}
