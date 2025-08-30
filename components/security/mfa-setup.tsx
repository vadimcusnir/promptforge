"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Copy, 
  Download,
  Eye,
  EyeOff,
  QrCode
} from 'lucide-react'

interface MFASetupProps {
  onComplete?: () => void
}

export function MFASetup({ onComplete }: MFASetupProps) {
  const [step, setStep] = useState<'init' | 'verify' | 'backup' | 'complete'>('init')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // MFA setup data
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [secret, setSecret] = useState<string>('')
  const [verificationCode, setVerificationCode] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [showBackupCodes, setShowBackupCodes] = useState(false)

  const initializeMFA = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/auth/mfa/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: 'user@example.com' }) // You might want to get this from user context
      })

      if (!response.ok) {
        throw new Error('Failed to initialize MFA')
      }

      const data = await response.json()
      setQrCodeUrl(data.qrCodeUrl)
      setSecret(data.secret)
      setStep('verify')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize MFA')
    } finally {
      setLoading(false)
    }
  }

  const verifyMFA = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          token: verificationCode,
          enable: true
        })
      })

      if (!response.ok) {
        throw new Error('Invalid verification code')
      }

      const data = await response.json()
      setBackupCodes(data.backupCodes || [])
      setStep('backup')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify MFA')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccess('Copied to clipboard!')
    setTimeout(() => setSuccess(null), 2000)
  }

  const downloadBackupCodes = () => {
    const content = backupCodes.join('\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'promptforge-backup-codes.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const completeSetup = () => {
    setStep('complete')
    onComplete?.()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
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

      {step === 'init' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Enable Multi-Factor Authentication
            </CardTitle>
            <CardDescription>
              Add an extra layer of security to your account using an authenticator app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">What you'll need:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• An authenticator app (Google Authenticator, Authy, 1Password, etc.)</li>
                <li>• Your mobile device</li>
                <li>• A few minutes to complete setup</li>
              </ul>
            </div>

            <Button onClick={initializeMFA} disabled={loading} className="w-full">
              {loading ? 'Initializing...' : 'Start MFA Setup'}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'verify' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Scan QR Code
            </CardTitle>
            <CardDescription>
              Scan the QR code with your authenticator app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              {qrCodeUrl && (
                <div className="inline-block p-4 bg-white rounded-lg border">
                  <img src={qrCodeUrl} alt="MFA QR Code" className="w-48 h-48" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="secret">Or enter this code manually:</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="secret"
                  value={secret}
                  readOnly
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(secret)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verification">Enter verification code:</Label>
              <Input
                id="verification"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                className="text-center text-lg font-mono"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('init')}>
                Back
              </Button>
              <Button 
                onClick={verifyMFA} 
                disabled={loading || verificationCode.length !== 6}
                className="flex-1"
              >
                {loading ? 'Verifying...' : 'Verify & Enable'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'backup' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Backup Codes
            </CardTitle>
            <CardDescription>
              Save these backup codes in a safe place. You can use them to access your account if you lose your authenticator device.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                <strong>Important:</strong> These codes can only be used once. Store them securely and don't share them with anyone.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Your backup codes:</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBackupCodes(!showBackupCodes)}
                  >
                    {showBackupCodes ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadBackupCodes}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 p-4 bg-muted rounded-lg">
                {backupCodes.map((code, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-mono text-sm">
                      {showBackupCodes ? code : '••••••••'}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {index + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={completeSetup} className="w-full">
              Complete Setup
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'complete' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              MFA Setup Complete!
            </CardTitle>
            <CardDescription>
              Your account is now protected with multi-factor authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-medium">Multi-factor authentication is now enabled</p>
              <p className="text-sm text-muted-foreground">
                You'll be asked for a verification code when logging in from new devices
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">What's next?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Save your backup codes in a secure location</li>
                <li>• Test your authenticator app with a login</li>
                <li>• Consider enabling additional security features</li>
              </ul>
            </div>

            <Button onClick={onComplete} className="w-full">
              Done
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
