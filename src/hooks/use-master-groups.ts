import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { masterService } from '@/services/master.service'
import { useMasterData } from '@/contexts/master-data-context'
import { MedicalStaffGroupInsert, MedicalStaffGroupUpdate } from '@/types'

export function useMasterGroups() {
  const [isProcessing, setIsProcessing] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const { refreshMasterData } = useMasterData()

  const createGroup = async (data: MedicalStaffGroupInsert) => {
    setIsProcessing(true)
    try {
      const { error } = await masterService.createGroup(supabase, data)
      if (error) throw error
      
      await refreshMasterData()
      router.refresh()
      return true
    } catch (error) {
      console.error(error)
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
      return true
    } catch (error) {
      console.error(error)
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
      return true
    } catch (error) {
      console.error(error)
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  return { createGroup, updateGroup, deleteGroup, isProcessing }
}