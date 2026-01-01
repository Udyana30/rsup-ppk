'use client'

import { useEffect } from 'react'
import { useError } from '@/contexts/error-context'
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ErrorAlert() {
    const { errors, dismissError } = useError()

    if (errors.length === 0) return null

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
            {errors.map((error) => (
                <ErrorToast
                    key={error.id}
                    error={error}
                    onDismiss={() => dismissError(error.id)}
                />
            ))}
        </div>
    )
}

interface ErrorToastProps {
    error: {
        id: string
        type: 'error' | 'warning' | 'info' | 'success'
        title: string
        message: string
    }
    onDismiss: () => void
}

function ErrorToast({ error, onDismiss }: ErrorToastProps) {
    useEffect(() => {
        // Tambahkan animasi entrance
        const timer = setTimeout(() => {
            const element = document.getElementById(error.id)
            if (element) {
                element.classList.add('animate-in', 'slide-in-from-right-full')
            }
        }, 10)

        return () => clearTimeout(timer)
    }, [error.id])

    const config = {
        error: {
            icon: AlertCircle,
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            iconColor: 'text-red-600',
            titleColor: 'text-red-900',
            messageColor: 'text-red-700'
        },
        warning: {
            icon: AlertTriangle,
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
            iconColor: 'text-amber-600',
            titleColor: 'text-amber-900',
            messageColor: 'text-amber-700'
        },
        info: {
            icon: Info,
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            iconColor: 'text-blue-600',
            titleColor: 'text-blue-900',
            messageColor: 'text-blue-700'
        },
        success: {
            icon: CheckCircle,
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            iconColor: 'text-green-600',
            titleColor: 'text-green-900',
            messageColor: 'text-green-700'
        }
    }

    const { icon: Icon, bgColor, borderColor, iconColor, titleColor, messageColor } = config[error.type]

    return (
        <div
            id={error.id}
            className={cn(
                'flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm',
                'transition-all duration-300 ease-out',
                bgColor,
                borderColor
            )}
        >
            <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', iconColor)} />

            <div className="flex-1 min-w-0">
                <h4 className={cn('text-sm font-semibold', titleColor)}>
                    {error.title}
                </h4>
                <p className={cn('text-sm mt-1', messageColor)}>
                    {error.message}
                </p>
            </div>

            <button
                onClick={onDismiss}
                className={cn(
                    'flex-shrink-0 p-1 rounded-md transition-colors',
                    'hover:bg-white/50',
                    titleColor
                )}
                aria-label="Tutup"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    )
}
