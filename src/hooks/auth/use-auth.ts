import { useAuthContext } from '@/contexts/auth-context'

export function useAuth() {
  const { user, profile, isLoading, signOut, refreshProfile } = useAuthContext()
  
  return { 
    user, 
    profile, 
    loading: isLoading, 
    signOut,
    refreshProfile
  }
}