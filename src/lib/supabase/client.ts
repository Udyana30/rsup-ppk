import { createBrowserClient } from '@supabase/ssr'
import { ENV } from '@/constants/config'
import { Database } from '@/types/database.types'

export const createClient = () =>
  createBrowserClient<Database>(
    ENV.SUPABASE_URL,
    ENV.SUPABASE_ANON_KEY
  )