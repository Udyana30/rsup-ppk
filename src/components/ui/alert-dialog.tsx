'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createPortal } from 'react-dom'

interface AlertDialogProps {
  isOpen: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'destructive'
  isProcessing?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function AlertDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  variant = 'default',
  isProcessing = false,
  onConfirm,
  onCancel
}: AlertDialogProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!isOpen || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-0">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onCancel}
      />

      <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 animate-in zoom-in-95 duration-200">
        <div className="sm:flex sm:items-start">
          {variant === 'destructive' && (
            <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          )}

          <div className={cn("mt-3 text-center sm:mt-0 sm:text-left", variant === 'destructive' && "sm:ml-4")}>
            <h3 className="text-lg font-semibold leading-6 text-gray-900">
              {title}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                {description}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse sm:gap-3">
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'primary'}
            onClick={onConfirm}
            disabled={isProcessing}
            className={cn(
              "w-full sm:w-auto min-w-[100px]",
              variant === 'destructive' ? "bg-red-600 hover:bg-red-700" : "bg-[#41A67E] hover:bg-[#368f6b]"
            )}
          >
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmLabel}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isProcessing}
            className="mt-3 w-full sm:mt-0 sm:w-auto bg-white hover:bg-gray-50 text-gray-700"
          >
            {cancelLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}