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
        // Skip check for coming-soon page itself and API routes
        if (pathname === "/coming-soon" || pathname.startsWith("/api/")) {
          console.log(`[ComingSoonWrapper] Skipping check for: ${pathname}`);
          setIsAdmin(true);
          setIsChecking(false);
          return;
        }

        // Check if user is admin (has admin cookies)
        const adminRole = document.cookie.includes("pf_role=admin");
        console.log(`[ComingSoonWrapper] Path: ${pathname}, Admin role found: ${adminRole}`);
        
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
