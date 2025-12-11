'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { MasterDataTable } from './master-data-table'
import { TypeFormModal } from './modal/type-form-modal'
import { useMasterTypes } from '@/hooks/use-master-types'
import { PpkType } from '@/types'

const Modal = dynamic(() => import('@/components/ui/modal').then(mod => mod.Modal))

export function TypesClientView({ initialData }: { initialData: PpkType[] }) {
  const { deleteType, isProcessing } = useMasterTypes()
  const [data, setData] = useState(initialData)
  const [search, setSearch] = useState('')
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<PpkType | undefined>(undefined)

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

  const handleDelete = async (id: string) => {
    await deleteType(id)
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
        onDelete={handleDelete}
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
    </>
  )
}