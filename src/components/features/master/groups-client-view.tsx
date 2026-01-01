'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { MasterDataView } from './master-data-view'
import { GroupFormModal } from './modal/group-form-modal'
import { useMasterGroups } from '@/hooks/master/use-master-groups'
import { useAdmin } from '@/hooks/auth/use-admin'
import { MedicalStaffGroup } from '@/types'
import { AlertDialog } from '@/components/ui/alert-dialog'

const Modal = dynamic(() => import('@/components/ui/modal').then(mod => mod.Modal))

export function GroupsClientView({ initialData }: { initialData: MedicalStaffGroup[] }) {
  const { deleteGroup, isProcessing } = useMasterGroups()
  const { isAdmin, isLoading: isAdminLoading } = useAdmin()
  const [data, setData] = useState(initialData)
  const [search, setSearch] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MedicalStaffGroup | undefined>(undefined)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    setData(initialData)
  }, [initialData])

  const handleAdd = () => {
    setEditingItem(undefined)
    setIsModalOpen(true)
  }

  const handleEdit = (item: any) => {
    setEditingItem(item as MedicalStaffGroup)
    setIsModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    const success = await deleteGroup(deleteId)
    if (success) {
      setDeleteId(null)
    }
  }

  return (
    <>
      <MasterDataView
        title="Kelompok Staf Medis"
        data={data}
        search={search}
        setSearch={setSearch}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={(id: string) => setDeleteId(id)}
        isProcessing={isProcessing}
        extraColumnName="Deskripsi"
        isAdmin={!!isAdmin && !isAdminLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Kelompok Staf Medis' : 'Tambah Kelompok Staf Medis'}
      >
        <GroupFormModal
          initialData={editingItem}
          onSuccess={() => setIsModalOpen(false)}
        />
      </Modal>

      <AlertDialog
        isOpen={!!deleteId}
        title="Hapus KSM"
        description="Apakah Anda yakin ingin menghapus kelompok staf medis ini?"
        confirmLabel="Hapus"
        variant="destructive"
        isProcessing={isProcessing}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </>
  )
}