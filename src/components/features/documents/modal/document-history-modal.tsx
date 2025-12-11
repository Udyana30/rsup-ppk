'use client'

import { useDocumentHistory } from '@/hooks/use-document-history'
import { useDocumentActions } from '@/hooks/use-document-actions'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, RotateCcw, FileText, Calendar, User, Download, Clock } from 'lucide-react'

interface DocumentHistoryModalProps {
  documentId: string
  onSuccess: () => void
}

export function DocumentHistoryModal({ documentId, onSuccess }: DocumentHistoryModalProps) {
  const { versions, isLoading, refresh } = useDocumentHistory(documentId)
  const { restoreVersion, isProcessing } = useDocumentActions()
  const { user } = useAuth()

  const handleRestore = async (versionId: string) => {
    if (!user) return
    if (confirm('Apakah Anda yakin ingin mengembalikan ke versi ini? Versi saat ini akan diarsipkan.')) {
      const success = await restoreVersion(documentId, versionId, user.id)
      if (success) {
        refresh()
        onSuccess()
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#41A67E]" />
      </div>
    )
  }

  if (versions.length === 0) {
    return (
      <div className="flex h-60 flex-col items-center justify-center text-center text-gray-500">
        <Clock className="mb-2 h-10 w-10 text-gray-300" />
        <p>Belum ada riwayat versi untuk dokumen ini.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
        <p className="font-semibold">Riwayat Revisi</p>
        <p>Anda dapat melihat arsip dokumen lama atau mengembalikannya menjadi versi aktif.</p>
      </div>

      <div className="max-h-[500px] space-y-3 overflow-y-auto pr-2">
        {versions.map((ver) => (
          <div key={ver.id} className="relative rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-[#41A67E]/50 hover:shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-gray-700">v{ver.version}</Badge>
                  <span className="text-sm font-bold text-gray-900 line-clamp-1">{ver.title}</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Diarsipkan: {new Date(ver.archived_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>Oleh: {ver.profiles?.full_name || 'Unknown'}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                 <a 
                    href={ver.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                    title="Download File"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleRestore(ver.id)}
                    disabled={isProcessing}
                    className="gap-2 border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800"
                  >
                    {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
                    Restore
                  </Button>
              </div>
            </div>
            
            {ver.change_log && (
              <div className="mt-3 rounded-lg bg-gray-50 p-2 text-xs text-gray-600">
                <span className="font-semibold">Catatan:</span> {ver.change_log}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}