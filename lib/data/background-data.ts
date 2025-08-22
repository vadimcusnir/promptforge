export interface EnhancedMatrixToken {
  id: string;
  text: string;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  weight: number; // 0.1-1.0 for visual prominence
  speed: number; // 0.5-2.0 multiplier for animation speed
  rarity: number; // 0.1-1.0 probability of appearance
  jitter: number; // 0-1.0 random movement intensity
  opacityRange: [number, number]; // min/max opacity values
  glitchActive: boolean;
  animationDelay: number;
}

export interface EnhancedNarrativeQuote {
  id: string;
  text: string;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  currentChar: number;
  isActive: boolean;
  style: "matrix" | "typing" | "glitch";
  corner: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  preDelay: number; // ms before animation starts
  hold: number; // ms to hold at full visibility
  out: number; // ms for fade out animation
  priority: number; // 1-10 for display priority
  cooldown: number; // ms before can appear again
  animationDelay: number;
}

export interface EnhancedGeometricFigure {
  id: string;
  shape: "point" | "line" | "bar" | "triangle" | "circle" | "square";
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation: number;
  opacity: number;
  color: string;
  path: "linear" | "circular" | "figure8" | "spiral" | "random";
  duration: number; // ms for one complete path cycle
  variance: number; // 0-1.0 random deviation from path
  z: number; // z-index within layer
  blend: "normal" | "multiply" | "screen" | "overlay";
  animationDelay: number;
}

// Enhanced AI/ML terms with metadata
export const ENHANCED_MATRIX_TOKENS: Omit<
  EnhancedMatrixToken,
  "id" | "x" | "y" | "opacity" | "scale" | "glitchActive" | "animationDelay"
>[] = [
  {
    text: "NEURAL",
    weight: 0.9,
    speed: 1.0,
    rarity: 0.8,
    jitter: 0.3,
    opacityRange: [0.6, 1.0],
  },
  {
    text: "TENSOR",
    weight: 0.8,
    speed: 1.2,
    rarity: 0.7,
    jitter: 0.2,
    opacityRange: [0.5, 0.9],
  },
  {
    text: "GRADIENT",
    weight: 0.7,
    speed: 0.9,
    rarity: 0.6,
    jitter: 0.4,
    opacityRange: [0.4, 0.8],
  },
  {
    text: "TRANSFORMER",
    weight: 1.0,
    speed: 0.8,
    rarity: 0.9,
    jitter: 0.1,
    opacityRange: [0.7, 1.0],
  },
  {
    text: "ATTENTION",
    weight: 0.9,
    speed: 1.1,
    rarity: 0.8,
    jitter: 0.2,
    opacityRange: [0.6, 0.9],
  },
  {
    text: "EMBEDDING",
    weight: 0.6,
    speed: 1.3,
    rarity: 0.5,
    jitter: 0.5,
    opacityRange: [0.3, 0.7],
  },
  {
    text: "PROMPT",
    weight: 1.0,
    speed: 0.7,
    rarity: 1.0,
    jitter: 0.1,
    opacityRange: [0.8, 1.0],
  },
  {
    text: "INFERENCE",
    weight: 0.8,
    speed: 1.0,
    rarity: 0.7,
    jitter: 0.3,
    opacityRange: [0.5, 0.8],
  },
  {
    text: "LATENT",
    weight: 0.7,
    speed: 1.4,
    rarity: 0.6,
    jitter: 0.4,
    opacityRange: [0.4, 0.7],
  },
  {
    text: "VECTOR",
    weight: 0.8,
    speed: 1.1,
    rarity: 0.7,
    jitter: 0.2,
    opacityRange: [0.5, 0.8],
  },
  {
    text: "SEMANTIC",
    weight: 0.9,
    speed: 0.9,
    rarity: 0.8,
    jitter: 0.2,
    opacityRange: [0.6, 0.9],
  },
  {
    text: "COGNITIVE",
    weight: 1.0,
    speed: 0.8,
    rarity: 0.9,
    jitter: 0.1,
    opacityRange: [0.7, 1.0],
  },
  {
    text: "PARAMETER",
    weight: 0.7,
    speed: 1.2,
    rarity: 0.6,
    jitter: 0.3,
    opacityRange: [0.4, 0.7],
  },
  {
    text: "WEIGHT",
    weight: 0.6,
    speed: 1.3,
    rarity: 0.5,
    jitter: 0.4,
    opacityRange: [0.3, 0.6],
  },
  {
    text: "BIAS",
    weight: 0.5,
    speed: 1.4,
    rarity: 0.4,
    jitter: 0.5,
    opacityRange: [0.2, 0.5],
  },
  {
    text: "EPOCH",
    weight: 0.6,
    speed: 1.1,
    rarity: 0.5,
    jitter: 0.3,
    opacityRange: [0.3, 0.6],
  },
  {
    text: "BATCH",
    weight: 0.5,
    speed: 1.3,
    rarity: 0.4,
    jitter: 0.4,
    opacityRange: [0.2, 0.5],
  },
  {
    text: "OPTIMIZER",
    weight: 0.7,
    speed: 1.0,
    rarity: 0.6,
    jitter: 0.2,
    opacityRange: [0.4, 0.7],
  },
  {
    text: "LOSS",
    weight: 0.6,
    speed: 1.2,
    rarity: 0.5,
    jitter: 0.3,
    opacityRange: [0.3, 0.6],
  },
  {
    text: "ACCURACY",
    weight: 0.8,
    speed: 0.9,
    rarity: 0.7,
    jitter: 0.2,
    opacityRange: [0.5, 0.8],
  },
  {
    text: "GPT",
    weight: 1.0,
    speed: 0.7,
    rarity: 1.0,
    jitter: 0.1,
    opacityRange: [0.8, 1.0],
  },
  {
    text: "BERT",
    weight: 0.9,
    speed: 0.8,
    rarity: 0.8,
    jitter: 0.1,
    opacityRange: [0.6, 0.9],
  },
  {
    text: "LLAMA",
    weight: 0.9,
    speed: 0.8,
    rarity: 0.8,
    jitter: 0.1,
    opacityRange: [0.6, 0.9],
  },
  {
    text: "MULTIMODAL",
    weight: 0.8,
    speed: 1.0,
    rarity: 0.7,
    jitter: 0.2,
    opacityRange: [0.5, 0.8],
  },
  {
    text: "VISION",
    weight: 0.7,
    speed: 1.1,
    rarity: 0.6,
    jitter: 0.3,
    opacityRange: [0.4, 0.7],
  },
  {
    text: "NLP",
    weight: 0.8,
    speed: 1.0,
    rarity: 0.7,
    jitter: 0.2,
    opacityRange: [0.5, 0.8],
  },
  {
    text: "PYTORCH",
    weight: 0.7,
    speed: 1.1,
    rarity: 0.6,
    jitter: 0.3,
    opacityRange: [0.4, 0.7],
  },
  {
    text: "TENSORFLOW",
    weight: 0.7,
    speed: 1.1,
    rarity: 0.6,
    jitter: 0.3,
    opacityRange: [0.4, 0.7],
  },
  {
    text: "HUGGINGFACE",
    weight: 0.8,
    speed: 1.0,
    rarity: 0.7,
    jitter: 0.2,
    opacityRange: [0.5, 0.8],
  },
  {
    text: "CUDA",
    weight: 0.6,
    speed: 1.2,
    rarity: 0.5,
    jitter: 0.4,
    opacityRange: [0.3, 0.6],
  },
  {
    text: "DISTRIBUTED",
    weight: 0.6,
    speed: 1.2,
    rarity: 0.5,
    jitter: 0.3,
    opacityRange: [0.3, 0.6],
  },
  {
    text: "REINFORCEMENT",
    weight: 0.7,
    speed: 1.0,
    rarity: 0.6,
    jitter: 0.2,
    opacityRange: [0.4, 0.7],
  },
  {
    text: "AGENT",
    weight: 0.8,
    speed: 0.9,
    rarity: 0.7,
    jitter: 0.2,
    opacityRange: [0.5, 0.8],
  },
  {
    text: "REASONING",
    weight: 0.9,
    speed: 0.8,
    rarity: 0.8,
    jitter: 0.1,
    opacityRange: [0.6, 0.9],
  },
  {
    text: "ALIGNMENT",
    weight: 0.8,
    speed: 0.9,
    rarity: 0.7,
    jitter: 0.2,
    opacityRange: [0.5, 0.8],
  },
  {
    text: "RLHF",
    weight: 0.7,
    speed: 1.0,
    rarity: 0.6,
    jitter: 0.3,
    opacityRange: [0.4, 0.7],
  },
];

// Romanian narrative quotes optimized for character-by-character animation
export const ENHANCED_NARRATIVE_QUOTES: Omit<
  EnhancedNarrativeQuote,
  | "id"
  | "x"
  | "y"
  | "opacity"
  | "scale"
  | "currentChar"
  | "isActive"
  | "animationDelay"
>[] = [
  {
    text: "Promptul e cheia tăcută care face AI-ul să deschidă ușa exact unde vrei să intri.",
    style: "typing",
    corner: "top-left",
    preDelay: 2000,
    hold: 4000,
    out: 1200,
    priority: 9,
    cooldown: 30000,
  },
  {
    text: "În era AI, întrebarea precisă e mai valoroasă decât orice răspuns rapid.",
    style: "matrix",
    corner: "top-right",
    preDelay: 1500,
    hold: 3500,
    out: 1000,
    priority: 8,
    cooldown: 25000,
  },
  {
    text: "Cuvintele tale devin cod când le pui într-un prompt clar și intenționat.",
    style: "typing",
    corner: "bottom-left",
    preDelay: 2500,
    hold: 4500,
    out: 1300,
    priority: 7,
    cooldown: 35000,
  },
  {
    text: "AI-ul îți răspunde doar în măsura în care îți înțelege întrebarea.",
    style: "glitch",
    corner: "bottom-right",
    preDelay: 1800,
    hold: 3800,
    out: 1100,
    priority: 8,
    cooldown: 28000,
  },
  {
    text: "Promptul bun transformă AI-ul din jucărie de test în motor de execuție reală.",
    style: "typing",
    corner: "center",
    preDelay: 3000,
    hold: 5000,
    out: 1500,
    priority: 10,
    cooldown: 40000,
  },
  {
    text: "Când știi să ceri, AI-ul îți oferă rezultate care schimbă jocul.",
    style: "matrix",
    corner: "top-left",
    preDelay: 2200,
    hold: 4200,
    out: 1200,
    priority: 7,
    cooldown: 32000,
  },
  {
    text: "Promptul e contractul tău scris cu viitorul pe care îl vrei.",
    style: "typing",
    corner: "top-right",
    preDelay: 1700,
    hold: 3700,
    out: 1000,
    priority: 8,
    cooldown: 27000,
  },
  {
    text: "Fără structură în cuvinte, AI-ul îți oferă doar zgomot frumos formatat.",
    style: "glitch",
    corner: "bottom-left",
    preDelay: 2800,
    hold: 4800,
    out: 1400,
    priority: 6,
    cooldown: 38000,
  },
  {
    text: "Promptul e puntea vizibilă dintre idee și rezultat în câteva secunde.",
    style: "typing",
    corner: "bottom-right",
    preDelay: 2000,
    hold: 4000,
    out: 1200,
    priority: 7,
    cooldown: 30000,
  },
  {
    text: "În AI, calitatea rezultatului începe cu claritatea cererii.",
    style: "matrix",
    corner: "center",
    preDelay: 1600,
    hold: 3600,
    out: 1000,
    priority: 8,
    cooldown: 26000,
  },
  {
    text: "Promptul bun nu descrie doar ce vrei, ci și de ce contează.",
    style: "typing",
    corner: "top-left",
    preDelay: 2400,
    hold: 4400,
    out: 1300,
    priority: 7,
    cooldown: 34000,
  },
  {
    text: "AI-ul amplifică exact sensul pe care i-l transmiți.",
    style: "glitch",
    corner: "top-right",
    preDelay: 1900,
    hold: 3900,
    out: 1100,
    priority: 6,
    cooldown: 29000,
  },
  {
    text: "Promptul greșit e timp pierdut multiplicat de puterea AI-ului.",
    style: "matrix",
    corner: "bottom-left",
    preDelay: 2600,
    hold: 4600,
    out: 1400,
    priority: 8,
    cooldown: 36000,
  },
  {
    text: "În era AI, limbajul e cea mai rapidă formă de programare.",
    style: "typing",
    corner: "bottom-right",
    preDelay: 2100,
    hold: 4100,
    out: 1200,
    priority: 9,
    cooldown: 31000,
  },
  {
    text: "Promptul e algoritmul uman pe care AI-ul îl execută fără obiecții.",
    style: "glitch",
    corner: "center",
    preDelay: 2700,
    hold: 4700,
    out: 1400,
    priority: 8,
    cooldown: 37000,
  },
  {
    text: "Claritatea în prompt înseamnă precizie în rezultat.",
    style: "matrix",
    corner: "top-left",
    preDelay: 1400,
    hold: 3400,
    out: 900,
    priority: 7,
    cooldown: 24000,
  },
  {
    text: "Promptingul e ingineria invizibilă a unei conversații perfecte cu AI.",
    style: "typing",
    corner: "top-right",
    preDelay: 2900,
    hold: 4900,
    out: 1500,
    priority: 9,
    cooldown: 39000,
  },
  {
    text: "Fiecare cuvânt din prompt decide forma finală a răspunsului.",
    style: "glitch",
    corner: "bottom-left",
    preDelay: 2300,
    hold: 4300,
    out: 1300,
    priority: 7,
    cooldown: 33000,
  },
  {
    text: "AI-ul înțelege doar lumea pe care o descrii.",
    style: "matrix",
    corner: "bottom-right",
    preDelay: 1500,
    hold: 3500,
    out: 1000,
    priority: 6,
    cooldown: 25000,
  },
  {
    text: "Promptul e busola ta în harta infinită a posibilităților AI.",
    style: "typing",
    corner: "center",
    preDelay: 2500,
    hold: 4500,
    out: 1300,
    priority: 9,
    cooldown: 35000,
  },
];

// Enhanced geometric figures with path definitions
export const ENHANCED_GEOMETRIC_FIGURES: Omit<
  EnhancedGeometricFigure,
  "id" | "x" | "y" | "rotation" | "opacity" | "animationDelay"
>[] = [
  {
    shape: "point",
    width: 2,
    height: 2,
    color: "rgba(255, 255, 255, 0.6)",
    path: "circular",
    duration: 20000,
    variance: 0.1,
    z: 1,
    blend: "normal",
  },
  {
    shape: "point",
    width: 3,
    height: 3,
    color: "rgba(0, 255, 127, 0.4)",
    path: "figure8",
    duration: 25000,
    variance: 0.2,
    z: 2,
    blend: "screen",
  },
  {
    shape: "line",
    width: 20,
    height: 1,
    color: "rgba(255, 255, 255, 0.3)",
    path: "linear",
    duration: 15000,
    variance: 0.3,
    z: 1,
    blend: "normal",
  },
  {
    shape: "line",
    width: 30,
    height: 1,
    color: "rgba(255, 90, 36, 0.2)",
    path: "spiral",
    duration: 30000,
    variance: 0.1,
    z: 3,
    blend: "overlay",
  },
  {
    shape: "bar",
    width: 4,
    height: 15,
    color: "rgba(0, 255, 127, 0.3)",
    path: "random",
    duration: 18000,
    variance: 0.4,
    z: 2,
    blend: "multiply",
  },
  {
    shape: "triangle",
    width: 6,
    height: 6,
    color: "rgba(255, 255, 255, 0.4)",
    path: "circular",
    duration: 22000,
    variance: 0.2,
    z: 1,
    blend: "normal",
  },
  {
    shape: "circle",
    width: 8,
    height: 8,
    color: "rgba(0, 255, 127, 0.2)",
    path: "figure8",
    duration: 28000,
    variance: 0.3,
    z: 2,
    blend: "screen",
  },
  {
    shape: "square",
    width: 5,
    height: 5,
    color: "rgba(255, 90, 36, 0.3)",
    path: "linear",
    duration: 16000,
    variance: 0.2,
    z: 3,
    blend: "overlay",
  },
];
