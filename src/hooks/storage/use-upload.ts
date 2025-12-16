import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { storageService } from '@/services/storage.service'
import { documentService } from '@/services/document.service'
import { Database } from '@/types/database.types'

type InsertDto = Database['public']['Tables']['ppk_documents']['Insert']

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const uploadDocument = async (file: File, metadata: Omit<InsertDto, 'file_url' | 'cloudinary_public_id'>) => {
    setIsUploading(true)
    setError(null)

    try {
      const uploadRes = await storageService.uploadFile(file)
      
      const { error: dbError } = await documentService.createDocument(supabase, {
        ...metadata,
        file_url: uploadRes.secure_url,
        cloudinary_public_id: uploadRes.public_id,
      })

      if (dbError) throw dbError

      router.push('/dashboard/documents')
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed'
      setError(message)
      throw err
    } finally {
      setIsUploading(false)
    }
  }

  return { uploadDocument, isUploading, error }
}