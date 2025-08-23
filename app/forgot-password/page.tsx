'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/contexts/auth-context';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await resetPassword(email);

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4">
        <div className="w-full max-w-md">
          <Card className="bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.12)]">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-[#ECFEFF]">
                Check Your Email
              </CardTitle>
              <CardDescription className="text-[#ECFEFF]/70">
                We've sent you a password reset link. Please check your email and follow the instructions.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="text-center">
              <p className="text-[#ECFEFF]/60 mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  variant="outline"
                  className="w-full border-[rgba(255,255,255,0.12)] text-[#ECFEFF] hover:bg-[rgba(255,255,255,0.06)]"
                >
                  Try Again
                </Button>
                
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="w-full text-[#C7A869] hover:text-[#B5965C] hover:bg-[#C7A869]/10"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4">
      <div className="w-full max-w-md">
        <Card className="bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.12)]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-[#ECFEFF]">
              Reset Password
            </CardTitle>
            <CardDescription className="text-[#ECFEFF]/70">
              Enter your email address and we'll send you a link to reset your password.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-red-500/20 bg-red-500/10">
                  <AlertDescription className="text-red-400">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#ECFEFF]">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ECFEFF]/50 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.12)] text-[#ECFEFF] placeholder:text-[#ECFEFF]/50"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#C7A869] text-[#0E0E0E] hover:bg-[#B5965C] border border-[#A98652] font-medium"
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
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-[#C7A869] hover:text-[#B5965C] text-sm"
              >
                <ArrowLeft className="w-4 h-4 inline mr-2" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
