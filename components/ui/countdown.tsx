"use client";

import { useState, useEffect } from "react";

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2025-09-01T12:00:00.000Z"); // September 1, 2025, 12:00 UTC

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-foreground">Ends in:</span>
      <div className="flex items-center gap-1">
        {timeLeft.days > 0 && (
          <>
            <div className="bg-[hsl(var(--accent))] text-black px-2 py-1 rounded text-xs font-mono">
              {String(timeLeft.days).padStart(2, "0")}d
            </div>
            <span className="text-[hsl(var(--accent))]">:</span>
          </>
        )}
        <div className="bg-[hsl(var(--accent))] text-black px-2 py-1 rounded text-xs font-mono">
          {String(timeLeft.hours).padStart(2, "0")}
        </div>
        <span className="text-[hsl(var(--accent))]">:</span>
        <div className="bg-[hsl(var(--accent))] text-black px-2 py-1 rounded text-xs font-mono">
          {String(timeLeft.minutes).padStart(2, "0")}
        </div>
        <span className="text-[hsl(var(--accent))]">:</span>
        <div className="bg-[hsl(var(--accent))] text-black px-2 py-1 rounded text-xs font-mono">
          {String(timeLeft.seconds).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}
