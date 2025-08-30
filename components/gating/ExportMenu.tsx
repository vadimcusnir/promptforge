"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, Database, Lock, Crown, Zap } from "lucide-react";
import { useEntitlements, type Entitlements } from "@/hooks/use-entitlements";
import { PlanGate } from "./BadgePlan";
import { useToast } from "@/hooks/use-toast";

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredPlan: 'pilot' | 'pro' | 'enterprise';
  fileExtension: string;
}

const EXPORT_FORMATS: ExportFormat[] = [
  {
    id: 'txt',
    name: 'Text File',
    description: 'Simple text export',
    icon: FileText,
    requiredPlan: 'pilot',
    fileExtension: 'txt'
  },
  {
    id: 'json',
    name: 'JSON Data',
    description: 'Structured data export',
    icon: Database,
    requiredPlan: 'pilot',
    fileExtension: 'json'
  },
  {
    id: 'pdf',
    name: 'PDF Report',
    description: 'Professional PDF document',
    icon: FileText,
    requiredPlan: 'pro',
    fileExtension: 'pdf'
  },
  {
    id: 'csv',
    name: 'CSV Spreadsheet',
    description: 'Tabular data for analysis',
    icon: Database,
    requiredPlan: 'pro',
    fileExtension: 'csv'
  },
  {
    id: 'bundle',
    name: 'Complete Bundle',
    description: 'All formats in one package',
    icon: Download,
    requiredPlan: 'enterprise',
    fileExtension: 'zip'
  }
];

interface ExportMenuProps {
  onExport: (format: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ExportMenu({ onExport, disabled = false, className = "" }: ExportMenuProps) {
  const { hasEntitlement, getRequiredPlan } = useEntitlements();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const currentPlan = getRequiredPlan('canExportPDF') || 'pilot';

  const handleExport = (format: ExportFormat) => {
    // Map format to feature flag
    const featureMap: Record<string, keyof Entitlements> = {
      'pilot': 'canExportMD',
      'pro': 'canExportPDF',
      'enterprise': 'canExportBundleZip'
    };
    
    const featureFlag = featureMap[format.requiredPlan];
    const hasAccess = featureFlag ? hasEntitlement(featureFlag) : format.requiredPlan === 'pilot';
    
    if (!hasAccess) {
      toast({
        title: "Upgrade Required",
        description: `${format.name} export requires ${format.requiredPlan === 'pro' ? 'Pro' : 'Enterprise'} plan`,
        variant: "destructive"
      });
      return;
    }

    onExport(format.id);
    setIsOpen(false);
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'pilot': return <Zap className="w-3 h-3" />;
      case 'pro': return <Crown className="w-3 h-3" />;
      case 'enterprise': return <Crown className="w-3 h-3" />;
      default: return null;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'pilot': return 'bg-slate-600';
      case 'pro': return 'bg-amber-600';
      case 'enterprise': return 'bg-purple-600';
      default: return 'bg-slate-600';
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          disabled={disabled}
          className={`flex items-center gap-2 ${className}`}
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-64">
        {EXPORT_FORMATS.map((format, index) => {
          const featureMap: Record<string, keyof Entitlements> = {
            'pilot': 'canExportMD',
            'pro': 'canExportPDF',
            'enterprise': 'canExportBundleZip'
          };
          
          const featureFlag = featureMap[format.requiredPlan];
          const hasAccess = featureFlag ? hasEntitlement(featureFlag) : format.requiredPlan === 'pilot';
          const Icon = format.icon;
          
          return (
            <React.Fragment key={format.id}>
              <DropdownMenuItem
                onClick={() => handleExport(format)}
                disabled={!hasAccess}
                className="flex items-center justify-between p-3"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{format.name}</span>
                      {!hasAccess && <Lock className="w-3 h-3 text-amber-400" />}
                    </div>
                    <p className="text-xs text-slate-400">{format.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Badge 
                    className={`${getPlanColor(format.requiredPlan)} text-white text-xs px-1.5 py-0.5`}
                    variant="secondary"
                  >
                    {getPlanIcon(format.requiredPlan)}
                    <span className="ml-1">
                      {format.requiredPlan === 'pilot' ? 'Free' : 
                       format.requiredPlan === 'pro' ? 'Pro' : 'Enterprise'}
                    </span>
                  </Badge>
                </div>
              </DropdownMenuItem>
              
              {index < EXPORT_FORMATS.length - 1 && (
                <DropdownMenuSeparator />
              )}
            </React.Fragment>
          );
        })}
        
        <DropdownMenuSeparator />
        
        <div className="p-3 text-center">
          <p className="text-xs text-slate-400 mb-2">
            Current Plan: <span className="font-medium text-white capitalize">{currentPlan}</span>
          </p>
          {currentPlan !== 'enterprise' && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={() => {
                // Navigate to pricing page
                window.location.href = '/pricing';
              }}
            >
              Upgrade Plan
            </Button>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface ExportGateProps {
  format: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ExportGate({ format, children, fallback }: ExportGateProps) {
  const { hasEntitlement } = useEntitlements();
  
  const formatConfig = EXPORT_FORMATS.find(f => f.id === format);
  if (!formatConfig) {
    return <>{children}</>;
  }

  const featureMap: Record<string, keyof Entitlements> = {
    'pilot': 'canExportMD',
    'pro': 'canExportPDF',
    'enterprise': 'canExportBundleZip'
  };
  
  const featureFlag = featureMap[formatConfig.requiredPlan];
  const hasAccess = featureFlag ? hasEntitlement(featureFlag) : formatConfig.requiredPlan === 'pilot';

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <PlanGate requiredPlan={formatConfig.requiredPlan}>
      {children}
    </PlanGate>
  );
}
