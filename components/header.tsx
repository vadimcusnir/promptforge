"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b border-pf-text-muted/30 bg-pf-surface/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-pf-text">
            PromptForge
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/dashboard" 
              className="text-pf-text-muted hover:text-pf-text transition-colors focus:outline-none focus:ring-2 focus:ring-gold-industrial focus:ring-offset-2 focus:ring-offset-pf-black rounded-sm"
            >
              Dashboard
            </Link>
            <Link 
              href="/pricing" 
              className="text-pf-text-muted hover:text-pf-text transition-colors focus:outline-none focus:ring-2 focus:ring-gold-industrial focus:ring-offset-2 focus:ring-offset-pf-black rounded-sm"
            >
              Pricing
            </Link>
            <Link 
              href="/ai-editor" 
              className="text-pf-text-muted hover:text-pf-text transition-colors focus:outline-none focus:ring-2 focus:ring-gold-industrial focus:ring-offset-2 focus:ring-offset-pf-black rounded-sm"
            >
              AI Editor
            </Link>
            <Link 
              href="/collaborate" 
              className="text-pf-text-muted hover:text-pf-text transition-colors focus:outline-none focus:ring-2 focus:ring-gold-industrial focus:ring-offset-2 focus:ring-offset-pf-black rounded-sm"
            >
              Collaborate
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="border-pf-text-muted/30 text-pf-text hover:bg-pf-text-muted/10 focus:ring-2 focus:ring-gold-industrial focus:ring-offset-2 focus:ring-offset-pf-black"
            >
              Sign In
            </Button>
            <Button 
              className="bg-gold-industrial text-pf-black hover:bg-gold-industrial-dark focus:ring-2 focus:ring-gold-industrial focus:ring-offset-2 focus:ring-offset-pf-black"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}