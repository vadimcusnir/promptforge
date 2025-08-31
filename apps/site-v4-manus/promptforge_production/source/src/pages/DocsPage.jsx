import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Book, Code, Zap, GitMerge, LifeBuoy, ChevronRight } from 'lucide-react';

const DocsPage = () => {
  const sidebarNav = [
    {
      title: 'Introduction',
      href: '/docs',
      icon: Book,
      items: [
        { title: 'Getting Started', href: '/docs/getting-started' },
        { title: 'Core Concepts', href: '/docs/core-concepts' },
      ],
    },
    {
      title: '7D Framework',
      href: '/docs/framework',
      icon: Zap,
      items: [
        { title: 'Overview', href: '/docs/framework/overview' },
        { title: 'Parameters', href: '/docs/framework/parameters' },
      ],
    },
    {
      title: 'API Reference',
      href: '/docs/api',
      icon: Code,
      items: [
        { title: 'Authentication', href: '/docs/api/authentication' },
        { title: 'Endpoints', href: '/docs/api/endpoints' },
        { title: 'Error Codes', href: '/docs/api/errors' },
      ],
    },
    {
      title: 'Integrations',
      href: '/docs/integrations',
      icon: GitMerge,
      items: [
        { title: 'Zapier', href: '/docs/integrations/zapier' },
        { title: 'Make.com', href: '/docs/integrations/make' },
      ],
    },
     {
      title: 'Support',
      href: '/docs/support',
      icon: LifeBuoy,
      items: [
        { title: 'FAQ', href: '/docs/support/faq' },
        { title: 'Contact Support', href: '/docs/support/contact' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <h1 className="text-4xl font-bold text-white">Documentation</h1>
            <p className="mt-2 text-lg text-gray-400">Your guide to mastering PromptForge™ v3.0.</p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <nav className="space-y-6">
              {sidebarNav.map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                    <section.icon className="w-4 h-4 mr-2" />
                    {section.title}
                  </h3>
                  <div className="mt-2 space-y-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.title}
                        to={item.href}
                        className="flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors"
                      >
                        {item.title}
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </aside>
          <main className="md:col-span-3">
            <div className="prose prose-invert max-w-none bg-gray-900/50 border border-gray-800 rounded-xl p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export const DocsIndex = () => (
  <div>
    <h2>Welcome to the PromptForge™ Documentation</h2>
    <p>This documentation will guide you through all the features of PromptForge™ v3.0. Whether you are a new user or an experienced prompt engineer, you will find valuable information here.</p>
    <h3>Getting Started</h3>
    <p>If you are new to PromptForge™, we recommend starting with the <Link to="/docs/getting-started">Getting Started</Link> guide. It provides a step-by-step walkthrough of the platform.</p>
    <h3>7D Framework</h3>
    <p>Learn about our powerful 7D Framework for prompt engineering. Understand the parameters and how to use them to create industrial-grade prompts.</p>
    <h3>API Reference</h3>
    <p>For developers, our API reference provides all the information you need to integrate PromptForge™ into your applications.</p>
  </div>
);

export default DocsPage;


