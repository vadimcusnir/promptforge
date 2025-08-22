"use client";
import { createContext, useContext, useEffect, useState } from "react";

type MotionFlags = {
  motion_primary: boolean;
  motion_micro: boolean;
  brand_scenes: boolean;
};

type MotionContext = {
  enabled: boolean;
  reduced: boolean;
  flags: MotionFlags;
};

const MotionContext = createContext<MotionContext>({
  enabled: true,
  reduced: false,
  flags: { motion_primary: true, motion_micro: true, brand_scenes: false },
});

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState(false);
  const [flags, setFlags] = useState<MotionFlags>({
    motion_primary: true,
    motion_micro: true,
    brand_scenes: false,
  });

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setReduced(mq.matches);

    handleChange(); // Set initial value
    mq.addEventListener("change", handleChange);

    return () => mq.removeEventListener("change", handleChange);
  }, []);

  // Read motion flags from cookie or localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("motion-flags");
      if (stored) {
        const parsed = JSON.parse(stored);
        setFlags((prev) => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.warn("Failed to parse motion flags:", error);
    }
  }, []);

  // Update HTML data attributes for CSS targeting
  useEffect(() => {
    document.documentElement.dataset.prm = reduced ? "1" : "0";
    document.documentElement.dataset.motionPrimary = flags.motion_primary
      ? "1"
      : "0";
    document.documentElement.dataset.motionMicro = flags.motion_micro
      ? "1"
      : "0";
    document.documentElement.dataset.brandScenes = flags.brand_scenes
      ? "1"
      : "0";
  }, [reduced, flags]);

  const enabled = !reduced && (flags.motion_primary || flags.motion_micro);

  return (
    <MotionContext.Provider value={{ enabled, reduced, flags }}>
      {children}
    </MotionContext.Provider>
  );
}

export const useMotion = () => useContext(MotionContext);
