import { createBrowserClient } from '@supabase/ssr'
import { ENV } from '@/constants/config'
import { Database } from '@/types/database.types'

let client: ReturnType<typeof createBrowserClient<Database>> | undefined

export const createClient = () => {
  if (!client) {
    client = createBrowserClient<Database>(
      ENV.SUPABASE_URL,
      ENV.SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        }
      }
    )
  }

  return client
}