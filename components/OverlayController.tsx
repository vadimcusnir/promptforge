"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// SSOT: Route class mapping from ruleset.yml
const ROUTE_CLASS_MAP: Record<string, string> = {
  "/": "route-marketing",
  "/generator": "route-generator", 
  "/dashboard": "route-dashboard",
};

// All possible route classes for cleanup
const ALL_ROUTE_CLASSES = Object.values(ROUTE_CLASS_MAP);

/**
 * OverlayController - Single source of truth for UI overlay management
 * Enforces UI Overlay Policy from ruleset.yml
 * 
 * Performance requirements:
 * - Apply within 50ms (acceptance criteria)
 * - GPU-accelerated transitions
 * - Respect reduced motion preferences
 * - Clean up on unmount
 */
export function OverlayController() {
  const pathname = usePathname();

  useEffect(() => {
    const startTime = performance.now();
    
    const overlayElement = document.querySelector<HTMLElement>("#bg-overlay");
    if (!overlayElement) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[OverlayController] #bg-overlay element not found");
      }
      return;
    }

    // Clean up old route classes (enforce single route class policy)
    overlayElement.classList.remove(...ALL_ROUTE_CLASSES);
    
    // Apply new route class
    const routeClass = ROUTE_CLASS_MAP[pathname] ?? "route-marketing";
    overlayElement.classList.add(routeClass);

    // Performance: Enable hardware acceleration
    overlayElement.style.willChange = "transform, opacity";
    
    // Diagnostics: Check performance requirement (≤50ms)
    const applyTime = performance.now() - startTime;
    if (applyTime > 50 && process.env.NODE_ENV === "development") {
      console.warn(`[OverlayController] Overlay apply took ${applyTime.toFixed(2)}ms (>50ms requirement)`);
    }

    // Cleanup function - enforce cleanup_on_unmount policy
    return () => {
      if (overlayElement) {
        overlayElement.style.willChange = "";
        overlayElement.classList.remove(...ALL_ROUTE_CLASSES);
      }
    };
  }, [pathname]);

  return null;
}
