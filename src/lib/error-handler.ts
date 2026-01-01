export type ErrorType = 'error' | 'warning' | 'info' | 'success'

export interface ErrorMessage {
  id: string
  type: ErrorType
  title: string
  message: string
  timestamp: number
}

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function parseError(error: unknown): { title: string; message: string } {
  // Network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      title: 'Koneksi Gagal',
      message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
    }
  }

  // Supabase errors
  if (error && typeof error === 'object' && 'code' in error) {
    const supabaseError = error as { code: string; message: string }
    
    // Common Supabase error codes
    switch (supabaseError.code) {
      case 'PGRST116':
        return {
          title: 'Data Tidak Ditemukan',
          message: 'Data yang Anda cari tidak tersedia.'
        }
      case '23505':
        return {
          title: 'Data Duplikat',
          message: 'Data dengan informasi yang sama sudah ada.'
        }
      case '23503':
        return {
          title: 'Referensi Tidak Valid',
          message: 'Data terkait tidak ditemukan.'
        }
      case '42501':
        return {
          title: 'Akses Ditolak',
          message: 'Anda tidak memiliki izin untuk melakukan aksi ini.'
        }
      default:
        return {
          title: 'Terjadi Kesalahan',
          message: supabaseError.message || 'Silakan coba lagi.'
        }
    }
  }

  // App errors
  if (error instanceof AppError) {
    return {
      title: 'Terjadi Kesalahan',
      message: error.message
    }
  }

  // Generic errors
  if (error instanceof Error) {
    return {
      title: 'Terjadi Kesalahan',
      message: error.message
    }
  }

  // Unknown errors
  return {
    title: 'Terjadi Kesalahan',
    message: 'Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.'
  }
}

export function generateErrorId(): string {
  return `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
