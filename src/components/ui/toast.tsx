'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Toast as ToastType } from '@/types/toast'

interface ToastProps extends ToastType {
  onDismiss: (id: string) => void
}

const icons = {
  success: <CheckCircle2 className="h-5 w-5 text-green-600" />,
  error: <AlertCircle className="h-5 w-5 text-red-600" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />
}

const borderColors = {
  success: 'border-l-green-600',
  error: 'border-l-red-600',
  warning: 'border-l-amber-500',
  info: 'border-l-blue-500'
}

export function Toast({ id, title, message, type = 'info', duration = 4000, onDismiss }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true))
    
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onDismiss(id), 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onDismiss])

  return (
    <div
      className={cn(
        "pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5 transition-all duration-300 ease-in-out border-l-4",
        borderColors[type],
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 pt-0.5">
            {icons[type]}
          </div>
          <div className="w-0 flex-1 pt-0.5">
            <p className="text-sm font-semibold text-gray-900">{title}</p>
            {message && <p className="mt-1 text-sm text-gray-500 leading-relaxed">{message}</p>}
          </div>
          <div className="ml-4 flex shrink-0">
            <button
              type="button"
              className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => {
                setIsVisible(false)
                setTimeout(() => onDismiss(id), 300)
              }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}