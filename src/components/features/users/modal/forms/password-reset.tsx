'use client'

import { useState } from 'react'
import { adminResetPassword } from '@/actions/auth-admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, RefreshCw, KeyRound, CheckCircle2 } from 'lucide-react'

interface PasswordResetFormProps {
  userId: string
}

export function PasswordResetForm({ userId }: PasswordResetFormProps) {
  const [newPassword, setNewPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const generatePassword = () => {
    const randomPass = Math.random().toString(36).slice(-8)
    setNewPassword(randomPass)
    setIsSuccess(false)
  }

  const handleReset = async () => {
    if (!newPassword) return
    setIsLoading(true)
    
    try {
      const result = await adminResetPassword(userId, newPassword)
      if (result.success) {
        setIsSuccess(true)
        setNewPassword('') 
      } else {
        alert(result.error)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-green-200 bg-green-50 p-6 text-center animate-in fade-in zoom-in duration-300">
        <div className="mb-3 rounded-full bg-green-100 p-3">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        </div>
        <p className="text-sm font-bold text-green-800">Password berhasil direset!</p>
        <p className="mt-1 text-xs text-green-700">Silakan infokan password baru kepada user.</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsSuccess(false)} 
          className="mt-4 border-green-200 bg-white text-green-700 hover:bg-green-100"
        >
          Reset Ulang
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-5 space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900">Reset Password User</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Masukkan password baru"
              className="pl-11 h-11 text-gray-700 border-orange-200 focus:border-orange-400 focus:ring-orange-400 bg-white"
            />
            <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          </div>
          <Button 
            type="button" 
            variant="outline"
            onClick={generatePassword}
            className="h-11 px-3 border-orange-200 hover:bg-orange-100 text-orange-700"
            title="Generate Random Password"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button 
        type="button"
        onClick={handleReset}
        disabled={isLoading || !newPassword}
        className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-sm"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Password Baru'}
      </Button>
    </div>
  )
}