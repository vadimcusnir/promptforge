"use client"

import { useEffect, useState } from "react"
import { WifiOff } from "lucide-react"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineMessage, setShowOfflineMessage] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineMessage(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineMessage(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Check initial state
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!showOfflineMessage) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="offline-state flex items-center gap-2 p-3 rounded-lg shadow-lg">
        <WifiOff className="w-5 h-5 flex-shrink-0" />
        <div>
          <p className="font-medium text-sm">You're offline</p>
          <p className="text-xs opacity-75">Some features may not be available</p>
        </div>
      </div>
    </div>
  )
}
