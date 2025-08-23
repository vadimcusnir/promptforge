'use client';

import { useState, useEffect } from 'react';
import { History, RotateCcw, Cloud, HardDrive } from 'lucide-react';
import type { HistoryEntry } from '@/types/promptforge';
import { PremiumGate } from '@/lib/premium-features';

interface HistoryPanelProps {
  onRestoreConfig: (entry: HistoryEntry) => void;
}

export function HistoryPanel({ onRestoreConfig }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [storageType, setStorageType] = useState<'local' | 'cloud'>('local');
  const premiumGate = PremiumGate.getInstance();
  const hasCloudHistory = premiumGate.getCurrentTier().id !== 'free';

  useEffect(() => {
    loadHistory();
  }, [storageType]);

  const loadHistory = () => {
    if (storageType === 'cloud' && hasCloudHistory) {
      // Simulate cloud history loading
      const cloudHistory: HistoryEntry[] = [
        {
          id: 'pf_m03_a17b22',
          moduleId: 3,
          sevenDConfig: {
            domain: 'business',
            scale: 'enterprise',
            urgency: 'high',
            complexity: 'advanced',
            resources: 'unlimited',
            application: 'production',
            output: 'structured',
          },
          timestamp: new Date(Date.now() - 3600000),
          score: 91,
          verdict: 'PASS',
        },
      ];
      setHistory(cloudHistory);
    } else {
      // Load from localStorage
      const stored = localStorage.getItem('pf_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(
          parsed.map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp),
          }))
        );
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getVerdictColor = (verdict?: string) => {
    switch (verdict) {
      case 'PASS':
        return 'text-gold-industrial';
      case 'PARTIAL':
        return 'text-lead-gray';
      case 'FAIL':
        return 'text-red-500';
      default:
        return 'text-lead-gray';
    }
  };

  return (
    <div className="glass-effect rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <History className="w-5 h-5 text-gold-industrial" />
          <h2 className="text-xl font-semibold font-montserrat">Session History</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStorageType('local')}
            className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
              storageType === 'local'
                ? 'bg-gold-industrial text-black'
                : 'bg-lead-gray/20 text-lead-gray'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            Local
          </button>
          <button
            onClick={() => hasCloudHistory && setStorageType('cloud')}
            disabled={!hasCloudHistory}
            className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
              storageType === 'cloud'
                ? 'bg-gold-industrial text-black'
                : hasCloudHistory
                  ? 'bg-lead-gray/20 text-lead-gray hover:bg-lead-gray/30'
                  : 'bg-lead-gray/10 text-lead-gray/50 cursor-not-allowed'
            }`}
            title={!hasCloudHistory ? 'Cloud history available in Pro' : ''}
          >
            <Cloud className="w-4 h-4" />
            Cloud {!hasCloudHistory && '(Pro)'}
          </button>
        </div>
      </div>

      {!hasCloudHistory && storageType === 'cloud' && (
        <div className="mb-4 p-4 bg-lead-gray/10 border border-lead-gray/20 rounded-lg">
          <div className="text-sm text-lead-gray">
            Cloud history sync requires Pro plan. Upgrade to access your history across devices.
          </div>
        </div>
      )}

      <div className="space-y-3">
        {history.length === 0 ? (
          <div className="text-center py-8 text-lead-gray">
            <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No history entries yet</p>
            <p className="text-sm">Generate prompts to build your history</p>
          </div>
        ) : (
          history.map(entry => (
            <div key={entry.id} className="p-4 bg-black/30 rounded-lg border border-lead-gray/20">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm text-gold-industrial">{entry.id}</span>
                    <span className="text-sm text-lead-gray">{formatTime(entry.timestamp)}</span>
                    {entry.score && (
                      <span className="text-sm">
                        <span className={getVerdictColor(entry.verdict)}>{entry.score}/100</span>
                        <span className="text-lead-gray ml-1">({entry.verdict})</span>
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-lead-gray">
                    Module {entry.moduleId} • {entry.sevenDConfig.domain} •{' '}
                    {entry.sevenDConfig.scale}
                  </div>
                </div>
                <button
                  onClick={() => onRestoreConfig(entry)}
                  className="px-3 py-2 bg-lead-gray/20 hover:bg-lead-gray/30 rounded-lg text-sm flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restore
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
