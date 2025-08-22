"use client";
import clsx from "clsx";
import { createElement, forwardRef } from "react";
import { useMotion } from "@/lib/motion/provider";

const INTENT_CLASS_MAP = {
  guide: "motion-guide",      // translateY(-1px) on hover, subtle glow
  state: "motion-state",      // pulse/check/loader
  explain: "motion-explain"   // slide 8–12px between states
} as const;

type MotionIntent = "guide" | "state" | "explain";

interface MotionProps {
  is?: keyof JSX.IntrinsicElements;
  intent: MotionIntent;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export const Motion = forwardRef<HTMLElement, MotionProps>(
  ({ is = "div", intent, className, children, ...props }, ref) => {
    const { reduced, enabled, flags } = useMotion();
    
    // Determine if motion should be applied based on intent and flags
    const shouldApplyMotion = (() => {
      if (reduced || !enabled) return false;
      
      switch (intent) {
        case "guide":
          return flags.motion_micro; // CTA hovers, focus rings
        case "state":
          return flags.motion_micro; // Loading, success states
        case "explain":
          return flags.motion_primary; // Step transitions
        default:
          return false;
      }
    })();

    const motionClass = shouldApplyMotion ? INTENT_CLASS_MAP[intent] : undefined;

    return createElement(
      is,
      {
        ref,
        className: clsx(className, motionClass),
        "data-motion-intent": intent,
        ...props
      },
      children
    );
  }
);

Motion.displayName = "Motion";
