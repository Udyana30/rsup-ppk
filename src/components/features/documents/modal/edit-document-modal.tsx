'use client'

import { useState, useEffect, FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useCategories } from '@/hooks/master/use-categories'
import { useDocumentActions } from '@/hooks/documents/use-document-actions'
import { documentService } from '@/services/document.service'
import { useAuth } from '@/hooks/auth/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, CloudUpload, ChevronDown, CheckCircle2, XCircle, FileCheck, FileText, Calendar, GitBranch } from 'lucide-react'
import { PpkDocument } from '@/types'
import { cn } from '@/lib/utils'

interface EditDocumentModalProps {
  document: PpkDocument
  mode: 'edit' | 'version'
  onSuccess: () => void
}

export function EditDocumentModal({ document, mode, onSuccess }: EditDocumentModalProps) {
  const supabase = createClient()
  const { groups, types } = useCategories()
  const { editMetadata, createNewVersion, isProcessing } = useDocumentActions()
  const { user } = useAuth()

  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState(document.title)
  const [description, setDescription] = useState(document.description || '')
  const [validationDate, setValidationDate] = useState(document.validation_date || '')
  const [groupId, setGroupId] = useState(document.group_id || '')
  const [typeId, setTypeId] = useState(document.type_id || '')
  const [isActive, setIsActive] = useState(document.is_active)
  
  const [predictedVersion, setPredictedVersion] = useState<string | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const currentVersion = document.version || '1'
  const existingFileName = decodeURIComponent(document.file_url.split('/').pop() || 'Dokumen.pdf')

  useEffect(() => {
    const fetchNextVersion = async () => {
      if (mode === 'version') {
        setIsCalculating(true)
        try {
          const nextVer = await documentService.getNextVersionNumber(supabase, document.id)
          setPredictedVersion(nextVer)
        } catch (error) {
          console.error('Gagal menghitung versi', error)
        } finally {
          setIsCalculating(false)
        }
      }
    }

    fetchNextVersion()
  }, [mode, document.id, supabase])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return

    const formData = {
      title,
      description,
      group_id: groupId,
      type_id: typeId,
      validation_date: validationDate,
      is_active: isActive,
      uploaded_by: user.id
    }

    let success = false
    if (mode === 'edit') {
      success = await editMetadata(document.id, formData, file)
    } else {
      success = await createNewVersion(document, formData, file)
    }

    if (success) onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <span className="block font-bold uppercase tracking-wide">
            {mode === 'edit' ? 'Mode Edit Metadata' : 'Mode Update Versi'}
          </span>
          <span className="opacity-90">
            {mode === 'edit'
              ? 'Perubahan akan disimpan langsung pada dokumen ini.'
              : isCalculating 
                ? 'Menghitung nomor versi selanjutnya...'
                : `Sistem akan menerbitkan Versi ${predictedVersion} dan mengarsipkan Versi ${currentVersion}.`
            }
          </span>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <div className="space-y-2 md:col-span-3">
          <label className="block text-sm font-medium text-gray-900">Judul Dokumen PPK</label>
          <Input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-11 border-gray-300 bg-white px-4 text-base text-gray-900 focus:border-[#41A67E] focus:ring-[#41A67E]"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">Versi</label>
          <div className={cn(
            "flex h-11 w-full items-center justify-center gap-2 rounded-md border text-sm font-bold",
            mode === 'version' 
              ? "border-blue-200 bg-blue-50 text-blue-700" 
              : "border-gray-200 bg-gray-100 text-gray-500"
          )}>
            {mode === 'version' ? (
              isCalculating ? (
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              ) : (
                <>
                  <GitBranch className="h-4 w-4" />
                  <span>v{predictedVersion}</span>
                </>
              )
            ) : (
              <span>v{currentVersion}</span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900">Deskripsi (Opsional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tambahkan ringkasan atau keterangan singkat..."
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

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900">
          {mode === 'version' ? 'Upload File Versi Baru' : 'File Dokumen'}
        </label>

        <div className={cn(
          "relative rounded-xl border-2 border-dashed p-6 text-center transition-all",
          mode === 'version' && !file
            ? "border-orange-300 bg-orange-50 hover:bg-orange-100"
            : "border-gray-300 bg-gray-50 hover:border-[#41A67E] hover:bg-[#41A67E]/5"
        )}>
          <Input
            type="file"
            accept="application/pdf"
            required={mode === 'version'}
            className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <div className="relative z-0 flex flex-col items-center gap-2">
            <div className={cn(
              "rounded-full p-3 shadow-sm ring-1",
              file ? "bg-[#41A67E]/10 ring-[#41A67E]/20" : "bg-white ring-gray-200"
            )}>
              {file ? (
                <CloudUpload className="h-6 w-6 text-[#41A67E]" />
              ) : (
                <FileCheck className="h-6 w-6 text-gray-400" />
              )}
            </div>

            <div className="flex flex-col items-center">
              {file ? (
                <>
                  <span className="text-sm font-bold text-[#41A67E]">{file.name}</span>
                  <span className="text-xs text-gray-500">File baru terpilih • Klik untuk ganti</span>
                </>
              ) : (
                <>
                  <span className="text-sm font-medium text-gray-900 line-clamp-1 max-w-[300px]">
                    {existingFileName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {mode === 'version' ? 'Klik area ini untuk upload file baru' : 'File saat ini tersimpan • Klik untuk mengganti'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={isProcessing || (mode === 'version' && isCalculating)}
          className="h-11 min-w-[150px] bg-[#41A67E] text-sm font-bold text-white shadow-sm transition-all hover:bg-[#368f6b]"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memproses...
            </>
          ) : (
            mode === 'edit' ? 'Simpan Perubahan' : 'Terbitkan Versi Baru'
          )}
        </Button>
      </div>
    </form>
  )
}