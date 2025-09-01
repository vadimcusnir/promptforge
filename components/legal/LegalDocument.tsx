import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { Metadata } from 'next'

interface LegalDocumentProps {
  title: string
  content: string
  lastUpdated: string
}

export function LegalDocument({ title, content, lastUpdated }: LegalDocumentProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
            <p className="text-slate-300">
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="prose prose-lg prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold text-white mb-6 mt-8 first:mt-0">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-semibold text-white mb-4 mt-6">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-medium text-white mb-3 mt-4">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-slate-200 mb-4 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="text-slate-200 mb-4 space-y-2">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="text-slate-200 mb-4 space-y-2">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-slate-200">
                      {children}
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="text-white font-semibold">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="text-slate-100 italic">
                      {children}
                    </em>
                  ),
                  code: ({ children }) => (
                    <code className="bg-slate-800 text-slate-100 px-2 py-1 rounded text-sm">
                      {children}
                    </code>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gold-500 pl-4 italic text-slate-200 my-4">
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a 
                      href={href} 
                      className="text-gold-400 hover:text-gold-300 underline transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-6">
                      <table className="min-w-full bg-slate-800/50 rounded-lg">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="px-4 py-3 text-left text-white font-semibold border-b border-slate-600">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-4 py-3 text-slate-200 border-b border-slate-700">
                      {children}
                    </td>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <p className="text-slate-400 text-sm">
              For questions about this document, please contact us at{' '}
              <a 
                href="mailto:legal@promptforge.cloud" 
                className="text-gold-400 hover:text-gold-300 transition-colors"
              >
                legal@promptforge.cloud
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
