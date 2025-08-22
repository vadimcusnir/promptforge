"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  ENHANCED_MATRIX_TOKENS,
  type EnhancedMatrixToken,
} from "@/lib/data/background-data";

interface MatrixTokenLayerProps {
  className?: string;
  style?: React.CSSProperties;
  tokenCount: number;
  driftSpeed: number;
  glitchEnabled: boolean;
  reducedMotion: boolean;
  isMobile: boolean;
}

interface ActiveToken extends EnhancedMatrixToken {
  id: string;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  glitchActive: boolean;
  animationDelay: number;
  lastUpdate: number;
  driftX: number;
  driftY: number;
  glitchTimeout?: NodeJS.Timeout;
}

export function MatrixTokenLayer({
  className = "",
  style,
  tokenCount,
  driftSpeed,
  glitchEnabled,
  reducedMotion,
  isMobile,
}: MatrixTokenLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tokens, setTokens] = useState<ActiveToken[]>([]);
  const animationRef = useRef<number>();
  const lastFrameTime = useRef<number>(0);

  // Initialize tokens
  const initializeTokens = useCallback(() => {
    if (!containerRef.current) return [];

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const { width, height } = rect;

    return Array.from({ length: tokenCount }, (_, index) => {
      const template =
        ENHANCED_MATRIX_TOKENS[index % ENHANCED_MATRIX_TOKENS.length];
      const token: ActiveToken = {
        id: `token-${index}`,
        ...template,
        x: Math.random() * width,
        y: Math.random() * height,
        opacity:
          Math.random() *
            (template.opacityRange[1] - template.opacityRange[0]) +
          template.opacityRange[0],
        scale: 0.8 + Math.random() * 0.4,
        glitchActive: false,
        animationDelay: Math.random() * 5000,
        lastUpdate: Date.now(),
        driftX: (Math.random() - 0.5) * 0.5,
        driftY: (Math.random() - 0.5) * 0.5,
      };
      return token;
    });
  }, [tokenCount]);

  // Animation loop
  const animate = useCallback(
    (currentTime: number) => {
      if (reducedMotion || driftSpeed === 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = currentTime - lastFrameTime.current;
      if (deltaTime < 16) {
        // ~60fps cap
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      lastFrameTime.current = currentTime;

      setTokens((prevTokens) =>
        prevTokens.map((token) => {
          const timeSinceUpdate = currentTime - token.lastUpdate;
          const driftMultiplier =
            driftSpeed * token.speed * (timeSinceUpdate / 1000);

          // Drift movement (12-18s cycle)
          const driftCycle =
            (currentTime / (15000 + Math.random() * 3000)) % (Math.PI * 2);
          const newX =
            token.x +
            Math.sin(driftCycle + token.animationDelay) *
              token.jitter *
              driftMultiplier;
          const newY =
            token.y +
            Math.cos(driftCycle + token.animationDelay) *
              token.jitter *
              driftMultiplier;

          // Opacity oscillation
          const opacityCycle =
            (currentTime / (8000 + Math.random() * 4000)) % (Math.PI * 2);
          const baseOpacity = Math.sin(opacityCycle) * 0.3 + 0.7;
          const newOpacity = Math.max(
            0.1,
            Math.min(
              1.0,
              baseOpacity * (token.opacityRange[1] - token.opacityRange[0]) +
                token.opacityRange[0],
            ),
          );

          // Random glitch effect (50-100ms duration)
          let glitchActive = token.glitchActive;
          if (glitchEnabled && !glitchActive && Math.random() < 0.0001) {
            glitchActive = true;
            setTimeout(
              () => {
                setTokens((prev) =>
                  prev.map((t) =>
                    t.id === token.id ? { ...t, glitchActive: false } : t,
                  ),
                );
              },
              50 + Math.random() * 50,
            );
          }

          return {
            ...token,
            x: newX,
            y: newY,
            opacity: glitchActive ? Math.random() * 0.8 + 0.2 : newOpacity,
            glitchActive,
            lastUpdate: currentTime,
          };
        }),
      );

      animationRef.current = requestAnimationFrame(animate);
    },
    [driftSpeed, glitchEnabled, reducedMotion],
  );

  // Initialize and start animation
  useEffect(() => {
    const newTokens = initializeTokens();
    setTokens(newTokens);

    if (!reducedMotion && driftSpeed > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initializeTokens, animate, reducedMotion, driftSpeed]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newTokens = initializeTokens();
      setTokens(newTokens);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initializeTokens]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        ...style,
        transform: "none", // Critical: no transforms
        willChange: "auto",
      }}
    >
      {tokens.map((token) => (
        <div
          key={token.id}
          className="absolute font-mono text-white/60 select-none pointer-events-none"
          style={{
            left: `${token.x}px`,
            top: `${token.y}px`,
            opacity: token.opacity,
            transform: `scale(${token.scale})`,
            fontSize: isMobile ? "10px" : "12px",
            fontWeight: Math.floor(token.weight * 900),
            textShadow: token.glitchActive
              ? `0 0 5px rgba(0, 255, 127, 0.8), 0 0 10px rgba(255, 90, 36, 0.6)`
              : "0 0 2px rgba(255, 255, 255, 0.3)",
            color: token.glitchActive
              ? `hsl(${Math.random() * 360}, 70%, 60%)`
              : "rgba(255, 255, 255, 0.6)",
            willChange: reducedMotion ? "auto" : "transform, opacity",
          }}
        >
          {token.text}
        </div>
      ))}
    </div>
  );
}
