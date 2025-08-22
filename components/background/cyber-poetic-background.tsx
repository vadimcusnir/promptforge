"use client";

import { useEffect, useState, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useFpsTier } from "@/hooks/use-fps-tier";
import {
  useBackgroundOrchestrator,
  type LayerConfig,
} from "@/lib/background/orchestrator";
import {
  ENHANCED_MATRIX_TOKENS,
  ENHANCED_NARRATIVE_QUOTES,
  type EnhancedMatrixToken,
  type EnhancedNarrativeQuote,
  type EnhancedGeometricFigure,
} from "@/lib/data/background-data";

interface GridLine {
  id: string;
  type: "horizontal" | "vertical";
  position: number;
  offset: number;
  opacity: number;
  animationDelay: number;
}

interface MatrixToken {
  id: string;
  text: string;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  glitchActive: boolean;
  animationDelay: number;
}

interface GeometricFigure {
  id: string;
  type: "point" | "line" | "bar" | "triangle";
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation: number;
  opacity: number;
  color: string;
  animationDelay: number;
}

interface NarrativeQuote {
  id: string;
  text: string;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  currentChar: number;
  isActive: boolean;
  animationType: "matrix" | "typing" | "glitch";
  animationDelay: number;
}

const AI_ML_TERMS = [
  "NEURAL",
  "TENSOR",
  "GRADIENT",
  "BACKPROP",
  "SIGMOID",
  "RELU",
  "LSTM",
  "GAN",
  "CNN",
  "RNN",
  "TRANSFORMER",
  "ATTENTION",
  "EMBEDDING",
  "TOKENIZER",
  "PROMPT",
  "FINE-TUNE",
  "INFERENCE",
  "LATENT",
  "VECTOR",
  "SEMANTIC",
  "COGNITIVE",
  "PARAMETER",
  "WEIGHT",
  "BIAS",
  "EPOCH",
  "BATCH",
  "LEARNING_RATE",
  "OPTIMIZER",
  "LOSS",
  "ACCURACY",
  "PRECISION",
  "RECALL",
  "F1_SCORE",
  "OVERFITTING",
  "REGULARIZATION",
  "DROPOUT",
  "NORMALIZATION",
  "ACTIVATION",
  "CONVOLUTION",
  "POOLING",
  "FLATTEN",
  "DENSE",
  "SPARSE",
  "AUTOENCODER",
  "VAE",
  "DIFFUSION",
  "STABLE",
  "CLIP",
  "BERT",
  "GPT",
  "T5",
  "LLAMA",
  "PALM",
  "GEMINI",
  "MULTIMODAL",
  "VISION",
  "NLP",
  "ASR",
  "TTS",
  "OCR",
  "YOLO",
  "RESNET",
  "UNET",
  "PYTORCH",
  "TENSORFLOW",
  "KERAS",
  "HUGGINGFACE",
  "WANDB",
  "MLFLOW",
  "CUDA",
  "TPU",
  "DISTRIBUTED",
  "FEDERATED",
  "REINFORCEMENT",
  "Q_LEARNING",
  "POLICY",
  "REWARD",
  "AGENT",
  "ENVIRONMENT",
  "STATE",
  "ACTION",
  "EXPLORATION",
  "EXPLOITATION",
  "MONTE_CARLO",
  "MARKOV",
  "BAYESIAN",
  "GAUSSIAN",
  "CLUSTERING",
  "CLASSIFICATION",
  "REGRESSION",
  "SUPERVISED",
  "UNSUPERVISED",
  "SEMI_SUPERVISED",
  "SELF_SUPERVISED",
  "ZERO_SHOT",
  "FEW_SHOT",
  "IN_CONTEXT",
  "CHAIN_OF_THOUGHT",
  "REASONING",
  "ALIGNMENT",
  "RLHF",
];

const NARRATIVE_QUOTES = [
  "The future belongs to those who understand the language of machines",
  "Every algorithm is a poem written in the syntax of possibility",
  "In the space between human thought and artificial intelligence lies infinite potential",
  "Code is poetry, data is truth, AI is the bridge between worlds",
  "The most powerful prompts are born from the marriage of creativity and precision",
  "Intelligence amplified, creativity unleashed, humanity enhanced",
  "We are not replacing human intelligence, we are expanding it",
  "The next revolution will be cognitive, not technological",
];

export function CyberPoeticBackground() {
  const prefersReducedMotion = useReducedMotion();
  const fpsTier = useFpsTier();
  const { context, registerLayer, startLayer, stopLayer, getLayerState } =
    useBackgroundOrchestrator();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [gridLines, setGridLines] = useState<GridLine[]>([]);
  const [matrixTokens, setMatrixTokens] = useState<EnhancedMatrixToken[]>([]);
  const [geometricFigures, setGeometricFigures] = useState<
    EnhancedGeometricFigure[]
  >([]);
  const [narrativeQuotes, setNarrativeQuotes] = useState<
    EnhancedNarrativeQuote[]
  >([]);
  const [activeQuoteCount, setActiveQuoteCount] = useState(0);

  const getMotionLevel = () => {
    if (!context) return "static";

    if (context.motion === "static") return "static";
    if (context.interaction.inputFocused || !context.interaction.tabActive)
      return "soft";
    if (context.performance.tier === "low") return "soft";

    return "full";
  };

  const getDensities = () => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const motionLevel = getMotionLevel();
    const performanceMultiplier =
      fpsTier === "hi" ? 1 : fpsTier === "mid" ? 0.7 : 0.5;

    if (motionLevel === "static") {
      return {
        gridLines: 0,
        matrixTokens: 0,
        geometricFigures: 0,
        narrativeQuotes: 0,
      };
    }

    if (motionLevel === "soft") {
      return {
        gridLines: Math.floor((isMobile ? 8 : 12) * performanceMultiplier),
        matrixTokens: Math.floor((isMobile ? 20 : 30) * performanceMultiplier),
        geometricFigures: 0, // No geometric figures in soft mode
        narrativeQuotes: isMobile ? 3 : 5,
      };
    }

    return {
      gridLines: Math.floor((isMobile ? 20 : 30) * performanceMultiplier),
      matrixTokens: Math.floor((isMobile ? 60 : 100) * performanceMultiplier), // Exact specs: ~100 desktop, ~60 mobile
      geometricFigures: Math.floor((isMobile ? 8 : 15) * performanceMultiplier), // Reduced for "medium" analytical figures
      narrativeQuotes: isMobile ? 8 : 15, // Reduced for rarer quotes
    };
  };

  useEffect(() => {
    const layers: LayerConfig[] = [
      {
        id: "grid-lines",
        priority: 1,
        enabled: true,
        state: "inactive",
        performanceBudget: { maxMemoryMB: 10, maxCpuPercent: 5, targetFPS: 60 },
      },
      {
        id: "matrix-tokens",
        priority: 2,
        enabled: true,
        state: "inactive",
        performanceBudget: {
          maxMemoryMB: 30,
          maxCpuPercent: 15,
          targetFPS: 60,
        },
      },
      {
        id: "geometric-figures",
        priority: 3,
        enabled: true,
        state: "inactive",
        performanceBudget: {
          maxMemoryMB: 20,
          maxCpuPercent: 10,
          targetFPS: 60,
        },
      },
      {
        id: "narrative-quotes",
        priority: 4,
        enabled: true,
        state: "inactive",
        performanceBudget: { maxMemoryMB: 15, maxCpuPercent: 8, targetFPS: 60 },
      },
    ];

    layers.forEach(registerLayer);
  }, [registerLayer]);

  useEffect(() => {
    const initAttempts = [0, 100, 300];
    let attemptIndex = 0;

    const tryInitialize = async () => {
      if (containerRef.current && !isInitialized) {
        try {
          await startLayer("grid-lines");
          await startLayer("matrix-tokens");
          await startLayer("geometric-figures");
          await startLayer("narrative-quotes");
          setIsInitialized(true);
          return;
        } catch (error) {
          console.error("[v0] Layer initialization failed:", error);
        }
      }

      attemptIndex++;
      if (attemptIndex < initAttempts.length) {
        setTimeout(tryInitialize, initAttempts[attemptIndex]);
      }
    };

    tryInitialize();
  }, [isInitialized, startLayer]);

  useEffect(() => {
    const motionLevel = getMotionLevel();
    if (motionLevel === "static" || !isInitialized) return;

    const densities = getDensities();
    const lines: GridLine[] = [];

    // Horizontal lines with 150ms delay
    setTimeout(() => {
      for (let i = 0; i < densities.gridLines / 2; i++) {
        setTimeout(() => {
          lines.push({
            id: `h-${i}`,
            type: "horizontal",
            position: Math.random() * 100,
            offset: 0,
            opacity: 0.1 + Math.random() * 0.15,
            animationDelay: i * 150,
          });
          if (i === Math.floor(densities.gridLines / 2) - 1) {
            setGridLines((prev) => [...prev, ...lines]);
          }
        }, i * 50); // Stagger individual line creation
      }
    }, 150);

    // Vertical lines with 350ms delay
    setTimeout(() => {
      const vLines: GridLine[] = [];
      for (let i = 0; i < densities.gridLines / 2; i++) {
        setTimeout(() => {
          vLines.push({
            id: `v-${i}`,
            type: "vertical",
            position: Math.random() * 100,
            offset: 0,
            opacity: 0.1 + Math.random() * 0.15,
            animationDelay: i * 350,
          });
          if (i === Math.floor(densities.gridLines / 2) - 1) {
            setGridLines((prev) => [...prev, ...vLines]);
          }
        }, i * 50);
      }
    }, 350);
  }, [isInitialized, context]);

  useEffect(() => {
    const motionLevel = getMotionLevel();
    if (motionLevel === "static" || !isInitialized) return;

    setTimeout(() => {
      const densities = getDensities();
      const tokens: EnhancedMatrixToken[] = [];

      for (let i = 0; i < densities.matrixTokens; i++) {
        setTimeout(() => {
          const template =
            ENHANCED_MATRIX_TOKENS[
              Math.floor(Math.random() * ENHANCED_MATRIX_TOKENS.length)
            ];

          // Only spawn if rarity check passes
          if (Math.random() > template.rarity) return;

          tokens.push({
            ...template,
            id: `token-${i}`,
            x: Math.random() * 100,
            y: Math.random() * 100,
            opacity:
              template.opacityRange[0] +
              Math.random() *
                (template.opacityRange[1] - template.opacityRange[0]),
            scale: 0.8 + Math.random() * 0.4,
            glitchActive: false,
            animationDelay: Math.random() * 5000,
          });

          if (tokens.length >= densities.matrixTokens * 0.8) {
            // Account for rarity filtering
            setMatrixTokens(tokens);
          }
        }, i * 100);
      }
    }, 200);
  }, [isInitialized, context]);

  // Initialize geometric figures
  useEffect(() => {
    if (prefersReducedMotion || !isInitialized) return;

    const densities = getDensities();
    const figures: EnhancedGeometricFigure[] = [];
    const figureTypes: EnhancedGeometricFigure["type"][] = [
      "point",
      "line",
      "bar",
      "triangle",
    ];
    const colors = [
      "rgba(255, 255, 255, 0.3)",
      "rgba(0, 255, 127, 0.2)",
      "rgba(255, 90, 36, 0.2)",
    ];

    for (let i = 0; i < densities.geometricFigures; i++) {
      const type = figureTypes[Math.floor(Math.random() * figureTypes.length)];
      figures.push({
        id: `figure-${i}`,
        type,
        x: Math.random() * 100,
        y: Math.random() * 100,
        width:
          type === "line" ? 20 + Math.random() * 40 : 2 + Math.random() * 8,
        height:
          type === "bar" ? 10 + Math.random() * 30 : 2 + Math.random() * 8,
        rotation: Math.random() * 360,
        opacity: 0.3 + Math.random() * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        animationDelay: Math.random() * 8000,
      });
    }

    setGeometricFigures(figures);
  }, [prefersReducedMotion, fpsTier, isInitialized]);

  useEffect(() => {
    const motionLevel = getMotionLevel();
    if (motionLevel === "static" || !isInitialized) return;

    const densities = getDensities();
    const quotes: EnhancedNarrativeQuote[] = [];

    for (let i = 0; i < densities.narrativeQuotes; i++) {
      const template =
        ENHANCED_NARRATIVE_QUOTES[
          Math.floor(Math.random() * ENHANCED_NARRATIVE_QUOTES.length)
        ];

      // Corner positioning based on template
      const cornerPositions = {
        "top-left": { x: 5 + Math.random() * 15, y: 5 + Math.random() * 15 },
        "top-right": { x: 75 + Math.random() * 20, y: 5 + Math.random() * 15 },
        "bottom-left": {
          x: 5 + Math.random() * 15,
          y: 75 + Math.random() * 20,
        },
        "bottom-right": {
          x: 75 + Math.random() * 20,
          y: 75 + Math.random() * 20,
        },
        center: { x: 40 + Math.random() * 20, y: 40 + Math.random() * 20 },
      };

      const position = cornerPositions[template.corner];

      quotes.push({
        ...template,
        id: `quote-${i}`,
        x: position.x,
        y: position.y,
        opacity: 0,
        scale: 1,
        currentChar: 0,
        isActive: false,
        animationDelay: i * template.preDelay + Math.random() * 20000, // Rare quotes: 1/20s timing
      });
    }

    setNarrativeQuotes(quotes);
  }, [isInitialized, context]);

  // Animate grid lines
  useEffect(() => {
    if (prefersReducedMotion || gridLines.length === 0) return;

    const interval = setInterval(() => {
      setGridLines((prev) =>
        prev.map((line) => ({
          ...line,
          // 12-18s drift with ±5-10px oscillation
          offset:
            Math.sin(Date.now() / 15000 + line.animationDelay / 1000) *
            (5 + Math.random() * 5),
          // 12-20s luminosity pulse
          opacity:
            0.1 +
            Math.sin(Date.now() / 16000 + line.animationDelay / 1000) * 0.1,
        })),
      );
    }, 100);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, gridLines.length]);

  // Animate matrix tokens
  useEffect(() => {
    if (prefersReducedMotion || matrixTokens.length === 0) return;

    const interval = setInterval(() => {
      setMatrixTokens((prev) =>
        prev.map((token) => {
          const shouldGlitch = Math.random() < 0.02;
          const opacityReduction = activeQuoteCount > 0 ? 0.3 : 0;

          // 700-1200ms glide timing for smooth drift
          const driftX =
            Math.sin(Date.now() / 1000 + token.animationDelay / 1000) * 0.5;
          const driftY =
            Math.cos(Date.now() / 1200 + token.animationDelay / 1000) * 0.3;

          return {
            ...token,
            x: Math.max(0, Math.min(100, token.x + driftX)),
            y: Math.max(0, Math.min(100, token.y + driftY)),
            opacity: Math.max(
              0.1,
              (0.7 +
                Math.sin(Date.now() / 6000 + token.animationDelay / 1000) *
                  0.3) *
                (1 - opacityReduction),
            ),
            scale:
              0.8 +
              Math.sin(Date.now() / 4000 + token.animationDelay / 1000) * 0.2,
            glitchActive: shouldGlitch,
            text:
              shouldGlitch && Math.random() < 0.5
                ? AI_ML_TERMS[Math.floor(Math.random() * AI_ML_TERMS.length)]
                : token.text,
          };
        }),
      );
    }, 150);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, matrixTokens.length, activeQuoteCount]);

  // Animate geometric figures
  useEffect(() => {
    if (prefersReducedMotion || geometricFigures.length === 0) return;

    const interval = setInterval(() => {
      setGeometricFigures((prev) =>
        prev.map((figure) => ({
          ...figure,
          x:
            figure.x +
            Math.sin(Date.now() / 15000 + figure.animationDelay / 1000) * 0.2,
          y:
            figure.y +
            Math.cos(Date.now() / 18000 + figure.animationDelay / 1000) * 0.15,
          rotation: figure.rotation + 0.5,
          opacity:
            0.3 +
            Math.sin(Date.now() / 8000 + figure.animationDelay / 1000) * 0.2,
        })),
      );
    }, 200);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, geometricFigures.length]);

  // Animate narrative quotes
  useEffect(() => {
    if (prefersReducedMotion || narrativeQuotes.length === 0) return;

    const interval = setInterval(() => {
      setNarrativeQuotes((prev) => {
        let activeCount = 0;
        const updated = prev.map((quote) => {
          const timeSinceStart = Date.now() - quote.animationDelay;
          const shouldBeActive = timeSinceStart > 0 && timeSinceStart < 8000;

          if (shouldBeActive) {
            activeCount++;
            const progress = Math.min(1, timeSinceStart / 2000);
            const charProgress = Math.floor(progress * quote.text.length);

            return {
              ...quote,
              isActive: true,
              opacity: Math.min(1, progress * 2),
              scale: 1 + Math.sin(timeSinceStart / 1000) * 0.02,
              currentChar: charProgress,
            };
          } else if (quote.isActive && timeSinceStart >= 8000) {
            const fadeProgress = Math.min(1, (timeSinceStart - 8000) / 2000); // Smoother, longer fade
            const easedFade =
              fadeProgress * fadeProgress * (3 - 2 * fadeProgress); // Smooth ease-in-out
            return {
              ...quote,
              opacity: Math.max(0, 1 - easedFade),
              scale: 1 + easedFade * 0.05, // Gentler scale change
              isActive: timeSinceStart < 10000, // Longer fade duration
            };
          }

          return quote;
        });

        setActiveQuoteCount(activeCount);
        return updated;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, narrativeQuotes.length]);

  if (getMotionLevel() === "static") {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a] z-0">
        <div className="absolute inset-0 opacity-5">
          <div className="max-w-[1440px] mx-auto h-full grid grid-cols-12 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-r border-white/10 h-full" />
            ))}
          </div>
        </div>
        {/* Static quote display */}
        <div className="absolute top-10 left-10 text-sm text-orange-400 opacity-60 max-w-xs">
          The prompt is the silent key that makes AI open the door exactly where
          you want to enter.
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden"
      style={{
        backgroundColor: "#0a0a0a",
        willChange: "transform",
        transform: "translateZ(0)",
      }}
    >
      {/* Layer 2: Grid Lines - z-index 1 */}
      <div
        className="absolute inset-0"
        style={{ zIndex: 1, willChange: "transform" }}
      >
        {gridLines.map((line) => (
          <div
            key={line.id}
            className={`absolute ${line.type === "horizontal" ? "w-full h-px" : "w-px h-full"}`}
            style={{
              [line.type === "horizontal" ? "top" : "left"]:
                `${line.position}%`,
              transform: `translate${line.type === "horizontal" ? "Y" : "X"}(${line.offset}px) translateZ(0)`,
              backgroundColor: `rgba(255, 255, 255, ${line.opacity})`,
              willChange: "transform, opacity",
              transition: "all 0.1s linear",
            }}
          />
        ))}
      </div>

      {/* Layer 3: Matrix Tokens - z-index 2 */}
      <div
        className="absolute inset-0"
        style={{ zIndex: 2, willChange: "transform" }}
      >
        {matrixTokens.map((token) => (
          <div
            key={token.id}
            className={`absolute text-xs font-mono font-bold pointer-events-none select-none ${
              token.glitchActive ? "animate-pulse" : ""
            }`}
            style={{
              left: `${token.x}%`,
              top: `${token.y}%`,
              transform: `scale(${token.scale}) translateZ(0)`,
              opacity: token.opacity,
              color: "#4ade80", // text-green-300 equivalent
              textShadow: token.glitchActive
                ? "0 0 10px #4ade80"
                : "0 0 5px #4ade80",
              willChange: "transform, opacity",
              filter: token.glitchActive ? "hue-rotate(90deg)" : "none",
              transition: "all 0.15s ease-out",
            }}
          >
            {token.text}
          </div>
        ))}
      </div>

      {/* Layer 4: Geometric Figures - z-index 3 */}
      <div
        className="absolute inset-0"
        style={{ zIndex: 3, willChange: "transform" }}
      >
        {geometricFigures.map((figure) => (
          <div
            key={figure.id}
            className="absolute pointer-events-none"
            style={{
              left: `${figure.x}%`,
              top: `${figure.y}%`,
              width: `${figure.width}px`,
              height: `${figure.height}px`,
              transform: `rotate(${figure.rotation}deg) translateZ(0)`,
              opacity: figure.opacity,
              backgroundColor: figure.color,
              borderRadius: figure.type === "point" ? "50%" : "0",
              willChange: "transform, opacity",
              transition: "all 0.2s ease-out",
            }}
          />
        ))}
      </div>

      {/* Layer 5: Background Narrative - z-index 4 (explicit over Figures) */}
      <div
        className="absolute inset-0"
        style={{ zIndex: 4, willChange: "transform" }}
      >
        {narrativeQuotes.map(
          (quote) =>
            quote.isActive && (
              <div
                key={quote.id}
                className="absolute text-sm md:text-base font-bold pointer-events-none select-none max-w-xs"
                style={{
                  left: `${quote.x}%`,
                  top: `${quote.y}%`,
                  transform: `scale(${quote.scale}) translateZ(0)`,
                  opacity: quote.opacity,
                  color: "#FF5A24",
                  textShadow: "0 0 15px rgba(255, 90, 36, 0.5)",
                  willChange: "transform, opacity",
                  filter:
                    quote.animationType === "glitch" && Math.random() < 0.1
                      ? "hue-rotate(45deg)"
                      : "none",
                  transition: "all 0.3s ease-out",
                }}
                aria-label={`Narrative quote: ${quote.text}`}
              >
                {quote.text.substring(0, quote.currentChar)}
                {quote.currentChar < quote.text.length && (
                  <span className="animate-pulse">|</span>
                )}
              </div>
            ),
        )}
      </div>

      {/* Layer 6: Noise Overlay - z-index 5 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 5,
          background:
            "radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.1) 100%)",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
