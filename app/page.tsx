"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AnimatedCodeBlock } from "@/components/ui/animated-code-block";
import { Hero } from "@/components/Hero";

import { SkipLink } from "@/components/SkipLink";
import { brandLinter } from "@/lib/brand-linter";
import {
  Zap,
  Crown,
  Download,
  Brain,
  TrendingUp,
  Award,
} from "lucide-react";
import { BrandLinterAlert } from "@/components/ui/brand-linter-alert";

export default function HomePage() {
  const [demoInput, setDemoInput] = useState("marketing strategy");
  const [demoOutput, setDemoOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDemoGenerate = async () => {
    if (!demoInput.trim()) return;
    setIsGenerating(true);
    try {
      const result = brandLinter.validatePrompt(demoInput);
      setDemoOutput(JSON.stringify(result, null, 2));
    } catch (error) {
      setDemoOutput("Error generating demo output");
    } finally {
    setIsGenerating(false);
    }
  };

  return (
    <>
        <SkipLink />
      <main className="min-h-screen">
          <Hero />

        {/* Demo Section */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Try the Brand Linter
              </h2>
              <p className="text-xl text-gray-300">
                Test our AI-powered brand consistency checker
              </p>
            </div>

              <div className="max-w-4xl mx-auto">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Live Demo</CardTitle>
                  <CardDescription className="text-gray-300">
                    Enter any text to see how our brand linter analyzes it
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <Input
                      value={demoInput}
                      onChange={(e) => setDemoInput(e.target.value)}
                      placeholder="Enter text to analyze..."
                      className="flex-1 bg-gray-700 border-gray-600 text-white"
                    />
                    <Button 
                      onClick={handleDemoGenerate}
                      disabled={isGenerating}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isGenerating ? "Analyzing..." : "Analyze"}
                    </Button>
                  </div>

                      {demoOutput && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-white mb-2">Analysis Result:</h3>
                      <AnimatedCodeBlock
                        code={demoOutput}
                        language="json"
                        className="bg-gray-900"
                      />
                    </div>
                  )}
                </CardContent>
                </Card>
              </div>
            </div>
          </section>

        {/* Features Grid */}
        <section className="py-20 bg-gray-900">
            <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Why Choose PromptForge?
                </h2>
              <p className="text-xl text-gray-300">
                Enterprise-grade prompt engineering with military precision
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">Lightning Fast</CardTitle>
                  <CardDescription className="text-gray-300">
                    Generate production-ready prompts in seconds, not hours
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-gray-800 border-gray-700 hover:border-green-500 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">Enterprise Ready</CardTitle>
                  <CardDescription className="text-gray-300">
                    Built for scale with enterprise-grade security and compliance
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">Export Anywhere</CardTitle>
                  <CardDescription className="text-gray-300">
                    Multiple export formats for any workflow integration
                  </CardDescription>
                </CardHeader>
                </Card>

              <Card className="bg-gray-800 border-gray-700 hover:border-red-500 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                    <Brain className="w-6 h-6 text-white" />
              </div>
                  <CardTitle className="text-white">AI-Powered</CardTitle>
                  <CardDescription className="text-gray-300">
                    Advanced AI algorithms optimize prompts for maximum effectiveness
                  </CardDescription>
                </CardHeader>
                    </Card>

              <Card className="bg-gray-800 border-gray-700 hover:border-yellow-500 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">Performance Metrics</CardTitle>
                  <CardDescription className="text-gray-300">
                    Track and optimize prompt performance with detailed analytics
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-gray-800 border-gray-700 hover:border-indigo-500 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">Quality Assured</CardTitle>
                  <CardDescription className="text-gray-300">
                    Every prompt meets our strict quality standards
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your AI Workflow?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of professionals who trust PromptForge for their AI needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Get Started Free
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                View Documentation
              </Button>
            </div>
          </div>
        </section>

        {/* Brand Linter Alert */}
        <BrandLinterAlert 
          result={{
            score: 85,
            breaches: [],
            fixes: [],
            cta: "Continue with current action",
            has_metric: true,
            has_kpi: true,
            voice_compliant: true,
            structure_complete: true
          }}
        />
        </main>
    </>
  );
}
