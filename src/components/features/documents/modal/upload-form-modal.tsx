'use client'

import { useState, FormEvent } from 'react'
import { useUpload } from '@/hooks/use-upload'
import { useCategories } from '@/hooks/use-categories'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, CloudUpload, ChevronDown, CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UploadFormModalProps {
  onSuccess: () => void
}

export function UploadFormModal({ onSuccess }: UploadFormModalProps) {
  const { uploadDocument, isUploading } = useUpload()
  const { groups, types } = useCategories()
  const { user } = useAuth()
  
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [validationDate, setValidationDate] = useState('')
  const [groupId, setGroupId] = useState('')
  const [typeId, setTypeId] = useState('')
  const [isActive, setIsActive] = useState(true)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!file || !user) return

    try {
      await uploadDocument(file, {
        title,
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
        <label className="block text-sm font-medium text-gray-700">Judul Dokumen PPK</label>
        <Input 
          required 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Masukkan judul dokumen lengkap..."
          className="h-11 border-gray-300 bg-white px-4 text-base text-gray-900 placeholder:text-gray-400 focus:border-[#41A67E] focus:ring-[#41A67E]"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Tanggal Pengesahan</label>
          <Input 
            type="date"
            required 
            value={validationDate} 
            onChange={(e) => setValidationDate(e.target.value)} 
            className="h-11 border-gray-300 bg-white px-4 text-base text-gray-900 focus:border-[#41A67E] focus:ring-[#41A67E]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Kelompok Staff Medis</label>
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
          <label className="block text-sm font-medium text-gray-700">Jenis Dokumen</label>
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
          <label className="block text-sm font-medium text-gray-700">Status Dokumen</label>
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

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Upload File PDF</label>
        <div className="relative rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition-all hover:border-[#41A67E] hover:bg-[#41A67E]/5">
          <Input 
            type="file" 
            accept="application/pdf"
            required 
            className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
            onChange={(e) => setFile(e.target.files?.[0] || null)} 
          />
          <div className="relative z-0 flex flex-col items-center">
            <div className="mb-3 rounded-full bg-white p-3 shadow-sm ring-1 ring-gray-200">
              <CloudUpload className="h-6 w-6 text-[#41A67E]" />
            </div>
            <div>
              <span className="text-sm font-medium text-[#41A67E] underline-offset-2 group-hover:underline">Klik untuk pilih file</span>
              <span className="text-sm text-gray-600"> atau drag and drop</span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {file ? (
                <span className="inline-flex items-center rounded-md bg-[#41A67E]/10 px-2 py-1 text-[#41A67E] font-medium">
                  {file.name}
                </span>
              ) : (
                'Maksimal ukuran file 10MB (PDF)'
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          type="submit" 
          disabled={isUploading} 
          className="h-11 min-w-[150px] bg-[#41A67E] text-sm font-bold text-white shadow-sm transition-all hover:bg-[#368f6b]"
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