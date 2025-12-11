import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { masterService } from '@/services/master.service'
import { useMasterData } from '@/contexts/master-data-context'
import { MedicalStaffGroupInsert, MedicalStaffGroupUpdate } from '@/types'
import { useToast } from '@/contexts/toast-context'

export function useMasterGroups() {
  const [isProcessing, setIsProcessing] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const { refreshMasterData } = useMasterData()
  const { toast } = useToast()

  const createGroup = async (data: MedicalStaffGroupInsert) => {
    setIsProcessing(true)
    try {
      const { error } = await masterService.createGroup(supabase, data)
      if (error) throw error
      
      await refreshMasterData()
      router.refresh()
      toast({ title: 'Berhasil', message: 'KSM berhasil ditambahkan', type: 'success' })
      return true
    } catch (error) {
      console.error(error)
      toast({ title: 'Gagal', message: 'Gagal menambah KSM', type: 'error' })
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  const updateGroup = async (id: string, data: MedicalStaffGroupUpdate) => {
    setIsProcessing(true)
    try {
      const { error } = await masterService.updateGroup(supabase, id, data)
      if (error) throw error

      await refreshMasterData()
      router.refresh()
      toast({ title: 'Berhasil', message: 'KSM berhasil diperbarui', type: 'success' })
      return true
    } catch (error) {
      console.error(error)
      toast({ title: 'Gagal', message: 'Gagal update KSM', type: 'error' })
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  const deleteGroup = async (id: string) => {
    setIsProcessing(true)
    try {
      const { error } = await masterService.deleteGroup(supabase, id)
      if (error) throw error

      await refreshMasterData()
      router.refresh()
      toast({ title: 'Berhasil', message: 'KSM berhasil dihapus', type: 'success' })
      return true
    } catch (error) {
      console.error(error)
      toast({ title: 'Gagal', message: 'Gagal menghapus KSM', type: 'error' })
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  return { createGroup, updateGroup, deleteGroup, isProcessing }
}