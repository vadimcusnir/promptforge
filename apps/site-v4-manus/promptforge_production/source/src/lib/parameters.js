// PromptForge 7D Parameter Engine
// Industrial-grade prompt configuration system

export const parameterSchema = {
  domain: {
    label: 'Domain',
    description: 'The primary field or industry context',
    type: 'select',
    required: true,
    options: [
      { value: 'marketing', label: 'Marketing & Sales' },
      { value: 'technology', label: 'Technology & Engineering' },
      { value: 'finance', label: 'Finance & Accounting' },
      { value: 'healthcare', label: 'Healthcare & Medical' },
      { value: 'education', label: 'Education & Training' },
      { value: 'legal', label: 'Legal & Compliance' },
      { value: 'operations', label: 'Operations & Logistics' },
      { value: 'hr', label: 'Human Resources' },
      { value: 'research', label: 'Research & Development' },
      { value: 'consulting', label: 'Consulting & Advisory' }
    ],
    default: 'marketing'
  },
  
  scale: {
    label: 'Scale',
    description: 'The scope and magnitude of the project',
    type: 'select',
    required: true,
    options: [
      { value: 'personal', label: 'Personal (Individual)' },
      { value: 'team', label: 'Team (5-15 people)' },
      { value: 'department', label: 'Department (15-50 people)' },
      { value: 'company', label: 'Company (50-500 people)' },
      { value: 'enterprise', label: 'Enterprise (500+ people)' },
      { value: 'industry', label: 'Industry-wide' },
      { value: 'global', label: 'Global Scale' }
    ],
    default: 'team'
  },
  
  urgency: {
    label: 'Urgency',
    description: 'Time sensitivity and priority level',
    type: 'select',
    required: true,
    options: [
      { value: 'low', label: 'Low (Weeks/Months)' },
      { value: 'medium', label: 'Medium (Days/Weeks)' },
      { value: 'high', label: 'High (Hours/Days)' },
      { value: 'critical', label: 'Critical (Immediate)' }
    ],
    default: 'medium'
  },
  
  complexity: {
    label: 'Complexity',
    description: 'Technical and conceptual difficulty level',
    type: 'select',
    required: true,
    options: [
      { value: 'simple', label: 'Simple (Straightforward)' },
      { value: 'moderate', label: 'Moderate (Some complexity)' },
      { value: 'complex', label: 'Complex (Multi-faceted)' },
      { value: 'expert', label: 'Expert (Highly specialized)' }
    ],
    default: 'moderate'
  },
  
  resources: {
    label: 'Resources',
    description: 'Available resources and constraints',
    type: 'select',
    required: false,
    options: [
      { value: 'minimal', label: 'Minimal (Limited budget/time)' },
      { value: 'standard', label: 'Standard (Normal allocation)' },
      { value: 'full-team', label: 'Full Team (Dedicated resources)' },
      { value: 'unlimited', label: 'Unlimited (No constraints)' }
    ],
    default: 'standard'
  },
  
  application: {
    label: 'Application',
    description: 'Primary use case and implementation context',
    type: 'select',
    required: false,
    options: [
      { value: 'analysis', label: 'Analysis & Research' },
      { value: 'strategy', label: 'Strategy & Planning' },
      { value: 'execution', label: 'Execution & Implementation' },
      { value: 'optimization', label: 'Optimization & Improvement' },
      { value: 'automation', label: 'Automation & Scaling' },
      { value: 'training', label: 'Training & Education' },
      { value: 'communication', label: 'Communication & Reporting' },
      { value: 'innovation', label: 'Innovation & Development' }
    ],
    default: 'strategy'
  },
  
  output: {
    label: 'Output Format',
    description: 'Desired format and structure of results',
    type: 'select',
    required: true,
    options: [
      { value: 'structured', label: 'Structured (Organized sections)' },
      { value: 'narrative', label: 'Narrative (Flowing text)' },
      { value: 'checklist', label: 'Checklist (Action items)' },
      { value: 'framework', label: 'Framework (Systematic approach)' },
      { value: 'template', label: 'Template (Reusable format)' },
      { value: 'report', label: 'Report (Comprehensive document)' },
      { value: 'presentation', label: 'Presentation (Slide format)' },
      { value: 'code', label: 'Code (Technical implementation)' }
    ],
    default: 'structured'
  }
}

// Default parameter values
export const defaultParameters = {
  domain: 'marketing',
  scale: 'team',
  urgency: 'medium',
  complexity: 'moderate',
  resources: 'standard',
  application: 'strategy',
  output: 'structured'
}

// Parameter validation
export const validateParameters = (params) => {
  const errors = {}
  
  Object.keys(parameterSchema).forEach(key => {
    const schema = parameterSchema[key]
    const value = params[key]
    
    // Check required fields
    if (schema.required && (!value || value === '')) {
      errors[key] = `${schema.label} is required`
      return
    }
    
    // Check valid options
    if (value && schema.options) {
      const validOptions = schema.options.map(opt => opt.value)
      if (!validOptions.includes(value)) {
        errors[key] = `Invalid ${schema.label} value`
      }
    }
  })
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Parameter scoring for optimization
export const scoreParameters = (params) => {
  let score = 0
  let maxScore = 0
  
  // Completeness score
  Object.keys(parameterSchema).forEach(key => {
    maxScore += 10
    if (params[key] && params[key] !== '') {
      score += 10
    }
  })
  
  // Consistency score (bonus for logical combinations)
  if (params.urgency === 'critical' && params.resources === 'unlimited') {
    score += 5 // Bonus for aligned urgency and resources
  }
  
  if (params.complexity === 'expert' && params.scale === 'enterprise') {
    score += 5 // Bonus for appropriate complexity/scale match
  }
  
  if (params.urgency === 'low' && params.complexity === 'simple') {
    score += 3 // Bonus for aligned urgency and complexity
  }
  
  return Math.min(100, Math.round((score / maxScore) * 100))
}

// Generate parameter combinations for testing
export const generateParameterCombinations = (count = 10) => {
  const combinations = []
  
  for (let i = 0; i < count; i++) {
    const params = {}
    
    Object.keys(parameterSchema).forEach(key => {
      const schema = parameterSchema[key]
      if (schema.options) {
        const randomIndex = Math.floor(Math.random() * schema.options.length)
        params[key] = schema.options[randomIndex].value
      }
    })
    
    combinations.push(params)
  }
  
  return combinations
}

// Parameter presets for common use cases
export const parameterPresets = {
  'startup-mvp': {
    domain: 'technology',
    scale: 'team',
    urgency: 'high',
    complexity: 'moderate',
    resources: 'minimal',
    application: 'execution',
    output: 'checklist'
  },
  
  'enterprise-strategy': {
    domain: 'consulting',
    scale: 'enterprise',
    urgency: 'medium',
    complexity: 'complex',
    resources: 'full-team',
    application: 'strategy',
    output: 'framework'
  },
  
  'marketing-campaign': {
    domain: 'marketing',
    scale: 'company',
    urgency: 'high',
    complexity: 'moderate',
    resources: 'standard',
    application: 'execution',
    output: 'template'
  },
  
  'research-project': {
    domain: 'research',
    scale: 'department',
    urgency: 'low',
    complexity: 'expert',
    resources: 'full-team',
    application: 'analysis',
    output: 'report'
  },
  
  'crisis-response': {
    domain: 'operations',
    scale: 'company',
    urgency: 'critical',
    complexity: 'complex',
    resources: 'unlimited',
    application: 'execution',
    output: 'checklist'
  }
}

