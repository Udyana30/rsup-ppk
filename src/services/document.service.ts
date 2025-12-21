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
        ppk_types (name, code),
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
        ppk_types (name, code),
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
      .order('version', { ascending: false })
  },

  async getDocumentLogs(client: SupabaseClient<Database>, documentId: string) {
    return client
      .from('ppk_document_logs')
      .select(`
        *,
        profiles:user_id (full_name)
      `)
      .eq('document_id', documentId)
      .order('created_at', { ascending: false })
  },

  async getNextVersionNumber(client: SupabaseClient<Database>, documentId: string) {
    const { data: active } = await client
      .from('ppk_documents')
      .select('version')
      .eq('id', documentId)
      .single()

    const { data: history } = await client
      .from('ppk_document_versions')
      .select('version')
      .eq('document_id', documentId)

    const activeVer = active?.version ? parseInt(active.version) : 0
    
    const historyMax = history?.reduce((max, item) => {
      const v = parseInt(item.version)
      return isNaN(v) ? max : Math.max(max, v)
    }, 0) || 0
    
    const nextVer = Math.max(activeVer, historyMax) + 1
    
    return String(nextVer)
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
      body: JSON.stringify({ documentId: id }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (error) throw error

    return data
  },

  async deleteVersion(client: SupabaseClient<Database>, versionId: string) {
    return client
      .from('ppk_document_versions')
      .delete()
      .eq('id', versionId)
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