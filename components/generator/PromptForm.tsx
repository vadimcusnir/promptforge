"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FormField, FormData, parseInputSchema, validateFormData, formatFormData } from "@/utils/parseInputSchema"
import { ModuleDefinition } from "@/lib/modules"
import { AlertCircle, CheckCircle, Info } from "lucide-react"

interface PromptFormProps {
  module: ModuleDefinition
  onSubmit: (data: FormData) => void
  isSubmitting?: boolean
}

export function PromptForm({ module, onSubmit, isSubmitting = false }: PromptFormProps) {
  const [formData, setFormData] = useState<FormData>({})
  const [errors, setErrors] = useState<string[]>([])
  const [touched, setTouched] = useState<Set<string>>(new Set())

  const fields = parseInputSchema(module)

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
    
    // Mark field as touched
    setTouched(prev => new Set(prev).add(fieldId))
    
    // Clear errors for this field
    if (errors.length > 0) {
      setErrors([])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form data
    const validation = validateFormData(formData, fields)
    
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }
    
    // Format and submit data
    const formattedData = formatFormData(formData, fields)
    onSubmit(formattedData)
  }

  const renderField = (field: FormField) => {
    const value = formData[field.id] || ""
    const hasError = errors.some(error => error.includes(field.label))
    const isTouched = touched.has(field.id)

    switch (field.type) {
      case "select":
        return (
          <Select value={value} onValueChange={(val) => handleInputChange(field.id, val)}>
            <SelectTrigger className={`bg-black/50 border-gray-700 ${hasError ? 'border-red-500' : ''}`}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "array":
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={`bg-black/50 border-gray-700 ${hasError ? 'border-red-500' : ''}`}
          />
        )

      case "object":
        return (
          <Textarea
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={`bg-black/50 border-gray-700 min-h-[80px] ${hasError ? 'border-red-500' : ''}`}
          />
        )

      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={`bg-black/50 border-gray-700 ${hasError ? 'border-red-500' : ''}`}
          />
        )

      default: // string
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={`bg-black/50 border-gray-700 ${hasError ? 'border-red-500' : ''}`}
          />
        )
    }
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="font-serif flex items-center gap-2">
          <Info className="w-5 h-5 text-yellow-400" />
          Module Configuration
        </CardTitle>
        <CardDescription>
          Configure {module.name} parameters for prompt generation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Module Info */}
          <div className="bg-black/30 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-lg">{module.name}</h3>
              <Badge variant="outline" className="text-yellow-400">
                {module.vectors.join(", ")}
              </Badge>
            </div>
            <p className="text-sm text-gray-400 mb-3">{module.description}</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Difficulty:</span>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-3 h-3 rounded-full ${
                        level <= module.difficulty ? 'bg-yellow-400' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Tokens:</span>
                <div className="font-medium">{module.estimated_tokens.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-500">Plan:</span>
                <Badge variant="secondary" className="ml-2">
                  {module.requires_plan === 'pilot' ? 'Creator+' : 
                   module.requires_plan === 'pro' ? 'Pro+' : 'Enterprise'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={field.id} className="text-sm font-medium">
                    {field.label}
                    {field.required && <span className="text-red-400 ml-1">*</span>}
                  </Label>
                  {field.validation && (
                    <Badge variant="outline" className="text-xs text-gray-400">
                      {field.validation}
                    </Badge>
                  )}
                </div>
                
                {renderField(field)}
                
                {field.description && (
                  <p className="text-xs text-gray-500">{field.description}</p>
                )}
                
                {field.example && (
                  <p className="text-xs text-gray-600">
                    Example: <code className="bg-gray-800 px-1 rounded">{field.example}</code>
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Validation Errors */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <div className="text-sm text-gray-400">
              {fields.filter(f => f.required).length} required fields
            </div>
            <Button
              type="submit"
              disabled={isSubmitting || fields.filter(f => f.required).some(f => !formData[f.id])}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Generate Prompt
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
