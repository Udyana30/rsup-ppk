import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { documentService } from '@/services/document.service'
import { PpkDocument } from '@/types'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/contexts/toast-context'

export function useDocuments() {
  const [documents, setDocuments] = useState<PpkDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { user, loading: authLoading } = useAuth()
  const supabase = createClient()
  const { toast } = useToast()

  const fetchDocuments = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await documentService.getDocuments(supabase)
      if (error) throw error
      setDocuments(data as unknown as PpkDocument[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch documents')
    } finally {
      setLoading(false)
    }
  }, [supabase, user])

  const deleteDocument = async (id: string) => {
    try {
      await documentService.deleteDocument(supabase, id)
      setDocuments((prev) => prev.filter((doc) => doc.id !== id))
      
      toast({
        title: 'Berhasil',
        message: 'Dokumen berhasil dihapus',
        type: 'success'
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete document'
      setError(message)
      
      toast({
        title: 'Gagal',
        message: 'Gagal menghapus dokumen',
        type: 'error'
      })
      throw err
    }
  }

  useEffect(() => {
    if (authLoading) return 
    
    if (user) {
      fetchDocuments()
    } else {
      setLoading(false) 
    }
  }, [fetchDocuments, authLoading, user])

  return { documents, loading: loading || authLoading, error, refetch: fetchDocuments, deleteDocument }
}