import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { documentService } from '@/services/document.service'
import { storageService } from '@/services/storage.service'
import { PpkDocument } from '@/types'

export function useDocumentActions() {
  const [isProcessing, setIsProcessing] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const editMetadata = async (
    id: string, 
    data: any, 
    newFile: File | null
  ) => {
    setIsProcessing(true)
    try {
      let fileData = {}
      if (newFile) {
        const uploadRes = await storageService.uploadFile(newFile)
        fileData = {
          file_url: uploadRes.secure_url,
          cloudinary_public_id: uploadRes.public_id
        }
      }

      const { error } = await documentService.updateDocument(supabase, id, {
        ...data,
        ...fileData
      })

      if (error) throw error
      router.refresh()
      return true
    } catch (error) {
      console.error(error)
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  const createNewVersion = async (
    oldDoc: PpkDocument, 
    newData: any, 
    newFile: File | null
  ) => {
    setIsProcessing(true)
    try {
      let fileUrl = oldDoc.file_url
      let publicId = oldDoc.cloudinary_public_id

      if (newFile) {
        const uploadRes = await storageService.uploadFile(newFile)
        fileUrl = uploadRes.secure_url
        publicId = uploadRes.public_id
      }

      const nextVersion = String(Number(oldDoc.version || '1') + 1)

      const { error: createError } = await documentService.createDocument(supabase, {
        ...newData,
        title: newData.title || oldDoc.title,
        group_id: newData.group_id || oldDoc.group_id,
        type_id: newData.type_id || oldDoc.type_id,
        uploaded_by: newData.uploaded_by,
        version: nextVersion,
        is_active: true,
        file_url: fileUrl,
        cloudinary_public_id: publicId
      })

      if (createError) throw createError

      await documentService.archiveDocument(supabase, oldDoc.id)

      router.refresh()
      return true
    } catch (error) {
      console.error(error)
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  return { editMetadata, createNewVersion, isProcessing }
}