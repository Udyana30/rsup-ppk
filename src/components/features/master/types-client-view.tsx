'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { MasterDataTable } from './master-data-table'
import { TypeFormModal } from './modal/type-form-modal'
import { useMasterTypes } from '@/hooks/use-master-types'
import { PpkType } from '@/types'
import { AlertDialog } from '@/components/ui/alert-dialog'

const Modal = dynamic(() => import('@/components/ui/modal').then(mod => mod.Modal))

export function TypesClientView({ initialData }: { initialData: PpkType[] }) {
  const { deleteType, isProcessing } = useMasterTypes()
  const [data, setData] = useState(initialData)
  const [search, setSearch] = useState('')
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<PpkType | undefined>(undefined)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    setData(initialData)
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
    const success = await deleteType(deleteId)
    if (success) {
        setDeleteId(null)
    }
  }

  return (
    <>
      <MasterDataTable
        title="Tipe Dokumen"
        data={data}
        search={search}
        setSearch={setSearch}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={(id) => setDeleteId(id)}
        isProcessing={isProcessing}
        extraColumnName="Kode"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Tipe Dokumen' : 'Tambah Tipe Dokumen'}
      >
        <TypeFormModal 
          initialData={editingItem} 
          onSuccess={() => setIsModalOpen(false)} 
        />
      </Modal>

      <AlertDialog
        isOpen={!!deleteId}
        title="Hapus Tipe Dokumen"
        description="Apakah Anda yakin ingin menghapus tipe dokumen ini?"
        confirmLabel="Hapus"
        variant="destructive"
        isProcessing={isProcessing}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </>
  )
}