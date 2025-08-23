'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { matrixTokens } from '@/lib/data/matrix-tokens';
import { backgroundConfig } from '@/lib/background/config';
import { createTokenPool } from '@/lib/background/token-pool';

type TokenView = {
  id: number;
  text: string;
  x: number;
  y: number;
  delay: number;
};

export default function MatrixTokens() {
  const pool = useMemo(() => createTokenPool(matrixTokens, backgroundConfig.maxTokens), []);
  const [views, setViews] = useState<TokenView[]>([]);
  const mounted = useRef(false);

  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateReduced = () => {
      const isReduced =
        mediaQuery.matches && document.documentElement.getAttribute('data-animations') !== 'on';
      setReduced(isReduced);
      console.log('[v0] Reduced motion state:', isReduced);
    };

    mediaQuery.addEventListener('change', updateReduced);
    updateReduced();

    return () => mediaQuery.removeEventListener('change', updateReduced);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onMatrixReady = () => {
      setReady(true);
      console.log('[v0] Matrix ready event received');
    };

    if (document.documentElement.classList.contains('matrix-animations-ready')) {
      setReady(true);
      console.log('[v0] Matrix already ready on mount');
    } else {
      document.addEventListener('matrix:ready', onMatrixReady, { once: true });
    }

    return () => document.removeEventListener('matrix:ready', onMatrixReady);
  }, []);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    console.log('[v0] MatrixTokens mounting - starting diagnostics...');
    console.log('[v0] Ready state:', ready, 'Reduced state:', reduced);

    const { innerWidth: w, innerHeight: h } = window;
    const isMobile = w < 768;
    const tokenCount = isMobile ? 60 : 100;
    const actualTokens = Math.min(tokenCount, backgroundConfig.maxTokens);

    console.log('[v0] Screen size:', w, 'x', h, '- Using', actualTokens, 'tokens');

    const items: TokenView[] = [];
    for (let i = 0; i < actualTokens; i++) {
      const t = pool.next();
      items.push({
        id: t.id,
        text: t.text,
        x: Math.random() * w,
        y: Math.random() * h,
        delay: rand(backgroundConfig.tokenSpawnDelayMs),
      });
    }
    setViews(items);

    console.log('[v0] Generated', items.length, 'token views');

    setTimeout(() => {
      const tokenElements = document.querySelectorAll('.token-item');
      const bgTokensContainer = document.querySelector('.bg-tokens');

      console.log('[v0] Token elements in DOM:', tokenElements.length);
      console.log(
        '[v0] Token density check - expected:',
        actualTokens,
        'actual:',
        tokenElements.length
      );

      if (bgTokensContainer) {
        const containerStyles = getComputedStyle(bgTokensContainer);
        console.log('[v0] Container position:', containerStyles.position);
        console.log('[v0] Container z-index:', containerStyles.zIndex);
        console.log('[v0] Container opacity:', containerStyles.opacity);
        console.log('[v0] Container display:', containerStyles.display);
        console.log('[v0] Container visibility:', containerStyles.visibility);

        const bodyChildren = Array.from(document.body.children);
        bodyChildren.forEach((child, index) => {
          if (child !== bgTokensContainer?.parentElement) {
            const childStyles = getComputedStyle(child as HTMLElement);
            if (childStyles.position === 'fixed' || childStyles.position === 'absolute') {
              console.log(
                `[v0] Potential overlay #${index}:`,
                child.className,
                'z-index:',
                childStyles.zIndex,
                'background:',
                childStyles.backgroundColor,
                'opacity:',
                childStyles.opacity
              );
            }
          }
        });
      }

      if (tokenElements.length > 0) {
        const firstToken = tokenElements[0] as HTMLElement;
        const tokenStyles = getComputedStyle(firstToken);
        console.log('[v0] Token color:', tokenStyles.color, '(should be #00FF7F)');
        console.log('[v0] Token opacity:', tokenStyles.opacity, '(should be >0.85)');
        console.log('[v0] Token animation:', tokenStyles.animation);
        console.log('[v0] Token mix-blend-mode:', tokenStyles.mixBlendMode);
        console.log('[v0] Token position:', tokenStyles.position);
        console.log('[v0] Token z-index:', tokenStyles.zIndex);
      }
    }, 100);
  }, [pool, ready, reduced]);

  const shouldShowTokens = ready && !reduced;
  console.log('[v0] Rendering tokens:', shouldShowTokens, '- ready:', ready, 'reduced:', reduced);

  return (
    <div
      className="bg-tokens pointer-events-none fixed inset-0 z-[2]"
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2,
        opacity: shouldShowTokens ? 0.9 : 0,
        pointerEvents: 'none',
      }}
    >
      {shouldShowTokens &&
        views.map(v => (
          <span
            key={v.id}
            className="token-item select-none"
            style={{
              position: 'absolute',
              left: v.x,
              top: v.y,
              animationDelay: `${v.delay}ms`,
              color: '#00FF7F',
              opacity: 0.85,
              fontSize: window.innerWidth < 480 ? '8px' : window.innerWidth < 768 ? '10px' : '12px',
            }}
            data-token
          >
            {v.text}
          </span>
        ))}
    </div>
  );
}

function rand([a, b]: [number, number]) {
  return Math.floor(a + Math.random() * (b - a));
}
