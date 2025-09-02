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
    { value: "saas", label: "SaaS" },
    { value: "fintech", label: "FinTech" },
    { value: "ecommerce", label: "E-Commerce" },
    { value: "consulting", label: "Consulting" },
    { value: "education", label: "Education" },
    { value: "healthcare", label: "Healthcare" },
    { value: "marketing", label: "Marketing" },
    { value: "business", label: "Business" },
    { value: "technical", label: "Technical" },
    { value: "creative", label: "Creative" },
  ],
  scale: [
    { value: "personal_brand", label: "Personal Brand" },
    { value: "solo", label: "Solo" },
    { value: "startup", label: "Startup" },
    { value: "smb", label: "SMB" },
    { value: "corporate", label: "Corporate" },
    { value: "enterprise", label: "Enterprise" },
  ],
  urgency: [
    { value: "low", label: "Low" },
    { value: "planned", label: "Planned" },
    { value: "sprint", label: "Sprint" },
    { value: "pilot", label: "Pilot" },
    { value: "crisis", label: "Crisis" },
  ],
  complexity: [
    { value: "foundational", label: "Foundational" },
    { value: "standard", label: "Standard" },
    { value: "advanced", label: "Advanced" },
    { value: "expert", label: "Expert" },
  ],
  resources: [
    { value: "minimal", label: "Minimal" },
    { value: "solo", label: "Solo" },
    { value: "lean_team", label: "Lean Team" },
    { value: "agency_stack", label: "Agency Stack" },
    { value: "full_stack_org", label: "Full Stack Org" },
    { value: "enterprise_budget", label: "Enterprise Budget" },
  ],
  application: [
    { value: "training", label: "Training" },
    { value: "audit", label: "Audit" },
    { value: "implementation", label: "Implementation" },
    { value: "strategy", label: "Strategy" },
    { value: "crisis_response", label: "Crisis Response" },
    { value: "experimentation", label: "Experimentation" },
    { value: "documentation", label: "Documentation" },
  ],
  output: [
    { value: "txt", label: "Text (.txt)" },
    { value: "md", label: "Markdown (.md)" },
    { value: "checklist", label: "Checklist" },
    { value: "spec", label: "Specification" },
    { value: "playbook", label: "Playbook" },
    { value: "json", label: "JSON (.json)" },
    { value: "yaml", label: "YAML (.yaml)" },
    { value: "diagram", label: "Diagram" },
    { value: "bundle", label: "Bundle (.zip)" },
    { value: "pdf", label: "PDF (.pdf)" },
  ],
}
