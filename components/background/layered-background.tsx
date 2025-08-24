"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useFpsTier } from "@/hooks/use-fps-tier";

interface BackgroundLine {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isHorizontal: boolean;
  oscillationX: number;
  oscillationY: number;
  phase: number;
  opacity: number;
}

interface GreenWord {
  id: string;
  text: string;
  x: number;
  y: number;
  oscillationX: number;
  oscillationY: number;
  scale: number;
  opacity: number;
  phase: number;
  glitchActive: boolean;
  glitchTimeout: number;
}

interface GeometricShape {
  id: string;
  type: "point" | "line" | "bar" | "circle";
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  opacity: number;
  color: string;
  phase: number;
}

interface OrangeQuote {
  id: string;
  text: string;
  x: number;
  y: number;
  currentText: string;
  charIndex: number;
  isVisible: boolean;
  isTyping: boolean;
  displayTime: number;
  opacity: number;
  scale: number;
}

const GREEN_WORDS = [
  "PROMPT",
  "FORGE",
  "SEMANTIC",
  "VECTOR",
  "PARAMETER",
  "ENGINE",
  "COGNITIVE",
  "NEURAL",
  "MATRIX",
  "ALGORITHM",
  "OPTIMIZE",
  "PROCESS",
  "ANALYZE",
  "COMPUTE",
  "EXECUTE",
  "VALIDATE",
  "TRANSFORM",
  "GENERATE",
  "CLASSIFY",
  "PREDICT",
];

const ORANGE_QUOTES = [
  "Time is your enemy, speed is your weapon",
  "The future belongs to those who prompt faster",
  "Every second counts in the AI revolution",
  "Precision beats power, timing beats speed",
  "Your competitor isn't smarter, just faster",
];

export function LayeredBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();
  const fpsTier = useFpsTier();

  const [lines, setLines] = useState<BackgroundLine[]>([]);
  const [words, setWords] = useState<GreenWord[]>([]);
  const [shapes, setShapes] = useState<GeometricShape[]>([]);
  const [quotes, setQuotes] = useState<OrangeQuote[]>([]);
  const [lastQuoteTime, setLastQuoteTime] = useState(0);
  const [quoteActive, setQuoteActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initLines = () => {
      const newLines: BackgroundLine[] = [];
      const density = reducedMotion
        ? 0
        : fpsTier === "hi"
          ? 15
          : fpsTier === "mid"
            ? 12
            : 8;

      for (let i = 0; i < density; i++) {
        const isHorizontal = Math.random() > 0.5;
        newLines.push({
          id: `line-${i}`,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          width: isHorizontal ? Math.random() * 200 + 100 : 1,
          height: isHorizontal ? 1 : Math.random() * 200 + 100,
          isHorizontal,
          oscillationX: Math.random() * 10 + 5,
          oscillationY: Math.random() * 10 + 5,
          phase: Math.random() * Math.PI * 2,
          opacity: Math.random() * 0.3 + 0.1,
        });
      }
      setLines(newLines);
    };

    const initWords = () => {
      const newWords: GreenWord[] = [];
      const isMobile = window.innerWidth < 768;
      let wordCount = 0;

      if (reducedMotion) {
        wordCount = 0;
      } else if (isMobile) {
        wordCount = fpsTier === "hi" ? 60 : fpsTier === "mid" ? 45 : 30;
      } else {
        wordCount = fpsTier === "hi" ? 100 : fpsTier === "mid" ? 75 : 50;
      }

      for (let i = 0; i < wordCount; i++) {
        newWords.push({
          id: `word-${i}`,
          text: GREEN_WORDS[Math.floor(Math.random() * GREEN_WORDS.length)],
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          oscillationX: Math.random() * 6 + 2,
          oscillationY: Math.random() * 6 + 2,
          scale: 1,
          opacity: Math.random() * 0.4 + 0.6,
          phase: Math.random() * Math.PI * 2,
          glitchActive: false,
          glitchTimeout: 0,
        });
      }
      setWords(newWords);
    };

    const initShapes = () => {
      const newShapes: GeometricShape[] = [];
      const isMobile = window.innerWidth < 768;
      let shapeCount = 0;

      if (reducedMotion) {
        shapeCount = 0;
      } else if (isMobile) {
        shapeCount = fpsTier === "hi" ? 14 : fpsTier === "mid" ? 10 : 6;
      } else {
        shapeCount = fpsTier === "hi" ? 24 : fpsTier === "mid" ? 18 : 12;
      }

      for (let i = 0; i < shapeCount; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        newShapes.push({
          id: `shape-${i}`,
          type: ["point", "line", "bar", "circle"][
            Math.floor(Math.random() * 4)
          ] as any,
          x,
          y,
          targetX: x,
          targetY: y,
          size: Math.random() * 20 + 5,
          opacity: Math.random() * 0.4 + 0.2,
          color: `hsl(${Math.random() * 60 + 180}, 50%, 60%)`,
          phase: Math.random() * Math.PI * 2,
        });
      }
      setShapes(newShapes);
    };

    initLines();
    initWords();
    initShapes();
  }, [fpsTier, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;

      lines.forEach((line) => {
        const oscillationX =
          Math.sin(timestamp * 0.00005 + line.phase) *
          (line.oscillationX * 0.3);
        const oscillationY =
          Math.cos(timestamp * 0.00005 + line.phase) *
          (line.oscillationY * 0.3);
        const luminance = 1;

        ctx.globalAlpha = line.opacity * luminance;
        ctx.beginPath();
        ctx.moveTo(line.x + oscillationX, line.y + oscillationY);
        ctx.lineTo(
          line.x + line.width + oscillationX,
          line.y + line.height + oscillationY,
        );
        ctx.stroke();
      });

      ctx.font = "11px monospace";
      ctx.fillStyle = "#00FF7F";

      words.forEach((word) => {
        const oscillationX =
          Math.sin(timestamp * 0.0001 + word.phase) * (word.oscillationX * 0.5);
        const oscillationY =
          Math.cos(timestamp * 0.0001 + word.phase) * (word.oscillationY * 0.5);
        const scale = 1 + Math.sin(timestamp * 0.0002 + word.phase) * 0.01;

        let baseOpacity =
          word.opacity + Math.sin(timestamp * 0.0003 + word.phase) * 0.1;
        if (quoteActive) {
          baseOpacity *= 0.7; // 30% reduction
        }

        if (!word.glitchActive && Math.random() < 0.00005) {
          word.glitchActive = true;
          word.glitchTimeout = timestamp + 80;
        }

        if (word.glitchActive && timestamp > word.glitchTimeout) {
          word.glitchActive = false;
        }

        ctx.save();
        ctx.translate(word.x + oscillationX, word.y + oscillationY);
        ctx.scale(scale, scale);
        ctx.globalAlpha = baseOpacity;

        if (word.glitchActive) {
          ctx.fillStyle = "#FF3030";
          ctx.fillText(word.text, Math.random() * 2 - 1, Math.random() * 2 - 1);
          ctx.fillStyle = "#00FF7F";
        }

        ctx.fillText(word.text, 0, 0);
        ctx.restore();
      });

      shapes.forEach((shape) => {
        const moveSpeed = 0.000008;
        const curveIntensity = 0.05;
        shape.targetX +=
          Math.sin(timestamp * moveSpeed + shape.phase) * curveIntensity;
        shape.targetY +=
          Math.cos(timestamp * moveSpeed + shape.phase * 1.3) * curveIntensity;

        shape.x += (shape.targetX - shape.x) * 0.008;
        shape.y += (shape.targetY - shape.y) * 0.008;

        const flicker = 0.9 + Math.sin(timestamp * 0.0002 + shape.phase) * 0.1;

        ctx.globalAlpha = shape.opacity * flicker;
        ctx.fillStyle = shape.color;
        ctx.strokeStyle = shape.color;

        switch (shape.type) {
          case "point":
            ctx.beginPath();
            ctx.arc(shape.x, shape.y, shape.size / 4, 0, Math.PI * 2);
            ctx.fill();
            break;
          case "line":
            ctx.beginPath();
            ctx.moveTo(shape.x, shape.y);
            ctx.lineTo(shape.x + shape.size, shape.y + shape.size / 2);
            ctx.stroke();
            break;
          case "bar":
            ctx.fillRect(shape.x, shape.y, shape.size, shape.size / 4);
            break;
          case "circle":
            ctx.beginPath();
            ctx.arc(shape.x, shape.y, shape.size / 2, 0, Math.PI * 2);
            ctx.stroke();
            break;
        }
      });

      const isMobile = window.innerWidth < 768;
      const quoteInterval = 18000; // Slightly longer interval
      const maxQuotes = isMobile ? 12 : 20;

      if (
        timestamp - lastQuoteTime > quoteInterval &&
        quotes.length < maxQuotes
      ) {
        const newQuote: OrangeQuote = {
          id: `quote-${timestamp}`,
          text: ORANGE_QUOTES[Math.floor(Math.random() * ORANGE_QUOTES.length)],
          x: window.innerWidth / 2 + (Math.random() * 400 - 200),
          y: window.innerHeight / 2 + (Math.random() * 300 - 150),
          currentText: "",
          charIndex: 0,
          isVisible: true,
          isTyping: true,
          displayTime: timestamp + 7000, // Longer display time
          opacity: 0,
          scale: 1,
        };
        setQuotes([newQuote]);
        setLastQuoteTime(timestamp);
        setQuoteActive(true);
      }

      const hasActiveQuotes = quotes.some((q) => q.opacity > 0);
      if (hasActiveQuotes !== quoteActive) {
        setQuoteActive(hasActiveQuotes);
      }

      quotes.forEach((quote, index) => {
        if (quote.isTyping && timestamp % 80 < 16) {
          if (quote.charIndex < quote.text.length) {
            quote.currentText = quote.text.substring(0, quote.charIndex + 1);
            quote.charIndex++;
          } else {
            quote.isTyping = false;
          }
        }

        if (quote.opacity < 1 && quote.isVisible) {
          quote.opacity = Math.min(1, quote.opacity + 0.015);
        }

        const pulse = 1 + Math.sin(timestamp * 0.001) * 0.02;
        const scale = quote.scale + Math.sin(timestamp * 0.0008) * 0.005;

        if (timestamp > quote.displayTime) {
          quote.opacity = Math.max(0, quote.opacity - 0.008);
          if (quote.opacity <= 0) {
            setQuotes((prev) => prev.filter((_, i) => i !== index));
          }
        }

        ctx.save();
        ctx.translate(quote.x, quote.y);
        ctx.scale(scale * pulse, scale * pulse);
        ctx.font = "bold 20px monospace";
        ctx.fillStyle = "#FF5A24";
        ctx.globalAlpha = quote.opacity;
        ctx.textAlign = "center";
        ctx.filter = `blur(${(1 - quote.opacity) * 1.5}px)`;

        ctx.fillText(quote.currentText, 0, 0);
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [lines, words, shapes, quotes, lastQuoteTime, reducedMotion, quoteActive]);

  if (reducedMotion) {
    return (
      <div className="fixed inset-0 bg-black opacity-10 pointer-events-none z-0" />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  );
}
