import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { documentService } from '@/services/document.service'
import { DocumentVersion } from '@/types'

export function useDocumentHistory(documentId: string) {
  const [versions, setVersions] = useState<DocumentVersion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const fetchVersions = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data, error } = await documentService.getDocumentVersions(supabase, documentId)
      if (error) throw error
      setVersions(data as unknown as DocumentVersion[])
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [documentId, supabase])

  useEffect(() => {
    fetchVersions()
  }, [fetchVersions])

  return { versions, isLoading, refresh: fetchVersions }
}