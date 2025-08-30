"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

// Glitch SVG Component
const GlitchMask = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    <defs>
      <filter id="glitch" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
        <feColorMatrix
          type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 1 0"
        />
      </filter>
    </defs>
    <path
      d="M0,50 Q25,25 50,50 T100,50 L100,100 L0,100 Z"
      fill="url(#goldGradient)"
      filter="url(#glitch)"
      className="cyber-pulse"
    />
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d1a954" stopOpacity="0.3" />
        <stop offset="50%" stopColor="#b5965c" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#c7a869" stopOpacity="0.1" />
      </linearGradient>
    </defs>
  </svg>
);

// Pulsing LED Component
const PulsingLED = () => (
  <div className="fixed top-8 right-8 z-50">
    <div className="w-3 h-3 bg-[#d1a954] rounded-full cyber-pulse shadow-lg shadow-[#d1a954]/50" />
    <div className="absolute inset-0 w-3 h-3 bg-[#d1a954] rounded-full animate-ping opacity-75" />
  </div>
);

// Fractured Code Animation
const FracturedCode = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
    <div className="absolute top-20 left-10 font-mono text-xs text-[#d1a954] cyber-pulse">
      <span className="block">ERR_404</span>
      <span className="block">RITUAL_FAILED</span>
      <span className="block">PAGE_NOT_FOUND</span>
    </div>
    <div className="absolute bottom-20 right-10 font-mono text-xs text-[#d1a954] cyber-pulse delay-1000">
      <span className="block">FORGE_ACTIVE</span>
      <span className="block">PROMPT_READY</span>
      <span className="block">EVOLUTION_CONTINUES</span>
    </div>
    <div className="absolute top-1/2 left-1/4 font-mono text-xs text-[#d1a954] cyber-pulse delay-500">
      <span className="block">CYBER_RITUAL</span>
      <span className="block">BRUTALIST_DESIGN</span>
    </div>
  </div>
);

export default function NotFound() {
  const [countdown, setCountdown] = useState(15);
  const [showRedirect, setShowRedirect] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Start countdown for auto-redirect
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setShowRedirect(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Set timeout for actual redirect
    timeoutRef.current = setTimeout(() => {
      window.location.href = "/";
    }, 16000); // 15s + 1s for animation

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Reset countdown on user interaction
  const resetCountdown = () => {
    setCountdown(15);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      window.location.href = "/";
    }, 16000);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Elements */}
      <GlitchMask />
      <FracturedCode />
      <PulsingLED />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-1000">
          {/* Glitch H1 */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-[#d1a954] relative animate-in fade-in duration-1000 delay-300">
            <span className="block glitch-text" data-text="Ritual Failed:">Ritual Failed:</span>
            <span className="block glitch-text" data-text="Page Not Found">Page Not Found</span>
            {/* Enhanced glitch effect layers */}
            <span className="absolute inset-0 text-[#d1a954] opacity-75 blur-[1px] cyber-pulse">
              Ritual Failed: Page Not Found
            </span>
            <span className="absolute inset-0 text-[#d1a954] opacity-50 blur-[2px] translate-x-1 cyber-pulse delay-500">
              Ritual Failed: Page Not Found
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in duration-1000 delay-600">
            The prompt you seek does not exist. But the Forge remains.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8 animate-in slide-in-from-bottom-8 duration-1000 delay-900">
            {/* Primary CTA */}
            <Link
              href="/generator"
              onClick={resetCountdown}
              className="px-8 py-4 bg-[#d1a954] text-black font-bold text-lg rounded-lg hover:bg-[#b5965c] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#d1a954]/25 brutalist-border"
            >
              Return to Generator
            </Link>

            {/* Secondary CTA */}
            <Link
              href="/modules"
              onClick={resetCountdown}
              className="px-8 py-4 border-2 border-[#d1a954] text-[#d1a954] font-bold text-lg rounded-lg hover:bg-[#d1a954] hover:text-black transition-all duration-300 transform hover:scale-105 brutalist-border"
            >
              Browse Modules
            </Link>
          </div>

          {/* Microcopy */}
          <p className="text-sm text-gray-400 mb-8 max-w-md mx-auto animate-in fade-in duration-1000 delay-1200">
            Don't let a broken link halt your evolution.
          </p>

          {/* Countdown */}
          <div className="text-xs text-gray-500 mb-4 animate-in fade-in duration-1000 delay-1500 cyber-pulse">
            Auto-redirect in {countdown}s
          </div>
        </div>
      </div>

      {/* Redirect Animation Overlay */}
      {showRedirect && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center animate-in fade-in duration-500">
          <div className="text-center animate-in zoom-in duration-500">
            <div className="text-[#d1a954] text-4xl mb-4 cyber-pulse">
              ⚡
            </div>
            <p className="text-white text-xl mb-2">Redirecting to Forge...</p>
            <p className="text-gray-400 text-sm">Your evolution continues</p>
          </div>
        </div>
      )}
    </div>
  );
}
