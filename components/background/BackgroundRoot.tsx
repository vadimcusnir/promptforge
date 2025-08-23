'use client';
import { useEffect, useState } from 'react';

export default function BackgroundRoot({
  ambient = true, // soft mode by default
  disabled = false, // pentru disabling complet
}: {
  ambient?: boolean;
  disabled?: boolean;
}) {
  const [motionOff, setMotionOff] = useState(false);

  useEffect(() => {
    // citește data-motion din <html>
    const attr = document.documentElement.getAttribute('data-motion');
    setMotionOff(attr === 'off');
  }, []);

  // Dacă e disabled complet, returnează null
  if (disabled) return null;

  // Stratul 1 — Grid static (fără drift/parallax)
  const Grid = <div className="pf-grid-fixed" aria-hidden="true" />;

  if (ambient || motionOff) {
    // Soft Mode: afișezi DOAR grid static; NU montezi tokens/quotes/figures
    return <>{Grid}</>;
  }

  // Normal Mode (dacă mai vrei efecte subtile): poți reîncărca treptat
  // const Tokens  = <TokensLayer density={40} drift={false} />;
  // const Figures = <FiguresLayer density={10} animate={false} />;
  // const Quotes  = <QuotesLayer frequency="rare" />;
  return <>{Grid}</>;
}
