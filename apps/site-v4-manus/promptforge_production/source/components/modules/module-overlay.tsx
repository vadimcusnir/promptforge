'use client';

import { useState } from 'react';
import { Module } from '@/lib/modules';
import { useTelemetry } from '@/hooks/use-telemetry';
import { useEntitlements } from '@/hooks/use-entitlements';
import { 
  Play, 
  Download, 
  Star, 
  Clock, 
  Shield, 
  Zap,
  Lock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface ModuleOverlayProps {
  module: Module;
}

type TabType = 'overview' | 'inputs' | 'outputs' | 'kpis' | 'guardrails';

const VECTOR_DESCRIPTIONS = {
  clarity: 'Clear, unambiguous instructions for optimal AI understanding',
  context: 'Relevant background information and situational details',
  constraints: 'Limitations, boundaries, and specific requirements',
  creativity: 'Innovative approaches and creative problem-solving',
  consistency: 'Uniform output style and formatting standards',
  compliance: 'Legal, ethical, and regulatory adherence',
  conversion: 'Action-oriented results that drive user engagement'
};

export function ModuleOverlay({ module }: ModuleOverlayProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const { track } = useTelemetry();
  const { userPlan } = useEntitlements();

  const canAccess = userPlan && getPlanLevel(userPlan) >= getPlanLevel(module.minPlan);
  const canExportPDF = userPlan === 'PRO' || userPlan === 'ENTERPRISE';
  const canExportJSON = userPlan === 'PRO' || userPlan === 'ENTERPRISE';
  const canExportZIP = userPlan === 'ENTERPRISE';

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    track('module_tab_change', {
      module_id: module.id,
      tab_name: tab
    });
  };

  const handleRunSample = () => {
    track('module_run_sample', {
      module_id: module.id,
      module_title: module.title
    });
    // Navigate to generator with module preset
    window.location.href = `/generator?module=${module.id}&mode=sample`;
  };

  const handleRunRealTest = () => {
    if (!canAccess) {
      track('module_upgrade_prompt', {
        module_id: module.id,
        required_plan: module.minPlan,
        user_plan: userPlan
      });
      // Show upgrade prompt
      return;
    }

    track('module_run_real', {
      module_id: module.id,
      module_title: module.title,
      user_plan: userPlan
    });
    // Navigate to generator with module preset
    window.location.href = `/generator?module=${module.id}&mode=real`;
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Zap className="h-4 w-4" /> },
    { id: 'inputs', label: '7D Inputs', icon: <CheckCircle className="h-4 w-4" /> },
    { id: 'outputs', label: 'Outputs', icon: <Download className="h-4 w-4" /> },
    { id: 'kpis', label: 'KPIs', icon: <Star className="h-4 w-4" /> },
    { id: 'guardrails', label: 'Guardrails', icon: <Shield className="h-4 w-4" /> }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Module Header */}
      <div className="bg-[var(--bg)] border border-[var(--border)] rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[var(--fg-primary)] mb-2">
              {module.title}
            </h1>
            <p className="text-lg text-[var(--fg-muted)] mb-4">
              {module.description}
            </p>
            
            {/* Quick Stats */}
            <div className="flex items-center space-x-6 text-sm text-[var(--fg-muted)]">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>{module.rating.toFixed(1)} ({module.reviews} reviews)</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{module.estimatedTime}s</span>
              </div>
              <div className="flex items-center space-x-1">
                <Download className="h-4 w-4" />
                <span>{module.downloads.toLocaleString()} downloads</span>
              </div>
            </div>
          </div>
          
          {/* Plan Badge */}
          <div className={`px-4 py-2 text-sm font-medium text-white rounded-full ${
            module.minPlan === 'FREE' ? 'bg-green-500' :
            module.minPlan === 'CREATOR' ? 'bg-blue-500' :
            module.minPlan === 'PRO' ? 'bg-purple-500' : 'bg-orange-500'
          }`}>
            {module.minPlan}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleRunSample}
            className="px-6 py-3 bg-[var(--brand)] text-[var(--bg)] rounded-lg font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2"
          >
            <Play className="inline h-4 w-4 mr-2" />
            Run Sample
          </button>
          
          {canAccess ? (
            <button
              onClick={handleRunRealTest}
              className="px-6 py-3 bg-[var(--accent)] text-[var(--bg)] rounded-lg font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
            >
              <Zap className="inline h-4 w-4 mr-2" />
              Run Real Test
            </button>
          ) : (
            <button
              onClick={handleRunRealTest}
              className="px-6 py-3 bg-[var(--border)] text-[var(--fg-muted)] rounded-lg font-medium cursor-not-allowed"
              title={`Requires ${module.minPlan} plan or higher`}
            >
              <Lock className="inline h-4 w-4 mr-2" />
              Upgrade to {module.minPlan}
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-[var(--bg)] border border-[var(--border)] rounded-xl mb-6">
        <div className="flex border-b border-[var(--border)]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-[var(--brand)] border-b-2 border-[var(--brand)]'
                  : 'text-[var(--fg-muted)] hover:text-[var(--fg-primary)]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-3">Purpose & Scope</h3>
                <p className="text-[var(--fg-muted)] leading-relaxed">{module.description}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-3">7D Vectors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {module.vectors.map((vector) => (
                    <div key={vector} className="p-3 bg-[var(--border)] rounded-lg">
                      <div className="font-medium text-[var(--fg-primary)] capitalize mb-1">{vector}</div>
                      <div className="text-sm text-[var(--fg-muted)]">{VECTOR_DESCRIPTIONS[vector]}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-3">Use Cases</h3>
                <ul className="list-disc list-inside space-y-2 text-[var(--fg-muted)]">
                  {module.useCases.map((useCase, index) => (
                    <li key={index}>{useCase}</li>
                  ))}
                </ul>
              </div>

              {module.prerequisites && (
                <div>
                  <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-3">Prerequisites</h3>
                  <ul className="list-disc list-inside space-y-2 text-[var(--fg-muted)]">
                    {module.prerequisites.map((prereq, index) => (
                      <li key={index}>{prereq}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'inputs' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-3">7D Parameter System</h3>
                <p className="text-[var(--fg-muted)] mb-4">
                  This module optimizes prompts using the 7D methodology. Each vector is carefully tuned for optimal results.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {module.vectors.map((vector) => (
                    <div key={vector} className="p-4 bg-[var(--border)] rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-[var(--fg-primary)] capitalize">{vector}</span>
                        <span className="text-xs text-[var(--fg-muted)] bg-[var(--bg)] px-2 py-1 rounded">Active</span>
                      </div>
                      <p className="text-sm text-[var(--fg-muted)]">{VECTOR_DESCRIPTIONS[vector]}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-3">Example Inputs</h3>
                <div className="space-y-4">
                  {module.examples.map((example, index) => (
                    <div key={index} className="p-4 bg-[var(--border)] rounded-lg">
                      <div className="mb-2">
                        <span className="text-sm font-medium text-[var(--fg-primary)]">Input:</span>
                        <p className="text-[var(--fg-muted)] mt-1">{example.input}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-[var(--fg-primary)]">Expected Output:</span>
                        <p className="text-[var(--fg-muted)] mt-1">{example.output}</p>
                      </div>
                      <div className="mt-2 text-right">
                        <span className="text-xs text-[var(--fg-muted)]">Score: {example.score}/100</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'outputs' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-3">Available Export Formats</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {module.outputs.map((format) => {
                    const isLocked = 
                      (format === 'pdf' && !canExportPDF) ||
                      (format === 'json' && !canExportJSON) ||
                      (format === 'zip' && !canExportZIP);
                    
                    return (
                      <div key={format} className={`p-4 rounded-lg border ${
                        isLocked 
                          ? 'bg-[var(--border)] border-[var(--border)]' 
                          : 'bg-[var(--brand)]/20 border-[var(--brand)]'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-[var(--fg-primary)]">{format.toUpperCase()}</div>
                            <div className="text-sm text-[var(--fg-muted)]">
                              {format === 'txt' && 'Plain text format'}
                              {format === 'md' && 'Markdown with formatting'}
                              {format === 'pdf' && 'Professional PDF document'}
                              {format === 'json' && 'Structured data format'}
                              {format === 'zip' && 'Compressed bundle'}
                            </div>
                          </div>
                          {isLocked ? (
                            <Lock className="h-5 w-5 text-[var(--fg-muted)]" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-[var(--brand)]" />
                          )}
                        </div>
                        {isLocked && (
                          <div className="mt-2 text-xs text-[var(--fg-muted)]">
                            Requires {format === 'zip' ? 'ENTERPRISE' : 'PRO'} plan
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-3">Export Requirements</h3>
                <div className="p-4 bg-[var(--border)] rounded-lg">
                  <ul className="space-y-2 text-sm text-[var(--fg-muted)]">
                    <li>• Minimum score of {module.guardrails.minScore} required for export</li>
                    <li>• Maximum {module.guardrails.maxTokens} tokens per output</li>
                    <li>• {module.guardrails.englishOnly ? 'English language only' : 'Multi-language support'}</li>
                    <li>• {module.guardrails.noPII ? 'No PII allowed' : 'PII handling enabled'}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kpis' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-3">Performance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-[var(--border)] rounded-lg text-center">
                    <div className="text-2xl font-bold text-[var(--brand)]">{module.rating}</div>
                    <div className="text-sm text-[var(--fg-muted)]">Average Rating</div>
                  </div>
                  <div className="p-4 bg-[var(--border)] rounded-lg text-center">
                    <div className="text-2xl font-bold text-[var(--brand)]">{module.downloads.toLocaleString()}</div>
                    <div className="text-sm text-[var(--fg-muted)]">Total Downloads</div>
                  </div>
                  <div className="p-4 bg-[var(--border)] rounded-lg text-center">
                    <div className="text-2xl font-bold text-[var(--brand)]">{module.estimatedTime}s</div>
                    <div className="text-sm text-[var(--fg-muted)]">Avg. Generation Time</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-3">Quality Assurance</h3>
                <div className="p-4 bg-[var(--border)] rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-[var(--fg-primary)]">Score Threshold</span>
                  </div>
                  <p className="text-[var(--fg-muted)]">
                    All outputs must achieve a minimum score of {module.guardrails.minScore}/100 
                    to ensure quality and reliability.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-3">User Feedback</h3>
                <div className="p-4 bg-[var(--border)] rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium text-[var(--fg-primary)]">{module.reviews} Reviews</span>
                  </div>
                  <p className="text-[var(--fg-muted)]">
                    Community feedback and ratings help maintain high standards and continuous improvement.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guardrails' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-3">Safety & Compliance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[var(--border)] rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="h-5 w-5 text-green-500" />
                      <span className="font-medium text-[var(--fg-primary)]">Content Safety</span>
                    </div>
                    <ul className="space-y-1 text-sm text-[var(--fg-muted)]">
                      <li>• English language only: {module.guardrails.englishOnly ? 'Yes' : 'No'}</li>
                      <li>• No PII: {module.guardrails.noPII ? 'Yes' : 'No'}</li>
                      <li>• Ethical guidelines enforced</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-[var(--border)] rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <span className="font-medium text-[var(--fg-primary)]">Quality Gates</span>
                    </div>
                    <ul className="space-y-1 text-sm text-[var(--fg-muted)]">
                      <li>• Minimum score: {module.guardrails.minScore}/100</li>
                      <li>• Max tokens: {module.guardrails.maxTokens}</li>
                      <li>• Validation required</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-3">Export Restrictions</h3>
                <div className="p-4 bg-[var(--border)] rounded-lg">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--fg-primary)]">PDF Export</span>
                      <span className={`px-2 py-1 text-xs rounded ${
                        canExportPDF ? 'bg-green-500 text-white' : 'bg-[var(--border)] text-[var(--fg-muted)]'
                      }`}>
                        {canExportPDF ? 'Available' : 'PRO+ Required'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--fg-primary)]">JSON Export</span>
                      <span className={`px-2 py-1 text-xs rounded ${
                        canExportJSON ? 'bg-green-500 text-white' : 'bg-[var(--border)] text-[var(--fg-muted)]'
                      }`}>
                        {canExportJSON ? 'Available' : 'PRO+ Required'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--fg-primary)]">ZIP Bundle</span>
                      <span className={`px-2 py-1 text-xs rounded ${
                        canExportZIP ? 'bg-green-500 text-white' : 'bg-[var(--border)] text-[var(--fg-muted)]'
                      }`}>
                        {canExportZIP ? 'Available' : 'ENTERPRISE Required'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-3">Best Practices</h3>
                <div className="p-4 bg-[var(--border)] rounded-lg">
                  <ul className="space-y-2 text-sm text-[var(--fg-muted)]">
                    <li>• Always review outputs before deployment</li>
                    <li>• Test with multiple inputs to ensure consistency</li>
                    <li>• Monitor performance metrics regularly</li>
                    <li>• Report any quality issues for improvement</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to get plan level for comparison
function getPlanLevel(plan: string): number {
  const levels = { FREE: 0, CREATOR: 1, PRO: 2, ENTERPRISE: 3 };
  return levels[plan as keyof typeof levels] || 0;
}
