'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  persistent?: boolean
}

interface ToastsProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

const TOAST_ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
}

const TOAST_COLORS = {
  success: {
    bg: 'bg-green-500/20',
    border: 'border-green-500/30',
    icon: 'text-green-500',
    title: 'text-green-400'
  },
  error: {
    bg: 'bg-red-500/20',
    border: 'border-red-500/30',
    icon: 'text-red-500',
    title: 'text-red-400'
  },
  warning: {
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/30',
    icon: 'text-yellow-500',
    title: 'text-yellow-400'
  },
  info: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    icon: 'text-blue-500',
    title: 'text-blue-400'
  }
}

export function Toasts({ toasts, onRemove }: ToastsProps) {
  const [visibleToasts, setVisibleToasts] = useState<Toast[]>([])

  useEffect(() => {
    setVisibleToasts(toasts)
  }, [toasts])

  const handleRemove = useCallback((id: string) => {
    setVisibleToasts(prev => prev.filter(toast => toast.id !== id))
    onRemove(id)
  }, [onRemove])

  const handleAction = useCallback((toast: Toast) => {
    if (toast.action) {
      toast.action.onClick()
      handleRemove(toast.id)
    }
  }, [handleRemove])

  if (visibleToasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {visibleToasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={handleRemove}
          onAction={handleAction}
        />
      ))}
    </div>
  )
}

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
  onAction: (toast: Toast) => void
}

function ToastItem({ toast, onRemove, onAction }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  const colors = TOAST_COLORS[toast.type]
  const IconComponent = TOAST_ICONS[toast.type]

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (toast.persistent) return

    const duration = toast.duration || 5000
    const timer = setTimeout(() => {
      handleRemove()
    }, duration)

    return () => clearTimeout(timer)
  }, [toast.duration, toast.persistent])

  const handleRemove = useCallback(() => {
    setIsLeaving(true)
    setTimeout(() => {
      onRemove(toast.id)
    }, 300)
  }, [toast.id, onRemove])

  const handleAction = useCallback(() => {
    onAction(toast)
  }, [toast, onAction])

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
        }
        ${colors.bg} ${colors.border} border rounded-lg p-4 shadow-lg
      `}
    >
      <div className="flex items-start space-x-3">
        <IconComponent className={`h-5 w-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
        
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-medium ${colors.title}`}>
            {toast.title}
          </h4>
          {toast.message && (
            <p className="mt-1 text-sm text-gray-300">
              {toast.message}
            </p>
          )}
          {toast.action && (
            <button
              onClick={handleAction}
              className="mt-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              {toast.action.label}
            </button>
          )}
        </div>

        <button
          onClick={handleRemove}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Toast manager hook
export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      id,
      duration: 5000,
      ...toast
    }
    setToasts(prev => [...prev, newToast])
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  const showSuccess = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'success', title, message, ...options })
  }, [addToast])

  const showError = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'error', title, message, duration: 7000, ...options })
  }, [addToast])

  const showWarning = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'warning', title, message, ...options })
  }, [addToast])

  const showInfo = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'info', title, message, ...options })
  }, [addToast])

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}
