import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { documentService } from '@/services/document.service'
import { MedicalStaffGroup, PpkType } from '@/types'

export function useCategories() {
  const [groups, setGroups] = useState<MedicalStaffGroup[]>([])
  const [types, setTypes] = useState<PpkType[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [groupsData, typesData] = await documentService.getCategories(supabase)
        if (groupsData.data) setGroups(groupsData.data)
        if (typesData.data) setTypes(typesData.data)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [supabase])

  return { groups, types, loading }
}