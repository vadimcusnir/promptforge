"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Play, Download, Zap } from 'lucide-react';
import { ExportMenu } from '@/components/ExportMenu';

export default function GeneratorPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVectors, setSelectedVectors] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any>(null);

  const vectors = ['strategic', 'rhetoric', 'content', 'analytics', 'branding', 'crisis', 'cognitive'];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const plans = ['FREE', 'CREATOR', 'PRO', 'ENTERPRISE'];

  const modules = [
    {
      id: 'm01',
      title: 'Strategic Framework Generator',
      description: 'Generate comprehensive strategic frameworks for business planning',
      vectors: ['strategic', 'analytics'],
      difficulty: 'Intermediate',
      plan: 'CREATOR',
      score: 85
    },
    {
      id: 'm02',
      title: 'Content Strategy Builder',
      description: 'Create data-driven content strategies with performance metrics',
      vectors: ['content', 'analytics', 'branding'],
      difficulty: 'Advanced',
      plan: 'PRO',
      score: 92
    }
  ];

  const handleVectorToggle = (vector: string) => {
    setSelectedVectors(prev => 
      prev.includes(vector) 
        ? prev.filter(v => v !== vector)
        : [...prev, vector]
    );
  };

  const handleModuleSelect = (module: any) => {
    setSelectedModule(module);
    setShowModal(true);
  };

  const handleSimulate = () => {
    // Simulate all modules
    console.log('Simulating all modules...');
  };

  const handleRunRealTest = () => {
    // Run real test (Pro+ only)
    console.log('Running real test...');
  };

  const handleExport = () => {
    // Export results (gated)
    console.log('Exporting results...');
  };

  return (
    <div className="min-h-screen bg-pf-black py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-pf-text mb-4">
            Prompt Generator
          </h1>
          <p className="text-pf-text-muted text-lg">
            Generate industrial-grade prompts using our 7-D framework
          </p>
        </div>

        {/* Filters */}
        <Card className="bg-pf-surface border-pf-text-muted/30 mb-8">
          <CardHeader>
            <CardTitle className="text-pf-text">Filters</CardTitle>
            <CardDescription className="text-pf-text-muted">
              Refine your search to find the perfect modules
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-pf-text mb-2">
                Search Query
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pf-text-muted w-4 h-4" />
                <Input
                  placeholder="Search modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-pf-surface border-pf-text-muted/30 text-pf-text"
                />
              </div>
            </div>

            {/* 7 Vectors */}
            <div>
              <label className="block text-sm font-medium text-pf-text mb-2">
                7 Vectors
              </label>
              <div className="flex flex-wrap gap-2">
                {vectors.map((vector) => (
                  <Badge
                    key={vector}
                    variant={selectedVectors.includes(vector) ? "default" : "outline"}
                    className={`cursor-pointer ${
                      selectedVectors.includes(vector)
                        ? 'bg-gold-industrial text-pf-black'
                        : 'border-pf-text-muted/30 text-pf-text-muted hover:border-gold-industrial'
                    }`}
                    onClick={() => handleVectorToggle(vector)}
                  >
                    {vector}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-pf-text mb-2">
                Difficulty
              </label>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                  <Badge
                    key={difficulty}
                    variant={selectedDifficulty === difficulty ? "default" : "outline"}
                    className={`cursor-pointer ${
                      selectedDifficulty === difficulty
                        ? 'bg-gold-industrial text-pf-black'
                        : 'border-pf-text-muted/30 text-pf-text-muted hover:border-gold-industrial'
                    }`}
                    onClick={() => setSelectedDifficulty(
                      selectedDifficulty === difficulty ? '' : difficulty
                    )}
                  >
                    {difficulty}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Plan */}
            <div>
              <label className="block text-sm font-medium text-pf-text mb-2">
                Plan
              </label>
              <div className="flex flex-wrap gap-2">
                {plans.map((plan) => (
                  <Badge
                    key={plan}
                    variant={selectedPlan === plan ? "default" : "outline"}
                    className={`cursor-pointer ${
                      selectedPlan === plan
                        ? 'bg-gold-industrial text-pf-black'
                        : 'border-pf-text-muted/30 text-pf-text-muted hover:border-gold-industrial'
                    }`}
                    onClick={() => setSelectedPlan(
                      selectedPlan === plan ? '' : plan
                    )}
                  >
                    {plan}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {modules.map((module) => (
            <Card
              key={module.id}
              className="bg-pf-surface border-pf-text-muted/30 hover:border-gold-industrial/50 transition-colors cursor-pointer"
              onClick={() => handleModuleSelect(module)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-pf-text">{module.title}</CardTitle>
                  <Badge className="bg-gold-industrial/20 text-gold-industrial">
                    {module.score}%
                  </Badge>
                </div>
                <CardDescription className="text-pf-text-muted">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-pf-text-muted">Vectors:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {module.vectors.map((vector) => (
                        <Badge key={vector} variant="outline" className="text-xs border-pf-text-muted/30 text-pf-text-muted">
                          {vector}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-pf-text-muted">Difficulty: {module.difficulty}</span>
                    <span className="text-pf-text-muted">Plan: {module.plan}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={handleSimulate}
            className="bg-gold-industrial text-pf-black hover:bg-gold-industrial-dark"
          >
            <Play className="w-4 h-4 mr-2" />
            Simulate All
          </Button>
          <Button
            onClick={handleRunRealTest}
            variant="outline"
            className="border-pf-text-muted/30 text-pf-text hover:bg-pf-text-muted/10"
          >
            <Zap className="w-4 h-4 mr-2" />
            Run Real Test (Pro+)
          </Button>
          <Button
            onClick={handleExport}
            variant="outline"
            className="border-pf-text-muted/30 text-pf-text hover:bg-pf-text-muted/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export (Gated)
          </Button>
        </div>

        {/* Modal Overlay */}
        {showModal && selectedModule && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-pf-surface border-pf-text-muted/30 max-w-2xl w-full mx-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-pf-text">{selectedModule.title}</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowModal(false)}
                    className="border-pf-text-muted/30 text-pf-text-muted"
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-pf-text font-semibold mb-3">7D Inputs</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm text-pf-text-muted">Context</label>
                      <Input placeholder="Enter context..." className="bg-pf-surface border-pf-text-muted/30" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm text-pf-text-muted">Objective</label>
                      <Input placeholder="Enter objective..." className="bg-pf-surface border-pf-text-muted/30" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm text-pf-text-muted">Audience</label>
                      <Input placeholder="Enter audience..." className="bg-pf-surface border-pf-text-muted/30" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm text-pf-text-muted">Constraints</label>
                      <Input placeholder="Enter constraints..." className="bg-pf-surface border-pf-text-muted/30" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-pf-text font-semibold mb-3">Outputs</h4>
                  <div className="bg-pf-black/50 p-4 rounded border border-pf-text-muted/20">
                    <p className="text-pf-text-muted text-sm">
                      Generated prompt will appear here after processing...
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-pf-text font-semibold mb-3">KPIs</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-pf-black/50 p-3 rounded">
                      <div className="text-2xl font-bold text-gold-industrial">85%</div>
                      <div className="text-xs text-pf-text-muted">Score</div>
                    </div>
                    <div className="bg-pf-black/50 p-3 rounded">
                      <div className="text-2xl font-bold text-gold-industrial">12</div>
                      <div className="text-xs text-pf-text-muted">Vectors</div>
                    </div>
                    <div className="bg-pf-black/50 p-3 rounded">
                      <div className="text-2xl font-bold text-gold-industrial">3</div>
                      <div className="text-xs text-pf-text-muted">Guardrails</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-pf-text font-semibold mb-3">Guardrails</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-pf-text-muted">Content safety verified</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-pf-text-muted">Bias detection passed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-pf-text-muted">Quality threshold met</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowModal(false)}
                    className="border-pf-text-muted/30 text-pf-text-muted"
                  >
                    Cancel
                  </Button>
                  <Button className="bg-gold-industrial text-pf-black hover:bg-gold-industrial-dark">
                    Generate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
