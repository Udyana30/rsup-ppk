import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { authService } from '@/services/auth.service'
import { formatUsernameToEmail } from '@/lib/auth-helpers'
import { useToast } from '@/contexts/toast-context'

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    const emailPayload = formatUsernameToEmail(username)

    try {
      const { data: authData, error: authError } = await authService.signIn(supabase, { 
        email: emailPayload, 
        password 
      })
      
      if (authError || !authData.user) {
        throw new Error('Username atau Password salah')
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, is_super_admin')
        .eq('id', authData.user.id)
        .single()

      if (profileError) {
        await supabase.auth.signOut()
        throw new Error('Gagal memverifikasi profil pengguna')
      }

      if (profile?.role !== 'admin' && !profile?.is_super_admin) {
        await supabase.auth.signOut()
        throw new Error('Akses ditolak. Website ini khusus untuk Administrator.')
      }

      toast({
        title: 'Login Berhasil',
        message: 'Selamat datang di Dashboard Admin',
        type: 'success'
      })

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat login'
      setError(message)
      
      if (message !== 'Username atau Password salah') {
        await supabase.auth.signOut()
      }

      toast({
        title: 'Login Gagal',
        message: message,
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return { handleLogin, isLoading, error }
}