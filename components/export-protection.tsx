'use client';

import { ReactNode, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useEntitlements } from '@/hooks/use-entitlements';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Crown, Zap, AlertCircle, Shield, Eye, XCircle, CheckCircle } from 'lucide-react';
import { detectPII, isContentSafeForExport, redactPII, PII_SEVERITY, PIIDetectionResult } from '@/lib/pii-detector';

interface ExportProtectionProps {
  children: ReactNode;
  format: 'md' | 'pdf' | 'json' | 'zip';
  orgId?: string;
  fallback?: ReactNode;
  content?: string; // Content to scan for PII
  onPIIBlock?: (result: any) => void; // Callback when PII blocks export
}

export function ExportProtection({ 
  children, 
  format, 
  orgId, 
  fallback,
  content,
  onPIIBlock
}: ExportProtectionProps) {
  const { user } = useAuth();
  const { entitlements, hasEntitlement } = useEntitlements(orgId);
  const [piiScanResult, setPiiScanResult] = useState<ReturnType<typeof isContentSafeForExport> | null>(null);
  const [showPIIDetails, setShowPIIDetails] = useState(false);

  // Check if user can export this format
  const canExport = () => {
    if (!user) return false;
    
    switch (format) {
      case 'md':
        return true; // Always available
      case 'pdf':
      case 'json':
        return hasEntitlement('canExportPDF');
      case 'zip':
        return hasEntitlement('canExportBundleZip');
      default:
        return false;
    }
  };

  // Scan content for PII if provided
  const scanForPII = () => {
    if (!content) return null;
    
    const safetyCheck = isContentSafeForExport(content);
    setPiiScanResult(safetyCheck);
    
    if (!safetyCheck.canProceed && onPIIBlock) {
      onPIIBlock(safetyCheck);
    }
    
    return safetyCheck;
  };

  // Get required plan for this format
  const getRequiredPlan = () => {
    switch (format) {
      case 'pdf':
      case 'json':
        return 'pro';
      case 'zip':
        return 'enterprise';
      default:
        return null;
    }
  };

  // Get format display name
  const getFormatName = () => {
    switch (format) {
      case 'md':
        return 'Markdown';
      case 'pdf':
        return 'PDF';
      case 'json':
        return 'JSON';
      case 'zip':
        return 'ZIP Bundle';
      default:
        return (format as string).toUpperCase();
    }
  };

  // Check if export is blocked by PII
  const isPIIBlocked = piiScanResult && !piiScanResult.canProceed;

  if (canExport() && !isPIIBlocked) {
    return <>{children}</>;
  }

  // Show fallback if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Show PII warning/block
  if (isPIIBlocked) {
    return (
      <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-900 dark:text-red-100">
              Export Blocked - Sensitive Information Detected
            </CardTitle>
          </div>
          <CardDescription className="text-red-700 dark:text-red-300">
            Your content contains sensitive information that must be removed before export.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* PII Summary */}
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Risk Level:</strong> {piiScanResult.result.severity?.toString().toUpperCase() || 'UNKNOWN'} 
              ({piiScanResult.result.count} items found)
            </AlertDescription>
          </Alert>

          {/* PII Details Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPIIDetails(!showPIIDetails)}
            className="text-red-700 border-red-300 hover:bg-red-100"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPIIDetails ? 'Hide' : 'Show'} PII Details
          </Button>

          {/* PII Details */}
          {showPIIDetails && (
            <div className="space-y-3 p-4 bg-red-100 dark:bg-red-950/30 rounded-lg">
              <h4 className="font-semibold text-red-900 dark:text-red-100">Detected Items:</h4>
              {piiScanResult.result.items.map((item: any, index: number) => (
                <div key={index} className="text-sm text-red-800 dark:text-red-200">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        item.severity === PII_SEVERITY.CRITICAL ? 'bg-red-100 text-red-800 border-red-300' :
                        item.severity === PII_SEVERITY.HIGH ? 'bg-orange-100 text-orange-800 border-orange-300' :
                        'bg-yellow-100 text-yellow-800 border-yellow-300'
                      }`}
                    >
                      {item.severity.toUpperCase()}
                    </Badge>
                    <span className="font-medium">{item.type}:</span>
                    <span className="font-mono bg-red-200 dark:bg-red-900/50 px-2 py-1 rounded">
                      {item.value}
                    </span>
                  </div>
                  <div className="ml-6 text-xs text-red-700 dark:text-red-300">
                    Context: {item.context}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recommendations */}
          <div className="space-y-2">
            <h4 className="font-semibold text-red-900 dark:text-red-100">Required Actions:</h4>
            <ul className="space-y-1 text-sm text-red-800 dark:text-red-200">
              {piiScanResult.result.recommendations.map((rec: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => window.open('/legal/privacy', '_blank')}
            >
              Privacy Policy
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-red-300 text-red-700 hover:bg-red-100"
              onClick={() => setPiiScanResult(null)}
            >
              Rescan Content
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show upgrade prompt for format restrictions
  const requiredPlan = getRequiredPlan();
  
  return (
    <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-orange-600" />
          <CardTitle className="text-orange-900 dark:text-orange-100">
            {getFormatName()} Export Requires {requiredPlan === 'enterprise' ? 'Enterprise' : 'Pro'} Plan
          </CardTitle>
        </div>
        <CardDescription className="text-orange-700 dark:text-orange-300">
          Upgrade your plan to unlock {getFormatName().toLowerCase()} exports and more advanced features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Current Plan Status */}
          <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-orange-950/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-orange-700 border-orange-300">
                Current: {user?.plan || 'pilot'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-orange-600 text-white">
                Required: {requiredPlan}
              </Badge>
            </div>
          </div>

          {/* Feature Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Lock className="h-4 w-4 text-orange-600" />
              <span className="text-orange-800 dark:text-orange-200">
                {getFormatName()} Export
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Crown className="h-4 w-4 text-orange-600" />
              <span className="text-orange-800 dark:text-orange-200">
                Advanced Features
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={() => window.open('/pricing', '_blank')}
            >
              View Plans
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-orange-300 text-orange-700 hover:bg-orange-100"
              onClick={() => window.open('/contact', '_blank')}
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Higher-order component for protecting export functionality
export function withExportProtection<P extends object>(
  Component: React.ComponentType<P>,
  format: 'md' | 'pdf' | 'json' | 'zip',
  orgId?: string
) {
  return function ProtectedExportComponent(props: P) {
    return (
      <ExportProtection format={format} orgId={orgId}>
        <Component {...props} />
      </ExportProtection>
    );
  };
}

// Enhanced export protection with PII scanning
export function withPIIProtection<P extends object>(
  Component: React.ComponentType<P & { content?: string }>,
  format: 'md' | 'pdf' | 'json' | 'zip',
  orgId?: string
) {
  return function PIIProtectedExportComponent(props: P & { content?: string }) {
    return (
      <ExportProtection 
        format={format} 
        orgId={orgId}
        content={props.content}
        onPIIBlock={(result) => {
          console.warn('Export blocked due to PII detection:', result);
        }}
      >
        <Component {...props} />
      </ExportProtection>
    );
  };
}
