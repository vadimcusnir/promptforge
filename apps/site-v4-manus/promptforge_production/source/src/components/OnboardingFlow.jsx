import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  User,
  Target,
  Zap,
  Download,
  Play,
  BookOpen,
  Rocket,
  Star,
  Settings,
  Lightbulb,
  Trophy,
  Users,
  BarChart3,
  Shield,
  Clock,
  Globe
} from 'lucide-react'

const OnboardingFlow = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [userProfile, setUserProfile] = useState({
    role: '',
    experience: '',
    goals: [],
    industry: '',
    teamSize: ''
  })

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to PromptForge™ v3.0',
      subtitle: 'Your industrial prompt engineering platform',
      icon: <Rocket className="w-12 h-12 text-green-400" />,
      content: 'WelcomeStep'
    },
    {
      id: 'profile',
      title: 'Tell us about yourself',
      subtitle: 'Help us personalize your experience',
      icon: <User className="w-12 h-12 text-blue-400" />,
      content: 'ProfileStep'
    },
    {
      id: 'goals',
      title: 'What are your goals?',
      subtitle: 'Select what you want to achieve',
      icon: <Target className="w-12 h-12 text-purple-400" />,
      content: 'GoalsStep'
    },
    {
      id: 'framework',
      title: 'Learn the 7D Framework',
      subtitle: 'Master our industrial prompt system',
      icon: <Zap className="w-12 h-12 text-yellow-400" />,
      content: 'FrameworkStep'
    },
    {
      id: 'first-prompt',
      title: 'Create your first prompt',
      subtitle: 'Generate a professional prompt in minutes',
      icon: <Play className="w-12 h-12 text-green-400" />,
      content: 'FirstPromptStep'
    },
    {
      id: 'complete',
      title: 'You\'re all set!',
      subtitle: 'Start building industrial-grade prompts',
      icon: <Trophy className="w-12 h-12 text-gold-400" />,
      content: 'CompleteStep'
    }
  ]

  const roles = [
    { id: 'marketer', name: 'Marketing Professional', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'consultant', name: 'Consultant', icon: <Users className="w-5 h-5" /> },
    { id: 'educator', name: 'Educator/Trainer', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'founder', name: 'Founder/Entrepreneur', icon: <Rocket className="w-5 h-5" /> },
    { id: 'developer', name: 'Developer', icon: <Settings className="w-5 h-5" /> },
    { id: 'other', name: 'Other', icon: <Globe className="w-5 h-5" /> }
  ]

  const experiences = [
    { id: 'beginner', name: 'New to AI prompts', description: 'Just getting started' },
    { id: 'intermediate', name: 'Some experience', description: 'Used ChatGPT and similar tools' },
    { id: 'advanced', name: 'Experienced', description: 'Built prompt systems before' },
    { id: 'expert', name: 'Expert level', description: 'Professional prompt engineer' }
  ]

  const goals = [
    { id: 'sales', name: 'Increase Sales', icon: <Target className="w-5 h-5" /> },
    { id: 'content', name: 'Create Better Content', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'automation', name: 'Automate Workflows', icon: <Zap className="w-5 h-5" /> },
    { id: 'education', name: 'Improve Training', icon: <Users className="w-5 h-5" /> },
    { id: 'analysis', name: 'Data Analysis', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'branding', name: 'Build Authority', icon: <Star className="w-5 h-5" /> }
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(userProfile)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateProfile = (field, value) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const toggleGoal = (goalId) => {
    setUserProfile(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId) 
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }))
  }

  const WelcomeStep = () => (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-white">Welcome to PromptForge™ v3.0</h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          The world's first industrial prompt engineering platform. Build systems, not one-offs.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <div className="text-green-400 mb-3">
            <Zap className="w-8 h-8 mx-auto" />
          </div>
          <h3 className="font-semibold text-white mb-2">50+ Modules</h3>
          <p className="text-gray-400 text-sm">Industrial-grade prompt modules for every use case</p>
        </div>
        
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <div className="text-blue-400 mb-3">
            <Shield className="w-8 h-8 mx-auto" />
          </div>
          <h3 className="font-semibold text-white mb-2">7D Framework</h3>
          <p className="text-gray-400 text-sm">Systematic approach to prompt engineering</p>
        </div>
        
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <div className="text-purple-400 mb-3">
            <Clock className="w-8 h-8 mx-auto" />
          </div>
          <h3 className="font-semibold text-white mb-2">60s Export</h3>
          <p className="text-gray-400 text-sm">Generate and export prompts in under 60 seconds</p>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 border border-green-500/30">
        <p className="text-green-300 font-medium">
          🚀 This quick setup will personalize your experience and get you creating professional prompts in minutes.
        </p>
      </div>
    </div>
  )

  const ProfileStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Tell us about yourself</h2>
        <p className="text-gray-400">Help us customize your PromptForge experience</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">What's your role?</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => updateProfile('role', role.id)}
                className={`p-4 rounded-xl border transition-all ${
                  userProfile.role === role.id
                    ? 'border-green-500 bg-green-500/20 text-green-300'
                    : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  {role.icon}
                  <span className="text-sm font-medium">{role.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">Experience with AI prompts?</label>
          <div className="space-y-3">
            {experiences.map((exp) => (
              <button
                key={exp.id}
                onClick={() => updateProfile('experience', exp.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  userProfile.experience === exp.id
                    ? 'border-green-500 bg-green-500/20'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className={`font-medium ${userProfile.experience === exp.id ? 'text-green-300' : 'text-white'}`}>
                      {exp.name}
                    </div>
                    <div className="text-sm text-gray-400">{exp.description}</div>
                  </div>
                  {userProfile.experience === exp.id && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">Industry (optional)</label>
          <Input
            placeholder="e.g., SaaS, Consulting, Education..."
            value={userProfile.industry}
            onChange={(e) => updateProfile('industry', e.target.value)}
            className="bg-gray-800/50 border-gray-700 text-white"
          />
        </div>
      </div>
    </div>
  )

  const GoalsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">What are your goals?</h2>
        <p className="text-gray-400">Select all that apply - we'll recommend the best modules for you</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => toggleGoal(goal.id)}
            className={`p-6 rounded-xl border transition-all ${
              userProfile.goals.includes(goal.id)
                ? 'border-green-500 bg-green-500/20 text-green-300'
                : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${
                userProfile.goals.includes(goal.id) ? 'bg-green-500/30' : 'bg-gray-700/50'
              }`}>
                {goal.icon}
              </div>
              <div className="text-left">
                <div className="font-medium">{goal.name}</div>
              </div>
              {userProfile.goals.includes(goal.id) && (
                <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
              )}
            </div>
          </button>
        ))}
      </div>
      
      {userProfile.goals.length > 0 && (
        <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-500/30">
          <p className="text-blue-300 text-sm">
            <Lightbulb className="w-4 h-4 inline mr-2" />
            Great! We'll recommend modules that help with: {userProfile.goals.join(', ')}
          </p>
        </div>
      )}
    </div>
  )

  const FrameworkStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">The 7D Framework</h2>
        <p className="text-gray-400">Our systematic approach to industrial prompt engineering</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <h3 className="font-semibold text-green-400 mb-2">1. Domain</h3>
            <p className="text-gray-300 text-sm">Industry or business context</p>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <h3 className="font-semibold text-blue-400 mb-2">2. Scale</h3>
            <p className="text-gray-300 text-sm">Size and scope of operation</p>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <h3 className="font-semibold text-purple-400 mb-2">3. Urgency</h3>
            <p className="text-gray-300 text-sm">Timeline and priority level</p>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <h3 className="font-semibold text-yellow-400 mb-2">4. Complexity</h3>
            <p className="text-gray-300 text-sm">Technical depth required</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <h3 className="font-semibold text-red-400 mb-2">5. Resources</h3>
            <p className="text-gray-300 text-sm">Available tools and budget</p>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <h3 className="font-semibold text-indigo-400 mb-2">6. Application</h3>
            <p className="text-gray-300 text-sm">How the output will be used</p>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <h3 className="font-semibold text-pink-400 mb-2">7. Output</h3>
            <p className="text-gray-300 text-sm">Desired format and structure</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-green-500/20 to-purple-500/20 rounded-xl p-6 border border-green-500/30">
        <h3 className="font-semibold text-white mb-2">Why 7D Works</h3>
        <p className="text-gray-300 text-sm">
          By systematically defining these 7 dimensions, you create prompts that are precise, 
          contextual, and consistently deliver professional results. No more guesswork.
        </p>
      </div>
    </div>
  )

  const FirstPromptStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Create your first prompt</h2>
        <p className="text-gray-400">Let's generate a professional prompt using the 7D framework</p>
      </div>
      
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="font-semibold text-white mb-4">Recommended Module: Strategic Framework Generator</h3>
        <p className="text-gray-400 mb-4">
          Based on your profile, this module will help you create strategic frameworks for your business planning.
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-black/30 rounded-lg p-3">
            <div className="text-gray-400 text-sm">Difficulty</div>
            <div className="text-white font-semibold">Intermediate</div>
          </div>
          <div className="bg-black/30 rounded-lg p-3">
            <div className="text-gray-400 text-sm">Time to Generate</div>
            <div className="text-white font-semibold">~45 seconds</div>
          </div>
        </div>
        
        <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
          <Play className="w-4 h-4 mr-2" />
          Generate Your First Prompt
        </Button>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-semibold text-white">What happens next:</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
              <span className="text-green-400 font-semibold text-sm">1</span>
            </div>
            <span className="text-gray-300">Configure 7D parameters for your use case</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-blue-400 font-semibold text-sm">2</span>
            </div>
            <span className="text-gray-300">AI generates your professional prompt</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
              <span className="text-purple-400 font-semibold text-sm">3</span>
            </div>
            <span className="text-gray-300">Export in multiple formats (.txt, .md, .json, .pdf)</span>
          </div>
        </div>
      </div>
    </div>
  )

  const CompleteStep = () => (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">You're all set!</h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Welcome to PromptForge™ v3.0. You're now ready to build industrial-grade prompt systems.
        </p>
      </div>
      
      <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 border border-green-500/30">
        <h3 className="font-semibold text-white mb-3">Your Personalized Recommendations:</h3>
        <div className="space-y-2 text-left">
          {userProfile.goals.includes('sales') && (
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">Sales Accelerator Pack - Perfect for conversion optimization</span>
            </div>
          )}
          {userProfile.goals.includes('content') && (
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">Creator Commerce Pack - Ideal for content monetization</span>
            </div>
          )}
          {userProfile.goals.includes('education') && (
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">Edu Ops Pack - Comprehensive educational tools</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
          <Rocket className="w-4 h-4 mr-2" />
          Start Creating
        </Button>
        <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
          <BookOpen className="w-4 h-4 mr-2" />
          Browse Modules
        </Button>
        <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
          <Download className="w-4 h-4 mr-2" />
          View Documentation
        </Button>
      </div>
    </div>
  )

  const renderStepContent = () => {
    const step = steps[currentStep]
    switch (step.content) {
      case 'WelcomeStep': return <WelcomeStep />
      case 'ProfileStep': return <ProfileStep />
      case 'GoalsStep': return <GoalsStep />
      case 'FrameworkStep': return <FrameworkStep />
      case 'FirstPromptStep': return <FirstPromptStep />
      case 'CompleteStep': return <CompleteStep />
      default: return null
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return userProfile.role && userProfile.experience
      case 2: return userProfile.goals.length > 0
      default: return true
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-400">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Icon and Title */}
        <div className="text-center mb-8">
          <div className="mb-4">
            {steps[currentStep].icon}
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {steps[currentStep].title}
          </h1>
          <p className="text-gray-400">
            {steps[currentStep].subtitle}
          </p>
        </div>

        {/* Step Content */}
        <Card className="bg-gray-900/50 border-gray-800 mb-8">
          <div className="p-8">
            {renderStepContent()}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white disabled:opacity-50"
          >
            {currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OnboardingFlow

