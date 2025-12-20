import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { masterService } from '@/services/master.service'
import { useMasterData } from '@/contexts/master-data-context'
import { PpkTypeInsert, PpkTypeUpdate } from '@/types'
import { useToast } from '@/contexts/toast-context'

export function useMasterTypes() {
  const [isProcessing, setIsProcessing] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const { refreshMasterData } = useMasterData()
  const { toast } = useToast()

  const createType = async (data: PpkTypeInsert) => {
    setIsProcessing(true)
    try {
      const { error } = await masterService.createType(supabase, data)
      if (error) throw error
      
      await refreshMasterData()
      router.refresh()
      toast({ title: 'Berhasil', message: 'Tipe dokumen berhasil ditambahkan', type: 'success' })
      return true
    } catch (error) {
      console.error(error)
      toast({ title: 'Gagal', message: 'Gagal menambahkan tipe dokumen', type: 'error' })
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  const updateType = async (id: string, data: PpkTypeUpdate) => {
    setIsProcessing(true)
    try {
      const { error } = await masterService.updateType(supabase, id, data)
      if (error) throw error

      await refreshMasterData()
      router.refresh()
      toast({ title: 'Berhasil', message: 'Tipe dokumen berhasil diperbarui', type: 'success' })
      return true
    } catch (error) {
      console.error(error)
      toast({ title: 'Gagal', message: 'Gagal memperbarui tipe dokumen', type: 'error' })
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  const deleteType = async (id: string) => {
    setIsProcessing(true)
    try {
      const { error } = await masterService.deleteType(supabase, id)
      if (error) throw error

      await refreshMasterData()
      router.refresh()
      toast({ title: 'Berhasil', message: 'Tipe dokumen berhasil dihapus', type: 'success' })
      return true
    } catch (error) {
      console.error(error)
      toast({ title: 'Gagal', message: 'Gagal menghapus tipe dokumen', type: 'error' })
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    createType,
    updateType,
    deleteType,
    isProcessing
  }
}