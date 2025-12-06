import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

type LoginCredentials = {
  email: string
  password: string
}

export const authService = {
  async signIn(client: SupabaseClient<Database>, { email, password }: LoginCredentials) {
    return client.auth.signInWithPassword({
      email,
      password,
    })
  },

  async signOut(client: SupabaseClient<Database>) {
    return client.auth.signOut()
  },

  async getSession(client: SupabaseClient<Database>) {
    return client.auth.getSession()
  },

  async getUser(client: SupabaseClient<Database>) {
    return client.auth.getUser()
  },
}