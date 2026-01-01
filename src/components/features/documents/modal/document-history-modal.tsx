'use client'

import { useDocumentActions } from '@/hooks/documents/use-document-actions'
import { useAuth } from '@/hooks/auth/use-auth'
import { HistoryVersion } from '@/hooks/documents/use-document-history'
import { DocumentLog } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import {
  Loader2, RotateCcw, FileText, Calendar, User, Download,
  Trash2, History, Activity, CheckCircle2, Archive
} from 'lucide-react'
import { useState } from 'react'

interface DocumentHistoryModalProps {
  documentId: string
  history: HistoryVersion[]
  logs: DocumentLog[]
  isLoading: boolean
  refresh: () => void
  onSuccess: () => void
}

type TabType = 'versions' | 'logs'

export function DocumentHistoryModal({
  documentId,
  history,
  logs,
  isLoading,
  refresh,
  onSuccess
}: DocumentHistoryModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('versions')
  const { restoreVersion, deleteVersion, isProcessing } = useDocumentActions()
  const { user } = useAuth()

  const [versionToDelete, setVersionToDelete] = useState<string | null>(null)
  const [versionToRestore, setVersionToRestore] = useState<string | null>(null)

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

      <div className="flex-1 overflow-y-auto p-4 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {activeTab === 'versions' ? (
          history.length === 0 ? (
            <EmptyState message="Tidak ada riwayat versi." />
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "group relative rounded-xl border p-3 transition-all hover:shadow-sm",
                  item.status === 'active'
                    ? "border-[#41A67E]/30 bg-[#41A67E]/5"
                    : "border-gray-100 bg-white hover:border-[#41A67E]/30"
                )}
              >
                <div className="flex flex-col gap-2">
                  {/* Bagian Atas: Versi dan Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "h-5 px-2 text-[10px]",
                          item.status === 'active'
                            ? "bg-[#41A67E] text-white border-[#41A67E]"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        )}
                      >
                        Versi {item.version}
                      </Badge>
                      {item.status === 'active' ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-[#41A67E] bg-white px-2 py-0.5 rounded-full border border-[#41A67E]/20">
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                          <Archive className="h-3 w-3" />
                          Archived
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tengah: Nama dan Action Buttons */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-gray-900 line-clamp-1 flex-1" title={item.title}>
                      {item.title}
                    </span>

                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={item.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
                        title="Download File"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </a>

                      {item.status === 'archived' && (
                        <>
                          <button
                            onClick={() => setVersionToRestore(item.id)}
                            className="p-1.5 rounded-lg text-orange-400 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                            title="Restore Versi Ini"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => setVersionToDelete(item.id)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Hapus Versi Ini"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Akhir: Informasi Lainnya */}
                  <div className="flex items-center gap-3 text-[10px] text-gray-500 pt-1 border-t border-gray-100/50 mt-0.5">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {item.updated_at
                          ? new Date(item.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                          : '-'
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{item.uploaded_by_name}</span>
                    </div>
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
    default: return 'bg-gray-400'
  }
}