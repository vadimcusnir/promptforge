'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to send reset email. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Forgot password error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <div className="w-full max-w-md">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-md">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-2xl mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <CardTitle className="text-2xl text-white">Check Your Email</CardTitle>
              <CardDescription className="text-slate-300">
                We've sent a password reset link to your email address
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-slate-400">
                If an account with the email <strong className="text-white">{email}</strong> exists, 
                you will receive a password reset link shortly.
              </p>
              <p className="text-slate-400 text-sm">
                Don't see the email? Check your spam folder or try again.
              </p>
              <div className="space-y-2">
                <Button
                  onClick={() => router.push('/login')}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold py-3"
                >
                  Back to Login
                </Button>
                <Button
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  Try Different Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">PromptForge</h1>
          <p className="text-slate-400">Reset your password</p>
        </div>

        {/* Forgot Password Form */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Forgot Password?</CardTitle>
            <CardDescription className="text-slate-300">
              Enter your email address and we'll send you a reset link
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:bg-white/20 focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <Alert variant="destructive" className="bg-red-500/20 border-red-500/30">
                  <AlertDescription className="text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Reset Link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>

              {/* Back to Login */}
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  className="text-slate-400 hover:text-amber-400 p-0 h-auto"
                  onClick={() => router.push('/login')}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            © 2024 PromptForge. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-amber-500" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <ForgotPasswordForm />
    </Suspense>
  );
}
