'use client'

import { useState } from 'react'
import { useDocumentHistory } from '@/hooks/documents/use-document-history'
import { useDocumentActions } from '@/hooks/documents/use-document-actions'
import { useAuth } from '@/hooks/auth/use-auth'
import { Badge } from '@/components/ui/badge'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { 
  Loader2, RotateCcw, FileText, Calendar, User, Download, 
  Trash2, History, Activity 
} from 'lucide-react'

interface DocumentHistoryModalProps {
  documentId: string
  currentVersion: string
  onSuccess: () => void
}

type TabType = 'versions' | 'logs'

export function DocumentHistoryModal({ documentId, currentVersion, onSuccess }: DocumentHistoryModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('versions')
  const { versions, logs, isLoading, refresh } = useDocumentHistory(documentId)
  const { restoreVersion, deleteVersion, isProcessing } = useDocumentActions()
  const { user } = useAuth()
  
  const [versionToDelete, setVersionToDelete] = useState<string | null>(null)
  const [versionToRestore, setVersionToRestore] = useState<string | null>(null)

  const filteredVersions = versions.filter(v => v.version !== currentVersion)

  const handleRestoreConfirm = async () => {
    if (!user || !versionToRestore) return
    const success = await restoreVersion(documentId, versionToRestore, user.id)
    if (success) {
      refresh()
      onSuccess()
      setVersionToRestore(null)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!versionToDelete) return
    const success = await deleteVersion(versionToDelete)
    if (success) {
      refresh()
      setVersionToDelete(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#41A67E]" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('versions')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all relative",
            activeTab === 'versions' 
              ? "text-[#41A67E]" 
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <History className="h-4 w-4" />
          Versi Dokumen
          {activeTab === 'versions' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#41A67E]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all relative",
            activeTab === 'logs' 
              ? "text-[#41A67E]" 
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Activity className="h-4 w-4" />
          Log Aktivitas
          {activeTab === 'logs' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#41A67E]" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeTab === 'versions' ? (
          filteredVersions.length === 0 ? (
            <EmptyState message="Tidak ada versi arsip lainnya." />
          ) : (
            filteredVersions.map((ver) => (
              <div key={ver.id} className="group relative rounded-xl border border-gray-100 bg-white p-4 transition-all hover:border-[#41A67E]/30 hover:shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                        Versi {ver.version}
                      </Badge>
                      <span className="text-sm font-medium text-gray-900">{ver.title}</span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(ver.archived_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        <span>{ver.profiles?.full_name || 'System'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <a
                      href={ver.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
                      title="Download File"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                    
                    <button
                      onClick={() => setVersionToRestore(ver.id)}
                      className="p-2 rounded-lg text-orange-400 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      title="Restore Versi Ini"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => setVersionToDelete(ver.id)}
                      className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Hapus Versi Ini"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )
        ) : (
          logs.length === 0 ? (
            <EmptyState message="Belum ada catatan aktivitas." />
          ) : (
            <div className="relative border-l border-gray-200 ml-4 space-y-6 py-2">
              {logs.map((log) => (
                <div key={log.id} className="relative pl-6">
                  <div className={cn(
                    "absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-white",
                    getActionColor(log.action_type)
                  )} />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-900">
                      {log.description}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{new Date(log.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span>{log.profiles?.full_name || 'System'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      <AlertDialog
        isOpen={!!versionToDelete}
        title="Hapus Versi Arsip"
        description="Apakah Anda yakin ingin menghapus versi ini secara permanen? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus Permanen"
        variant="destructive"
        isProcessing={isProcessing}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setVersionToDelete(null)}
      />

      <AlertDialog
        isOpen={!!versionToRestore}
        title="Restore Versi"
        description="Dokumen aktif saat ini akan diarsipkan, dan versi yang dipilih akan menjadi aktif. Lanjutkan?"
        confirmLabel="Ya, Restore"
        variant="default"
        isProcessing={isProcessing}
        onConfirm={handleRestoreConfirm}
        onCancel={() => setVersionToRestore(null)}
      />
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
      <FileText className="mb-3 h-10 w-10 text-gray-200" />
      <p className="text-sm">{message}</p>
    </div>
  )
}

function getActionColor(action: string) {
  switch (action) {
    case 'RESTORE': return 'bg-orange-500'
    case 'UPDATE_VERSION': return 'bg-blue-500'
    case 'CREATE': return 'bg-green-500'
    case 'DELETE_VERSION': return 'bg-red-500'
    default: return 'bg-gray-400'
  }
}