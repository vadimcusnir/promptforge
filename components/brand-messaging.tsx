'use client';

import { getBrandMessage, getContextualCTA, getUrgencyMessage } from '@/lib/brand-messaging';
import { PremiumGate } from '@/lib/premium-features';
import { IndustrialBadge } from '@/components/industrial-ui';
import { Zap, TrendingUp, Sparkles } from 'lucide-react';

interface BrandMessageProps {
  messageId: string;
  className?: string;
  showCTA?: boolean;
  showSecondary?: boolean;
}

export function BrandMessage({
  messageId,
  className = '',
  showCTA = false,
  showSecondary = true,
}: BrandMessageProps) {
  const premiumGate = PremiumGate.getInstance();
  const currentTier = premiumGate.getCurrentTier();
  const message = getBrandMessage(messageId, currentTier.id);

  if (!message) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-lg font-semibold text-white">{message.primary}</h3>
      {showSecondary && message.secondary && (
        <p className="text-sm text-slate-300">{message.secondary}</p>
      )}
      {showCTA && message.cta && (
        <div className="pt-2">
          <IndustrialBadge
            variant="info"
            className="cursor-pointer hover:bg-blue-600 transition-colors"
          >
            {message.cta}
          </IndustrialBadge>
        </div>
      )}
    </div>
  );
}

export function ValueProposition() {
  return (
    <div className="text-center space-y-6 py-12">
      <div className="space-y-4">
        <h2 className="text-4xl font-black text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text">
          From Concept to Deployment
        </h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Transform ideas into execution-ready AI prompts with military-grade precision
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">50 Battle-Tested Modules</h3>
          <p className="text-sm text-slate-400">
            Specialized AI modules engineered for specific business outcomes
          </p>
        </div>

        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-400 rounded-full flex items-center justify-center mx-auto">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">7 Semantic Vectors</h3>
          <p className="text-sm text-slate-400">
            Multi-dimensional prompt optimization for maximum effectiveness
          </p>
        </div>

        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full flex items-center justify-center mx-auto"></div>
          <h3 className="text-xl font-bold text-white">Enterprise Security</h3>
          <p className="text-sm text-slate-400">SOC2 compliance with 99.9% uptime SLA guarantee</p>
        </div>
      </div>
    </div>
  );
}

export function SocialProof() {
  const stats = [
    {
      value: '10,000+',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      value: '99.9%',
      label: 'Uptime SLA',
    },
    {
      value: '10x',
      label: 'Faster Development',
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      value: '30 Days',
      label: 'Average ROI',
      icon: <Zap className="w-4 h-4" />,
    },
  ];

  return (
    <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-white mb-2">Trusted by Industry Leaders</h3>
        <p className="text-sm text-slate-300">
          From Fortune 500 enterprises to innovative startups, teams choose PROMPTFORGE™ for
          mission-critical AI operations
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center space-y-2">
            <div className="flex items-center justify-center text-cyan-400">{stat.icon}</div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UrgencyBanner() {
  const premiumGate = PremiumGate.getInstance();
  const currentTier = premiumGate.getCurrentTier();
  const urgencyMessage = getUrgencyMessage(currentTier.id);
  const cta = getContextualCTA(currentTier.id, 'upgrade');

  if (currentTier.id === 'enterprise') return null;

  return (
    <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-400 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-200">{urgencyMessage}</p>
            <p className="text-xs text-amber-300">Limited time: 30% off Pro plans</p>
          </div>
        </div>
        <IndustrialBadge
          variant="warning"
          className="cursor-pointer hover:bg-amber-600 transition-colors"
        >
          {cta}
        </IndustrialBadge>
      </div>
    </div>
  );
}
