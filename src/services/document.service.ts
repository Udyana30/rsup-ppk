import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

type DocumentInsert = Database['public']['Tables']['ppk_documents']['Insert']
type DocumentUpdate = Database['public']['Tables']['ppk_documents']['Update']

export const documentService = {
  async getDocuments(client: SupabaseClient<Database>) {
    return client
      .from('ppk_documents')
      .select(`
        *,
        medical_staff_groups (name),
        ppk_types (name),
        profiles (full_name)
      `)
      .order('created_at', { ascending: false })
  },

  async getDocumentById(client: SupabaseClient<Database>, id: string) {
    return client
      .from('ppk_documents')
      .select(`
        *,
        medical_staff_groups (name),
        ppk_types (name),
        profiles (full_name)
      `)
      .eq('id', id)
      .single()
  },

  async createDocument(
    client: SupabaseClient<Database>,
    data: DocumentInsert
  ) {
    return client
      .from('ppk_documents')
      .insert(data)
      .select()
      .single()
  },

  async updateDocument(
    client: SupabaseClient<Database>,
    id: string,
    data: DocumentUpdate
  ) {
    return client
      .from('ppk_documents')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  },

  async deleteDocument(client: SupabaseClient<Database>, id: string) {
    return client
      .from('ppk_documents')
      .delete()
      .eq('id', id)
  },

  async archiveDocument(client: SupabaseClient<Database>, id: string) {
    return client
      .from('ppk_documents')
      .update({ is_active: false })
      .eq('id', id)
  },

  async getCategories(client: SupabaseClient<Database>) {
    return Promise.all([
      client
        .from('medical_staff_groups')
        .select('*')
        .eq('is_active', true)
        .order('name'),
      client.from('ppk_types').select('*').order('name'),
    ])
  },
}