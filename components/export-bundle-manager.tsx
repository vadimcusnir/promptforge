'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  IndustrialCard,
  IndustrialButton,
  IndustrialBadge,
  IndustrialProgress,
} from '@/components/industrial-ui';
import { ExportBundleEngine, type ExportFormat } from '@/lib/export-bundle';
import { PremiumGate } from '@/lib/premium-features';
import type { GeneratedPrompt } from '@/types/promptforge';
import type { GPTEditResult } from '@/lib/gpt-editor';
import type { TestResult } from '@/lib/test-engine';
import { Package, Settings, Database, BarChart3, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportBundleManagerProps {
  generatedPrompt?: GeneratedPrompt | null;
  editResults?: GPTEditResult[];
  testResults?: TestResult[];
  onExportComplete?: () => void;
}

export function ExportBundleManager({
  generatedPrompt,
  editResults,
  testResults,
  onExportComplete,
}: ExportBundleManagerProps) {
  const [bundleName, setBundleName] = useState(
    `PROMPTFORGE Export ${new Date().toLocaleDateString()}`
  );
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('bundle');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [includeOptions, setIncludeOptions] = useState({
    prompts: true,
    edits: true,
    tests: true,
    history: true,
    analytics: true,
  });
  const [customization, setCustomization] = useState({
    companyName: '',
    customHeader: '',
    customFooter: '',
  });

  const { toast } = useToast();
  const bundleEngine = ExportBundleEngine.getInstance();
  const premiumGate = PremiumGate.getInstance();
  const currentTier = premiumGate.getCurrentTier();

  const formatOptions: Array<{
    value: ExportFormat;
    label: string;
    tier: string;
    description: string;
    requiresPlan: string;
  }> = [
    {
      value: 'txt',
      label: 'TXT Report',
      tier: 'free',
      description: 'Simple text report with basic statistics',
      requiresPlan: 'free',
    },
    {
      value: 'markdown',
      label: 'Markdown',
      tier: 'free',
      description: 'Documentation-ready format',
      requiresPlan: 'free',
    },
    {
      value: 'json',
      label: 'JSON Data',
      tier: 'pro',
      description: 'Structured data export for developers',
      requiresPlan: 'pro',
    },
    {
      value: 'csv',
      label: 'CSV Spreadsheet',
      tier: 'pro',
      description: 'Tabular data for analysis tools',
      requiresPlan: 'pro',
    },
    {
      value: 'xml',
      label: 'XML Data',
      tier: 'pro',
      description: 'Structured markup for integrations',
      requiresPlan: 'pro',
    },
    {
      value: 'pdf',
      label: 'PDF Report',
      tier: 'pro',
      description: 'Professional presentation format',
      requiresPlan: 'pro',
    },
    {
      value: 'docx',
      label: 'Word Document',
      tier: 'enterprise',
      description: 'Editable document format',
      requiresPlan: 'enterprise',
    },
    {
      value: 'bundle',
      label: 'Complete Bundle',
      tier: 'enterprise',
      description: 'All formats in one package with manifest',
      requiresPlan: 'enterprise',
    },
  ];

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setExportProgress(0);

      // Check if format is allowed for current plan
      const selectedFormatOption = formatOptions.find(f => f.value === selectedFormat);
      if (!selectedFormatOption) {
        toast({
          title: 'Export Error',
          description: 'Selected format not found',
          variant: 'destructive',
        });
        return;
      }

      // Validate plan requirements
      if (!premiumGate.canExportFormat(selectedFormat)) {
        const requiredPlan = selectedFormatOption.requiresPlan;
        const currentTier = premiumGate.getCurrentTier();

        if (requiredPlan === 'enterprise' && currentTier.id !== 'enterprise') {
          toast({
            title: 'Enterprise Feature Required',
            description: `${selectedFormat.toUpperCase()} export requires Enterprise plan`,
            variant: 'destructive',
          });
          // Redirect to paywall for enterprise features
          window.location.href = '/pricing#enterprise';
          return;
        } else if (requiredPlan === 'pro' && currentTier.id === 'free') {
          toast({
            title: 'Pro Feature Required',
            description: `${selectedFormat.toUpperCase()} export requires Pro plan or higher`,
            variant: 'destructive',
          });
          // Redirect to paywall for pro features
          window.location.href = '/pricing#pro';
          return;
        }

        toast({
          title: 'Premium Feature Required',
          description: `${selectedFormat.toUpperCase()} export requires ${requiredPlan} plan`,
          variant: 'destructive',
        });
        return;
      }

      setExportProgress(20);

      // Create bundle
      const bundle = await bundleEngine.createBundle(bundleName, selectedFormat, {
        includePrompts: includeOptions.prompts,
        includeEdits: includeOptions.edits,
        includeTests: includeOptions.tests,
        includeHistory: includeOptions.history,
        includeAnalytics: includeOptions.analytics,
        customization,
      });

      setExportProgress(60);

      // Export bundle
      const blob = await bundleEngine.exportBundle(bundle);

      setExportProgress(90);

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];

      const filename =
        selectedFormat === 'bundle'
          ? `${bundleName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${timestamp}_bundle.zip`
          : `${bundleName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${timestamp}.${selectedFormat}`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportProgress(100);

      // Show success message with additional info for bundles
      const successMessage =
        selectedFormat === 'bundle'
          ? `Bundle exported with all formats (${(blob.size / 1024).toFixed(2)} KB)`
          : `Bundle exported as ${selectedFormat.toUpperCase()} (${(blob.size / 1024).toFixed(2)} KB)`;

      toast({
        title: 'Export Complete!',
        description: successMessage,
      });

      // Log export event for analytics
      if (selectedFormat === 'bundle') {
        // Analytics tracking would go here in production
        // console.log('Bundle exported with:', { filename, size: blob.size, includes: { formats: ['txt', 'markdown', 'json', 'csv', 'xml', 'pdf', 'docx'] } });
      }
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportProgress(0), 2000);
    }
  };

  const getFormatIcon = (format: ExportFormat) => {
    switch (format) {
      case 'bundle':
        return <Package className="w-4 h-4" />;
      case 'pdf':
      case 'docx':
      case 'csv':
      case 'json':
      case 'xml':
        return <Database className="w-4 h-4" />;
      default:
        return <Database className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <IndustrialCard variant="elevated" glow className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-400 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text">
            Export Bundle Engine
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <IndustrialCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">Bundle Configuration</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">
                    Bundle Name
                  </label>
                  <Input
                    value={bundleName}
                    onChange={e => setBundleName(e.target.value)}
                    className="industrial-input"
                    placeholder="Enter bundle name..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">
                    Export Format
                  </label>
                  <Select
                    value={selectedFormat}
                    onValueChange={(value: ExportFormat) => setSelectedFormat(value)}
                  >
                    <SelectTrigger className="industrial-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {formatOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            {getFormatIcon(option.value)}
                            <span>{option.label}</span>
                            <IndustrialBadge
                              variant={
                                option.tier === 'free'
                                  ? 'default'
                                  : option.tier === 'pro'
                                    ? 'info'
                                    : 'success'
                              }
                              size="sm"
                            >
                              {option.tier}
                            </IndustrialBadge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-400 mt-1">
                    {formatOptions.find(f => f.value === selectedFormat)?.description}
                  </p>
                </div>
              </div>
            </IndustrialCard>

            <IndustrialCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Include Content</h3>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'prompts', label: 'Generated Prompts', count: 1 },
                  {
                    key: 'edits',
                    label: 'GPT Optimizations',
                    count: editResults?.length || 0,
                  },
                  {
                    key: 'tests',
                    label: 'Test Results',
                    count: testResults?.length || 0,
                  },
                  { key: 'history', label: 'Session History', count: 25 },
                  {
                    key: 'analytics',
                    label: 'Performance Analytics',
                    count: 1,
                  },
                ].map(({ key, label, count }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={includeOptions[key as keyof typeof includeOptions]}
                        onCheckedChange={checked =>
                          setIncludeOptions(prev => ({
                            ...prev,
                            [key]: checked,
                          }))
                        }
                      />
                      <label htmlFor={key} className="text-sm text-white cursor-pointer">
                        {label}
                      </label>
                    </div>
                    <IndustrialBadge variant="default" size="sm">
                      {count} items
                    </IndustrialBadge>
                  </div>
                ))}
              </div>
            </IndustrialCard>

            {(currentTier.id === 'pro' || currentTier.id === 'enterprise') && (
              <IndustrialCard className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-semibold text-white">Customization</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Company Name
                    </label>
                    <Input
                      placeholder="Your Company"
                      value={customization.companyName}
                      onChange={e =>
                        setCustomization(prev => ({
                          ...prev,
                          companyName: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Custom Header
                    </label>
                    <Textarea
                      placeholder="Custom header text for your exports..."
                      value={customization.customHeader}
                      onChange={e =>
                        setCustomization(prev => ({
                          ...prev,
                          customHeader: e.target.value,
                        }))
                      }
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Custom Footer
                    </label>
                    <Textarea
                      placeholder="Custom footer text for your exports..."
                      value={customization.customFooter}
                      onChange={e =>
                        setCustomization(prev => ({
                          ...prev,
                          customFooter: e.target.value,
                        }))
                      }
                      rows={2}
                    />
                  </div>
                </div>
              </IndustrialCard>
            )}
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <IndustrialCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold text-white">Bundle Preview</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-cyan-400">
                      {Object.values(includeOptions).filter(Boolean).length}
                    </div>
                    <div className="text-xs text-slate-400">Content Types</div>
                  </div>
                  <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">
                      {selectedFormat.toUpperCase()}
                    </div>
                    <div className="text-xs text-slate-400">Export Format</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-600/30">
                  <div className="text-sm text-slate-300 font-mono">
                    {bundleName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.
                    {selectedFormat === 'bundle' ? 'json' : selectedFormat}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Estimated size: ~
                    {Math.max(50, Object.values(includeOptions).filter(Boolean).length * 25)} KB
                  </div>
                </div>

                {isExporting && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Exporting...</span>
                      <span className="text-white">{exportProgress}%</span>
                    </div>
                    <IndustrialProgress value={exportProgress} />
                  </div>
                )}
              </div>
            </IndustrialCard>

            <IndustrialCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-semibold text-white">
                  Current Plan: {currentTier.name}
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Available Formats</span>
                  <span className="text-white">{currentTier.limits.exportFormats.length}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {currentTier.limits.exportFormats.map(format => (
                    <IndustrialBadge key={format} variant="success" size="sm">
                      {format.toUpperCase()}
                    </IndustrialBadge>
                  ))}
                </div>
              </div>
            </IndustrialCard>

            <IndustrialButton
              variant="primary"
              size="lg"
              onClick={handleExport}
              disabled={isExporting || !bundleName.trim()}
              loading={isExporting}
              className="w-full"
            >
              {isExporting ? 'Exporting Bundle...' : 'Export Bundle'}
            </IndustrialButton>
          </div>
        </div>
      </IndustrialCard>
    </div>
  );
}
