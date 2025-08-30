'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link';
import { H1, H2 } from '@/components/ui/heading';
import { Main, Section } from '@/components/ui/section';
import { SkipLink } from '@/components/ui/skip-link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Lock, Mail, User, Eye, EyeOff, Shield, CheckCircle } from 'lucide-react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    acceptTerms: false,
    acceptMarketing: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const router = useRouter();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null); // Clear errors when user types
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.fullName) {
      setError('Please fill in all required fields');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!formData.acceptTerms) {
      setError('You must accept the terms and conditions');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Create Supabase client for signup
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          acceptMarketing: formData.acceptMarketing
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Account created successfully! Please check your email to verify your account.');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login?message=verification_required');
        }, 3000);
      } else {
        setError(data.error || 'Failed to create account. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Skip Links */}
      <div className="sr-only">
        <SkipLink href="#main-content">Skip to main content</SkipLink>
        <SkipLink href="#signup-form">Skip to signup form</SkipLink>
      </div>

      <Main id="main-content" className="w-full max-w-md">
        {/* Logo/Brand */}
        <Section variant="default" spacing="lg" className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" aria-hidden="true" />
          </div>
          <H1 variant="accent" spacing="sm">Join PromptForge</H1>
          <p className="text-fg-secondary">Create your account and start building amazing prompts</p>
        </Section>

        {/* Signup Form */}
        <Card variant="default" size="md" className="text-center">
          <CardHeader>
            <H2 spacing="sm">Create Account</H2>
            <CardDescription>
              Fill in your details to get started
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form 
              id="signup-form"
              onSubmit={handleSubmit} 
              className="space-y-6"
              aria-label="Create new account"
              noValidate
            >
              {/* Full Name Field */}
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Full Name *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-fg-tertiary" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="pl-10 bg-bg-glass border-border-glass text-fg-primary placeholder:text-fg-tertiary focus:bg-bg-glass-hover focus:border-accent-primary"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-fg-tertiary" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10 bg-bg-glass border-border-glass text-fg-primary placeholder:text-fg-tertiary focus:bg-bg-glass-hover focus:border-accent-primary"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-fg-tertiary" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10 bg-bg-glass border-border-glass text-fg-primary placeholder:text-fg-tertiary focus:bg-bg-glass-hover focus:border-accent-primary"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-fg-tertiary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-fg-tertiary">Must be at least 8 characters long</p>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-fg-tertiary" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pl-10 pr-10 bg-bg-glass border-border-glass text-fg-primary placeholder:text-fg-tertiary focus:bg-bg-glass-hover focus:border-accent-primary"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-fg-tertiary"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Terms and Marketing */}
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => handleInputChange('acceptTerms', checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="acceptTerms" className="text-sm text-fg-secondary leading-relaxed">
                    I agree to the{' '}
                    <Link href="/legal/terms" variant="default" underline>
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/legal/privacy" variant="default" underline>
                      Privacy Policy
                    </Link> *
                  </Label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acceptMarketing"
                    checked={formData.acceptMarketing}
                    onCheckedChange={(checked) => handleInputChange('acceptMarketing', checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="acceptMarketing" className="text-sm text-fg-secondary leading-relaxed">
                    I would like to receive updates about new features and promotions
                  </Label>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <Alert 
                  variant="destructive" 
                  className="bg-state-error/20 border-state-error/30"
                  id="error-message"
                  role="alert"
                  aria-live="assertive"
                >
                  <AlertDescription className="text-state-error">{error}</AlertDescription>
                </Alert>
              )}

              {/* Success Display */}
              {success && (
                <Alert 
                  className="bg-state-success/20 border-state-success/30"
                  id="success-message"
                  role="status"
                  aria-live="polite"
                >
                  <CheckCircle className="h-4 w-4 text-state-success" aria-hidden="true" />
                  <AlertDescription className="text-state-success">{success}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={isLoading}
                icon={!isLoading ? <Shield className="h-4 w-4" /> : undefined}
                ariaLabel="Create new account"
                ariaDescribedBy={error ? "error-message" : success ? "success-message" : undefined}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>

              {/* Additional Links */}
              <div className="text-center">
                <p className="text-fg-tertiary text-sm">
                  Already have an account?{' '}
                  <Link href="/login" variant="default" className="font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <Section variant="default" spacing="lg" className="text-center">
          <p className="text-fg-tertiary text-sm">
            © 2024 PromptForge. All rights reserved.
          </p>
        </Section>
      </Main>
    </div>
  );
}
