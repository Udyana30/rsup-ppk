'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminCreateUser, adminDeleteUser, adminUpdateUser } from '@/actions/auth-admin'
import { useToast } from '@/contexts/toast-context'

export function useUserActions() {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const createUser = async (data: { username: string, fullName: string, role: string }) => {
    setIsProcessing(true)
    try {
      const res = await adminCreateUser(data)
      if (!res.success) throw new Error(res.error)

      router.refresh()
      toast({
        title: 'User Berhasil Dibuat',
        message: `Username: ${res.username} | Password: ${res.tempPassword}`,
        type: 'success',
        duration: 10000 
      })
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal membuat user'
      toast({ title: 'Gagal', message, type: 'error' })
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  const updateUser = async (userId: string, data: { fullName?: string, role?: string, isActive?: boolean }) => {
    setIsProcessing(true)
    try {
      const res = await adminUpdateUser(userId, data)
      if (!res.success) throw new Error(res.error)

      router.refresh()
      toast({ title: 'Berhasil', message: 'Data user berhasil diperbarui', type: 'success' })
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal update user'
      toast({ title: 'Gagal', message, type: 'error' })
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  const deleteUser = async (userId: string) => {
    setIsProcessing(true)
    try {
      const res = await adminDeleteUser(userId)
      if (!res.success) throw new Error(res.error)

      router.refresh()
      toast({ title: 'Berhasil', message: 'User berhasil dihapus permanen', type: 'success' })
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal menghapus user'
      toast({ title: 'Gagal', message, type: 'error' })
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  return { createUser, updateUser, deleteUser, isProcessing }
}