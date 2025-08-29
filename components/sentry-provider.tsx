"use client"

import { useEffect } from 'react'
import { initSentry } from '@/lib/sentry'

interface SentryProviderProps {
  children: React.ReactNode
}

export function SentryProvider({ children }: SentryProviderProps) {
  useEffect(() => {
    // Initialize Sentry when the component mounts
    initSentry()
  }, [])

  return <>{children}</>
}
