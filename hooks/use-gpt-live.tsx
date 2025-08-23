// PROMPTFORGE™ v3 - GPT Live Hook cu SACF Security
// Hook pentru integrarea GPT Editor și GPT Test cu gating complet

import { useState, useCallback } from 'react';
import { useEntitlementsContext } from './use-entitlements';
import { validate7D, type SevenD } from '@/lib/ruleset';

interface GPTEditorResponse {
  promptEdited: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    duration_ms: number;
  };
  meta: {
    original_length: number;
    edited_length: number;
    domain: string;
    output_format: string;
  };
}

interface GPTTestResponse {
  runId: string;
  verdict: 'pass' | 'partial_pass' | 'fail';
  score: number;
  passed: boolean;
  breakdown: {
    clarity: number;
    execution: number;
    ambiguity: number;
    business_fit: number;
    composite: number;
  };
  thresholds: {
    clarity_min: number;
    execution_min: number;
    ambiguity_max: number;
    business_fit_min: number;
    total_min: number;
  };
  prompt: string;
  wasOptimized: boolean;
  modelResponse: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    duration_ms: number;
    estimated_cost_usd: number;
  };
  feedback: string;
  meta: {
    domain: string;
    output_format: string;
    signature: string;
  };
}

interface UseGPTLiveReturn {
  // GPT Editor
  editPrompt: (prompt: string, sevenD: Partial<SevenD>) => Promise<GPTEditorResponse>;
  editing: boolean;
  editError: string | null;

  // GPT Test
  testPrompt: (prompt: string, sevenD: Partial<SevenD>) => Promise<GPTTestResponse>;
  testing: boolean;
  testError: string | null;

  // State
  lastEditResult: GPTEditorResponse | null;
  lastTestResult: GPTTestResponse | null;

  // Capabilities
  canEdit: boolean;
  canTest: boolean;
  upgradeMessage: string | null;
}

export function useGPTLive(orgId: string, userId: string, moduleId: string): UseGPTLiveReturn {
  const { entitlements, loading: entitlementsLoading } = useEntitlementsContext();

  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [lastEditResult, setLastEditResult] = useState<GPTEditorResponse | null>(null);

  const [testing, setTesting] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [lastTestResult, setLastTestResult] = useState<GPTTestResponse | null>(null);

  // Verifică capabilities
  const canEdit = true; // GPT Editor este disponibil pentru toți
  const canTest = entitlements?.canUseGptTestReal || false;

  const upgradeMessage = !canTest
    ? 'GPT Test Real requires Pro plan. Upgrade to test your prompts on live models.'
    : null;

  // GPT Editor function
  const editPrompt = useCallback(
    async (prompt: string, sevenD: Partial<SevenD>): Promise<GPTEditorResponse> => {
      if (!orgId || !userId || !moduleId) {
        throw new Error('Missing required parameters: orgId, userId, moduleId');
      }

      if (!prompt.trim()) {
        throw new Error('Prompt cannot be empty');
      }

      setEditing(true);
      setEditError(null);

      try {
        // Validează 7D conform SSOT
        const validationResult = validate7D(sevenD);
        if (!validationResult.isValid) {
          throw new Error(`Invalid 7D configuration: ${validationResult.errors.join(', ')}`);
        }

        const response = await fetch('/api/gpt-editor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-org-id': orgId, // SACF required header
            'x-run-id': crypto.randomUUID(), // SACF required header
          },
          body: JSON.stringify({
            orgId,
            userId,
            moduleId,
            promptDraft: prompt,
            sevenD: validationResult.normalized,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || error.error || 'Failed to edit prompt');
        }

        const result: GPTEditorResponse = await response.json();
        setLastEditResult(result);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setEditError(errorMessage);
        throw error;
      } finally {
        setEditing(false);
      }
    },
    [orgId, userId, moduleId]
  );

  // GPT Test function
  const testPrompt = useCallback(
    async (prompt: string, sevenD: Partial<SevenD>): Promise<GPTTestResponse> => {
      if (!orgId || !userId || !moduleId) {
        throw new Error('Missing required parameters: orgId, userId, moduleId');
      }

      if (!canTest) {
        throw new Error('GPT Test Real requires Pro plan');
      }

      if (!prompt.trim()) {
        throw new Error('Prompt cannot be empty');
      }

      setTesting(true);
      setTestError(null);

      try {
        // Validează 7D conform SSOT
        const validationResult = validate7D(sevenD);
        if (!validationResult.isValid) {
          throw new Error(`Invalid 7D configuration: ${validationResult.errors.join(', ')}`);
        }

        const response = await fetch('/api/gpt-test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-org-id': orgId, // SACF required header
            'x-run-id': crypto.randomUUID(), // SACF required header
          },
          body: JSON.stringify({
            orgId,
            userId,
            moduleId,
            prompt,
            sevenD: validationResult.normalized,
          }),
        });

        if (!response.ok) {
          const error = await response.json();

          if (error.error === 'ENTITLEMENT_REQUIRED') {
            throw new Error('GPT Test Real requires Pro plan');
          }

          throw new Error(error.message || error.error || 'Failed to test prompt');
        }

        const result: GPTTestResponse = await response.json();
        setLastTestResult(result);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setTestError(errorMessage);
        throw error;
      } finally {
        setTesting(false);
      }
    },
    [orgId, userId, moduleId, canTest]
  );

  return {
    // GPT Editor
    editPrompt,
    editing,
    editError,

    // GPT Test
    testPrompt,
    testing,
    testError,

    // State
    lastEditResult,
    lastTestResult,

    // Capabilities
    canEdit,
    canTest,
    upgradeMessage,
  };
}
