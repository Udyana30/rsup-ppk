'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateProfile, changePassword } from '@/actions/profile'
import { useToast } from '@/contexts/toast-context'

export function useProfileActions() {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const updateProfileInfo = async (userId: string, data: { fullName: string; username: string }) => {
    setIsProcessing(true)
    try {
      const res = await updateProfile(userId, data)
      if (!res.success) throw new Error(res.error)

      router.refresh()
      toast({ 
        title: 'Profil Diperbarui', 
        message: 'Informasi data diri berhasil disimpan', 
        type: 'success' 
      })
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal update profil'
      toast({ title: 'Gagal', message, type: 'error' })
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  const updateUserPassword = async (newPass: string) => {
    setIsProcessing(true)
    try {
      const res = await changePassword(newPass)
      if (!res.success) throw new Error(res.error)

      toast({ 
        title: 'Password Diubah', 
        message: 'Password akun Anda berhasil diperbarui', 
        type: 'success' 
      })
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal ganti password'
      toast({ title: 'Gagal', message, type: 'error' })
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  return { updateProfileInfo, updateUserPassword, isProcessing }
}