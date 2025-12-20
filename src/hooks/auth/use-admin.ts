import { useAuth } from '@/hooks/auth/use-auth'

export function useAdmin() {
  const { profile, loading } = useAuth()
  
  const isAdmin = 
    profile?.role === 'admin' || 
    profile?.is_super_admin === true

  return { 
    isAdmin,
    isLoading: loading 
  }
}