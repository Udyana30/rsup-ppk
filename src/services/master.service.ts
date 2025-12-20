import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'
import { 
  MedicalStaffGroupInsert, 
  MedicalStaffGroupUpdate, 
  PpkTypeInsert, 
  PpkTypeUpdate 
} from '@/types'

export const masterService = {
  // Groups
  async getGroups(client: SupabaseClient<Database>) {
    return client
      .from('medical_staff_groups')
      .select('*')
      .is('deleted_at', null)
      .order('name', { ascending: true })
  },

  async createGroup(client: SupabaseClient<Database>, data: MedicalStaffGroupInsert) {
    return client
      .from('medical_staff_groups')
      .insert(data)
      .select()
      .single()
  },

  async updateGroup(client: SupabaseClient<Database>, id: string, data: MedicalStaffGroupUpdate) {
    return client
      .from('medical_staff_groups')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  },

  async deleteGroup(client: SupabaseClient<Database>, id: string) {
    return client
      .from('medical_staff_groups')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
  },

  // Types
  async getTypes(client: SupabaseClient<Database>) {
    return client
      .from('ppk_types')
      .select('*')
      .is('deleted_at', null)
      .order('name', { ascending: true })
  },

  async createType(client: SupabaseClient<Database>, data: PpkTypeInsert) {
    return client
      .from('ppk_types')
      .insert(data)
      .select()
      .single()
  },

  async updateType(client: SupabaseClient<Database>, id: string, data: PpkTypeUpdate) {
    return client
      .from('ppk_types')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  },

  async deleteType(client: SupabaseClient<Database>, id: string) {
    return client
      .from('ppk_types')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
  }
}