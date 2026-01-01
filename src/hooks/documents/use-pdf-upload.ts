import { useState } from 'react'

interface UsePdfUploadReturn {
  file: File | null
  fileError: string | null
  setFile: (file: File | null) => void
  validatePdfFile: (file: File) => boolean
  handleFileChange: (selectedFile: File | null) => void
  handleDragOver: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent) => void
  resetFile: () => void
}

/**
 * Custom hook untuk menangani upload file PDF
 * Menerapkan validasi MIME type dan ekstensi file
 * Mendukung file picker dan drag & drop
 */
export function usePdfUpload(): UsePdfUploadReturn {
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  /**
   * Validasi file PDF berdasarkan MIME type dan ekstensi
   */
  const validatePdfFile = (file: File): boolean => {
    // Validasi tipe MIME
    if (file.type !== 'application/pdf') {
      setFileError('Hanya file PDF yang diperbolehkan')
      return false
    }
    
    // Validasi ekstensi file
    const fileName = file.name.toLowerCase()
    if (!fileName.endsWith('.pdf')) {
      setFileError('Hanya file dengan ekstensi .pdf yang diperbolehkan')
      return false
    }
    
    setFileError(null)
    return true
  }

  /**
   * Handler untuk perubahan file (dari file picker atau drag & drop)
   */
  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) {
      setFile(null)
      setFileError(null)
      return
    }

    if (validatePdfFile(selectedFile)) {
      setFile(selectedFile)
    } else {
      setFile(null)
    }
  }

  /**
   * Handler untuk drag over event
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  /**
   * Handler untuk drop event
   */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileChange(droppedFile)
    }
  }

  /**
   * Reset file dan error state
   */
  const resetFile = () => {
    setFile(null)
    setFileError(null)
  }

  return {
    file,
    fileError,
    setFile,
    validatePdfFile,
    handleFileChange,
    handleDragOver,
    handleDrop,
    resetFile
  }
}
