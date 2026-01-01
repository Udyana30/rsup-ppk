import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'
import { 
  PaginationParams, 
  PaginatedResponse, 
  UserFilterParams,
  Profile 
} from '@/types'
import { PAGINATION } from '@/constants/pagination-constants'

export const userService = {
  /**
   * Mengambil users dengan pagination dan filtering (Server-Side)
   * @param client - Supabase client instance
   * @param pagination - Parameter pagination (page, pageSize)
   * @param filters - Parameter filter opsional
   * @returns PaginatedResponse dengan data user dan metadata pagination
   */
  async getUsersPaginated(
    client: SupabaseClient<Database>,
    pagination: PaginationParams = { 
      page: PAGINATION.DEFAULT_PAGE, 
      pageSize: PAGINATION.PAGE_SIZE 
    },
    filters: UserFilterParams = {}
  ): Promise<PaginatedResponse<Profile>> {
    // Hitung offset untuk pagination
    const from = (pagination.page - 1) * pagination.pageSize
    const to = from + pagination.pageSize - 1

    // Build query
    let query = client
      .from('profiles')
      .select('*', { count: 'exact' })

    // Apply filters
    if (filters.search) {
      query = query.or(`full_name.ilike.%${filters.search}%,username.ilike.%${filters.search}%`)
    }
    if (filters.role && (filters.role === 'admin' || filters.role === 'user')) {
      query = query.eq('role', filters.role as 'admin' | 'user')
    }
    if (filters.status) {
      const isActive = filters.status === 'active'
      query = query.eq('is_active', isActive)
    }

    // Apply ordering dan pagination
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    const totalCount = count || 0
    const totalPages = Math.ceil(totalCount / pagination.pageSize)

    return {
      data: (data || []) as Profile[],
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

  /**
   * Method legacy untuk backward compatibility
   * @deprecated Gunakan getUsersPaginated() untuk performa lebih baik
   */
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