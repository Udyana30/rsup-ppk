'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { documentService } from '@/services/document.service'
import { PpkDocument } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { EditDocumentModal } from '@/components/features/documents/modal/edit-document-modal'
import { 
  ArrowLeft, Calendar, FileText, User, Tag, 
  Pencil, History, Trash2, AlertCircle, Loader2 
} from 'lucide-react'

export function DocumentDetailView({ documentId }: { documentId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [document, setDocument] = useState<PpkDocument | null>(null)
  const [loading, setLoading] = useState(true)
  
  // State Modal
  const [modalMode, setModalMode] = useState<'edit' | 'version' | null>(null)

  const fetchDoc = async () => {
    try {
      const { data, error } = await documentService.getDocumentById(supabase, documentId)
      if (error) throw error
      setDocument(data as unknown as PpkDocument)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoc()
  }, [documentId])

  const handleDelete = async () => {
    if (confirm('Apakah Anda yakin ingin menghapus dokumen ini secara permanen?')) {
      await documentService.deleteDocument(supabase, documentId)
      router.push('/dashboard/documents')
    }
  }

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#41A67E]" />
      </div>
    )
  }

  if (!document) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h3 className="text-xl font-bold text-gray-900">Dokumen Tidak Ditemukan</h3>
        <Button onClick={() => router.back()} variant="outline">Kembali</Button>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col gap-6 lg:flex-row">
      {/* SIDEBAR */}
      <div className="flex w-full flex-col gap-6 lg:w-[400px] lg:shrink-0">
        <Button 
          variant="outline" 
          onClick={() => router.back()} 
          className="w-fit gap-2 border-none bg-transparent pl-0 text-gray-500 hover:bg-transparent hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke List
        </Button>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#41A67E]/10 text-[#41A67E]">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-snug text-gray-900">{document.title}</h1>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant={document.is_active ? 'success' : 'outline'}>
                  {document.is_active ? 'Aktif' : 'Draft/Arsip'}
                </Badge>
                <Badge variant="default">Ver. {document.version || '1.0'}</Badge>
              </div>
            </div>
          </div>

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

        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => setModalMode('edit')}
            className="h-12 w-full justify-start gap-3 bg-[#41A67E] text-base font-bold text-white shadow-md hover:bg-[#368f6b]"
          >
            <Pencil className="h-5 w-5" />
            Edit Metadata
          </Button>
          
          <Button 
            onClick={() => setModalMode('version')}
            variant="outline" 
            className="h-12 w-full justify-start gap-3 border-gray-300 text-base font-medium text-gray-700 hover:bg-gray-50"
          >
            <History className="h-5 w-5" />
            Update Versi File
          </Button>

          <Button 
            onClick={handleDelete}
            variant="destructive" 
            className="h-12 w-full justify-start gap-3 bg-red-50 text-base font-medium text-red-600 hover:bg-red-100"
          >
            <Trash2 className="h-5 w-5" />
            Hapus Dokumen
          </Button>
        </div>
      </div>

      {/* PDF PREVIEW (Tanpa Tombol Download Custom) */}
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

      {/* MODAL EDIT & VERSI */}
      <Modal
        isOpen={!!modalMode}
        onClose={() => setModalMode(null)}
        title={modalMode === 'edit' ? 'Edit Dokumen' : 'Perbarui Versi Dokumen'}
      >
        <EditDocumentModal 
          document={document} 
          mode={modalMode || 'edit'} 
          onSuccess={() => {
            setModalMode(null)
            if (modalMode === 'version') {
                router.push('/dashboard/documents') // Balik ke list jika versi baru (karena ID berubah)
            } else {
                fetchDoc() // Refresh data jika cuma edit
            }
          }} 
        />
      </Modal>
    </div>
  )
}