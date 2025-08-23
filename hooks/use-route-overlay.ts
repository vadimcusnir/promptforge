'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface RouteOverlayConfig {
  route: string;
  overlayClass: string;
  description: string;
}

const ROUTE_CONFIGS: RouteOverlayConfig[] = [
  {
    route: '/dashboard',
    overlayClass: 'route-dashboard',
    description: 'Dashboard - lighter overlay for work focus (0.28-0.35)',
  },
  {
    route: '/generator',
    overlayClass: 'route-generator',
    description: 'Generator - medium overlay for creative work (0.40-0.48)',
  },
  {
    route: '/',
    overlayClass: 'route-marketing',
    description: 'Marketing - standard overlay for landing (0.45-0.55)',
  },
  {
    route: '/pricing',
    overlayClass: 'route-marketing',
    description: 'Pricing - marketing overlay',
  },
  {
    route: '/modules',
    overlayClass: 'route-marketing',
    description: 'Modules - marketing overlay',
  },
];

export function useRouteOverlay() {
  const pathname = usePathname();

  useEffect(() => {
    const overlayElement = document.getElementById('bg-overlay');
    if (!overlayElement) return;

    // Remove all route classes
    const allRouteClasses = ROUTE_CONFIGS.map(config => config.overlayClass);
    overlayElement.classList.remove(...allRouteClasses);

    // Find matching route config
    const matchingConfig = ROUTE_CONFIGS.find(config => {
      if (config.route === '/') {
        return pathname === '/';
      }
      return pathname.startsWith(config.route);
    });

    // Apply the appropriate route class
    const routeClass = matchingConfig?.overlayClass || 'route-marketing';
    overlayElement.classList.add(routeClass);

    console.log(`[RouteOverlay] Applied ${routeClass} for path: ${pathname}`);
  }, [pathname]);

  // Function to toggle quote focus mode
  const toggleQuoteFocus = (isActive: boolean) => {
    const overlayElement = document.getElementById('bg-overlay');
    const matrixTokens = document.querySelector('.matrix-tokens');

    if (overlayElement) {
      if (isActive) {
        overlayElement.classList.add('quote-active');
      } else {
        overlayElement.classList.remove('quote-active');
      }
    }

    if (matrixTokens) {
      if (isActive) {
        matrixTokens.classList.add('quote-focus');
      } else {
        matrixTokens.classList.remove('quote-focus');
      }
    }

    console.log(`[RouteOverlay] Quote focus ${isActive ? 'activated' : 'deactivated'}`);
  };

  return {
    toggleQuoteFocus,
    currentRoute: pathname,
  };
}
