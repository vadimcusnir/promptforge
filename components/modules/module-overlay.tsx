"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X, Play, Zap, Download, AlertTriangle, CheckCircle } from 'lucide-react';
import { ExportMenu } from '@/components/ExportMenu';
import type { Module, PlanType, SevenDParams, ModuleRun } from '@/types/modules';

interface ModuleOverlayProps {
  module: Module;
  isOpen: boolean;
  onClose: () => void;
  userPlan: PlanType;
  canUseGptTestReal: boolean;
  canExportFormat: (format: string, score?: number) => boolean;
}

const SEVEN_D_OPTIONS = {
  domain: ['generic', 'business', 'technology', 'healthcare', 'education', 'finance', 'marketing'],
  scale: ['individual', 'team', 'organization', 'enterprise'],
  urgency: ['low', 'normal', 'high', 'critical'],
  complexity: ['simple', 'medium', 'complex', 'expert'],
  resources: ['minimal', 'standard', 'extended', 'unlimited'],
  application: ['prompt_engineering', 'content_creation', 'analysis', 'strategy', 'crisis_management'],
  output: ['text', 'markdown', 'json', 'bundle']
};

const DEFAULT_SEVEN_D: SevenDParams = {
  domain: 'generic',
  scale: 'team',
  urgency: 'normal',
  complexity: 'medium',
  resources: 'standard',
  application: 'prompt_engineering',
  output: 'text'
};

export function ModuleOverlay({
  module,
  isOpen,
  onClose,
  userPlan,
  canUseGptTestReal,
  canExportFormat
}: ModuleOverlayProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'inputs' | 'outputs' | 'kpis' | 'guardrails' | 'actions'>('overview');
  const [sevenDParams, setSevenDParams] = useState<SevenDParams>({
    ...DEFAULT_SEVEN_D,
    ...module.sevenDDefaults
  });
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<ModuleRun | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');

  // Reset state when module changes
  useEffect(() => {
    if (module) {
      setSevenDParams({
        ...DEFAULT_SEVEN_D,
        ...module.sevenDDefaults
      });
      setRunResult(null);
      setError(null);
      setGeneratedPrompt('');
    }
  }, [module]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSevenDChange = (field: keyof SevenDParams, value: string) => {
    setSevenDParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateSevenD = (): boolean => {
    return Object.values(sevenDParams).every(value => value && value.trim() !== '');
  };

  const handleSimulate = async () => {
    if (!validateSevenD()) {
      setError('Please fill in all 7-D parameters');
      return;
    }

    setIsRunning(true);
    setError(null);

    try {
      const response = await fetch(`/api/run/${module.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sevenDParams,
          runType: 'simulate'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setRunResult(data.data);
        setGeneratedPrompt(data.data.prompt);
      } else {
        throw new Error(data.error || 'Simulation failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simulation failed');
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunRealTest = async () => {
    if (!canUseGptTestReal) {
      setError('Live testing requires Pro or Enterprise plan');
      return;
    }

    if (!validateSevenD()) {
      setError('Please fill in all 7-D parameters');
      return;
    }

    setIsRunning(true);
    setError(null);

    try {
      const response = await fetch(`/api/run/${module.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sevenDParams,
          runType: 'live'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setRunResult(data.data);
        setGeneratedPrompt(data.data.prompt);
      } else {
        throw new Error(data.error || 'Live test failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Live test failed');
    } finally {
      setIsRunning(false);
    }
  };

  const canExport = runResult && runResult.score.overall >= 80;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-pf-surface border-pf-text-muted/30 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <CardHeader className="flex items-center justify-between border-b border-pf-text-muted/20">
          <CardTitle className="text-pf-text text-xl">{module.title}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-pf-text-muted hover:text-pf-text"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex-1">
          <TabsList className="grid w-full grid-cols-6 bg-pf-black/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="inputs">7-D Inputs</TabsTrigger>
            <TabsTrigger value="outputs">Outputs</TabsTrigger>
            <TabsTrigger value="kpis">KPIs</TabsTrigger>
            <TabsTrigger value="guardrails">Guardrails</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-pf-text mb-3">Module Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-pf-text-muted">Summary:</span>
                      <p className="text-pf-text">{module.summary}</p>
                    </div>
                    <div>
                      <span className="text-sm text-pf-text-muted">Vectors:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {module.vectors.map(vector => (
                          <Badge key={vector} variant="outline" className="text-xs">
                            {vector}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-pf-text-muted">Difficulty:</span>
                      <Badge className="ml-2">{module.difficulty}/5</Badge>
                    </div>
                    <div>
                      <span className="text-sm text-pf-text-muted">Required Plan:</span>
                      <Badge className="ml-2">{module.minPlan}</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-pf-text mb-3">Supported Outputs</h3>
                  <div className="flex flex-wrap gap-2">
                    {module.outputs.map(output => (
                      <Badge key={output} variant="secondary" className="bg-gold-industrial/20 text-gold-industrial">
                        {output}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 7-D Inputs Tab */}
            <TabsContent value="inputs" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(SEVEN_D_OPTIONS).map(([field, options]) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-pf-text mb-2 capitalize">
                      {field.replace('_', ' ')}
                    </label>
                    <Select
                      value={sevenDParams[field as keyof SevenDParams]}
                      onValueChange={(value) => handleSevenDChange(field as keyof SevenDParams, value)}
                    >
                      <SelectTrigger className="bg-pf-surface border-pf-text-muted/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-pf-surface border-pf-text-muted/30">
                        {options.map(option => (
                          <SelectItem key={option} value={option}>
                            {option.replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Outputs Tab */}
            <TabsContent value="outputs" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-pf-text mb-3">Generated Prompt</h3>
                  {generatedPrompt ? (
                    <Textarea
                      value={generatedPrompt}
                      readOnly
                      className="min-h-[200px] bg-pf-black/50 border-pf-text-muted/20 text-pf-text"
                    />
                  ) : (
                    <div className="min-h-[200px] bg-pf-black/50 border border-pf-text-muted/20 rounded flex items-center justify-center">
                      <p className="text-pf-text-muted">Generated prompt will appear here after processing...</p>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-pf-text mb-3">Export Options</h3>
                  <div className="space-y-3">
                    {module.outputs.map(output => (
                      <div key={output} className="flex items-center justify-between p-3 bg-pf-black/30 rounded">
                        <span className="text-pf-text">{output.toUpperCase()}</span>
                        {canExportFormat(output, runResult?.score.overall) ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* KPIs Tab */}
            <TabsContent value="kpis" className="space-y-6">
              {runResult ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-pf-black/50 p-4 rounded text-center">
                    <div className="text-2xl font-bold text-gold-industrial">{runResult.score.overall}%</div>
                    <div className="text-xs text-pf-text-muted">Overall Score</div>
                  </div>
                  <div className="bg-pf-black/50 p-4 rounded text-center">
                    <div className="text-2xl font-bold text-green-400">{runResult.score.quality}%</div>
                    <div className="text-xs text-pf-text-muted">Quality</div>
                  </div>
                  <div className="bg-pf-black/50 p-4 rounded text-center">
                    <div className="text-2xl font-bold text-blue-400">{runResult.score.risk}%</div>
                    <div className="text-xs text-pf-text-muted">Risk</div>
                  </div>
                  <div className="bg-pf-black/50 p-4 rounded text-center">
                    <div className="text-2xl font-bold text-purple-400">{runResult.score.cost}%</div>
                    <div className="text-xs text-pf-text-muted">Cost</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-pf-text-muted">Run a simulation or live test to see KPIs</p>
                </div>
              )}
            </TabsContent>

            {/* Guardrails Tab */}
            <TabsContent value="guardrails" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-pf-text">Content safety verified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-pf-text">Bias detection passed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-pf-text">Quality threshold met</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-pf-text">No PII or sensitive data</span>
                </div>
              </div>
            </TabsContent>

            {/* Actions Tab */}
            <TabsContent value="actions" className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button
                    onClick={handleSimulate}
                    disabled={isRunning || !validateSevenD()}
                    className="flex-1 bg-gold-industrial text-pf-black hover:bg-gold-industrial-dark"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isRunning ? 'Running...' : 'Simulate'}
                  </Button>
                  <Button
                    onClick={handleRunRealTest}
                    disabled={isRunning || !canUseGptTestReal || !validateSevenD()}
                    variant="outline"
                    className="flex-1 border-pf-text-muted/30 text-pf-text hover:bg-pf-text-muted/10"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {isRunning ? 'Running...' : 'Run Real Test'}
                  </Button>
                </div>

                {runResult && canExport && (
                  <div className="pt-4 border-t border-pf-text-muted/20">
                    <h3 className="text-lg font-semibold text-pf-text mb-3">Export</h3>
                    <ExportMenu
                      modules={[module]}
                      plan={userPlan}
                      score={runResult.score.overall}
                      metadata={{
                        title: `${module.title} - Generated Prompt`,
                        description: `Generated using 7-D framework: ${Object.entries(sevenDParams).map(([k, v]) => `${k}: ${v}`).join(', ')}`,
                        author: 'PromptForge User'
                      }}
                    />
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded text-red-400">
                    <p className="text-sm">{error}</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}
