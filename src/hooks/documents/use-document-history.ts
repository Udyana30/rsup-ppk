import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { documentService } from '@/services/document.service'
import { DocumentVersion, DocumentLog } from '@/types'

export function useDocumentHistory(documentId: string) {
  const [versions, setVersions] = useState<DocumentVersion[]>([])
  const [logs, setLogs] = useState<DocumentLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [versionsRes, logsRes] = await Promise.all([
        documentService.getDocumentVersions(supabase, documentId),
        documentService.getDocumentLogs(supabase, documentId)
      ])

      if (versionsRes.error) throw versionsRes.error
      if (logsRes.error) throw logsRes.error

      setVersions(versionsRes.data as unknown as DocumentVersion[])
      setLogs(logsRes.data as unknown as DocumentLog[])
    } catch (error) {
      console.error("Error fetching history:", error)
    } finally {
      setIsLoading(false)
    }
  }, [documentId, supabase])

  useEffect(() => {
    if (documentId) {
        fetchData()
    }
  }, [fetchData, documentId])

  return { versions, logs, isLoading, refresh: fetchData }
}