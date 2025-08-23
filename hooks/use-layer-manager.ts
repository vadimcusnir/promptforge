'use client';
import { useEffect, useRef, useState } from 'react';

type LayerState =
  | 'waiting_init'
  | 'hydrating'
  | 'ready'
  | 'active'
  | 'recovering'
  | 'fallback_static';

export function useLayerManager(enabled: boolean) {
  const [state, setState] = useState<LayerState>('waiting_init');
  const retries = useRef(0);
  const maxRetries = 5;

  useEffect(() => {
    let cancel = false;
    async function toReady() {
      setState('hydrating');
      try {
        // fonts.ready & 1 rAF sunt deja gestionate în useFontsReady,
        // aici păstrăm secvența pentru robustețe.
        await new Promise(r => requestAnimationFrame(() => r(null)));
      } catch {}
      if (!cancel) setState('ready');
    }
    if (enabled) toReady();
    return () => {
      cancel = true;
    };
  }, [enabled]);

  useEffect(() => {
    if (state !== 'ready') return;
    if (document.documentElement.classList.contains('matrix-animations-ready')) {
      setState('active');
      return;
    }
    const id = setTimeout(() => {
      if (document.documentElement.classList.contains('matrix-animations-ready')) {
        setState('active');
      } else {
        // backoff exponențial cu jitter
        retries.current++;
        if (retries.current <= maxRetries) {
          setState('recovering');
          const base = [100, 300, 700, 1500, 2500][retries.current - 1] ?? 2500;
          const jitter = Math.floor(Math.random() * 120);
          setTimeout(() => setState('ready'), base + jitter);
        } else {
          setState('fallback_static');
        }
      }
    }, 50);
    return () => clearTimeout(id);
  }, [state]);

  return state;
}
