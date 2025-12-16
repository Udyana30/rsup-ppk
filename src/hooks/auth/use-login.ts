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
      const { error } = await authService.signIn(supabase, { 
        email: emailPayload, 
        password 
      })
      
      if (error) {
        throw new Error('Username atau Password salah')
      }

      toast({
        title: 'Login Berhasil',
        message: 'Selamat datang kembali di sistem PPK',
        type: 'success'
      })

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat login'
      setError(message)
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