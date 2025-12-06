import { ENV } from '@/constants/config'

export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${ENV.CLOUDINARY_CLOUD_NAME}/image/upload`

export const getCloudinaryUrl = (publicId: string) => {
  return `https://res.cloudinary.com/${ENV.CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`
}