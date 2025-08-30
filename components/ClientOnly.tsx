"use client";

import { useEffect, useState } from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  retryDelays?: number[];
}

export function ClientOnly({
  children,
  fallback = null,
  retryDelays = [0, 100, 300],
}: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const tryMount = () => {
      if (typeof window !== "undefined" && document.readyState !== "loading") {
        setHasMounted(true);
      } else if (retryCount < retryDelays.length - 1) {
        setTimeout(
          () => {
            setRetryCount((prev) => prev + 1);
          },
          retryDelays[retryCount + 1] || 300,
        );
      }
    };

    tryMount();
  }, [retryCount, retryDelays]);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
