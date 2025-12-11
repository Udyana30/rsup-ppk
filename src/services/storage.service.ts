import { createClient } from '@/lib/supabase/client'
import { ENV } from '@/constants/config'
import { UploadResponse } from '@/types'

export const storageService = {
  async uploadFile(file: File): Promise<UploadResponse> {
    const supabase = createClient()

    const { data: signData, error: signError } = await supabase.functions.invoke('get-upload-signature', {
      body: { 
        uploadPreset: ENV.CLOUDINARY_UPLOAD_PRESET 
      }
    })

    if (signError) {
      throw new Error(signError.message || 'Failed to connect to signature server')
    }

    if (!signData?.signature || !signData?.timestamp || !signData?.apiKey) {
      throw new Error('Invalid signature response from server')
    }

    const { signature, timestamp, apiKey, cloudName } = signData

    const formData = new FormData()
    formData.append('file', file)
    formData.append('api_key', apiKey)
    formData.append('timestamp', timestamp.toString())
    formData.append('signature', signature)
    formData.append('upload_preset', ENV.CLOUDINARY_UPLOAD_PRESET)

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorDetail = await response.json()
      throw new Error(errorDetail.error?.message || 'Cloudinary upload failed')
    }

    return response.json()
  },
}