'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, Clock, Download, Lock } from 'lucide-react';
import { Module, VectorType, PlanType } from '@/lib/modules';
import { useTelemetry } from '@/hooks/use-telemetry';
import { useEntitlements } from '@/hooks/use-entitlements';

interface ModuleCardProps {
  module: Module;
}

const VECTOR_COLORS: Record<VectorType, string> = {
  clarity: 'bg-blue-500',
  context: 'bg-green-500',
  constraints: 'bg-yellow-500',
  creativity: 'bg-purple-500',
  consistency: 'bg-indigo-500',
  compliance: 'bg-red-500',
  conversion: 'bg-orange-500'
};

const PLAN_COLORS: Record<PlanType, string> = {
  FREE: 'bg-green-500',
  CREATOR: 'bg-blue-500',
  PRO: 'bg-purple-500',
  ENTERPRISE: 'bg-orange-500'
};

export function ModuleCard({ module }: ModuleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { track } = useTelemetry();
  const { userPlan } = useEntitlements();

  // Check if user can access this module
  const canAccess = userPlan && getPlanLevel(userPlan) >= getPlanLevel(module.minPlan);
  
  // Check if user can export specific formats
  const canExportPDF = userPlan === 'PRO' || userPlan === 'ENTERPRISE';
  const canExportJSON = userPlan === 'PRO' || userPlan === 'ENTERPRISE';
  const canExportZIP = userPlan === 'ENTERPRISE';

  const handleCardClick = () => {
    track('module_open', {
      module_id: module.id,
      module_title: module.title,
      user_plan: userPlan,
      can_access: canAccess
    });
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    track('module_view_click', {
      module_id: module.id,
      module_title: module.title,
      user_plan: userPlan
    });
  };

  return (
    <div
      className={`relative bg-[var(--bg)] border border-[var(--border)] rounded-xl p-6 transition-all duration-300 cursor-pointer ${
        isHovered 
          ? 'border-[var(--brand)] shadow-lg shadow-[var(--brand)]/20 transform -translate-y-1' 
          : 'hover:border-[var(--border)]/60'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-2 line-clamp-2">
            {module.title}
          </h3>
          <p className="text-sm text-[var(--fg-muted)] line-clamp-2 mb-3">
            {module.summary}
          </p>
        </div>
        
        {/* Plan Badge */}
        <div className={`ml-3 px-2 py-1 text-xs font-medium text-white rounded-full ${PLAN_COLORS[module.minPlan]}`}>
          {module.minPlan}
        </div>
      </div>

      {/* Vectors */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          {module.vectors.slice(0, 3).map((vector) => (
            <span
              key={vector}
              className={`px-2 py-1 text-xs text-white rounded ${VECTOR_COLORS[vector]}`}
            >
              {vector.charAt(0).toUpperCase() + vector.slice(1)}
            </span>
          ))}
          {module.vectors.length > 3 && (
            <span className="px-2 py-1 text-xs text-[var(--fg-muted)] bg-[var(--border)] rounded">
              +{module.vectors.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mb-4 text-sm text-[var(--fg-muted)]">
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-500" />
          <span>{module.rating.toFixed(1)}</span>
          <span>({module.reviews})</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4" />
          <span>{module.estimatedTime}s</span>
        </div>
        <div className="flex items-center space-x-1">
          <Download className="h-4 w-4" />
          <span>{module.downloads.toLocaleString()}</span>
        </div>
      </div>

      {/* Difficulty Meter */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-[var(--fg-muted)]">Difficulty</span>
          <span className="text-[var(--fg-primary)] font-medium">
            {module.difficulty}/5
          </span>
        </div>
        <div className="w-full bg-[var(--border)] rounded-full h-2">
          <div
            className="bg-[var(--brand)] h-2 rounded-full transition-all duration-300"
            style={{ width: `${(parseInt(module.difficulty) / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Export Formats */}
      <div className="mb-4">
        <div className="text-sm text-[var(--fg-muted)] mb-2">Export formats:</div>
        <div className="flex flex-wrap gap-1">
          {module.outputs.map((format) => {
            const isLocked = 
              (format === 'pdf' && !canExportPDF) ||
              (format === 'json' && !canExportJSON) ||
              (format === 'zip' && !canExportZIP);
            
            return (
              <span
                key={format}
                className={`px-2 py-1 text-xs rounded border ${
                  isLocked
                    ? 'text-[var(--fg-muted)] border-[var(--border)] bg-[var(--border)]'
                    : 'text-[var(--fg-primary)] border-[var(--brand)] bg-[var(--brand)]/20'
                }`}
              >
                {format.toUpperCase()}
                {isLocked && <Lock className="inline h-3 w-3 ml-1" />}
              </span>
            );
          })}
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-auto">
        {canAccess ? (
          <Link
            href={`/modules/${module.id}`}
            onClick={handleViewClick}
            className="w-full bg-[var(--brand)] text-[var(--bg)] py-3 px-4 rounded-lg font-medium text-center hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
          >
            View Module
          </Link>
        ) : (
          <div className="relative">
            <button
              disabled
              className="w-full bg-[var(--border)] text-[var(--fg-muted)] py-3 px-4 rounded-lg font-medium text-center cursor-not-allowed"
              title={`Requires ${module.minPlan} plan or higher`}
            >
              <Lock className="inline h-4 w-4 mr-2" />
              Upgrade to {module.minPlan}
            </button>
          </div>
        )}
      </div>

      {/* Hover Effect Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-[var(--brand)]/5 rounded-xl pointer-events-none" />
      )}
    </div>
  );
}

// Helper function to get plan level for comparison
function getPlanLevel(plan: PlanType): number {
  const levels = { FREE: 0, CREATOR: 1, PRO: 2, ENTERPRISE: 3 };
  return levels[plan];
}
