'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface AnimatedLogoProps {
  variant?: 'gold' | 'black' | 'white';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export function AnimatedLogo({
  variant = 'white',
  size = 'md',
  animated = false,
  className = '',
}: AnimatedLogoProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const staticLogos = {
    gold: '/forge_v3_logo/nav_static_03_loading.webp',
    black: '/forge_v3_logo/nav_static_03_loading.webp',
    white: '/forge_v3_logo/nav_static_03_loading.webp',
  };

  const animatedLogos = {
    gold: '/forge_v3_logo/logo_animation.mp4',
    black: '/forge_v3_logo/logo_animation.mp4',
    white: '/forge_v3_logo/nav_static_03_loading.webp', // fallback to static for white
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className={`${sizeClasses[size]} bg-gray-800 animate-pulse rounded ${className}`} />
    );
  }

  if (animated && (variant === 'gold' || variant === 'black')) {
    return (
      <video
        className={`${sizeClasses[size]} object-contain ${className}`}
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src={animatedLogos[variant]}
          type={variant === 'gold' ? 'video/webm' : 'video/mp4'}
        />
        <Image
          src={staticLogos[variant] || '/placeholder.svg'}
          alt="PROMPTFORGE™"
          width={64}
          height={64}
          className="object-contain"
        />
      </video>
    );
  }

  return (
    <Image
      src={staticLogos[variant] || '/placeholder.svg'}
      alt="PROMPTFORGE™"
      width={64}
      height={64}
      className={`${sizeClasses[size]} object-contain ${className}`}
      priority
    />
  );
}
