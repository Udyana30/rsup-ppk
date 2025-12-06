export const ENV = {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string,
    CLOUDINARY_UPLOAD_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_PRESET as string,
  } as const
  
  if (!ENV.SUPABASE_URL || !ENV.SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase Environment Variables')
  }
  
  if (!ENV.CLOUDINARY_CLOUD_NAME || !ENV.CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Missing Cloudinary Environment Variables')
  }