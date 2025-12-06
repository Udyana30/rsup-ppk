import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { ENV } from '@/constants/config'
import { Database } from '@/types/database.types'

export const createClient = async () => {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    ENV.SUPABASE_URL,
    ENV.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
          }
        },
      },
    }
  )
}