import { useAuthContext } from '@/contexts/auth-context'

export function useAuth() {
  const { user, profile, isLoading, signOut } = useAuthContext()
  
  return { 
    user, 
    profile, 
    loading: isLoading, 
    signOut 
  }
}