import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'
import { 
  PaginationParams, 
  PaginatedResponse, 
  DocumentFilterParams,
  PpkDocument 
} from '@/types'
import { PAGINATION } from '@/constants/pagination-constants'

type DocumentInsert = Database['public']['Tables']['ppk_documents']['Insert']
type DocumentUpdate = Database['public']['Tables']['ppk_documents']['Update']

export const documentService = {
  async getDocumentsPaginated(
    client: SupabaseClient<Database>,
    pagination: PaginationParams = { 
      page: PAGINATION.DEFAULT_PAGE, 
      pageSize: PAGINATION.PAGE_SIZE 
    },
    filters: DocumentFilterParams = {}
  ): Promise<PaginatedResponse<PpkDocument>> {
    const from = (pagination.page - 1) * pagination.pageSize
    const to = from + pagination.pageSize - 1

    const needsGroupFilter = !!filters.groupId
    const needsTypeFilter = !!filters.typeId
    
    let selectQuery = '*'
    if (needsGroupFilter) {
      selectQuery += ', medical_staff_groups!inner (name, deleted_at)'
    } else {
      selectQuery += ', medical_staff_groups (name)'
    }
    
    if (needsTypeFilter) {
      selectQuery += ', ppk_types!inner (name, deleted_at)'
    } else {
      selectQuery += ', ppk_types (name)'
    }
    
    selectQuery += ', profiles (full_name)'

    let query = client
      .from('ppk_documents')
      .select(selectQuery, { count: 'exact' })

    if (needsGroupFilter && filters.groupId) {
      query = query
        .is('medical_staff_groups.deleted_at', null)
        .eq('medical_staff_groups.name', filters.groupId)
    }
    
    if (needsTypeFilter && filters.typeId) {
      query = query
        .is('ppk_types.deleted_at', null)
        .eq('ppk_types.name', filters.typeId)
    }

    if (filters.search) {
      query = query.ilike('title', `%${filters.search}%`)
    }
    if (filters.status) {
      const isActive = filters.status === 'active'
      query = query.eq('is_active', isActive)
    }
    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate)
    }
    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate)
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    const totalCount = count || 0
    const totalPages = Math.ceil(totalCount / pagination.pageSize)

    return {
      data: (data || []) as unknown as PpkDocument[],
      pagination: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalCount,
        totalPages,
        hasNextPage: pagination.page < totalPages,
        hasPreviousPage: pagination.page > 1,
      },
    }
  },

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