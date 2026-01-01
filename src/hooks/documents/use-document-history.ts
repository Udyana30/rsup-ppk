import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { documentService } from '@/services/document.service'
import { DocumentVersion, DocumentLog, PpkDocument } from '@/types'

export type HistoryVersion = {
  id: string
  version: string
  title: string
  file_url: string
  updated_at: string
  archived_at: string | null
  uploaded_by_name: string
  status: 'active' | 'archived'
  original_data: DocumentVersion | PpkDocument
}

export function useDocumentHistory(documentId: string) {
  const [history, setHistory] = useState<HistoryVersion[]>([])
  const [logs, setLogs] = useState<DocumentLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [activeRes, versionsRes, logsRes] = await Promise.all([
        documentService.getDocumentById(supabase, documentId),
        documentService.getDocumentVersions(supabase, documentId),
        documentService.getDocumentLogs(supabase, documentId)
      ])

      if (activeRes.error) throw activeRes.error
      if (versionsRes.error) throw versionsRes.error
      if (logsRes.error) throw logsRes.error

      const activeDoc = activeRes.data as PpkDocument
      const archivedVersions = versionsRes.data as unknown as DocumentVersion[]

      // Transform active document to HistoryVersion
      const activeHistoryItem: HistoryVersion = {
        id: activeDoc.id,
        version: activeDoc.version || '1',
        title: activeDoc.title,
        file_url: activeDoc.file_url,
        updated_at: activeDoc.updated_at,
        archived_at: null,
        uploaded_by_name: activeDoc.profiles?.full_name || 'System',
        status: 'active',
        original_data: activeDoc
      }

      // Transform archived versions to HistoryVersion
      const archivedHistoryItems: HistoryVersion[] = archivedVersions.map(v => ({
        id: v.id,
        version: v.version,
        title: v.title,
        file_url: v.file_url,
        updated_at: v.archived_at,
        archived_at: v.archived_at,
        uploaded_by_name: v.profiles?.full_name || 'System',
        status: 'archived',
        original_data: v
      }))

      // Filter out archived versions that match the active version to avoid duplicates
      const filteredArchivedItems = archivedHistoryItems.filter(
        item => item.version !== activeHistoryItem.version
      )

      // Combine and sort by version number descending
      const allHistory = [activeHistoryItem, ...filteredArchivedItems].sort((a, b) => {
        const verA = parseFloat(a.version)
        const verB = parseFloat(b.version)
        return verB - verA
      })

      setHistory(allHistory)
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

  return { history, logs, isLoading, refresh: fetchData }
}