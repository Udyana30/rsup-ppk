'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useDocumentActions } from '@/hooks/documents/use-document-actions'
import { PpkDocument } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { DocumentFilters } from '@/components/features/documents/document-filters'
import { Plus, FileText, Pencil, Trash2, FilePlus, AlertCircle, Loader2, User } from 'lucide-react'

const UploadFormModal = dynamic(() =>
    import('@/components/features/documents/modal/upload-form-modal').then(mod => mod.UploadFormModal)
)

const EditDocumentModal = dynamic(() =>
    import('@/components/features/documents/modal/edit-document-modal').then(mod => mod.EditDocumentModal)
)

const Modal = dynamic(() =>
    import('@/components/ui/modal').then(mod => mod.Modal)
)

interface DocumentsClientViewProps {
    initialDocuments: PpkDocument[]
}

export function DocumentsClientView({ initialDocuments }: DocumentsClientViewProps) {
    const router = useRouter()
    const { deleteDocument, isProcessing } = useDocumentActions()

    const [documents, setDocuments] = useState<PpkDocument[]>(initialDocuments)
    const [search, setSearch] = useState('')
    const [groupFilter, setGroupFilter] = useState('')
    const [typeFilter, setTypeFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingDoc, setEditingDoc] = useState<PpkDocument | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    useEffect(() => {
        setDocuments(initialDocuments)
    }, [initialDocuments])

    const filteredDocs = documents.filter(doc => {
        const docDate = new Date(doc.created_at)
        const matchSearch = doc.title.toLowerCase().includes(search.toLowerCase())
        const matchGroup = groupFilter ? doc.medical_staff_groups?.name === groupFilter : true
        const matchType = typeFilter ? doc.ppk_types?.name === typeFilter : true

        let matchStatus = true
        if (statusFilter === 'active') matchStatus = doc.is_active === true
        if (statusFilter === 'inactive') matchStatus = doc.is_active === false

        let matchDate = true
        if (startDate) matchDate = matchDate && docDate >= new Date(startDate)
        if (endDate) {
            const end = new Date(endDate)
            end.setHours(23, 59, 59)
            matchDate = matchDate && docDate <= end
        }
        return matchSearch && matchGroup && matchType && matchStatus && matchDate
    })

    const handleDeleteConfirm = async () => {
        if (!deleteId) return
        const success = await deleteDocument(deleteId)
        if (success) {
            setDocuments(prev => prev.filter(doc => doc.id !== deleteId))
            setDeleteId(null)
            router.refresh()
        }
    }

    const handleEditClick = (e: React.MouseEvent, doc: PpkDocument) => {
        e.stopPropagation()
        setEditingDoc(doc)
    }

    const handleRefresh = () => {
        router.refresh()
    }

    // Column widths
    const colWidths = {
        title: 'w-[35%]',
        category: 'w-[20%]',
        status: 'w-[15%]',
        date: 'w-[15%]',
        action: 'w-[15%]'
    }

    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between shrink-0">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dokumen PPK</h1>
                    <p className="text-gray-500">Kelola dan distribusikan panduan praktik klinis.</p>
                    <p className="mt-2 text-sm font-medium text-gray-700">
                        Total Dokumen: <span className="text-[#41A67E]">{documents.length}</span>
                    </p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)} className="bg-[#41A67E] hover:bg-[#368f6b] shadow-sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Dokumen
                </Button>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shrink-0">
                <DocumentFilters
                    search={search} setSearch={setSearch}
                    groupFilter={groupFilter} setGroupFilter={setGroupFilter}
                    typeFilter={typeFilter} setTypeFilter={setTypeFilter}
                    statusFilter={statusFilter} setStatusFilter={setStatusFilter}
                    startDate={startDate} setStartDate={setStartDate}
                    endDate={endDate} setEndDate={setEndDate}
                />
            </div>

            {filteredDocs.length === 0 ? (
                <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center shrink-0">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-50 mb-4">
                        {search || groupFilter ? <AlertCircle className="h-10 w-10 text-gray-400" /> : <FilePlus className="h-10 w-10 text-gray-400" />}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Dokumen tidak ditemukan</h3>
                    <p className="mt-2 max-w-sm text-gray-500">Silakan ubah filter atau tambah dokumen baru.</p>
                </div>
            ) : (
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-700 shadow-sm table w-full table-fixed">
                            <tr>
                                <th className={`px-6 py-4 font-bold ${colWidths.title}`}>Judul Dokumen</th>
                                <th className={`px-6 py-4 font-bold ${colWidths.category}`}>Kategori</th>
                                <th className={`px-6 py-4 font-bold ${colWidths.status}`}>Status</th>
                                <th className={`px-6 py-4 font-bold ${colWidths.date}`}>Tanggal</th>
                                <th className={`px-6 py-4 text-right font-bold ${colWidths.action}`}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 block overflow-y-auto max-h-[calc(100vh-320px)] w-full">
                            {filteredDocs.map((doc) => (
                                <tr
                                    key={doc.id}
                                    onClick={() => router.push(`/dashboard/documents/${doc.id}`)}
                                    className="group cursor-pointer hover:bg-blue-50/30 transition-colors table w-full table-fixed"
                                >
                                    <td className={`px-6 py-4 ${colWidths.title}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-900 line-clamp-1 max-w-[300px]">
                                                    {doc.title}
                                                </span>
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                    <span>{doc.ppk_types?.name}</span>
                                                    <span className="text-gray-300">•</span>
                                                    <div className="flex items-center gap-1">
                                                        <User className="h-3 w-3" />
                                                        {doc.profiles?.full_name || 'System'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 text-gray-700 font-medium ${colWidths.category}`}>
                                        {doc.medical_staff_groups?.name || '-'}
                                    </td>
                                    <td className={`px-6 py-4 ${colWidths.status}`}>
                                        <Badge variant={doc.is_active ? 'success' : 'outline'}>
                                            {doc.is_active ? 'Aktif' : 'Non-Aktif'}
                                        </Badge>
                                    </td>
                                    <td className={`px-6 py-4 text-gray-600 ${colWidths.date}`}>
                                        {new Date(doc.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                    </td>
                                    <td className={`px-6 py-4 text-right ${colWidths.action}`}>
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={(e) => handleEditClick(e, doc)}
                                                className="h-8 w-8 p-0 text-[#41A67E] border-[#41A67E]"
                                                title="Edit Data"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setDeleteId(doc.id)
                                                }}
                                                className="h-8 w-8 p-0 bg-red-50 text-red-600 hover:bg-red-100 border-red-100"
                                                title="Hapus"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isCreateOpen && (
                <Modal
                    isOpen={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    title="Upload Dokumen Baru"
                >
                    <UploadFormModal onSuccess={() => {
                        setIsCreateOpen(false)
                        handleRefresh()
                    }} />
                </Modal>
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
                        onSuccess={() => {
                            setEditingDoc(null)
                            handleRefresh()
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
