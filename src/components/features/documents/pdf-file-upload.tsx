import { Input } from '@/components/ui/input'
import { CloudUpload, FileCheck, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PdfFileUploadProps {
    file: File | null
    fileError: string | null
    existingFileName?: string
    required?: boolean
    mode?: 'upload' | 'edit' | 'version'
    onFileChange: (file: File | null) => void
    onDragOver: (e: React.DragEvent) => void
    onDrop: (e: React.DragEvent) => void
}

export function PdfFileUpload({
    file,
    fileError,
    existingFileName,
    required = false,
    mode = 'upload',
    onFileChange,
    onDragOver,
    onDrop
}: PdfFileUploadProps) {
    const getHintText = () => {
        if (mode === 'version') {
            return 'Klik area ini atau drag & drop file PDF'
        }
        if (mode === 'edit') {
            return 'File saat ini tersimpan • Klik untuk mengganti'
        }
        return 'Klik area ini atau drag & drop file PDF untuk upload'
    }

    const getBorderStyle = () => {
        if (fileError) return 'border-red-300 bg-red-50'
        if (mode === 'version' && !file) return 'border-orange-300 bg-orange-50 hover:bg-orange-100'
        return 'border-gray-300 bg-gray-50 hover:border-[#41A67E] hover:bg-[#41A67E]/5'
    }

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
                {mode === 'version' ? 'Upload File Versi Baru' : mode === 'edit' ? 'File Dokumen' : 'Upload File PDF'}
            </label>

            <div
                className={cn(
                    "relative rounded-xl border-2 border-dashed p-6 text-center transition-all",
                    getBorderStyle()
                )}
                onDragOver={onDragOver}
                onDrop={onDrop}
            >
                <Input
                    type="file"
                    accept="application/pdf"
                    required={required}
                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                    onChange={(e) => onFileChange(e.target.files?.[0] || null)}
                />

                <div className="relative z-0 flex flex-col items-center gap-2">
                    <div className={cn(
                        "rounded-full p-3 shadow-sm ring-1",
                        file
                            ? "bg-[#41A67E]/10 ring-[#41A67E]/20"
                            : fileError
                                ? "bg-red-100 ring-red-200"
                                : "bg-white ring-gray-200"
                    )}>
                        {file ? (
                            <CloudUpload className="h-6 w-6 text-[#41A67E]" />
                        ) : fileError ? (
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        ) : (
                            <FileCheck className="h-6 w-6 text-gray-400" />
                        )}
                    </div>

                    <div className="flex flex-col items-center">
                        {fileError ? (
                            <>
                                <span className="text-sm font-bold text-red-600">{fileError}</span>
                                <span className="text-xs text-gray-500">Silakan pilih file PDF yang valid</span>
                            </>
                        ) : file ? (
                            <>
                                <span className="text-sm font-bold text-[#41A67E]">{file.name}</span>
                                <span className="text-xs text-gray-500">File baru terpilih • Klik untuk ganti</span>
                            </>
                        ) : (
                            <>
                                {existingFileName && (
                                    <span className="text-sm font-medium text-gray-900 line-clamp-1 max-w-[300px]">
                                        {existingFileName}
                                    </span>
                                )}
                                <span className="text-xs text-gray-500">{getHintText()}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {fileError && (
                <p className="text-xs text-red-600 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Hanya file PDF (.pdf) yang diperbolehkan untuk di-upload
                </p>
            )}
        </div>
    )
}
