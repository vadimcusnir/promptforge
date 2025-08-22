"use client";
import { useEffect, useRef, useState } from "react";

export function useFpsTier(windowMs = 700) {
  const [tier, setTier] = useState<"hi" | "mid" | "low">("hi");
  const start = useRef<number | null>(null);
  const frames = useRef(0);

  useEffect(() => {
    let raf = 0;
    const tick = (t: number) => {
      if (start.current === null) start.current = t;
      frames.current++;
      if (t - start.current >= windowMs) {
        const fps = (frames.current / (t - start.current)) * 1000;
        setTier(fps >= 50 ? "hi" : fps >= 30 ? "mid" : "low");
        cancelAnimationFrame(raf);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [windowMs]);

  return tier;
}
