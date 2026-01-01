import { Database } from './database.types'

export type MedicalStaffGroup = Database['public']['Tables']['medical_staff_groups']['Row']
export type PpkType = Database['public']['Tables']['ppk_types']['Row']

export type MedicalStaffGroupInsert = Database['public']['Tables']['medical_staff_groups']['Insert']
export type MedicalStaffGroupUpdate = Database['public']['Tables']['medical_staff_groups']['Update']

export type PpkTypeInsert = Database['public']['Tables']['ppk_types']['Insert']
export type PpkTypeUpdate = Database['public']['Tables']['ppk_types']['Update']

export type Profile = Database['public']['Tables']['profiles']['Row'] & {
  email?: string
}

export type PpkDocument = Database['public']['Tables']['ppk_documents']['Row'] & {
  medical_staff_groups?: Pick<MedicalStaffGroup, 'name'> | null
  ppk_types?: Pick<PpkType, 'name'> | null
  profiles?: Pick<Profile, 'full_name'> | null
}

export type DocumentVersion = Database['public']['Tables']['ppk_document_versions']['Row'] & {
  profiles?: Pick<Profile, 'full_name'> | null
}

export type DocumentLog = Database['public']['Tables']['ppk_document_logs']['Row'] & {
  profiles?: Pick<Profile, 'full_name'> | null
}

export interface SidebarItem {
  title: string
  href: string
  icon?: React.ElementType
  roles?: ('admin' | 'user')[]
  children?: SidebarItem[]
}

export interface UploadResponse {
  secure_url: string
  public_id: string
  format: string
  bytes: number
}

/**
 * Parameter untuk pagination request
 */
export interface PaginationParams {
  page: number
  pageSize: number
}

/**
 * Response wrapper untuk data yang di-paginate
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

/**
 * Parameter filter untuk dokumen
 */
export interface DocumentFilterParams {
  search?: string
  groupId?: string
  typeId?: string
  status?: string
  startDate?: string
  endDate?: string
}

/**
 * Parameter filter untuk user
 */
export interface UserFilterParams {
  search?: string
  role?: string
  status?: string
}