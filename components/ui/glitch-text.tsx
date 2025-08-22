"use client";

import { useState, useEffect } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  glitchChars?: string[];
  glitchRate?: number; // 0-1, probability per frame
  glitchDuration?: number; // ms
}

const DEFAULT_GLITCH_CHARS = [
  "Ψ",
  "Ω",
  "Φ",
  "Δ",
  "Λ",
  "Σ",
  "Θ",
  "Π",
  "∞",
  "∆",
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
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "X",
  "Y",
  "Z",
];

export function GlitchText({
  text,
  className = "",
  glitchChars = DEFAULT_GLITCH_CHARS,
  glitchRate = 0.02,
  glitchDuration = 150,
}: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [glitchingIndices, setGlitchingIndices] = useState<Set<number>>(
    new Set(),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      // Reset any currently glitching characters
      if (glitchingIndices.size > 0) {
        setDisplayText(text);
        setGlitchingIndices(new Set());
        return;
      }

      // Randomly select characters to glitch
      const newGlitchIndices = new Set<number>();
      const textArray = text.split("");

      textArray.forEach((char, index) => {
        if (char !== " " && Math.random() < glitchRate) {
          newGlitchIndices.add(index);
        }
      });

      if (newGlitchIndices.size > 0) {
        // Apply glitch characters
        const glitchedArray = textArray.map((char, index) => {
          if (newGlitchIndices.has(index)) {
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          }
          return char;
        });

        setDisplayText(glitchedArray.join(""));
        setGlitchingIndices(newGlitchIndices);

        // Restore original text after glitch duration
        setTimeout(() => {
          setDisplayText(text);
          setGlitchingIndices(new Set());
        }, glitchDuration);
      }
    }, 100); // Check every 100ms

    return () => clearInterval(interval);
  }, [text, glitchChars, glitchRate, glitchDuration, glitchingIndices.size]);

  // Reset display text when source text changes
  useEffect(() => {
    setDisplayText(text);
    setGlitchingIndices(new Set());
  }, [text]);

  return (
    <span
      className={`kw ${className}`}
      data-glitch={text}
      style={{
        transition: glitchingIndices.size > 0 ? "none" : "all 0.1s ease",
      }}
    >
      {displayText}
    </span>
  );
}
