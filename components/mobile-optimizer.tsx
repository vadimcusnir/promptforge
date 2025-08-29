"use client"

import { useEffect, useState } from 'react'

interface MobileOptimizations {
  isMobile: boolean
  isLowEndDevice: boolean
  reducedMotion: boolean
  dataSaver: boolean
}

export function MobileOptimizer() {
  const [optimizations, setOptimizations] = useState<MobileOptimizations>({
    isMobile: false,
    isLowEndDevice: false,
    reducedMotion: false,
    dataSaver: false
  })

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return

    const detectMobileOptimizations = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent)
      
      // Detect low-end devices
      const isLowEndDevice = detectLowEndDevice()
      
      // Check for reduced motion preference
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      
      // Check for data saver mode
      const dataSaver = (navigator as any).connection?.saveData || false

      setOptimizations({
        isMobile,
        isLowEndDevice,
        reducedMotion,
        dataSaver
      })

      // Apply mobile-specific optimizations
      applyMobileOptimizations({
        isMobile,
        isLowEndDevice,
        reducedMotion,
        dataSaver
      })
    }

    const detectLowEndDevice = (): boolean => {
      // Check for low memory devices
      if ((navigator as any).deviceMemory && (navigator as any).deviceMemory < 4) {
        return true
      }
      
      // Check for low-end CPUs
      if ((navigator as any).hardwareConcurrency && (navigator as any).hardwareConcurrency < 4) {
        return true
      }
      
      // Check for slow connections
      if ((navigator as any).connection) {
        const connection = (navigator as any).connection
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          return true
        }
      }
      
      return false
    }

    const applyMobileOptimizations = (opts: MobileOptimizations) => {
      const root = document.documentElement
      
      // Apply mobile-specific CSS classes
      if (opts.isMobile) {
        root.classList.add('mobile-device')
      }
      
      if (opts.isLowEndDevice) {
        root.classList.add('low-end-device')
      }
      
      if (opts.reducedMotion) {
        root.classList.add('reduced-motion')
      }
      
      if (opts.dataSaver) {
        root.classList.add('data-saver')
      }

      // Optimize images for mobile
      if (opts.isMobile || opts.dataSaver) {
        optimizeImagesForMobile()
      }

      // Reduce animation complexity on low-end devices
      if (opts.isLowEndDevice) {
        reduceAnimationComplexity()
      }
    }

    const optimizeImagesForMobile = () => {
      const images = document.querySelectorAll('img')
      images.forEach(img => {
        // Add loading="lazy" for images below the fold
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy')
        }
        
        // Reduce image quality for data saver
        if (optimizations.dataSaver) {
          img.style.imageRendering = 'pixelated'
        }
      })
    }

    const reduceAnimationComplexity = () => {
      // Reduce CSS animation complexity
      const style = document.createElement('style')
      style.textContent = `
        .low-end-device * {
          animation-duration: 0.1s !important;
          transition-duration: 0.1s !important;
        }
        
        .low-end-device .animate-pulse {
          animation: none !important;
        }
        
        .low-end-device .backdrop-blur {
          backdrop-filter: none !important;
        }
      `
      document.head.appendChild(style)
    }

    // Initial detection
    detectMobileOptimizations()

    // Listen for changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.addEventListener('change', detectMobileOptimizations)

    // Listen for connection changes
    if ((navigator as any).connection) {
      (navigator as any).connection.addEventListener('change', detectMobileOptimizations)
    }

    return () => {
      mediaQuery.removeEventListener('change', detectMobileOptimizations)
      if ((navigator as any).connection) {
        (navigator as any).connection.removeEventListener('change', detectMobileOptimizations)
      }
    }
  }, [])

  // Apply mobile-specific CSS optimizations
  useEffect(() => {
    if (typeof window === 'undefined') return

    const applyMobileCSS = () => {
      const style = document.createElement('style')
      style.textContent = `
        /* Mobile-specific performance optimizations */
        .mobile-device .pattern-bg {
          background-size: 100px 100px;
          opacity: 0.3;
        }
        
        .mobile-device .glass-effect {
          backdrop-filter: blur(5px);
        }
        
        .low-end-device .pattern-bg {
          background: none;
        }
        
        .low-end-device .glass-effect {
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: none;
        }
        
        .data-saver img {
          filter: grayscale(0.1);
        }
        
        .reduced-motion * {
          animation: none !important;
          transition: none !important;
        }
        
        /* Touch-friendly optimizations */
        .mobile-device button,
        .mobile-device [role="button"] {
          min-height: 44px;
          min-width: 44px;
        }
        
        .mobile-device input,
        .mobile-device textarea {
          font-size: 16px; /* Prevents zoom on iOS */
        }
        
        /* Mobile layout optimizations */
        @media (max-width: 768px) {
          .mobile-device .container {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
          
          .mobile-device .text-5xl {
            font-size: 2rem;
            line-height: 2.25rem;
          }
          
          .mobile-device .text-7xl {
            font-size: 2.5rem;
            line-height: 2.75rem;
          }
        }
      `
      
      // Remove existing mobile CSS to prevent duplicates
      const existingStyle = document.getElementById('mobile-optimizations')
      if (existingStyle) {
        existingStyle.remove()
      }
      
      style.id = 'mobile-optimizations'
      document.head.appendChild(style)
    }

    applyMobileCSS()
  }, [optimizations])

  // This component doesn't render anything visible
  return null
}

// Hook for using mobile optimizations in other components
export function useMobileOptimizations() {
  const [optimizations, setOptimizations] = useState<MobileOptimizations>({
    isMobile: false,
    isLowEndDevice: false,
    reducedMotion: false,
    dataSaver: false
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateOptimizations = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent)
      
      setOptimizations({
        isMobile,
        isLowEndDevice: (navigator as any).deviceMemory < 4 || (navigator as any).hardwareConcurrency < 4,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        dataSaver: (navigator as any).connection?.saveData || false
      })
    }

    updateOptimizations()
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.addEventListener('change', updateOptimizations)

    return () => {
      mediaQuery.removeEventListener('change', updateOptimizations)
    }
  }, [])

  return optimizations
}
