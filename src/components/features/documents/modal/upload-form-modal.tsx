'use client'

import { useState, FormEvent } from 'react'
import { useUpload } from '@/hooks/storage/use-upload'
import { useCategories } from '@/hooks/master/use-categories'
import { useAuth } from '@/hooks/auth/use-auth'
import { usePdfUpload } from '@/hooks/documents/use-pdf-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PdfFileUpload } from '@/components/features/documents/pdf-file-upload'
import { Loader2, ChevronDown, CheckCircle2, XCircle, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UploadFormModalProps {
  onSuccess: () => void
}

export function UploadFormModal({ onSuccess }: UploadFormModalProps) {
  const { uploadDocument, isUploading } = useUpload()
  const { groups, types } = useCategories()
  const { user } = useAuth()
  const { file, fileError, validatePdfFile, handleFileChange, handleDragOver, handleDrop } = usePdfUpload()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [validationDate, setValidationDate] = useState('')
  const [groupId, setGroupId] = useState('')
  const [typeId, setTypeId] = useState('')
  const [isActive, setIsActive] = useState(true)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!file || !user) return

    // Validasi ulang file
    if (!validatePdfFile(file)) {
      return
    }

    try {
      await uploadDocument(file, {
        title,
        description,
        group_id: groupId,
        type_id: typeId,
        uploaded_by: user.id,
        is_active: isActive,
        version: '1',
        // @ts-ignore
        validation_date: validationDate
      })
      onSuccess()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900">Judul Dokumen PPK</label>
        <Input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Masukkan judul dokumen lengkap..."
          className="h-11 border-gray-300 bg-white px-4 text-base text-gray-900 placeholder:text-gray-400 focus:border-[#41A67E] focus:ring-[#41A67E]"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900">Deskripsi (Opsional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tambahkan ringkasan atau keterangan singkat dokumen..."
          rows={3}
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-[#41A67E] focus:outline-none focus:ring-2 focus:ring-[#41A67E]/20"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">Tanggal Pengesahan</label>
          <div className="relative">
            <Input
              type="date"
              required
              value={validationDate}
              onChange={(e) => setValidationDate(e.target.value)}
              className="h-11 border-gray-300 bg-white px-4 text-base text-gray-900 focus:border-[#41A67E] focus:ring-[#41A67E] pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            />
            <Calendar className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">Kelompok Staff Medis</label>
          <div className="relative">
            <select
              required
              className="h-11 w-full appearance-none rounded-md border border-gray-300 bg-white pl-4 pr-10 text-base text-gray-900 focus:border-[#41A67E] focus:outline-none focus:ring-1 focus:ring-[#41A67E]"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
            >
              <option value="" className="text-gray-400">Pilih KSM...</option>
              {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">Jenis Dokumen</label>
          <div className="relative">
            <select
              required
              className="h-11 w-full appearance-none rounded-md border border-gray-300 bg-white pl-4 pr-10 text-base text-gray-900 focus:border-[#41A67E] focus:outline-none focus:ring-1 focus:ring-[#41A67E]"
              value={typeId}
              onChange={(e) => setTypeId(e.target.value)}
            >
              <option value="" className="text-gray-400">Pilih Jenis...</option>
              {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">Status Dokumen</label>
          <div
            onClick={() => setIsActive(!isActive)}
            className={cn(
              "flex h-11 w-full cursor-pointer items-center justify-between rounded-md border px-4 transition-all",
              isActive
                ? "border-[#41A67E] bg-[#41A67E]/5 text-[#41A67E]"
                : "border-gray-300 bg-gray-50 text-gray-500"
            )}
          >
            <span className="font-medium text-sm">{isActive ? 'Aktif (Published)' : 'Tidak Aktif (Draft)'}</span>
            {isActive ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
          </div>
        </div>
      </div>

      <PdfFileUpload
        file={file}
        fileError={fileError}
        required={true}
        mode="upload"
        onFileChange={handleFileChange}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={isUploading || !!fileError}
          className="h-11 min-w-[150px] bg-[#41A67E] text-sm font-bold text-white shadow-sm transition-all hover:bg-[#368f6b] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            'Simpan Dokumen'
          )}
        </Button>
      </div>
    </form>
  )
}