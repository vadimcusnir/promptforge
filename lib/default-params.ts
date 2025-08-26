export interface Params7D {
  domain: string
  scale: string
  urgency: string
  complexity: string
  resources: string
  application: string
  output: string
}

export const default7D: Params7D = {
  domain: "marketing",
  scale: "personal_brand",
  urgency: "medium",
  complexity: "foundational",
  resources: "minimal",
  application: "training",
  output: "txt",
}

export const paramOptions = {
  domain: [
    { value: "marketing", label: "Marketing" },
    { value: "business", label: "Business" },
    { value: "technical", label: "Technical" },
    { value: "creative", label: "Creative" },
    { value: "educational", label: "Educational" },
  ],
  scale: [
    { value: "personal_brand", label: "Personal Brand" },
    { value: "individual", label: "Individual" },
    { value: "team", label: "Team" },
    { value: "organization", label: "Organization" },
    { value: "enterprise", label: "Enterprise" },
  ],
  urgency: [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
  ],
  complexity: [
    { value: "foundational", label: "Foundational" },
    { value: "simple", label: "Simple" },
    { value: "moderate", label: "Moderate" },
    { value: "complex", label: "Complex" },
    { value: "expert", label: "Expert" },
  ],
  resources: [
    { value: "minimal", label: "Minimal" },
    { value: "standard", label: "Standard" },
    { value: "extensive", label: "Extensive" },
    { value: "unlimited", label: "Unlimited" },
  ],
  application: [
    { value: "training", label: "Training" },
    { value: "analysis", label: "Analysis" },
    { value: "creation", label: "Creation" },
    { value: "optimization", label: "Optimization" },
    { value: "automation", label: "Automation" },
  ],
  output: [
    { value: "txt", label: "Text (.txt)" },
    { value: "md", label: "Markdown (.md)" },
    { value: "json", label: "JSON (.json)" },
    { value: "pdf", label: "PDF (.pdf)" },
  ],
}
