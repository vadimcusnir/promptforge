export interface BrandLinterResult {
  score: number
  breaches: string[]
  fixes: string[]
  cta: string
  has_metric: boolean
  has_kpi: boolean
  voice_compliant: boolean
  structure_complete: boolean
}

export interface LexiconRule {
  banned: string
  replacement: string
  severity: "high" | "medium" | "low"
}

// PROMPTFORGE™ Brand Lexicon - Banned words and replacements
export const BANNED_LEXICON: LexiconRule[] = [
  { banned: "ușor", replacement: "rapid, operațional, controlabil", severity: "high" },
  { banned: "easy", replacement: "rapid, operational, controllable", severity: "high" },
  { banned: "magie", replacement: "sistemic, logic, validat", severity: "high" },
  { banned: "magic", replacement: "systematic, logical, validated", severity: "high" },
  { banned: "inspirațional", replacement: "strategic, funcțional, scalabil", severity: "medium" },
  { banned: "inspirational", replacement: "strategic, functional, scalable", severity: "medium" },
  { banned: "schimbă-ți viața", replacement: "optimizează structura, rulează sistemul", severity: "high" },
  { banned: "change your life", replacement: "optimize structure, run the system", severity: "high" },
  { banned: "fără efort", replacement: "executabil în < 5m, configurabil", severity: "medium" },
  { banned: "effortless", replacement: "executable in < 5m, configurable", severity: "medium" },
  { banned: "convingător", replacement: "cu scor AI ≥ 80/100", severity: "medium" },
  { banned: "convincing", replacement: "with AI score ≥ 80/100", severity: "medium" },
  { banned: "transformă", replacement: "optimizează, sistematizează", severity: "medium" },
  { banned: "transform", replacement: "optimize, systematize", severity: "medium" },
]

// Minimum score threshold for export approval
export const MIN_BRAND_SCORE = 80

export class BrandLinter {
  private static instance: BrandLinter

  static getInstance(): BrandLinter {
    if (!BrandLinter.instance) {
      BrandLinter.instance = new BrandLinter()
    }
    return BrandLinter.instance
  }

  validatePrompt(prompt: string): BrandLinterResult {
    const breaches: string[] = []
    const fixes: string[] = []
    let score = 100

    // Check for banned lexicon
    const lexiconViolations = this.checkLexicon(prompt)
    breaches.push(...lexiconViolations.breaches)
    fixes.push(...lexiconViolations.fixes)
    score -= lexiconViolations.penalty

    // Check for CTA presence
    const ctaCheck = this.checkCTA(prompt)
    if (!ctaCheck.hasCTA) {
      breaches.push("missing_cta")
      fixes.push("Add a clear action at the end of the prompt.")
      score -= 15
    }

    // Check for metrics/KPIs
    const metricCheck = this.checkMetrics(prompt)
    if (!metricCheck.hasMetric) {
      breaches.push("no_kpi")
      fixes.push("Include a measurable KPI (e.g., Open Rate ≥ 42%, TTA < 60s).")
      score -= 10
    }

    // Check voice compliance (imperative, second person)
    const voiceCheck = this.checkVoice(prompt)
    if (!voiceCheck.compliant) {
      breaches.push("passive_voice")
      fixes.push('Rewrite using imperative voice: "Generate the prompt..." instead of "The prompt should be..."')
      score -= 10
    }

    // Check structure completeness
    const structureCheck = this.checkStructure(prompt)
    if (!structureCheck.complete) {
      breaches.push("incomplete_structure")
      fixes.push("Include: Context → Requirement → Specification → KPI → Fallback")
      score -= 15
    }

    return {
      score: Math.max(0, score),
      breaches,
      fixes,
      cta: ctaCheck.suggestedCTA,
      has_metric: metricCheck.hasMetric,
      has_kpi: metricCheck.hasKPI,
      voice_compliant: voiceCheck.compliant,
      structure_complete: structureCheck.complete,
    }
  }

  private checkLexicon(prompt: string): { breaches: string[]; fixes: string[]; penalty: number } {
    const breaches: string[] = []
    const fixes: string[] = []
    let penalty = 0

    const lowerPrompt = prompt.toLowerCase()

    BANNED_LEXICON.forEach((rule) => {
      if (lowerPrompt.includes(rule.banned.toLowerCase())) {
        breaches.push(`uses_banned_word_${rule.banned.replace(/\s+/g, "_")}`)
        fixes.push(`Replace "${rule.banned}" with "${rule.replacement}".`)

        switch (rule.severity) {
          case "high":
            penalty += 15
            break
          case "medium":
            penalty += 10
            break
          case "low":
            penalty += 5
            break
        }
      }
    })

    return { breaches, fixes, penalty }
  }

  private checkCTA(prompt: string): { hasCTA: boolean; suggestedCTA: string } {
    const ctaPatterns = [
      /generate\s+/i,
      /create\s+/i,
      /build\s+/i,
      /optimize\s+/i,
      /execute\s+/i,
      /run\s+/i,
      /implement\s+/i,
      /download\s+/i,
      /export\s+/i,
    ]

    const hasCTA = ctaPatterns.some((pattern) => pattern.test(prompt))
    const suggestedCTA = hasCTA ? "Continue with current action" : "Generate the optimized prompt now"

    return { hasCTA, suggestedCTA }
  }

  private checkMetrics(prompt: string): { hasMetric: boolean; hasKPI: boolean } {
    const metricPatterns = [
      /\d+%/,
      /≥\s*\d+/,
      />\s*\d+/,
      /<\s*\d+/,
      /\d+\s*(seconds?|minutes?|hours?)/i,
      /score\s*≥?\s*\d+/i,
      /rate\s*≥?\s*\d+/i,
      /tta\s*<?\s*\d+/i,
      /kpi/i,
      /metric/i,
    ]

    const hasMetric = metricPatterns.some((pattern) => pattern.test(prompt))
    const hasKPI = /kpi|metric|score|rate|tta/i.test(prompt)

    return { hasMetric, hasKPI }
  }

  private checkVoice(prompt: string): { compliant: boolean } {
    // Check for imperative voice patterns
    const imperativePatterns = [
      /^(generate|create|build|optimize|execute|run|implement)/i,
      /you\s+(must|should|need to|will)/i,
    ]

    // Check for passive voice patterns (negative indicators)
    const passivePatterns = [/should be/i, /could be/i, /might be/i, /is recommended/i, /it would be/i]

    const hasImperative = imperativePatterns.some((pattern) => pattern.test(prompt))
    const hasPassive = passivePatterns.some((pattern) => pattern.test(prompt))

    return { compliant: hasImperative && !hasPassive }
  }

  private checkStructure(prompt: string): { complete: boolean } {
    const structureElements = [/context/i, /requirement/i, /specification/i, /output/i, /format/i]

    const presentElements = structureElements.filter((pattern) => pattern.test(prompt))
    return { complete: presentElements.length >= 3 }
  }

  applyAutoFixes(prompt: string): string {
    let fixedPrompt = prompt

    // Apply lexicon fixes
    BANNED_LEXICON.forEach((rule) => {
      const regex = new RegExp(rule.banned, "gi")
      const replacements = rule.replacement.split(", ")
      fixedPrompt = fixedPrompt.replace(regex, replacements[0])
    })

    // Add CTA if missing
    const ctaCheck = this.checkCTA(fixedPrompt)
    if (!ctaCheck.hasCTA) {
      fixedPrompt += "\n\nGenerate the optimized prompt now."
    }

    // Add KPI if missing
    const metricCheck = this.checkMetrics(fixedPrompt)
    if (!metricCheck.hasMetric) {
      fixedPrompt += "\n\nKPI: Success rate ≥ 80%, TTA < 60s."
    }

    return fixedPrompt
  }
}

export const brandLinter = BrandLinter.getInstance()
