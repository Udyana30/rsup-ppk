import { useMasterData } from '@/contexts/master-data-context'

export function useCategories() {
  const { groups, types, isLoading, refreshMasterData } = useMasterData()
  
  return { 
    groups, 
    types, 
    loading: isLoading,
    refresh: refreshMasterData
  }
}