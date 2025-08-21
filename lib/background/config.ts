export type BackgroundConfig = {
  motionLevel: "auto" | "medium" | "low"
  reducedFallback: boolean
  maxQuotes: number
  maxTokens: number
  quoteDelayMs: [number, number]
  tokenSpawnDelayMs: [number, number]
  typingSpeedMs: { desktop: [number, number]; mobile: [number, number] }
}

export const backgroundConfig: BackgroundConfig = {
  motionLevel: "auto",
  reducedFallback: true,
  maxQuotes: 3,
  maxTokens: 100, // desktop ≈100, mobile ≈60 per audit guidelines
  quoteDelayMs: [15000, 20000],
  tokenSpawnDelayMs: [100, 800],
  typingSpeedMs: { desktop: [22, 32], mobile: [14, 24] },
}
