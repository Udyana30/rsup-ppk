'use client'

import { useState, useEffect } from 'react'
import { useMasterGroups } from '@/hooks/master/use-master-groups'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MedicalStaffGroup } from '@/types'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GroupFormModalProps {
  initialData?: MedicalStaffGroup
  onSuccess: () => void
}

export function GroupFormModal({ initialData, onSuccess }: GroupFormModalProps) {
  const { createGroup, updateGroup, isProcessing } = useMasterGroups()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setDescription(initialData.description || '')
      setIsActive(initialData.is_active)
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let success = false
    const timestamp = new Date().toISOString()

    if (initialData) {
      success = await updateGroup(initialData.id, {
        name,
        description: description || null,
        is_active: isActive,
        created_at: initialData.created_at
      })
    } else {
      success = await createGroup({
        name,
        description: description || null,
        is_active: isActive
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

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <div
          onClick={() => setIsActive(!isActive)}
          className={cn(
            "flex h-11 w-full cursor-pointer items-center justify-between rounded-md border px-4 transition-all",
            isActive
              ? "border-[#41A67E] bg-[#41A67E]/5 text-[#41A67E]"
              : "border-gray-300 bg-gray-50 text-gray-500"
          )}
        >
          <span className="font-medium text-sm">{isActive ? 'Aktif' : 'Non-Aktif'}</span>
          {isActive ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
        </div>
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