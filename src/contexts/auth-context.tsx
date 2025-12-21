'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const mounted = useRef(false)
  const lastCheckTime = useRef(0)

  const router = useRouter()
  const supabase = createClient()

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) return null
      return data
    } catch {
      return null
    }
  }, [supabase])

  const handleSession = useCallback(async (session: Session | null) => {
    if (!mounted.current) return

    if (session?.user) {
      setUser(session.user)

      setProfile(prev => {
        if (prev?.id === session.user.id) return prev
        fetchProfile(session.user.id).then(data => {
          if (mounted.current && data) setProfile(data)
        })
        return prev
      })
    } else {
      setUser(null)
      setProfile(null)
    }

    setIsLoading(false)
  }, [fetchProfile])

  const checkSession = useCallback(async () => {
    const now = Date.now()
    if (now - lastCheckTime.current < 5000) return

    lastCheckTime.current = now

    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
      if (user) {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()

        if (refreshError || !refreshData.session) {
          await supabase.auth.signOut()
          handleSession(null)
          router.replace('/login')
        } else {
          handleSession(refreshData.session)
        }
      }
    } else {
      if (session.user.id !== user?.id) {
        handleSession(session)
      }
    }
  }, [supabase, user, router, handleSession])

  useEffect(() => {
    mounted.current = true

    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      await handleSession(session)
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        handleSession(null)
        router.refresh()
        router.replace('/login')
      } else if (session) {
        handleSession(session)
      }
    })

    return () => {
      mounted.current = false
      subscription.unsubscribe()
    }
  }, [supabase, router, handleSession])

  useEffect(() => {
    const handleFocus = () => {
      if (!isLoading && document.visibilityState === 'visible') {
        checkSession()
      }
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('visibilitychange', handleFocus)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('visibilitychange', handleFocus)
    }
  }, [checkSession, isLoading])

  const signOut = async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error(error)
    } finally {
      if (mounted.current) {
        handleSession(null)
        router.refresh()
        router.replace('/login')
      }
    }
  }

  const refreshSession = async () => {
    lastCheckTime.current = 0
    await checkSession()
  }

  const refreshProfile = async () => {
    if (user) {
      const data = await fetchProfile(user.id)
      if (mounted.current && data) setProfile(data)
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, signOut, refreshSession, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}