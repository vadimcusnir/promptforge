'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface RuneSymbol {
  symbol: string;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  rotation: number;
  glitch: boolean;
}

const RUNE_SYMBOLS = [
  '>',
  '|',
  '{',
  '}',
  '~',
  '[',
  ']',
  '(',
  ')',
  '<',
  '/',
  '\\',
  '^',
  '&',
  '*',
  '#',
];

export function DigitalRune() {
  const prefersReducedMotion = useReducedMotion();
  const [symbols, setSymbols] = useState<RuneSymbol[]>([]);
  const [centerSymbol, setCenterSymbol] = useState('>');

  useEffect(() => {
    if (prefersReducedMotion) {
      // Static version for reduced motion
      setSymbols([
        {
          symbol: '>',
          x: 50,
          y: 50,
          opacity: 0.8,
          scale: 2,
          rotation: 0,
          glitch: false,
        },
        {
          symbol: '|',
          x: 45,
          y: 50,
          opacity: 0.4,
          scale: 1.5,
          rotation: 0,
          glitch: false,
        },
        {
          symbol: '{',
          x: 55,
          y: 50,
          opacity: 0.4,
          scale: 1.5,
          rotation: 0,
          glitch: false,
        },
        {
          symbol: '~',
          x: 50,
          y: 45,
          opacity: 0.3,
          scale: 1.2,
          rotation: 0,
          glitch: false,
        },
      ]);
      return;
    }

    // Generate orbital symbols
    const orbitalSymbols: RuneSymbol[] = [];
    const numSymbols = 12;

    for (let i = 0; i < numSymbols; i++) {
      const angle = (i / numSymbols) * Math.PI * 2;
      const radius = 15 + Math.random() * 10;

      orbitalSymbols.push({
        symbol: RUNE_SYMBOLS[Math.floor(Math.random() * RUNE_SYMBOLS.length)],
        x: 50 + Math.cos(angle) * radius,
        y: 50 + Math.sin(angle) * radius,
        opacity: 0.2 + Math.random() * 0.4,
        scale: 0.8 + Math.random() * 0.6,
        rotation: Math.random() * 360,
        glitch: false,
      });
    }

    setSymbols(orbitalSymbols);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      // Rotate center symbol occasionally
      if (Math.random() < 0.1) {
        setCenterSymbol(RUNE_SYMBOLS[Math.floor(Math.random() * RUNE_SYMBOLS.length)]);
      }

      // Update orbital symbols
      setSymbols(prev =>
        prev.map(symbol => ({
          ...symbol,
          rotation: symbol.rotation + 0.5,
          opacity: Math.max(0.1, symbol.opacity + (Math.random() - 0.5) * 0.1),
          glitch: Math.random() < 0.02,
          symbol:
            symbol.glitch && Math.random() < 0.3
              ? RUNE_SYMBOLS[Math.floor(Math.random() * RUNE_SYMBOLS.length)]
              : symbol.symbol,
        }))
      );
    }, 100);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
      {/* Central Rune */}
      <div
        className="absolute text-6xl md:text-8xl font-mono font-bold text-[#d1a954] opacity-20"
        style={{
          textShadow: '0 0 30px rgba(209, 169, 84, 0.3)',
          filter: prefersReducedMotion ? 'none' : 'drop-shadow(0 0 20px rgba(209, 169, 84, 0.2))',
          transform: prefersReducedMotion ? 'none' : 'translateZ(0)',
          animation: prefersReducedMotion ? 'none' : 'pulse 4s ease-in-out infinite',
        }}
      >
        {centerSymbol}
      </div>

      {/* Orbital Symbols */}
      {symbols.map((symbol, index) => (
        <div
          key={index}
          className="absolute text-lg md:text-xl font-mono font-bold text-[#d1a954]"
          style={{
            left: `${symbol.x}%`,
            top: `${symbol.y}%`,
            opacity: symbol.opacity,
            transform: `translate(-50%, -50%) scale(${symbol.scale}) rotate(${symbol.rotation}deg) translateZ(0)`,
            textShadow: symbol.glitch
              ? '0 0 15px rgba(209, 169, 84, 0.8)'
              : '0 0 10px rgba(209, 169, 84, 0.4)',
            filter: symbol.glitch ? 'hue-rotate(45deg)' : 'none',
            transition: prefersReducedMotion ? 'none' : 'all 0.1s ease-out',
            willChange: prefersReducedMotion ? 'auto' : 'transform, opacity',
          }}
        >
          {symbol.symbol}
        </div>
      ))}

      {/* Connecting Lines (subtle) */}
      {!prefersReducedMotion && (
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.1 }}>
          {symbols.slice(0, 6).map((_, index) => {
            const nextIndex = (index + 1) % 6;
            const symbol1 = symbols[index];
            const symbol2 = symbols[nextIndex];

            if (!symbol1 || !symbol2) return null;

            return (
              <line
                key={`line-${index}`}
                x1={`${symbol1.x}%`}
                y1={`${symbol1.y}%`}
                x2={`${symbol2.x}%`}
                y2={`${symbol2.y}%`}
                stroke="rgba(209, 169, 84, 0.3)"
                strokeWidth="1"
                strokeDasharray="2,4"
              />
            );
          })}
        </svg>
      )}
    </div>
  );
}
