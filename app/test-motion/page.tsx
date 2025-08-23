'use client';

import { useState } from 'react';
import { Motion } from '@/components/Motion';
import { Button } from '@/components/ui/button';
import { WorkflowSteps } from '@/components/generator/WorkflowSteps';
import { useToast } from '@/components/ui/toast';
import { ArrowRight, Zap, CheckCircle } from 'lucide-react';

export default function TestMotionPage() {
  const [currentStep, setCurrentStep] = useState<'configure' | 'generate' | 'test' | 'export'>(
    'configure'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const toast = useToast();

  const handleStepAdvance = async () => {
    const steps = ['configure', 'generate', 'test', 'export'] as const;
    const currentIndex = steps.indexOf(currentStep);

    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];

      if (nextStep === 'generate') {
        setIsGenerating(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsGenerating(false);
        toast.success('Prompt generated successfully!');
      } else if (nextStep === 'test') {
        setIsTesting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsTesting(false);
        toast.success('Test completed - Score: 87/100');
      } else if (nextStep === 'export') {
        toast.success('Ready for export!');
      }

      setCurrentStep(nextStep);
    }
  };

  const handleReset = () => {
    setCurrentStep('configure');
    setIsGenerating(false);
    setIsTesting(false);
    setShowSuccess(false);
  };

  const showSuccessDemo = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <toast.ToastContainer />

      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Motion Discipline Demo</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Demonstrating the 3-intent motion system: Guide (CTA feedback), State (loading/success),
            and Explain (step transitions). All motion respects reduced-motion preferences.
          </p>
        </header>

        {/* Workflow Steps Demo */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Explain Intent - Step Transitions</h2>
          <div className="bg-gray-900/50 rounded-lg p-6">
            <WorkflowSteps
              currentStep={currentStep}
              isGenerating={isGenerating}
              isTesting={isTesting}
            />

            <div className="flex justify-center gap-4 mt-6">
              <Button onClick={handleStepAdvance} disabled={isGenerating || isTesting}>
                {currentStep === 'export' ? 'Complete' : 'Next Step'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="secondary" onClick={handleReset}>
                Reset Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Guide Intent Demo */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Guide Intent - CTA Feedback</h2>
          <div className="bg-gray-900/50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Motion intent="guide" className="text-center">
                <Button className="w-full">
                  <Zap className="w-4 h-4 mr-2" />
                  Primary CTA
                </Button>
                <p className="text-sm text-gray-400 mt-2">Hover for -1px translate + glow</p>
              </Motion>

              <Motion intent="guide" className="text-center">
                <Button variant="secondary" className="w-full">
                  Secondary Action
                </Button>
                <p className="text-sm text-gray-400 mt-2">Subtle hover feedback</p>
              </Motion>

              <Motion intent="guide" className="text-center">
                <Button variant="outline" className="w-full">
                  Export
                </Button>
                <p className="text-sm text-gray-400 mt-2">Focus ring animated</p>
              </Motion>
            </div>
          </div>
        </section>

        {/* State Intent Demo */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">State Intent - Status Feedback</h2>
          <div className="bg-gray-900/50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-medium">Success State</h3>
                <Motion
                  intent="state"
                  className={`flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-green-600 ${showSuccess ? 'success' : ''}`}
                >
                  <CheckCircle className="w-8 h-8" />
                </Motion>
                <Button onClick={showSuccessDemo} variant="secondary" size="sm">
                  Trigger Success
                </Button>
              </div>

              <div className="text-center space-y-4">
                <h3 className="text-lg font-medium">Loading State</h3>
                <Motion
                  intent="state"
                  className={`flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-blue-600 ${isGenerating ? 'loading' : ''}`}
                >
                  {isGenerating ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Zap className="w-8 h-8" />
                  )}
                </Motion>
                <Button
                  onClick={() => {
                    setIsGenerating(true);
                    setTimeout(() => setIsGenerating(false), 2000);
                  }}
                  variant="secondary"
                  size="sm"
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Loading...' : 'Trigger Loading'}
                </Button>
              </div>

              <div className="text-center space-y-4">
                <h3 className="text-lg font-medium">Badge Copied</h3>
                <Motion intent="state" className="inline-flex">
                  <button
                    onClick={() => toast.success('Copied to clipboard!')}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-sm transition-colors"
                  >
                    Click to Copy
                  </button>
                </Motion>
                <p className="text-xs text-gray-500">Shows toast with state animation</p>
              </div>
            </div>
          </div>
        </section>

        {/* Motion Budget Info */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Motion Budget</h2>
          <div className="bg-gray-900/50 rounded-lg p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400">1</div>
                <div className="text-sm text-gray-400">Primary Motion/Page</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">≤4</div>
                <div className="text-sm text-gray-400">Micro Interactions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">0</div>
                <div className="text-sm text-gray-400">Infinite Loops</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">≤1%</div>
                <div className="text-sm text-gray-400">CPU Usage</div>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Info */}
        <section className="bg-gray-900/30 rounded-lg p-6 text-sm text-gray-400">
          <h3 className="text-white font-medium mb-3">Motion Discipline Rules</h3>
          <ul className="space-y-2">
            <li>
              • <strong>Guide:</strong> CTA hover (-1px), focus rings (180-220ms)
            </li>
            <li>
              • <strong>State:</strong> Loading, success, copied badges (120-600ms)
            </li>
            <li>
              • <strong>Explain:</strong> Step transitions (8-12px slide, 300-400ms)
            </li>
            <li>
              • <strong>Respect:</strong> prefers-reduced-motion disables all animations
            </li>
            <li>
              • <strong>Budget:</strong> 1 primary + max 4 micro per page, ≤1% CPU
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
