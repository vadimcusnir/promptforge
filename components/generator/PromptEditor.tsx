'use client';

import { useState, useEffect } from 'react';
import { Copy, Edit3, Minimize2 } from 'lucide-react';
import type { GeneratedPrompt } from '@/types/promptforge';

interface PromptEditorProps {
  prompt: GeneratedPrompt | null;
  onPromptChange?: (prompt: GeneratedPrompt) => void;
}

const PROMPT_SECTIONS = [
  { key: 'role_goal', title: 'ROLE & GOAL', deletable: false },
  { key: 'context_7d', title: 'CONTEXT (7-D)', deletable: false },
  { key: 'output_spec', title: 'OUTPUT SPECIFICATION', deletable: false },
  { key: 'process', title: 'PROCESS', deletable: false },
  { key: 'guardrails', title: 'GUARDRAILS', deletable: false },
  { key: 'eval_hooks', title: 'EVALUATION HOOKS', deletable: false },
  { key: 'telemetry_keys', title: 'TELEMETRY KEYS', deletable: false },
];

export function PromptEditor({ prompt, onPromptChange }: PromptEditorProps) {
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    if (prompt) {
      setEditedContent(prompt.content);
    }
  }, [prompt]);

  const handleCopy = async () => {
    if (prompt?.content) {
      await navigator.clipboard.writeText(prompt.content);
      console.log('[v0] Prompt copied to clipboard');
    }
  };

  const handleTighten = () => {
    if (!prompt) return;

    const tightened = editedContent.replace(/\n\n+/g, '\n\n').replace(/\s+/g, ' ').trim();

    setEditedContent(tightened);
    console.log('[v0] Reducing ambiguity...');
  };

  const parseSections = (content: string) => {
    const sections: Record<string, string> = {};
    const lines = content.split('\n');
    let currentSection = '';
    let currentContent: string[] = [];

    for (const line of lines) {
      if (line.startsWith('# ')) {
        if (currentSection) {
          sections[currentSection] = currentContent.join('\n').trim();
        }
        currentSection = line
          .substring(2)
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '_');
        currentContent = [];
      } else {
        currentContent.push(line);
      }
    }

    if (currentSection) {
      sections[currentSection] = currentContent.join('\n').trim();
    }

    return sections;
  };

  if (!prompt) {
    return (
      <div
        id="prompt-editor"
        className="h-96 border-2 border-dashed border-lead-gray/30 rounded-lg flex items-center justify-center"
      >
        <div className="text-center text-lead-gray">
          <Edit3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No prompt generated yet</p>
          <p className="text-sm">Select a module and click Generate Prompt to start</p>
        </div>
      </div>
    );
  }

  const sections = parseSections(editedContent);

  return (
    <div id="prompt-editor" className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-2 bg-lead-gray/20 hover:bg-lead-gray/30 rounded-lg text-sm flex items-center gap-2 transition-colors"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
          <button
            onClick={handleTighten}
            className="px-3 py-2 bg-lead-gray/20 hover:bg-lead-gray/30 rounded-lg text-sm flex items-center gap-2 transition-colors"
          >
            <Minimize2 className="w-4 h-4" />
            Tighten
          </button>
        </div>
        <div className="text-xs text-lead-gray">
          {prompt.tokens} tokens • {prompt.tta.toFixed(2)}s TTA
        </div>
      </div>

      <div className="space-y-4">
        {PROMPT_SECTIONS.map(section => {
          const content = sections[section.key] || '';
          return (
            <div key={section.key} className="border border-lead-gray/20 rounded-lg">
              <div className="flex items-center justify-between p-3 bg-lead-gray/5 border-b border-lead-gray/20">
                <h3 className="font-medium text-sm">{section.title}</h3>
                <div className="flex items-center gap-2">
                  {!section.deletable && (
                    <span className="text-xs text-lead-gray bg-lead-gray/20 px-2 py-1 rounded">
                      Required
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <textarea
                  value={content}
                  onChange={e => {
                    const newSections = {
                      ...sections,
                      [section.key]: e.target.value,
                    };
                    const newContent = PROMPT_SECTIONS.map(
                      s => `# ${s.title}\n${newSections[s.key] || ''}`
                    ).join('\n\n');
                    setEditedContent(newContent);
                  }}
                  className="w-full h-24 bg-transparent border-none resize-none focus:outline-none text-sm font-mono"
                  placeholder={`Enter ${section.title.toLowerCase()}...`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-black/30 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-lead-gray">ID:</span>
            <span className="ml-2 font-mono text-gold-industrial">{prompt.id}</span>
          </div>
          <div>
            <span className="text-lead-gray">Hash:</span>
            <span className="ml-2 font-mono text-gold-industrial">{prompt.hash}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
