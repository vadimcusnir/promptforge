'use client';

import { useState, useEffect } from 'react';

interface AnimatedHeroTextProps {
  texts: string[];
  className?: string;
}

export function AnimatedHeroText({ texts, className = '' }: AnimatedHeroTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % texts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="h1-flips-container">
        <div
          className="h1-flips"
          style={{
            transform: `translateY(-${currentIndex * 100}%)`,
            transition: 'transform 0.8s cubic-bezier(0.8, 0, 0.2, 1)',
          }}
        >
          {texts.map((text, index) => (
            <div key={index} className="h1-flip">
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
