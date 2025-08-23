'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { PremiumGate } from '@/lib/premium-features';
import { PromptGenerator } from '@/components/prompt-generator';
import { GPTEditor } from '@/components/gpt-editor';
import { TestEngine } from '@/components/test-engine';
import { ExportBar } from '@/components/generator/ExportBar';
import { HistoryPanel } from '@/components/generator/HistoryPanel';
import { WorkflowSteps } from '@/components/generator/WorkflowSteps';
import { BrandLinterAlert } from '@/components/ui/brand-linter-alert';
import { EntitlementGate } from '@/components/billing/EntitlementGate';
import { ExportManager } from '@/components/export-manager';
import { ExportBundleManager } from '@/components/export-bundle-manager';
import { GPTLiveEditor } from '@/components/gpt-live-editor';
import { PromptEditor } from '@/components/generator/PromptEditor';
import { ExportIntegration } from '@/components/generator/ExportIntegration';
import { BrandLinter } from '@/lib/brand-linter';
import { ExportBundleEngine } from '@/lib/export-bundle';
import { HistoryManager } from '@/lib/history-manager';
import { GTMEvents } from '@/lib/gtm-events';

export default function GeneratorPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('generator');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<'configure' | 'generate' | 'test' | 'export'>('configure');
  
  // Mock config for demo purposes
  const mockConfig = {
    vector: 'V1',
    domain: 'business',
    scale: 'medium',
    urgency: 'normal',
    complexity: 'moderate',
    resources: 'standard',
    application: 'general',
    outputFormat: 'markdown'
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gold-industrial mb-4">
            PROMPTFORGE™ Generator
          </h1>
          <p className="text-lead-gray text-lg">
            Create, test, and optimize professional prompts with our 7D Parameter Engine
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-lead-gray/20 border border-lead-gray/30">
            <TabsTrigger value="generator" className="text-white data-[state=active]:bg-gold-industrial data-[state=active]:text-black">
              Generator
            </TabsTrigger>
            <TabsTrigger value="editor" className="text-white data-[state=active]:bg-gold-industrial data-[state=active]:text-black">
              Editor
            </TabsTrigger>
            <TabsTrigger value="test" className="text-white data-[state=active]:bg-gold-industrial data-[state=active]:text-black">
              Test Engine
            </TabsTrigger>
            <TabsTrigger value="export" className="text-white data-[state=active]:bg-gold-industrial data-[state=active]:text-black">
              Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="mt-6">
            <Card className="bg-lead-gray/10 border border-lead-gray/30">
              <CardHeader>
                <CardTitle className="text-white">Prompt Generator</CardTitle>
                <CardDescription className="text-lead-gray">
                  Generate professional prompts using our 50+ semantic modules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PromptGenerator 
                  selectedModule={selectedModule}
                  config={mockConfig}
                  onPromptGenerated={setGeneratedPrompt}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="editor" className="mt-6">
            <Card className="bg-lead-gray/10 border border-lead-gray/30">
              <CardHeader>
                <CardTitle className="text-white">GPT Editor</CardTitle>
                <CardDescription className="text-lead-gray">
                  Live editing and testing with GPT integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GPTEditor 
                  generatedPrompt={generatedPrompt}
                  onEditComplete={(result) => {
                    console.log('Edit complete:', result);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test" className="mt-6">
            <Card className="bg-lead-gray/10 border border-lead-gray/30">
              <CardHeader>
                <CardTitle className="text-white">Test Engine</CardTitle>
                <CardDescription className="text-lead-gray">
                  Test and validate your prompts with scoring and optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TestEngine 
                  generatedPrompt={generatedPrompt}
                  onTestComplete={(result) => {
                    console.log('Test complete:', result);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="mt-6">
            <Card className="bg-lead-gray/10 border border-lead-gray/30">
              <CardHeader>
                <CardTitle className="text-white">Export Manager</CardTitle>
                <CardDescription className="text-lead-gray">
                  Export your prompts in multiple formats (.md, .json, .pdf, .zip)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExportManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <WorkflowSteps 
            currentStep={currentStep}
            isGenerating={isLoading}
            isTesting={false}
          />
        </div>
      </div>
    </div>
  );
}
