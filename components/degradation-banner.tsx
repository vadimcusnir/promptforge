'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, X, RefreshCw, Info } from 'lucide-react'

interface DegradationBannerProps {
  reason?: string
  retryAfter?: number
  isEmergency?: boolean
  showRetry?: boolean
}

export function DegradationBanner({
  reason = 'Service temporarily degraded',
  retryAfter = 60,
  isEmergency = false,
  showRetry = true
}: DegradationBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState(retryAfter)
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [timeRemaining])

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      // Attempt to refresh the page or retry the operation
      window.location.reload()
    } catch (error) {
      console.error('Retry failed:', error)
    } finally {
      setIsRetrying(false)
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className={`
      fixed top-0 left-0 right-0 z-50 p-4 border-b
      ${isEmergency 
        ? 'bg-red-900/90 border-red-600 text-red-100' 
        : 'bg-yellow-900/90 border-yellow-600 text-yellow-100'
      }
      backdrop-blur-sm shadow-lg
    `}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            {isEmergency ? (
              <AlertTriangle className="h-5 w-5 text-red-300" />
            ) : (
              <Info className="h-5 w-5 text-yellow-300" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold">
                {isEmergency ? '🚨 Emergency Mode' : '⚠️ Service Degradation'}
              </span>
              
              <span className="text-sm opacity-90">
                {reason}
              </span>
              
              {timeRemaining > 0 && (
                <span className="text-sm opacity-75">
                  Auto-retry in {timeRemaining}s
                </span>
              )}
            </div>
            
            <div className="text-sm opacity-75 mt-1">
              {isEmergency 
                ? 'Critical system issues detected. Some features may be temporarily unavailable.'
                : 'Some features are operating in degraded mode. Please be patient.'
              }
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          {showRetry && (
            <button
              onClick={handleRetry}
              disabled={isRetrying || timeRemaining > 0}
              className={`
                px-3 py-1.5 rounded-md text-sm font-medium transition
                flex items-center gap-2
                ${isEmergency
                  ? 'bg-red-700 hover:bg-red-600 disabled:bg-red-800/50 disabled:cursor-not-allowed'
                  : 'bg-yellow-700 hover:bg-yellow-600 disabled:bg-yellow-800/50 disabled:cursor-not-allowed'
                }
              `}
            >
              <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Retrying...' : 'Retry Now'}
            </button>
          )}
          
          <button
            onClick={handleDismiss}
            className={`
              p-1.5 rounded-md transition
              ${isEmergency
                ? 'hover:bg-red-800/50'
                : 'hover:bg-yellow-800/50'
              }
            `}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Degradation context for managing global degradation state
interface DegradationContextType {
  isDegraded: boolean
  degradationReason: string
  setDegradation: (reason: string, retryAfter?: number) => void
  clearDegradation: () => void
}

const DegradationContext = React.createContext<DegradationContextType | null>(null)

export function DegradationProvider({ children }: { children: React.ReactNode }) {
  const [isDegraded, setIsDegraded] = useState(false)
  const [degradationReason, setDegradationReason] = useState('')
  const [retryAfter, setRetryAfter] = useState(60)

  const setDegradation = (reason: string, after: number = 60) => {
    setIsDegraded(true)
    setDegradationReason(reason)
    setRetryAfter(after)
  }

  const clearDegradation = () => {
    setIsDegraded(false)
    setDegradationReason('')
    setRetryAfter(60)
  }

  return (
    <DegradationContext.Provider value={{
      isDegraded,
      degradationReason,
      setDegradation,
      clearDegradation
    }}>
      {isDegraded && (
        <DegradationBanner
          reason={degradationReason}
          retryAfter={retryAfter}
        />
      )}
      {children}
    </DegradationContext.Provider>
  )
}

export function useDegradation() {
  const context = React.useContext(DegradationContext)
  if (!context) {
    throw new Error('useDegradation must be used within DegradationProvider')
  }
  return context
}

// Simulated mode banner for testing
export function SimulatedModeBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4 bg-blue-900/90 border-b border-blue-600 text-blue-100 backdrop-blur-sm shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Info className="h-5 w-5 text-blue-300" />
          <div>
            <div className="font-semibold">🧪 Simulated Mode Active</div>
            <div className="text-sm opacity-75">
              Using simulated responses for testing and demonstration purposes
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm px-2 py-1 bg-blue-700 rounded-md">
            TEST MODE
          </span>
        </div>
      </div>
    </div>
  )
}

// Emergency mode banner
export function EmergencyModeBanner({ reason }: { reason: string }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4 bg-red-900/90 border-b border-red-600 text-red-100 backdrop-blur-sm shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-300" />
          <div>
            <div className="font-semibold">🚨 Emergency Mode</div>
            <div className="text-sm opacity-75">
              {reason}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm px-2 py-1 bg-red-700 rounded-md">
            CRITICAL
          </span>
        </div>
      </div>
    </div>
  )
}
