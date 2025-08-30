import { ModuleDefinition } from "@/lib/modules"
import { FormData } from "./parseInputSchema"

export interface CompiledPrompt {
  content: string
  runId: string
  hash: string
  metadata: {
    moduleId: string
    timestamp: string
    inputValues: FormData
    estimatedTokens: number
  }
}

export interface PromptRun {
  id: string
  moduleId: string
  prompt: string
  inputValues: FormData
  timestamp: string
  hash: string
  scores?: {
    structure: number
    clarity: number
    kpi_compliance: number
    executability: number
  }
  tokensUsed?: number
  cost?: number
  plan: string
}

// Simple Handlebars-like template engine
function compileTemplate(template: string, data: FormData): string {
  let result = template

  // Handle {{variable}} replacements
  result = result.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
    const keys = key.trim().split('.')
    let value: any = data
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        value = undefined
        break
      }
    }
    
    return value !== undefined ? String(value) : match
  })

  // Handle {{#each array}}...{{/each}} loops
  result = result.replace(/\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, arrayKey, content) => {
    const array = data[arrayKey.trim()]
    if (!Array.isArray(array)) return match
    
    return array.map((item, index) => {
      let itemContent = content
      
      // Replace {{@index}} with array index
      itemContent = itemContent.replace(/\{\{@index\}\}/g, String(index))
      
      // Replace item properties
      if (typeof item === 'object') {
        Object.entries(item).forEach(([key, value]) => {
          const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
          itemContent = itemContent.replace(regex, String(value))
        })
      }
      
      return itemContent
    }).join('')
  })

  return result
}

export function generatePrompt(module: ModuleDefinition, inputValues: FormData): CompiledPrompt {
  // Compile the template with input values
  const content = compileTemplate(module.output_template, inputValues)
  
  // Generate run ID and hash
  const timestamp = new Date().toISOString()
  const runId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
  const hash = generateHash(content + timestamp + JSON.stringify(inputValues))
  
  return {
    content,
    runId,
    hash,
    metadata: {
      moduleId: module.id.toString(),
      timestamp,
      inputValues,
      estimatedTokens: module.estimated_tokens
    }
  }
}

export function generateHash(input: string): string {
  // Simple hash function - in production, use crypto.createHash('sha256')
  let hash = 0
  if (input.length === 0) return hash.toString(36)
  
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36)
}

export function createPromptRun(
  module: ModuleDefinition, 
  inputValues: FormData, 
  plan: string,
  scores?: PromptRun['scores'],
  tokensUsed?: number,
  cost?: number
): PromptRun {
  const compiled = generatePrompt(module, inputValues)
  
  return {
    id: compiled.runId,
    moduleId: module.id.toString(),
    prompt: compiled.content,
    inputValues,
    timestamp: compiled.metadata.timestamp,
    hash: compiled.hash,
    scores,
    tokensUsed,
    cost,
    plan
  }
}

export function simulateGptResponse(prompt: string): Promise<{
  response: string
  scores: PromptRun['scores']
  tokensUsed: number
  cost: number
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate AI response and scoring
      const scores = {
        structure: Math.floor(Math.random() * 20) + 80,
        clarity: Math.floor(Math.random() * 20) + 80,
        kpi_compliance: Math.floor(Math.random() * 20) + 70,
        executability: Math.floor(Math.random() * 20) + 85,
      }
      
      const tokensUsed = Math.floor(Math.random() * 1000) + 500
      const cost = (tokensUsed / 1000) * 0.002 // Simulate $0.002 per 1K tokens
      
      resolve({
        response: `Simulated AI response to: ${prompt.substring(0, 100)}...`,
        scores,
        tokensUsed,
        cost
      })
    }, 2000)
  })
}
