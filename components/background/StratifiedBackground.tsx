"use client";

import { useEffect, useState } from "react";

interface StratifiedBackgroundProps {
  className?: string;
}

const AI_TOKENS = [
  "neural",
  "vector",
  "token",
  "layer",
  "weight",
  "bias",
  "epoch",
  "batch",
  "gradient",
  "backprop",
  "attention",
  "transformer",
  "embedding",
  "logit",
  "softmax",
  "relu",
  "lstm",
  "gru",
  "conv",
  "pool",
  "matrix",
  "tensor",
  "optimizer",
  "learning_rate",
  "dropout",
  "activation",
  "loss",
  "accuracy",
];

const RITUAL_QUOTES = [
  "The key is in not spending time, but in investing it.",
  "They always say time changes things, but you actually have to change them yourself.",
  "Lost time is never found again.",
  "In the middle of difficulty lies opportunity.",
  "The best way to predict the future is to create it.",
  "Innovation distinguishes between a leader and a follower.",
  "The only way to do great work is to love what you do.",
];

const GEOMETRIC_SHAPES = [
  "◊",
  "◆",
  "▲",
  "▼",
  "◄",
  "►",
  "●",
  "◯",
  "■",
  "□",
  "△",
  "▽",
  "◈",
  "◉",
];

export function StratifiedBackground({
  className = "",
}: StratifiedBackgroundProps) {
  const [tokens, setTokens] = useState<
    Array<{
      id: string;
      text: string;
      x: number;
      y: number;
      opacity: number;
      drift: number;
      speed: number;
    }>
  >([]);

  const [quotes, setQuotes] = useState<
    Array<{
      id: string;
      text: string;
      x: number;
      y: number;
      rotation: number;
      opacity: number;
      visible: boolean;
    }>
  >([]);

  const [shapes, setShapes] = useState<
    Array<{
      id: string;
      symbol: string;
      x: number;
      y: number;
      rotation: number;
      scale: number;
      opacity: number;
    }>
  >([]);

  // Initialize tokens
  useEffect(() => {
    const tokenArray = Array.from({ length: 25 }, (_, i) => ({
      id: `token-${i}`,
      text: AI_TOKENS[Math.floor(Math.random() * AI_TOKENS.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: 0.2 + Math.random() * 0.3,
      drift: Math.random() * 2 - 1,
      speed: 0.5 + Math.random() * 0.5,
    }));
    setTokens(tokenArray);

    const quoteArray = Array.from({ length: 5 }, (_, i) => ({
      id: `quote-${i}`,
      text: RITUAL_QUOTES[Math.floor(Math.random() * RITUAL_QUOTES.length)],
      x: 10 + Math.random() * 80,
      y: 15 + Math.random() * 70,
      rotation: Math.random() * 30 - 15,
      opacity: 0.3 + Math.random() * 0.2,
      visible: Math.random() > 0.7,
    }));
    setQuotes(quoteArray);

    const shapeArray = Array.from({ length: 15 }, (_, i) => ({
      id: `shape-${i}`,
      symbol:
        GEOMETRIC_SHAPES[Math.floor(Math.random() * GEOMETRIC_SHAPES.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 1,
      opacity: 0.1 + Math.random() * 0.2,
    }));
    setShapes(shapeArray);
  }, []);

  // Animate tokens
  useEffect(() => {
    const interval = setInterval(() => {
      setTokens((prev) =>
        prev.map((token) => ({
          ...token,
          x: (token.x + token.drift * token.speed + 100) % 100,
          y:
            (token.y +
              Math.sin(Date.now() / 10000 + token.id.charCodeAt(5)) * 0.1 +
              100) %
            100,
          opacity: Math.max(
            0.1,
            Math.min(0.5, token.opacity + (Math.random() - 0.5) * 0.02),
          ),
        })),
      );
    }, 150);

    return () => clearInterval(interval);
  }, []);

  // Animate quotes (fade in/out)
  useEffect(() => {
    const interval = setInterval(() => {
      setQuotes((prev) =>
        prev.map((quote) => ({
          ...quote,
          visible: Math.random() > 0.85 ? !quote.visible : quote.visible,
          opacity: quote.visible ? 0.3 + Math.random() * 0.2 : 0.1,
        })),
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Animate shapes
  useEffect(() => {
    const interval = setInterval(() => {
      setShapes((prev) =>
        prev.map((shape) => ({
          ...shape,
          rotation: (shape.rotation + 0.5) % 360,
          scale:
            0.5 +
            Math.sin(Date.now() / 8000 + shape.id.charCodeAt(6)) * 0.3 +
            0.5,
        })),
      );
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: -1 }}
    >
      {/* Layer 1: Grid Lines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Layer 2: Matrix Tokens (Green) */}
      <div className="absolute inset-0">
        {tokens.map((token) => (
          <div
            key={token.id}
            className="absolute text-xs font-mono text-[#00FF7F] transition-all duration-300"
            style={{
              left: `${token.x}%`,
              top: `${token.y}%`,
              opacity: token.opacity,
              transform: `translate(-50%, -50%)`,
            }}
          >
            {token.text}
          </div>
        ))}
      </div>

      {/* Layer 3: Geometric Figures */}
      <div className="absolute inset-0">
        {shapes.map((shape) => (
          <div
            key={shape.id}
            className="absolute text-lg text-[#FFD700] transition-all duration-500"
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              opacity: shape.opacity,
              transform: `translate(-50%, -50%) rotate(${shape.rotation}deg) scale(${shape.scale})`,
            }}
          >
            {shape.symbol}
          </div>
        ))}
      </div>

      {/* Layer 4: Narrative Quotes (Orange) */}
      <div className="absolute inset-0">
        {quotes.map((quote) => (
          <div
            key={quote.id}
            className={`absolute text-xs font-mono text-[#FF8C42] max-w-xs transition-all duration-1000 ${
              quote.visible ? "opacity-100" : "opacity-0"
            }`}
            style={{
              left: `${quote.x}%`,
              top: `${quote.y}%`,
              transform: `translate(-50%, -50%) rotate(${quote.rotation}deg)`,
              opacity: quote.visible ? quote.opacity : 0,
            }}
          >
            "{quote.text}"
          </div>
        ))}
      </div>

      {/* Subtle overlay gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/20"
        style={{ mixBlendMode: "multiply" }}
      />
    </div>
  );
}
