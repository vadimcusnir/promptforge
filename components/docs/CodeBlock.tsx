'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
}

export function CodeBlock({ code, language, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="bg-[#2a2a2a] border border-[#5a5a5a]/30 rounded-md overflow-hidden">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a1a] border-b border-[#5a5a5a]/30">
          <h3 className="font-sans font-medium text-white text-sm">{title}</h3>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-[#d1a954] hover:text-[#d1a954]/80 transition-colors text-xs font-sans"
            aria-label="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy
              </>
            )}
          </button>
        </div>
      )}
      <div className="relative">
        {!title && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 flex items-center gap-1 text-[#d1a954] hover:text-[#d1a954]/80 transition-colors text-xs font-sans bg-[#1a1a1a]/80 px-2 py-1 rounded"
            aria-label="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy
              </>
            )}
          </button>
        )}
        <pre className="p-4 overflow-x-auto">
          <code className={`text-[#e0e0e0] font-mono text-sm ${language === 'bash' ? 'text-[#d1a954]' : ''}`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}
