'use client';

import { useEffect, useState } from 'react';

export function useReducedMotion() {
  const [prm, setPrm] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrm(mq.matches);

    update();
    mq.addEventListener?.('change', update);
    document.documentElement.dataset.prm = mq.matches ? '1' : '0';

    return () => mq.removeEventListener?.('change', update);
  }, []);

  return prm;
}
