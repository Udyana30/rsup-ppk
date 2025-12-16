'use client'

import { useState } from 'react'
import { useProfileActions } from '@/hooks/use-profile-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react'
import { AlertDialog } from '@/components/ui/alert-dialog'

export function PasswordForm() {
  const { updateUserPassword, isProcessing } = useProfileActions()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password baru tidak cocok')
      return
    }

    if (newPassword.length < 6) {
      setError('Password baru minimal 6 karakter')
      return
    }

    setShowConfirmDialog(true)
  }

  const confirmUpdate = async () => {
    const success = await updateUserPassword(newPassword)
    if (success) {
      setNewPassword('')
      setConfirmPassword('')
      setShowConfirmDialog(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">Password Baru</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10 pr-10 h-11 text-gray-900 bg-white"
                placeholder="Minimal 6 karakter"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">Konfirmasi Password Baru</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10 h-11 text-gray-900 bg-white"
                placeholder="Ulangi password baru"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm font-medium text-red-500 bg-red-50 p-3 rounded-md">
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isProcessing || !newPassword}
            className="bg-gray-900 hover:bg-black text-white font-bold min-w-[140px]"
          >
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Ganti Password'}
          </Button>
        </div>
      </form>

      <AlertDialog
        isOpen={showConfirmDialog}
        title="Ganti Password"
        description="Apakah Anda yakin ingin mengubah password akun Anda?"
        confirmLabel="Ya, Ganti"
        cancelLabel="Batal"
        isProcessing={isProcessing}
        onConfirm={confirmUpdate}
        onCancel={() => setShowConfirmDialog(false)}
      />
    </>
  )
}