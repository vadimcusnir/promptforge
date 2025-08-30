'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Smartphone, 
  Copy, 
  CheckCircle, 
  XCircle,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';

interface MFASetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export default function MFASetupPage() {
  const router = useRouter();
  const [mfaSetup, setMfaSetup] = useState<MFASetup | null>(null);
  const [verificationToken, setVerificationToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [step, setStep] = useState<'setup' | 'verify' | 'complete'>('setup');
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState<string[]>([]);

  useEffect(() => {
    generateMFASetup();
  }, []);

  const generateMFASetup = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/mfa/setup', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setMfaSetup(data.data);
        setStep('verify');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to generate MFA setup');
      }
    } catch (err) {
      setError('Failed to generate MFA setup');
      console.error('MFA setup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAndEnableMFA = async () => {
    if (!verificationToken.trim()) {
      setError('Please enter the verification code');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/mfa/enable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ token: verificationToken })
      });

      if (response.ok) {
        setSuccess('MFA has been enabled successfully!');
        setStep('complete');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to enable MFA');
      }
    } catch (err) {
      setError('Failed to enable MFA');
      console.error('MFA enable error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, code?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (code) {
        setCopiedCodes(prev => [...prev, code]);
        setTimeout(() => {
          setCopiedCodes(prev => prev.filter(c => c !== code));
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const downloadBackupCodes = () => {
    if (!mfaSetup) return;

    const content = `PromptForge MFA Backup Codes\n\nGenerated: ${new Date().toLocaleString()}\n\n${mfaSetup.backupCodes.join('\n')}\n\nKeep these codes safe! Each code can only be used once.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'promptforge-mfa-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading && step === 'setup') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Generating MFA setup...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Enable Multi-Factor Authentication</h1>
          <p className="text-muted-foreground mt-2">
            Add an extra layer of security to your account
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {step === 'verify' && mfaSetup && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Step 1: Scan QR Code
              </CardTitle>
              <CardDescription>
                Use your authenticator app to scan this QR code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-white rounded-lg border">
                  <img 
                    src={mfaSetup.qrCodeUrl} 
                    alt="MFA QR Code" 
                    className="w-48 h-48"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Can't scan? Enter this code manually:
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="px-3 py-1 bg-muted rounded text-sm font-mono">
                      {mfaSetup.secret}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(mfaSetup.secret)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verification-token">Verification Code</Label>
                <Input
                  id="verification-token"
                  type="text"
                  placeholder="Enter 6-digit code from your app"
                  value={verificationToken}
                  onChange={(e) => setVerificationToken(e.target.value)}
                  maxLength={6}
                />
              </div>

              <Button 
                onClick={verifyAndEnableMFA} 
                disabled={isLoading || verificationToken.length !== 6}
                className="w-full"
              >
                {isLoading ? 'Verifying...' : 'Verify & Enable MFA'}
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'complete' && mfaSetup && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                MFA Enabled Successfully!
              </CardTitle>
              <CardDescription>
                Your account is now protected with multi-factor authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Save your backup codes in a safe place. 
                  You'll need them if you lose access to your authenticator app.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Backup Codes</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowBackupCodes(!showBackupCodes)}
                    >
                      {showBackupCodes ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showBackupCodes ? 'Hide' : 'Show'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadBackupCodes}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>

                {showBackupCodes && (
                  <div className="grid grid-cols-2 gap-2">
                    {mfaSetup.backupCodes.map((code, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <code className="flex-1 text-sm font-mono">{code}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(code, code)}
                        >
                          {copiedCodes.includes(code) ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => router.push('/dashboard')}
                  className="flex-1"
                >
                  Go to Dashboard
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/security')}
                >
                  Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
