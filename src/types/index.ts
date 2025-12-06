import { Database } from './database.types'

export type MedicalStaffGroup = Database['public']['Tables']['medical_staff_groups']['Row']
export type PpkType = Database['public']['Tables']['ppk_types']['Row']

export type Profile = Database['public']['Tables']['profiles']['Row'] & {
  email?: string
  is_active?: boolean
  is_super_admin?: boolean
}

export type PpkDocument = Database['public']['Tables']['ppk_documents']['Row'] & {
  medical_staff_groups?: Pick<MedicalStaffGroup, 'name'> | null
  ppk_types?: Pick<PpkType, 'name'> | null
  profiles?: Pick<Profile, 'full_name'> | null
}

export interface SidebarItem {
  title: string
  href: string
  icon?: React.ElementType
  roles?: ('admin' | 'user')[]
}

export interface UploadResponse {
  secure_url: string
  public_id: string
  format: string
  bytes: number
}