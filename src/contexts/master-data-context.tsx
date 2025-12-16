'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { masterService } from '@/services/master.service'
import { MedicalStaffGroup, PpkType } from '@/types'
import { useAuth } from '@/hooks/auth/use-auth'

interface MasterDataContextType {
  groups: MedicalStaffGroup[]
  types: PpkType[]
  isLoading: boolean
  refreshMasterData: () => Promise<void>
}

const MasterDataContext = createContext<MasterDataContextType | undefined>(undefined)

export function MasterDataProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const supabase = createClient()

  const [groups, setGroups] = useState<MedicalStaffGroup[]>([])
  const [types, setTypes] = useState<PpkType[]>([])
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  const fetchMasterData = useCallback(async () => {
    try {
      const [groupsRes, typesRes] = await Promise.all([
        masterService.getGroups(supabase),
        masterService.getTypes(supabase)
      ])

      if (groupsRes.data) setGroups(groupsRes.data)
      if (typesRes.data) setTypes(typesRes.data)

      setIsDataLoaded(true)
    } catch (error) {
      console.error(error)
    }
  }, [supabase])

  useEffect(() => {
    if (!authLoading && user && !isDataLoaded) {
      fetchMasterData()
    }
  }, [authLoading, user, isDataLoaded, fetchMasterData])

  return (
    <MasterDataContext.Provider value={{
      groups,
      types,
      isLoading: !isDataLoaded && !!user,
      refreshMasterData: fetchMasterData
    }}>
      {children}
    </MasterDataContext.Provider>
  )
}

export function useMasterData() {
  const context = useContext(MasterDataContext)
  if (context === undefined) {
    throw new Error('useMasterData must be used within a MasterDataProvider')
  }
  return context
}