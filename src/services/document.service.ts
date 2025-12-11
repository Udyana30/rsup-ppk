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

  async getDocumentVersions(client: SupabaseClient<Database>, documentId: string) {
    return client
      .from('ppk_document_versions')
      .select(`
        *,
        profiles:archived_by (full_name)
      `)
      .eq('document_id', documentId)
      .order('archived_at', { ascending: false })
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
    const { data, error } = await client.functions.invoke('delete-document', {
      body: { documentId: id }
    })

    if (error) throw error
    return data
  },

  async restoreVersion(
    client: SupabaseClient<Database>, 
    documentId: string, 
    versionId: string,
    userId: string
  ) {
    return client.rpc('restore_document_version', {
      p_document_id: documentId,
      p_version_id: versionId,
      p_user_id: userId
    })
  }
}