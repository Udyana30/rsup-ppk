import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { documentService } from '@/services/document.service'
import { storageService } from '@/services/storage.service'
import { PpkDocument } from '@/types'
import { useToast } from '@/contexts/toast-context'

export function useDocumentActions() {
  const [isProcessing, setIsProcessing] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  const editMetadata = async (id: string, data: any, newFile: File | null) => {
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
      
      toast({ title: 'Berhasil', message: 'Metadata dokumen diperbarui', type: 'success' })
      return true
    } catch (error) {
      console.error(error)
      toast({ title: 'Gagal', message: 'Gagal memperbarui dokumen', type: 'error' })
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  const createNewVersion = async (oldDoc: PpkDocument, newData: any, newFile: File | null) => {
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

      const { error } = await supabase.rpc('update_document_version', {
        p_document_id: oldDoc.id,
        p_user_id: newData.uploaded_by,
        p_new_title: newData.title || oldDoc.title,
        p_new_file_url: fileUrl,
        p_new_public_id: publicId || '',
        p_new_version: nextVersion,
        p_new_description: newData.description || '',
        p_new_validation_date: newData.validation_date,
        p_change_log: 'Pembaruan versi dokumen'
      })

      if (error) throw error

      router.refresh()
      toast({ title: 'Berhasil', message: `Versi ${nextVersion} diterbitkan`, type: 'success' })
      return true
    } catch (error) {
      console.error(error)
      toast({ title: 'Gagal', message: 'Gagal update versi', type: 'error' })
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  const restoreVersion = async (documentId: string, versionId: string, userId: string) => {
    setIsProcessing(true)
    try {
      const { error } = await documentService.restoreVersion(supabase, documentId, versionId, userId)
      if (error) throw error
      
      router.refresh()
      toast({ title: 'Berhasil', message: 'Versi dokumen dipulihkan', type: 'success' })
      return true
    } catch (error) {
      console.error(error)
      toast({ title: 'Gagal', message: 'Gagal restore versi', type: 'error' })
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  const deleteDocument = async (documentId: string) => {
    setIsProcessing(true)
    try {
      await documentService.deleteDocument(supabase, documentId)
      
      toast({ title: 'Berhasil', message: 'Dokumen dihapus permanen', type: 'success' })
      return true
    } catch (error) {
      console.error(error)
      toast({ title: 'Gagal', message: 'Gagal menghapus dokumen', type: 'error' })
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  return { editMetadata, createNewVersion, restoreVersion, deleteDocument, isProcessing }
}