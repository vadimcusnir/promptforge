import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import MobileForm from '../components/MobileForm'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, 
  ArrowLeft, 
  Github, 
  Chrome,
  Shield,
  CheckCircle,
  Star,
  Users,
  Clock
} from 'lucide-react'

const AuthPage = () => {
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState(searchParams.get('mode') || 'login')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const { signIn, signUp, signInWithProvider, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const loginFields = [
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email',
      required: true,
      autoComplete: 'email'
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password',
      placeholder: 'Enter your password',
      required: true,
      autoComplete: 'current-password'
    }
  ]

  const signupFields = [
    {
      name: 'fullName',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true,
      autoComplete: 'name'
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email',
      required: true,
      autoComplete: 'email'
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password',
      placeholder: 'Create a strong password',
      required: true,
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      autoComplete: 'new-password',
      helpText: 'Must be at least 8 characters with uppercase, lowercase, and numbers'
    },
    {
      name: 'confirmPassword',
      type: 'password',
      label: 'Confirm Password',
      placeholder: 'Confirm your password',
      required: true,
      autoComplete: 'new-password',
      validate: (value, formData) => {
        if (value !== formData.password) {
          return 'Passwords do not match'
        }
        return null
      }
    },
    {
      name: 'acceptTerms',
      type: 'checkbox',
      label: 'I agree to the Terms of Service and Privacy Policy',
      required: true,
      description: 'By creating an account, you agree to our terms and conditions.'
    }
  ]

  const handleSubmit = async (formData) => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      if (mode === 'login') {
        await signIn(formData.email, formData.password)
        navigate('/dashboard')
      } else {
        await signUp(formData.email, formData.password, {
          full_name: formData.fullName
        })
        setSuccess('Account created successfully! Please check your email to verify your account.')
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleProviderSignIn = async (provider) => {
    setIsLoading(true)
    setError('')

    try {
      await signInWithProvider(provider)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const benefits = [
    {
      icon: Zap,
      title: 'Instant Access',
      description: '50+ modules ready to use'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Enterprise-grade security'
    },
    {
      icon: Clock,
      title: 'Save Time',
      description: 'Generate prompts in <60s'
    },
    {
      icon: Users,
      title: 'Join Community',
      description: '1000+ active users'
    }
  ]

  const testimonials = [
    {
      text: "PromptForge transformed our workflow. We're 10x faster now.",
      author: "Sarah Chen",
      role: "Product Manager"
    },
    {
      text: "The quality and consistency is unmatched. Highly recommended.",
      author: "Mike Rodriguez",
      role: "Consultant"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <main id="main-content" className="container-safe">
        <div className="section-padding">
          {/* Back Button */}
          <div className="mb-8">
            <Link 
              to="/"
              className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Column - Form */}
              <div className="space-y-8">
                {/* Header */}
                <div className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <span className="text-2xl font-bold text-gradient-primary">PromptForge</span>
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                    {mode === 'login' ? 'Welcome back' : 'Start forging prompts'}
                  </h1>
                  
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {mode === 'login' 
                      ? 'Sign in to your account to continue building industrial-grade prompts.'
                      : 'Join thousands of professionals using PromptForge to create better AI workflows.'
                    }
                  </p>
                </div>

                {/* Mode Toggle */}
                <div className="flex bg-muted rounded-lg p-1">
                  <button
                    onClick={() => setMode('login')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      mode === 'login'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setMode('signup')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      mode === 'signup'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Social Sign In */}
                <div className="space-y-3">
                  <Button
                    onClick={() => handleProviderSignIn('google')}
                    variant="outline"
                    className="w-full min-h-[50px] justify-start"
                    disabled={isLoading}
                  >
                    <Chrome className="w-5 h-5 mr-3" />
                    Continue with Google
                  </Button>
                  
                  <Button
                    onClick={() => handleProviderSignIn('github')}
                    variant="outline"
                    className="w-full min-h-[50px] justify-start"
                    disabled={isLoading}
                  >
                    <Github className="w-5 h-5 mr-3" />
                    Continue with GitHub
                  </Button>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-background text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <Card className="p-4 border-red-500/20 bg-red-500/10">
                    <p className="text-red-500 text-sm">{error}</p>
                  </Card>
                )}

                {success && (
                  <Card className="p-4 border-green-500/20 bg-green-500/10">
                    <p className="text-green-500 text-sm">{success}</p>
                  </Card>
                )}

                {/* Form */}
                <MobileForm
                  fields={mode === 'login' ? loginFields : signupFields}
                  onSubmit={handleSubmit}
                  submitText={mode === 'login' ? 'Sign In' : 'Create Account'}
                  isLoading={isLoading}
                />

                {/* Footer Links */}
                <div className="text-center space-y-4">
                  {mode === 'login' ? (
                    <div className="space-y-2">
                      <Link 
                        to="/forgot-password"
                        className="text-sm text-primary hover:text-primary/80"
                      >
                        Forgot your password?
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <button
                          onClick={() => setMode('signup')}
                          className="text-primary hover:text-primary/80 font-medium"
                        >
                          Sign up
                        </button>
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Already have an account?{' '}
                      <button
                        onClick={() => setMode('login')}
                        className="text-primary hover:text-primary/80 font-medium"
                      >
                        Sign in
                      </button>
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column - Benefits & Social Proof */}
              <div className="space-y-8 lg:sticky lg:top-24">
                {/* Benefits */}
                <Card className="card-industrial">
                  <h3 className="text-xl font-bold mb-6">Why PromptForge?</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {benefits.map((benefit, index) => {
                      const IconComponent = benefit.icon
                      return (
                        <div key={index} className="text-center">
                          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <IconComponent className="w-6 h-6 text-primary" />
                          </div>
                          <h4 className="font-semibold text-sm mb-1">{benefit.title}</h4>
                          <p className="text-xs text-muted-foreground">{benefit.description}</p>
                        </div>
                      )
                    })}
                  </div>
                </Card>

                {/* Testimonials */}
                <Card className="card-industrial">
                  <h3 className="text-xl font-bold mb-6">Trusted by Professionals</h3>
                  <div className="space-y-4">
                    {testimonials.map((testimonial, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                          ))}
                        </div>
                        <blockquote className="text-sm text-muted-foreground leading-relaxed">
                          "{testimonial.text}"
                        </blockquote>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="text-primary font-bold text-xs">
                              {testimonial.author.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-xs">{testimonial.author}</div>
                            <div className="text-muted-foreground text-xs">{testimonial.role}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Security Badge */}
                <Card className="card-industrial text-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-green-500" />
                  </div>
                  <h4 className="font-semibold mb-2">Enterprise Security</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your data is protected with industry-standard encryption and security measures.
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Badge variant="outline" className="text-xs">SOC 2</Badge>
                    <Badge variant="outline" className="text-xs">GDPR</Badge>
                    <Badge variant="outline" className="text-xs">ISO 27001</Badge>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AuthPage

