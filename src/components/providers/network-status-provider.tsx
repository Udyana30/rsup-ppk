'use client'

import { useEffect, useState } from 'react'
import { useError } from '@/contexts/error-context'

export function NetworkStatusProvider({ children }: { children: React.ReactNode }) {
    const { showError, showSuccess } = useError()
    const [wasOffline, setWasOffline] = useState(false)

    useEffect(() => {
        const handleOnline = () => {
            if (wasOffline) {
                showSuccess('Koneksi internet kembali normal')
                setWasOffline(false)
            }
        }

        const handleOffline = () => {
            showError(new Error('Koneksi internet terputus. Beberapa fitur mungkin tidak tersedia.'))
            setWasOffline(true)
        }

        // Check initial status
        if (!navigator.onLine) {
            setWasOffline(true)
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [wasOffline, showError, showSuccess])

    return <>{children}</>
}
