import { ModuleDefinition } from "@/lib/modules"

export interface FormField {
  id: string
  type: 'string' | 'number' | 'array' | 'object' | 'select'
  label: string
  description: string
  required: boolean
  validation?: string
  example?: string
  options?: { value: string; label: string }[]
  placeholder?: string
}

export interface FormData {
  [key: string]: any
}

export function parseInputSchema(module: ModuleDefinition): FormField[] {
  const fields: FormField[] = []
  
  Object.entries(module.input_schema).forEach(([key, config]) => {
    const field: FormField = {
      id: key,
      type: config.type as any,
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
      description: config.description || '',
      required: config.required || false,
      validation: config.validation,
      example: config.example,
      placeholder: config.example || `Enter ${key.replace(/_/g, ' ')}`
    }

    // Handle validation patterns for select fields
    if (config.validation && config.validation.startsWith('^') && config.validation.endsWith('$')) {
      const options = config.validation
        .replace(/^\(/, '')
        .replace(/\)$/, '')
        .split('|')
        .map((opt: string) => ({ value: opt, label: opt.charAt(0).toUpperCase() + opt.slice(1) }))
      
      field.type = 'select'
      field.options = options
    }

    // Handle array types
    if (config.type === 'array' && config.example) {
      field.placeholder = `Enter values separated by commas (e.g., ${config.example})`
    }

    // Handle object types
    if (config.type === 'object' && config.example) {
      field.placeholder = `Enter as JSON (e.g., ${config.example})`
    }

    fields.push(field)
  })

  return fields
}

export function validateFormData(data: FormData, fields: FormField[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  fields.forEach(field => {
    if (field.required && (!data[field.id] || data[field.id] === '')) {
      errors.push(`${field.label} is required`)
    }

    if (data[field.id] && field.validation) {
      const value = data[field.id]
      
      // Handle regex validation
      if (field.validation.startsWith('^') && field.validation.endsWith('$')) {
        const regex = new RegExp(field.validation)
        if (!regex.test(value)) {
          errors.push(`${field.label} format is invalid`)
        }
      }

      // Handle numeric validation
      if (field.type === 'number' && isNaN(Number(value))) {
        errors.push(`${field.label} must be a number`)
      }

      // Handle array validation
      if (field.type === 'array' && Array.isArray(value)) {
        if (value.length === 0) {
          errors.push(`${field.label} cannot be empty`)
        }
      }
    }
  })

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function formatFormData(data: FormData, fields: FormField[]): FormData {
  const formatted: FormData = {}

  fields.forEach(field => {
    let value = data[field.id]

    if (value === undefined || value === '') {
      if (field.required) {
        value = field.example || ''
      } else {
        return
      }
    }

    // Handle array types
    if (field.type === 'array' && typeof value === 'string') {
      value = value.split(',').map(item => item.trim()).filter(item => item.length > 0)
    }

    // Handle object types
    if (field.type === 'object' && typeof value === 'string') {
      try {
        value = JSON.parse(value)
      } catch {
        value = {}
      }
    }

    // Handle number types
    if (field.type === 'number') {
      value = Number(value)
    }

    formatted[field.id] = value
  })

  return formatted
}
