"use client"

import { useState, useEffect } from 'react';
import type { PlanType } from '@/types/modules';

interface Entitlements {
  plan: PlanType;
  canUseGptTestReal: boolean;
  canExportFormat: (format: string, score?: number) => boolean;
  canExportPDF: boolean;
  canExportJSON: boolean;
  canExportZIP: boolean;
  canExportBundleZip: boolean;
}

export function useEntitlements(): Entitlements {
  const [entitlements, setEntitlements] = useState<Entitlements>({
    plan: 'FREE',
    canUseGptTestReal: false,
    canExportPDF: false,
    canExportJSON: false,
    canExportZIP: false,
    canExportBundleZip: false,
    availableExportFormats: ['txt'],
    minExportScore: 80
  });

  useEffect(() => {
    fetchEntitlements();
  }, []);

  const fetchEntitlements = async () => {
    try {
      const response = await fetch('/api/entitlements');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setEntitlements(data.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch entitlements:', error);
    }
  };

  const canExportFormat = (format: string, score?: number): boolean => {
    const { plan } = entitlements;
    const formatAvailability = {
      'txt': true,
      'md': plan !== 'FREE',
      'pdf': plan === 'PRO' || plan === 'ENTERPRISE',
      'json': plan === 'PRO' || plan === 'ENTERPRISE',
      'zip': plan === 'ENTERPRISE'
    };
    
    const hasFormatAccess = formatAvailability[format as keyof typeof formatAvailability] || false;
    
    // Block PDF and JSON exports if score is below threshold
    if ((format === 'pdf' || format === 'json') && score !== undefined) {
      return hasFormatAccess && score >= entitlements.minExportScore;
    }
    
    return hasFormatAccess;
  };

  return { ...entitlements, canExportFormat };
}
