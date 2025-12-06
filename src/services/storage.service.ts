import { ENV } from '@/constants/config'
import { CLOUDINARY_UPLOAD_URL } from '@/lib/cloudinary/config'
import { UploadResponse } from '@/types'

export const storageService = {
  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', ENV.CLOUDINARY_UPLOAD_PRESET)

    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    return response.json()
  },
}