import { cookies, headers } from "next/headers";

export async function getMotionMode() {
  // 1) hard override din UI (cookie "motion=off|on")
  const cookieStore = await cookies();
  const c = cookieStore.get("motion")?.value;
  if (c === "off" || c === "on") return c as "off"|"on";

  // 2) ENV (fallback temporar)
  if (process.env.NEXT_PUBLIC_MOTION === "off") return "off";

  // 3) respectă preferința userului (Reduce Motion)
  const headerStore = await headers();
  const hdr = headerStore.get("Sec-CH-Prefers-Reduced-Motion") || "";
  if (/\breduce\b/i.test(hdr)) return "off";

  return "on";
}

// Client-side hook for motion detection
export function useMotionMode() {
  if (typeof window === "undefined") return "on";
  
  // Check data-motion attribute on html element
  const attr = document.documentElement.getAttribute("data-motion");
  if (attr === "off" || attr === "on") return attr as "off"|"on";
  
  // Check prefers-reduced-motion
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery.matches) return "off";
  
  return "on";
}
