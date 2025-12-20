export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      medical_staff_groups: {
        Row: {
          id: string
          name: string
          description: string | null
          is_active: boolean
          created_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          deleted_at?: string | null
        }
        Relationships: []
      }
      ppk_documents: {
        Row: {
          id: string
          title: string
          group_id: string | null
          type_id: string | null
          cloudinary_public_id: string | null
          file_url: string
          version: string | null
          is_active: boolean
          uploaded_by: string | null
          created_at: string
          updated_at: string
          validation_date: string | null
          description: string | null
        }
        Insert: {
          id?: string
          title: string
          group_id?: string | null
          type_id?: string | null
          cloudinary_public_id?: string | null
          file_url: string
          version?: string | null
          is_active?: boolean
          uploaded_by?: string | null
          created_at?: string
          updated_at?: string
          validation_date?: string | null
          description?: string | null
        }
        Update: {
          id?: string
          title?: string
          group_id?: string | null
          type_id?: string | null
          cloudinary_public_id?: string | null
          file_url?: string
          version?: string | null
          is_active?: boolean
          uploaded_by?: string | null
          created_at?: string
          updated_at?: string
          validation_date?: string | null
          description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ppk_documents_group_id_fkey"
            columns: ["group_id"]
            referencedRelation: "medical_staff_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ppk_documents_type_id_fkey"
            columns: ["type_id"]
            referencedRelation: "ppk_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ppk_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      ppk_document_versions: {
        Row: {
          id: string
          document_id: string
          title: string
          group_id: string | null
          type_id: string | null
          file_url: string
          cloudinary_public_id: string | null
          version: string
          description: string | null
          validation_date: string | null
          archived_at: string
          archived_by: string | null
        }
        Insert: {
          id?: string
          document_id: string
          title: string
          group_id?: string | null
          type_id?: string | null
          file_url: string
          cloudinary_public_id?: string | null
          version: string
          description?: string | null
          validation_date?: string | null
          archived_at?: string
          archived_by?: string | null
        }
        Update: {
          id?: string
          document_id?: string
          title?: string
          group_id?: string | null
          type_id?: string | null
          file_url?: string
          cloudinary_public_id?: string | null
          version?: string
          description?: string | null
          validation_date?: string | null
          archived_at?: string
          archived_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ppk_document_versions_document_id_fkey"
            columns: ["document_id"]
            referencedRelation: "ppk_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ppk_document_versions_archived_by_fkey"
            columns: ["archived_by"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      ppk_document_logs: {
        Row: {
          id: string
          document_id: string
          user_id: string | null
          action_type: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          user_id?: string | null
          action_type: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          user_id?: string | null
          action_type?: string
          description?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ppk_document_logs_document_id_fkey"
            columns: ["document_id"]
            referencedRelation: "ppk_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ppk_document_logs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      ppk_types: {
        Row: {
          id: string
          name: string
          code: string | null
          created_at: string
          is_active: boolean
          deleted_at: string | null
        }
        Insert: {
          id?: string
          name: string
          code?: string | null
          created_at?: string
          is_active?: boolean
          deleted_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          code?: string | null
          created_at?: string
          is_active?: boolean
          deleted_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          username: string | null
          role: 'admin' | 'user'
          created_at: string
          updated_at: string
          is_active: boolean
          is_super_admin: boolean
        }
        Insert: {
          id: string
          full_name?: string | null
          username?: string | null
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
          is_active?: boolean
          is_super_admin?: boolean
        }
        Update: {
          id?: string
          full_name?: string | null
          username?: string | null
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
          is_active?: boolean
          is_super_admin?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_document_version: {
        Args: {
          p_document_id: string
          p_user_id: string
          p_new_title: string
          p_new_file_url: string
          p_new_public_id: string
          p_new_version: string
          p_new_description: string
          p_new_validation_date: string
          p_new_group_id: string
          p_new_type_id: string
          p_new_is_active: boolean
          p_change_log: string
        }
        Returns: void
      }
      restore_document_version: {
        Args: {
          p_document_id: string
          p_version_id: string
          p_user_id: string
        }
        Returns: void
      }
    }
    Enums: {
      user_role: 'admin' | 'user'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}