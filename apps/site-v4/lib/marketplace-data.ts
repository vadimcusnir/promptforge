export interface ModulePack {
  id: string
  name: string
  description: string
  category: string
  modules: string[]
  price: number
  originalPrice?: number
  sales: number
  rating: number
  successRate: number
  expectedResults: string
  lastUpdated: string
  features: string[]
  testimonials: {
    name: string
    company: string
    text: string
    results: string
  }[]
  caseStudies: {
    title: string
    industry: string
    challenge: string
    solution: string
    results: string
    metrics: {
      metric: string
      before: string
      after: string
      improvement: string
    }[]
  }[]
  deliverables: {
    type: string
    description: string
    format: string
  }[]
  requirements: string[]
  timeline: string
  support: string
  license: "single" | "team" | "enterprise"
  stripeProductId: string
  stripePriceId: string
}

export const marketplacePacks: ModulePack[] = [
  {
    id: "sales-accelerator",
    name: "Sales Accelerator",
    description: "Accelerate B2B sales through certified KPI prompts. Boost conversion rates and reduce sales cycles.",
    category: "sales",
    modules: ["M06", "M03", "M22", "M11", "M14", "M18"],
    price: 497,
    originalPrice: 697,
    sales: 127,
    rating: 4.8,
    successRate: 94,
    expectedResults: "CR +15%, D30 retention >35%, Sales cycle -20%",
    lastUpdated: "2024-01-15",
    features: [
      "6 Industrial Sales Modules",
      "Agentic GPT Sales Framework",
      "7-to-1 Conversion Code",
      "SOP Lead Generation",
      "Funnel Optimization",
      "Authority Content Commerce",
      "Carousel RFA System",
    ],
    testimonials: [
      {
        name: "Sarah Chen",
        company: "TechCorp Solutions",
        text: "Increased our B2B conversion rate by 18% in just 30 days. The prompts are incredibly precise.",
        results: "18% CR increase, $2.3M additional revenue",
      },
      {
        name: "Mike Rodriguez",
        company: "Growth Dynamics",
        text: "Cut our sales cycle from 90 to 65 days. The lead generation module is a game-changer.",
        results: "25-day reduction in sales cycle",
      },
    ],
    caseStudies: [
      {
        title: "SaaS Startup Scales to $10M ARR",
        industry: "B2B SaaS",
        challenge: "Low conversion rates and long sales cycles",
        solution: "Implemented Sales Accelerator pack with focus on M06 and M22",
        results: "Achieved $10M ARR in 18 months",
        metrics: [
          { metric: "Conversion Rate", before: "2.3%", after: "3.8%", improvement: "+65%" },
          { metric: "Sales Cycle", before: "120 days", after: "85 days", improvement: "-29%" },
          { metric: "Lead Quality", before: "45%", after: "72%", improvement: "+60%" },
        ],
      },
    ],
    deliverables: [
      { type: "Prompt Library", description: "6 industrial-grade sales prompts", format: "MD files" },
      { type: "KPI Dashboard", description: "Real-time sales metrics tracking", format: "JSON templates" },
      { type: "Implementation Guide", description: "Step-by-step deployment checklist", format: "PDF" },
      { type: "Case Studies", description: "3 validated success stories", format: "MD files" },
    ],
    requirements: ["CRM system", "Email marketing platform", "Basic sales team"],
    timeline: "2-4 weeks implementation",
    support: "90-day email support included",
    license: "team",
    stripeProductId: "prod_sales_accelerator",
    stripePriceId: "price_sales_accelerator_497",
  },
  {
    id: "creator-commerce",
    name: "Creator Commerce",
    description:
      "Transform content creators into commerce powerhouses. Viral loops, K-factors, and subscription engines.",
    category: "commerce",
    modules: ["M35", "M34", "M09"],
    price: 297,
    sales: 89,
    rating: 4.7,
    successRate: 91,
    expectedResults: "K-Factor >1.2, Subscription rate +40%, Revenue per creator +85%",
    lastUpdated: "2024-01-12",
    features: [
      "3 Creator-Focused Modules",
      "Content Heatmap System",
      "K-Factor Optimization",
      "Post-Purchase Subscription Engine",
      "Viral Loop Architecture",
      "Creator Analytics Dashboard",
    ],
    testimonials: [
      {
        name: "Emma Wilson",
        company: "Creator Studio",
        text: "Our creators saw 85% increase in revenue per subscriber. The K-factor module is pure gold.",
        results: "85% revenue increase, 1.4 K-factor achieved",
      },
    ],
    caseStudies: [
      {
        title: "Fashion Creator Hits 7-Figure Revenue",
        industry: "Fashion & Lifestyle",
        challenge: "Low monetization and subscriber retention",
        solution: "Deployed Creator Commerce pack with viral loop focus",
        results: "Reached $1.2M annual revenue",
        metrics: [
          { metric: "K-Factor", before: "0.8", after: "1.4", improvement: "+75%" },
          { metric: "Subscription Rate", before: "12%", after: "28%", improvement: "+133%" },
          { metric: "Revenue per Creator", before: "$450", after: "$1,200", improvement: "+167%" },
        ],
      },
    ],
    deliverables: [
      { type: "Creator Prompts", description: "3 commerce-optimized modules", format: "MD files" },
      { type: "Analytics Templates", description: "Creator performance tracking", format: "JSON" },
      { type: "Viral Loop Guide", description: "K-factor optimization playbook", format: "PDF" },
    ],
    requirements: ["Content platform", "Payment processor", "Email system"],
    timeline: "1-3 weeks implementation",
    support: "60-day email support included",
    license: "single",
    stripeProductId: "prod_creator_commerce",
    stripePriceId: "price_creator_commerce_297",
  },
  {
    id: "edu-ops",
    name: "Edu Ops",
    description:
      "Educational operations excellence. Course creation, student engagement, and learning outcome optimization.",
    category: "education",
    modules: ["M47", "M21", "M10"],
    price: 397,
    sales: 45,
    rating: 4.9,
    successRate: 96,
    expectedResults: "Course completion +30%, Student satisfaction >90%, Revenue per course +50%",
    lastUpdated: "2024-01-10",
    features: [
      "3 Education-Specific Modules",
      "Course Creation Framework",
      "Student Engagement System",
      "Learning Outcome Tracking",
      "Assessment Optimization",
      "Retention Analytics",
    ],
    testimonials: [
      {
        name: "Dr. James Park",
        company: "EduTech Institute",
        text: "Course completion rates jumped from 65% to 89%. Students are more engaged than ever.",
        results: "24% completion rate increase",
      },
    ],
    caseStudies: [
      {
        title: "Online University Doubles Completion Rates",
        industry: "Higher Education",
        challenge: "Low course completion and student engagement",
        solution: "Implemented Edu Ops pack across 50+ courses",
        results: "Completion rates increased from 45% to 87%",
        metrics: [
          { metric: "Course Completion", before: "45%", after: "87%", improvement: "+93%" },
          { metric: "Student Satisfaction", before: "7.2/10", after: "9.1/10", improvement: "+26%" },
          { metric: "Revenue per Course", before: "$2,400", after: "$4,100", improvement: "+71%" },
        ],
      },
    ],
    deliverables: [
      { type: "Education Prompts", description: "3 learning-optimized modules", format: "MD files" },
      { type: "Course Templates", description: "Structured learning frameworks", format: "JSON" },
      { type: "Assessment Tools", description: "Learning outcome measurement", format: "PDF" },
    ],
    requirements: ["LMS platform", "Student database", "Assessment tools"],
    timeline: "3-6 weeks implementation",
    support: "120-day email support included",
    license: "enterprise",
    stripeProductId: "prod_edu_ops",
    stripePriceId: "price_edu_ops_397",
  },
]

export function getPackById(id: string): ModulePack | undefined {
  return marketplacePacks.find((pack) => pack.id === id)
}

export function getPacksByCategory(category: string): ModulePack[] {
  if (category === "all") return marketplacePacks
  return marketplacePacks.filter((pack) => pack.category === category)
}

export function getFeaturedPacks(): ModulePack[] {
  return marketplacePacks.filter((pack) => pack.sales > 50).slice(0, 3)
}
