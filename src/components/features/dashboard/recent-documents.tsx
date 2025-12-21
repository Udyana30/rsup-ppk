'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { PpkDocument } from '@/types'
import { FileText, MoreHorizontal, FilePlus, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useDocumentActions } from '@/hooks/documents/use-document-actions'
import { useClickOutside } from '@/hooks/ui/use-click-outside'
import { AlertDialog } from '@/components/ui/alert-dialog'

const EditDocumentModal = dynamic(() =>
  import('@/components/features/documents/modal/edit-document-modal').then(mod => mod.EditDocumentModal)
)

const Modal = dynamic(() =>
  import('@/components/ui/modal').then(mod => mod.Modal)
)

interface RecentDocumentsProps {
  documents: PpkDocument[]
}

export function RecentDocuments({ documents }: RecentDocumentsProps) {
  const router = useRouter()
  const { deleteDocument, isProcessing } = useDocumentActions()

  const [editingDoc, setEditingDoc] = useState<PpkDocument | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [menuState, setMenuState] = useState<{
    id: string
    top: number
    left: number
  } | null>(null)

  const [mounted, setMounted] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)
  useClickOutside(menuRef, () => setMenuState(null))

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setMenuState(null)
    const handleResize = () => setMenuState(null)

    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    const success = await deleteDocument(deleteId)
    if (success) {
      setDeleteId(null)
      router.refresh()
    }
  }

  const handleRowClick = (docId: string) => {
    router.push(`/dashboard/documents/${docId}`)
  }

  const toggleMenu = (e: React.MouseEvent, docId: string) => {
    e.stopPropagation()
    if (menuState?.id === docId) {
      setMenuState(null)
      return
    }

    const button = e.currentTarget as HTMLButtonElement
    const rect = button.getBoundingClientRect()

    setMenuState({
      id: docId,
      top: rect.bottom + window.scrollY + 4,
      left: rect.right + window.scrollX - 128 // 128px is w-32
    })
  }

  const handleEdit = (e: React.MouseEvent, doc: PpkDocument) => {
    e.stopPropagation()
    setEditingDoc(doc)
    setMenuState(null)
  }

  const handleDelete = (e: React.MouseEvent, docId: string) => {
    e.stopPropagation()
    setDeleteId(docId)
    setMenuState(null)
  }

  if (documents.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50">
          <FileText className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          Belum ada dokumen
        </h3>
        <p className="mt-2 max-w-sm text-sm text-gray-500">
          Data dokumen PPK belum tersedia. Silakan unggah dokumen pertama Anda untuk memulai.
        </p>
        <div className="mt-6 text-gray-600 font-medium">
          <Link href="/dashboard/documents">
            <Button variant="outline" className="gap-2 rounded-xl">
              <FilePlus className="h-4 w-4" />
              Upload Dokumen
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-4">
        <h3 className="font-semibold text-gray-900">Recent Documents</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/50 text-gray-500">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {documents.slice(0, 6).map((doc) => (
              <tr
                key={doc.id}
                className="hover:bg-gray-50/50 cursor-pointer transition-colors"
                onClick={() => handleRowClick(doc.id)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-50 p-2 text-blue-600 ring-2 ring-white shadow-sm">
                      <FileText className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-gray-900">{doc.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {doc.medical_staff_groups?.name || 'General'}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                    Published
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(doc.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={(e) => toggleMenu(e, doc.id)}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mounted && menuState && createPortal(
        <div
          ref={menuRef}
          className="absolute z-[9999] w-32 rounded-lg border border-gray-100 bg-white shadow-lg py-1"
          style={{
            top: menuState.top,
            left: menuState.left
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              const doc = documents.find(d => d.id === menuState.id)
              if (doc) handleEdit(e, doc)
            }}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Pencil className="mr-2 h-3.5 w-3.5" />
            Edit
          </button>
          <button
            onClick={(e) => handleDelete(e, menuState.id)}
            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Delete
          </button>
        </div>,
        document.body
      )}

      {editingDoc && (
        <Modal
          isOpen={!!editingDoc}
          onClose={() => setEditingDoc(null)}
          title="Edit Metadata Dokumen"
        >
          <EditDocumentModal
            document={editingDoc}
            mode="edit"
            nextVersion={editingDoc.version || '1'}
            onSuccess={() => {
              setEditingDoc(null)
              router.refresh()
            }}
          />
        </Modal>
      )}

      <AlertDialog
        isOpen={!!deleteId}
        title="Hapus Dokumen"
        description="Apakah Anda yakin ingin menghapus dokumen ini beserta filenya secara permanen?"
        confirmLabel="Ya, Hapus"
        variant="destructive"
        isProcessing={isProcessing}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}