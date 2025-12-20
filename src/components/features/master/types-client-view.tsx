'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { MasterDataTable } from './master-data-table'
import { TypeFormModal } from './modal/type-form-modal'
import { useMasterTypes } from '@/hooks/master/use-master-types'
import { useAdmin } from '@/hooks/auth/use-admin'
import { PpkType } from '@/types'
import { AlertDialog } from '@/components/ui/alert-dialog'

const Modal = dynamic(() => import('@/components/ui/modal').then(mod => mod.Modal))

export function TypesClientView({ initialData }: { initialData: PpkType[] }) {
  const { deleteType, isProcessing } = useMasterTypes()
  const { isAdmin, isLoading: isAdminLoading } = useAdmin()
  const [data, setData] = useState(initialData)
  const [search, setSearch] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<PpkType | undefined>(undefined)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Sync dengan server state, tapi filter 'deleted_at' untuk keamanan ganda
  useEffect(() => {
    if (initialData) {
      setData(initialData.filter(item => !item.deleted_at))
    }
  }, [initialData])

  const handleAdd = () => {
    setEditingItem(undefined)
    setIsModalOpen(true)
  }

  const handleEdit = (item: any) => {
    setEditingItem(item as PpkType)
    setIsModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    // Optimistic Update: Hapus dari UI segera sebelum server selesai merespons
    const previousData = [...data]
    setData((prev) => prev.filter((item) => item.id !== deleteId))

    const success = await deleteType(deleteId)
    
    if (success) {
      setDeleteId(null)
    } else {
      // Revert jika gagal (Rollback)
      setData(previousData)
    }
  }

  // Safety filter saat render untuk memastikan tidak ada item terhapus yang lolos
  const activeData = data.filter(item => !item.deleted_at)

  return (
    <>
      <MasterDataTable
        title="Jenis Dokumen"
        data={activeData}
        search={search}
        setSearch={setSearch}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={(id) => setDeleteId(id)}
        isProcessing={isProcessing}
        extraColumnName="Kode"
        isAdmin={!!isAdmin && !isAdminLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Jenis Dokumen' : 'Tambah Jenis Dokumen'}
      >
        <TypeFormModal
          initialData={editingItem}
          onSuccess={() => setIsModalOpen(false)}
        />
      </Modal>

      <AlertDialog
        isOpen={!!deleteId}
        title="Hapus Jenis Dokumen"
        description="Apakah Anda yakin ingin menghapus jenis dokumen ini?"
        confirmLabel="Hapus"
        variant="destructive"
        isProcessing={isProcessing}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </>
  )
}