'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useDocumentActions } from '@/hooks/documents/use-document-actions'
import { useAdmin } from '@/hooks/auth/use-admin'
import { PpkDocument, PaginatedResponse } from '@/types'
import { Button } from '@/components/ui/button'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { DocumentFilters } from '@/components/features/documents/document-filters'
import { DocumentTable } from '@/components/features/documents/document-table'
import { Pagination } from '@/components/ui/pagination'
import { exportDocumentsToExcel } from '@/lib/excel-exporter'
import {
    Plus, FilePlus, AlertCircle,
    FileSpreadsheet, Loader2
} from 'lucide-react'


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
    initialData: PaginatedResponse<PpkDocument>
}

export function DocumentsClientView({ initialData }: DocumentsClientViewProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { deleteDocument, isProcessing } = useDocumentActions()
    const { isAdmin, isLoading: isAdminLoading } = useAdmin()

    const [paginatedData, setPaginatedData] = useState(initialData)
    const { data: documents, pagination } = paginatedData

    const [search, setSearch] = useState(searchParams.get('search') || '')
    const [groupFilter, setGroupFilter] = useState(searchParams.get('groupId') || '')
    const [typeFilter, setTypeFilter] = useState(searchParams.get('typeId') || '')
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '')
    const [startDate, setStartDate] = useState(searchParams.get('startDate') || '')
    const [endDate, setEndDate] = useState(searchParams.get('endDate') || '')

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingDoc, setEditingDoc] = useState<PpkDocument | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isExporting, setIsExporting] = useState(false)

    // Track previous filter values untuk detect perubahan
    const prevFiltersRef = useRef({ search, groupFilter, typeFilter, statusFilter, startDate, endDate })

    useEffect(() => {
        setPaginatedData(initialData)
    }, [initialData])

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())
        const prev = prevFiltersRef.current

        // Cek apakah ada filter yang berubah
        const filterChanged =
            prev.search !== search ||
            prev.groupFilter !== groupFilter ||
            prev.typeFilter !== typeFilter ||
            prev.statusFilter !== statusFilter ||
            prev.startDate !== startDate ||
            prev.endDate !== endDate

        // Update params dengan filter values
        if (search) params.set('search', search)
        else params.delete('search')

        if (groupFilter) params.set('groupId', groupFilter)
        else params.delete('groupId')

        if (typeFilter) params.set('typeId', typeFilter)
        else params.delete('typeId')

        if (statusFilter) params.set('status', statusFilter)
        else params.delete('status')

        if (startDate) params.set('startDate', startDate)
        else params.delete('startDate')

        if (endDate) params.set('endDate', endDate)
        else params.delete('endDate')

        // Hanya reset ke page 1 jika filter berubah
        if (filterChanged) {
            params.set('page', '1')
            // Update ref dengan nilai baru
            prevFiltersRef.current = { search, groupFilter, typeFilter, statusFilter, startDate, endDate }
        }

        const newQuery = params.toString()
        const currentQuery = searchParams.toString()

        const timeoutId = setTimeout(() => {
            if (newQuery !== currentQuery) {
                router.push(`?${newQuery}`)
                router.refresh()
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [search, groupFilter, typeFilter, statusFilter, startDate, endDate, router, searchParams])

    const handleExport = async () => {
        setIsExporting(true)
        try {
            await exportDocumentsToExcel(documents)
        } catch (error) {
            console.error(error)
        } finally {
            setIsExporting(false)
        }
    }

    const handleDeleteConfirm = async () => {
        if (!deleteId) return
        const success = await deleteDocument(deleteId)
        if (success) {
            setDeleteId(null)
            router.refresh()
        }
    }

    const handleRefresh = () => {
        router.refresh()
    }

    return (
        <div className="flex flex-col h-full space-y-4 p-4 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between shrink-0">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dokumen PPK</h1>
                    <p className="text-gray-500">Kelola dan distribusikan panduan praktik klinis.</p>
                    <p className="mt-2 text-sm font-medium text-gray-700">
                        Total Data: <span className="text-[#41A67E]">{pagination.totalCount}</span>
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleExport}
                        disabled={isExporting || documents.length === 0}
                        className="group h-10 gap-2 border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 shadow-sm transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50"
                    >
                        {isExporting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <FileSpreadsheet className="h-4 w-4 text-gray-400 transition-colors group-hover:text-emerald-600" />
                        )}
                        <span>Export Excel</span>
                    </Button>

                    {!isAdminLoading && isAdmin && (
                        <Button onClick={() => setIsCreateOpen(true)} className="h-10 bg-[#41A67E] hover:bg-[#368f6b] shadow-sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Dokumen
                        </Button>
                    )}
                </div>
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

            {documents.length === 0 ? (
                <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center shrink-0">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-50 mb-4">
                        {search || groupFilter ? <AlertCircle className="h-10 w-10 text-gray-400" /> : <FilePlus className="h-10 w-10 text-gray-400" />}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Dokumen tidak ditemukan</h3>
                    <p className="mt-2 max-w-sm text-gray-500">Silakan ubah filter atau tambah dokumen baru.</p>
                </div>
            ) : (
                <>
                    <DocumentTable
                        documents={documents}
                        isAdmin={isAdmin}
                        onEdit={(doc) => setEditingDoc(doc)}
                        onDelete={(id) => setDeleteId(id)}
                    />

                    {/* Pagination Component */}
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        totalCount={pagination.totalCount}
                        pageSize={pagination.pageSize}
                        hasNextPage={pagination.hasNextPage}
                        hasPreviousPage={pagination.hasPreviousPage}
                    />
                </>
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
                        nextVersion={editingDoc.version || '1'}
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
