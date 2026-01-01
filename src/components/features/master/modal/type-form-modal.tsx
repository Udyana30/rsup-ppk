'use client'

import { useState, useEffect } from 'react'
import { useMasterTypes } from '@/hooks/master/use-master-types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PpkType } from '@/types'
import { Loader2 } from 'lucide-react'

interface TypeFormModalProps {
  initialData?: PpkType
  onSuccess: () => void
}

export function TypeFormModal({ initialData, onSuccess }: TypeFormModalProps) {
  const { createType, updateType, isProcessing } = useMasterTypes()

  const [name, setName] = useState('')

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let success = false

    if (initialData) {
      success = await updateType(initialData.id, {
        name,
        created_at: initialData.created_at
      })
    } else {
      success = await createType({
        name
      })
    }

    if (success) onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Nama Jenis Dokumen</label>
        <Input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: Panduan Praktik Klinis"
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