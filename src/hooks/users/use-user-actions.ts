import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/contexts/toast-context'
import { adminCreateUser, adminUpdateUser, adminDeleteUser } from '@/actions/auth-admin'

export function useUserActions() {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const createUser = async (data: { username: string, fullName: string, role: string }) => {
    setIsProcessing(true)
    try {
      const result = await adminCreateUser(data)
      
      if (!result.success) {
        throw new Error(result.error)
      }

      toast({
        title: 'User Berhasil Dibuat',
        message: `Password sementara: ${result.tempPassword}`,
        type: 'success',
        duration: 10000 
      })
      
      router.refresh()
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal membuat user'
      toast({ title: 'Gagal', message, type: 'error' })
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  const updateUser = async (userId: string, data: { fullName: string, username: string, role: string, isActive: boolean }) => {
    setIsProcessing(true)
    try {
      const result = await adminUpdateUser(userId, data)

      if (!result.success) {
        throw new Error(result.error)
      }

      toast({ title: 'Berhasil', message: 'Data user diperbarui', type: 'success' })
      router.refresh()
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
      const result = await adminDeleteUser(userId)
      
      if (!result.success) {
        throw new Error(result.error)
      }

      toast({ title: 'Berhasil', message: 'User dihapus permanen', type: 'success' })
      router.refresh()
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