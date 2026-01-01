'use client'

import { useState, useEffect } from 'react'
import { useMasterGroups } from '@/hooks/master/use-master-groups'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MedicalStaffGroup } from '@/types'
import { Loader2 } from 'lucide-react'

interface GroupFormModalProps {
  initialData?: MedicalStaffGroup
  onSuccess: () => void
}

export function GroupFormModal({ initialData, onSuccess }: GroupFormModalProps) {
  const { createGroup, updateGroup, isProcessing } = useMasterGroups()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setDescription(initialData.description || '')
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let success = false

    if (initialData) {
      success = await updateGroup(initialData.id, {
        name,
        description: description || null,
        created_at: initialData.created_at
      })
    } else {
      success = await createGroup({
        name,
        description: description || null
      })
    }

    if (success) onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Nama Kelompok (KSM)</label>
        <Input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: KSM Bedah"
          className="h-11 text-gray-700"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Deskripsi (Opsional)</label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Keterangan tambahan..."
          className="h-11 text-gray-700"
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={isProcessing}
          className="h-11 min-w-[120px] bg-[#41A67E] font-bold text-white hover:bg-[#368f6b]"
        >
          {isProcessing ? <Loader2 className="animate-spin h-4 w-4" /> : 'Simpan Data'}
        </Button>
      </div>
    </form>
  )
}