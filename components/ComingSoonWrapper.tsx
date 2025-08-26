"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ComingSoonPage from "@/app/coming-soon/page";

interface ComingSoonWrapperProps {
  children: React.ReactNode;
}

export function ComingSoonWrapper({ children }: ComingSoonWrapperProps) {
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAccess = () => {
      try {
        // Skip check for coming-soon page itself, API routes, blog pages, about page, and contact page
        if (pathname === "/coming-soon" || pathname.startsWith("/api/") || pathname.startsWith("/blog") || pathname === "/about" || pathname === "/contact") {
          console.log(`[ComingSoonWrapper] Skipping check for: ${pathname}`);
          setIsAdmin(true);
          setIsChecking(false);
          return;
        }

        // Protect demo-bundle page from non-admin users during coming-soon mode
        if (pathname === "/demo-bundle") {
          console.log(`[ComingSoonWrapper] Demo bundle access requested: ${pathname}`);
          // Only allow access if user is admin
          const adminRole = document.cookie.includes("pf_role=admin");
          if (!adminRole) {
            console.log(`[ComingSoonWrapper] Non-admin user trying to access demo-bundle, redirecting to coming-soon`);
            setIsAdmin(false);
            setIsChecking(false);
            return;
          }
        }

        // Check if user is admin (has admin cookies)
        const adminRole = document.cookie.includes("pf_role=admin");
        console.log(`[ComingSoonWrapper] Path: ${pathname}, Admin role found: ${adminRole}`);
        
        // TEMPORARY: Bypass admin check for development
        // Check if we're in development by looking for localhost in the URL
        if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
          console.log(`[ComingSoonWrapper] Development mode (localhost), bypassing admin check`);
          setIsAdmin(true);
          setIsChecking(false);
          return;
        }
        
        // Also check for development environment variable
        if (process.env.NODE_ENV === 'development') {
          console.log(`[ComingSoonWrapper] Development environment detected, bypassing admin check`);
          setIsAdmin(true);
          setIsChecking(false);
          return;
        }
        
        // TEMPORARY: Force bypass for contact page in development
        if (pathname === '/contact') {
          console.log(`[ComingSoonWrapper] Force bypassing contact page access in development`);
          setIsAdmin(true);
          setIsChecking(false);
          return;
        }
        
        if (!adminRole) {
          console.log(`[ComingSoonWrapper] Not admin, showing coming-soon content for ${pathname}`);
          setIsAdmin(false);
          setIsChecking(false);
        } else {
          console.log(`[ComingSoonWrapper] Admin user, allowing access to ${pathname}`);
          setIsAdmin(true);
          setIsChecking(false);
        }
      } catch (error) {
        console.error("[ComingSoonWrapper] Error checking access:", error);
        // On error, show coming-soon for safety
        setIsAdmin(false);
        setIsChecking(false);
      }
    };

    // Check immediately without delay
    checkAccess();
  }, [pathname]);

  // Show loading state while checking access
  if (isChecking) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-[#FFD700] mb-4">Checking access...</div>
          <div className="text-sm text-gray-400">Please wait while we verify your permissions</div>
          <div className="text-xs text-gray-500 mt-2">Debug: Checking access for {pathname}</div>
        </div>
      </div>
    );
  }

  // If not admin, show the coming-soon content directly
  if (!isAdmin) {
    return <ComingSoonPage />;
  }

  // If admin, show the page content
  return <>{children}</>;
}
