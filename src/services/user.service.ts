import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

export const userService = {
  async getAllUsers(client: SupabaseClient<Database>) {
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async updateUser(
    client: SupabaseClient<Database>, 
    id: string, 
    data: Database['public']['Tables']['profiles']['Update'] & { is_active?: boolean }
  ) {
    return client
      .from('profiles')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  },

  async deleteUser(client: SupabaseClient<Database>, id: string) {
    return client.from('profiles').delete().eq('id', id)
  }
}