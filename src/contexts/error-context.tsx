'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { ErrorMessage, ErrorType, generateErrorId, parseError } from '@/lib/error-handler'

interface ErrorContextType {
    errors: ErrorMessage[]
    showError: (error: unknown, type?: ErrorType) => void
    showSuccess: (message: string) => void
    showWarning: (message: string) => void
    showInfo: (message: string) => void
    dismissError: (id: string) => void
    clearAll: () => void
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

export function ErrorProvider({ children }: { children: ReactNode }) {
    const [errors, setErrors] = useState<ErrorMessage[]>([])

    const showError = useCallback((error: unknown, type: ErrorType = 'error') => {
        const { title, message } = parseError(error)
        const errorMessage: ErrorMessage = {
            id: generateErrorId(),
            type,
            title,
            message,
            timestamp: Date.now()
        }

        setErrors(prev => [...prev, errorMessage])

        setTimeout(() => {
            setErrors(prev => prev.filter(e => e.id !== errorMessage.id))
        }, 5000)
    }, [])

    const showSuccess = useCallback((message: string) => {
        const errorMessage: ErrorMessage = {
            id: generateErrorId(),
            type: 'success',
            title: 'Berhasil',
            message,
            timestamp: Date.now()
        }

        setErrors(prev => [...prev, errorMessage])
        setTimeout(() => {
            setErrors(prev => prev.filter(e => e.id !== errorMessage.id))
        }, 3000)
    }, [])

    const showWarning = useCallback((message: string) => {
        const errorMessage: ErrorMessage = {
            id: generateErrorId(),
            type: 'warning',
            title: 'Peringatan',
            message,
            timestamp: Date.now()
        }

        setErrors(prev => [...prev, errorMessage])
        setTimeout(() => {
            setErrors(prev => prev.filter(e => e.id !== errorMessage.id))
        }, 4000)
    }, [])

    const showInfo = useCallback((message: string) => {
        const errorMessage: ErrorMessage = {
            id: generateErrorId(),
            type: 'info',
            title: 'Informasi',
            message,
            timestamp: Date.now()
        }

        setErrors(prev => [...prev, errorMessage])
        setTimeout(() => {
            setErrors(prev => prev.filter(e => e.id !== errorMessage.id))
        }, 3000)
    }, [])

    const dismissError = useCallback((id: string) => {
        setErrors(prev => prev.filter(e => e.id !== id))
    }, [])

    const clearAll = useCallback(() => {
        setErrors([])
    }, [])

    return (
        <ErrorContext.Provider value={{
            errors,
            showError,
            showSuccess,
            showWarning,
            showInfo,
            dismissError,
            clearAll
        }}>
            {children}
        </ErrorContext.Provider>
    )
}

export function useError() {
    const context = useContext(ErrorContext)
    if (!context) {
        throw new Error('useError must be used within ErrorProvider')
    }
    return context
}
