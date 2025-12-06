'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { adminCreateUser } from '@/actions/auth-admin'
import { Profile } from '@/types'
import { Loader2, Mail, User, Shield, CheckCircle } from 'lucide-react'

interface CreateUserModalProps {
  currentUser: Profile
  onSuccess: () => void
}

export function CreateUserModal({ currentUser, onSuccess }: CreateUserModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [tempResult, setTempResult] = useState<{email: string, pass: string} | null>(null)
  
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('user')

  const canCreateAdmin = currentUser.is_super_admin === true

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await adminCreateUser({ fullName, email, role })
      
      if (result.success && result.tempPassword) {
        setTempResult({ email, pass: result.tempPassword })
      } else {
        alert(result.error)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (tempResult) {
    return (
      <div className="space-y-6 py-4">
        <div className="rounded-xl bg-green-50 p-6 text-center border border-green-200">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-green-900">User Berhasil Dibuat</h3>
          <p className="text-sm font-medium text-green-800 mt-2">
            Email notifikasi berisi password sementara telah dikirimkan ke <strong>{tempResult.email}</strong>.
          </p>
        </div>

        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Password Sementara</p>
          <div className="mt-2 flex items-center justify-between rounded-md bg-gray-50 p-3 border border-gray-200">
            <code className="text-xl font-mono font-bold text-gray-900 tracking-wider">{tempResult.pass}</code>
            <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(tempResult.pass)}>
              Copy
            </Button>
          </div>
          <p className="mt-3 text-xs font-medium text-gray-500">
            *User wajib mengganti password ini saat login pertama kali.
          </p>
        </div>

        <Button onClick={onSuccess} className="w-full h-12 bg-[#41A67E] hover:bg-[#368f6b] text-base font-bold text-white">
          Selesai
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900">Nama Lengkap</label>
        <div className="relative">
          <Input 
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Dr. Nama Lengkap"
            className="pl-11 h-12 border-gray-300 bg-white text-base font-medium text-gray-900 focus:border-[#41A67E] focus:ring-[#41A67E]"
          />
          <User className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-500" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900">Alamat Email</label>
        <div className="relative">
          <Input 
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@rsup.com"
            className="pl-11 h-12 border-gray-300 bg-white text-base font-medium text-gray-900 focus:border-[#41A67E] focus:ring-[#41A67E]"
          />
          <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-500" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900">Role Akses</label>
        <div className="relative">
          <select
            className="h-12 w-full appearance-none rounded-md border border-gray-300 bg-white pl-11 px-4 text-base font-medium text-gray-900 focus:border-[#41A67E] focus:outline-none focus:ring-1 focus:ring-[#41A67E]"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User (Dokter/Staff)</option>
            {canCreateAdmin && <option value="admin">Admin</option>}
          </select>
          <Shield className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-500" />
        </div>
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-12 bg-[#41A67E] hover:bg-[#368f6b] text-base font-bold text-white shadow-md"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Buat User & Kirim Email'}
        </Button>
      </div>
    </form>
  )
}