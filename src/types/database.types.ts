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
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          is_active?: boolean
          created_at?: string
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
      ppk_types: {
        Row: {
          id: string
          name: string
          code: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          code?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string | null
          created_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: 'admin' | 'user'
          created_at: string
          updated_at: string
          is_active?: boolean
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
          is_active?: boolean
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
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'user'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}