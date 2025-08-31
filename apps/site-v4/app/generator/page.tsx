"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import {
  Search,
  Play,
  TestTube,
  CheckCircle,
  Settings,
  Download,
  Star,
  Zap,
  Target,
  Filter,
  BarChart3,
  Activity,
  Cpu,
  Database,
  Shield,
  Layers,
  Brain,
  Eye,
  Sparkles,
  Maximize2,
  Minimize2,
  RefreshCw,
  Loader2,
} from "lucide-react"

const moduleRegistry = [
  {
    code: "M01",
    name: "AI‑IDEI.SOPFORGE™",
    vector: "Strategic",
    vectors: [1, 6, 5],
    difficulty: "Advanced",
    plan: "Pilot",
    score: 87,
    description: "Transformă un subiect definit în SOP standardizat, cu telemetrie și criterii de acceptare",
    category: "Process",
    tags: ["SOP", "Research", "Procedures"],
    estimatedTime: "5-10 min",
    complexity: 8,
  },
  {
    code: "M02",
    name: "AI‑IDEI.LATENTMAP™",
    vector: "Retoric",
    vectors: [2, 5],
    difficulty: "Expert",
    plan: "Pilot",
    score: 92,
    description: "Extrage motive, dependențe și traiectorii din corpus prin embeddings multi‑scale",
    category: "Analysis",
    tags: ["Embeddings", "Topic Mining", "Graph"],
    estimatedTime: "10-15 min",
    complexity: 9,
  },
  {
    code: "M03",
    name: "Codul 7:1™",
    vector: "Retoric",
    vectors: [2, 6],
    difficulty: "Intermediate",
    plan: "Pilot",
    score: 85,
    description: "Framework de mesaje cu raport 7:1 pentru persuasiune optimă",
    category: "Messaging",
    tags: ["Framework", "Persuasion", "Ratio"],
    estimatedTime: "3-5 min",
    complexity: 6,
  },
  {
    code: "M04",
    name: "Dicționarul Semiotic 8VULTUS™",
    vector: "Retoric",
    vectors: [2, 5],
    difficulty: "Advanced",
    plan: "Pilot",
    score: 89,
    description: "Sistem semiotic pentru brand architecture și messaging",
    category: "Branding",
    tags: ["Semiotics", "Brand", "Messaging"],
    estimatedTime: "7-12 min",
    complexity: 7,
  },
  {
    code: "M05",
    name: "ORAKON Memory Grid",
    vector: "Cognitiv",
    vectors: [4, 5],
    difficulty: "Expert",
    plan: "Pilot",
    score: 91,
    description: "Grid de memorie pentru pattern recognition și insight generation",
    category: "Cognitive",
    tags: ["Memory", "Pattern", "Insight"],
    estimatedTime: "12-18 min",
    complexity: 8,
  },
  {
    code: "M06",
    name: "Agentic GPT Sales",
    vector: "Retoric",
    vectors: [2],
    difficulty: "Advanced",
    plan: "Pilot",
    score: 88,
    description: "Agent de vânzări cu hunter/closer capabilities",
    category: "Sales",
    tags: ["GPT", "Sales Agent", "Automation"],
    estimatedTime: "8-13 min",
    complexity: 7,
  },
  {
    code: "M07",
    name: "Risk & Trust Reversal",
    vector: "Retoric",
    vectors: [2, 7],
    difficulty: "Intermediate",
    plan: "Pilot",
    score: 86,
    description: "Strategii de inversare a riscului și construire încredere",
    category: "Strategy",
    tags: ["Risk", "Trust", "Reversal"],
    estimatedTime: "5-8 min",
    complexity: 6,
  },
  {
    code: "M08",
    name: "Status‑Tier Loyalty",
    vector: "Retoric",
    vectors: [2, 5],
    difficulty: "Advanced",
    plan: "Pilot",
    score: 90,
    description: "Sistem de loialitate bazat pe status și tier-uri",
    category: "Loyalty",
    tags: ["Status", "Tier", "Loyalty System"],
    estimatedTime: "9-14 min",
    complexity: 7,
  },
  {
    code: "M09",
    name: "Post‑Purchase Subscription Engine",
    vector: "Strategic",
    vectors: [1, 6],
    difficulty: "Advanced",
    plan: "Pilot",
    score: 87,
    description: "Engine pentru subscripții post-achiziție",
    category: "Subscription",
    tags: ["Post-Purchase", "Subscription", "Engine"],
    estimatedTime: "7-11 min",
    complexity: 7,
  },
  {
    code: "M10",
    name: "Zero‑Party Data OS",
    vector: "Date",
    vectors: [6],
    difficulty: "Expert",
    plan: "Pilot",
    score: 93,
    description: "Sistem operațional pentru colectarea datelor zero-party",
    category: "Data",
    tags: ["Zero-Party Data", "OS", "Collection"],
    estimatedTime: "13-19 min",
    complexity: 9,
  },
  {
    code: "M11",
    name: "Funnel Nota Doi",
    vector: "Strategic",
    vectors: [1],
    difficulty: "Intermediate",
    plan: "Pilot",
    score: 84,
    description: "Framework de funnel pentru conversie optimizată",
    category: "Marketing",
    tags: ["Funnel", "Conversion", "Framework"],
    estimatedTime: "4-7 min",
    complexity: 6,
  },
  {
    code: "M12",
    name: "Diagnostic Vizibilitate",
    vector: "Strategic",
    vectors: [1],
    difficulty: "Beginner",
    plan: "Pilot",
    score: 82,
    description: "Diagnostic pe 8 piloni pentru vizibilitate brand",
    category: "Branding",
    tags: ["Diagnostic", "Visibility", "Brand"],
    estimatedTime: "3-6 min",
    complexity: 5,
  },
  {
    code: "M13",
    name: "Pricing Psychology",
    vector: "Cognitiv",
    vectors: [4],
    difficulty: "Advanced",
    plan: "Pro",
    score: 89,
    description: "Psihologia prețurilor pentru optimizare conversie",
    category: "Pricing",
    tags: ["Psychology", "Pricing", "Conversion"],
    estimatedTime: "8-12 min",
    complexity: 7,
  },
  {
    code: "M14",
    name: "Authority Content→Commerce",
    vector: "Strategic",
    vectors: [1, 2],
    difficulty: "Advanced",
    plan: "Pro",
    score: 91,
    description: "Transformarea conținutului de autoritate în commerce",
    category: "Content",
    tags: ["Authority", "Content", "Commerce"],
    estimatedTime: "10-15 min",
    complexity: 8,
  },
  {
    code: "M15",
    name: "GTD de Lançare Ritualică",
    vector: "Strategic",
    vectors: [1, 5],
    difficulty: "Expert",
    plan: "Pro",
    score: 94,
    description: "Getting Things Done pentru lansări ritualice",
    category: "Productivity",
    tags: ["GTD", "Ritual", "Launch"],
    estimatedTime: "14-20 min",
    complexity: 9,
  },
  {
    code: "M16",
    name: "HeyGen AI Clone",
    vector: "Conținut",
    vectors: [3],
    difficulty: "Advanced",
    plan: "Pro",
    score: 88,
    description: "Clonare AI pentru generare conținut video",
    category: "AI",
    tags: ["HeyGen", "AI Clone", "Video"],
    estimatedTime: "7-11 min",
    complexity: 7,
  },
  {
    code: "M17",
    name: "Sora Shot-by-Shot",
    vector: "Conținut",
    vectors: [3, 5],
    difficulty: "Expert",
    plan: "Pro",
    score: 92,
    description: "Planificare shot-by-shot pentru video AI",
    category: "AI",
    tags: ["Sora", "Shot-by-Shot", "Video AI"],
    estimatedTime: "12-17 min",
    complexity: 8,
  },
  {
    code: "M18",
    name: "Carusele RFA",
    vector: "Retoric",
    vectors: [2, 5],
    difficulty: "Intermediate",
    plan: "Pro",
    score: 85,
    description: "Carusele pentru Reason, Fear, Action framework",
    category: "Marketing",
    tags: ["Carusele", "RFA", "Framework"],
    estimatedTime: "5-9 min",
    complexity: 6,
  },
  {
    code: "M19",
    name: "Rescriere după algoritm",
    vector: "Conținut",
    vectors: [3, 7],
    difficulty: "Advanced",
    plan: "Pro",
    score: 87,
    description: "Rescriere conținut optimizată pentru algoritmi",
    category: "SEO",
    tags: ["Rescriere", "Algoritm", "Optimizare"],
    estimatedTime: "7-12 min",
    complexity: 7,
  },
  {
    code: "M20",
    name: "Manifest Voice",
    vector: "Retoric",
    vectors: [2],
    difficulty: "Advanced",
    plan: "Pro",
    score: 90,
    description: "Dezvoltarea vocii de brand prin manifest",
    category: "Branding",
    tags: ["Manifest", "Voice", "Brand"],
    estimatedTime: "9-14 min",
    complexity: 7,
  },
  {
    code: "M21",
    name: "AI în Moodle",
    vector: "Strategic",
    vectors: [1, 3],
    difficulty: "Advanced",
    plan: "Pro",
    score: 86,
    description: "Integrare AI în platforme educaționale Moodle",
    category: "Education",
    tags: ["AI", "Moodle", "Integration"],
    estimatedTime: "6-10 min",
    complexity: 7,
  },
  {
    code: "M22",
    name: "Lead Gen SOP",
    vector: "Strategic",
    vectors: [1],
    difficulty: "Intermediate",
    plan: "Pro",
    score: 83,
    description: "SOP pentru lead generation cu Make + Notion + Telegram",
    category: "Marketing",
    tags: ["SOP", "Lead Gen", "Automation"],
    estimatedTime: "4-8 min",
    complexity: 6,
  },
  {
    code: "M23",
    name: "Podcast → Carte",
    vector: "Strategic",
    vectors: [1, 3],
    difficulty: "Advanced",
    plan: "Pro",
    score: 89,
    description: "Transformarea podcast-urilor în cărți",
    category: "Content",
    tags: ["Podcast", "Carte", "Transformare"],
    estimatedTime: "8-13 min",
    complexity: 7,
  },
  {
    code: "M24",
    name: "PR Personal",
    vector: "Criză",
    vectors: [7],
    difficulty: "Expert",
    plan: "Pro",
    score: 91,
    description: "Strategie PR personală pentru gestionare reputație",
    category: "PR",
    tags: ["PR", "Reputație", "Strategie"],
    estimatedTime: "11-16 min",
    complexity: 8,
  },
  {
    code: "M25",
    name: "Knowledge Security SOP",
    vector: "Date",
    vectors: [6, 7],
    difficulty: "Expert",
    plan: "Pro",
    score: 93,
    description: "SOP pentru securitatea cunoștințelor",
    category: "Security",
    tags: ["SOP", "Security", "Knowledge"],
    estimatedTime: "13-18 min",
    complexity: 9,
  },
  {
    code: "M26",
    name: "JTBD Matrix",
    vector: "Cognitiv",
    vectors: [4],
    difficulty: "Advanced",
    plan: "Pro",
    score: 88,
    description: "Jobs To Be Done matrix pentru product development",
    category: "Product",
    tags: ["JTBD", "Matrix", "Product Dev"],
    estimatedTime: "7-11 min",
    complexity: 7,
  },
  {
    code: "M27",
    name: "Schwartz Ladder",
    vector: "Cognitiv",
    vectors: [4],
    difficulty: "Advanced",
    plan: "Pro",
    score: 87,
    description: "Ladder Schwartz pentru hierarchy of needs",
    category: "Psychology",
    tags: ["Schwartz", "Ladder", "Needs"],
    estimatedTime: "6-10 min",
    complexity: 7,
  },
  {
    code: "M28",
    name: "Obiecții → Contraargumente",
    vector: "Retoric",
    vectors: [2, 4],
    difficulty: "Intermediate",
    plan: "Pro",
    score: 85,
    description: "Transformarea obiecțiilor în contraargumente",
    category: "Sales",
    tags: ["Obiecții", "Contra", "Argumente"],
    estimatedTime: "5-9 min",
    complexity: 6,
  },
  {
    code: "M29",
    name: "Indoctrinare Soft",
    vector: "Retoric",
    vectors: [2, 5],
    difficulty: "Expert",
    plan: "Pro",
    score: 92,
    description: "Tehnici de indoctrinare soft pentru persuasiune",
    category: "Persuasion",
    tags: ["Indoctrinare", "Soft", "Persuasiune"],
    estimatedTime: "12-17 min",
    complexity: 8,
  },
  {
    code: "M30",
    name: "Cod Anti-Conformism",
    vector: "Retoric",
    vectors: [2],
    difficulty: "Advanced",
    plan: "Pro",
    score: 89,
    description: "Framework anti-conformist pentru diferențiere",
    category: "Branding",
    tags: ["Anti", "Conformism", "Framework"],
    estimatedTime: "8-13 min",
    complexity: 7,
  },
  {
    code: "M31",
    name: "Closed‑Loop Telemetry",
    vector: "Date",
    vectors: [6],
    difficulty: "Expert",
    plan: "Enterprise",
    score: 94,
    description: "Sistem de telemetrie în buclă închisă",
    category: "Telemetry",
    tags: ["Closed-Loop", "Telemetry", "System"],
    estimatedTime: "14-20 min",
    complexity: 9,
  },
  {
    code: "M32",
    name: "Cohort Experiments",
    vector: "Date",
    vectors: [6],
    difficulty: "Expert",
    plan: "Enterprise",
    score: 91,
    description: "Experimente pe cohorte pentru optimizare",
    category: "Experiments",
    tags: ["Cohort", "Experiments", "Optimization"],
    estimatedTime: "11-16 min",
    complexity: 8,
  },
  {
    code: "M33",
    name: "Lead Scoring Model",
    vector: "Date",
    vectors: [6],
    difficulty: "Advanced",
    plan: "Enterprise",
    score: 88,
    description: "Model de scoring pentru lead-uri",
    category: "Marketing",
    tags: ["Lead Scoring", "Model", "Leads"],
    estimatedTime: "7-12 min",
    complexity: 7,
  },
  {
    code: "M34",
    name: "K‑Factors & bucle de recomandare",
    vector: "Date",
    vectors: [6],
    difficulty: "Expert",
    plan: "Enterprise",
    score: 93,
    description: "Factori K și bucle de recomandare virală",
    category: "Viral",
    tags: ["K-Factors", "Recomandare", "Viral"],
    estimatedTime: "13-18 min",
    complexity: 9,
  },
  {
    code: "M35",
    name: "Content Heatmap",
    vector: "Date",
    vectors: [6],
    difficulty: "Advanced",
    plan: "Enterprise",
    score: 87,
    description: "Heatmap pentru performanța conținutului",
    category: "Analytics",
    tags: ["Content", "Heatmap", "Performance"],
    estimatedTime: "6-11 min",
    complexity: 7,
  },
  {
    code: "M36",
    name: "Semiotic Brand Architecture",
    vector: "Memetic",
    vectors: [5],
    difficulty: "Expert",
    plan: "Enterprise",
    score: 95,
    description: "Arhitectură semiotică pentru brand",
    category: "Branding",
    tags: ["Semiotics", "Brand", "Architecture"],
    estimatedTime: "15-21 min",
    complexity: 9,
  },
  {
    code: "M37",
    name: "Ritual de Inițiere pentru The Architect",
    vector: "Memetic",
    vectors: [5],
    difficulty: "Expert",
    plan: "Enterprise",
    score: 94,
    description: "Ritual de inițiere pentru The Architect persona",
    category: "Persona",
    tags: ["Ritual", "Architect", "Persona"],
    estimatedTime: "14-19 min",
    complexity: 9,
  },
  {
    code: "M38",
    name: "Blueprint Antișcoală",
    vector: "Conținut",
    vectors: [3, 5],
    difficulty: "Expert",
    plan: "Enterprise",
    score: 92,
    description: "Blueprint pentru educație anti-școală",
    category: "Education",
    tags: ["Blueprint", "Anti-School", "Education"],
    estimatedTime: "12-17 min",
    complexity: 8,
  },
  {
    code: "M39",
    name: "Promptoscopie™",
    vector: "Conținut",
    vectors: [3, 5],
    difficulty: "Expert",
    plan: "Enterprise",
    score: 93,
    description: "Analiză avansată a prompt-urilor",
    category: "AI",
    tags: ["Promptoscopie", "Prompt", "Analysis"],
    estimatedTime: "13-18 min",
    complexity: 9,
  },
  {
    code: "M40",
    name: "Voice System KPI",
    vector: "Conținut",
    vectors: [3, 5],
    difficulty: "Advanced",
    plan: "Enterprise",
    score: 89,
    description: "KPI pentru sisteme de voce și brand voice",
    category: "Branding",
    tags: ["Voice", "System", "KPI"],
    estimatedTime: "8-13 min",
    complexity: 7,
  },
  {
    code: "M41",
    name: "Agent de Criză PR",
    vector: "Criză",
    vectors: [7],
    difficulty: "Expert",
    plan: "Enterprise",
    score: 96,
    description: "Agent specializat în gestionarea crizelor PR",
    category: "PR",
    tags: ["Agent", "Criză", "PR"],
    estimatedTime: "16-22 min",
    complexity: 9,
  },
  {
    code: "M42",
    name: "Contra‑cadru mediatic",
    vector: "Criză",
    vectors: [7],
    difficulty: "Expert",
    plan: "Enterprise",
    score: 94,
    description: "Framework pentru contra-narrativ mediatic",
    category: "Media",
    tags: ["Contra-cadru", "Media", "Framework"],
    estimatedTime: "14-19 min",
    complexity: 9,
  },
  {
    code: "M43",
    name: "Politica de Transparență",
    vector: "Criză",
    vectors: [7],
    difficulty: "Advanced",
    plan: "Enterprise",
    score: 88,
    description: "Politici de transparență pentru crisis management",
    category: "Management",
    tags: ["Politica", "Transparență", "Crisis"],
    estimatedTime: "7-12 min",
    complexity: 7,
  },
  {
    code: "M44",
    name: "Ethical Guardrails GPT",
    vector: "Criză",
    vectors: [7],
    difficulty: "Expert",
    plan: "Enterprise",
    score: 95,
    description: "Guardrails etice pentru sisteme GPT",
    category: "AI",
    tags: ["Ethical", "Guardrails", "GPT"],
    estimatedTime: "15-21 min",
    complexity: 9,
  },
  {
    code: "M45",
    name: "Simulator de Contrafactuale",
    vector: "Date",
    vectors: [6, 4],
    difficulty: "Expert",
    plan: "Enterprise",
    score: 93,
    description: "Simulator pentru scenarii contrafactuale",
    category: "Simulation",
    tags: ["Simulator", "Contrafactuale", "Scenarii"],
    estimatedTime: "13-18 min",
    complexity: 9,
  },
  {
    code: "M46",
    name: "Librărie Swipe Files",
    vector: "Conținut",
    vectors: [3],
    difficulty: "Intermediate",
    plan: "Enterprise",
    score: 84,
    description: "Librărie de swipe files pentru inspirație",
    category: "Content",
    tags: ["Librărie", "Swipe Files", "Inspirație"],
    estimatedTime: "4-8 min",
    complexity: 6,
  },
  {
    code: "M47",
    name: "Curriculum INTELIGENȚIA™",
    vector: "Conținut",
    vectors: [3],
    difficulty: "Advanced",
    plan: "Enterprise",
    score: 90,
    description: "Curriculum de 5 săptămâni pentru INTELIGENȚIA™",
    category: "Education",
    tags: ["Curriculum", "INTELIGENȚIA", "Săptămâni"],
    estimatedTime: "9-14 min",
    complexity: 7,
  },
  {
    code: "M48",
    name: "Playbook Internaționalizare",
    vector: "Conținut",
    vectors: [3],
    difficulty: "Advanced",
    plan: "Enterprise",
    score: 87,
    description: "Playbook pentru internaționalizare EN/RO",
    category: "Globalization",
    tags: ["Playbook", "Internaționalizare", "EN/RO"],
    estimatedTime: "6-11 min",
    complexity: 7,
  },
  {
    code: "M49",
    name: "Assistant GPT pentru Nota Doi",
    vector: "Strategic",
    vectors: [1],
    difficulty: "Advanced",
    plan: "Enterprise",
    score: 89,
    description: "Assistant GPT specializat pentru Nota Doi",
    category: "AI",
    tags: ["Assistant", "GPT", "Nota Doi"],
    estimatedTime: "8-13 min",
    complexity: 7,
  },
  {
    code: "M50",
    name: "Sistemul CUSNIR.OS™",
    vector: "Strategic",
    vectors: [1, 5],
    difficulty: "Expert",
    plan: "Enterprise",
    score: 97,
    description: "Sistemul operațional CUSNIR complet",
    category: "System",
    tags: ["CUSNIR", "OS", "Sistemul"],
    estimatedTime: "17-23 min",
    complexity: 10,
  },
]

const sevenDFramework = {
  domain: {
    codes: ["FIN", "ECOM", "EDU", "SAAS", "HEALTH", "LEGAL", "GOV", "MEDIA"],
    labels: {
      FIN: "Finance",
      ECOM: "E-commerce",
      EDU: "Education",
      SAAS: "SaaS",
      HEALTH: "Healthcare",
      LEGAL: "Legal",
      GOV: "Government",
      MEDIA: "Media",
    },
    icons: {
      FIN: "💰",
      ECOM: "🛒",
      EDU: "🎓",
      SAAS: "☁️",
      HEALTH: "🏥",
      LEGAL: "⚖️",
      GOV: "🏛️",
      MEDIA: "📺",
    },
  },
  scale: ["solo", "team", "org", "market"],
  urgency: ["low", "normal", "high", "crisis"],
  complexity: ["low", "medium", "high"],
  resources: ["minimal", "standard", "extended"],
  application: ["content_ops", "sales_ops", "product_ops", "research", "crisis_ops"],
  output: ["text", "sop", "plan", "bundle"],
}

const vectorNames = {
  1: "Strategic",
  2: "Retoric",
  3: "Conținut",
  4: "Cognitiv",
  5: "Memetic",
  6: "Date",
  7: "Criză",
}

const vectorIcons = {
  1: Target,
  2: Brain,
  3: Layers,
  4: Eye,
  5: Sparkles,
  6: Database,
  7: Shield,
}

export default function GeneratorPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVector, setSelectedVector] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [plan, setPlan] = useState("")
  const [selectedModule, setSelectedModule] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [expandedSidebar, setExpandedSidebar] = useState(true)
  const [promptPreview, setPromptPreview] = useState("")
  const [contextInput, setContextInput] = useState("")
  const [isTesting, setIsTesting] = useState(false)
  const [testResults, setTestResults] = useState(null)
  const [aiResponse, setAiResponse] = useState("")
  const [exportFormat, setExportFormat] = useState("json")
  const [isExporting, setIsExporting] = useState(false)

  const [sevenD, setSevenD] = useState({
    domain: "",
    scale: "",
    urgency: "",
    complexity: "",
    resources: "",
    application: "",
    output: "",
  })

  const [qualityMetrics, setQualityMetrics] = useState({
    clarity: 87,
    execution: 83,
    businessFit: 89,
    ambiguity: 15,
    overallScore: 85,
  })

  const filteredModules = moduleRegistry.filter((module) => {
    const matchesSearch =
      !searchTerm ||
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesVector = !selectedVector || module.vector.toLowerCase() === selectedVector.toLowerCase()
    const matchesDifficulty = !difficulty || module.difficulty.toLowerCase() === difficulty.toLowerCase()
    const matchesPlan = !plan || module.plan.toLowerCase() === plan.toLowerCase()

    return matchesSearch && matchesVector && matchesDifficulty && matchesPlan
  })

  const handleSevenDChange = (key, value) => {
    setSevenD((prev) => ({ ...prev, [key]: value }))
    updatePromptPreview({ ...sevenD, [key]: value }, contextInput, selectedModule)
  }

  const updatePromptPreview = (sevenDParams, context, module) => {
    if (!module || !context) {
      setPromptPreview("")
      return
    }

    const domainContext = sevenDParams.domain ? sevenDFramework.domain.labels[sevenDParams.domain] : "General"
    const scaleContext = sevenDParams.scale ? `Scale: ${sevenDParams.scale}` : ""
    const urgencyContext = sevenDParams.urgency ? `Urgency: ${sevenDParams.urgency}` : ""

    const preview = `# ${module.name} - ${module.code}

## Context
${context}

## Domain: ${domainContext}
${scaleContext ? `## ${scaleContext}` : ""}
${urgencyContext ? `## ${urgencyContext}` : ""}

## Module Template
${module.description}

## Expected Output
Generate a ${sevenDParams.output || "comprehensive"} response that addresses the ${domainContext.toLowerCase()} requirements with ${sevenDParams.complexity || "moderate"} complexity.

---
*Generated with PromptForge™ 7D Framework*`

    setPromptPreview(preview)
  }

  const handleContextChange = (value) => {
    setContextInput(value)
    updatePromptPreview(sevenD, value, selectedModule)
  }

  const handleAITest = async () => {
    if (!selectedModule || !promptPreview) {
      return
    }

    setIsTesting(true)
    setGenerationProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch("/api/ai/test-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: promptPreview,
          module: selectedModule,
          sevenD: sevenD,
        }),
      })

      const data = await response.json()

      clearInterval(progressInterval)
      setGenerationProgress(100)

      if (response.ok) {
        setTestResults(data.metrics)
        setAiResponse(data.response)
        setQualityMetrics(data.metrics)
      } else {
        console.error("AI test failed:", data.error)
      }
    } catch (error) {
      console.error("AI test error:", error)
    } finally {
      setIsTesting(false)
      setTimeout(() => setGenerationProgress(0), 1000)
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)

    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      setGenerationProgress(i)
    }

    setIsGenerating(false)
    // Update quality metrics randomly for demo
    setQualityMetrics({
      clarity: Math.floor(Math.random() * 20) + 80,
      execution: Math.floor(Math.random() * 20) + 75,
      businessFit: Math.floor(Math.random() * 20) + 85,
      ambiguity: Math.floor(Math.random() * 20) + 10,
      overallScore: Math.floor(Math.random() * 15) + 80,
    })
  }

  const handleExport = async () => {
    setIsExporting(true)

    const exportData = {
      timestamp: new Date().toISOString(),
      module: selectedModule,
      sevenDParameters: sevenD,
      promptPreview,
      aiResponse,
      qualityMetrics,
      testResults,
      contextInput,
    }

    try {
      const response = await fetch("/api/export/artifact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: exportData,
          format: exportFormat,
          filename: `promptforge-${selectedModule?.id || "export"}-${Date.now()}`,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `promptforge-export.${exportFormat}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground font-mono neon-text">
                Prompt <span className="text-primary">Generator</span>
              </h1>
              <p className="text-muted-foreground text-sm">Industrial-grade prompt engineering IDE</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-mono">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">System:</span>
                <span className="text-primary">Operational</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-mono">
                <Cpu className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Load:</span>
                <span className="text-primary">23%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          <div className={`${expandedSidebar ? "col-span-3" : "col-span-1"} transition-all duration-300`}>
            <Card className="h-full bg-card/80 backdrop-blur-sm border-border neon-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground font-mono flex items-center">
                    <Filter className="w-4 h-4 mr-2" />
                    {expandedSidebar && "Control Panel"}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedSidebar(!expandedSidebar)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {expandedSidebar ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>

              {expandedSidebar && (
                <CardContent className="space-y-6 overflow-y-auto">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search modules..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground font-mono"
                    />
                  </div>

                  {/* Vector Filter */}
                  <div>
                    <label className="text-sm font-mono text-muted-foreground mb-2 block">Vector</label>
                    <Select value={selectedVector} onValueChange={setSelectedVector}>
                      <SelectTrigger className="bg-input border-border text-foreground font-mono">
                        <SelectValue placeholder="All vectors" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="" className="font-mono">
                          All vectors
                        </SelectItem>
                        {Object.entries(vectorNames).map(([key, name]) => {
                          const IconComponent = vectorIcons[key]
                          return (
                            <SelectItem key={name} value={name} className="font-mono">
                              <div className="flex items-center">
                                <IconComponent className="w-4 h-4 mr-2" />
                                {name}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-3 p-3 bg-muted/50 rounded-lg border border-border">
                    <div className="text-xs font-mono text-muted-foreground uppercase tracking-wide">Module Stats</div>
                    <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                      <div>
                        <div className="text-primary font-bold">{moduleRegistry.length}</div>
                        <div className="text-muted-foreground text-xs">Total</div>
                      </div>
                      <div>
                        <div className="text-primary font-bold">{filteredModules.length}</div>
                        <div className="text-muted-foreground text-xs">Filtered</div>
                      </div>
                    </div>
                  </div>

                  {/* Quality Threshold */}
                  <div>
                    <label className="text-sm font-mono text-muted-foreground mb-2 block">Quality Threshold</label>
                    <Slider value={[80]} max={100} step={5} className="w-full" />
                    <div className="flex justify-between text-xs font-mono text-muted-foreground mt-1">
                      <span>60%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          <div className={`${expandedSidebar ? "col-span-6" : "col-span-8"} transition-all duration-300`}>
            <Card className="h-full bg-card/80 backdrop-blur-sm border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground font-mono">Module Library</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-primary text-primary font-mono">
                      {filteredModules.length} modules
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {moduleRegistry.map((module) => {
                    const isVisible = filteredModules.includes(module)
                    if (!isVisible) return null

                    return (
                      <Card
                        key={module.code}
                        className={`bg-card/60 backdrop-blur-sm border-border hover:border-primary/50 transition-all cursor-pointer ${
                          selectedModule?.code === module.code ? "border-primary bg-primary/5" : ""
                        }`}
                        onClick={() => {
                          setSelectedModule(module)
                          updatePromptPreview(sevenD, contextInput, module)
                        }}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="border-primary text-primary font-mono text-xs">
                                  {module.code}
                                </Badge>
                                <Badge
                                  variant="secondary"
                                  className="bg-secondary/20 text-secondary-foreground font-mono text-xs"
                                >
                                  {module.vector}
                                </Badge>
                              </div>
                              <CardTitle className="text-foreground group-hover:text-primary transition-colors text-sm leading-tight font-mono">
                                {module.name}
                              </CardTitle>
                            </div>
                            <div className="text-right ml-4">
                              <div className="text-lg font-bold text-primary font-mono flex items-center">
                                <Star className="w-3 h-3 mr-1" />
                                {module.score}
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                          <CardDescription className="text-muted-foreground text-xs mb-3 line-clamp-2">
                            {module.description}
                          </CardDescription>

                          <div className="flex items-center justify-between text-xs">
                            <div className="flex gap-1">
                              {module.tags?.slice(0, 2).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="bg-muted text-muted-foreground font-mono text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground font-mono">{module.estimatedTime}</span>
                              <Button size="sm" variant="ghost" className="h-6 px-2 text-primary hover:text-primary/80">
                                <Play className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-3">
            <div className="space-y-4 h-full flex flex-col">
              {/* 7D Framework Quick Config */}
              <Card className="bg-card/80 backdrop-blur-sm border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-foreground font-mono text-sm flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    7D Framework
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Select value={sevenD.domain} onValueChange={(value) => handleSevenDChange("domain", value)}>
                    <SelectTrigger className="bg-input border-border text-foreground font-mono text-sm">
                      <SelectValue placeholder="Domain" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {sevenDFramework.domain.codes.map((code) => (
                        <SelectItem key={code} value={code} className="font-mono">
                          <div className="flex items-center">
                            <span className="mr-2">{sevenDFramework.domain.icons[code]}</span>
                            {sevenDFramework.domain.labels[code]}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="grid grid-cols-2 gap-2">
                    <Select value={sevenD.scale} onValueChange={(value) => handleSevenDChange("scale", value)}>
                      <SelectTrigger className="bg-input border-border text-foreground font-mono text-xs">
                        <SelectValue placeholder="Scale" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {sevenDFramework.scale.map((scale) => (
                          <SelectItem key={scale} value={scale} className="font-mono capitalize text-xs">
                            {scale}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={sevenD.urgency} onValueChange={(value) => handleSevenDChange("urgency", value)}>
                      <SelectTrigger className="bg-input border-border text-foreground font-mono text-xs">
                        <SelectValue placeholder="Urgency" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {sevenDFramework.urgency.map((urgency) => (
                          <SelectItem key={urgency} value={urgency} className="font-mono capitalize text-xs">
                            {urgency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Generation Controls */}
              <Card className="bg-card/80 backdrop-blur-sm border-border flex-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-foreground font-mono text-sm">Generation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Describe your context and requirements..."
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground font-mono text-sm min-h-[80px] resize-none"
                    value={contextInput}
                    onChange={(e) => handleContextChange(e.target.value)}
                  />

                  {promptPreview && (
                    <Card className="bg-muted/20 border-border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-foreground font-mono text-xs flex items-center">
                          <Eye className="w-3 h-3 mr-2" />
                          Live Preview
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="bg-background/50 border border-border rounded p-3 max-h-32 overflow-y-auto">
                          <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                            {promptPreview}
                          </pre>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {isGenerating && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-muted-foreground">Generating...</span>
                        <span className="text-primary">{generationProgress}%</span>
                      </div>
                      <Progress value={generationProgress} className="h-2" />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating || isTesting}
                      className="bg-emerald-500 hover:bg-emerald-600 text-black font-mono flex-1 text-sm disabled:opacity-50"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      {isGenerating ? "Generating..." : "Generate"}
                    </Button>
                    <Button
                      onClick={handleAITest}
                      disabled={!selectedModule || !promptPreview || isTesting || isGenerating}
                      variant="outline"
                      className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 bg-transparent font-mono text-sm"
                    >
                      <TestTube className="w-4 h-4 mr-2" />
                      {isTesting ? "Testing..." : "AI Test"}
                    </Button>
                    <Select value={exportFormat} onValueChange={setExportFormat}>
                      <SelectTrigger className="w-24 bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="txt">TXT</SelectItem>
                        <SelectItem value="md">MD</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      className="flex-1 border-border text-foreground hover:bg-muted font-mono text-sm bg-transparent"
                      onClick={handleExport}
                      disabled={isExporting || !selectedModule}
                    >
                      {isExporting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Export Results
                        </>
                      )}
                    </Button>
                  </div>

                  {aiResponse && (
                    <Card className="bg-muted/20 border-border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-foreground font-mono text-xs flex items-center">
                          <Brain className="w-3 h-3 mr-2" />
                          AI Response
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="bg-background/50 border border-border rounded p-3 max-h-32 overflow-y-auto">
                          <p className="text-xs text-muted-foreground">{aiResponse}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>

              {/* Quality Metrics */}
              <Card className="bg-card/80 backdrop-blur-sm border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-foreground font-mono text-sm flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Quality Metrics
                    {testResults?.passThreshold && <CheckCircle className="w-4 h-4 ml-2 text-emerald-400" />}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-mono text-sm">Overall Score</span>
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-mono text-lg font-bold">{qualityMetrics.overallScore}%</span>
                      {testResults?.grade && (
                        <Badge
                          variant={
                            testResults.grade === "A" ? "default" : testResults.grade === "B" ? "secondary" : "outline"
                          }
                          className="font-mono"
                        >
                          {testResults.grade}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[
                      { label: "Clarity", value: qualityMetrics.clarity },
                      { label: "Execution", value: qualityMetrics.execution },
                      { label: "Business Fit", value: qualityMetrics.businessFit },
                    ].map((metric) => (
                      <div key={metric.label} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-mono">{metric.label}</span>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={metric.value}
                            className={`w-16 h-1 ${metric.value >= 80 ? "text-emerald-400" : metric.value >= 70 ? "text-yellow-400" : "text-red-400"}`}
                          />
                          <span className="text-primary font-mono w-8">{metric.value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {testResults?.passThreshold !== undefined && (
                    <div
                      className={`p-2 rounded border text-xs font-mono ${
                        testResults.passThreshold
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : "bg-red-500/10 border-red-500/30 text-red-400"
                      }`}
                    >
                      {testResults.passThreshold
                        ? "✓ Passes quality threshold (≥80%)"
                        : "✗ Below quality threshold (<80%)"}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {selectedModule && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedModule(null)}
        >
          <Card
            className="bg-card border-border max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="border-b border-border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="outline" className="border-primary text-primary font-mono">
                      {selectedModule.code}
                    </Badge>
                    <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground font-mono">
                      {selectedModule.vector}
                    </Badge>
                    <Badge variant="outline" className="border-border text-muted-foreground font-mono">
                      {selectedModule.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-foreground font-mono text-xl mb-2">{selectedModule.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">{selectedModule.description}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary font-mono flex items-center">
                    <Star className="w-6 h-6 mr-2" />
                    {selectedModule.score}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">Quality Score</div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-mono text-sm text-muted-foreground mb-2">Module Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="text-foreground font-mono">{selectedModule.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Estimated Time:</span>
                        <span className="text-foreground font-mono">{selectedModule.estimatedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Complexity:</span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 10 }, (_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < selectedModule.complexity ? "bg-primary" : "bg-muted"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-mono text-sm text-muted-foreground mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedModule.tags?.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-muted text-muted-foreground font-mono text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-mono text-sm text-muted-foreground mb-2">Vector Analysis</h4>
                    <div className="space-y-2">
                      {selectedModule.vectors.map((vectorId) => {
                        const VectorIcon = vectorIcons[vectorId]
                        return (
                          <div key={vectorId} className="flex items-center gap-2 text-sm">
                            <VectorIcon className="w-4 h-4 text-primary" />
                            <span className="text-foreground font-mono">{vectorNames[vectorId]}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-mono text-sm text-muted-foreground mb-2">Requirements</h4>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span>Plan: {selectedModule.plan}+</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span>7D Framework configured</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <div className="border-t border-border p-6">
              <div className="flex gap-4">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-mono">
                  <Play className="w-4 h-4 mr-2" />
                  Run Module
                </Button>
                <Button
                  variant="outline"
                  className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400 font-mono bg-transparent"
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  Test Run
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedModule(null)}
                  className="text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 font-mono ml-auto"
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
