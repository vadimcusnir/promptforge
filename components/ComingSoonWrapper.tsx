"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface ComingSoonWrapperProps {
  children: React.ReactNode;
}

export function ComingSoonWrapper({ children }: ComingSoonWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAccess = () => {
      try {
        // Skip check for coming-soon page itself and API routes
        if (pathname === "/coming-soon" || pathname.startsWith("/api/")) {
          setIsAdmin(true);
          setIsChecking(false);
          return;
        }

        // Check if user is admin (has admin cookies)
        const adminRole = document.cookie.includes("pf_role=admin");
        console.log(`[ComingSoonWrapper] Path: ${pathname}, Admin role found: ${adminRole}`);
        
        if (!adminRole) {
          console.log(`[ComingSoonWrapper] Not admin, redirecting to coming-soon from ${pathname}`);
          // Redirect to coming-soon page if not admin
          router.push("/coming-soon");
          return;
        } else {
          console.log(`[ComingSoonWrapper] Admin user, allowing access to ${pathname}`);
          setIsAdmin(true);
          setIsChecking(false);
        }
      } catch (error) {
        console.error("[ComingSoonWrapper] Error checking access:", error);
        // On error, redirect to coming-soon for safety
        router.push("/coming-soon");
      }
    };

    // Add a small delay to ensure the component is fully mounted
    const timer = setTimeout(() => {
      checkAccess();
    }, 100);

    return () => clearTimeout(timer);
  }, [router, pathname]);

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

  // If not admin, show nothing (redirect should happen)
  if (!isAdmin) {
    return null;
  }

  // If admin, show the page content
  return <>{children}</>;
}
