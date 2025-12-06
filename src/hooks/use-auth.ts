import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { authService } from '@/services/auth.service'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await authService.getSession(supabase)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      if (!session) router.push('/login')
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  const signOut = async () => {
    await authService.signOut(supabase)
    router.push('/login')
  }

  return { user, loading, signOut }
}