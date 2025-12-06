import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { documentService } from '@/services/document.service'
import { PpkDocument } from '@/types'

export function useDocuments() {
  const [documents, setDocuments] = useState<PpkDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchDocuments = useCallback(async () => {
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
  }, [supabase])

  const deleteDocument = async (id: string) => {
    try {
      const { error } = await documentService.deleteDocument(supabase, id)
      if (error) throw error
      setDocuments((prev) => prev.filter((doc) => doc.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document')
      throw err
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  return { documents, loading, error, refetch: fetchDocuments, deleteDocument }
}