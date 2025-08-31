import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  AlertCircle, 
  Info,
  ChevronDown,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  Lock,
  CreditCard,
  Building,
  Globe
} from 'lucide-react'

const MobileForm = ({ 
  fields = [], 
  onSubmit, 
  submitText = "Submit", 
  isLoading = false,
  className = "",
  title,
  description,
  showProgress = false,
  currentStep = 1,
  totalSteps = 1
}) => {
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [showPasswords, setShowPasswords] = useState({})
  const [focusedField, setFocusedField] = useState(null)
  const formRef = useRef(null)

  // Initialize form data
  useEffect(() => {
    const initialData = {}
    fields.forEach(field => {
      initialData[field.name] = field.defaultValue || ''
    })
    setFormData(initialData)
  }, [fields])

  // Field validation
  const validateField = (field, value) => {
    const errors = []

    // Required validation
    if (field.required && (!value || value.toString().trim() === '')) {
      errors.push(`${field.label} is required`)
    }

    // Type-specific validation
    if (value && value.toString().trim() !== '') {
      switch (field.type) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value)) {
            errors.push('Please enter a valid email address')
          }
          break
        
        case 'tel':
          const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
          if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            errors.push('Please enter a valid phone number')
          }
          break
        
        case 'password':
          if (field.minLength && value.length < field.minLength) {
            errors.push(`Password must be at least ${field.minLength} characters`)
          }
          if (field.requireUppercase && !/[A-Z]/.test(value)) {
            errors.push('Password must contain at least one uppercase letter')
          }
          if (field.requireLowercase && !/[a-z]/.test(value)) {
            errors.push('Password must contain at least one lowercase letter')
          }
          if (field.requireNumbers && !/\d/.test(value)) {
            errors.push('Password must contain at least one number')
          }
          if (field.requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            errors.push('Password must contain at least one special character')
          }
          break
        
        case 'url':
          try {
            new URL(value)
          } catch {
            errors.push('Please enter a valid URL')
          }
          break
        
        case 'number':
          if (isNaN(value)) {
            errors.push('Please enter a valid number')
          } else {
            const num = parseFloat(value)
            if (field.min !== undefined && num < field.min) {
              errors.push(`Value must be at least ${field.min}`)
            }
            if (field.max !== undefined && num > field.max) {
              errors.push(`Value must be at most ${field.max}`)
            }
          }
          break
      }
    }

    // Custom validation
    if (field.validate && typeof field.validate === 'function') {
      const customError = field.validate(value, formData)
      if (customError) {
        errors.push(customError)
      }
    }

    return errors
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field.name]: value }))
    
    // Real-time validation for touched fields
    if (touched[field.name]) {
      const fieldErrors = validateField(field, value)
      setErrors(prev => ({ ...prev, [field.name]: fieldErrors }))
    }
  }

  const handleInputBlur = (field) => {
    setTouched(prev => ({ ...prev, [field.name]: true }))
    const fieldErrors = validateField(field, formData[field.name])
    setErrors(prev => ({ ...prev, [field.name]: fieldErrors }))
    setFocusedField(null)
  }

  const handleInputFocus = (field) => {
    setFocusedField(field.name)
  }

  const togglePasswordVisibility = (fieldName) => {
    setShowPasswords(prev => ({ ...prev, [fieldName]: !prev[fieldName] }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate all fields
    const allErrors = {}
    let hasErrors = false

    fields.forEach(field => {
      const fieldErrors = validateField(field, formData[field.name])
      if (fieldErrors.length > 0) {
        allErrors[field.name] = fieldErrors
        hasErrors = true
      }
    })

    setErrors(allErrors)
    setTouched(fields.reduce((acc, field) => ({ ...acc, [field.name]: true }), {}))

    if (!hasErrors && onSubmit) {
      onSubmit(formData)
    } else if (hasErrors) {
      // Focus first error field
      const firstErrorField = fields.find(field => allErrors[field.name])
      if (firstErrorField) {
        const element = formRef.current?.querySelector(`[name="${firstErrorField.name}"]`)
        element?.focus()
      }
    }
  }

  const getFieldIcon = (type) => {
    const iconMap = {
      email: Mail,
      tel: Phone,
      password: Lock,
      text: User,
      search: Search,
      url: Globe,
      number: Building,
      date: Calendar,
      time: Clock,
      location: MapPin,
      card: CreditCard
    }
    return iconMap[type] || User
  }

  const renderField = (field) => {
    const IconComponent = getFieldIcon(field.type)
    const hasError = errors[field.name] && errors[field.name].length > 0
    const isFocused = focusedField === field.name
    const value = formData[field.name] || ''

    const baseInputClasses = `
      w-full min-h-[44px] px-4 py-3 pl-12 pr-4
      bg-background border-2 rounded-lg
      text-foreground placeholder-muted-foreground
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-primary/20
      ${hasError 
        ? 'border-red-500 focus:border-red-500' 
        : isFocused 
          ? 'border-primary focus:border-primary' 
          : 'border-border focus:border-primary'
      }
      ${field.disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `

    switch (field.type) {
      case 'select':
        return (
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
              <IconComponent className="w-5 h-5 text-muted-foreground" />
            </div>
            <select
              name={field.name}
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              onBlur={() => handleInputBlur(field)}
              onFocus={() => handleInputFocus(field)}
              className={`${baseInputClasses} appearance-none cursor-pointer`}
              disabled={field.disabled}
              required={field.required}
              aria-describedby={hasError ? `${field.name}-error` : undefined}
            >
              {field.placeholder && (
                <option value="" disabled>
                  {field.placeholder}
                </option>
              )}
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        )

      case 'textarea':
        return (
          <div className="relative">
            <div className="absolute left-3 top-4 z-10">
              <IconComponent className="w-5 h-5 text-muted-foreground" />
            </div>
            <textarea
              name={field.name}
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              onBlur={() => handleInputBlur(field)}
              onFocus={() => handleInputFocus(field)}
              placeholder={field.placeholder}
              className={`${baseInputClasses} min-h-[120px] resize-y pt-4`}
              disabled={field.disabled}
              required={field.required}
              rows={field.rows || 4}
              maxLength={field.maxLength}
              aria-describedby={hasError ? `${field.name}-error` : undefined}
            />
            {field.maxLength && (
              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                {value.length}/{field.maxLength}
              </div>
            )}
          </div>
        )

      case 'checkbox':
        return (
          <label className="flex items-start space-x-3 cursor-pointer min-h-[44px] py-2">
            <div className="relative flex-shrink-0 mt-1">
              <input
                type="checkbox"
                name={field.name}
                checked={value === true}
                onChange={(e) => handleInputChange(field, e.target.checked)}
                onBlur={() => handleInputBlur(field)}
                onFocus={() => handleInputFocus(field)}
                className="sr-only"
                disabled={field.disabled}
                required={field.required}
                aria-describedby={hasError ? `${field.name}-error` : undefined}
              />
              <div className={`
                w-5 h-5 border-2 rounded flex items-center justify-center
                transition-all duration-200
                ${value 
                  ? 'bg-primary border-primary' 
                  : hasError 
                    ? 'border-red-500' 
                    : 'border-border'
                }
                ${field.disabled ? 'opacity-50' : ''}
              `}>
                {value && <Check className="w-3 h-3 text-primary-foreground" />}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium">{field.label}</span>
              {field.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {field.description}
                </p>
              )}
            </div>
          </label>
        )

      case 'radio':
        return (
          <div className="space-y-3">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer min-h-[44px] py-2">
                <div className="relative flex-shrink-0">
                  <input
                    type="radio"
                    name={field.name}
                    value={option.value}
                    checked={value === option.value}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    onBlur={() => handleInputBlur(field)}
                    onFocus={() => handleInputFocus(field)}
                    className="sr-only"
                    disabled={field.disabled}
                    required={field.required}
                  />
                  <div className={`
                    w-5 h-5 border-2 rounded-full flex items-center justify-center
                    transition-all duration-200
                    ${value === option.value 
                      ? 'border-primary' 
                      : hasError 
                        ? 'border-red-500' 
                        : 'border-border'
                    }
                    ${field.disabled ? 'opacity-50' : ''}
                  `}>
                    {value === option.value && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium">{option.label}</span>
                  {option.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  )}
                </div>
              </label>
            ))}
          </div>
        )

      case 'password':
        return (
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
              <IconComponent className="w-5 h-5 text-muted-foreground" />
            </div>
            <input
              type={showPasswords[field.name] ? 'text' : 'password'}
              name={field.name}
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              onBlur={() => handleInputBlur(field)}
              onFocus={() => handleInputFocus(field)}
              placeholder={field.placeholder}
              className={`${baseInputClasses} pr-12`}
              disabled={field.disabled}
              required={field.required}
              minLength={field.minLength}
              maxLength={field.maxLength}
              autoComplete={field.autoComplete || 'current-password'}
              aria-describedby={hasError ? `${field.name}-error` : undefined}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility(field.name)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded"
              aria-label={showPasswords[field.name] ? 'Hide password' : 'Show password'}
            >
              {showPasswords[field.name] ? (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Eye className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>
        )

      default:
        return (
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
              <IconComponent className="w-5 h-5 text-muted-foreground" />
            </div>
            <input
              type={field.type || 'text'}
              name={field.name}
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              onBlur={() => handleInputBlur(field)}
              onFocus={() => handleInputFocus(field)}
              placeholder={field.placeholder}
              className={baseInputClasses}
              disabled={field.disabled}
              required={field.required}
              minLength={field.minLength}
              maxLength={field.maxLength}
              min={field.min}
              max={field.max}
              step={field.step}
              pattern={field.pattern}
              autoComplete={field.autoComplete}
              aria-describedby={hasError ? `${field.name}-error` : undefined}
            />
          </div>
        )
    }
  }

  return (
    <Card className="card-industrial">
      <form ref={formRef} onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
        {/* Header */}
        {(title || description || showProgress) && (
          <div className="space-y-4">
            {title && (
              <h2 className="text-2xl font-bold text-center">{title}</h2>
            )}
            
            {description && (
              <p className="text-muted-foreground text-center leading-relaxed">
                {description}
              </p>
            )}
            
            {showProgress && totalSteps > 1 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Step {currentStep} of {totalSteps}</span>
                  <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Fields */}
        <div className="space-y-6">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              {/* Label */}
              {field.type !== 'checkbox' && field.type !== 'radio' && (
                <label 
                  htmlFor={field.name}
                  className="block text-sm font-medium"
                >
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1" aria-label="required">*</span>
                  )}
                  {field.tooltip && (
                    <button
                      type="button"
                      className="ml-2 p-1 hover:bg-muted rounded"
                      title={field.tooltip}
                      aria-label="More information"
                    >
                      <Info className="w-3 h-3 text-muted-foreground" />
                    </button>
                  )}
                </label>
              )}

              {/* Field */}
              {renderField(field)}

              {/* Error Messages */}
              {errors[field.name] && errors[field.name].length > 0 && (
                <div 
                  id={`${field.name}-error`}
                  className="flex items-start space-x-2 text-red-500 text-sm"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    {errors[field.name].map((error, index) => (
                      <div key={index}>{error}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Help Text */}
              {field.helpText && !errors[field.name] && (
                <p className="text-xs text-muted-foreground">
                  {field.helpText}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full btn-primary min-h-[50px]"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            submitText
          )}
        </Button>
      </form>
    </Card>
  )
}

export default MobileForm

