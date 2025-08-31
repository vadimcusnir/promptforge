"use client";

import { useState } from "react";
import { ArrowRight, Zap, Cpu, Download, Crown, Brain, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * MainContentInteractive renders the core of the landing page when the site
 * is live. It showcases key features and provides a call to action for
 * users to explore the generator.
 */
export default function MainContentInteractive() {
  const [showDemo, setShowDemo] = useState(false);
  return (
    <section className="py-24 px-4 bg-pf-black text-center">
      <h2 className="text-4xl font-bold text-pf-text mb-4">Ce face PromptForge diferit?</h2>
      <p className="text-xl text-pf-text-muted mb-12 max-w-3xl mx-auto">
        De la idee la execuție: 50 module, motor 7D și export complet în <span className="text-gold-industrial">&lt;60s</span>.
      </p>
      {/* Feature cards */}
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="bg-pf-surface border-pf-text-muted/30 rounded-xl">
          <CardHeader>
            <Zap className="w-10 h-10 text-gold-industrial mx-auto mb-4" />
            <CardTitle className="text-xl text-pf-text">50 Module</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-pf-text-muted">
              Module optimizate pentru conținut, analiză, optimizare și integrare.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="bg-pf-surface border-pf-text-muted/30 rounded-xl">
          <CardHeader>
            <Cpu className="w-10 h-10 text-gold-industrial mx-auto mb-4" />
            <CardTitle className="text-xl text-pf-text">Motor 7D</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-pf-text-muted">
              Parametrizare avansată (domain, scale, urgency, complexity, resources, application, output).
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="bg-pf-surface border-pf-text-muted/30 rounded-xl">
          <CardHeader>
            <Download className="w-10 h-10 text-gold-industrial mx-auto mb-4" />
            <CardTitle className="text-xl text-pf-text">Export Bundle</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-pf-text-muted">
              Artefacte .txt, .md, .json, .pdf + manifest și checksum, toate într-un singur bundle.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
      {/* Call to action */}
      <div className="mt-16 space-y-6">
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-gold-industrial hover:bg-gold-industrial-dark text-pf-black font-bold px-8 py-4 text-lg transition-all shadow-[0_0_20px_rgba(209,169,84,0.3)] hover:shadow-[0_0_30px_rgba(209,169,84,0.5)] rounded-lg"
        >
          Accesează Dashboard-ul
          <ArrowRight className="w-5 h-5" />
        </a>
        
        {/* Advanced Features */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <a
            href="/pricing"
            className="inline-flex items-center px-6 py-3 bg-pf-surface border border-gold-industrial/30 text-gold-industrial font-medium rounded-lg hover:bg-gold-industrial/10 transition-colors"
          >
            <Crown className="w-4 h-4 mr-2" />
            Pricing Plans
          </a>
          <a
            href="/ai-editor"
            className="inline-flex items-center px-6 py-3 bg-pf-surface border border-purple-500/30 text-purple-400 font-medium rounded-lg hover:bg-purple-500/10 transition-colors"
          >
            <Brain className="w-4 h-4 mr-2" />
            AI Editor
          </a>
          <a
            href="/collaborate"
            className="inline-flex items-center px-6 py-3 bg-pf-surface border border-blue-500/30 text-blue-400 font-medium rounded-lg hover:bg-blue-500/10 transition-colors"
          >
            <Users className="w-4 h-4 mr-2" />
            Collaborate
          </a>
        </div>
        
        <div>
          <button
            onClick={() => setShowDemo(true)}
            className="text-pf-text-muted hover:text-pf-text underline"
          >
            Vezi demo interactiv
          </button>
        </div>
      </div>
      {showDemo && (
        <div className="mt-12 p-6 bg-pf-surface border border-pf-text-muted/30 rounded-lg">
          <p className="text-pf-text mb-4">Demo interactiv vine aici...</p>
          <button
            onClick={() => setShowDemo(false)}
            className="px-4 py-2 bg-pf-black border border-pf-text-muted/30 text-pf-text hover:text-gold-industrial"
          >
            Închide
          </button>
        </div>
      )}
    </section>
  );
}
