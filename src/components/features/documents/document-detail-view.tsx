'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { documentService } from '@/services/document.service'
import { PpkDocument } from '@/types'
import { useDocumentActions } from '@/hooks/documents/use-document-actions'
import { useDocumentHistory } from '@/hooks/documents/use-document-history'
import { useAdmin } from '@/hooks/auth/use-admin'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { EditDocumentModal } from '@/components/features/documents/modal/edit-document-modal'
import { DocumentHistoryModal } from '@/components/features/documents/modal/document-history-modal'
import {
  ArrowLeft, Calendar, FileText, User, Tag,
  Pencil, Trash2, AlertCircle, Loader2, GitBranch, FileClock, ExternalLink
} from 'lucide-react'

interface DocumentDetailViewProps {
  documentId: string
  initialDocument: PpkDocument | null
}

export function DocumentDetailView({ documentId, initialDocument }: DocumentDetailViewProps) {
  const router = useRouter()
  const supabase = createClient()
  const { deleteDocument, isProcessing } = useDocumentActions()
  const { isAdmin, isLoading: isAdminLoading } = useAdmin()

  const { history, logs, isLoading: isHistoryLoading, refresh: refreshHistory } = useDocumentHistory(documentId)

  const [document, setDocument] = useState<PpkDocument | null>(initialDocument)
  const [modalMode, setModalMode] = useState<'edit' | 'version' | 'history' | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const calculateNextVersion = () => {
    if (!document) return '1'
    const currentVer = parseInt(document.version || '0')
    const maxHistoryVer = history.reduce((max, v) => Math.max(max, parseInt(v.version)), 0)
    return String(Math.max(currentVer, maxHistoryVer) + 1)
  }

  const nextVersion = calculateNextVersion()

  const fetchDoc = async () => {
    try {
      const { data, error } = await documentService.getDocumentById(supabase, documentId)
      if (error) throw error
      setDocument(data as unknown as PpkDocument)
      refreshHistory()
      router.refresh()
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeleteConfirm = async () => {
    const success = await deleteDocument(documentId)
    if (success) {
      setIsDeleteDialogOpen(false)
      router.push('/dashboard/documents')
    }
  }

  if (!document) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h3 className="text-xl font-bold text-gray-900">Dokumen Tidak Ditemukan</h3>
        <p className="text-gray-500">Pastikan Anda memiliki akses atau dokumen belum dihapus.</p>
        <Button onClick={() => router.back()} variant="outline">Kembali</Button>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col gap-6 lg:flex-row p-4 md:p-8">
      <div className="flex w-full h-full flex-col gap-6 lg:w-[40%] lg:shrink-0">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="w-fit gap-2 border-none bg-transparent pl-0 text-gray-500 hover:bg-transparent hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke List
        </Button>

        {/* Metadata Card - Full Height dengan Hidden Scrollbar */}
        <div className="flex flex-1 flex-col gap-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm pt-6">
          <div
            className="flex-1 overflow-y-auto px-6 pb-4 [&::-webkit-scrollbar]:hidden"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div className="mb-4 flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-snug text-gray-900">{document.title}</h1>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant={document.is_active ? 'success' : 'outline'}>
                    {document.is_active ? 'Aktif' : 'Draft/Arsip'}
                  </Badge>
                  <Badge variant="default">Ver. {document.version || '1'}</Badge>
                </div>
              </div>
            </div>

            {document.description && (
              <div className="mb-4 text-sm leading-relaxed text-gray-600">
                {document.description}
              </div>
            )}

            <div className="space-y-5 border-t border-gray-100 pt-5">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase text-gray-400">Kategori KSM</span>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <Tag className="h-4 w-4 text-gray-400" />
                  {document.medical_staff_groups?.name}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase text-gray-400">Tanggal Pengesahan</span>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {document.validation_date
                    ? new Date(document.validation_date).toLocaleDateString('id-ID', { dateStyle: 'long' })
                    : '-'}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase text-gray-400">Diunggah Oleh</span>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <User className="h-4 w-4 text-gray-400" />
                  {document.profiles?.full_name}
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Action Buttons - Ukuran Lebih Kecil */}
          <div className="border-t border-gray-100 bg-white p-4">
            <div className="flex flex-col gap-2.5">
              {!isAdminLoading && isAdmin && (
                <Button
                  onClick={() => setModalMode('edit')}
                  disabled={isProcessing}
                  className="h-11 w-full justify-start gap-3 bg-[#41A67E] text-sm font-bold text-white shadow-sm hover:bg-[#368f6b]"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Metadata
                </Button>
              )}

              <div className={`grid ${(!isAdminLoading && isAdmin) ? 'grid-cols-2' : 'grid-cols-1'} gap-2.5`}>
                {!isAdminLoading && isAdmin && (
                  <Button
                    onClick={() => setModalMode('version')}
                    disabled={isProcessing}
                    className="h-16 flex-col gap-1.5 bg-blue-500 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
                  >
                    <GitBranch className="h-5 w-5" />
                    Update Versi
                  </Button>
                )}

                <Button
                  onClick={() => setModalMode('history')}
                  disabled={isProcessing}
                  variant="outline"
                  className="h-16 flex-col gap-1.5 border-blue-100 bg-blue-50 text-xs font-medium text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                >
                  <FileClock className="h-5 w-5" />
                  Lihat Riwayat
                </Button>
              </div>

              <Button
                onClick={() => window.open(document.file_url, '_blank')}
                variant="outline"
                className="h-10 w-full justify-start gap-2.5 border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-[#41A67E]/10 hover:text-[#41A67E] hover:border-[#41A67E]/30"
              >
                <ExternalLink className="h-4 w-4" />
                Preview Penuh
              </Button>

              {!isAdminLoading && isAdmin && (
                <Button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={isProcessing}
                  variant="outline"
                  className="h-10 w-full justify-start gap-2.5 border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                >
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  Hapus Dokumen
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer - 60% */}
      <div className="flex h-full flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-inner">
        <object
          data={`${document.file_url}#toolbar=1`}
          type="application/pdf"
          className="h-full w-full"
        >
          <div className="flex h-full flex-col items-center justify-center p-8 text-center text-gray-500">
            <p>Preview tidak tersedia di perangkat ini.</p>
          </div>
        </object>
      </div>

      <Modal
        isOpen={!!modalMode}
        onClose={() => setModalMode(null)}
        title={
          modalMode === 'edit' ? 'Edit Dokumen' :
            modalMode === 'version' ? 'Perbarui Versi Dokumen' :
              'Riwayat Versi Dokumen'
        }
      >
        {modalMode === 'history' ? (
          <DocumentHistoryModal
            documentId={document.id}
            history={history}
            logs={logs}
            isLoading={isHistoryLoading}
            refresh={() => {
              refreshHistory()
              fetchDoc()
            }}
            onSuccess={() => {
              setModalMode(null)
              fetchDoc()
            }}
          />
        ) : (
          <EditDocumentModal
            document={document}
            mode={modalMode as 'edit' | 'version'}
            nextVersion={nextVersion}
            onSuccess={() => {
              setModalMode(null)
              fetchDoc()
            }}
          />
        )}
      </Modal>

      <AlertDialog
        isOpen={isDeleteDialogOpen}
        title="Hapus Dokumen"
        description="Apakah Anda yakin ingin menghapus dokumen ini secara permanen?"
        confirmLabel="Hapus Permanen"
        variant="destructive"
        isProcessing={isProcessing}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  )
}