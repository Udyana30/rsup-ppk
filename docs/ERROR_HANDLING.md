# Cara Menggunakan Error Handling System

## Untuk Developer

### 1. Menampilkan Error
```typescript
import { useError } from '@/contexts/error-context'

function MyComponent() {
  const { showError, showSuccess, showWarning, showInfo } = useError()

  const handleAction = async () => {
    try {
      // Your code here
      await someApiCall()
      showSuccess('Data berhasil disimpan')
    } catch (error) {
      showError(error) // Otomatis parse error dan tampilkan
    }
  }
}
```

### 2. Error Types yang Didukung

**Network Errors**: Otomatis terdeteksi
- Offline/Online status
- Fetch failures

**Supabase Errors**: Otomatis di-parse
- PGRST116: Data tidak ditemukan
- 23505: Data duplikat
- 23503: Referensi tidak valid
- 42501: Akses ditolak

**Custom Errors**:
```typescript
import { AppError } from '@/lib/error-handler'

throw new AppError('Pesan error custom', 'ERROR_CODE', 400)
```

### 3. Manual Notifications

```typescript
// Success
showSuccess('Operasi berhasil')

// Warning
showWarning('Perhatian: Data akan dihapus')

// Info
showInfo('Fitur baru tersedia')

// Error
showError(new Error('Terjadi kesalahan'))
```

## Fitur

✅ **Auto-dismiss**: Error hilang otomatis setelah 3-5 detik
✅ **Network monitoring**: Deteksi offline/online otomatis
✅ **User-friendly messages**: Error teknis diterjemahkan ke Bahasa Indonesia
✅ **Multiple errors**: Support queue multiple errors
✅ **Minimalis design**: Toast notification di pojok kanan atas
✅ **Type-safe**: Full TypeScript support

## Customization

Edit durasi auto-dismiss di `src/contexts/error-context.tsx`:
```typescript
setTimeout(() => {
  setErrors(prev => prev.filter(e => e.id !== errorMessage.id))
}, 5000) // Ubah durasi di sini (ms)
```
